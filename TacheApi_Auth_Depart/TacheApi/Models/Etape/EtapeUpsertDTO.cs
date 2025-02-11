using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using TacheApi.OpenApi;

namespace TacheApi.Models
{
    public class EtapeUpsertDTO
    {
        [MaxLength(255)]
        [Description("Le nom de l'étape")]
        [Example("Acheter des bananes")]
        public string? Nom { get; set; }

        [Required]
        [Description("Indique si l'étape est accomplie")]
        [Example("false")]
        public bool EstAccomplie { get; set; }
    }
}
