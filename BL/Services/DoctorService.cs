using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Doctors;
using DTOs.Patients;
using DTOs.Users;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using DTOs.Specializations;
using Google.Apis.Storage.v1;
using Microsoft.AspNetCore.Http;


namespace BL.Services
{
    public class DoctorService : BaseService
    {
        private readonly ClaimsPrincipal CurrentDoctor;
        private readonly MapperService Mapper;
        private readonly StorageService _storageService;

        public DoctorService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentDoctor, StorageService storageService) : base(unitOfWork, logger, appSettings)
        {
            CurrentDoctor = currentDoctor;
            Mapper = mapper;
            _storageService = storageService;
        }

        public async Task<DoctorDetailsDTO?> GetDoctorById(Guid id)
        {
            var doctor = await UnitOfWork.Queryable<Doctor>().FirstOrDefaultAsync(d => d.Id == id);
            if (doctor == null)
            {
                return null;
            }
            return Mapper.Map<Doctor, DoctorDetailsDTO>(doctor);
        }

        public async Task<DoctorProfileDTO?> GetDoctorProfileById(Guid id)
        {
            var doctor = await UnitOfWork.Queryable<Doctor>()
                .Include(d => d.IdNavigation)
                .Include(d => d.IdDegreesNavigation)
                .Include(d => d.IdNavigation)
                    .ThenInclude(u => u.Pictures)
                .Include(d => d.DoctorsSpecializations)
                    .ThenInclude(s => s.IdSpecializationNavigation)
                .FirstOrDefaultAsync(d => d.Id == id);
            if (doctor == null)
            {
                return null;
            }
            var doctorMapped = Mapper.Map<Doctor, DoctorProfileDTO>(doctor);
            doctorMapped.SpecializationsList = doctor.DoctorsSpecializations.Select(s => new SpecializationPriceDTO
            {
                Id = s.IdSpecializationNavigation.Id,
                DoctorSpecializationsId = s.Id,
                CustomPrice = s.IdSpecializationNavigation.DoctorsSpecializations.Where(d => d.IdDoctor == s.IdDoctor).FirstOrDefault().CustomPrice
            }).ToList();
            return doctorMapped;
        }

        public async Task<List<DoctorDetailsDTO>> GetDoctorList(DoctorFilters doctorFilters)
        {

            var dynamicQuery = UnitOfWork.Queryable<Doctor>()
                 .Include(d => d.IdDegreesNavigation)
                 .Include(d => d.DoctorsSpecializations)
                 .ThenInclude(d => d.IdSpecializationNavigation)
                 .Include(d => d.IdNavigation)
                    .ThenInclude(u => u.Pictures)
                 .AsQueryable();

            if (!string.IsNullOrEmpty(doctorFilters.NameFilter))
            {
                dynamicQuery = dynamicQuery.Where(d => d.IdNavigation.LastName.Contains(doctorFilters.NameFilter));
            }

            switch (doctorFilters.SortBy)
            {
                case "Degree":
                    dynamicQuery = doctorFilters.SortDesc ? dynamicQuery.OrderByDescending(d => d.IdDegreesNavigation.Name) : dynamicQuery.OrderBy(d => d.IdDegreesNavigation.Name);
                    break;
                case "Name":
                    dynamicQuery = doctorFilters.SortDesc ? dynamicQuery.OrderByDescending(d => d.IdNavigation.LastName) : dynamicQuery.OrderBy(d => d.IdNavigation.LastName);
                    break;
                default:
                    dynamicQuery = doctorFilters.SortDesc ? dynamicQuery.OrderByDescending(d => d.IdNavigation.LastName) : dynamicQuery.OrderBy(d => d.IdNavigation.LastName);
                    break;
            }

            if (doctorFilters.SpecializationIdFilter != null)
            {
                dynamicQuery = dynamicQuery.Where(d => d.DoctorsSpecializations.Any(s => s.IdSpecialization == doctorFilters.SpecializationIdFilter));
            }

            if (doctorFilters.DegreeIdFilter != null)
            {
                dynamicQuery = dynamicQuery.Where(d => d.IdDegrees == doctorFilters.DegreeIdFilter);
            }

            dynamicQuery = dynamicQuery.Skip(doctorFilters.Skip).Take(doctorFilters.Take);

            return Mapper.Map<Doctor, DoctorDetailsDTO>(await dynamicQuery.ToListAsync());
        }

