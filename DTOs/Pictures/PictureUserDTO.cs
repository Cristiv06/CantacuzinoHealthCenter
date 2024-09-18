using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Pictures
{
    public class PictureUserDTO
    {
        public IFormFile File { get; set; }

        public Guid IdUser { get; set; }
    }
}
