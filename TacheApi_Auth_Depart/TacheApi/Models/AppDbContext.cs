using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

namespace TacheApi.Models
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public DbSet<Tache> Taches { get; set; } = null!;
        public DbSet<Etape> Etapes { get; set; } = null!;

        public AppDbContext(IConfiguration configuration) : base()
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseInMemoryDatabase(_configuration.GetConnectionString("DbName")!);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tache>().HasData(
                new Tache
                {
                    Id = 1,
                    Nom = "Faire les courses",
                    EstAccomplie = false,
                    Secret = "secret tâche 1",
                },
                new Tache
                {
                    Id = 2,
                    Nom = "Faire le ménage",
                    EstAccomplie = true,
                    Secret = "secret tâche 2",
                },
                new Tache
                {
                    Id = 3,
                    Nom = "Aller au garage",
                    EstAccomplie = false,
                    Secret = "secret tâche 3",
                }
            );

            modelBuilder.Entity<Etape>().HasData(
                new Etape
                {
                    Id = 1,
                    Nom = "Acheter des bananes",
                    EstAccomplie = false,
                    TacheId = 1,
                },
                new Etape
                {
                    Id = 2,
                    Nom = "Acheter du lait",
                    EstAccomplie = false,
                    TacheId = 1,
                },
                new Etape
                {
                    Id = 3,
                    Nom = "Époussetage",
                    EstAccomplie = false,
                    TacheId = 2,
                },
                new Etape
                {
                    Id = 4,
                    Nom = "Balayeuse",
                    EstAccomplie = false,
                    TacheId = 2,
                }
            );
        }
    }
}
