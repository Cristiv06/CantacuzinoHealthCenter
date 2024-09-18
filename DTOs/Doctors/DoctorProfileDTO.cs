using DA.Entities;
using DTOs.Specializations;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Doctors
{
    public class DoctorProfileDTO
    {
        public Guid Id { get; set; }

        public string DegreeName { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public List<SpecializationPriceDTO> SpecializationsList { get; set; } = new();

        public Guid? PhotoId { get; set; }
    }
}
