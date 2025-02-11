using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TacheApi.Models;
using TacheApi.Services;

namespace TacheApi.Controllers
{
    [Route("api/taches/{idTache:long}/[controller]")]
    [ApiController]
    public class EtapesController : ControllerBase
    {
        private readonly Auth0Service _auth0Service;
        private readonly AppDbContext _context;

        public EtapesController(Auth0Service auth0Service, AppDbContext context)
        {
            _auth0Service = auth0Service;
            _context = context;
        }

        [Authorize]
        [EndpointSummary("Met à jour une étape d'une tâche")]
        [EndpointDescription("Met à jour une étape d'une tâche de la base de données en fonction de son identifiant")]
        [ProducesResponseType(StatusCodes.Status204NoContent)] // L'étape a été modifiée avec succès
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // L'EtapeUpsertDTO reçu est invalide
        [ProducesResponseType(StatusCodes.Status401Unauthorized)] // Il est possible que l'utilisateur ne soit pas authentifié
        [ProducesResponseType(StatusCodes.Status403Forbidden)] // Il est possible que l'utilisateur ne soit pas le propriétaire de la tâche
        [ProducesResponseType(StatusCodes.Status404NotFound)] // Il est possible que l'étape n'existe pas
        [HttpPut("{idEtape}")]
        public async Task<IActionResult> PutEtape(
            [Description("L'identifiant de la tâche")] long idTache,
            [Description("L'identifiant de l'étape")] long idEtape,
            [FromBody][Description("L'étape modifiée")] EtapeUpsertDTO etapeDTO)
        {
            var etape = await _context.Etapes // Récupère les étapes
                .SingleOrDefaultAsync( // Récupère une seule étape
                    etape => etape.Id == idEtape && // Vérifie que l'étape existe
                    etape.TacheId == idTache // Vérifie que l'étape appartient bien à la tâche
                );

            // Si la tâche n'existe pas, retourne une erreur 404
            if (etape == null)
            {
                return NotFound();
            }

            // Si l'utilisateur n'est pas le propriétaire de la tâche, retourne une erreur 403
            if (!TacheAppartientAUtilisateur(idTache, User))
            {
                return Forbid();
            }

            // Applique les modifications à l'étape
            etape.AppliquerUpsertDTO(etapeDTO);
            _context.Entry(etape).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Retourne une réponse vide (convention avec PUT) pour indiquer que l'opération a réussi
            return NoContent();
        }

        [Authorize]
        [EndpointSummary("Ajoute une étape à une tâche")]
        [EndpointDescription("Ajoute une tâche à une tâche dans la base de données")]
        [ProducesResponseType<EtapeDTO>(StatusCodes.Status201Created, "application/json")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpPost]
        public async Task<ActionResult<EtapeDTO>> PostEtape(
            [Description("L'identifiant de la tâche")] long idTache,
            [FromBody][Description("L'étape à ajouter")] EtapeUpsertDTO etapeDTO)
        {
            if (!TacheExiste(idTache))
            {
                return NotFound();
            }

            if (!TacheAppartientAUtilisateur(idTache, User))
            {
                return Forbid();
            }

            Etape etape = new Etape(etapeDTO, idTache);
            _context.Etapes.Add(etape);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(TachesController.GetTache),
                new {
                    controller = "Taches", // Nom du contrôleur sans le suffixe "Controller"
                    id = idTache // Paramètre de la méthode GetTache
                },
                new EtapeDTO(etape)
            );
        }

        [Authorize("delete:etapes")]
        [EndpointSummary("Supprime une étape d'une tâche")]
        [EndpointDescription("Supprime une étape d'une tâche de la base de données en fonction de son identifiant")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpDelete("{idEtape}")]
        public async Task<IActionResult> DeleteEtape(
            [Description("L'identifiant de la tâche")] long idTache,
            [Description("L'identifiant de l'étape")] long idEtape)
        {
            var etape = await _context.Etapes
                .SingleOrDefaultAsync(etape =>
                    etape.Id == idEtape &&
                    etape.TacheId == idTache
                );

            if (etape == null)
            {
                return NotFound();
            }

            if (!TacheAppartientAUtilisateur(idTache, User))
            {
                return Forbid();
            }

            _context.Etapes.Remove(etape);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtapeExiste(long id)
        {
            return _context.Etapes.Any(e => e.Id == id);
        }

        private bool TacheExiste(long id)
        {
            return _context.Taches.Any(e => e.Id == id);
        }

        private bool TacheAppartientAUtilisateur(long id, ClaimsPrincipal utilisateur)
        {
            return _context.Taches.Any(e =>
                e.Id == id &&
                e.UserId == _auth0Service.ObtenirIdUtilisateur(utilisateur)
            );
        }
    }
}
