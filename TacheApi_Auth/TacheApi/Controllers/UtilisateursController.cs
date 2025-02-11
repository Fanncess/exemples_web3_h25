using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Auth0.ManagementApi.Models;
using TacheApi.Services;
using TacheApi.OpenApi;

namespace TacheApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilisateursController : ControllerBase
    {
        private readonly Auth0Service _auth0Service;

        public UtilisateursController(Auth0Service auth0Service)
        {
            _auth0Service = auth0Service;
        }

        [Authorize]
        [ProducesResponseType<User>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpGet]
        public async Task<ActionResult<User>> GetDonneesUtilisateur()
        {
            return Ok(await _auth0Service.ObtenirDonneesUtilisateur(User));
        }

        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpPut]
        public async Task<IActionResult> PutDonneesUtilisateur(UserUpdateRequest userUpdateRequest)
        {
            await _auth0Service.MettreAJourDonneesUtilisateur(User, userUpdateRequest);

            return NoContent();
        }

        public record Claim(string Type, string Value);

        [Authorize]
        [ProducesResponseType<IEnumerable<Claim>>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpGet("claims")]
        public ActionResult<IEnumerable<Claim>> GetClaims()
        {
            return Ok(User.Claims.Select(c =>
                new Claim(c.Type, c.Value)
            ));
        }
    }
}
