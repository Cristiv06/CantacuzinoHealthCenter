using AutoMapper;
using DA.Entities;
using DTOs.Patients;
using DTOs.Reviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Mappers
{
    public class ReviewMappers : BaseMapper
    {
        public readonly ClaimsPrincipal CurrentReview;
        public ReviewMappers(IMapper mapper, ClaimsPrincipal currentReview) : base(mapper)
        {
            CurrentReview = currentReview;
        }

        public override void Config(IMapperConfigurationExpression config)
        {
            config.CreateMap<CreateReviewDTO, Review>();

            config.CreateMap<Review, CreateReviewDTO>();
        }
    }
}
