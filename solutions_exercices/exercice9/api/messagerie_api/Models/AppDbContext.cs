using messagerie_api.Models.Groupes;
using messagerie_api.Models.Messages;
using Microsoft.EntityFrameworkCore;

namespace messagerie_api.Models;

public class AppDbContext : DbContext {
    private readonly IConfiguration _configuration;

    public DbSet<Groupe> Groupes { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;

    public AppDbContext(IConfiguration configuration) : base() {
        _configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options) {
        options.UseInMemoryDatabase(_configuration.GetConnectionString("DbName")!);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder) {
        modelBuilder.Entity<Groupe>().HasData(
            new Groupe {
                Id = 1,
                Nom = "Les invincibles",
                CreateurId = "auth0|67bf4268e6c019494585e130", // johndoe
                Utilisateurs = new List<string> {
                    "auth0|67bf4268e6c019494585e130", // johndoe
                    "auth0|67bf42a368be7b245b4ca1e1"  // janedoe
                }
            },
            new Groupe {
                Id = 2,
                Nom = "Les fantastiques",
                CreateurId = "auth0|67bf4268e6c019494585e130", // johndoe
                Utilisateurs = new List<string> {
                    "auth0|67bf4268e6c019494585e130", // johndoe
                }
            },
            new Groupe {
                Id = 3,
                Nom = "Les mousquetaires",
                CreateurId = "auth0|67bf42a368be7b245b4ca1e1", // janedoe
                Utilisateurs = new List<string> {
                    "auth0|67bf42a368be7b245b4ca1e1"  // janedoe
                }
            }
        );

        modelBuilder.Entity<Message>().HasData(
            new Message {
                Id = 1,
                Texte = "Bonjour! Comment allez-vous?",
                DateAjout = DateTime.UtcNow,
                UtilisateurId = "auth0|67bf4268e6c019494585e130", // johndoe
                NomUtilisateur = "johndoe",
                GroupeId = 1
            },
            new Message {
                Id = 2,
                Texte = "Salut! Ça va bien, merci!",
                DateAjout = DateTime.UtcNow,
                UtilisateurId = "auth0|67bf42a368be7b245b4ca1e1", // janedoe
                NomUtilisateur = "janedoe",
                GroupeId = 1
            }
        );
    }
}
