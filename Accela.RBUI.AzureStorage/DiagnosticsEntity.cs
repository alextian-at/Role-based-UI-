using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accela.RBUI.AzureStorage
{
    public class DiagnosticsEntity : TableServiceEntity
    {
        public DiagnosticsEntity()
        {
         
        }
        /// <summary>
        /// ID
        /// </summary>
        private int _ID;
        public int ID
        {

            get { return _ID; }

            set { _ID = value; }

        }


        /// <summary>
        /// Type
        /// </summary>
        private string _Type;
        public string Type
        {

            get { return _Type; }

            set { _Type = value; }

        }

        /// <summary>
        /// OccursDateTime
        /// </summary>
        private DateTime _OccursDateTime;
        public DateTime OccursDateTime
        {

            get { return _OccursDateTime; }

            set { _OccursDateTime = value; }

        }

        /// <summary>
        /// User
        /// </summary>
        private string _User;
        public string User
        {

            get { return _User; }

            set { _User = value; }

        }

        /// <summary>
        /// Module
        /// </summary>
        private string _Module;
        public string Module
        {

            get { return _Module; }

            set { _Module = value; }

        }

        /// <summary>
        /// Function
        /// </summary>
        private string _Function;
        public string Function
        {

            get { return _Function; }

            set { _Function = value; }

        }

        /// <summary>
        /// URL
        /// </summary>
        private string _URL;
        public string URL
        {

            get { return _URL; }

            set { _URL = value; }

        }

        /// <summary>
        /// Summary
        /// </summary>
        private string _Summary;
        public string Summary
        {

            get { return _Summary; }

            set { _Summary = value; }

        }

        /// <summary>
        /// Description
        /// </summary>
        private string _Description;
        public string Description
        {

            get { return _Description; }

            set { _Description = value; }

        }


        public string PartitionKey { get; set; }

        public string RowKey { get; set; }
    }
}