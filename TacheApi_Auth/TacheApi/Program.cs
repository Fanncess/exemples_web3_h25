using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using TacheApi.Models;
using TacheApi.OpenApi;
using TacheApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>();
new AppDbContext(builder.Configuration).Database.EnsureCreated();

var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = domain;
        options.Audience = builder.Configuration["Auth0:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = ClaimTypes.NameIdentifier,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Ajoute une policy pour chaque scope (permission) de l'API
    string[] scopes = ["delete:taches", "delete:etapes"];

    foreach (string scope in scopes)
    {
        options.AddPolicy(scope, policy => policy.Requirements.Add(
            new HasScopeRequirement(scope, domain))
        );
    }
});

builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
builder.Services.AddSingleton<Auth0Service>();

builder.Services.AddOpenApi(options =>
{
    options.AddSchemaTransformer<ExampleSchemaTransformer>();
    options.AddDocumentTransformer<BearerSecuritySchemeDocumentTransformer>();
    options.AddOperationTransformer<BearerSecuritySchemeOperationTransformer>();
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.RoutePrefix = "";
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
        options.OAuthClientId(builder.Configuration["Auth0:ClientId"]);
        options.OAuthClientSecret(builder.Configuration["Auth0:ClientSecret"]);
    });
}

app.UseHttpsRedirection();

app.UseAuthentication(); // Doit être placé avant UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();
