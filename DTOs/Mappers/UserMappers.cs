using AutoMapper;
using AutoMapper.Configuration.Conventions;
using Common.Enums;
using DA.Entities;
using DTOs.Doctors;
using DTOs.Users;
using System.Security.Claims;
using Utils;

namespace DTOs.Mappers
{
    public class UserMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentUser;

        public UserMappers(IMapper mapper, ClaimsPrincipal currentUser) : base(mapper)
        {
            CurrentUser = currentUser;
        }
        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<RegisterUserDTO, User>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.LastModifiedDate, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => (byte)Roles.Patient));

            config.CreateMap<RegisterBasicUserDTO, User>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
             .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.Now))
             .ForMember(dest => dest.LastModifiedDate, opt => opt.MapFrom(src => DateTime.Now))
             .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
             .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => (byte)Roles.Patient));

            config.CreateMap<UpdateUserDTO, User>()
                .ForMember(dest => dest.LastModifiedDate, opt => opt.MapFrom(src => DateTime.Now));

            config.CreateMap<User, UserFullDTO>()
               .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Patient.Age))
               .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Patient.Address))
               .ForMember(dest => dest.HealthIssues, opt => opt.MapFrom(src => src.Patient.HealthIssues));

            config.CreateMap<User, UserDetailsDTO>();


            config.CreateMap<User, UserListItemDTO>();

            config.CreateMap<RegisterDoctorFullDTO, User>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
             .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
             .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.Now))
             .ForMember(dest => dest.LastModifiedDate, opt => opt.MapFrom(src => DateTime.Now))
             .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
             .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => (byte)Roles.Doctor));


        }
    }
}
