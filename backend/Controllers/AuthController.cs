using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DataContext _context;
        private static readonly string rutPattern = @"^(\d{1,3}(?:\.\d{1,3}){2}-[\dK])$";
        private static readonly string emailPattern = @"^[a-zA-Z0-9.!#$%&'*+\=?^_`{|}~-]+@alumnos\.ucn\.cl$";
        readonly Regex rgx = new Regex(rutPattern);
        readonly Regex ergx = new Regex(emailPattern);

        public AuthController(IConfiguration configuration, DataContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login(string? email, string? password)
        {
            if (email == "")
            {
                ModelState.AddModelError("Error", "El correo ingresado es vacío");
                return BadRequest(ModelState);
            }
            if (password == "")
            {
                ModelState.AddModelError("Error", "La contraseña ingresada es vacía");
                return BadRequest(ModelState);
            }

            //verificamos que el correo efectivamente este registrado
            var user = _context.Users.FirstOrDefault(c => c.Email == email);
            if (user == null)
            {
                ModelState.AddModelError("Error", "El correo ingresado no se encuentra registrado");
                return BadRequest(ModelState);
            }

            //verificamos la contraseña de acuerdo al usuario identificado con el correo
            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordEncrypted))
            {
                ModelState.AddModelError("Error", "La contraseña es incorrecta, debe ingresar el rut sin puntos ni guiones");
                return BadRequest(ModelState);
            }


            //creamos un JWT con el usuario identificado
            string token = CreateJWT(user);
            //creamos un cuerpo de respuesta que contiene el token, el rut del usuario que se logeara, el nombre y correo
            var response = new
            {
                token,
                email = user.Email
            };

            //enviamos la respuesta
            return Ok(response);
        }


        [HttpPost("register")]
        public IActionResult Register(UserDto request)
        {
            if (request.FullName.Length < 10)
            {
                ModelState.AddModelError("Error", "El nombre completo no puede ser menor a 10 caracteres");
                return BadRequest(ModelState);

            }
            if (request.FullName.Length > 150)
            {
                ModelState.AddModelError("Error", "El nombre completo supera los 150 caracteres maximos");
                return BadRequest(ModelState);
            }
            // Chequeamos si el rut esta ingresado correctamente mediante el regex
            if (rgx.IsMatch(request.Rut))
            {
                // Chequeamos si existe el rut en la base de datos
                var rutCheck = _context.Users.Count(u => u.Rut == request.Rut);
                if (rutCheck > 0)
                {
                    ModelState.AddModelError("Error", "El rut ingresado ya existe");
                    return BadRequest(ModelState);
                }


                // Chequeamos que el digito verificador sea correcto
                var rutRequest = request.Rut;
                // Guardamos el digito verificador
                char digitoVerificador = rutRequest[rutRequest.Length - 1];
                // Eliminamos el digito verificador
                string rutSinDigitoV = rutRequest.Remove(rutRequest.Length - 1);

                // Eliminar los puntos
                string rutSinPuntos = rutSinDigitoV.Replace(".", "");

                // Eliminar los guiones
                string rutSinGuionesSinPuntos = rutSinPuntos.Replace("-", "");

                char validDigit = CalcularDigitoVerificador(rutSinGuionesSinPuntos);

                if (!(validDigit == digitoVerificador))
                {
                    ModelState.AddModelError("Error", "El digito verificador no es el correcto, porfavor revise el rut ingresado");
                    return BadRequest(ModelState);
                }

            }
            else
            {
                ModelState.AddModelError("Error", "El rut ingresado no tiene el formato correcto, use el siguiente ejemplo: 19.999.888-K | 19.999.888-7");
                return BadRequest(ModelState);
            }



            // Chequeamos que el correo ingresado tenga el formato adecuado
            if (ergx.IsMatch(request.Email))
            {
                // Chequeamos si existe el correo en la base de datos
                var emailCheck = _context.Users.Count(u => u.Email == request.Email);
                if (emailCheck > 0)
                {
                    ModelState.AddModelError("Error", "El correo ingresado ya existe");
                    return BadRequest(ModelState);
                }
            }
            else
            {
                ModelState.AddModelError("Error", "El correo ingresado no tiene el formato correcto, debe contener como dominio 'alumnos.ucn.cl'");
                return BadRequest(ModelState);
            }

            if (!IsValidBirthDate(request.BirthDate))
            {
                ModelState.AddModelError("Error", "El año de nacimiento es invalido. debe ser entre 1900 y el año presente.");
                return BadRequest(ModelState);
            }




            //si hasta este punto los dos chequeos no han arrojado ningun problema, y el cuerpo proveniente
            // del front end tiene la estructura correcta es decir que tenga Rut, Name, Email y la password
            if (ModelState.IsValid)
            {
                var rutPassword = request.Rut;
                // Eliminar los puntos
                string rutSinPuntos = rutPassword.Replace(".", "");

                // Eliminar los guiones
                string rutSinGuionesSinPuntos = rutSinPuntos.Replace("-", "");
                //procedemos a hashear la password del usuario
                string passwordHashed = BCrypt.Net.BCrypt.HashPassword(rutSinGuionesSinPuntos);

                //creamos el usuario segun su entidad
                var newUser = new User
                {
                    Rut = request.Rut,
                    FullName = request.FullName,
                    Email = request.Email,
                    PasswordEncrypted = passwordHashed,
                    BirthDate = request.BirthDate
                };

                //agregamos la entidad a la base de datos que sigue la estructura del modelo creado "Customer.cs"
                _context.Users.Add(newUser);
                //guardamos los cambios en la base de datos
                _context.SaveChanges();
                //creamos un Json web token con validacion de 1 minuto
                var jwt = CreateJWT(newUser);
                //retornamos un 200 con el mensaje que se concreto de manera exitosa el registro de usuario

                return Ok(jwt);
            }

            //si por algun motivo el cuerpo no contiene todo lo necesario se ejecuta un badrequest con el mensaje debido.
            ModelState.AddModelError("Error", "El registro no se ha concretado de manera exitosa");
            return BadRequest(ModelState);
        }

        private string CreateJWT(User user)
        {


            List<Claim> claims = new List<Claim>()
            {
                new Claim("rut", "" + user.Rut),
                new Claim("fullName", "" + user.FullName),
                new Claim("email", "" + user.Email),
                new Claim("passwordEncrypted", "" + user.PasswordEncrypted),
                new Claim("birthDate", "" + user.BirthDate)

            };

            string strKey = _configuration["JwtSettings:Key"]!;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(strKey));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(

                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private bool IsValidBirthDate(DateTime birthDate)
        {
            int currentYear = DateTime.Now.Year;
            int minimumYear = 1900;

            return birthDate.Year >= minimumYear && birthDate.Year <= currentYear;
        }

        // con esta funcion podemos validar que el digito verificador sea el correcto, haciendo el reordenamiento inverso
        // a excepcion del digito verificador, donde luego procederemos a multiplicar los valores ya ordenados con la secuencia de
        // valores que van entre el 2,3,4,5,6 hasta el 7. y utilizamos el modulo 11 para devolver finalmente la variabla de tipo char
        // que luego compararemos con el entrante y asi verificar que el rut es correcto.
        static char CalcularDigitoVerificador(string rut)
        {
            int suma = 0;
            int multiplicador = 2;

            // Recorre el Rut de derecha a izquierda
            for (int i = rut.Length - 1; i >= 0; i--)
            {
                suma += int.Parse(rut[i].ToString()) * multiplicador;
                multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
            }

            int resto = suma % 11;
            int resultado = 11 - resto;

            // Retorna el dígito verificador (usando 'K' para representar el 10)
            return resultado == 11 ? '0' : resultado == 10 ? 'K' : char.Parse(resultado.ToString());
        }
    }


}
