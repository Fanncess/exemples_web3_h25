using MessagerieApi.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MessagerieApi.Models.Groupes;

public class GroupeDTO {
    [Required]
    [Description("L'identifiant unique du groupe.")]
    [Example("1")]
    public long Id { get; set; }

    [Required]
    [Description("Le nom du groupe")]
    [MaxLength(255)]
    [MinLength(1)]
    [Example("Les invincibles")]
    public string Nom { get; set; }

    [Required]
    [Description("L'url de l'image du groupe")]
    [MaxLength(255)]
    [MinLength(1)]
    [Example("https://placehold.co/64x64/orangered/white?text=A")]
    public string Image { get; set; }

    [Required]
    [Description("L'identifiant unique de l'utilisateur ayant créé le groupe.")]
    [Example("1")]
    public long CreateurId { get; set; }

    public GroupeDTO(Groupe groupe) {
        Id = groupe.Id;
        Nom = groupe.Nom;
        Image = groupe.Image;
        CreateurId = groupe.CreateurId;
    }
}
