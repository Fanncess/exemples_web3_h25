using messagerie_api.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace messagerie_api.Models.Messages;

public class MessageUpsertDTO {
    [Required]
    [Description("Le texte du message")]
    [MaxLength(2048)]
    [MinLength(1)]
    [Example("Bonjour! Comment allez-vous?")]
    public string Texte { get; set; }

    [Required]
    [Description(
        """
        Le nom d'utilisateur de l'expéditeur.
        Permet à l'utilisateur de choisir le nom d'affichage du message.
        Simplifie l'API en permettant de ne pas avoir à gérer les utilisateurs dans la base de données.
        """
    )]
    [MaxLength(255)]
    [MinLength(1)]
    [Example("johndoe")]
    public string NomUtilisateur { get; set; }
}
