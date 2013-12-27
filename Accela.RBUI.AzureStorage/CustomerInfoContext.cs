using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accela.RBUI.AzureStorage
{
    public class CustomerInfoContext : TableServiceContext
    {

        public CustomerInfoContext(string baseAddress, StorageCredentials credentials) :

            base(baseAddress, credentials)
        {

        }

    }
}
