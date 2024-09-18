using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Query;
using DTOs.Specializations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("specialization")]
    public class SpecializationController : ControllerBase
    {
        private readonly SpecializationService SpecializationService;

        public SpecializationController(SpecializationService specializationService)
        {
            SpecializationService = specializationService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<SpecializationDetailsDTO?> GetSpecializationById(int id)
        {
            return await SpecializationService.GetSpecializationDetailsById(id);
        }

        [HttpPost]
        [Route("all")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<List<SpecializationDetailsDTO>> GetSpecializationsList(QueryDTO<LikeValueFilterDTO, InValueListFilterDTO, BetweenValuesFilterDTO> query)
        {
            return await SpecializationService.GetSpecializationList(query);
        }
        
    }
}
