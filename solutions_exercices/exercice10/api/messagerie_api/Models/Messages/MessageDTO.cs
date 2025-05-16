using messagerie_api.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace messagerie_api.Models.Messages;

public class MessageDTO
{
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
    [Description("Le nom de l'utilisateur ayant ajouté le message")]
    [Example("johndoe")]
    [MaxLength(255)]
    [MinLength(1)]
    public string NomUtilisateur { get; set; }

    [Description("La liste des fichiers joints au message")]
    [Example("""["fichier1.txt", "fichier2.txt"]""")]
    public List<string> Fichiers { get; set; } = new List<string>();

    /// <summary>
    /// Constructeur d'un <see cref="MessageDTO"/> à partir d'un <see cref="Message"/>
    /// </summary>
    /// <param name="message"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public MessageDTO(Message message)
    {
        Id = message.Id;
        Texte = message.Texte;
        DateAjout = message.DateAjout;
        NomUtilisateur = message.NomUtilisateur;
        Fichiers = message.Fichiers;
    }
}
