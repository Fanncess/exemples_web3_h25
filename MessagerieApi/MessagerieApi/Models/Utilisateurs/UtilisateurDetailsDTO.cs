using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using MessagerieApi.OpenApi;
using MessagerieApi.Models.Groupes;

namespace MessagerieApi.Models.Utilisateurs;

public class UtilisateurDetailsDTO {
    [Required]
    [Description("L'identifiant unique de l'utilisateur.")]
    [Example("1")]
    public long Id { get; set; }

    [Required]
    [Description("Le nom d'utilisateur de l'utilisateur")]
    [MaxLength(255)]
    [MinLength(1)]
    [Example("johndoe")]
    public string NomUtilisateur { get; set; }

    [Required]
    [Description("Liste des groupes dont l'utilisateur fait partie")]
    public List<GroupeDTO> Groupes { get; set; }

    /// <summary>
    /// Constructeur d'un UtilisateurDetailsDTO à partir d'un Utilisateur
    /// </summary>
    /// <param name="utilisateur"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public UtilisateurDetailsDTO(Utilisateur utilisateur) {
        if (utilisateur.GroupesUtilisateurs is null) {
            throw new ArgumentNullException("utilisateur.GroupesUtilisateurs", "Avez-vous oublié d'Include GroupesUtilisateurs?");
        }

        Id = utilisateur.Id;
        NomUtilisateur = utilisateur.NomUtilisateur;
        Groupes = utilisateur.GroupesUtilisateurs.Select(static gu => {
            if (gu.Groupe is null) {
                throw new ArgumentNullException(
                    "utilisateur.GroupesUtilisateurs.Groupe",
                    "Avez-vous oublié de ThenInclude les Groupe de GroupesUtilisateurs?"
                );
            }
            return new GroupeDTO(gu.Groupe);
        }).ToList();
    }
}
