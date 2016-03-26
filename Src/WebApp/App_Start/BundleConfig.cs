using System.Web;
using System.Web.Optimization;

namespace WebApp
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            // bundles.Add(new ScriptBundle("~/Scripts/jeasyui-extensions/extjs").Include("~/Scripts/jeasyui-extensions/*.js"));
            // bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap.css","~/Content/site.css"));
            //扩展
            bundles.Add(new ScriptBundle("~/Scripts/jeasyui-extensions/extjs").Include("~/Scripts/jeasyui-extensions/easyuiext.js"));
            bundles.Add(new StyleBundle("~/Scripts/jeasyui-extensions/extcss").Include("~/Scripts/jeasyui-extensions/jeasyui.extensions.css"));
            //BundleTable.EnableOptimizations = false;
        }
    }
}
