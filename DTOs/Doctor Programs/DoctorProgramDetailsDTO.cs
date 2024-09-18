using DA.Entities;
using DTOs.Doctor_Programs;
using DTOs.UnavailablePeriods;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Programs
{
    public class DoctorProgramDetailsDTO
    {
        public List<DoctorProgramDTO> DoctorProgramList { get; set; } = new();

        public List<UnavailablePeriodDetailsDTO> UnavailablePeriods { get; set; } = new();
    }
}
