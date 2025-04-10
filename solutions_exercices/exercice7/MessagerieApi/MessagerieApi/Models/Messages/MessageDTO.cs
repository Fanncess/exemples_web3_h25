using MessagerieApi.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MessagerieApi.Models.Messages;

public class MessageDTO {
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
    public DateTime DateAjout { get; set; } = DateTime.Now;

    [Required]
    [Description("Le nom d'utilisateur de l'auteur du message")]
    public string NomUtilisateurAuteur { get; set; }

    /// <summary>
    /// Constructeur d'un <see cref="MessageDTO"/> à partir d'un <see cref="Message"/>
    /// </summary>
    /// <param name="message"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public MessageDTO(Message message) {
        if (message.Auteur is null) {
            throw new ArgumentNullException("message.Auteur", "Avez-vous oublié d'Include Auteur?");
        }

        Id = message.Id;
        Texte = message.Texte;
        DateAjout = message.DateAjout;
        NomUtilisateurAuteur = message.Auteur.NomUtilisateur;
    }
}
