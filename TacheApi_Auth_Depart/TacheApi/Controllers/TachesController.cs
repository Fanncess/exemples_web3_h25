using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
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
    [Route("api/[controller]")]
    [ApiController]
    public class TachesController : ControllerBase
    {
        private readonly Auth0Service _auth0Service;
        private readonly AppDbContext _context;

        public TachesController(AppDbContext context, Auth0Service auth0Service)
        {
            _context = context;
            _auth0Service = auth0Service;
        }

        [Authorize]
        [EndpointSummary("Récupère toutes les tâches de l'utilisateur")]
        [EndpointDescription("Récupère toutes les tâches de l'utilisateur de la base de données")]
        [ProducesResponseType<IEnumerable<TacheDTO>>(StatusCodes.Status200OK, "application/json")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TacheDTO>>> GetTaches()
        {
            return await _context.Taches // Récupère les tâches
                .Where(tache => tache.UserId == _auth0Service.ObtenirIdUtilisateur(User)) // pour faire le lien avec l'utilisateur
                .Select(tache => new TacheDTO(tache)) // Transforme les tâches en TacheDTO
                .ToListAsync(); // Récupère les tâches sous forme de liste
        }
        [Authorize]
        [EndpointSummary("Récupère une tâche de l'utilisateur")]
        [EndpointDescription("Récupère une tâche de l'utilisateur de la base de données en fonction de son identifiant")]
        [ProducesResponseType<TacheDetailsDTO>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{id}")]
        public async Task<ActionResult<TacheDetailsDTO>> GetTache(
            [Description("L'identifiant de la tâche à récupérer")] long id)
        {
            var tache = await _context.Taches
                .Include(tache => tache.Etapes)
                .SingleOrDefaultAsync(tache => tache.Id == id);

            if (tache == null)
            {
                return NotFound();
            }
            if (!TacheAppartientAUtilisateur(id, User))
            {
                return Forbid(); // 403
            }

            return new TacheDetailsDTO(tache);
        }
        [Authorize]
        [EndpointSummary("Met à jour une tâche de l'utilisateur")]
        [EndpointDescription("Met à jour une tâche de l'utilisateur de la base de données en fonction de son identifiant")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTache(
            [Description("L'identifiant de la tâche à modifier")] long id,
            [FromBody][Description("La tâche modifiée")] TacheUpsertDTO tacheDTO)
        {
            var tache = await _context.Taches.FindAsync(id);

            if (tache == null)
            {
                return NotFound();
            }
            if (!TacheAppartientAUtilisateur(id, User))
            {
                return Forbid(); // 403
            }

            tache.AppliquerUpsertDTO(tacheDTO);
            _context.Entry(tache).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [EndpointSummary("Ajoute une tâche à l'utilisateur")]
        [EndpointDescription("Ajoute une tâche à l'utilisateur dans la base de données")]
        [ProducesResponseType<TacheDTO>(StatusCodes.Status201Created, "application/json")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost]
        public async Task<ActionResult<TacheDTO>> PostTache(
            [FromBody][Description("La tâche à ajouter")] TacheUpsertDTO tacheDTO)
        {
            Tache tache = new Tache(
                tacheDTO,
               _auth0Service.ObtenirIdUtilisateur(User)
            );
            _context.Taches.Add(tache);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetTache),
                new { id = tache.Id },
                new TacheDTO(tache)
            );
        }

        [Authorize("delete:taches")]
        [EndpointSummary("Supprime une tâche")]
        [EndpointDescription("Supprime une tâche de la base de données en fonction de son identifiant")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTache(
              [Description("L'identifiant de la tâche à supprimer")] long id)
        {
            var tache = await _context.Taches
                .Include(tache => tache.Etapes)
                .SingleOrDefaultAsync(tache => tache.Id == id);


            if (tache == null)
            {
                return NotFound();
            }
            if (!TacheAppartientAUtilisateur(id, User))
            {
                return Forbid(); // 403
            }

            _context.Taches.Remove(tache);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool TacheAppartientAUtilisateur(long tacheId, ClaimsPrincipal utilisateur)
        {

            return _context.Taches.Any(tache => tache.Id == tacheId && tache.UserId == _auth0Service.ObtenirIdUtilisateur(utilisateur)
            );
        }
    }
}
