using AutoMapper;
using DA.Entities;
using DTOs.UnavailablePeriods;
using DTOs.UnavailableReasons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Mappers
{
    public class UnavailableReasonMapper : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentReason;

        public UnavailableReasonMapper(IMapper mapper, ClaimsPrincipal currentReason) : base(mapper)
        {
            CurrentReason = currentReason;
        }
        public override void Config(IMapperConfigurationExpression config)
        {

            config.CreateMap<UnavailableReason, UnavailableReasonDetailsDTO>();
          
            config.CreateMap<UnavailableReasonDetailsDTO, UnavailableReason>();
               
        }

    }
}
