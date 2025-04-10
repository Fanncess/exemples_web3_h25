using Microsoft.AspNetCore.Authorization;

namespace messagerie_api.Models;

/// <summary>
/// Service qui vérifie si un utilisateur a un scope (permission) donné
/// </summary>
public class HasScopeHandler : AuthorizationHandler<HasScopeRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasScopeRequirement requirement)
    {
        // Si l'utilisateur n'a pas de claim "scope" de l'issuer voulu, on ne fait rien
        if (!context.User.HasClaim(c => c.Type == "scope" && c.Issuer == requirement.Issuer)){
            return Task.CompletedTask;
        }

        // Sépare la string de scopes en un tableau
        var scopes = context.User.FindFirst(c => c.Type == "scope" && c.Issuer == requirement.Issuer)?.Value.Split(' ') ?? [];

        // Réussit si le tableau de scopes contient le scope requis
        if (scopes.Any(s => s == requirement.Scope))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
