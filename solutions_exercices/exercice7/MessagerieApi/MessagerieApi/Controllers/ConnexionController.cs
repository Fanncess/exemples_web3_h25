using MessagerieApi.OpenApi;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace MessagerieApi.Models.Utilisateurs;

[Route("api/[controller]")]
[ApiController]
public class ConnexionController : ControllerBase
{
    private readonly AppDbContext _context;

    public ConnexionController(AppDbContext context)
    {
        _context = context;
    }

    [EndpointSummary("Retourne OK si les informations de connexion sont valides")]
    [EndpointDescription("Retourne OK si les informations de connexion sont valides, sinon Unauthorized")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [HttpGet]
    public async Task<ActionResult> GetConnexion(
        [FromHeader][Description("Nom d'utilisateur. Ex. : johndoe")] string nomUtilisateur,
        [FromHeader][Description("Mot de passe. Ex. : Password1!")] string motDePasse
    )
    {
        Utilisateur? utilisateur = await _context.Utilisateurs
            .Include(u => u.GroupesCrees)
            .Include(u => u.GroupesUtilisateurs)
                .ThenInclude(gu => gu.Groupe)
            .FirstOrDefaultAsync(u =>
                u.NomUtilisateur == nomUtilisateur &&
                u.MotDePasse == motDePasse
            );

        if (utilisateur is null)
        {
            return Unauthorized();
        }

        return Ok();
    }
}
