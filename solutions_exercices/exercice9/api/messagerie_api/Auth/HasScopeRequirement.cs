using Microsoft.AspNetCore.Authorization;

namespace messagerie_api.Models;

/// <summary>
/// Représente un requirement pour vérifier si un utilisateur a un scope (permission) donné
/// </summary>
public class HasScopeRequirement : IAuthorizationRequirement
{
    public string Issuer { get; }
    public string Scope { get; }

    public HasScopeRequirement(string scope, string issuer)
    {
        Scope = scope ?? throw new ArgumentNullException(nameof(scope));
        Issuer = issuer ?? throw new ArgumentNullException(nameof(issuer));
    }
}
