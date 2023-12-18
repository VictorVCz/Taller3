using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {


        private readonly DataContext _context;
        private static readonly string emailPattern = @"^[a-zA-Z0-9.!#$%&'*+\=?^_`{|}~-]+@alumnos\.ucn\.cl$";
        readonly Regex ergx = new Regex(emailPattern);

        public UserController(DataContext context)
        {
            _context = context;
        }


        [Authorize]
        [HttpPut("edit")]
        public IActionResult EditUser(string email, UserDto request)
        {
            //verificamos si el usuario existe o no den el sistema.
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                ModelState.AddModelError("Error", "El usuario con tal Id no existe");
                return BadRequest(ModelState);
            }
            // verificamos que efectivamente el largo del nombre completo supera al menos los 10 caracteres y es menor de 150 caracteres
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
                // en caso de que el correo tenga un formato incorrecto, mostramos un mensaje.
                ModelState.AddModelError("Error", "El correo ingresado no tiene el formato correcto, debe contener como dominio 'alumnos.ucn.cl'");
                return BadRequest(ModelState);
            }
            // validamos que efectivamente el año de nacimiento se encuentre en el rango propuesto
            if (IsValidBirthDate(request.BirthDate))
            {
                ModelState.AddModelError("Error", "El año de nacimiento es invalido. debe ser entre 1900 y el año presente.");
                return BadRequest(ModelState);
            }

            // una vez validados los datos provenientes por el frontend, damos paso a efectuar los cambios
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.BirthDate = request.BirthDate;

            _context.SaveChanges();

            return Ok(user);


        }

        [Authorize]
        [HttpPut("editPassword")]
        public IActionResult editPassword(string? email, string? password)
        {

            // en caso de que los parametros sean vacios, damos un mensaje para se usado en la alaerta en el frontend móvil
            if (password == "" || password == null)
            {
                ModelState.AddModelError("Error", "La contraseña ingresada no puede ser vacía");
                return BadRequest(ModelState);
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                ModelState.AddModelError("Error", "El usuario con el correo ingresado no existe");
                return BadRequest(ModelState);
            }

            string passwordHashed = BCrypt.Net.BCrypt.HashPassword(password);


            // una vez hecho las validaciones procedemos a efectuar los cambios
            user.PasswordEncrypted = passwordHashed;
            _context.SaveChanges();

            return Ok(user);
        }


        // funcion que cumple en validar si la fecha entrante esta dentro del margen valido.
        private bool IsValidBirthDate(DateTime birthDate)
        {
            int currentYear = DateTime.Now.Year;
            int minimumYear = 1900;

            return birthDate.Year >= minimumYear && birthDate.Year <= currentYear;
        }
    }
}