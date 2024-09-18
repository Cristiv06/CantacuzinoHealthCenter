using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Doctor_Programs
{
    public class CreateProgramDTO
    {
        public Guid Id { get; set; }

        public Guid DoctorId { get; set; }

        public TimeOnly StartingHour { get; set; }

        public TimeOnly EndingHour { get; set; }

        public byte DayOfWeek { get; set; }
    }
}
