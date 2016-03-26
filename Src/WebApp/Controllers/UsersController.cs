using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Text;
using Common=HiWind.Common;
using System.Collections;

namespace WebApp.Controllers
{
       
    [CustomAuthorize]
    public class UsersController : Controller
    {
        HiWind.IData db = HiWind.Db.Data();
        HiWind.EasyUI.User bll = new HiWind.EasyUI.User();
        HiWind.EasyUI.Transaction BllTra = new HiWind.EasyUI.Transaction();

        #region View
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Login2()
        {
            return View();
        }

        public ActionResult SearchUsers()
        {
            return View();
        }
        #endregion

        #region 用户登录
        /// <summary>
        /// 用户登录校验
        /// </summary>
        /// <param name="usrename"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public string UserLogin()
        {
            string result="{totalProperty:'-1',root:[{'字段1':'字段值1','字段2':'字段值2'}]}";
            try
            {
                string UserName = Request["UserName"].ToString().Trim();
                string PassWord = Common.DEncrypt.Encrypt(Request["PassWord"].ToString().Trim());
               // string CheckCode= Request["CheckCode"].ToString().Trim();
                DataTable dt = bll.UserLogin(UserName, PassWord);
               result = "{totalProperty:'0',checkcode:'false'}";

                //校验码
                //if (ValidatorCode(CheckCode) != 1)
                //    return "{totalProperty:'" + dt.Rows.Count + "',checkcode:'false',msg:'校验码输入错误！'}"; ;
                //登录成功
                if(dt.Rows.Count > 0)
                {
                    //判断是否锁定
                    if (dt.Rows[0]["UserState"].ToString().Trim() != "锁定")
                    {
                        //更新日志
                        //加入登录状态                    
                        Session["UserName"] = dt.Rows[0]["username"].ToString().Trim();
                        Session["UserID"] = dt.Rows[0]["id"].ToString().Trim();
                        Session["FullName"] = dt.Rows[0]["fullname"].ToString().Trim();
                        //加入登录日志
                       
                        System.Collections.Hashtable ht = new Hashtable();
                        ht.Add("SysLogs.LogsType", "用户登录");
                        ht.Add("SysLogs.IpAddress", Request.UserHostAddress.ToString());
                        ht.Add("SysLogs.Contents", "用户 [" + dt.Rows[0]["fullname"].ToString().Trim() + "] [" + dt.Rows[0]["username"].ToString().Trim() + "] 登录成功！");
                        ht.Add("SysLogs.UserId", dt.Rows[0]["id"].ToString());
                        ht.Add("SysLogs.CreateDate", System.DateTime.Now.ToString());
                        string SaveResult = BllTra.InsertOneParameter("SysLogs", "Id", ht);

                        //返回结果                
                        return "{totalProperty:'" + dt.Rows.Count + "',checkcode:'true',msg:'登录成功！'}"; ;
                    }
                    else
                        return "{totalProperty:'0',checkcode:'true',msg:'帐号被锁定,请联系管理员！'}"; ; ;
                }
                else
                {
                    return "{totalProperty:'0',checkcode:'true',msg:'用户名、密码输入有误！'}"; ; ;
                }
            }
            catch(Exception ex)
            {
                string exStr = "";
                if (ex.Message.IndexOf("无法打开登录所请求的数据库 ") > -1)
                    exStr = "数据库连接失败!";
                else if (ex.Message.IndexOf("未找到或无法访问服务器") > -1)
                    exStr = "数据库服务器网络连接失败!";
                else if (ex.Message.IndexOf("登录失败") > -1)
                    exStr = "数据库服务器登录失败!";
                else
                    exStr = "登录失败，请联系管理员！";
                
                result = "{totalProperty:'-1',checkcode:'false',msg:'"+Common.Josn.JsonString(exStr.ToString())+"'}";
                return result;
            }
        }

        /// <summary>
        /// 是否登录
        /// </summary>
        /// <returns></returns>
        public bool IsLogin()
        {
            if (Session["UserID"] == null)
                return false;
            else
                return true;
        }

