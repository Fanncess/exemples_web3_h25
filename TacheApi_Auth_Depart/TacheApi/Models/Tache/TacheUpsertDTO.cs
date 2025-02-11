using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using TacheApi.OpenApi;

namespace TacheApi.Models
{
    public class TacheUpsertDTO
    {
        [MaxLength(255)]
        [Description("Le nom de la tâche")]
        [Example("Faire les courses")]
        public string? Nom { get; set; }

        [Required]
        [Description("Indique si la tâche est accomplie")]
        [Example("false")]
        public bool EstAccomplie { get; set; }
    }
}
