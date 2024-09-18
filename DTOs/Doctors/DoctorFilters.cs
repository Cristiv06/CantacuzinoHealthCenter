using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Doctors
{
    public class DoctorFilters
    {
        public string? NameFilter { get; set; }
        public int? SpecializationIdFilter { get; set; }
        public int? DegreeIdFilter { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