        public async Task<int?> UpdateProfileDoctor(UpdateDoctorDTO updatedDoctor)
        {

            var dbUser = await UnitOfWork.Queryable<User>()
               .Include(u => u.Doctor)
               .FirstOrDefaultAsync(u => u.Id == updatedDoctor.Id);

            var doctorSpecialization = await UnitOfWork.Queryable<DoctorsSpecialization>()
           .Where(s => s.IdDoctor == updatedDoctor.Id).ToListAsync();

            if (dbUser == null || dbUser.Doctor == null)
            {
                return null;
            }

            if (dbUser.Doctor != null)
            {
                if (updatedDoctor.Photo != null)
                {
                    await UploadPicture(dbUser.Id, updatedDoctor.Photo);
                }
            }

            var newSpecializations = updatedDoctor.SpecializationsList.Where(s => !doctorSpecialization.Any(d => d.Id == s.DoctorSpecializationsId)).ToList();

            if (newSpecializations.Any())
            {
                foreach (var specialization in newSpecializations)
                {
                    var newSpecialization = Mapper.Map<SpecializationPriceDTO, DoctorsSpecialization>(specialization);
                    newSpecialization.IdDoctor = updatedDoctor.Id;
                    UnitOfWork.Repository<DoctorsSpecialization>().Add(newSpecialization);
                }
            }

            var existingSpecializations = updatedDoctor.SpecializationsList.Where(s => doctorSpecialization.Any(d => d.Id == s.DoctorSpecializationsId)).ToList();

            if (existingSpecializations.Any())
            {
                foreach (var specialization in existingSpecializations)
                {
                    var updatedSpecialization = doctorSpecialization.FirstOrDefault(s => s.Id == specialization.DoctorSpecializationsId);
                    updatedSpecialization.CustomPrice = specialization.CustomPrice;
                    UnitOfWork.Repository<DoctorsSpecialization>().Update(updatedSpecialization);
                }
            }
                return await Save();

        }

        public async Task<int> RegisterDoctor(RegisterDoctorDTO newDoctor)
        {
            var newDbDoctor = Mapper.Map<RegisterDoctorDTO, Doctor>(newDoctor);
            UnitOfWork.Repository<Doctor>().Add(newDbDoctor);
            return await Save();
        }

        public async Task<int?> DeleteDoctor(Guid doctorId)
        {
            var dbDoctor = await UnitOfWork.Queryable<Doctor>().FirstOrDefaultAsync(d => d.Id == doctorId);
            if (dbDoctor == null)
            {
                return null;
            }
            UnitOfWork.Repository<Doctor>().Remove(dbDoctor);

            return await Save();
        }

        private async Task UploadPicture(Guid userId, IFormFile picture)
        {
            var idFile = Guid.NewGuid();
            string fileURL = await _storageService.UploadFile(picture, idFile, picture.FileName);

            var newUserPicture = new StorageFile()
            {
                Id = idFile,
                FileUrl = fileURL,
                FileSize = (int)picture.Length,
                FileType = picture.ContentType,
                FileName = picture.FileName,
            };

            var pictures = await UnitOfWork.Queryable<Picture>()
                .Include(p => p.IdFileNavigation)
                .Where(p => p.IdUser == userId)
                .ToListAsync();

            if (pictures.Count > 0)
            {
                UnitOfWork.Repository<Picture>().RemoveRange(pictures);
            }

            UnitOfWork.Repository<StorageFile>().Add(newUserPicture);
            UnitOfWork.Repository<Picture>().Add(new Picture()
            {
                Id = Guid.NewGuid(),
                IdUser = userId,
                IdFile = idFile
            });
        }
    }
}
