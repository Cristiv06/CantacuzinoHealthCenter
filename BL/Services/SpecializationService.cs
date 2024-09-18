using AutoMapper;
using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Doctors;
using DTOs.Specializations;
using DTOs.Users;
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
    public class SpecializationService : BaseService
    {
        private readonly ClaimsPrincipal CurrentService;
        private readonly MapperService Mapper;

        public SpecializationService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentService) : base(unitOfWork, logger, appSettings)
        {
            CurrentService = currentService;
            Mapper = mapper;
        }

        public async Task<SpecializationDetailsDTO?> GetSpecializationDetailsById(int id)
        {
            var specialization = await UnitOfWork.Queryable<Specialization>().FirstOrDefaultAsync(s => s.Id == id);
            if (specialization == null)
            {
                return null;
            }
            return Mapper.Map<Specialization, SpecializationDetailsDTO>(specialization);
        }

        public async Task<List<SpecializationDetailsDTO>> GetSpecializationList(IQueryBuilder query)
        {
            var specializationList = await UnitOfWork.Queryable<Specialization>().ToListAsync(); //????.Include(d => d.Pictures)
            return Mapper.Map<Specialization, SpecializationDetailsDTO>(specializationList);
        }
    }
}
