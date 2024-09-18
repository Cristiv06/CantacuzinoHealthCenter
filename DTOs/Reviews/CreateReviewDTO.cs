using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Reviews
{
    public class CreateReviewDTO
    {
        public Guid Id { get; set; }

        public Guid IdPatient { get; set; }

        public Guid IdAppointment { get; set; }

        public int? Rating {  get; set; }

        public string? ReviewMessage { get; set; }
    }
}
