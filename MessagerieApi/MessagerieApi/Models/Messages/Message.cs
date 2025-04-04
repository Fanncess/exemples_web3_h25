using MessagerieApi.Models.Groupes;
using MessagerieApi.Models.Utilisateurs;
using MessagerieApi.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessagerieApi.Models.Messages;

public class Message {
    [Required]
    [Description("L'identifiant unique du message.")]
    [Example("1")]
    public long Id { get; set; }

    [Required]
    [Description("Le texte du message")]
    [MaxLength(2048)]
    [MinLength(1)]
    [Example("Bonjour! Comment allez-vous?")]
    public string Texte { get; set; }

    [Required]
    [Description("La date d'ajout du message")]
    [Example("2025-02-27T16:34:18.128437-05:00")]
    public DateTime DateAjout { get; set; } = DateTime.UtcNow;

    [Required]
    [Description("L'identifiant unique de l'utilisateur ayant ajouté le message.")]
    [Example("1")]
    [ForeignKey("Utilisateur")]
    public long AuteurId { get; set; }

    /// <summary>
    /// L'<see cref="Utilisateur">utilisateur</see> ayant ajouté le message. <br/>
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("L'auteur du message")]
    public Utilisateur Auteur { get; set; } = null!;

    [Required]
    [Description("L'identifiant unique du groupe dans lequel le message a été ajouté")]
    [Example("1")]
    public long GroupeId { get; set; }

    /// <summary>
    /// Le <see cref="Groupe">groupe</see> dans lequel le message a été ajouté. <br/>
    /// </summary>
    /// <remarks>
    /// <strong>Attention :</strong> Cette propriété n'est pas nécessairement chargée lors de la lecture depuis la BD. <br/>
    /// Pour charger, il faut utiliser la méthode <a href="https://learn.microsoft.com/fr-ca/ef/core/querying/related-data/eager">Include</a> lors de la lecture.
    /// </remarks>
    [Description("Le groupe dans lequel le message a été ajouté")]
    public Groupe Groupe { get; set; } = null!;

    public Message() { }

    public Message(MessageUpsertDTO dto, long auteurId, long groupeId) {
        Texte = dto.Texte;
        AuteurId = auteurId;
        GroupeId = groupeId;
    }
}
