using BL.UnitOfWork;
using Common.AppSettings;
using DA.Entities;
using DTOs.Doctor_Programs;
using DTOs.Programs;
using DTOs.UnavailablePeriods;
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
    public class UnavailablePeriodService: BaseService
    {
        private readonly ClaimsPrincipal _currentUnavailablePeriod;
        private readonly MapperService Mapper;

        public UnavailablePeriodService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUnavailablePeriod) : base(unitOfWork, logger, appSettings)
        {
            _currentUnavailablePeriod = currentUnavailablePeriod;
            Mapper = mapper;
        }


        public async Task<List<UnavailablePeriodDetailsDTO>> GetUnavailablePeriodByCurrentDoctor()
        {
            var currentUserId = _currentUnavailablePeriod.Id();
            var programList = await UnitOfWork.Queryable<UnavailablePeriod>().Where(d => d.IdDoctor == currentUserId).ToListAsync();
            return Mapper.Map<UnavailablePeriod, UnavailablePeriodDetailsDTO>(programList);
        }

        public async Task<int> CreateUpdateDoctorProgram(List<CreateUnavailablePeriodDTO> updatedPrograms)
        {
            var updatedDbPrograms = Mapper.Map<CreateUnavailablePeriodDTO, UnavailablePeriod>(updatedPrograms);
            var existingDbPrograms = await UnitOfWork.Queryable<UnavailablePeriod>().Where(p => updatedDbPrograms.Select(d => d.Id).Any(d => d == p.Id)).ToListAsync();

            var newPrograms = updatedDbPrograms.Where(p => !existingDbPrograms.Any(d => d.Id == p.Id)).ToList();
            var existingPrograms = updatedDbPrograms.Where(p => existingDbPrograms.Any(d => d.Id == p.Id)).ToList();

            if (newPrograms.Any())
            {
                UnitOfWork.Repository<UnavailablePeriod>().AddRange(newPrograms);
            }
            if (existingPrograms.Any())
            {
                UnitOfWork.Repository<UnavailablePeriod>().UpdateRange(existingPrograms);
            }

            return await Save();
        }

        public async Task<int?> DeleteUnavailablePeriod(Guid periodId)
        {
            var dbPeriod = await UnitOfWork.Queryable<UnavailablePeriod>().FirstOrDefaultAsync(p => p.Id == periodId);
            if (dbPeriod == null)
            {
                return null;
            }
            UnitOfWork.Repository<UnavailablePeriod>().Remove(dbPeriod);

            return await Save();
        }
    }
}
