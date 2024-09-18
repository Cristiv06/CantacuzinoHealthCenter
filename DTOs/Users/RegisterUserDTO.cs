namespace DTOs.Users
{
    public class RegisterUserDTO
    {
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public int Age { get; set; }

        public string? Address { get; set; }

        public string? HealthIssues { get; set; }
    }
}
