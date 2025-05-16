using fichier_api.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace fichier_api.Models.Fichiers;

public class FichierUpsertDTO {
    [Required]
    [Description("Le titre du fichier")]
    [MaxLength(256)]
    [MinLength(1)]
    [Example("Mon fichier")]
    public string Titre { get; set; }
}
