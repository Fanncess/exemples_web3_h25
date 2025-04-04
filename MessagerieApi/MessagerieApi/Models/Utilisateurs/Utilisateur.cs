using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using MessagerieApi.OpenApi;
using MessagerieApi.Models.GroupesUtilisateurs;
using MessagerieApi.Models.Groupes;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MessagerieApi.Models.Utilisateurs;

[Index(nameof(NomUtilisateur), IsUnique = true)] // Notez que cette contrainte ne fonctionne pas, car on utilise une BD en mémoire.
public class Utilisateur {
    [Required]
    [Description("L'identifiant unique de l'utilisateur.")]
    [Example("1")]
    public long Id { get; set; }

    [Required]
    [Description("Le nom d'utilisateur de l'utilisateur")]
    [MaxLength(255)]
    [MinLength(1)]
    [Example("johndoe")]
    public string NomUtilisateur { get; set; }

    [Required]
    [Description("Le mot de passe de l'utilisateur")]
    [MaxLength(255)]
    [MinLength(7)]
    [Example("Password1!")]
    public string MotDePasse { get; set; }

    /// <summary>
    /// Liste des <see cref="Groupe">groupes</see> créés par l'utilisateur.
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("Liste des groupes créés par l'utilisateur")]
    [ForeignKey("CreateurId")] // La clé entrangère (CreateurId) dans Groupe ne respecte pas la convention de nommage (UtilisateurId), donc on doit spécifier le nom de la propriété référencée
    public List<Groupe> GroupesCrees { get; set; } = null!;

    /// <summary>
    /// Liste des <see cref="GroupeUtilisateur">GroupeUtilisateur</see> de l'utilisateur.
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("Liste des GroupeUtilisateur de l'utilisateur")]
    public List<GroupeUtilisateur> GroupesUtilisateurs { get; set; } = null!;

    public Utilisateur() { }
}
