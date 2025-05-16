using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fichier_api.Models;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel;
using fichier_api.Models.Fichiers;

namespace fichier_api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class FichiersController : ControllerBase
{
    private static readonly string[] _extensionsPermises = [".png", ".jpg", ".jpeg", ".pdf", ".docx", ".xlsx", ".txt"];
    private readonly AppDbContext _context;

    public FichiersController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [EndpointSummary("Retourne les fichiers")]
    [EndpointDescription("Retourne tous les fichiers de la BD")]
    [ProducesResponseType<FichierDTO>(StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FichierDTO>>> GetFichiers()
    {
        return await _context.Fichiers
            .Select(f => new FichierDTO(f))
            .ToListAsync();
    }

    [Authorize]
    [EndpointSummary("Retourne le binaire d'un fichier")]
    [EndpointDescription("Retourne le binaire d'un fichier de la BD")]
    [ProducesResponseType<FileResult>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{fichierId}")]
    public async Task<ActionResult> GetBinaireFichier(
        [Description("L'ID du fichier")] long fichierId
    )
    {
        throw new NotImplementedException("Cette méthode n'est pas encore implémentée");
    }

    [Authorize]
    [EndpointSummary("Ajoute un fichier")]
    [EndpointDescription("Permet d'ajouter un fichier à la BD")]
    [ProducesResponseType<FichierDTO>(StatusCodes.Status201Created, "application/json")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Consumes("multipart/form-data")]
    [HttpPost]
    public async Task<ActionResult<FichierDTO>> PostFichier(
        [FromForm][Description("Le fichier à ajouter")] FichierUpsertDTO upsertDTO
    )
    {
        FichierModel fichier = new(upsertDTO, "nomFichier");

        _context.Fichiers.Add(fichier);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFichiers), new FichierDTO(fichier));
    }
}
