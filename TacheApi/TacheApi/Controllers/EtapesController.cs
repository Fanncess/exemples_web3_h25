using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TacheApi.Models;

namespace TacheApi.Controllers
{
    [Route("api/taches/{idTache:long}/[controller]")]
    [ApiController]
    public class EtapesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EtapesController(AppDbContext context)
        {
            _context = context;
        }

        [EndpointSummary("Récupère toutes les étapes d'une tâche")]
        [EndpointDescription("Récupère toutes les étapes d'une tâche de la base de données")]
        [ProducesResponseType<IEnumerable<EtapeDTO>>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtapeDTO>>> GetEtapes(
            [Description("L'identifiant de la tâche")] long idTache)
        {
            if (!TacheExists(idTache))
            {
                return NotFound();
            }

            return await _context.Etapes
                .Where(etape => etape.TacheId == idTache)
                .Select(etape => new EtapeDTO(etape))
                .ToListAsync();
        }

        [EndpointSummary("Récupère une étape d'une tâche")]
        [EndpointDescription("Récupère une étape d'une tâche de la base de données en fonction de son identifiant")]
        [ProducesResponseType<EtapeDetailsDTO>(StatusCodes.Status200OK, "application/json")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{id}")]
        public async Task<ActionResult<EtapeDetailsDTO>> GetEtape(
            [Description("L'identifiant de la tâche")] long idTache,
            [Description("L'identifiant de l'étape")] long id)
        {
            var etape = await _context.Etapes
                .Include(etape => etape.Tache)
                .SingleOrDefaultAsync(etape => etape.Id == id && etape.TacheId == idTache);

            if (etape == null)
            {
                return NotFound();
            }

            return new EtapeDetailsDTO(etape);
        }

        [EndpointSummary("Met à jour une étape d'une tâche")]
        [EndpointDescription("Met à jour une étape d'une tâche de la base de données en fonction de son identifiant")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEtape(
            [Description("L'identifiant de la tâche")] long idTache,
            [Description("L'identifiant de l'étape")] long id,
            [FromBody][Description("L'étape modifiée")] EtapeUpsertDTO etapeDTO)
        {
            var etape = await _context.Etapes
                .SingleOrDefaultAsync(etape => etape.Id == id && etape.TacheId == idTache);

            if (etape == null)
            {
                return NotFound();
            }

            etape.AppliquerUpsertDTO(etapeDTO);

            _context.Entry(etape).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [EndpointSummary("Ajoute une étape à une tâche")]
        [EndpointDescription("Ajoute une tâche à une tâche dans la base de données")]
        [ProducesResponseType<EtapeDTO>(StatusCodes.Status201Created, "application/json")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpPost]
        public async Task<ActionResult<EtapeDTO>> PostEtape(
            [Description("L'identifiant de la tâche")] long idTache,
            [FromBody][Description("L'étape à ajouter")] EtapeUpsertDTO etapeDTO)
        {
            if (!TacheExists(idTache))
            {
                return NotFound();
            }

            Etape etape = new Etape(etapeDTO, idTache);
            _context.Etapes.Add(etape);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEtape), new { id = etape.Id, idTache = idTache }, new EtapeDTO(etape));
        }

        [EndpointSummary("Supprime une étape d'une tâche")]
        [EndpointDescription("Supprime une étape d'une tâche de la base de données en fonction de son identifiant")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtape(
            [Description("L'identifiant de la tâche")] long idTache,
            [Description("L'identifiant de l'étape")] long id)
        {
            var etape = await _context.Etapes
                .SingleOrDefaultAsync(etape => etape.Id == id && etape.TacheId == idTache);

            if (etape == null)
            {
                return NotFound();
            }

            _context.Etapes.Remove(etape);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtapeExists(long id)
        {
            return _context.Etapes.Any(e => e.Id == id);
        }

        private bool TacheExists(long id)
        {
            return _context.Taches.Any(e => e.Id == id);
        }
    }
}
