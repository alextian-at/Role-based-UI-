using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Reflection;
using System.Configuration;
using System.Text;
using Accela.RBUI.CommonLib;
using System.Web.Security;
using Newtonsoft.Json.Linq;
namespace Accela.RBUI.Controllers
{
    public class AccountController : Controller
    {

        public string langSetting = ConfigurationManager.AppSettings["Language"].ToString();
        public static List<string> langList = new List<string>();
        public AccountController()
        {
            if (langList.Count==0)
            {
                langList = langSetting.Split('|').ToList();
            } 
        }

        /// <summary>
        /// Login
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Login()
        {
            //Get AccessToken
            if (Request["code"] != null)
            {
                string code = Request["code"].ToString();
                string Client_id = ConfigurationManager.AppSettings["Client_id"].ToString();
                string Client_secret = ConfigurationManager.AppSettings["Client_secret"].ToString();
                StringBuilder sb = new StringBuilder();
                sb.Append("grant_type=authorization_code");

                sb.Append("&client_id=" + Client_id + "");

                sb.Append("&client_secret=" + Client_secret + "");
                int StartIndex = 0;
                if (Request.RawUrl.Contains("?code"))
                {
                    StartIndex = Request.RawUrl.IndexOf("?code");
                }
                else
                {
                    StartIndex = Request.RawUrl.IndexOf("&code");
                }

                string RawUrl = Request.RawUrl.Remove(StartIndex, Request.RawUrl.Length - StartIndex);

                sb.Append("&redirect_uri=http://" + Request.Url.Host + ":" + @Request.Url.Port + "" + HttpUtility.UrlDecode(RawUrl.Trim()) + "");

                sb.Append("&code=" + code + "");

                sb.Append("&state=abcxyz123");

                if (Session["access_token"] == null)
                {
                    string Oauth2TokenUrl = ConfigurationManager.AppSettings["Oauth2TokenUrl"].ToString();
                    string strJson = HttpClientUtil.HttpWebRequestPost(Client_id, Oauth2TokenUrl, sb.ToString());
                    Dictionary<string, object> DictionaryJson = HttpClientUtil.JsonToDictionary(strJson);
                    if (DictionaryJson != null)
                    {
                        string access_token = string.Empty;
                        if (DictionaryJson.Count > 0)
                        {
                            if (DictionaryJson.ContainsKey("access_token"))
                            {
                                access_token = DictionaryJson["access_token"].ToString();
                            }
                        }
                        Session["access_token"] = access_token;
                    }
                }
                string jsonUserName=Helpers.AppHelper.AppGet("https://apis.dev.accela.com/v3/inspector");
                var sObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(jsonUserName);
                string inspector = sObj.Value<JObject>("inspector").Value<string>("id");
                Session["inspectorId"] = inspector;
               
                return RedirectToAction("Index", "App");
            }
            return View("Login");
        }

        /// <summary>
        /// Login
        /// </summary>
        /// <param name="Login"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(string Login, string selectLanguage)
        {
            return RedirectToAction("MyDashboard", "App");
        }


        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            Session["inspectorId"] = null;
            Session.Remove("inspectorId");
            Response.AddHeader("Cache-Control", "no-cache");
            Response.AddHeader("Cache-Control", "no-store");
            Response.AddHeader("Pragma", "no-cache");
            Response.Expires=0;
            return View();
        }

        /// <summary>
        /// get languages
        /// </summary>
        /// <returns></returns>
        public JsonResult GetLanguages()
        {
            var data = langList.Select(it => new { lang = it.Split(',')[0], value = it.Split(',')[1] }).ToList();
            if (Session["CurrentLang"] != null)
            {
                var current = langList.Where(it =>it.IndexOf(Session["CurrentLang"].ToString())>-1).First();
                data.Add(new { lang = current.Split(',')[0], value = current.Split(',')[1] });
            }
            else
            {
                data.Add(data[0]);
            }

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// ChangeLanguage
        /// </summary>
        public ActionResult ChangeLanguage(string lang)
        {
            if (lang != null)
            {
                Session["CurrentLang"] = lang;
                return RedirectToAction("Login");
            }
            else
            {
                return View("Login");
            }

        }

    }
}
