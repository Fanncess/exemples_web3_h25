using System.Security.Claims;

namespace messagerie_api.Services;

public class Auth0Service
{
    public string ObtenirIdUtilisateur(ClaimsPrincipal utilisateur)
    {
        return utilisateur.FindFirst(ClaimTypes.NameIdentifier)!.Value;
    }
}
