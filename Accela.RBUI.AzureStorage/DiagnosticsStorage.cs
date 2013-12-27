using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System.Data;
using System.Configuration;
namespace Accela.RBUI.AzureStorage
{
    public class DiagnosticsStorage
    {
        private static string _DatatableName = "PermitsSolutionDiagnostics";

        private static string _DefaultConnection = ConfigurationManager.AppSettings["DefaultConnection"]; 

        private static CloudStorageAccount storageAccount = CloudStorageAccount.Parse(_DefaultConnection);

        private static  CustomerInfoContext context = new CustomerInfoContext(storageAccount.TableEndpoint.AbsoluteUri, storageAccount.Credentials);
        /// <summary>
        /// Add Table
        /// </summary>
        /// <param name="diagnosticsentity"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public static bool AddTable()
        {
            bool flag = false;

            var tableStorage = storageAccount.CreateCloudTableClient();

            try
            {
                flag = tableStorage.CreateTableIfNotExist(_DatatableName);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return flag;

        }


        /// <summary>
        /// Add DiagnosticsEntity
        /// </summary>
        /// <param name="diagnosticsentity"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public static bool AddDiagnosticsEntity(DiagnosticsEntity diagnosticsentity)
        {
            bool flag = false;
            try
            {
                AddTable();

                context.AddObject(_DatatableName, diagnosticsentity);

                context.SaveChanges();

                flag = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return flag;

        }

        /// <summary>
        /// UpdateTable
        /// </summary>
        /// <param name="diagnosticsentity"></param>
        /// <returns></returns>
        public static bool UpdateDiagnosticsEntity(DiagnosticsEntity diagnosticsentity)
        {
            bool flag = false;
            try
            {
                context.UpdateObject(diagnosticsentity);

                context.SaveChanges();

                flag = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return flag;
        }

        /// <summary>
        /// Query DiagnosticsEntity
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static DiagnosticsEntity QueryDiagnosticsEntity(DiagnosticsEntity diagnosticsentity)
        {

            var tableStorage = storageAccount.CreateCloudTableClient();

            tableStorage.CreateTableIfNotExist(_DatatableName);

            var query = context.CreateQuery<DiagnosticsEntity>(_DatatableName);
            if (diagnosticsentity.ID != 0)
            {
                query.Where<DiagnosticsEntity>(q => q.ID == diagnosticsentity.ID);
            }

            return query.FirstOrDefault();
        }

        /// <summary>
        /// Query Diagnostics
        /// </summary>
        /// <returns></returns>
        public static List<DiagnosticsEntity> QueryDiagnosticsList()
        {

            return context.CreateQuery<DiagnosticsEntity>(_DatatableName).ToList();
        }

        /// <summary>
        /// Delete DiagnosticsEntity
        /// </summary>
        /// <param name="DiagnosticsEntity"></param>
        /// <returns></returns>
        public static bool DeleteDiagnosticsEntity(DiagnosticsEntity DiagnosticsEntity)
        {
            bool flag = false;
            try
            {
                context.DeleteObject(DiagnosticsEntity);

                context.SaveChanges();

                flag = true;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return flag;
        }

    }
}

