using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Notifications
{
    public class NotificationReadDTO
    {
        public Guid? Id { get; set; }

        public bool? IsRead { get; set; }
    }
}
