using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace NDF.Euploadify
{
    /// <summary>
    /// uploadify 的摘要说明
    /// </summary>
    public class uploadify : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Charset = "utf-8";

            HttpPostedFile file = context.Request.Files["Filedata"];
            string folder = context.Request["folder"],
                id = context.Request["id"],
                value = context.Request["id"];
           // string uploadPath = HttpContext.Current.Server.MapPath(folder) + "\\";
            string urlPath = "/FileLibrary/" + System.DateTime.Now.ToString("yyyyMMdd")+"/";
            string uploadPath = HttpContext.Current.Server.MapPath(urlPath) ;
            string filenamer = System.DateTime.Now.ToString("yyyyMMddHHmmss") + "."+file.FileName.Substring(file.FileName.LastIndexOf(".") + 1);  
            if(context.Request["path"]!=null)
            {
                urlPath = context.Request["path"].Substring(0, context.Request["path"].LastIndexOf('/')+1);
                uploadPath= HttpContext.Current.Server.MapPath(urlPath);
                filenamer = context.Request["path"].Substring(context.Request["path"].LastIndexOf('/')+1, context.Request["path"].Length - context.Request["path"].LastIndexOf('/')-1);
            }
            if (file != null)
            {
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                file.SaveAs(uploadPath + filenamer);

                //下面这句代码缺少的话，上传成功后上传队列的显示不会自动消失
                value = urlPath+filenamer;
                context.Response.Write("{ \"id\": \"" + id + "\", \"status\": true, \"message\": \"上传成功!\", \"value\": \"" + value + "\", \"url\": null }");
            }
            else
            {
                context.Response.Write("{ \"id\": null, \"status\": false, \"message\": \"上传失败!\", \"value\": null, \"url\": null }");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}