using AutoMapper;
using DA.Entities;
using DTOs.Degrees;
using DTOs.Specializations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Mappers
{
    public class DegreeMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentDegree;

        public DegreeMappers(IMapper mapper, ClaimsPrincipal currentDegree) : base(mapper)
        {
            CurrentDegree = currentDegree;
        }
        public override void Config(IMapperConfigurationExpression config)
        {

            config.CreateMap<DoctoralDegree, DegreeDetailsDTO>();

        }
    }
}
