using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using TacheApi.OpenApi;

namespace TacheApi.Models
{
    public class Tache
    {
        [Required]
        [Description("L'identifiant unique de la tâche")]
        public long Id { get; set; }

        [MaxLength(255)]
        [Description("Le nom de la tâche")]
        [Example("Faire les courses")]
        public string? Nom { get; set; }

        [Required]
        [Description("Indique si la tâche est accomplie")]
        [Example("false")]
        public bool EstAccomplie { get; set; }

        [Description("Champ secret que le client ne doit pas pouvoir manipuler")]
        public string? Secret { get; set; }

        [Description("Liste des étapes de la tâche")]
        public List<Etape> Etapes { get; set; } = new List<Etape>();

        public Tache()
        {
        }

        public Tache(TacheUpsertDTO dto)
        {
            Nom = dto.Nom;
            EstAccomplie = dto.EstAccomplie;
        }

        public void AppliquerUpsertDTO(TacheUpsertDTO dto)
        {
            Nom = dto.Nom;
            EstAccomplie = dto.EstAccomplie;
        }
    }
}
