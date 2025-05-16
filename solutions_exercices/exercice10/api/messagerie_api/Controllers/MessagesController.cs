using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using messagerie_api.Models;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel;
using messagerie_api.Services;
using messagerie_api.Models.Messages;

namespace messagerie_api.Controllers;
[Route("api/Groupes/{groupeId:long}/[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private static readonly string[] _extensionsPermises = [".png", ".jpg", ".jpeg"];
    private readonly Auth0Service _auth0Service;
    private readonly AppDbContext _context;

    public MessagesController(Auth0Service auth0Service, AppDbContext context)
    {
        _auth0Service = auth0Service;
        _context = context;
    }

    [Authorize]
    [EndpointSummary("Retourne les messages du groupe")]
    [EndpointDescription("Retourne les messages d'un groupe dont l'utilisateur authentifié fait partie")]
    [ProducesResponseType<MessageDTO>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessages(
        [Description("L'ID du groupe")] long groupeId
    )
    {
        if (!await UtilisateurEstDansGroupe(groupeId))
        {
            return Forbid();
        }

        return await _context.Messages
            .Where(m => m.GroupeId == groupeId)
            .Select(m => new MessageDTO(m))
            .ToListAsync();
    }

    [Authorize]
    [EndpointSummary("Retourne un fichier d'un message")]
    [EndpointDescription("Retourne un fichier d'un message par son nom")]
    [ProducesResponseType<FileResult>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{messageId}/fichiers/{fichierNom}")]
    public async Task<ActionResult> GetMessageFichier(
        [Description("L'ID du groupe")] long groupeId,
        [Description("L'ID du message")] long messageId,
        [Description("Le nom du fichier")] string fichierNom
    )
    {
        if (!await UtilisateurEstDansGroupe(groupeId))
        {
            return Forbid();
        }

        Message? message = await _context.Messages
            .Where(m => m.GroupeId == groupeId && m.Id == messageId)
            .FirstOrDefaultAsync();

        if (message is null)
        {
            return NotFound();
        }

        if (!message.Fichiers.Contains(fichierNom))
        {
            return NotFound();
        }

        Stream? fichier = Fichier.ObtenirFichier(fichierNom);

        if (fichier is null)
        {
            return NotFound();
        }

        // Retourne le fichier
        return File(fichier, Fichier.ObtenirTypeContenu(fichierNom));
    }

    [Authorize]
    [EndpointSummary("Ajoute un message au groupe")]
    [EndpointDescription("Permet à un utilisateur d'envoyer un message dans un groupe dont il fait partie.")]
    [ProducesResponseType<MessageDTO>(StatusCodes.Status201Created, "application/json")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [Consumes("multipart/form-data")]
    [HttpPost]
    public async Task<ActionResult<MessageDTO>> PostMessage(
        [Description("L'ID du groupe")] long groupeId,
        [FromForm][Description("Le message à ajouter")] MessageUpsertDTO upsertDTO
    )
    {
        if (!await UtilisateurEstDansGroupe(groupeId))
        {
            return Forbid();
        }

        List<string> nomFichiers = [];
        if (upsertDTO.Fichiers is not null)
        {
            if (!Fichier.EstValide(upsertDTO.Fichiers, _extensionsPermises))
            {
                return BadRequest("Fichier invalide");
            }

            nomFichiers = await Fichier.Enregister(upsertDTO.Fichiers);
        }

        Message message = new(
            upsertDTO,
            _auth0Service.ObtenirIdUtilisateur(User),
            groupeId,
            nomFichiers
        );

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMessages),
            new { groupeId },
            new MessageDTO(message)
        );
    }

    private async Task<bool> UtilisateurEstDansGroupe(long groupeId)
    {
        return await _context.Groupes
        .AnyAsync(g =>
            g.Id == groupeId &&
            g.Utilisateurs.Contains(_auth0Service.ObtenirIdUtilisateur(User))
        );
    }
}
