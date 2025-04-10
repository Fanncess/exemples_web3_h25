using Microsoft.OpenApi.Models;

namespace messagerie_api.OpenApi;

public sealed class BearerOpenApiSecurityScheme : OpenApiSecurityScheme
{
    public BearerOpenApiSecurityScheme(IConfiguration configuration)
    {
        Name = "Authorization";
        In = ParameterLocation.Header;
        Type = SecuritySchemeType.Http;
        Scheme = "bearer";
        BearerFormat = "Json Web Token";
        Type = SecuritySchemeType.OAuth2;
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new($"https://{configuration["Auth0:Domain"]}/authorize?audience={configuration["Auth0:Audience"]}"),
                TokenUrl = new($"https://{configuration["Auth0:Domain"]}/oauth/token"),
                Scopes = new Dictionary<string, string>()
            },
        };
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        };
    }
}