using System.Security.Claims;

namespace fichier_api.Services;

public class Auth0Service
{
    public string ObtenirIdUtilisateur(ClaimsPrincipal utilisateur)
    {
        return utilisateur.FindFirst(ClaimTypes.NameIdentifier)!.Value;
    }
}
