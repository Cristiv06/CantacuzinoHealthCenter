using AutoMapper;
using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Patients;
using DTOs.Pictures;
using DTOs.Users;
using Google.Apis.Storage.v1;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace BL.Services
{
    public class PatientService : BaseService
    {
        private readonly ClaimsPrincipal CurrentPatient;
        private readonly MapperService Mapper;
        private readonly StorageService _storageService;

        public PatientService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentPatient, StorageService storageService) : base(unitOfWork, logger, appSettings)
        {
            CurrentPatient = currentPatient;
            Mapper = mapper;
            _storageService = storageService;
        }


        public async Task<PatientDetailsDTO?> GetPatientDetailsById(Guid id)
        {
            var patient = await UnitOfWork.Queryable<Patient>().FirstOrDefaultAsync(p => p.Id == id);
            if (patient == null)
            {
                return null;
            }
            return Mapper.Map<Patient, PatientDetailsDTO>(patient);
        }

        public async Task<List<PatientListItemDTO>> GetPatientList()
        {
            var patientList = await UnitOfWork.Queryable<Patient>().ToListAsync();
            return Mapper.Map<Patient, PatientListItemDTO>(patientList);
        }

        public async Task<int> RegisterPatient(RegisterPatientDTO newPatient)
        {
            var newDbPatient = Mapper.Map<RegisterPatientDTO, Patient>(newPatient);
            UnitOfWork.Repository<Patient>().Add(newDbPatient);
            return await Save();
        }

        public async Task<int?> UpdatePatient(UpdatePatientDTO updatedPatient)
        {
            var dbPatient = await UnitOfWork.Queryable<Patient>().FirstOrDefaultAsync(u => u.Id == updatedPatient.Id);
            if (dbPatient == null)
            {
                return null;
            }

            dbPatient = Mapper.Map(updatedPatient, dbPatient);

            UnitOfWork.Repository<Patient>().Update(dbPatient);

            return await Save();
        }

        public async Task<int?> DeletePatient(Guid patientId)
        {
            var dbPatient = await UnitOfWork.Queryable<Patient>().FirstOrDefaultAsync(p => p.Id == patientId);
            if (dbPatient == null)
            {
                return null;
            }
            UnitOfWork.Repository<Patient>().Remove(dbPatient);

            return await Save();
        }

        public async Task<PatientProfileDTO?> GetPatientProfileById(Guid id)
        {
            var patient = await UnitOfWork.Queryable<User>()
                .Include(u => u.Patient)
                .Include(u => u.Pictures)
                .Select(u => new PatientProfileDTO
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Age = u.Patient.Age,
                    Address = u.Patient.Address,
                    HealthIssues = u.Patient.HealthIssues,
                    PhotoId = u.Pictures.ToList()[0].IdFile
                }).FirstOrDefaultAsync(u => u.Id == id);

            return patient;
        }

        public async Task<int?> UpdateProfilePatient(UpdateProfileDTO updatedPatient)
        {
            var dbUser = await UnitOfWork.Queryable<User>()
                .Include(u => u.Patient)
                .FirstOrDefaultAsync(u => u.Id == updatedPatient.Id);
            if(dbUser == null || dbUser.Patient == null)
            {
                return null;
            }
            if (dbUser.Patient != null)
            {
                if(updatedPatient.Photo != null)
                {
                    await UploadPicture(dbUser.Id, updatedPatient.Photo);
                }

                dbUser.Patient.Address = updatedPatient.Address;
                dbUser.Patient.HealthIssues = updatedPatient.HealthIssues;
                dbUser.LastModifiedBy = CurrentPatient.Id();
                dbUser.LastModifiedDate = DateTime.Now;
                UnitOfWork.Repository<User>().Update(dbUser);
                UnitOfWork.Repository<Patient>().Update(dbUser.Patient);
            }
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
