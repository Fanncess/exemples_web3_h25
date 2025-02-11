using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using TacheApi.OpenApi;

namespace TacheApi.Models
{
    public class EtapeDTO
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

        public EtapeDTO(Etape etape)
        {
            Id = etape.Id;
            Nom = etape.Nom;
            EstAccomplie = etape.EstAccomplie;
        }
    }
}
