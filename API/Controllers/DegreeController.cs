using API.Attributes;
using BL.Services;
using Common.Enums;
using DTOs.Degrees;
using DTOs.Query;
using DTOs.Specializations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [APIEndpoint]
    [Route("degree")]
    public class DegreeController : ControllerBase
    {
        private readonly DegreeService DegreeService;

        public DegreeController(DegreeService degreeService)
        {
            DegreeService = degreeService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<DegreeDetailsDTO?> GetSpecializationById(int id)
        {
            return await DegreeService.GetSpecializationDetailsById(id);
        }

        [HttpPost]
        [Route("all")]
        [APIEndpoint(HttpMethodTypes.Get)]
        public async Task<List<DegreeDetailsDTO>> GetSpecializationsList(QueryDTO<LikeValueFilterDTO, InValueListFilterDTO, BetweenValuesFilterDTO> query)
        {
            return await DegreeService.GetSpecializationList(query);
        }

    }
}
