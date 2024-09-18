using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Appointments;
using DTOs.Query;
using DTOs.Reviews;
using DTOs.Specializations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("review")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService ReviewService;

        public ReviewController(ReviewService reviewService)
        {
            ReviewService = reviewService;
        }

        [HttpPost]
        [Route("create")]
        public async Task<int> LeaveReview(CreateReviewDTO createReviewDTO)
        {
            var res = await ReviewService.LeaveReview(createReviewDTO);
            return res;
        }



    }
}
