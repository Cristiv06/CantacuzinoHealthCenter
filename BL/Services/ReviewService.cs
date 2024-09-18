using BL.UnitOfWork;
using Common.AppSettings;
using Microsoft.Extensions.Logging;
using Google.Apis.Storage.v1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;
using DA.Entities;
using DTOs.Reviews;
using Microsoft.EntityFrameworkCore;

namespace BL.Services
{
    public class ReviewService : BaseService
    {
        private readonly ClaimsPrincipal CurrentUser;
        private readonly MapperService Mapper;

        public ReviewService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUser) : base(unitOfWork, logger, appSettings)
        {
            Mapper = mapper;
            CurrentUser = currentUser;
        }

        public async Task<int> LeaveReview(CreateReviewDTO reviewDto)
        {
            var appointment = await UnitOfWork.Queryable<Appointment>()
                .Where(a => a.Id == reviewDto.IdAppointment)
                .FirstOrDefaultAsync();

            if (appointment == null)
            {
                return 0; 
            }

            var existingReview = await UnitOfWork.Queryable<Review>()
                .Where(r => r.IdAppointment == reviewDto.IdAppointment && r.IdPacient == reviewDto.IdPatient)
                .FirstOrDefaultAsync();

            if (existingReview != null)
            {
                return 0; 
            }

            var reviewEntity = new Review
            {
                Id = Guid.NewGuid(),
                IdPacient = reviewDto.IdPatient,
                IdAppointment = reviewDto.IdAppointment,
                Rating = reviewDto.Rating,
                ReviewMessage = reviewDto.ReviewMessage
            };

            UnitOfWork.Repository<Review>().Add(reviewEntity);
            var res = await Save();
            return res;
        }

    }
}
