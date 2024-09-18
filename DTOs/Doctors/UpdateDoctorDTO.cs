using DTOs.Specializations;
using Microsoft.AspNetCore.Http;

namespace DTOs.Doctors
{
    public class UpdateDoctorDTO
    {
        public Guid Id { get; set; }

        public string DegreeName { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public List<SpecializationPriceDTO> SpecializationsList { get; set; } = new();

        public IFormFile? Photo { get; set; }
    }
}