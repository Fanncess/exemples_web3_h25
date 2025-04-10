using MessagerieApi.OpenApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using MessagerieApi.Models.Utilisateurs;

namespace MessagerieApi.Models.Messages;

public class MessageUpsertDTO {
    [Required]
    [Description("Le texte du message")]
    [MaxLength(2048)]
    [MinLength(1)]
    [Example("Bonjour! Comment allez-vous?")]
    public string Texte { get; set; }
}
