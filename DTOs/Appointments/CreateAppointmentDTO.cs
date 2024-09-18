using DA.Entities;
using DTOs.Doctor_Programs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Appointments
{
    public class CreateAppointmentDTO
    {
        public Guid? Id { get; set; }

        public Guid DoctorId { get; set; }

        public Guid PatientId { get; set; }

        public int SpecializationId { get; set; }

        public int? Price { get; set; }

        public DateTime? DateAndTime { get; set; }

        public List<string> AppointmentInfoList { get; set; } = new();
    }
}