        /// <summary>
        /// 获取用户登录信息
        /// </summary>
        /// <param name="usrename"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public string GetUserLogin()
        {
            string result = ""; ;
            try
            {
                //登录成功
                if (Session["UserID"]!=null)
                {
                    // 获取用户信息
                    DataTable dt = bll.GetList("id='" + Session["UserID"].ToString() + "'").Tables[0];
                    //返回结果
                    result = "当前用户：" + dt.Rows[0]["fullname"].ToString().Trim() + "(" + dt.Rows[0]["username"].ToString().Trim() + ")  机构：" + db.Query("SELECT * FROM Organization WHERE ID='" + dt.Rows[0]["OrgId"].ToString().Trim() + "'").Rows[0]["OrgName"].ToString().Trim() + " 最后登录：" + System.DateTime.Now.ToString().Trim();
                    return result;
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                return "出现异常！";
            }
        }

        /// <summary>
        /// 获取随机校验码
        /// </summary>
        /// <param name="usrename"></param>
        /// <param name="password"></param>
        /// <returns></returns>

        /// <summary>
        /// 获取验证码
        /// </summary>
        /// <returns></returns>
        public void CodeImg()
        {
            Common.RandPic code = new Common.RandPic();
            string checkCode = code.CreateRandomCode(4);
            Session["CheckCode"] = checkCode;
            code.CreateImage(checkCode);
        }
        public int ValidatorCode(string id)
        {
            int iState = 0;
            try
            {
                if (id.ToLower().Equals((Session["CheckCode"].ToString()).ToLower()))
                {
                    iState = 1;
                }

                return iState;
            }
            catch
            {
                return 0;
            }

        }
        #endregion

        #region 用户退出
        /// <summary>
        /// 用户退出
        /// </summary>
        /// <param name="usrename"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public string UserExit()
        {            
            try
            {
                Session.Clear();
                return "退出成功";
            }
            catch (Exception ex)
            {
                return "退出失败";
            }
        }
        #endregion

        #region 用户管理
        /// <summary>
        /// 返回用户列表
        /// </summary>
        /// <returns></returns>
        public string UserList()
        {
            string result = "{\"total\":0,\"rows\":[{}]}";
            // 获取用户信息
            DataTable dt = bll.GetList("").Tables[0];
            //返回结果
            if(dt.Rows.Count>0)
            {
                result = Common.JosnEasyUI.TableToJosn(dt);
            }
            
            return result;
        }

        /// <summary>
        /// 生成新增页面
        /// </summary>
        /// <returns></returns>
        public string AddFormCreate()
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("<fieldset class=\"fieldsetAdd\">");
            sb.Append("");
            sb.Append("          <legend>帐户基本信息</legend>");
            sb.Append("             <table width=\"100%\" border=\"0\" cellpadding=\"2\" cellspacing=\"2\" class=\"tableAdd\">");
            sb.Append("                 <tr>");
            sb.Append("                   <td>用户名：</td>");
            sb.Append("                   <td><input name=\"SysUser_UserName\" id=\"SysUser_UserName\" type=\"text\" class=\"easyui-validatebox\" data-options=\"required: true\" /></td>");
            sb.Append("                   <td>密码：</td>");
            sb.Append("                   <td><input name=\"SysUser_PassWord\" id=\"SysUser_PassWord\" type=\"text\" class=\"easyui-validatebox\" data-options=\"required: true\" /></td>");
            sb.Append("               </tr>");
            sb.Append("                 <tr>");
            sb.Append("                   <td>姓名：</td>");
            sb.Append("                   <td><input name=\"SysUser_FullName\" id=\"SysUser_FullName\" type=\"text\" class=\"easyui-validatebox\" data-options=\"required: true\" /></td>");
            sb.Append("                   <td>用户类型：</td>");
            sb.Append("                   <td><input name=\"SysUser_UserType\" id=\"SysUser_UserType\" type=\"text\" class=\"easyui-combobox\" data-options=\"required: true,valueField:'value',panelHeight : 'auto',textField:'label',data: [{label: '开发者',value: '1'},{label: '管理员',value: '2'},{label: '操作用户',value: '3'}]\" /></td>");
            sb.Append("                 </tr>");
            sb.Append("                 <tr>");
            sb.Append("                   <td>用户组：</td>");
            sb.Append("                   <td><input name=\"SysUser_UserGroupId\" id=\"SysUser_UserGroupId\" type=\"text\" class=\"easyui-validatebox\" data-options=\"required: false\" /></td>");
            sb.Append("                   <td>&nbsp;</td>");
            sb.Append("                   <td>&nbsp;</td>");
            sb.Append("                 </tr>");
            sb.Append("               </table>");
            sb.Append("               </fieldset>");
            sb.Append("             <fieldset  class=\"fieldsetAdd\">");
            sb.Append("             <legend>其它信息</legend>");
            sb.Append("             <table width=\"100%\" border=\"0\" cellpadding=\"2\" cellspacing=\"2\" class=\"tableAdd\">");
            sb.Append("               <tr>");
            sb.Append("                 <td>创建时间：</td>");
            sb.Append("                 <td><input name=\"SysUser_CreateDate\" id=\"SysUser_CreateDate\" type=\"text\"  class=\"easyui-datebox\"  data-options=\"required: true, validType: 'shortDate'\" /></td>");
            sb.Append("                 <td>更新时间：</td>");
            sb.Append("                 <td><input name=\"SysUser_UpdateDate\" id=\"SysUser_UpdateDate\" type=\"text\"  class=\"easyui-datebox\"  data-options=\"required: true, validType: 'shortDate'\" /></td>");
            sb.Append("               </tr>");
            sb.Append("                 <tr>");
            sb.Append("                 <td>操作人：</td>");
            sb.Append("                 <td><input name=\"SysUser_CreateId\" id=\"SysUser_CreateId\" type=\"text\" class=\"easyui-validatebox\" data-options=\"required: false\" /></td>");
            sb.Append("                 <td></td>");
            sb.Append("                 <td></td>");
            sb.Append("               </tr>");
            sb.Append("             </table>");
            sb.Append("</fieldset>");

            string result = "<form id=\"AddForm\"  class=\"easyui-form\">" + sb.ToString() + "</form>";
            return result;

        }
        /// <summary>
        /// 新增表单保存
        /// </summary>
        /// <returns></returns>
        public string AddFormSave()
        {
            //主表
            string MasterTable = "SysUsers";
            //主键
            string PrimaryKey = "ID";
            //主键编号
            string KeyNumber = "";

            //固定字段值
            string CreateId = Session["UserId"].ToString();
            string CreateDate = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            
            HttpRequestBase a = Request;


            return "";
        }

        #endregion    

        #region 验证用户是否重复
        public string ValidateUserInfo()
        {
            string result = string.Empty;
            var uname = Request["uname"].ToString();
            int count=db.Query("SELECT SysUser.Id FROM SysUser WHERE SysUser.UserName='"+uname+"'").Rows.Count;
            result = (count > 0 ? 1 : 0).ToString();            
            return result;
        }
        #endregion
    }

}