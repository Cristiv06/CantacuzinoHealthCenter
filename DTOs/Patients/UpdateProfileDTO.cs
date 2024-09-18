using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Patients
{
    public class UpdateProfileDTO
    {
        public Guid Id { get; set; }
        public string? Address { get; set; }

        public string? HealthIssues { get; set; }

        public IFormFile? Photo { get; set; }
    }
}
