using AutoMapper;
using DA.Entities;
using DTOs.Appointments;
using DTOs.Reviews;
using System.Security.Claims;
using Utils;

namespace DTOs.Mappers
{
    public class AppointmentMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentAppointment;
        public AppointmentMappers(IMapper mapper, ClaimsPrincipal currentAppointment) : base(mapper)
        {
            CurrentAppointment = currentAppointment;
        }

        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<CreateAppointmentDTO, Appointment>()
              .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
              .ForMember(dest => dest.IdPacient, opt => opt.MapFrom(src => src.PatientId))
              .ForMember(dest => dest.IdDoctorSpecializations, opt => opt.Ignore())
              .ForMember(dest => dest.DateAndTime, opt => opt.MapFrom(src => src.DateAndTime))
              .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price));

            config.CreateMap<Appointment, AppointmentApprovalDTO>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
             .ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => src.IdPacient))
             .ForMember(dest => dest.IsApproved, opt => opt.MapFrom(src => src.IsApproved));

            config.CreateMap<Appointment, AppointmentDetailsDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.IdPacientNavigation.IdNavigation.FirstName))
            .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.IdDoctorSpecializationsNavigation.IdDoctorNavigation.IdNavigation.FirstName))
            .ForMember(dest => dest.DateAndTime, opt => opt.MapFrom(src => src.DateAndTime))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.IsCompleted, opt => opt.MapFrom(src => src.IsCompleted))
            .ForMember(dest => dest.IsApproved, opt => opt.MapFrom(src => src.IsApproved))
            .ForMember(dest => dest.AppointmentFiles, opt => opt.MapFrom(src => src.AppointmentDocuments.Select(d => new AppoinementFileDTO()
            {
                Id = d.IdFileNavigation.Id,
                FileName = d.IdFileNavigation.FileName,
            }
            )))
           .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews.Select(r => new CreateReviewDTO
           {
               Id = r.Id,                  
               IdPatient = r.IdPacient,
               IdAppointment = r.IdAppointment,
               Rating = r.Rating,
               ReviewMessage = r.ReviewMessage
           }).ToList()));

        }
    }
}
