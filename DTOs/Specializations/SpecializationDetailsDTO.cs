using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Specializations
{
    public class SpecializationDetailsDTO
    {
        public int Id { get; set; }

        public string Name { get; set;}

        public int DefaultPrice { get; set; }

        public string Description { get; set; }

        public Guid IdPicture { get; set; } 
    }
}
