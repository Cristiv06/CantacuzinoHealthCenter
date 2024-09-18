using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Degrees;
using DTOs.Specializations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace BL.Services
{
    public class DegreeService: BaseService
    {
        private readonly ClaimsPrincipal CurrentService;
        private readonly MapperService Mapper;

        public DegreeService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentService) : base(unitOfWork, logger, appSettings)
        {
            CurrentService = currentService;
            Mapper = mapper;
        }

        public async Task<DegreeDetailsDTO?> GetSpecializationDetailsById(int id)
        {
            var degree = await UnitOfWork.Queryable<DoctoralDegree>().FirstOrDefaultAsync(d => d.Id == id);
            if (degree == null)
            {
                return null;
            }
            return Mapper.Map<DoctoralDegree, DegreeDetailsDTO>(degree);
        }

        public async Task<List<DegreeDetailsDTO>> GetSpecializationList(IQueryBuilder query)
        {
            var degreeList = await UnitOfWork.Queryable<DoctoralDegree>().ToListAsync();
            return Mapper.Map<DoctoralDegree, DegreeDetailsDTO>(degreeList);
        }
    }
}
