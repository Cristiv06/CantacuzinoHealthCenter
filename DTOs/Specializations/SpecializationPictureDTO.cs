using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Specializations
{
    public class SpecializationPictureDTO
    {
        public IFormFile File { get; set; }

        public int IdSpecialization { get; set; }
    }
}
