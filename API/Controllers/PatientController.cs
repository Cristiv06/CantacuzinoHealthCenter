using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Patients;
using DTOs.Query;
using DTOs.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("patient")]
    public class PatientController: ControllerBase
    {
        private readonly PatientService PatientService;

        public PatientController(PatientService patientService)
        {
            PatientService = patientService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<PatientDetailsDTO?> GetPatientById(Guid id)
        {
            return await PatientService.GetPatientDetailsById(id);
        }

        [HttpPost]
        [Route("all")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<List<PatientListItemDTO>> GetPatients(QueryDTO<LikeValueFilterDTO, InValueListFilterDTO, BetweenValuesFilterDTO> query)
        {
            return await PatientService.GetPatientList();
        }

        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        [Validate<RegisterPatientDTO>]
        public async Task<int> PatientRegister(RegisterPatientDTO patientDTO)
        {

            return await PatientService.RegisterPatient(patientDTO);
        }

        [HttpPut]
        [Route("update")]
        [Validate<UpdatePatientDTO>]
        public async Task<int?> UpdatePatient(UpdatePatientDTO patientDTO)
        {
            return await PatientService.UpdatePatient(patientDTO);
        }

        [HttpDelete]
        [Route("delete/{patientId}")]
        public async Task<int?> DeletePatient(Guid patientId)
        {
            return await PatientService.DeletePatient(patientId);
        }

        [HttpGet]
        [Route("profile/{id}")]
        public async Task<PatientProfileDTO?> GetPatientProfile(Guid id)
        {
            return await PatientService.GetPatientProfileById(id);
        }

        [HttpPut]
        [Route("profile/update")]
        [Validate<UpdateProfileDTO>]
        public async Task<int?> UpdateProfile([FromForm] UpdateProfileDTO patientDTO)
        {
            return await PatientService.UpdateProfilePatient(patientDTO);
        }
    }
}
