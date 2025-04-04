using MessagerieApi.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using MessagerieApi.Models.GroupesUtilisateurs;
using MessagerieApi.Models.Utilisateurs;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessagerieApi.Models.Groupes;

public class Groupe {
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
    [ForeignKey("Utilisateur")] // CreateurId ne respecte pas la convention de nommage pour une clé étrangère (UtilisateurId), donc on doit spécifier le nom du modèle référencé
    public long CreateurId { get; set; }

    /// <summary>
    /// L'<see cref="Utilisateur">utilisateur</see> ayant créé le groupe. <br/>
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("L'utilisateur ayant créé le groupe.")]
    public Utilisateur Createur { get; set; } = null!;

    /// <summary>
    /// Liste des <see cref="GroupeUtilisateur">GroupeUtilisateur</see> du groupe.
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("Liste des GroupeUtilisateur du groupe")]
    public List<GroupeUtilisateur> GroupesUtilisateurs { get; set; } = null!;

    public Groupe() { }
}
