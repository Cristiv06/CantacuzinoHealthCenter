using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Appointments
{
    public class AppointmentApprovalDTO
    {
        public Guid Id { get; set; }

        public Guid PatientId { get; set; }

        public bool? IsApproved { get; set; }
    }
}
