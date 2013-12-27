using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Accela.RBUI.CommonLib;
using System.Text;
using System.Configuration;
using System.Data;
using Accela.RBUI.Helpers;
using System.Web.UI;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.IO;
using System.Net;
using System.Collections.Specialized;
using Accela.RBUI.AzureStorage;
namespace Accela.RBUI.Controllers
{
    [AuthorToken]
    public class AppController : Controller
    {
        string baseUrl = ConfigurationManager.AppSettings["ApiUrl"].ToString();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// GetInspections
        /// </summary>
        /// <returns></returns>
        public string GetInspections(string search = "")
        {

            StringBuilder sbBody = new StringBuilder();
            StringBuilder sbJsonScheduled = new StringBuilder();
            StringBuilder sbJsonPenging= new StringBuilder();
            string inspectorId = string.Empty;
            if (Session["inspectorId"] != null)
            {
                inspectorId = Session["inspectorId"].ToString();
            }
            if (search == "")
            {
                sbBody.Append("{ ");
                sbBody.Append("\"inspectorId\":\"" + inspectorId + "\",");
                sbBody.Append("\"serviceProviderCode\": \"BPTDEV\",");
                sbBody.Append("\"status\": {");
                sbBody.Append(" \"value\": \"Scheduled\",");
                sbBody.Append("\"text\": \"Scheduled\"");
                sbBody.Append("}");
                sbBody.Append("}");
            }
            else
            {
                var sObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(search);
                sbBody.Append("{ ");
                sbBody.Append("\"scheduleDate\":\"" + sObj.Value<string>("scheduleDate") + "\",");
                sbBody.Append("\"inspectorId\":\"" + inspectorId + "\",");
                sbBody.Append("\"serviceProviderCode\": \"BPTDEV\",");
                sbBody.Append("\"status\": {");
                sbBody.Append(" \"value\": \"" + sObj.Value<string>("status.value") + "\"}");
                sbBody.Append("}");
            }
            string RequestUrl = baseUrl + "/search/inspections";
            bool hasmore = true;
            while (hasmore)
            {
                sbJsonScheduled.Append(AppHelper.AppPost(RequestUrl, sbBody.ToString()));
                sbJsonPenging.Append(AppHelper.AppPost(RequestUrl, sbBody.ToString().Replace("Scheduled", "Pending")));
                hasmore = sbJsonScheduled.ToString().Contains("hasmore : True");
            }
            var sObjScheduled = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(sbJsonScheduled.ToString());

            var sObjPending = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(sbJsonPenging.ToString());
            if (sObjPending["result"] != null)
            {
                sObjScheduled.Add("resultPending", sObjPending["result"]);
            }
            return sObjScheduled.ToString();
        }

        /// <summary>
        /// Get Documentype
        /// </summary>
        /// <returns></returns>
        public string GetDocumentType()
        {
            string jsonDocumentType = Helpers.AppHelper.AppGet("https://apis.dev.accela.com/v3/system/document/types");
            return jsonDocumentType;
        }
      


        /// <summary>
        /// Down load Document
        /// </summary>
        /// <returns></returns>
        public void DownLoadDocument()
        {
            string documentid = string.Empty;
            documentid = Request["documentid"] != null ? Request["documentid"].ToString() : "0";
            string Content_Disposition = string.Empty;
            byte[] retData = Helpers.AppHelper.AppDownLoadFile(baseUrl + "/documents/" + documentid + "/download", ref Content_Disposition);

            Response.Clear();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", Content_Disposition);
            Response.ContentType = "application/octet-stream";
            Response.BinaryWrite(retData);
        }


