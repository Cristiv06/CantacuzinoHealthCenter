using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.UnavailablePeriods
{
    public class UnavailablePeriodDetailsDTO
    {
        public Guid Id { get; set; }

        public Guid DoctorId { get; set; }

        public DateOnly StartingDay { get; set; }

        public DateOnly EndingDay { get; set; }

        public int ReasonId { get; set; }
    }
}
