using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Appointments
{
    public class AppointmentFileDTO
    {
        public IFormFile File { get; set; }

        public Guid IdAppointment { get; set; }

    }
}
