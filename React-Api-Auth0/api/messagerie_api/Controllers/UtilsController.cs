using Microsoft.AspNetCore.Mvc;
using messagerie_api.Models;
using messagerie_api.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace messagerie_api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class UtilsController : ControllerBase {
        private readonly Auth0Service _auth0Service;
        private readonly AppDbContext _context;

        public UtilsController(Auth0Service auth0Service, AppDbContext context) {
            _auth0Service = auth0Service;
            _context = context;
        }

        [Authorize]
        [EndpointSummary("Retourne le userId de l'access token")]
        [EndpointDescription("Ce point de terminaison est purement utilitaire pour vous aider à récupérer le userId d'Auth0 de vos utilisateurs.")]
        [ProducesResponseType<string>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpGet("user-id")]
        public ActionResult<IEnumerable<Claim>> GetUserId() {
            return Ok(_auth0Service.ObtenirIdUtilisateur(User));
        }

        [Authorize]
        [EndpointSummary("Retourne l'access token")]
        [EndpointDescription("Ce point de terminaison est purement utilitaire pour vous aider à récupérer l'access token.")]
        [ProducesResponseType<string>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpGet("access-token")]
        public ActionResult<IEnumerable<Claim>> GetAccessToken() {
            return Ok(User.FindFirst("jwt_token")!.Value);
        }

        [Authorize]
        [EndpointSummary("Retourne les claims de l'utilisateur")]
        [EndpointDescription("Ce point de terminaison est purement utilitaire pour vous aider à récupérer les claims de l'utilisateur.")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpGet("claims")]
        public IActionResult Claims()
        {
            return Ok(User.Claims.Select(c =>
                new
                {
                    c.Type,
                    c.Value
                }));
        }

    }
}
