using BL.UnitOfWork;
using Common.AppSettings;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Utils;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace BL.Services
{
    public class StorageService : BaseService
    {
        private readonly StorageClient _storageClient;
        private readonly IConfiguration _configuration;
        private const string bucketName = "cantacuzinohc.appspot.com";
        private const string jsonPath = "../BL/FireBase/cantacuzinohc-firebase-adminsdk-2ma6n-13af2b94cb.json";

        public StorageService(AppUnitOfWork unitOfWork, ILogger logger, IAppSettings appSettings, ClaimsPrincipal currentUser, NotificationService service, IConfiguration configuration) : base(unitOfWork, logger, appSettings)
        {
            _configuration = configuration;
            FirebaseApp.DefaultInstance?.Delete();
            /*  if (FirebaseApp.DefaultInstance == null)
              {
                  FirebaseApp.Create(new AppOptions()
                  {
                      Credential = GoogleCredential.FromFile(jsonPath)
                  });
              }*/
            var credentialJson = _configuration.GetSection("FireBaseConfiguration").Get<Dictionary<string, string>>();
            var jsonString = JsonConvert.SerializeObject(credentialJson);
            GoogleCredential credential = GoogleCredential.FromJson(jsonString);
            _storageClient = StorageClient.Create(credential);
        }

        public async Task<string> UploadFile(IFormFile file, Guid idFile, string fileName)
        {
            if(file == null || file.Length == 0)
            {
                return null;
            }
            try
            {
                string blobFileName = $"{idFile.ToString()}{Path.GetExtension(fileName)}";
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;
                    await _storageClient.UploadObjectAsync(bucketName, blobFileName, null, memoryStream);
                }
                return $"https://storage.googleapis.com/{bucketName}/{blobFileName}";
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<byte[]> DownloadFile( string fileURL, string contentType, string fileName)
        {
            // var storageObject = await _storageClient.GetObjectAsync(bucketName, fileName);
            try
            {
                string storageFileName = Path.GetFileName(fileURL);
                var storageObject = await _storageClient.GetObjectAsync(bucketName, storageFileName);
                using (var memoryStream = new MemoryStream())
                {
                    await _storageClient.DownloadObjectAsync(bucketName, storageFileName, memoryStream);
                    memoryStream.Position = 0;
                    return memoryStream.ToArray();
                }
            }
            catch(Exception ex)
            {
                return [];
            }
          
        }
    }
}
