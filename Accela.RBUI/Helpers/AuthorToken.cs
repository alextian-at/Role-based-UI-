using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Accela.RBUI.Helpers
{
    public class AuthorToken : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (HttpContext.Current.Request["nav"] != null)
            {
                string nav = HttpContext.Current.Request["nav"];
                HttpContext.Current.Session["nav"] = nav;
            }
            else
            {
                HttpContext.Current.Session["nav"] = "Dashboard";
            }

            if (HttpContext.Current.Session["inspectorId"] == null)
            {

                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { Controller = "Account", Action = "Login" }));
                //filterContext.HttpContext.Response.RedirectToRoute(new RouteValueDictionary(new { Controller = "Account", Action = "Login" }));
            }

        }
    }
}