using AutoMapper;
using DA.Entities;
using DTOs.Doctors;
using DTOs.Patients;
using DTOs.Specializations;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Mappers
{
    public class DoctorMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentDoctor;
        public DoctorMappers(IMapper mapper, ClaimsPrincipal currentDoctor) : base(mapper)
        {
            CurrentDoctor = currentDoctor;
        }

        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<RegisterDoctorDTO, Doctor>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DoctorId));

            config.CreateMap<Doctor, DoctorDetailsDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.DegreeName, opt => opt.MapFrom(src => src.IdDegreesNavigation.Name))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.IdNavigation.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.IdNavigation.LastName))
                .ForMember(dest => dest.PhotoId, opt => opt.MapFrom(src => src.IdNavigation.Pictures.FirstOrDefault().IdFile))
                .ForMember(dest => dest.SpecializationsList, opt =>
                opt.MapFrom(src => src.DoctorsSpecializations.Select(d => new SelectListItem
                {
                    Value = d.IdSpecialization.ToString(),
                    Text = d.IdSpecializationNavigation.Name
                })));


            config.CreateMap<Doctor, DoctorProfileDTO>()
              .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
              .ForMember(dest => dest.DegreeName, opt => opt.MapFrom(src => src.IdDegreesNavigation.Name))
              .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.IdNavigation.FirstName))
              .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.IdNavigation.LastName));

            config.CreateMap<VwDoctorList, DoctorDetailsDTO>();
        }
    }
}
