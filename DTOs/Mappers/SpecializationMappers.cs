using AutoMapper;
using Common.Enums;
using DA.Entities;
using DTOs.Specializations;
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
    public class SpecializationMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentSpecialization;

        public SpecializationMappers(IMapper mapper, ClaimsPrincipal currentSpecialization) : base(mapper)
        {
            CurrentSpecialization = currentSpecialization;
        }
        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<Specialization, SpecializationDetailsDTO>();
/*                .ForMember(dest => dest.IdPicture, opt => opt.MapFrom(src => src.Pictures))*/

            config.CreateMap<SpecializationPriceDTO, DoctorsSpecialization>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DoctorSpecializationsId == null ? Guid.NewGuid() : src.DoctorSpecializationsId))
                .ForMember(dest => dest.IdSpecialization, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CustomPrice, opt => opt.MapFrom(src => src.CustomPrice));
        }
    }
}
