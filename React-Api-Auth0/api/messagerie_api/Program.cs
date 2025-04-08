using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using messagerie_api.Models;
using messagerie_api.OpenApi;
using messagerie_api.Services;

var builder = WebApplication.CreateBuilder(args);

var allowedClientUrl = builder.Configuration["AllowedClientUrl"]!;

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedClientUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>();
new AppDbContext(builder.Configuration).Database.EnsureCreated();

var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.Authority = domain;
        options.Audience = builder.Configuration["Auth0:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters {
            NameClaimType = ClaimTypes.NameIdentifier,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true
        };
        // Ajout du JWT aux claims apr�s qu'il soit valid�
        options.Events = new JwtBearerEvents {
            OnTokenValidated = context => {
                var token = context.SecurityToken.UnsafeToString();
                if (token != null) {
                    context.Principal?.AddIdentity(new ClaimsIdentity(new[]
                    {
                        new Claim("jwt_token", token)
                    }));
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options => {
    string[] scopes = [];

    foreach (string scope in scopes) {
        options.AddPolicy(scope, policy => policy.Requirements.Add(
            new HasScopeRequirement(scope, domain))
        );
    }
});

builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
builder.Services.AddSingleton<Auth0Service>();

builder.Services.AddOpenApi(options => {
    options.AddSchemaTransformer<ExampleSchemaTransformer>();
    options.AddDocumentTransformer<BearerSecuritySchemeDocumentTransformer>();
    options.AddOperationTransformer<BearerSecuritySchemeOperationTransformer>();
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    app.UseSwaggerUI(options => {
        options.RoutePrefix = "";
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
        options.OAuthClientId(builder.Configuration["Auth0:ClientId"]);
        options.OAuthClientSecret(builder.Configuration["Auth0:ClientSecret"]);
    });
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
