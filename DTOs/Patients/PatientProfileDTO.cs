using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Patients
{
    public class PatientProfileDTO
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public int Age { get; set; }

        public string? Address { get; set; }

        public string? HealthIssues { get; set; }

        public Guid? PhotoId { get; set; }
    }
}
