using MessagerieApi.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using MessagerieApi.Models.Utilisateurs;
using MessagerieApi.Models.Groupes;

namespace MessagerieApi.Models.GroupesUtilisateurs;

/// <summary>
/// Représente la table de jointure résultant de la relation n-n entre les groupes et les utilisateurs.
/// </summary>
public class GroupeUtilisateur {
    [Required]
    [Description("L'identifiant unique de la relation entre un groupe et un utilisateur")]
    [Example("1")]
    public long Id { get; set; }

    [Required]
    [Description("L'identifiant unique de l'utilisateur.")]
    [Example("1")]
    public long UtilisateurId { get; set; }

    [Required]
    [Description("L'identifiant unique du groupe")]
    [Example("1")]
    public long GroupeId { get; set; }

    /// <summary>
    /// Lien vers l'<see cref="Utilisateur">utilisateur</see> associé à la relation.
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("Lien vers l'utilisateur associé à la relation.")]
    public Utilisateur Utilisateur { get; set; } = null!;

    /// <summary>
    /// Lien vers le <see cref="Groupe">groupe</see> associé à la relation.
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("Lien vers le groupe associé à la relation.")]
    public Groupe Groupe { get; set; } = null!;

    public GroupeUtilisateur() { }
}
