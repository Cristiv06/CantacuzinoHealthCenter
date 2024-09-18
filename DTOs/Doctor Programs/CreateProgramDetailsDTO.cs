using DTOs.UnavailablePeriods;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Doctor_Programs
{
    public class CreateProgramDetailsDTO
    {
        public List<CreateProgramDTO> ProgramList { get; set; } = new();

        public List<CreateUnavailablePeriodDTO> UnavailableList { get; set; } = new();

    }
}
