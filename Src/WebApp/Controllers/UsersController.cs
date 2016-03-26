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

        #region User login
        /// <summary>
        /// User login
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
                //check code
                //if (ValidatorCode(CheckCode) != 1)
                //    return "{totalProperty:'" + dt.Rows.Count + "',checkcode:'false',msg:'校验码输入错误！'}"; ;
                //Login
                if (dt.Rows.Count > 0)
                {
                    //lock
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

                        //return result               
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


        public bool IsLogin()
        {
            if (Session["UserID"] == null)
                return false;
            else
                return true;
        }

        /// <summary>
        /// get user info
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
                if (Session["UserID"]!=null)
                {
                    DataTable dt = bll.GetList("id='" + Session["UserID"].ToString() + "'").Tables[0];
                    result = "当前用户：" + dt.Rows[0]["fullname"].ToString().Trim() + "(" + dt.Rows[0]["username"].ToString().Trim() + ")  机构：" + db.Query("SELECT * FROM SysOrganization WHERE ID='" + dt.Rows[0]["OrgId"].ToString().Trim() + "'").Rows[0]["OrgName"].ToString().Trim() + " 最后登录：" + System.DateTime.Now.ToString().Trim();
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
        ///get check code
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

        #region exit
        /// <summary>
        /// user exit
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

        #region user manage
        /// <summary>
        /// return user list
        /// </summary>
        /// <returns></returns>
        public string UserList()
        {
            string result = "{\"total\":0,\"rows\":[{}]}";
            DataTable dt = bll.GetList("").Tables[0];
            if(dt.Rows.Count>0)
            {
                result = Common.JosnEasyUI.TableToJosn(dt);
            }            
            return result;
        }
       
        /// <summary>
        /// add user save
        /// </summary>
        /// <returns></returns>
        public string AddFormSave()
        {
            string MasterTable = "SysUsers";
            string PrimaryKey = "ID";
            string KeyNumber = "";
            string CreateId = Session["UserId"].ToString();
            string CreateDate = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");            
            HttpRequestBase a = Request;
            return "";
        }

        #endregion    

        #region Validate user
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