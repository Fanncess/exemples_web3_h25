using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace messagerie_api.OpenApi;

public sealed class BearerSecuritySchemeOperationTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider, IConfiguration configuration) : IOpenApiOperationTransformer
{
    public async Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken cancellationToken)
    {
        if (!context.Description.ActionDescriptor.EndpointMetadata.OfType<AuthorizeAttribute>().Any())
        {
            return;
        }
        var authPolicies = context.Description.ActionDescriptor.EndpointMetadata.OfType<AuthorizeAttribute>().Select(attr => attr.Policy).Where(policy => policy is not null).ToList();
        var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
        if (authenticationSchemes.Any(authScheme => authScheme.Name == "Bearer"))
        {
            operation.Security ??= [];
            operation.Security.Add(new() { [new BearerOpenApiSecurityScheme(configuration)] = authPolicies });
        }
    }
}