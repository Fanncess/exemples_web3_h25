using fichier_api.Models.Fichiers;
using Microsoft.EntityFrameworkCore;

namespace fichier_api.Models;

public class AppDbContext : DbContext {
    private readonly IConfiguration _configuration;

    public DbSet<FichierModel> Fichiers { get; set; } = null!;

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

    private void SeedData(ModelBuilder modelBuilder) { }
}
