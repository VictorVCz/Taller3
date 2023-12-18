using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GithubAPIController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string GithubUsername = "Dizkm8";

        public GithubAPIController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [Authorize]
        [HttpGet("repos")]
        public async Task<IActionResult> GetRepos()
        {
            // URL de la API para obtener repositorios de un usuario específico
            string apiUrl = $"https://api.github.com/users/{GithubUsername}/repos";

            // Realizar solicitud GET a la API de GitHub
            using (HttpClient client = _httpClientFactory.CreateClient())
            {
                // Agregar encabezados de usuario-agent para evitar problemas de autenticación en solicitudes no autenticadas
                client.DefaultRequestHeaders.Add("User-Agent", "request");

                HttpResponseMessage response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    // Leer y devolver la respuesta en el cuerpo del mensaje
                    string responseData = await response.Content.ReadAsStringAsync();


                    return Ok(responseData);
                }
                else
                {
                    return BadRequest($"Error en la solicitud: {response.StatusCode} - {response.ReasonPhrase}");
                }
            }
        }

        [Authorize]
        [HttpGet("commits")]
        public async Task<IActionResult> GetCommits(string repo)
        {
            // URL de la API para obtener repositorios de un usuario específico
            string apiUrl = $"https://api.github.com/repos/Dizkm8/{repo}/commits";

            // Realizar solicitud GET a la API de GitHub
            using (HttpClient client = _httpClientFactory.CreateClient())
            {
                // Agregar encabezados de usuario-agent para evitar problemas de autenticación en solicitudes no autenticadas
                client.DefaultRequestHeaders.Add("User-Agent", "request");

                HttpResponseMessage response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    // Leer y devolver la respuesta en el cuerpo del mensaje
                    string responseData = await response.Content.ReadAsStringAsync();
                    return Ok(responseData);
                }
                else
                {
                    return BadRequest($"Error en la solicitud: {response.StatusCode} - {response.ReasonPhrase}");
                }
            }
        }
    }
}