        /// <summary>
        /// Write Log
        /// </summary>
        public string WriteLog(string data)
        {
            var sObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(data);
            int id = sObj.Value<int>("id");
            //DiagnosticsEntity diagnosticsentity = new DiagnosticsEntity();
            //diagnosticsentity.ID = 1;
            //diagnosticsentity.Type = "Type";
            //diagnosticsentity.OccursDateTime = DateTime.Now;
            //diagnosticsentity.User = "User";
            //diagnosticsentity.Module = "Module";
            //diagnosticsentity.Function = "Function";
            //diagnosticsentity.URL = "URL";
            //diagnosticsentity.Summary = "Summary";
            //diagnosticsentity.Description = "Description";
            //diagnosticsentity.PartitionKey = Guid.NewGuid().ToString();
            //diagnosticsentity.RowKey = Guid.NewGuid().ToString();
            //DiagnosticsStorage.AddDiagnosticsEntity(diagnosticsentity);
            //int id = sObj.Value<int>("id");
            return "ok";
        }

        /// <summary>
        /// Upload Document
        /// </summary>
        /// <returns></returns>
        public string UploadDocument()
        {
            string DocumentGroup = Request["DocumentGroup"] != null ? Request["DocumentGroup"].ToString() : string.Empty;

            string Documenttype = Request["Documenttype"] != null ? Request["Documenttype"].ToString() : string.Empty;

            string Description = Request["Description"] != null ? Request["Description"].ToString() : string.Empty;

            string url = Request["url"] != null ? Request["url"].ToString() + "?group=" + DocumentGroup + "&category=" + Documenttype + "" : string.Empty;


            string returnResult = string.Empty;

            if (Request.Files.Count > 0)
            {
                string oriFilename = Request.Files[0].FileName == "" ? Request["filename"] : Request.Files[0].FileName;
                string filename = oriFilename.Substring(oriFilename.LastIndexOf("\\") + 1);
                string filetype= Request.Files[0].ContentType;
               
                NameValueCollection mvc = new NameValueCollection();
                mvc.Add("fileInfo", "[{\"fileName\": \"" + filename + "\", \"type\": \"" + filetype + "\", \"description\": \"" + Description + "\"}]");
                returnResult = Helpers.AppHelper.AppUploadFile(url,filename, Request.Files[0].InputStream, mvc);
            }
            return returnResult;
        }

        /// <summary>
        /// Get Document
        /// </summary>
        /// <returns></returns>
        public string GetDocument(string data = "")
        {
            string url = string.Empty;
            if (Request.QueryString["url"] != null)
            {
                url = Request.QueryString["url"].ToString();
            }
            string strJson = ApiRequest(url, data);
            return strJson;
        }

        /// <summary>
        /// Delete Document
        /// </summary>
        /// <returns></returns>
        public string DeleteDocument(string data = "")
        {
            string url = string.Empty;
            if (Request.QueryString["url"] != null)
            {
                url = Request.QueryString["url"].ToString();
            }
            string strJson = ApiRequest(url, data);
            return strJson;
        }

        public string GetInspectionSummary(string id)
        {
            //https://apis.dev.accela.com/v4/inspections/536

            string url = baseUrl + "/inspections/" + id;
            string strJson = Helpers.AppHelper.AppGet(url);
            return strJson;

        }

