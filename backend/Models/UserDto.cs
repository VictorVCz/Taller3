using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserDto
    {
        
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Rut { get; set; } = "";
        public DateTime BirthDate { get; set; }
    }
}