namespace DTOs.Users
{
    public class UpdateUserDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
    }
}
