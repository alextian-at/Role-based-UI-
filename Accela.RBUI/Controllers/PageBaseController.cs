using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Accela.RBUI.Helpers;
using Accela.RBUI.CommonLib;
namespace Accela.RBUI.Controllers
{
    public class PageBaseController : Controller
    {
        //
        // GET: /Base/

        public PageBaseController()
        {
            //string url = page.Request.RawUrl + " " + page.Request.Url;

            //if (Session["access_token"] == null)
            //{
            //    RedirectToAction("Login", "Account");
            //}
        }

        /// <summary>
        /// GetJsonResource
        /// </summary>
        /// <returns></returns>
        public string GetJsonResource()
        {
            string CurrentLang = string.Empty;
            //arabic
            if (Session["CurrentLang"] != null)
            {
                CurrentLang = Session["CurrentLang"].ToString();
            }
            else
            {
                CurrentLang = "en-US";
            }
            string jsonResource =XmlResourceManager.XmlConvertToJson(CurrentLang);
            return jsonResource;
        }

    }
}
