using System.Threading.Tasks;

static class Fichier
{
    /// <summary>
    /// Définit le nom du dossier où stocker les fichiers téléversés
    /// </summary>
    public readonly static string DossierTeleversements = "Televersements";

    /// <summary>
    /// Construit le chemin complet vers un fichier dans le dossier de téléversement.
    /// </summary>
    /// <param name="nomFichier"></param>
    /// <returns></returns>
    public static string ObtenirChemin(string nomFichier)
    {
        // Retourne le chemin du fichier
        return Path.Combine(DossierTeleversements, nomFichier);
    }

    /// <summary>
    /// Crée le dossier de téléversements s'il n'existe pas
    /// </summary>
    public static void CreerDossierTeleversements()
    {
        // Crée le dossier de téléversements s'il n'existe pas
        if (!Directory.Exists(DossierTeleversements))
        {
            Directory.CreateDirectory(DossierTeleversements);
        }
    }

    /// <summary>
    /// Vérifie si le fichier est valide
    /// </summary>
    /// <param name="fichier"></param>
    /// <param name="extensionsPermises"><code>string[] extensionsPermises = [".png", ".jpg", ".jpeg"]</code></param>
    /// <returns></returns>
    public static bool EstValide(IFormFile fichier, string[] extensionsPermises)
    {
        // Vérifie si le fichier est vide
        if (fichier.Length == 0)
        {
            return false;
        }
        // La taille maximale est validé par options.MultipartBodyLengthLimit = tailleMaximaleFichier;

        // Vérifie l'extension du fichier
        var extension = Path.GetExtension(fichier.FileName).ToLower();
        if (string.IsNullOrEmpty(extension) ||
            !extensionsPermises.Contains(extension))
        {
            return false;
        }

        // Vérification de la signature du fichier
        // https://learn.microsoft.com/fr-fr/azure/security/develop/threat-modeling-tool-input-validation#example-8
        // Scan antivirus, etc.

        return true;
    }

    /// <summary>
    /// Vérifie si les fichiers sont valides
    /// </summary>
    /// <param name="fichier"></param>
    /// <param name="extensionsPermises"><code>string[] extensionsPermises = [".png", ".jpg", ".jpeg"]</code></param>
    /// <returns></returns>
    public static bool EstValide(List<IFormFile> fichiers, string[] extensionsPermises)
    {
        foreach (var fichier in fichiers)
        {
            if (!EstValide(fichier, extensionsPermises))
            {
                return false;
            }
        }

        return true;
    }

    /// <summary>
    /// Enregistre un fichier sur disque avec un nom unique sécurisé (et non le nom d'origine).
    /// </summary>
    /// <param name="fichier"></param>
    /// <returns></returns>
    public static async Task<string> Enregister(IFormFile fichier)
    {
        string nomFichier;
        // Génère un nom de fichier unique
        // Il est important de ne pas utiliser le nom d'origine du fichier pour éviter les collisions
        // et les problèmes de sécurité tels que l'injection de chemin d'accès
        do
        {
            nomFichier = Path.GetRandomFileName().Remove(8, 1) + Path.GetExtension(fichier.FileName).ToLower();
        } while (File.Exists(ObtenirChemin(nomFichier)));

        // Enregistre le fichier sur le disque
        using (Stream stream = new FileStream(ObtenirChemin(nomFichier), FileMode.Create))
        {
            await fichier.CopyToAsync(stream);
        }

        return nomFichier;
    }

    /// <summary>
    /// Enregistre plusieurs fichiers sur disque avec un nom unique sécurisé (et non le nom d'origine).
    /// </summary>
    /// <param name="fichiers"></param>
    /// <returns></returns>
    public static async Task<List<string>> Enregister(List<IFormFile> fichiers)
    {
        List<string> nomFichiers = [];
        foreach (var fichier in fichiers)
        {
            nomFichiers.Add(await Fichier.Enregister(fichier));
        }

        return nomFichiers;
    }

    /// <summary>
    /// Supprime un fichier du disque
    /// </summary>
    /// <param name="nomFichier"></param>
    public static void Supprimer(string nomFichier)
    {
        // Supprime le fichier du disque
        string cheminFichier = ObtenirChemin(nomFichier);
        if (File.Exists(cheminFichier))
        {
            File.Delete(cheminFichier);
        }
    }

    /// <summary>
    /// Obtient un fichier du disque
    /// </summary>
    /// <param name="nomFichier"></param>
    /// <returns></returns>
    public static Stream? ObtenirFichier(string nomFichier)
    {
        // Retourne le fichier
        string cheminFichier = ObtenirChemin(nomFichier);
        if (File.Exists(cheminFichier))
        {
            return new FileStream(cheminFichier, FileMode.Open);
        }
        return null;
    }

    /// <summary>
    /// Obtient le type MIME d'un fichier selon son extension
    /// (pour le type de contenu dans la réponse HTTP)
    /// </summary>
    /// <param name="nomFichier"></param>
    /// <returns></returns>
    public static string ObtenirTypeContenu(string nomFichier)
    {
        // Retourne le type de contenu du fichier
        string extension = Path.GetExtension(nomFichier).ToLower();

        // Voir https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/MIME_types/Common_types
        // pour la liste des types de contenu
        return extension switch
        {
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".pdf" => "application/pdf",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };
    }
}