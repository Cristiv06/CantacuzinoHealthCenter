using AutoMapper;
using DA.Entities;
using DTOs.Appointments;
using DTOs.Doctors;
using DTOs.Notifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Mappers
{
    namespace DTOs.Mappers
    {
        public class NotificationMappers : BaseMapper
        {
            public readonly ClaimsPrincipal CurrentNotification;
            public NotificationMappers(IMapper mapper, ClaimsPrincipal currentNotification) : base(mapper)
            {
                CurrentNotification = currentNotification;
            }

            public override void Config(IMapperConfigurationExpression config)
            {
                config.CreateMap<Notification, NotificationDetailsDTO>()
                    .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.IdTypeNavigation.Message));

                config.CreateMap<NotificationDetailsDTO, Notification>();

                config.CreateMap<Notification, CreateNotificationDTO>();
                config.CreateMap<CreateNotificationDTO, Notification>()
                    .ForMember(dest => dest.NotifyDate, opt => opt.MapFrom(src => DateTime.Now));
            }
        }
    }

}
