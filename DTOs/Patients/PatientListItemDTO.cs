using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Patients
{
    public class PatientListItemDTO
    {
        public Guid Id { get; set; }
        public string? Age { get; set; }
    }
}
