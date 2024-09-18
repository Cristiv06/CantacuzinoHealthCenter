using BL.UnitOfWork;
using Common.AppSettings;
using Common.Enums;
using Common.Implementations;
using Common.Interfaces;
using DA.Entities;
using DTOs.Appointments;
using DTOs.Doctor_Programs;
using DTOs.Notifications;
using DTOs.Patients;
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
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BL.Services
{
    public class AppointmentService : BaseService
    {
        private readonly ClaimsPrincipal CurrentUser;
        private readonly MapperService Mapper;
        private readonly NotificationService _notificationService;

        public AppointmentService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUser, NotificationService service) : base(unitOfWork, logger, appSettings)
        {
            CurrentUser = currentUser;
            Mapper = mapper;
            _notificationService = service;
        }

        public async Task<List<DateTime>> GetUnavailableDays(Guid doctorId)
        {
            var workingDays = await UnitOfWork.Queryable<DoctorProgram>().Where(d => d.IdDoctor == doctorId).ToListAsync();
            var unavailablePeriods = await UnitOfWork.Queryable<UnavailablePeriod>().Where(d => d.IdDoctor == doctorId).ToListAsync();
            var resultUnavailableDate = new List<DateTime>();

            for (DateTime date = DateTime.Today; date <= DateTime.Today.AddDays(30); date = date.AddDays(1))
            {
                if (workingDays.Select(d => d.DayOfWeek).ToList().Contains((byte)date.DayOfWeek))
                {
                    foreach (var period in unavailablePeriods)
                    {
                        if (period.StartingDay <= DateOnly.FromDateTime(date) && period.EndingDay >= DateOnly.FromDateTime(date))
                        {
                            resultUnavailableDate.Add(date);
                        }
                    }
                }
                else
                {
                    resultUnavailableDate.Add(date);
                }
            }
            return resultUnavailableDate;
        }

        public async Task<ProgramDTO> GetDoctorProgramForSelectedDay(Guid doctorId, DateTime selectedDate)
        {
            var doctorProgram = await UnitOfWork.Queryable<DoctorProgram>()
                .Where(dp => dp.IdDoctor == doctorId && dp.DayOfWeek == (byte)selectedDate.DayOfWeek)
                .FirstOrDefaultAsync();

            if (doctorProgram == null)
            {
                return new ProgramDTO();
            }

            DateTime workStart = selectedDate.Date.Add(doctorProgram.StartingHour.ToTimeSpan());
            DateTime workEnd = selectedDate.Date.Add(doctorProgram.EndingHour.ToTimeSpan());
            var startHour = workStart.Hour;
            var endHour = workEnd.Hour;

            var appointments = await UnitOfWork.Queryable<Appointment>()
                .Where(a => a.IdDoctorSpecializationsNavigation.IdDoctor == doctorId && a.DateAndTime.HasValue && a.DateAndTime.Value.Date == selectedDate.Date)
                .ToListAsync();

            var unavailablePeriods = await UnitOfWork.Queryable<UnavailablePeriod>()
                .Where(up => up.IdDoctor == doctorId &&
                             up.StartingDay <= DateOnly.FromDateTime(selectedDate) &&
                             up.EndingDay >= DateOnly.FromDateTime(selectedDate))
                .ToListAsync();

            List<TimeSlotDTO> unavailableSlots = new List<TimeSlotDTO>();

            for (DateTime slotStart = workStart; slotStart < workEnd; slotStart = slotStart.AddHours(1))
            {
                DateTime slotEnd = slotStart.AddHours(1);
                var currentSlot = new TimeSlotDTO { Start = slotStart, End = slotEnd };

                bool isUnavailable = unavailablePeriods.Any(up =>
                {
                    var unavailableSlot = new TimeSlotDTO
                    {
                        Start = up.StartingDay.ToDateTime(TimeOnly.MinValue),
                        End = up.EndingDay.ToDateTime(TimeOnly.MaxValue)
                    };
                    return SlotsOverlap(unavailableSlot, currentSlot);
                }) ||
                appointments.Any(a => a.DateAndTime.HasValue &&
                    SlotsOverlap(new TimeSlotDTO { Start = a.DateAndTime.Value, End = a.DateAndTime.Value.AddHours(1) }, currentSlot));

                if (isUnavailable)
                {
                    unavailableSlots.Add(currentSlot);
                }
            }

            return new ProgramDTO
            {
                UnavailableSlot = unavailableSlots,
                StartHour = startHour,
                EndHour = endHour
            };
        }


        private bool SlotsOverlap(TimeSlotDTO slot1, TimeSlotDTO slot2)
        {
            return slot1.Start < slot2.End && slot2.Start < slot1.End;
        }

        public async Task<int> CreateAppointment(CreateAppointmentDTO createdAppointment)
        {
            var newAppointment = Mapper.Map<CreateAppointmentDTO, Appointment>(createdAppointment);

            var docSpec = UnitOfWork
                .Queryable<DoctorsSpecialization>()
                .Include(ds => ds.IdSpecializationNavigation)
                .SingleOrDefault(d => d.IdDoctor == createdAppointment.DoctorId && d.IdSpecialization == createdAppointment.SpecializationId);

            var appointmentExists = UnitOfWork
                .Queryable<Appointment>()
                .Include(a => a.IdDoctorSpecializationsNavigation)
                .Any(a => a.DateAndTime == newAppointment.DateAndTime && a.IdDoctorSpecializationsNavigation.IdDoctor == createdAppointment.DoctorId);

            if (docSpec == null || appointmentExists)
            {
                throw new Exception();
                
            }
            newAppointment.IdDoctorSpecializations = docSpec.Id;
            newAppointment.Price = docSpec.CustomPrice ?? docSpec.IdSpecializationNavigation.DefaultPrice;

            UnitOfWork.Repository<Appointment>().Add(newAppointment);

            if (createdAppointment.AppointmentInfoList.Any())
            {
                foreach (var appInfo in createdAppointment.AppointmentInfoList)
                {
                    var newAppInfo = new AppointmentInfo()
                    {
                        Id = Guid.NewGuid(),
                        IdAppointment = newAppointment.Id,
                        InfoMessage = appInfo
                    };
                    UnitOfWork.Repository<AppointmentInfo>().Add(newAppInfo);
                }
            }

            var res = await Save();

            if (res > 0)
            {
                await _notificationService.CreateNotification(new CreateNotificationDTO()
                {
                    Id = Guid.NewGuid(),
                    IdUser = createdAppointment.DoctorId,
                    IdType = (short)NotificationMessageTypeEnum.DoctorMessage,
                    NotifyDate = DateTime.Now,
                });
            }
            return res;
        }

        public async Task<List<AppointmentDetailsDTO>> GetAppointmentList()
        {
            var userId = CurrentUser.Id();
            var user = UnitOfWork.Queryable<User>().FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return new List<AppointmentDetailsDTO>();
            }
            if (user.RoleId == (int)Roles.Patient)
            {
                var appointmentList = await UnitOfWork.Queryable<Appointment>()
                    .Include(a => a.IdPacientNavigation)
                        .ThenInclude(a => a.IdNavigation)
                    .Include(a => a.IdDoctorSpecializationsNavigation)
                        .ThenInclude(a => a.IdDoctorNavigation)
                            .ThenInclude(a => a.IdNavigation)
                    .Include(a => a.AppointmentDocuments)
                         .ThenInclude(a => a.IdFileNavigation)
                    .Where(a => a.IdPacient == userId)
                    .Include(a => a.Reviews)  
                    .Where(a => a.IdPacient == userId)
                    .ToListAsync();

                return Mapper.Map<Appointment, AppointmentDetailsDTO>(appointmentList);
            }
            else if (user.RoleId == (int)Roles.Doctor)
            {
                var appointmentList = await UnitOfWork.Queryable<Appointment>()
                    .Where(a => a.IdDoctorSpecializationsNavigation.IdDoctor == userId)
                    .Include(a => a.IdPacientNavigation)
                        .ThenInclude(a => a.IdNavigation)
                    .Include(a => a.IdDoctorSpecializationsNavigation)
                        .ThenInclude(a => a.IdDoctorNavigation)
                            .ThenInclude(a => a.IdNavigation)
                    .Include(a => a.AppointmentDocuments)
                         .ThenInclude(a => a.IdFileNavigation)
                    .Include(a => a.Reviews)
                    .ToListAsync();

                return Mapper.Map<Appointment, AppointmentDetailsDTO>(appointmentList);
            }

            return new List<AppointmentDetailsDTO>();
        }

        public async Task<Guid?> SetAppointmentState(AppointmentApprovalDTO appointment)
        {
            var updatedAppointment = await UnitOfWork.Queryable<Appointment>().FirstOrDefaultAsync(a => a.Id == appointment.Id);
            if (updatedAppointment != null)
            {
                updatedAppointment.IsApproved = appointment.IsApproved;
                UnitOfWork.Repository<Appointment>().Update(updatedAppointment);
            }
            var res = await Save();
            if (res > 0)
            {
                await _notificationService.CreateNotification(new CreateNotificationDTO()
                {
                    Id = Guid.NewGuid(),
                    IdUser = updatedAppointment.IdPacient,
                    IdType = (short)NotificationMessageTypeEnum.PatientMessage,
                    NotifyDate = DateTime.Now,
                });
                return updatedAppointment.IdPacient;
            }
            return null;
            
        }

        public async Task<int?> DeleteAppontment(Guid appointmentId)
        {
            var dbAppointment = await UnitOfWork.Queryable<Appointment>()
                .Include(a => a.AppointmentInfos)
                .Include(a => a.AppointmentDocuments)
                .Include(a => a.Reviews)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (dbAppointment == null)
            {
                return null;
            }
            if (dbAppointment.AppointmentInfos.Any())
            {
                foreach (var info in dbAppointment.AppointmentInfos)
                {
                    UnitOfWork.Repository<AppointmentInfo>().Remove(info);
                }
            }
            if (dbAppointment.AppointmentDocuments.Any())
            {
                foreach (var docs in dbAppointment.AppointmentDocuments)
                {
                    UnitOfWork.Repository<AppointmentDocument>().Remove(docs);
                }
            }
            if (dbAppointment.Reviews.Any())
            {
                UnitOfWork.Repository<Review>().RemoveRange(dbAppointment.Reviews);
            }
            UnitOfWork.Repository<Appointment>().Remove(dbAppointment);

            return await Save();
        }

    }
}
