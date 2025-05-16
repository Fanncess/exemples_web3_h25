using fichier_api.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace fichier_api.Models.Fichiers;

public class FichierDTO
{
    [Required]
    [Description("L'identifiant unique du fichier.")]
    [Example("1")]
    public long Id { get; set; }

    [Required]
    [Description("Le titre du fichier")]
    [MaxLength(256)]
    [MinLength(1)]
    [Example("Mon fichier")]
    public string Titre { get; set; }

    [Description("Le nom du fichier")]
    [MaxLength(256)]
    [MinLength(1)]
    [Example("fichier.txt")]
    public string NomFichier { get; set; }

    public FichierDTO(FichierModel fichier)
    {
        Id = fichier.Id;
        Titre = fichier.Titre;
        NomFichier = fichier.NomFichier;
    }
}
