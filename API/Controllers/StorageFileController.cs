using API.Attributes;
using BL.Services;
using Common.Implementations;
using DTOs.Appointments;
using DTOs.Pictures;
using DTOs.Specializations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("storage")]
    public class StorageFileController: ControllerBase
    {
        private readonly StorageFileService _storageFileService;

        public StorageFileController(StorageFileService storageFileService)
        {
            _storageFileService = storageFileService;
        }

        [HttpPost]
        [Route("upload")]
        public async Task<string> UploadAppointmentDocument([FromForm]AppointmentFileDTO appointmentFileDTO)
        {
            if (appointmentFileDTO.File == null || appointmentFileDTO.File.Length == 0)
            {
                return null;
            }
            var stringFileUrl = await _storageFileService.UploadAppointmentDocument(appointmentFileDTO);
            return stringFileUrl;
        }

        [HttpGet]
        [Route("download/{fileId}")]
        [APIEndpoint(sendRawResult: true)]
        public async Task<FileResult> DownloadAppointmentDocument(Guid fileId)
        {
            var file = await _storageFileService.DownloadDocument(fileId);
            Response.ContentType = file.FileContentType;
            Response.Headers.Append("Access-Control-Expose-Headers", "Content-Disposition");
            Response.Headers.Append("Content-Disposition", $"attachment;filename=\"{file.FileName}\"");

            return File(file.FileContent, file.FileContentType, file.FileName);
        }

        [HttpPost]
        [Route("user/picture")]
        public async Task<string> UploadUserPicture([FromForm] PictureUserDTO pictureUserDTO)
        {
            if (pictureUserDTO.File == null || pictureUserDTO.File.Length == 0)
            {
                return null;
            }
            var stringFileUrl = await _storageFileService.UploadUserPicture(pictureUserDTO);
            return stringFileUrl;
        }

        [HttpPost]
        [Route("specialization/picture")]
        public async Task<string> UploadSpecializationPicture([FromForm] SpecializationPictureDTO specializationPictureDTO)
        {
            if (specializationPictureDTO.File == null || specializationPictureDTO.File.Length == 0)
            {
                return null;
            }
            var stringFileUrl = await _storageFileService.UploadSpecializationPicture(specializationPictureDTO);
            return stringFileUrl;
        }


    }
}
