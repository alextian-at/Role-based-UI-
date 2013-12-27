using System.Web;
using System.Web.Mvc;

namespace Accela.RBUI.Diagnostics
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}