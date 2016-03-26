using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Text;
using System.Collections;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Configuration;
using System.Diagnostics;
using Common = HiWind.Common;

namespace WebApp.Controllers
{
    /// <summary>
    /// Main/// 
    /// Create: ybf 2014/5/20
    /// Last Update: ybf 2016/03/03
    /// </summary>

    [CustomAuthorize]
    public class MainController : HiWindController
    {

        #region View
        public override ActionResult Index()
        {
            ViewData["HeadMenu"] = new HiWind.EasyUI.Menu(UserID).GetTopHeadMenu().ToString();
            ViewData["UserFullName"] = SysConstant["UserFullName"].ToString();
            ViewData["UserName"] = SysConstant["UserName"].ToString();
            ViewData["UserType"] = SysConstant["UserType"].ToString();          
            return View();
        }
        public ActionResult Home()
        {
            ViewData["HeadMenu"] = new HiWind.EasyUI.Menu(UserID).GetTopHeadMenu().ToString();
            return View();
        }

        public ActionResult HouseManage()
        {
            return View();
        }

        public ActionResult SignalRChat()
        {
            return View();
        }

        public ActionResult ScheduledTask()
        {
            return View();
        }

        #region 抄表
        public string SearchPage(string SearchId, string TableName, string FormId)
        {
            var search = new HiWind.EasyUI.Search(UserID);
            return search.SearchPageGrid(SearchId, true, true, 0, Request["Parese"]);
        }
        #endregion

        #region View HomePage
        public ActionResult HomePage()
        {
            return View();
        }

        #endregion


        #endregion        

        #region Tree LeftHouse  

        /// <summary>
        /// 树节点
        /// </summary>
        StringBuilder AllNodes = new StringBuilder();

        /// <summary>
        /// 获取顶级菜单节点
        /// </summary>
        /// <returns></returns>
        public string GetTopMenu()
        {
            string result = "[";
            result += "{ \"id\": \"1\", \"text\": \"0菜单管理\", \"iconCls\": \"icon-hamburg-product-design\" , \"attributes\": { \"href\": \"/main/menusearch?id=1&icon=icon-hamburg-docs&title=菜单管理\" }},";
            result += "{ \"id\": \"2\", \"text\": \"0用户管理\", \"iconCls\": \"icon-hamburg-docs\", \"attributes\": { \"href\": \"/users/search?id=1&icon=icon-hamburg-docs&title=用户管理\" }},";
            result += "{ \"id\": \"3\", \"text\": \"0权限管理\", \"iconCls\": \"icon-hamburg-product-design\" , \"attributes\": { \"href\": \"/users/search?id=3\"} },	";
            result += "{ \"id\": \"4\", \"text\": \"0日志管理\", \"iconCls\": \"icon-hamburg-docs\", \"attributes\": { \"href\": \"/users/search?id=1&icon=icon-hamburg-docs&title=用户管理\" }},";
            result += "{ \"id\": \"10\", \"text\": \"0EasyUI API\", \"iconCls\": \"icon-hamburg-product-design\"  },	";
            result += "{ \"id\": \"11\", \"text\": \"0EasyUI Demo\", \"iconCls\": \"icon-hamburg-product-design\" }";
            result += "]";
                      
            DataTable dt = bllMenu.GetTopMenu();
            result = "[";
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    result += "{ \"id\": \"" + row["ID"].ToString().Trim() + "\", \"text\": \"" + row["MenuName"].ToString().Trim() + "\", \"iconCls\": \"" + row["MenuIcon"].ToString().Trim() + "\"";
                    if (row["MenuUrl"].ToString().Trim() != "")
                        result += " , \"attributes\": { \"href\": \"" + row["MenuUrl"].ToString().Trim() + "\" }},";
                    else
                        result += "},";
                }
            }
            result = Common.StringPlus.DelLastStr(result);
            result += "]";
            result = HiWind.EasyUI.CommonUI.ReplaceSysConstant(result,UserID);
            return result;
        }


        /// <summary>
        /// 根据父ID获取子节点序列
        /// </summary>
        /// <returns></returns>
        public string GetChildrenMenus()
        {
            string menuparentid = Request.QueryString["menuparentid"].ToString();

            StringBuilder lastResult = new StringBuilder();
            lastResult.Append("[");
           
            DataTable dt = bllMenu.GetChildrenMenus(menuparentid);

            if (dt.Rows.Count > 0)
            {
                string resultchildnodes = GetNodes(dt).ToString(); ;
                lastResult.Append(resultchildnodes);
            }
            lastResult.Append("]");

            return lastResult.ToString();
        }
        /// <summary>
        /// 节节点
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private StringBuilder GetNodes(DataTable dt)
        {
            StringBuilder result2 = new StringBuilder();
            if (dt.Rows.Count > 0)
            {
                int i = 0;            
                foreach (DataRow row in dt.Rows)
                {
                    AllNodes.Append("{ \"id\": \"" + row["ID"].ToString().Trim() + "\", \"text\": \"" + row["MenuName"].ToString().Trim() + "\", \"iconCls\": \"" + row["MenuIcon"].ToString().Trim() + "\"");
                    //递归节点
                    DataTable dtnodes = bllMenu.GetChildrenMenus(row["ID"].ToString().Trim());
                    if (dtnodes.Rows.Count > 0)
                    {
                        AllNodes.Append(", \"children\": [");
                        GetNodes(dtnodes);
                        AllNodes.Append("]");
                    }

                    if (row["MenuUrl"].ToString().Trim() != "")
                        AllNodes.Append(" , \"attributes\": { \"href\": \"" + row["MenuUrl"].ToString().Trim() + "\" }}");
                    else
                        AllNodes.Append("}");

                    i += 1;

                    if (i < dt.Rows.Count)
                        AllNodes.Append(",");
                }
            }
            return AllNodes;
        }
        #endregion        
       
        #region ReadMessage
        /// <summary>
        /// 服务执行情况读取 For SignalR
        /// </summary>
        /// <returns></returns>
        public string MessageRead(string UserId)
        {
            string result = "0;info"; //0,无提示信息 info 消息内容 0发送人
            string NoRead = "select  * from SysMessage  where id  not in (select SysMessage.id from SysMessage where IsRead ='已读')  and ( SysMessage.RceiveUser='" + UserId + "' or SysMessage.RceiveUser='*') ORDER BY SysMessage.UpdateDate,SysMessage.CreateDate ASC";
           
            DataTable Dt = db.Query(NoRead);

            if (Dt.Rows.Count > 0)
            {
                int i = 0;
                string Id ="";
                string info = "";       
                foreach(DataRow n in Dt.Rows)
                {
                 string IsEndStr = i < Dt.Rows.Count - 1 ? "," : "";
                 Id +="'"+n["ID"].ToString().Trim()+"'"+IsEndStr;               
                 //RceiveUser += n["RceiveUser"].ToString().Trim();
                 string SendUserName = db.Query("select *  from SysUser where id='" + n["SendUser"].ToString().Trim() + "'").Rows[0]["FullName"].ToString().Trim();
                 info += SendUserName+":"+ n["info"].ToString().Trim() + "  （" + n["CreateDate"].ToString().Trim() + ")" + (IsEndStr != "" ? "<br>" : "");
                 //SendUser += SendUserName+IsEndStr;
                 i += 1;
                }
                //bll.ExecuteSql(ExSql);
                result = Id + ";" + info;

            }
            else
            {

                result = "0;info";
            }
            return result;
        }

        #endregion

    }
}