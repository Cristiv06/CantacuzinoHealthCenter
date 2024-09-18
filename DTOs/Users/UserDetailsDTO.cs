﻿using Utils;

namespace DTOs.Users
{
    public class UserDetailsDTO: IAuthUser
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public byte RoleId { get; set; }

    }
}
