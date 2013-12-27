using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;
using System.Xml;
using System.Web;
using System.Web.UI;
using System.Web.Caching;
using System.IO;
namespace Accela.RBUI.CommonLib
{
    public class XmlResourceManager
    {
        #region Read xml element;
        /// <summary>
        /// Read xml element;
        /// </summary>
        /// <param name="eleName"></param>
        /// <returns></returns>
        public static string GetResourceString(string eleName, string LanguageType)
        {
            Page page = new Page();
            string eleValue = string.Empty;
            string CacheKey = eleName + "_" + LanguageType;
            if (HttpContext.Current.Cache[CacheKey] != null)
            {
                eleValue = HttpContext.Current.Cache[CacheKey].ToString();
            }
            else
            {
                string strPath = page.Server.MapPath("\\Language\\") + "" + LanguageType + ".xml";
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(strPath);
                XmlNode xmlNode1 = xmlDoc.SelectSingleNode("LangOption/" + eleName);
                eleValue = xmlNode1.InnerText;
                HttpContext.Current.Cache[CacheKey] = eleValue;
            }
            return eleValue;
        }
        #endregion

        #region XmlConvertToJson;
        /// <summary>
        /// XmlConvertToJson;
        /// </summary>
        /// <param name="eleName"></param>
        /// <returns></returns>
        public static string XmlConvertToJson(string LanguageType)
        {
            Page page=new Page();

            string xml = File.ReadAllText(page.Server.MapPath("~/Language/" + LanguageType + ".xml"), Encoding.UTF8);

            XmlDocument doc = new XmlDocument();

            doc.LoadXml(xml);

            string json = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc);

            return json;
        }
        #endregion


    }
}
