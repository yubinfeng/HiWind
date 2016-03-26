using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace WebApp
{
    /// <summary>
    /// Name:overwrite AuthorizeAttribute
    /// Author:ybf
    /// CreateDate:2014/6/10
    /// UpdateDate:2016/3/27
    /// </summary>
    public class CustomAuthorizeAttribute : System.Web.Mvc.AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException("HttpContext");
            }
            if (httpContext.Session["UserId"] != null)
            {
                return true;
            }
            //if (!httpContext.User.Identity.IsAuthenticated)
            //{
            //    return false;
            //}
            //string userName = httpContext.User.Identity.Name;
            return false;
        }
        public override void OnAuthorization(System.Web.Mvc.AuthorizationContext filterContext)
        {
            filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            string controllerName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            string actionName = filterContext.ActionDescriptor.ActionName;
            if (IsAuthorityActionOrControler(controllerName, actionName))
                return;
            base.OnAuthorization(filterContext);
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            //time out
            if (filterContext.HttpContext.Session["UserId"] == null)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("<link   href='/Scripts/jquery-easyui-theme/default/easyui_14.css' rel='stylesheet' type='text/css' />");
                sb.Append("<script src='/Scripts/jquery/jquery-1.11.0.min.js'></script>");
                sb.Append("<script src='/Scripts/jquery.ext.min.js'></script>");
                sb.Append("<script src='/Scripts/jquery-easyui-1.3.6/jquery.easyui.min.js' type='text/javascript'></script>");
                sb.Append("<script src='/Scripts/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js' type='text/javascript'></script>");
                sb.Append("<link href='/Scripts/jeasyui-extensions/jeasyui.extensions.css' rel='stylesheet' type='text/css' />");
                sb.Append("<script src='/Scripts/jeasyui-extensions/easyuiext.min.js' type='text/javascript'></script>"); ;
                sb.Append("<link href='/UserStyle/UserStyle_14.css' rel='stylesheet' />");
                sb.Append("<script  type='text/javascript'>  $(function () {   $.easyui.messager.alert('操作提醒', '非常抱歉，您登录超时或未登录，请重新登录系统！', 'warning', function () { $.util.top.location.href = '/Users/Login'; }) });</script>");
                filterContext.RequestContext.HttpContext.Response.Write(sb.ToString());
                filterContext.RequestContext.HttpContext.Response.End();
                return;
            }

            if (filterContext.HttpContext.Request.IsAjaxRequest()) { }
            base.HandleUnauthorizedRequest(filterContext);
            if (filterContext.HttpContext.Response.StatusCode == 401) { return; }
        }

        /// <summary>
        /// Public open license 
        /// </summary>
        /// <returns></returns>
        private bool IsAuthorityActionOrControler(string controllerName, string actionName)
        {
            if (controllerName == "Users")
            {
                return true;
            }
            else
                return false;
        }
    }

}
