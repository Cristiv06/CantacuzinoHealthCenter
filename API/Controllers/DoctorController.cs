using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Doctors;
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
    [Route("doctor")]
    public class DoctorController : ControllerBase
    {
        private readonly DoctorService DoctorService;

        public DoctorController(DoctorService doctorService)
        {
            DoctorService = doctorService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<DoctorDetailsDTO?> GetDoctorId(Guid id)
        {
            return await DoctorService.GetDoctorById(id);
        }

        [HttpGet]
        [Route("profile/{id}")]
        public async Task<DoctorProfileDTO?> GetDoctorProfileById(Guid id)
        {
            return await DoctorService.GetDoctorProfileById(id);
        }


        [HttpPost]
        [Route("all")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<List<DoctorDetailsDTO>> GetDoctors(DoctorFilters doctorFilters)
        {
            return await DoctorService.GetDoctorList(doctorFilters);
        }



        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public async Task<int> DoctorRegister(RegisterDoctorDTO doctorDTO)
        {

            return await DoctorService.RegisterDoctor(doctorDTO);
        }

        [HttpPut]
        [Route("profile/update")]
        [Validate<UpdateDoctorDTO>]
        public async Task<int?> UpdateProfileDoctor(UpdateDoctorDTO doctorDTO)
        {
            return await DoctorService.UpdateProfileDoctor(doctorDTO);
        }

    }

   

}
