using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Degrees;
using DTOs.Doctor_Programs;
using DTOs.Programs;
using DTOs.UnavailablePeriods;
using DTOs.UnavailableReasons;
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
    public class UnavailableResonService : BaseService
    {
        private readonly ClaimsPrincipal _currentUnavailableReason;
        private readonly MapperService Mapper;

        public UnavailableResonService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUnavailableReason) : base(unitOfWork, logger, appSettings)
        {
            _currentUnavailableReason = currentUnavailableReason;
            Mapper = mapper;
        }
        public async Task<List<UnavailableReasonDetailsDTO>> GetReasonList(IQueryBuilder query)
        {
            var reasonList = await UnitOfWork.Queryable<UnavailableReason>().ToListAsync();
            return Mapper.Map<UnavailableReason, UnavailableReasonDetailsDTO>(reasonList);
        }

    }
}
