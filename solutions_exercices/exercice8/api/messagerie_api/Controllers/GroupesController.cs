using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using messagerie_api.Models;
using messagerie_api.Models.Groupes;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel;
using messagerie_api.Services;

namespace messagerie_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupesController : ControllerBase
    {
        private readonly Auth0Service _auth0Service;
        private readonly AppDbContext _context;

        public GroupesController(Auth0Service auth0Service, AppDbContext context)
        {
            _auth0Service = auth0Service;
            _context = context;
        }

        [Authorize]
        [EndpointSummary("Obtenir les groupes de l'utilisateur")]
        [EndpointDescription("Obtient les groupes dont l'utilisateur authentifié fait partie")]
        [ProducesResponseType<GroupeDTO>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupeDTO>>> GetGroupes()
        {
            return await _context.Groupes
                .Where(g => g.Utilisateurs.Contains(_auth0Service.ObtenirIdUtilisateur(User)))
                .Select(g => new GroupeDTO(g))
                .ToListAsync();
        }

        [Authorize]
        [EndpointSummary("Obtenir les informations d'un groupe")]
        [EndpointDescription("Obtient les informations d'un groupe dont l'utilisateur fait partie")]
        [ProducesResponseType<GroupeDetailsDTO>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{groupeId}")]
        public async Task<ActionResult<GroupeDetailsDTO>> GetGroupe(
            [Description("L'ID du groupe")] long groupeId
        )
        {
            Groupe? groupe = await _context.Groupes
                .FirstOrDefaultAsync(g => g.Id == groupeId);

            if (groupe is null)
            {
                return NotFound();
            }

            if (!groupe.Utilisateurs.Contains(_auth0Service.ObtenirIdUtilisateur(User)))
            {
                return Forbid();
            }

            return new GroupeDetailsDTO(groupe);
        }

        [Authorize]
        [EndpointSummary("Ajoute un groupe")]
        [EndpointDescription(
            """
            Permet à un utilisateur de créer un groupe.<br/>
            L'utilisateur sera automatiquement ajouté au groupe.<br/>
            L'utilisateur deviendra le créateur du groupe.<br/>
            L'utilisateur doit avoir créé un profil avant de créer un groupe.
            """
        )]
        [ProducesResponseType<GroupeDTO>(StatusCodes.Status201Created, "application/json")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpPost]
        public async Task<ActionResult<GroupeDTO>> PostGroupe(
            [FromBody][Description("Le groupe à ajouter")] GroupeUpsertDTO upsertDTO
        )
        {
            Groupe groupe = new Groupe(upsertDTO, _auth0Service.ObtenirIdUtilisateur(User));

            _context.Groupes.Add(groupe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetGroupe),
                new { groupeId = groupe.Id },
                new GroupeDTO(groupe)
            );
        }

        [Authorize]
        [EndpointSummary("Ajoute un utilisateur à un groupe")]
        [EndpointDescription("Permet au créateur d'un groupe d'ajouté un utilisateur au groupe.")]
        [ProducesResponseType<string>(StatusCodes.Status201Created, "application/json")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [HttpPost("{groupeId}/Utilisateurs")]
        public async Task<ActionResult<string>> PostGroupeUtilisateur(
            [Description("L'ID du groupe dans lequel ajouter l'utilisateur")] long groupeId,
            [FromBody][Description("L'ID de l'utilisateur à ajouter")] string utilisateurId
        )
        {
            Groupe? groupe = await _context.Groupes
                .FirstOrDefaultAsync(g => g.Id == groupeId);

            if (groupe is null)
            {
                return NotFound();
            }

            if (groupe.CreateurId != _auth0Service.ObtenirIdUtilisateur(User))
            {
                return Forbid();
            }

            if (groupe.Utilisateurs.Contains(utilisateurId))
            {
                return Conflict();
            }

            groupe.Utilisateurs.Add(utilisateurId);
            _context.Entry(groupe).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetGroupe),
                new { groupeId = groupe.Id },
                utilisateurId
            );
        }
    }
}
