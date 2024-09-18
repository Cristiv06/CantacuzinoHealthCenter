using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Doctors
{
    public class RegisterDoctorDTO
    {
        public Guid DoctorId { get; set; }

        public int IdDegrees { get; set; }

        public int IdSpecialization { get; set; }
    }
}
