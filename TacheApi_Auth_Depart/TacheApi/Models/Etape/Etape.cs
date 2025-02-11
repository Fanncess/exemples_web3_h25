using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using TacheApi.OpenApi;

namespace TacheApi.Models
{
    public class Etape
    {
        [Required]
        [Description("L'identifiant unique de l'étape")]
        public long Id { get; set; }

        [MaxLength(255)]
        [Description("Le nom de l'étape")]
        [Example("Acheter des bananes")]
        public string? Nom { get; set; }

        [Required]
        [Description("Indique si l'étape est accomplie")]
        [Example("false")]
        public bool EstAccomplie { get; set; }

        [Required]
        [Description("Clé étrangère de la tâche associée à l'étape")]
        [Example("1")]
        public long TacheId { get; set; }

        [Required]
        [Description("Lien vers la tâche associée à l'étape")]
        public Tache? Tache { get; set; }

        public Etape()
        {
        }

        public Etape(EtapeUpsertDTO dto, long tacheId)
        {
            Nom = dto.Nom;
            EstAccomplie = dto.EstAccomplie;
            TacheId = tacheId;
        }

        public void AppliquerUpsertDTO(EtapeUpsertDTO dto)
        {
            Nom = dto.Nom;
            EstAccomplie = dto.EstAccomplie;
        }
    }
}
