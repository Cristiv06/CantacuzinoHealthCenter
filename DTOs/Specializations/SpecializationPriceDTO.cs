using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Specializations
{
    public class SpecializationPriceDTO
    {
        public int Id { get; set; }

        public Guid? DoctorSpecializationsId { get; set; }

        public int? CustomPrice { get; set; }

    }
}
