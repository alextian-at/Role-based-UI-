using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Accela.RBUI.CommonLib;
using System.Text;
using System.Configuration;
using System.Data;
using System.Collections.Specialized;
using System.IO;

namespace Accela.RBUI.Helpers
{
    public static class AppHelper
    {
        static string Client_id = ConfigurationManager.AppSettings["Client_id"].ToString();
        static string BaseUrl = ConfigurationManager.AppSettings["ApiUrl"].ToString();

        static public string Token
        {
           
            get
            {
                var session_token = HttpContext.Current.Session["access_token"];
                if (session_token != null)
                {
                    return session_token.ToString();
                }
                else
                {
                    return string.Empty;
                }
            }
        }
    

        /// <summary>
        /// http get method
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string AppGet(string url)
        {
            return HttpClientUtil.SendHttpGet(url, Client_id, Token);
        }


        /// <summary>
        /// http get file method
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static byte[] AppDownLoadFile(string url,ref string Content_Disposition)
        {
            return HttpClientUtil.SendHttpDownLoadFile(url, Client_id, Token,ref Content_Disposition);
        }



        /// <summary>
        /// http put method
        /// </summary>
        /// <param name="url"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static string AppPut(string url, string body)
        {
            return HttpClientUtil.HttpWebRequestPut(Client_id, url, Token, body);
        }


        /// <summary>
        /// http post method
        /// </summary>
        /// <param name="url"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static string AppPost(string url, string body)
        {
            return HttpClientUtil.HttpWebRequestPost(Client_id, url, Token, body);
        }


        /// <summary>
        /// http post File method
        /// </summary>
        /// <param name="url"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static string AppUploadFile(string url,string filename, Stream stream,NameValueCollection stringDictBody)
        {
            return HttpClientUtil.HttpWebRequestUploadFile(BaseUrl + url, Client_id, Token,10000,"uploadedFile",filename,stream,stringDictBody);
        }

        /// <summary>
        /// http delete method
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string AppDelete(string url)
        {
            return HttpClientUtil.SendHttpDelete(url, Client_id, Token);
        }
    }
}