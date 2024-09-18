using API.Attributes;
using API.Hubs;
using BL.Services;
using Common.Enums;
using DTOs.Appointments;
using DTOs.Doctors;
using DTOs.Notifications;
using DTOs.Patients;
using DTOs.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService NotificationService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationController(NotificationService notificationService, IHubContext<NotificationHub> hubContext)
        {
            NotificationService = notificationService;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("all")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<List<NotificationDetailsDTO>> GetNotificationsByCurrentUser()
        {
            return await NotificationService.GetNotificationsByCurrentUser();
        }

        [HttpPut]
        [Route("read")]
        [Validate<NotificationReadDTO>]
        public async Task<int> ReadNotification(NotificationReadDTO notificationDTO)
        {
            return await NotificationService.ReadNotification(notificationDTO);
        }

        [HttpPost]
        [Route("add")]
        public async Task<int> AddNotification(CreateNotificationDTO newNotification)
        {
            var res = await NotificationService.CreateNotification(newNotification);
            if (res == 1)
            {
                await _hubContext.Clients.Group(newNotification.IdUser.ToString()).SendAsync("NewNotification");
            }
            return res;
        }
    }
}
