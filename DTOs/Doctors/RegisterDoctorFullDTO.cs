using DTOs.Doctor_Programs;
using DTOs.Specializations;
using DTOs.UnavailablePeriods;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Doctors
{
    public class RegisterDoctorFullDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public int DegreeId { get; set; }
        public List<SpecializationPriceDTO> SpecializationsList { get; set; }
        public List<CreateProgramDTO> ProgramsList { get; set; }
        public List<CreateUnavailablePeriodDTO> UnavailableList { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

    }

}
