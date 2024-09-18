using BL.UnitOfWork;
using Common.AppSettings;
using Common.Interfaces;
using DA.Entities;
using DTOs.Doctor_Programs;
using DTOs.Doctors;
using DTOs.Patients;
using DTOs.Specializations;
using DTOs.UnavailablePeriods;
using DTOs.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Utils;

namespace BL.Services
{
    public class UserService : BaseService
    {
        private readonly ClaimsPrincipal CurrentUser;
        private readonly MapperService Mapper;

        public UserService(MapperService mapper, AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUser) : base(unitOfWork, logger, appSettings)
        {
            CurrentUser = currentUser;
            Mapper = mapper;
        }

        public async Task<UserFullDTO?> GetUserDetailsById(Guid id)
        {
            var user = await UnitOfWork.Queryable<User>().Include(d => d.Patient).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) 
            { 
                return null; 
            }
            return Mapper.Map<User, UserFullDTO>(user);
        }

    

        public async Task<UserDetailsDTO?> GetUserDetailsByCredentials(string email, string password)
        {
            var user = await UnitOfWork.Queryable<User>().FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !(await SecurityExtensions.ComparePasswords(user.Password, email, password, user.Id.ToString())))
            {
                return null;
            }
            return Mapper.Map<User, UserDetailsDTO>(user);
        }

        public async Task<List<UserListItemDTO>> GetUserList(IQueryBuilder query)
        {
            return await Mapper.Map<User, UserListItemDTO>(UnitOfWork.Repository<User>().GetByQuery(query)).ToListAsync();
        }
        public async Task<int> RegisterUser(RegisterUserDTO newUser)
        {
            var newDbUser = Mapper.Map<RegisterUserDTO, User>(newUser);
            newDbUser.CreatedBy = newDbUser.Id;
            newDbUser.LastModifiedBy = newDbUser.Id;
            newDbUser.Password = await SecurityExtensions.GetPasswordHashString(newDbUser.Email, newUser.Password, newDbUser.Id.ToString());
            newDbUser.Patient = new Patient();
            newDbUser.Patient.Age = newUser.Age;
            newDbUser.Patient.Address = newUser.Address;
            newDbUser.Patient.HealthIssues = newUser.HealthIssues;

            UnitOfWork.Repository<User>().Add(newDbUser);
            return await Save();
        }

        public async Task<int> RegisterDoctor(RegisterDoctorFullDTO newUser)
        {

            var newDbUser = Mapper.Map<RegisterDoctorFullDTO, User>(newUser);
            newDbUser.CreatedBy = newDbUser.Id;
            newDbUser.LastModifiedBy = newDbUser.Id;

            newDbUser.Password = await SecurityExtensions.GetPasswordHashString(newDbUser.Email, newUser.Password, newDbUser.Id.ToString());

            newDbUser.Doctor = new Doctor
            {
                IdDegrees = newUser.DegreeId
            };

            if (newUser.SpecializationsList != null && newUser.SpecializationsList.Any())
            {
                foreach (var specialization in newUser.SpecializationsList)
                {
                    var newSpecialization = Mapper.Map<SpecializationPriceDTO, DoctorsSpecialization>(specialization);
                    newSpecialization.IdDoctor = newDbUser.Doctor.Id;
                    newSpecialization.IdDoctorNavigation = newDbUser.Doctor;
                    UnitOfWork.Repository<DoctorsSpecialization>().Add(newSpecialization);
                }
            }

            var newPrograms = Mapper.Map<List<CreateProgramDTO>, List<DoctorProgram>>(newUser.ProgramsList);
            foreach (var program in newPrograms)
            {
                program.IdDoctor = newDbUser.Doctor.Id;
                UnitOfWork.Repository<DoctorProgram>().Add(program);
            }

            var newUnavailablePeriods = Mapper.Map<List<CreateUnavailablePeriodDTO>, List<UnavailablePeriod>>(newUser.UnavailableList);
            foreach (var unavailablePeriod in newUnavailablePeriods)
            {
                unavailablePeriod.IdDoctor = newDbUser.Doctor.Id;
                UnitOfWork.Repository<UnavailablePeriod>().Add(unavailablePeriod);
            }

            UnitOfWork.Repository<User>().Add(newDbUser);

            return await Save();
        }


        public async Task<int> RegisterBasicUser(RegisterBasicUserDTO newUser)
        {
            var newDbUser = Mapper.Map<RegisterBasicUserDTO, User>(newUser);
            newDbUser.CreatedBy = newDbUser.Id;
            newDbUser.LastModifiedBy = newDbUser.Id;
            newDbUser.Password = await SecurityExtensions.GetPasswordHashString(newDbUser.Email, newUser.Password, newDbUser.Id.ToString());

            UnitOfWork.Repository<User>().Add(newDbUser);
            return await Save();
        }

        public async Task<int?> UpdateUser(UpdateUserDTO updatedUser)
        {
            var dbUser = await UnitOfWork.Queryable<User>().FirstOrDefaultAsync(u => u.Id == updatedUser.Id);
            if(dbUser == null)
            {
                return null;
            }

            dbUser = Mapper.Map(updatedUser, dbUser);
            dbUser.LastModifiedBy = CurrentUser.Id();

            UnitOfWork.Repository<User>().Update(dbUser);

            return await Save();
        }

        public async Task<int?> DeactivateUser(Guid userId)
        {
            var dbUser = await UnitOfWork.Queryable<User>().FirstOrDefaultAsync(u => u.Id == userId);
            if (dbUser == null)
            {
                return null;
            }
            dbUser.IsActive = false;
            dbUser.LastModifiedBy = CurrentUser.Id();
            dbUser.LastModifiedDate = DateTime.Now;
            UnitOfWork.Repository<User>().Update(dbUser);

            return await Save();
        }
        public async Task<int?> DeleteUser(Guid userId)
        {
            var dbUser = await UnitOfWork.Queryable<User>().FirstOrDefaultAsync(u => u.Id == userId);
            if (dbUser == null)
            {
                return null;
            }
            UnitOfWork.Repository<User>().Remove(dbUser);

            return await Save();
        }

        public async Task<bool> EmailIsUsed(string email)
        {
            return await UnitOfWork.Queryable<User>().AnyAsync(u => u.Email == email);
        }
    }
}
