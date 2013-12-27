using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Accela.RBUI.AzureStorage;
namespace Accela.RBUI.Diagnostics.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            bool flag = DiagnosticsStorage.AddTable();
            bool flag2 = flag;

            //Add DiagnosticsEntity;
            DiagnosticsEntity diagnosticsentity = new DiagnosticsEntity();
            diagnosticsentity.ID = 1;
            diagnosticsentity.Type = "Type";
            diagnosticsentity.OccursDateTime = DateTime.Now;
            diagnosticsentity.User = "User";
            diagnosticsentity.Module = "Module";
            diagnosticsentity.Function = "Function";
            diagnosticsentity.URL = "URL";
            diagnosticsentity.Summary = "Summary";
            diagnosticsentity.Description = "Description";
            diagnosticsentity.PartitionKey = Guid.NewGuid().ToString();
            diagnosticsentity.RowKey = Guid.NewGuid().ToString();
            DiagnosticsStorage.AddDiagnosticsEntity(diagnosticsentity);


            List<DiagnosticsEntity> listDiagnostics = DiagnosticsStorage.QueryDiagnosticsList();
            int count = listDiagnostics.Count;

            bool delflag = DiagnosticsStorage.DeleteDiagnosticsEntity(listDiagnostics[0]);

            //Query DiagnosticsEntity
            DiagnosticsEntity _diagnosticsentity = DiagnosticsStorage.QueryDiagnosticsEntity(diagnosticsentity);
            _diagnosticsentity.ID=50;

            //Update DiagnosticsEntity
            DiagnosticsStorage.UpdateDiagnosticsEntity(_diagnosticsentity);
            //Query DiagnosticsEntity
            DiagnosticsEntity _diagnosticsentity50 = DiagnosticsStorage.QueryDiagnosticsEntity(diagnosticsentity);
            int id = _diagnosticsentity50.ID;

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
