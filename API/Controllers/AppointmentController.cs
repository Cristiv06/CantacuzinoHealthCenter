using API.Attributes;
using API.Hubs;
using BL.Services;
using Common.Enums;
using DTOs.Appointments;
using DTOs.Doctor_Programs;
using DTOs.Programs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using static BL.Services.AppointmentService;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("appointment")]
    public class AppointmentController : ControllerBase
    {
        private readonly AppointmentService AppointmentService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public AppointmentController(AppointmentService appointmentService, IHubContext<NotificationHub> hubContext)
        {
            AppointmentService = appointmentService;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("unavailable/{id}")]
        public async Task<List<DateTime>> GetUnavailableDays(Guid id)
        {
            return await AppointmentService.GetUnavailableDays(id);
        }

        [HttpGet]
        [Route("program/{doctorId}/{selectedDate}")]
        public async Task<ProgramDTO> GetDoctorProgramForSelectedDay(Guid doctorId, DateTime selectedDate)
        {
            return await AppointmentService.GetDoctorProgramForSelectedDay(doctorId, selectedDate);
        }

        [HttpPost]
        [Route("create")]
        public async Task<int> CreateAppointment(CreateAppointmentDTO appointmentDTO)
        {
             var res = await AppointmentService.CreateAppointment(appointmentDTO);
            if (res > 0)
            {
                await _hubContext.Clients.Group(appointmentDTO.DoctorId.ToString()).SendAsync("NewNotification");
            }
            try {
                return res;
            }
            catch (Exception ex)
            {
                return 0;
            }
           
        }

        [HttpGet]
        [Route("all")]
        public async Task<List<AppointmentDetailsDTO>> GetAppointmentList()
        {
            return await AppointmentService.GetAppointmentList();
        }

        [HttpPut]
        [Route("approve")]
        [Validate<AppointmentApprovalDTO>]
        public async Task<int> SetAppointmentState(AppointmentApprovalDTO appointmentDTO)
        {
            var res = await AppointmentService.SetAppointmentState(appointmentDTO);
            if (res.HasValue)
            {
                await _hubContext.Clients.Group(res.ToString()).SendAsync("NewNotification");
                return 1;
            }
            else
            {
                return 0;
            }

        }

        [HttpDelete]
        [Route("{appointmentId}")]
        public async Task<int?> DeleteAppointment(Guid appointmentId)
        {
            return await AppointmentService.DeleteAppontment(appointmentId);
        }

    }
}
