namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Rut { get; set; } = "";
        public string PasswordEncrypted { get; set; } = "";
        public DateTime BirthDate { get; set; }
    }
}