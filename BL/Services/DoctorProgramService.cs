using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Doctor_Programs;
using DTOs.Notifications;
using DTOs.Patients;
using DTOs.Programs;
using DTOs.UnavailablePeriods;
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
    public class DoctorProgramService : BaseService
    {
        private readonly ClaimsPrincipal _currentDoctor;
        private readonly MapperService Mapper;

        public DoctorProgramService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentDoctor) : base(unitOfWork, logger, appSettings)
        {
            _currentDoctor = currentDoctor;
            Mapper = mapper;
        }


        public async Task<DoctorProgramDTO?> GetProgramDetailsById(Guid id)
        {

            var program = await UnitOfWork.Queryable<DoctorProgram>().FirstOrDefaultAsync(p => p.Id == id);
            if (program == null)
            {
                return null;
            }
            return Mapper.Map<DoctorProgram, DoctorProgramDTO>(program);
        }

        public async Task<DoctorProgramDetailsDTO> GetProgramByCurrentDoctor()
        {
            var currentUserId = _currentDoctor.Id();
            var programList = await UnitOfWork.Queryable<DoctorProgram>().Where(d => d.IdDoctor==currentUserId).OrderBy(d => d.DayOfWeek).ToListAsync();
            var unavailableList = await UnitOfWork.Queryable<UnavailablePeriod>().Include(d => d.IdReasonNavigation).Where(d => d.IdDoctor == currentUserId).ToListAsync();
            var programDetails = new DoctorProgramDetailsDTO();
            programDetails.DoctorProgramList = Mapper.Map<DoctorProgram, DoctorProgramDTO>(programList);
            programDetails.UnavailablePeriods = Mapper.Map<UnavailablePeriod, UnavailablePeriodDetailsDTO>(unavailableList);
            return programDetails;
        }

        public async Task<int> CreateUpdateDoctorProgram(CreateProgramDetailsDTO updatedPrograms)
        {

            var updatedDbPrograms = Mapper.Map<CreateProgramDTO, DoctorProgram>(updatedPrograms.ProgramList);
            var existingDbPrograms = await UnitOfWork.Queryable<DoctorProgram>().Where(p => updatedDbPrograms.Select(d=> d.Id).Any(d => d == p.Id)).ToListAsync();

            var newPrograms = updatedDbPrograms.Where(p => !existingDbPrograms.Any(d => d.Id == p.Id)).ToList();
            var existingPrograms = updatedDbPrograms.Where(p => existingDbPrograms.Any(d => d.Id == p.Id)).ToList();


            if (newPrograms.Any())
            {
                UnitOfWork.Repository<DoctorProgram>().AddRange(newPrograms);
            }
            if (existingPrograms.Any())
            {
                UnitOfWork.Repository<DoctorProgram>().UpdateRange(existingPrograms);
            }



            var updatedDbUnavailable = Mapper.Map<CreateUnavailablePeriodDTO, UnavailablePeriod>(updatedPrograms.UnavailableList);
            var existingDbUnavailable = await UnitOfWork.Queryable<UnavailablePeriod>().Where(p => updatedDbUnavailable.Select(d => d.Id).Any(d => d == p.Id)).ToListAsync();

            var newUnavailable = updatedDbUnavailable.Where(p => !existingDbUnavailable.Any(d => d.Id == p.Id)).ToList();
            var existingUnavailable = updatedDbUnavailable.Where(p => existingDbUnavailable.Any(d => d.Id == p.Id)).ToList();


            if (newUnavailable.Any())
            {
                UnitOfWork.Repository<UnavailablePeriod>().AddRange(newUnavailable);
            }
            if (existingUnavailable.Any())
            {
                UnitOfWork.Repository<UnavailablePeriod>().UpdateRange(existingUnavailable);
            }

            return await Save();
        }

        public async Task<int?> DeleteProgram(Guid programId)
        {
            var dbProgram = await UnitOfWork.Queryable<DoctorProgram>().FirstOrDefaultAsync(p => p.Id == programId);
            if (dbProgram == null)
            {
                return null;
            }
            UnitOfWork.Repository<DoctorProgram>().Remove(dbProgram);

            return await Save();
        }

    }
}
