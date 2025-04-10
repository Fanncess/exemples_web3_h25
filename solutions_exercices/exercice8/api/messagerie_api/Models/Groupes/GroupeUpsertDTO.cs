using messagerie_api.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace messagerie_api.Models.Groupes;

public class GroupeUpsertDTO {
    [Required]
    [Description("Le nom du groupe")]
    [MaxLength(255)]
    [MinLength(1)]
    [Example("Les invincibles")]
    public string Nom { get; set; }
}
