using AutoMapper;
using Common.Enums;
using DA.Entities;
using DTOs.Doctor_Programs;
using DTOs.Programs;
using DTOs.Specializations;
using DTOs.UnavailablePeriods;
using DTOs.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Mappers
{
    public class UnavailablePeriodMapper : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentPeriod;

        public UnavailablePeriodMapper(IMapper mapper, ClaimsPrincipal currentPeriod) : base(mapper)
        {
            CurrentPeriod = currentPeriod;
        }
        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<UnavailablePeriod, UnavailablePeriodDetailsDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.IdDoctor))
                .ForMember(dest => dest.StartingDay, opt => opt.MapFrom(src => src.StartingDay))
                .ForMember(dest => dest.EndingDay, opt => opt.MapFrom(src => src.EndingDay))
                .ForMember(dest => dest.ReasonId, opt => opt.MapFrom(src => src.IdReason));

            config.CreateMap<CreateUnavailablePeriodDTO, UnavailablePeriod>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.IdDoctor, opt => opt.MapFrom(src => src.DoctorId))
               .ForMember(dest => dest.StartingDay, opt => opt.MapFrom(src => src.StartingDay))
               .ForMember(dest => dest.EndingDay, opt => opt.MapFrom(src => src.EndingDay))
               .ForMember(dest => dest.IdReason, opt => opt.MapFrom(src => src.ReasonId));

        }
    }
}
