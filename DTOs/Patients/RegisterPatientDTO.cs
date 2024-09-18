using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Patients
{
    public class RegisterPatientDTO
    {
        public Guid UserId { get; set; }

        public int Age { get; set; }

        public string? Address { get; set; }

        public string? HealthIssues { get; set; }
    }
}
