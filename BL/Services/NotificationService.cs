using BL.UnitOfWork;
using Common.AppSettings;
using Common.Enums;
using Common.Interfaces;
using DA.Entities;
using DTOs.Appointments;
using DTOs.Notifications;
using DTOs.Patients;
using Microsoft.AspNetCore.Mvc;
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
    public class NotificationService : BaseService
    {

        private readonly ClaimsPrincipal _currentUser;
        private readonly MapperService Mapper;

        public NotificationService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUser) : base(unitOfWork, logger, appSettings)
        {
            _currentUser = currentUser;
            Mapper = mapper;
        }

        public async Task<List<NotificationDetailsDTO>> GetNotificationsByCurrentUser()
        {
            var currentUserId = _currentUser.Id();
            var notificationList = await UnitOfWork.Queryable<Notification>().Include(n => n.IdTypeNavigation).Where(u => u.IdUser == currentUserId).ToListAsync();
            return Mapper.Map<Notification, NotificationDetailsDTO>(notificationList);
        }

        public async Task<int> ReadNotification(NotificationReadDTO notification)
        {
            var readNotification = await UnitOfWork.Queryable<Notification>().FirstOrDefaultAsync(n => n.Id == notification.Id);
            if (readNotification != null)
            {
                readNotification.IsRead = notification.IsRead;
                UnitOfWork.Repository<Notification>().Update(readNotification);
            }
            return await Save();
        }

        public async Task<int> CreateNotification(CreateNotificationDTO createdNotification)
        {
            var user = await UnitOfWork.Queryable<User>().FirstOrDefaultAsync(u => u.Id == createdNotification.IdUser);
            var newNotification = Mapper.Map<CreateNotificationDTO, Notification>(createdNotification);
            if(user.RoleId == (short)Roles.Patient)
            {
               newNotification.IdType = (short)NotificationMessageTypeEnum.PatientMessage;
            }
            else
            {
                newNotification.IdType = (short)NotificationMessageTypeEnum.DoctorMessage;
            }
            await UnitOfWork.Repository<Notification>().AddAsync(newNotification);
            return await Save();
        }

    }
}
