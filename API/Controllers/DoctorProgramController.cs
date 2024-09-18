using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Doctor_Programs;
using DTOs.Doctors;
using DTOs.Notifications;
using DTOs.Patients;
using DTOs.Programs;
using DTOs.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("program")]
    public class DoctorProgramController : ControllerBase
    {
        private readonly DoctorProgramService DoctorProgramService;

        public DoctorProgramController(DoctorProgramService doctorProgramService)
        {
            DoctorProgramService = doctorProgramService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<DoctorProgramDTO?> GetProgramById(Guid id)
        {
            return await DoctorProgramService.GetProgramDetailsById(id);
        }


        [HttpGet]
        [Route("doctor")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<DoctorProgramDetailsDTO> GetProgramByDoctorId()
        {
            return await DoctorProgramService.GetProgramByCurrentDoctor();
        }

        [HttpPost]
        [Route("create")]
        [AllowAnonymous]
        public async Task<int> CreateDoctorProgram(CreateProgramDetailsDTO programDTO)
        {

            return await DoctorProgramService.CreateUpdateDoctorProgram(programDTO);
        }

        [HttpDelete]
        [Route("delete/{programId}")]
        public async Task<int?> DeleteProgram(Guid programId)
        {
            return await DoctorProgramService.DeleteProgram(programId);
        }

    }
}
