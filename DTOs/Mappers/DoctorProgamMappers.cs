using AutoMapper;
using DA.Entities;
using DTOs.Doctor_Programs;
using DTOs.Patients;
using DTOs.Programs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Mappers
{
    public class DoctorProgamMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentProgram;
        public DoctorProgamMappers(IMapper mapper, ClaimsPrincipal currentProgram) : base(mapper)
        {
            CurrentProgram = currentProgram;
        }

        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<CreateProgramDTO, DoctorProgram>()
              .ForMember(dest => dest.IdDoctor, opt => opt.MapFrom(src => src.DoctorId))
              .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id == Guid.Empty ? Guid.NewGuid() : src.Id))
              .ForMember(dest => dest.DayOfWeek, opt => opt.MapFrom(src => src.DayOfWeek))
              .ForMember(dest => dest.StartingHour, opt => opt.MapFrom(src => src.StartingHour))
              .ForMember(dest => dest.EndingHour, opt => opt.MapFrom(src => src.EndingHour));


            config.CreateMap<DoctorProgram, DoctorProgramDetailsDTO>();

            config.CreateMap<DoctorProgram, DoctorProgramDTO>()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                 .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.IdDoctor))
                 .ForMember(dest => dest.StartingHour, opt => opt.MapFrom(src => src.StartingHour))
                 .ForMember(dest => dest.EndingHour, opt => opt.MapFrom(src => src.EndingHour))
                 .ForMember(dest => dest.DayOfWeek, opt => opt.MapFrom(src => src.DayOfWeek));


            config.CreateMap<DoctorProgramDTO, DoctorProgram>()
                .ForMember(dest => dest.IdDoctor, opt => opt.MapFrom(src => src.Id));
        }
    }
}
