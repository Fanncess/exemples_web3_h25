using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MessagerieApi.Models;
using System.ComponentModel;
using MessagerieApi.Models.Messages;
using MessagerieApi.Models.Utilisateurs;

namespace MessagerieApi.Controllers;
[Route("api/Groupes/{groupeId:long}/[controller]")]
[ApiController]
public class MessagesController : ControllerBase {
    private readonly AppDbContext _context;

    public MessagesController( AppDbContext context) {
        _context = context;
    }

    [EndpointSummary("Retourne les messages du groupe")]
    [EndpointDescription("Retourne les messages d'un groupe dont l'utilisateur fait partie")]
    [ProducesResponseType<MessageDTO>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessages(
        [Description("L'ID du groupe")] long groupeId,
        [FromHeader][Description("Nom d'utilisateur. Ex. : johndoe")] string nomUtilisateur,
        [FromHeader][Description("Mot de passe. Ex. : Password1!")] string motDePasse
    ) {
        Utilisateur? utilisateur = await GetUtilisateurAuthentifie(nomUtilisateur, motDePasse);
        if (utilisateur is null) {
            return Unauthorized();
        }

        if (!await GroupeExiste(groupeId)) {
            return NotFound();
        }

        if (!await UtilisateurEstDansGroupe(groupeId, utilisateur.Id)) {
            return Unauthorized();
            // return Forbid(); // Ne peut pas utiliser sans authentification sinon erreur 500
        }

        return await _context.Messages
            .Include(m => m.Auteur)
            .Where(m => m.GroupeId == groupeId)
            .Select(m => new MessageDTO(m))
            .ToListAsync();
    }

    [EndpointSummary("Ajoute un message au groupe")]
    [EndpointDescription("Permet à un utilisateur d'envoyer un message dans un groupe dont il fait partie.")]
    [ProducesResponseType<MessageDTO>(StatusCodes.Status201Created, "application/json")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost]
    public async Task<ActionResult<MessageDTO>> PostMessage(
        [Description("L'ID du groupe")] long groupeId,
        [FromHeader][Description("Nom d'utilisateur. Ex. : johndoe")] string nomUtilisateur,
        [FromHeader][Description("Mot de passe. Ex. : Password1!")] string motDePasse,
        [FromBody][Description("Le message à ajouter")] MessageUpsertDTO upsertDTO
    ) {
        Utilisateur? utilisateur = await GetUtilisateurAuthentifie(nomUtilisateur, motDePasse);
        if (utilisateur is null) {
            return Unauthorized();
        }

        if (!await GroupeExiste(groupeId)) {
            return NotFound();
        }

        if (!await UtilisateurEstDansGroupe(groupeId, utilisateur.Id)) {
            return Unauthorized();
            // return Forbid(); // Ne peut pas utiliser sans authentification sinon erreur 500
        }

        Message message = new(upsertDTO, utilisateur.Id, groupeId);

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMessages),
            new { groupeId },
            new MessageDTO(await _context.Messages.Include(m => m.Auteur).FirstAsync(m => m.Id == message.Id))
        );
    }

    private async Task<Utilisateur?> GetUtilisateurAuthentifie(string nomUtilisateur, string motDePasse) {
        return await _context.Utilisateurs
            .Include(u => u.GroupesCrees)
            .Include(u => u.GroupesUtilisateurs)
                .ThenInclude(gu => gu.Groupe)
            .FirstOrDefaultAsync(u =>
                u.NomUtilisateur == nomUtilisateur &&
                u.MotDePasse == motDePasse
            );
    }

    private async Task<bool> UtilisateurEstDansGroupe(long groupeId, long utilisateurId) {
        return await _context.GroupesUtilisateurs
        .AnyAsync(gu =>
            gu.GroupeId == groupeId &&
            gu.UtilisateurId == utilisateurId
        );
    }

    private async Task<bool> GroupeExiste(long groupeId) {
        return await _context.Groupes
            .AnyAsync(g => g.Id == groupeId);
    }
}
