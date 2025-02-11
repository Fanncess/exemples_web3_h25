using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TacheApi.Models;
using Auth0.ManagementApi;
using System.Text.Json;
using Auth0.AuthenticationApi;
using Auth0.AuthenticationApi.Models;
using Auth0.ManagementApi.Models;
using System.Security.Claims;

namespace TacheApi.Services
{
    public class Auth0Service
    {
        private readonly AuthenticationApiClient _authClient;
        private readonly IConfiguration _configuration;

        public Auth0Service(IConfiguration configuration)
        {
            _configuration = configuration;
            _authClient = new AuthenticationApiClient(_configuration["Auth0:Domain"]);
        }

        public ManagementApiClient ManagementClient { get => ObtenirManagementApiClient().Result;}

        private async Task<AccessTokenResponse> ObtenirManagementApiToken()
        {
            return await _authClient.GetTokenAsync(new ClientCredentialsTokenRequest
            {
                Audience = $"https://{_configuration["Auth0:Domain"]}/api/v2/",
                ClientId = $"{_configuration["Auth0:ManagementApi:ClientId"]}",
                ClientSecret = $"{_configuration["Auth0:ManagementApi:ClientSecret"]}"
            });
        }

        private async Task<ManagementApiClient> ObtenirManagementApiClient()
        {
            var token = await ObtenirManagementApiToken();

            return new ManagementApiClient(token.AccessToken, _configuration["Auth0:Domain"]);
        }

        public string ObtenirIdUtilisateur(ClaimsPrincipal utilisateur)
        {
            return utilisateur.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        }

        public async Task<User> ObtenirDonneesUtilisateur(string idUtilisateur)
        {
            return await ManagementClient.Users.GetAsync(idUtilisateur);
        }

        public async Task<User> ObtenirDonneesUtilisateur(ClaimsPrincipal utilisateur)
        {
            return await ObtenirDonneesUtilisateur(ObtenirIdUtilisateur(utilisateur));
        }

        public async Task MettreAJourDonneesUtilisateur(string idUtilisateur, UserUpdateRequest userUpdateRequest)
        {
            // https://auth0.com/docs/manage-users/user-accounts/manage-users-using-the-management-api
            await ManagementClient.Users.UpdateAsync(
                idUtilisateur,
                userUpdateRequest
            );
        }

        public async Task MettreAJourDonneesUtilisateur(ClaimsPrincipal utilisateur, UserUpdateRequest userUpdateRequest)
        {
            await MettreAJourDonneesUtilisateur(
                ObtenirIdUtilisateur(utilisateur),
                userUpdateRequest
            );
        }
    }
}
