using MessagerieApi.Models.Groupes;
using MessagerieApi.Models.GroupesUtilisateurs;
using MessagerieApi.Models.Messages;
using MessagerieApi.Models.Utilisateurs;
using Microsoft.EntityFrameworkCore;

namespace MessagerieApi.Models;

public class AppDbContext : DbContext {
    private readonly IConfiguration _configuration;

    public DbSet<Groupe> Groupes { get; set; } = null!;
    public DbSet<Utilisateur> Utilisateurs { get; set; } = null!;
    public DbSet<GroupeUtilisateur> GroupesUtilisateurs { get; set; } = null!;
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
        modelBuilder.Entity<Utilisateur>().HasData(
            new Utilisateur {
                Id = 1,
                NomUtilisateur = "johndoe",
                MotDePasse = "Password1!",
            },
            new Utilisateur {
                Id = 2,
                NomUtilisateur = "janedoe",
                MotDePasse = "Password1!",
            }
        );

        modelBuilder.Entity<Groupe>().HasData(
            new Groupe {
                Id = 1,
                Nom = "Les invincibles",
                CreateurId = 1, // johndoe
                Image = "https://placehold.co/64x64/orangered/white?text=I",
            },
            new Groupe {
                Id = 2,
                Nom = "Les fantastiques",
                CreateurId = 1, // johndoe
                Image = "https://placehold.co/64x64/royalblue/white?text=F",
            },
            new Groupe {
                Id = 3,
                Nom = "Les mousquetaires",
                CreateurId = 2, // janedoe
                Image = "https://placehold.co/64x64/orange/white?text=M",
            }
        );

        modelBuilder.Entity<GroupeUtilisateur>().HasData(
            new GroupeUtilisateur {
                Id = 1,
                GroupeId = 1,
                UtilisateurId = 1, // johndoe
            },
            new GroupeUtilisateur {
                Id = 2,
                GroupeId = 1,
                UtilisateurId = 2, // janedoe
            },
            new GroupeUtilisateur {
                Id = 3,
                GroupeId = 2,
                UtilisateurId = 1, // johndoe
            },
            new GroupeUtilisateur {
                Id = 4,
                GroupeId = 3,
                UtilisateurId = 2, // janedoe
            }
        );

        modelBuilder.Entity<Message>().HasData(
            new Message {
                Id = 1,
                Texte = "Bonjour tout le monde!",
                AuteurId = 1, // johndoe
                GroupeId = 1,
            },
            new Message {
                Id = 2,
                Texte = "Salut! Comment ça va?",
                AuteurId = 2, // janedoe
                GroupeId = 1,
            },

            new Message {
                Id = 3,
                Texte = "Bonjour! Je suis très heureux de vous voir!",
                AuteurId = 1, // johndoe
                GroupeId = 2,
            },

            new Message {
                Id = 4,
                Texte = "Bonjour! Je suis très heureuse de vous voir!",
                AuteurId = 2, // janedoe
                GroupeId = 3,
            }
        );
    }
}
