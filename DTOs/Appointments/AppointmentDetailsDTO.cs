using DTOs.Reviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Appointments
{
    public class AppointmentDetailsDTO
    {
        public Guid? Id { get; set; }
        public string? DoctorName { get; set; }

        public string? PatientName { get; set; }

        public DateTime? DateAndTime { get; set; }

        public int? Price { get; set; }

        public bool? IsCompleted { get; set; }

        public bool? IsApproved { get; set; }

        public List<AppoinementFileDTO> AppointmentFiles { get; set; } = new ();

        public List<CreateReviewDTO>? Reviews { get; set; } = new();
    }
}
