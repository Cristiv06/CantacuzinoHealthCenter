using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Degrees;
using DTOs.Doctors;
using DTOs.Query;
using DTOs.UnavailablePeriods;
using DTOs.UnavailableReasons;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("reason")]
    public class UnavailableReasonController
    {
        private readonly UnavailableResonService _unavailableResonService;

        public UnavailableReasonController(UnavailableResonService unavailableResonService)
        {
            _unavailableResonService = unavailableResonService;
        }


        [HttpPost]
        [Route("all")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<List<UnavailableReasonDetailsDTO>> GetUnavailableReasonList(QueryDTO<LikeValueFilterDTO, InValueListFilterDTO, BetweenValuesFilterDTO> query)
        {
            return await _unavailableResonService.GetReasonList(query);
        }

    }
}
