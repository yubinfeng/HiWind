using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace WebApp
{
    public class ChatHuba : Hub
    {
        HiWind.IData db = HiWind.Db.Data();

        //以下方法直接可以从服务器推送信息到客户端
        //System.Timers.Timer timers = new System.Timers.Timer（{UpdateStockPrices， null， _Interval， _Interval}）;
        //Microsoft.AspNet.SignalR.IHubContext context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext("ChatHuba");
        // context.Clients.All.ReturnUserIdToServer();              
        //context.Clients.All.showMessage("表具服务", "SysUser00000001", "ServerSignalR", "sadfsadfdsafsadfsad");
        public void Send(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.addNewMessageToPage(name, message + "(" + System.DateTime.Now.ToString() + ")");
        }

        /// <summary>
        ///收到客户端用户发送的ID响应
        /// </summary>
        /// <param name="UserID"></param>
        public void GetUser(string UserID)
        {


            //判断有可用表具服务提示
            WebApp.Controllers.MainController con = new Controllers.MainController();
            string Info = "";
            //Clients.All.showMessage("表具服务", UserID, "ServerSignalR",Info);
            //判断有无其它可用消息
            //MessageType, RceiveUser, SendUser, Info
            // Clients.All.showMessage("短消息", "发送人", "接收人","内容");

            string MsgInfo = con.MessageRead(UserID);
            string MsgId = MsgInfo.Split(';')[0].ToString().Trim();
            string MessageInfo = MsgInfo.Split(';')[1].ToString().Trim();

            if (Info != "0;info" || MsgInfo != "0;info")
            {
                Clients.All.showMessage("表具服务", UserID, "ServerSignalR", Info, "即时通信", MsgId != "0" ? UserID : "", MessageInfo, MsgId);
            }
        }

        /// <summary>
        /// 更新表具状态
        /// </summary>
        /// <param name="MeterServiceId"></param>
        public void UpdateMeterState(string MeterServiceId)
        {
            try
            {

                string ExSql = "update MeterService set IsRead='已读' where id='" + MeterServiceId + "'";
                db.ExecuteSql(ExSql);
            }
            catch (Exception ex) { }
        }

        /// <summary>
        /// 更新表具状态
        /// </summary>
        /// <param name="MeterServiceId"></param>
        public void UpdateMessageState(string MessageId)
        {
            try
            {
                string ExSql = "update SysMessage set IsRead='已读',ReadDate='" + System.DateTime.Now.ToString() + "' where id in (" + MessageId + ")";
                db.ExecuteSql(ExSql);
            }
            catch (Exception ex) { }
        }
        /// <summary>
        /// 向用户索取用户编号
        /// </summary>
        /// <param name="UserID"></param>
        public void SendUser()
        {
            // Call the addNewMessageToPage method to update clients.      
            Clients.All.ReturnUserIdToServer();
        }


        /// <summary>
        ///收到客户端用户发送的消息，广播通知接收者
        /// </summary>
        /// <param name="UserID"></param>
        public void SendMessageToUser(string SendName, string RceiveUserId, string Message)
        {

            string MessageType = "即时通信";

            Clients.All.showMessage("表具服务", "0", "ServerSignalR", "", MessageType, RceiveUserId, SendName + "：" + Message + "  (" + System.DateTime.Now.ToString() + ")", "");
        }


    }

    //实现HUB实例
    public class ChatTicker
    {

        private static readonly ChatTicker _instance = new ChatTicker(GlobalHost.ConnectionManager.GetHubContext<ChatHuba>());

        private readonly IHubContext m_context;

        public ChatTicker(IHubContext context)
        {
            m_context = context;
        }

        public IHubContext GlobalContext
        {
            get { return m_context; }
        }

        public static ChatTicker Instance
        {
            get { return _instance; }
        }
    }
}