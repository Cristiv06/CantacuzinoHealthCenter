using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utils;

namespace DTOs.Users
{
    public class UserFullDTO : IAuthUser
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public byte RoleId { get; set; }

        public int Age { get; set; }

        public string? Address { get; set; }

        public string? HealthIssues { get; set; }
    }
}
