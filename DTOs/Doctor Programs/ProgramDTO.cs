using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Doctor_Programs
{
    public class ProgramDTO
    {
        public List<TimeSlotDTO> UnavailableSlot { get; set; } = new();
        public int StartHour { get; set; }
        public int EndHour { get; set; }
    }
}
