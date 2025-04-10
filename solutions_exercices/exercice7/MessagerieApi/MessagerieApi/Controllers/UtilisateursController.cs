using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace MessagerieApi.Models.Utilisateurs;

[Route("api/[controller]")]
[ApiController]
public class UtilisateursController : ControllerBase
{
    private readonly AppDbContext _context;

    public UtilisateursController(AppDbContext context)
    {
        _context = context;
    }

    [EndpointSummary("Retourne les informations d'un utilisateur")]
    [EndpointDescription("Retourne les informations d'un utilisateur par ses informations de connexion")]
    [ProducesResponseType<UtilisateurDetailsDTO>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet]
    public async Task<ActionResult<UtilisateurDetailsDTO>> GetUtilisateur(
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
            return NotFound();
        }

        return new UtilisateurDetailsDTO(utilisateur);
    }
}
