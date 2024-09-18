using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Appointments;
using DTOs.Degrees;
using DTOs.Pictures;
using DTOs.Specializations;
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
    public class StorageFileService : BaseService
    {
        private readonly ClaimsPrincipal CurrentUser;
        private readonly MapperService Mapper;
        private readonly StorageService _storageService;

        public StorageFileService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUser, StorageService service) : base(unitOfWork, logger, appSettings)
        {
            CurrentUser = currentUser;
            Mapper = mapper;
            _storageService = service;
        }

        public async Task<string> UploadAppointmentDocument(AppointmentFileDTO appointmentFileDTO)
        {
            var idFile = Guid.NewGuid();
            string fileURL = await _storageService.UploadFile(appointmentFileDTO.File, idFile, appointmentFileDTO.File.FileName);

            var newAppDocument = new StorageFile()
            {
                Id = idFile,
                FileUrl = fileURL,
                FileSize = (int)appointmentFileDTO.File.Length,
                FileType = appointmentFileDTO.File.ContentType,
                FileName = appointmentFileDTO.File.FileName,
            };

            var app = UnitOfWork.Queryable<Appointment>().FirstOrDefault(a => a.Id == appointmentFileDTO.IdAppointment);
            if (app == null)
            {
                return null;
            }
            UnitOfWork.Repository<StorageFile>().Add(newAppDocument);
            UnitOfWork.Repository<AppointmentDocument>().Add(new AppointmentDocument()
            {
                Id = Guid.NewGuid(),
                IdAppointment = appointmentFileDTO.IdAppointment,
                IdFile = idFile
            });
            await Save();
            return fileURL;
        }

        public async Task<DownloadFileDTO> DownloadDocument(Guid fileId)
        {
            var file = await UnitOfWork.Queryable<StorageFile>().FirstOrDefaultAsync(d => d.Id == fileId);
            var fileContent = await _storageService.DownloadFile(file.FileUrl, file.FileType, file.FileName);
            return new DownloadFileDTO()
            {
                FileContent = fileContent,
                FileContentType = file.FileType,
                FileName = file.FileName,
            };       
        }


        public async Task<string> UploadUserPicture(PictureUserDTO pictureUserDTO)
        {
            var idFile = Guid.NewGuid();
            string fileURL = await _storageService.UploadFile(pictureUserDTO.File, idFile, pictureUserDTO.File.FileName);

            var newUserPicture = new StorageFile()
            {
                Id = idFile,
                FileUrl = fileURL,
                FileSize = (int)pictureUserDTO.File.Length,
                FileType = pictureUserDTO.File.ContentType,
                FileName = pictureUserDTO.File.FileName,
            };

            var app = UnitOfWork.Queryable<User>().FirstOrDefault(a => a.Id == pictureUserDTO.IdUser);
            if (app == null)
            {
                return null;
            }
            UnitOfWork.Repository<StorageFile>().Add(newUserPicture);
            UnitOfWork.Repository<Picture>().Add(new Picture()
            {
                Id = Guid.NewGuid(),
                IdUser = pictureUserDTO.IdUser,
                IdFile = idFile
            });

            return fileURL;
        }

        public async Task<string> UploadSpecializationPicture(SpecializationPictureDTO specializationPictureDTO)
        {
            var idFile = Guid.NewGuid();
            string fileURL = await _storageService.UploadFile(specializationPictureDTO.File, idFile, specializationPictureDTO.File.FileName);

            var newUserPicture = new StorageFile()
            {
                Id = idFile,
                FileUrl = fileURL,
                FileSize = (int)specializationPictureDTO.File.Length,
                FileType = specializationPictureDTO.File.ContentType,
                FileName = specializationPictureDTO.File.FileName,
            };

            var app = UnitOfWork.Queryable<Specialization>().FirstOrDefault(a => a.Id == specializationPictureDTO.IdSpecialization);
            if (app == null)
            {
                return null;
            }
            UnitOfWork.Repository<StorageFile>().Add(newUserPicture);
            UnitOfWork.Repository<Picture>().Add(new Picture()
            {
                Id = Guid.NewGuid(),
                IdSpecialization = specializationPictureDTO.IdSpecialization,
                IdFile = idFile
            });

            return fileURL;
        }

        //downloadFile(idfile)
    }
}
