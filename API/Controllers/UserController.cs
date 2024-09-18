using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Doctors;
using DTOs.Query;
using DTOs.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly UserService UserService;

        public UserController(UserService userService)
        {
            UserService = userService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<UserFullDTO?> GetUserById(Guid id)
        {
            return await UserService.GetUserDetailsById(id);
        }
        [HttpPost]
        [Route("all")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<List<UserListItemDTO>> GetUsers(QueryDTO<LikeValueFilterDTO, InValueListFilterDTO, BetweenValuesFilterDTO> query)
        {
            return await UserService.GetUserList(query);
        }
        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        [Validate<RegisterUserDTO>]
        public async Task<int> RegisterUser(RegisterUserDTO userDTO)
        {
            
            return await UserService.RegisterUser(userDTO);
        }

        [HttpPost]
        [Route("register/doctor")]
        [Validate<RegisterDoctorFullDTO>]
        public async Task<int> RegisterDoctor(RegisterDoctorFullDTO doctorDTO)
        {

            return await UserService.RegisterDoctor(doctorDTO);
        }


        [HttpPost]
        [Route("register/basic")]
        [AllowAnonymous]
        [Validate<RegisterBasicUserDTO>]
        public async Task<int> RegisterBasicUser(RegisterBasicUserDTO userDTO)
        {

            return await UserService.RegisterBasicUser(userDTO);
        }


        [HttpPut]
        [Route("user")]
        [Validate<UpdateUserDTO>]
        public async Task<int?> UpdateUser(UpdateUserDTO userDTO)
        {
            return await UserService.UpdateUser(userDTO);
        }
        [HttpPut]
        [Route("deactivate/{userId}")]
        //[CheckRole(Roles.Admin)]
        public async Task<int?> DeactivateUser(Guid userId)
        {
            return await UserService.DeactivateUser(userId);
        }
        [HttpDelete]
        [Route("{userId}")]
        [CheckRole(Roles.Admin)]
        public async Task<int?> DeleteUser(Guid userId)
        {
            return await UserService.DeleteUser(userId);
        }
    }
}
