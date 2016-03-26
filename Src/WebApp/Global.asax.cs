using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace WebApp
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        //static System.Timers.Timer myTimer = new System.Timers.Timer(1500);//2秒
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);


            //创建定时器，用于执行即时消息
            // 在应用程序启动时运行的代码

            //myTimer.Elapsed += new System.Timers.ElapsedEventHandler(OnTimedEvent);
            //myTimer.Interval = 1500;
            //myTimer.Enabled = true;
        }

        private static void OnTimedEvent(object source, System.Timers.ElapsedEventArgs e)
        {
            //myTimer.Stop();

            // 监控表具服务是否有变化，有则更新用户服务列表    
            //HiWind.Business.SysSearch bllSearch = new HiWind.Business.SysSearch();
            //int WaitServiceSecond = bllSearch.SearchResultCont("SysSearch00000086");
            //int FinishServiceSecond = bllSearch.SearchResultCont("SysSearch00000091");
            //int FailServiceSecond = bllSearch.SearchResultCont("SysSearch00000092");

            ////监控表具服务是否有变化，向客户端发广播
            //if (WaitService != WaitServiceSecond || FinishService != FinishServiceSecond || FailService != FailServiceSecond)
            //{
            //    Microsoft.AspNet.SignalR.IHubContext context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext("ChatHuba");
            //    context.Clients.All.ReturnUserIdToServer();
            //}
            //WaitService = WaitServiceSecond;
            //FinishService = FinishServiceSecond;
            //FailService = FailServiceSecond;

            //myTimer.Start();
        }
    }
}