        public string GetInspectors()
        {
            //https://apis.dev.accela.com/v4/inspector
            string RequestUrl = baseUrl + "/inspector";
            string strJson = AppHelper.AppGet(RequestUrl);
            return strJson;
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

        /// <summary>
        /// get InspectionStatus
        /// </summary>
        /// <returns></returns>
        public string GetInspectionStatus(string data)
        {
            string url = string.Empty;
            if (Request.QueryString["url"] != null)
            {
                url = Request.QueryString["url"].ToString();
            }
            string strJson = AppHelper.AppGet(baseUrl + url);
            var sObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(strJson);
            string resultGroup = sObj.Value<JArray>("result")[0].Value<string>("resultGroup");

            strJson = AppHelper.AppGet(baseUrl + "/settings/inspections/statuses?group=" + resultGroup + "");

            return strJson;
        }

        /// <summary>
        /// put Result Inspections
        /// </summary>
        /// <returns></returns>
        public string ResultInspections(string data = "", string InspectorSignature = "", string ContractorSignature = "", string documneturl = "")
        {
            string url = string.Empty;
            if (Request.QueryString["url"] != null)
            {
                url = Request.QueryString["url"].ToString();
            }
            string strJson = ApiRequest(url, data);

            if (!string.IsNullOrEmpty(InspectorSignature))
            {
                InspectorSignature = InspectorSignature.Replace("data:image/png;base64,", string.Empty);
                byte[] byteInspectorSignature = Convert.FromBase64String(InspectorSignature);
                if (byteInspectorSignature.Length > 1383)
                {
                    NameValueCollection mvc = new NameValueCollection();
                    mvc.Add("fileInfo", "[{\"fileName\": \"Inspector Signature\", \"type\": \"image/jpeg\", \"description\": \"Inspector Signature\"}]");
                    MemoryStream ms = new MemoryStream(byteInspectorSignature);
                    Helpers.AppHelper.AppUploadFile(documneturl, "Signature_" + Guid.NewGuid(), ms, mvc);
                }
            }

            if (!string.IsNullOrEmpty(ContractorSignature))
            {
                ContractorSignature = ContractorSignature.Replace("data:image/png;base64,", string.Empty);
                byte[] byteContractorSignature = Convert.FromBase64String(ContractorSignature);
                if (byteContractorSignature.Length > 1383)
                {
                    NameValueCollection _mvc = new NameValueCollection();
                    _mvc.Add("fileInfo", "[{\"fileName\": \"Inspector Signature\", \"type\": \"image/jpeg\", \"description\": \"Contractor Signature\"}]");
                    MemoryStream _ms = new MemoryStream(byteContractorSignature);
                    Helpers.AppHelper.AppUploadFile(documneturl, "Signature_" + Guid.NewGuid(), _ms, _mvc);
                }
            }

            return strJson;
        }

        /// <summary>
        /// Api Request
        /// </summary>
        /// <param name="url"></param>
        /// <param name="posttype"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public string ApiRequest(string url, string data = "", string version = "v4")
        {
            string jsonString = "";
            if (version == "v3")
            {
                baseUrl = "https://apis.dev.accela.com/v3";
            }
            switch (Request.HttpMethod.ToUpper())
            {
                case "GET":
                    jsonString = AppHelper.AppGet(baseUrl + url);
                    break;
                case "PUT":
                    jsonString = AppHelper.AppPut(baseUrl + url, data);
                    break;
                case "POST":
                    jsonString = AppHelper.AppPost(baseUrl + url, data);
                    break;
                case "DELETE":
                    jsonString = AppHelper.AppDelete(baseUrl + url);
                    break;

            }
            return jsonString;
        }

        public string Conditions(string inspectionId, string id = "", string ids = "", string data = "")
        {
            string jsonString = "";
            if (Request.HttpMethod == HttpMethod.Get.Method)
            {
                jsonString = AppHelper.AppGet(baseUrl + "/inspections/" + inspectionId + "/conditions");
                jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(((JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(jsonString)).Value<JArray>("result"));
            }
            else if (Request.HttpMethod == HttpMethod.Post.Method)
            {
                if (id != "")//update
                {
                    jsonString = AppHelper.AppPut(baseUrl + "/inspections/" + inspectionId + "/conditions/" + id, data);
                }
                else// create
                {
                    jsonString = AppHelper.AppPost(baseUrl + "/inspections/" + inspectionId + "/conditions", data);
                }
            }
            else if (Request.HttpMethod == HttpMethod.Delete.Method)
            {
                jsonString = AppHelper.AppDelete(baseUrl + "/inspections/" + inspectionId + "/conditions/" + ids);
            }
            return jsonString;
        }

        public string GetGridSampleData_Page(int pageSize, int pageIndex, string keyWord)
        {
            JArray ja = new JArray();
            for (var i = 0; i < 1000; i++)
            {
                JObject jitem = new JObject();
                jitem.Add("id", new JValue(i));
                jitem.Add("name", new JValue("name_" + i));
                jitem.Add("date", new JValue(DateTime.Now.AddDays(i).ToString("MM/dd/yyyy")));
                ja.Add(jitem);
            }

            var kwObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(keyWord);
            var searchItems = ja.Where(o => o.Value<string>("id").Contains(kwObj.Value<string>("id"))
                && o.Value<string>("name").Contains(kwObj.Value<string>("name"))
                && (kwObj.Value<string>("date") == null || kwObj.Value<string>("date") == "" || o.Value<DateTime>("date") == kwObj.Value<DateTime>("date")));
            var pageItems = searchItems.Skip(pageSize * pageIndex).Take(pageSize);

            JObject jo = new JObject();
            jo.Add("totalrecords", new JValue(searchItems.Count()));
            jo.Add("data", new JArray(pageItems.ToArray()));
            return Newtonsoft.Json.JsonConvert.SerializeObject(jo);
        }

        public string GetGridSampleData(string keyWord)
        {
            JArray ja = new JArray();
            for (var i = 0; i < 100; i++)
            {
                JObject jitem = new JObject();
                jitem.Add("id", new JValue(i));
                jitem.Add("name", new JValue("name_" + i));
                ja.Add(jitem);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(ja);
        }

        /// <summary>
        /// Get InspectionType
        /// </summary>
        /// <returns></returns>
        public string GetInspectionType()
        {
            StringBuilder sbJson = new StringBuilder();

            string RequestUrl = baseUrl + "/settings/inspections/types";

            sbJson.Append(AppHelper.AppGet(RequestUrl));

            return sbJson.ToString();
        }

        /// <summary>
        /// Schedule Inspection
        /// </summary>
        /// <param name="inspection"></param>
        /// <returns></returns>
        public string ScheduleInspection()
        {
            string inspection = string.Empty;
            inspection = Request.Form[0].ToString();
            StringBuilder sbJson = new StringBuilder();

            string RequestUrl = baseUrl + "/inspections/schedule";

            sbJson.Append(AppHelper.AppPost(RequestUrl, inspection));

            return sbJson.ToString();
        }

        public string UpdateInspection(string id = "", string data = "")
        {
            string result = "";
            //https://apis.dev.accela.com/v4/inspections/582
            result = AppHelper.AppPut(baseUrl + "/inspections/" + id, data);
            return result;
        }

        #region Standard Comment (V3)
        /// <summary>
        /// Get Standard Comment Groups(V3 Api)
        /// </summary>
        /// <returns></returns>
        public string GetStandardCommentGroups(string lang = "en", string offset = "0", string limit = "25")
        {
            //https://apis.dev.accela.com/v3/system/standardCommentGroups?lang=en&offset=0&limit=25
            string RequestUrl = "https://apis.dev.accela.com/v3/system/standardCommentGroups?lang=" + lang + "&offset=" + offset + "&limit=" + limit;
            return AppHelper.AppGet(RequestUrl);
        }

        /// <summary>
        /// Get Standard Comments(V3 Api)
        /// </summary>
        public string GetStandardComments(string groups = "", string lang = "en", string offset = "0", string limit = "25")
        {
            string RequestUrl = "https://apis.dev.accela.com/v3/system/standardComments?groups=" + groups + "&lang=" + lang + "&offset=" + offset + "&limit=" + limit;

            return AppHelper.AppGet(RequestUrl);
        }
        #endregion

        /// <summary>
        /// Get Record Types By Module
        /// </summary>
        public string GetRecordTypes(string module = "", string offset = "0", string limit = "25")
        {
            string RequestUrl = "https://apis.dev.accela.com/v3/system/record/types?module=" + module + "&offset=" + offset + "&limit=" + limit;

            return AppHelper.AppGet(RequestUrl);
        }

        /// <summary>
        /// Get Inspections By Ids
        /// </summary>
        /// <param name="Ids"></param>
        /// <returns></returns>
        public string GetInspectionsByIds(string Ids = "")
        {
            if (!string.IsNullOrEmpty(Ids))
            {
                string RequestUrl = baseUrl + "/inspections/" + Ids;

                return AppHelper.AppGet(RequestUrl);
            }

            return "";
        }





    }
}
