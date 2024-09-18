using AutoMapper;
using DA.Entities;
using DTOs.Patients;
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
    public class PatientMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentPatient;
        public PatientMappers(IMapper mapper, ClaimsPrincipal currentPatient) : base(mapper)
        {
             CurrentPatient = currentPatient;
        }

        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<RegisterPatientDTO, Patient>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserId));

            config.CreateMap<Patient, PatientDetailsDTO>();
            config.CreateMap<Patient, PatientListItemDTO>();
        }
    }
}
