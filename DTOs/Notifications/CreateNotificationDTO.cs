using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Notifications
{
    public class CreateNotificationDTO
    {
        public Guid Id { get; set; }

        public Guid IdUser { get; set; }

        public int IdType { get; set; }

        public DateTime NotifyDate { get; set; }

    }
}
