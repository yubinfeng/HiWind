using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections;
using System.Data;
using Common = HiWind.Common;

namespace WebApp.Controllers
{
    /// <summary>
    /// HiWind Show for EasyUi
    /// Create:ybf 2016/3/2
    /// Update:ybf 2016/3/25
    /// </summary>
    [CustomAuthorize]
    public class HiWindController : Controller
    {
        #region Global
        public HiWind.EasyUI.Menu bllMenu = new HiWind.EasyUI.Menu();
        public HiWind.EasyUI.Transaction bllTransaction = new HiWind.EasyUI.Transaction();
        public HiWind.EasyUI.Search bllSearch = new HiWind.EasyUI.Search();
        public HiWind.EasyUI.Config bllConfig = new HiWind.EasyUI.Config();
        public HiWind.EasyUI.Number sysKeyNmber = new HiWind.EasyUI.Number();
        public static readonly HiWind.Model.SysConfig configModel = new HiWind.EasyUI.Config().GetConfigModel();
        public HiWind.IData db = HiWind.Db.Data();
        public string UserID
        {
            get { return Session["UserId"].ToString().ToString(); }
        }
        public Hashtable SysConstant
        {
            get { return HiWind.EasyUI.CommonUI.SysConstant(Session["UserId"].ToString()); }
        }
        #endregion

        #region Show

        public virtual ActionResult Index()
        {
            ViewData["HeadMenu"] = new HiWind.EasyUI.Menu(UserID).GetTopHeadMenu().ToString();
            ViewData["UserFullName"] = SysConstant["UserFullName"].ToString();
            ViewData["UserName"] = SysConstant["UserName"].ToString();
            ViewData["UserType"] = SysConstant["UserType"].ToString();
            return View();
        }

        public ActionResult SearchMenus()
        {
            if (Request.QueryString["SearchId"] != null)
                ViewData["SearchId"] = Request.QueryString["SearchId"].ToString();
            else
                ViewData["SearchId"] = "";

            if (Request.QueryString["TableName"] != null)
                ViewData["TableName"] = Request.QueryString["TableName"].ToString();
            else
                ViewData["TableName"] = "";

            if (Request.QueryString["FormId"] != null)
                ViewData["FormId"] = Request.QueryString["FormId"].ToString();
            else
                ViewData["FormId"] = "";

            //Load search list
            Hashtable SearchDt = new HiWind.EasyUI.Search(UserID).SearchLoad(Request.QueryString["SearchId"].ToString());
            string ColStr = "";
            string FrozenColumns = "";
            string SearchOther = "";
            string KeyId = "";
            if (SearchDt.Keys.Count > 0)
            {
                ColStr = SearchDt["Columns"] != null ? SearchDt["Columns"].ToString().Trim() : "";
                FrozenColumns = SearchDt["FrozenColumns"] != null ? SearchDt["FrozenColumns"].ToString().Trim() : "";
                SearchOther = SearchDt["SearchOther"] != null ? SearchDt["SearchOther"].ToString().Trim() : "";
                KeyId = SearchDt["KeyId"] != null ? SearchDt["KeyId"].ToString().Trim() : "Id";
            }
            ViewData["SearchColumns"] = ColStr;
            ViewData["FrozenColumns"] = FrozenColumns;
            ViewData["SearchOther"] = SearchOther;
            ViewData["SearchKeyField"] = KeyId;
            //Load TriggerKey
            Hashtable TriggerKeyDt = new HiWind.EasyUI.TriggerKey(UserID).TriggerKeyLoadForSearch(Request.QueryString["SearchId"].ToString());
            string TriggerKeyFirst = "";
            string TriggerKeyLast = "";
            if (TriggerKeyDt.Keys.Count > 0)
            {
                TriggerKeyFirst = TriggerKeyDt["TrigFirst"] != null ? TriggerKeyDt["TrigFirst"].ToString().Trim() : "";
                TriggerKeyLast = TriggerKeyDt["TrigLast"] != null ? TriggerKeyDt["TrigLast"].ToString().Trim() : "";
            }
            ViewData["TriggerKeyFirst"] = TriggerKeyFirst;
            ViewData["TriggerKeyLast"] = TriggerKeyLast;
            return View();
        }

        public ActionResult Search()
        {
            var search = new HiWind.EasyUI.Search(UserID);
            string SearchId = "";
            if (Request.QueryString["SearchId"] != null)
            {
                ViewData["SearchId"] = Request.QueryString["SearchId"].ToString();
                SearchId = Request.QueryString["SearchId"].ToString().Trim();
            }
            else
                ViewData["SearchId"] = "";
            ViewData["SearchContent"] = search.SearchPageGrid(ViewData["SearchId"].ToString(), true, true, 0, Request["Parese"]);
            return View();
        }

        public ActionResult Form()
        {
            if (Request.QueryString["Type"] != null)
            {
                if (Request.QueryString["Type"].ToString() == "Add")
                    ViewData["FormContent"] = new HiWind.EasyUI.Form(UserID).AddFormToTab(Request.QueryString["FormId"]);
                else if (Request.QueryString["Type"].ToString() == "Edit")
                    ViewData["FormContent"] = new HiWind.EasyUI.Form(UserID).AddFormToTab(Request.QueryString["FormId"]);
                else if (Request.QueryString["Type"].ToString() == "Show")
                    ViewData["FormContent"] = new HiWind.EasyUI.Form(UserID).AddFormToTab(Request.QueryString["FormId"]);
            }
            return View();
        }
        public ActionResult Functions()
        {
            var search = new HiWind.EasyUI.Search(UserID);
            ViewData["Grid1"] = search.SearchPageGrid("SysSearch00000077", "SysFunctionList", "SysForm00000003", "Menu", "菜单", false);
            ViewData["Grid2"] = search.SearchPageGrid("SysSearch00000078", "SysFunctionList", "SysForm00000003", "Search", "查询", false);
            ViewData["Grid3"] = search.SearchPageGrid("SysSearch00000082", "SysFunctionList", "SysForm00000003", "Form", "表单", false);
            ViewData["Grid4"] = search.SearchPageGrid("SysSearch00000083", "SysFunctionList", "SysForm00000003", "Key", "触发键", false);
            ViewData["Grid5"] = search.SearchPageGrid("SysSearch00000084", "SysFunctionList", "SysForm00000003", "Other", "其它", false);
            return View();
        }
        public ActionResult Role()
        {
            var search = new HiWind.EasyUI.Search(UserID);
            ViewData["Grid1"] = search.SearchPageGrid("SysSearch00000041", "SysRole", "SysForm00000003", "Role", "角色列表", true);
            ViewData["Grid2"] = search.SearchPageGrid("SysSearch00000030", "SysUserRole", "SysForm00000003", "UserRole", "", false);
            return View();
        }
        public ActionResult Users()
        {
            var search = new HiWind.EasyUI.Search(UserID);
            ViewData["Grid1"] = search.SearchPageGrid("SysSearch00000042", "SysUser", "SysForm00000003", "User", "操作员管理", true);
            ViewData["Grid2"] = search.SearchPageGrid("SysSearch00000085", "SysUserRole", "SysForm00000003", "UserRole", "", false);
            return View();
        }
        public ActionResult SearchGridTree()
        {
            if (Request.QueryString["SearchId"] != null)
                ViewData["SearchId"] = Request.QueryString["SearchId"].ToString();
            else
                ViewData["SearchId"] = "";

            if (Request.QueryString["TableName"] != null)
                ViewData["TableName"] = Request.QueryString["TableName"].ToString();
            else
                ViewData["TableName"] = "";

            if (Request.QueryString["FormId"] != null)
                ViewData["FormId"] = Request.QueryString["FormId"].ToString();
            else
                ViewData["FormId"] = "";

            Hashtable SearchDt = new HiWind.EasyUI.Search(UserID).SearchLoad(Request.QueryString["SearchId"].ToString());

            //Load search conditional
            string SearchConditions = "";
            if (SearchDt.Keys.Count > 0)
                SearchConditions = SearchDt["SearchConditions"] != null ? SearchDt["SearchConditions"].ToString().Trim() : "";

            SearchConditions = new HiWind.EasyUI.Form(UserID).HtmlChanges(SearchConditions);          
            SearchConditions = HiWind.EasyUI.CommonUI.ReplaceSysConstant(SearchConditions, UserID);
            ViewData["SearchConditions"] = SearchConditions;

            //Load saerch list
            string ColStr = ""; string FrozenColumns = "";
            string SearchOther = "";
            if (SearchDt.Keys.Count > 0)
            {
                ColStr = SearchDt["Columns"] != null ? SearchDt["Columns"].ToString().Trim() : "";
                FrozenColumns = SearchDt["FrozenColumns"] != null ? SearchDt["FrozenColumns"].ToString().Trim() : "";
                SearchOther = SearchDt["SearchOther"] != null ? SearchDt["SearchOther"].ToString().Trim() : "";
            }
            ViewData["SearchColumns"] = ColStr;
            ViewData["FrozenColumns"] = FrozenColumns;
            ViewData["SearchOther"] = SearchOther;

            //Load TriggerKey
            Hashtable TriggerKeyDt = new HiWind.EasyUI.TriggerKey(UserID).TriggerKeyLoadForSearch(Request.QueryString["SearchId"].ToString());
            string TriggerKeyFirst = "";
            string TriggerKeyLast = "";
            if (TriggerKeyDt.Keys.Count > 0)
            {
                TriggerKeyFirst = TriggerKeyDt["TrigFirst"] != null ? TriggerKeyDt["TrigFirst"].ToString().Trim() : "";
                TriggerKeyLast = TriggerKeyDt["TrigLast"] != null ? TriggerKeyDt["TrigLast"].ToString().Trim() : "";
            }
            ViewData["TriggerKeyFirst"] = TriggerKeyFirst;
            ViewData["TriggerKeyLast"] = TriggerKeyLast;
            return View();
        }
        public ActionResult SysFunctionRole()
        {
            if (Request.QueryString["SearchId"] != null)
                ViewData["SearchId"] = Request.QueryString["SearchId"].ToString();
            else
                ViewData["SearchId"] = "";

            if (Request.QueryString["TableName"] != null)
                ViewData["TableName"] = Request.QueryString["TableName"].ToString();
            else
                ViewData["TableName"] = "";

            if (Request.QueryString["FormId"] != null)
                ViewData["FormId"] = Request.QueryString["FormId"].ToString();
            else
                ViewData["FormId"] = "";

            //Load search list
            Hashtable SearchDt = new HiWind.EasyUI.Search(UserID).SearchLoad(Request.QueryString["SearchId"].ToString());
            string ColStr = "";
            string FrozenColumns = "";
            string SearchOther = "";
            string KeyId = "";
            if (SearchDt.Keys.Count > 0)
            {
                ColStr = SearchDt["Columns"] != null ? SearchDt["Columns"].ToString().Trim() : "";
                FrozenColumns = SearchDt["FrozenColumns"] != null ? SearchDt["FrozenColumns"].ToString().Trim() : "";
                SearchOther = SearchDt["SearchOther"] != null ? SearchDt["SearchOther"].ToString().Trim() : "";
                KeyId = SearchDt["KeyId"] != null ? SearchDt["KeyId"].ToString().Trim() : "Id";
            }
            ViewData["SearchColumns"] = ColStr;
            ViewData["FrozenColumns"] = FrozenColumns;
            ViewData["SearchOther"] = SearchOther;
            ViewData["SearchKeyField"] = KeyId;

            //Load TriggerKey
            Hashtable TriggerKeyDt = new HiWind.EasyUI.TriggerKey(UserID).TriggerKeyLoadForSearch(Request.QueryString["SearchId"].ToString());
            string TriggerKeyFirst = "";
            string TriggerKeyLast = "";
            if (TriggerKeyDt.Keys.Count > 0)
            {
                TriggerKeyFirst = TriggerKeyDt["TrigFirst"] != null ? TriggerKeyDt["TrigFirst"].ToString().Trim() : "";
                TriggerKeyLast = TriggerKeyDt["TrigLast"] != null ? TriggerKeyDt["TrigLast"].ToString().Trim() : "";
            }
            ViewData["TriggerKeyFirst"] = TriggerKeyFirst;
            ViewData["TriggerKeyLast"] = TriggerKeyLast;
            return View();
        }

        #endregion

        #region HiWind 

        #region Form  
        /// <summary>
        /// Add form page
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string AddForm()
        {
            return new HiWind.EasyUI.Form(UserID).AddForm(Request.QueryString["FormId"].ToString().Trim());
        }
        /// <summary>
        /// update form page
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string EditForm()
        {
            return new HiWind.EasyUI.Form(UserID).EditForm(Request.QueryString["FormId"].ToString().Trim());
        }
        /// <summary>
        /// get form data
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string GetFormData()
        {
            string id = Request.QueryString["Id"].ToString().Trim();
            string TableName = Request.QueryString["TableName"].ToString().Trim();
            ArrayList Keys = new ArrayList();
            foreach (string key in Request.Form.AllKeys)
            {
                if (key.IndexOf(TableName + "_") == 0)
                    Keys.Add(key);
            }
            return new HiWind.EasyUI.Form(UserID).GetFormData(TableName,id,Keys);

        }

        /// <summary>
        /// Add form page (simple)
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string AddFormTest()
        {
            return new HiWind.EasyUI.Form(UserID).AddFormTest(Request.QueryString["FormId"].ToString().Trim());
        }

        /// <summary>
        /// Open add form page (simple)
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string AddFormOpen()
        {
            return new HiWind.EasyUI.Form(UserID).AddFormTest(Request.QueryString["FormId"].ToString().Trim(),"Add");
        }

        /// <summary>
        ///  Open update form page (simple)
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string EditFormOpen()
        {
            return new HiWind.EasyUI.Form(UserID).AddFormTest(Request.QueryString["FormId"].ToString().Trim(),"Edit");
        }
        /// <summary>
        ///  Open gridtree form page (simple)
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string AddGridTree()
        {
            return new HiWind.EasyUI.Form(UserID).AddGridTree(Request.QueryString["FormId"].ToString().Trim());
        }

        /// <summary>
        /// Preview form
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string FormPreview()
        {
            return new HiWind.EasyUI.Form(UserID).FormPreview(Request["SysForm_FormHtml"].ToString().Trim());
        }

         /// <summary>
         /// Show a add form window
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string ShowFormAddEval()
        {                   
            string formId = Request.QueryString["FormId"].ToString().Trim();
            string title = Request.QueryString["title"].ToString().Trim();
            string iconCls = Request.QueryString["iconCls"].ToString().Trim();
            string width = Request.QueryString["width"].ToString().Trim();
            string height = Request.QueryString["height"].ToString().Trim();
            string parses = Request.QueryString["Parses"] != null ? Request.QueryString["Parses"].ToString().Trim() : "";
            return new HiWind.EasyUI.Form(UserID).ShowFormAddEval(formId, title, iconCls, width, height, parses);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string ShowFormEditEval()
        {
            string formId = Request.QueryString["FormId"].ToString().Trim();
            string title = Request.QueryString["title"].ToString().Trim();
            string iconCls = Request.QueryString["iconCls"].ToString().Trim();
            string width = Request.QueryString["width"].ToString().Trim();
            string height = Request.QueryString["height"].ToString().Trim();
            string parses = Request.QueryString["Parses"] != null ? Request.QueryString["Parses"].ToString().Trim() : "";
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            string id = Request.QueryString["Id"].ToString().Trim();
            return new HiWind.EasyUI.Form(UserID).ShowFormEditEval(formId, title, iconCls, width, height,tableName,id,parses);
        }

        /// <summary>
        /// Form data tool
        /// </summary>
        /// <returns></returns>
        public string FormDataTool(string tableName)
        {          
            return new HiWind.EasyUI.Form(UserID).FormDataTool(tableName); ;
        }

        #region Delete form
        /// <summary>
        /// Delete form(Delete  Triggerkey and Transaction for form)
        /// </summary>
        /// <param name="roleId">Id list</param>
        /// <returns></returns>
        public string FormDelete(string formIds)
        {
            List<string> list = new List<string>();
            foreach (string id in formIds.Split(','))
                list.Add(id);
            return new HiWind.EasyUI.Form(UserID).FormDelete(list); ;
        }
        #endregion

        #endregion

        #region Transaction 

        #region Form update save for HiWind
        /// <summary>
        /// Form update save for HiWind
        /// </summary>
        /// <returns></returns>

        [ValidateInput(false)]
        public string SysFormEditSave()
        {
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            string id = Request.QueryString["Id"].ToString().Trim();          
            Hashtable formData = GetEditFormRequst();
            return new HiWind.EasyUI.Transaction(UserID).SysFormEditSave(tableName,id,formData);
        }
        #endregion

        #region Add save for basic form 
        /// <summary>
        /// Add save for Basic form 
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string AddSave()
        {
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            Hashtable formData = GetAddFormRequst();
            return new HiWind.EasyUI.Transaction(UserID).AddSave(tableName,formData);
        }
        #endregion

        #region Update save for basic form 
        /// <summary>
        ///Update save for Basic form 
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string EditSave()
        {
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            string id = Request.QueryString["Id"].ToString().Trim();
            Hashtable formData = GetEditFormRequst();
            return new HiWind.EasyUI.Transaction(UserID).SysFormEditSave(tableName, id, formData);
        }
        #endregion

        #region Delte for basic form 
        /// <summary>
        ///  Delte for Basic form 
        /// </summary>
        /// <param name="TableName"></param>
        /// <param name="Id"></param>
        /// <param name="Keys"></param>
        /// <returns></returns>
        public string DelteData()
        {
            return new HiWind.EasyUI.Transaction(UserID).DelteData(new List<HiWind.Model.SearchWhere>() {
                new HiWind.Model.SearchWhere()
                {
                    Table = Request.Params["TableName"].ToString().Trim(),
                    Filed = "Id",
                    Logic = "in",
                    Value = Request.Params["Id"].ToString().Trim()
                }
            });

        }
        #endregion

        #region Transaction list for basic form
        /// <summary>
        ///  Delte for Basic form 
        /// </summary>
        /// <returns></returns>
        public string MoreTran()
        {
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            string id = Request.QueryString["Id"].ToString().Trim();
            Hashtable formData = GetEditFormRequst();
            return new HiWind.EasyUI.Transaction(UserID).MoreTran(tableName, id, formData);
        }
        #endregion

        #endregion

        #region Dictionary
        /// <summary>
        /// Get dictionary data with id
        /// </summary>
        /// <param name="dicId"></param>
        /// <returns></returns>
        public string Dic(string dicId)
        {
            return new HiWind.EasyUI.Dictionary(UserID).GetDictionary(dicId);
        }
        #endregion

        #region Function
        /// <summary>
        /// Load function tree
        /// </summary>
        /// <returns></returns>     
        public string FunctionTreeLoad()
        {
           return  new HiWind.EasyUI.Function(UserID).FunctionTreeLoad();
        }

        /// <summary>
        /// Load function unit list
        /// </summary>
        /// <returns></returns>     
        public string FunctionUnitItemLoad()
        {
            return new HiWind.EasyUI.Function(UserID).FunctionUnitItemLoad();
        }

        /// <summary>
        /// Add function unit 
        /// </summary>
        /// <returns></returns>
        public string FunctionListAdd()
        {
            string functionUnitType = Request.QueryString["FunctionUnitType"].ToString().Trim();
            string functionId = Request.QueryString["FunctionId"].ToString().Trim();
            string functionUnitId = Request.QueryString["FunctionUnitId"].ToString().Trim();
            return new HiWind.EasyUI.Function(UserID).FunctionListAdd(functionUnitType,functionId,functionUnitId);
        }
        #endregion

        #region Role

        /// <summary>
        /// Delete role（delete all associated user and function ）
        /// </summary>
        /// <param name="roleIds"></param>
        /// <returns></returns>
        public string RoleDelete(string roleIds)
        {          
            return new HiWind.EasyUI.Role(UserID).RoleDelete(roleIds);
        }
        /// <summary>
        /// Add function for role
        /// </summary>
        /// <returns></returns>
        public string RoleFunctionListAdd()
        {
            string roleId = Request.QueryString["RoleId"].ToString().Trim();
            string functionIds = Request.QueryString["FunctionIds"].ToString().Trim();
            return new HiWind.EasyUI.Role(UserID).RoleFunctionListAdd(roleId,functionIds);
        }

        /// <summary>
        /// Check funtcion tree
        /// </summary>
        /// <returns></returns>     
        public string RoleFunctionTreeCheck()
        {
            string roleId = Request.QueryString["RoleId"] != null ? Request.QueryString["RoleId"].ToString().Trim() : "";
            string roleType = Request.QueryString["RoleType"] != null ? Request.QueryString["RoleType"].ToString().Trim() : "";
            return new HiWind.EasyUI.Role(UserID).RoleFunctionTreeCheck(roleId, roleType);
        }
        
        /// <summary>
        ///Add user for role
        /// </summary>
        /// <returns></returns>
        public string RoleUserListAdd()
        {
            string roleId = Request.QueryString["RoleId"].ToString().Trim();
            string userIds = Request.QueryString["UserIds"].ToString().Trim();
            return new HiWind.EasyUI.Role(UserID).RoleUserListAdd(roleId, userIds);

        }
        #endregion

        #region User
        /// <summary>
        /// Add role for user
        /// </summary>
        /// <returns></returns>
        public string UserRoleListAdd(string userId,string roleIds)
        {            
            return new HiWind.EasyUI.User(UserID).UserRoleListAdd(userId,roleIds);
        }

        /// <summary>
        /// Delete role（delete all associated role and function）
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public string UserDelete(string userIds)
        {           
            return new HiWind.EasyUI.User(UserID).DeleteUser(userIds);
        }
        #endregion

        #region Search
        /// <summary>
        /// Search list
        /// </summary>
        /// <returns></returns>   
        public string SearchList()
        {
            string searchId = Request.QueryString["SearchId"].ToString().Trim();
            string page = Request.QueryString["page"] != null ? Request.QueryString["page"].ToString().Trim() : "";
            string rows = Request.QueryString["rows"] != null ? Request.QueryString["rows"].ToString().Trim() : "";
            string pageNumber = Request.QueryString["pageNumber"] != null ? Request.QueryString["pageNumber"].ToString().Trim() : "";
            string pageSize = Request.QueryString["pageSize"] != null ? Request.QueryString["pageSize"].ToString().Trim() : "";
            string pageIndex = Request.QueryString["pageIndex"] != null ? Request.QueryString["pageIndex"].ToString().Trim() : "";
            string searchFormData = GetSearchFormData();
            return new HiWind.EasyUI.Search(UserID).SearchList(searchId, page, rows, pageNumber, pageSize, pageIndex, searchFormData);
        }

        /// <summary>
        /// A tool for search
        /// </summary>
        /// <returns></returns>
        public string SearchBackup()
        {
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            return new HiWind.EasyUI.Search(UserID).SearchBackup(tableName); ;
        }

        #region Delete search (delete all associated Transaction and Triggerkey )

        /// <summary>
        /// Delete search(delete all associated Transaction and Triggerkey)
        /// </summary>
        /// <param name="roleId">Id list</param>
        /// <returns></returns>
        public string SearchDelete(string searchIds)
        {
            List<string> list = new List<string>();
            foreach (string id in searchIds.Split(','))
                list.Add(id);
            return new HiWind.EasyUI.Search(UserID).SearchDelete(list); ;
        }
        #endregion

        #region Select
        public string SelectLoad()
        {
            string searchId = Request["SearchId"].ToString().Trim();            
            string searchFormData = GetSearchFormData();
            return new HiWind.EasyUI.Select(UserID).SelectLoad(searchId,searchFormData);
        }
        #endregion

        #region Common

        #region Get search form data
        private string GetSearchFormData()
        {        
            string SearchWhere = string.Empty;
            foreach (string formid in Request.QueryString)
            {
                if (Request.QueryString[formid].IndexOf('*') >= 0)
                {
                    string value = Request.QueryString[formid].Split('*')[0].ToString();
                    string relation = Request.QueryString[formid].Split('*')[1].ToString() != "" ? Request.QueryString[formid].Split('*')[1].ToString() : "=";
                    if (value != "")
                    {
                        string formidNew = formid.IndexOf('_') > 0 ? (formid.Split('_')[0] + "." + formid.Split('_')[1]) : formid;

                        switch (relation)
                        {
                            case "包含":
                                SearchWhere += " " + formidNew + " like '%" + value + "%' and";
                                break;
                            case "等于":
                                SearchWhere += " " + formidNew + " ='" + value + "' and";
                                break;
                            case "不等于":
                                SearchWhere += " " + formidNew + " <>'" + value + "' and";
                                break;
                            case "大于等于":
                                SearchWhere += " " + formidNew + " >='" + value + "' and";
                                break;
                            case "小于等于":

                                if (formidNew.IndexOf(':') < 0)
                                    SearchWhere += " " + formidNew + " <='" + value + " 23:59:59' and";
                                else
                                    SearchWhere += " " + formidNew + " <='" + value + "' and";
                                break;
                            case "子集":
                                SearchWhere += " " + formidNew + " in  (" + value + ") and";
                                break;
                            case "拼音左包含":
                                {
                                    //是否包含汉字
                                    System.Text.RegularExpressions.Regex r = new System.Text.RegularExpressions.Regex(@"[\u4e00-\u9fa5]+");
                                    System.Text.RegularExpressions.Match mc = r.Match(value);
                                    if (mc.Length != 0)
                                    {
                                        SearchWhere += " " + formidNew + " like '%" + value + "%' and";
                                    }
                                    else
                                        SearchWhere += " left(dbo.f_GetPy(" + formidNew + "),20)  like  '" + value + "%' and";
                                }
                                break;
                            default:
                                SearchWhere += " " + formidNew + " " + relation + "'" + value + "' and";
                                break;

                        }

                    }
                }

            }
            return SearchWhere;
        }

        #endregion

        #region Get add form 
        public Hashtable GetAddFormRequst()
        {

            string[] ConstantFileds = new string[] { "CreateDate@@" + SysConstant["DateTime"], "CreateId@@" + SysConstant["UserId"], "UpdateId@@" + SysConstant["UserId"], "UpdateDate@@" + SysConstant["DateTime"] };
            string TableName = Request.QueryString["TableName"].ToString().Trim();
            string EncryptFields = "SysUser.PassWord";          
            Hashtable ht = new Hashtable();
            foreach (string field in Request.Form.AllKeys)
            {
                if (Common.StringPlus.GetStringCount(field, "_") > 0)  
                {
                    bool IsConstantFiled = false;
                    string FieldFullName = field.Split('_')[0] + "." + field.Split('_')[1];
                    string FieldValue = Request[field];
                    foreach (string confield in ConstantFileds)
                    {
                        if (FieldFullName.Equals(TableName + "." + Common.StringPlus.StrToGroup(confield, "@@")[0]))
                        {
                            if (!ht.ContainsKey(FieldFullName))
                            {
                                ht.Add(FieldFullName, Common.StringPlus.StrToGroup(confield, "@@")[1]);
                                IsConstantFiled = true;
                                break;
                            }
                        }
                    }
                    if (!IsConstantFiled)
                    {
                        if (field.Split('_')[0].Equals(TableName))
                        {

                            if (EncryptFields.IndexOf(FieldFullName) >= 0)
                            {
                                FieldValue = Common.DEncrypt.Encrypt(FieldValue);
                            }
                            if (!ht.ContainsKey(field.Split('_')[0] + "." + field.Split('_')[1]))
                                ht.Add(FieldFullName, FieldValue);
                        }
                    }
                }
            }
            foreach (string confield in ConstantFileds)
            {
                string constanField = TableName + "." + Common.StringPlus.StrToGroup(confield, "@@")[0];
                string constanValue = Common.StringPlus.StrToGroup(confield, "@@")[1];
                if (!ht.ContainsKey(constanField))
                    ht.Add(constanField, constanValue);
            }
            return ht;
        }
        #endregion

        #region Get update form
        /// <summary>
        ///   Get update form
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public Hashtable GetEditFormRequst()
        {
            Hashtable ht = new Hashtable();
            string[] ConstantFileds = new string[] { "UpdateId@@" + SysConstant["UserId"], "UpdateDate@@" + SysConstant["DateTime"] };
            string[] ConstantFiledsNotUpdate = new string[] { "CreateId@@" + SysConstant["UserId"], "CreateDate@@" + SysConstant["DateTime"] };
            string TableName = Request.QueryString["TableName"].ToString().Trim();
            string Id = Request.QueryString["Id"].ToString().Trim();
            string EncryptFields = "SysUser.PassWord";
            foreach (string field in Request.Form.AllKeys)
            {
                if (Common.StringPlus.GetStringCount(field, "_") > 0)  
                {
                    bool IsConstantFiled = false;
                    string FieldFullName = field.Split('_')[0] + "." + field.Split('_')[1];
                    string FieldValue = Request[field];
                    foreach (string confield in ConstantFileds)
                    {
                        if (FieldFullName.Equals(TableName + "." + Common.StringPlus.StrToGroup(confield, "@@")[0]))
                        {
                            if (!ht.ContainsKey(FieldFullName))
                            {
                                ht.Add(FieldFullName, Common.StringPlus.StrToGroup(confield, "@@")[1]);
                                IsConstantFiled = true;
                            }
                            break;
                        }
                    }
                    foreach (string confieldnot in ConstantFiledsNotUpdate)
                    {
                        if (FieldFullName.Equals(TableName + "." + Common.StringPlus.StrToGroup(confieldnot, "@@")[0]))
                        {
                            if (!ht.ContainsKey(FieldFullName))
                            {
                                IsConstantFiled = true;
                            }
                            break;
                        }
                    }
                    if (!IsConstantFiled)
                    {
                        if (field.Split('_')[0].Equals(TableName))
                        {

                            if (EncryptFields.IndexOf(FieldFullName) >= 0)
                            {
                                FieldValue = Common.DEncrypt.Encrypt(FieldValue);
                            }
                            if (!ht.ContainsKey(field.Split('_')[0] + "." + field.Split('_')[1]))
                            {
                                if (!(TableName.Equals("MeterSchedule") && field.Split('_')[1].Equals("StartDate") && string.IsNullOrEmpty(FieldValue)))
                                {
                                    if (TableName.Equals("MeterSchedule") && field.Split('_')[1].Equals("Metertype"))
                                    {
                                        if (!IsHanZi(FieldValue))
                                        {
                                            if (!string.IsNullOrEmpty(FieldValue))
                                            {
                                                string adreename = string.Empty;
                                                string addname = string.Empty;
                                                string unitBuilding = string.Empty;
                                                string unit = string.Empty;
                                                if (FieldValue.IndexOf('_') > 0)
                                                {
                                                    unit = FieldValue.Split('_')[1];
                                                    int unitnum = unit.Length;
                                                    addname = FieldValue.Substring(0, FieldValue.Length - 8 - 1 - unitnum);
                                                    unitBuilding = FieldValue.Substring(0, FieldValue.Length - 1 - unitnum);
                                                }
                                                else
                                                {
                                                    addname = FieldValue.Substring(0, FieldValue.Length - 8);
                                                }


                                                switch (addname)
                                                {
                                                    case "Area":
                                                        {
                                                            string sqlArea = "select * from Area where ID='" + FieldValue + "'";
                                                            DataSet ds = db.QueryList(sqlArea.ToString());
                                                            adreename = ds.Tables[0].Rows[0]["Name"].ToString();
                                                            break;
                                                        }
                                                    case "Community":
                                                        {
                                                            string sqlArea = "select * from Community where ID='" + FieldValue + "'";
                                                            DataSet ds = db.QueryList(sqlArea.ToString());
                                                            adreename = ds.Tables[0].Rows[0]["Name"].ToString();
                                                            break;
                                                        }
                                                    case "Building":
                                                        {
                                                            string sqlArea = string.Empty;
                                                            if (string.IsNullOrEmpty(unitBuilding))
                                                            {
                                                                sqlArea = "select * from Building where ID='" + FieldValue + "'";
                                                            }
                                                            else
                                                            {
                                                                sqlArea = "select * from Building where ID='" + unitBuilding + "'";
                                                            }
                                                            DataSet ds = db.QueryList(sqlArea.ToString());
                                                            if (string.IsNullOrEmpty(unitBuilding))
                                                            {
                                                                adreename = ds.Tables[0].Rows[0]["BuildingName"].ToString();
                                                            }
                                                            else
                                                            {
                                                                adreename = ds.Tables[0].Rows[0]["BuildingName"].ToString() + ">" + unit + "单元";
                                                            }
                                                            break;
                                                        }
                                                    default:
                                                        {
                                                            break;
                                                        }
                                                }
                                                ht.Add(FieldFullName, adreename);
                                                ht.Add(field.Split('_')[0] + ".TargetNumber", FieldValue);
                                            }
                                            else
                                            {
                                                ht.Add(FieldFullName, string.Empty);
                                                ht.Add(field.Split('_')[0] + ".TargetNumber", string.Empty);
                                            }

                                        }
                                        else
                                        {
                                            ht.Add(FieldFullName, FieldValue);
                                        }
                                    }
                                    else
                                    {
                                        ht.Add(FieldFullName, FieldValue);
                                    }
                                }
                            }
                        }
                    }
                }

            }
            foreach (string confield in ConstantFileds)
            {
                string constanField = TableName + "." + Common.StringPlus.StrToGroup(confield, "@@")[0];
                string constanValue = Common.StringPlus.StrToGroup(confield, "@@")[1];
                if (!ht.ContainsKey(constanField))
                    ht.Add(constanField, constanValue);
            }
            return ht;
        }
        #endregion         

        #region Get form request 
        /// <summary>
        /// Get form request 
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public Hashtable GetFormRequst()
        {
            Hashtable ht = new Hashtable();
            string[] ConstantFileds = new string[] { "UpdateId@@" + SysConstant["UserId"], "UpdateDate@@" + SysConstant["DateTime"] };
            string[] ConstantFiledsNotUpdate = new string[] { "CreateId@@" + SysConstant["UserId"], "CreateDate@@" + SysConstant["DateTime"] };
            string TableName = Request.QueryString["TableName"].ToString().Trim();
            string Id = Request.QueryString["Id"].ToString().Trim();
            string EncryptFields = "SysUser.PassWord";

            foreach (string field in Request.Form.AllKeys)
            {
                if (Common.StringPlus.GetStringCount(field, "_") > 0)  
                {
                    bool IsConstantFiled = false;

                    string FieldFullName = field.Split('_')[0] + "." + field.Split('_')[1];
                    string FieldValue = Request[field];

                    foreach (string confield in ConstantFileds)
                    {
                        if (FieldFullName.Equals(TableName + "." + Common.StringPlus.StrToGroup(confield, "@@")[0]))
                        {
                            if (!ht.ContainsKey(FieldFullName))
                            {
                                ht.Add(FieldFullName, Common.StringPlus.StrToGroup(confield, "@@")[1]);
                                IsConstantFiled = true;
                            }
                            break;
                        }
                    }
                    foreach (string confieldnot in ConstantFiledsNotUpdate)
                    {
                        if (FieldFullName.Equals(TableName + "." + Common.StringPlus.StrToGroup(confieldnot, "@@")[0]))
                        {
                            if (!ht.ContainsKey(FieldFullName))
                            {
                                IsConstantFiled = true;
                            }
                            break;
                        }
                    }
                    if (!IsConstantFiled)
                    {
                        if (field.Split('_')[0].Equals(TableName))
                        {
                            if (EncryptFields.IndexOf(FieldFullName) >= 0)
                                FieldValue = Common.DEncrypt.Encrypt(FieldValue);
                            if (!ht.ContainsKey(field.Split('_')[0] + "." + field.Split('_')[1]))
                            {
                                if (!IsHanZi(FieldValue))
                                {
                                    if (!string.IsNullOrEmpty(FieldValue))
                                    {
                                        string adreename = string.Empty;
                                        string addname = string.Empty;

                                        ht.Add(FieldFullName, adreename);
                                        ht.Add(field.Split('_')[0] + ".TargetNumber", FieldValue);
                                    }
                                    else
                                    {
                                        ht.Add(FieldFullName, string.Empty);
                                        ht.Add(field.Split('_')[0] + ".TargetNumber", string.Empty);
                                    }
                                }
                                else
                                    ht.Add(FieldFullName, FieldValue);
                            }
                            else
                                ht.Add(FieldFullName, FieldValue);
                        }
                    }
                }
            }
            return ht;
        }
        #endregion

        #region Chinese
        private bool IsHanZi(string str)
        {
            bool isHanzi = false;
            for (int i = 0; i < str.Length; i++)
            {
                if ((int)str[i] > 127)
                    return true;
                else
                    isHanzi = false;
            }
            return isHanzi;
        }
        #endregion

        #endregion

        #endregion

        #region Menu

        /// <summary>
        /// Load menu
        /// </summary>
        /// <returns></returns>     
        public string MenusLoad()
        {
            return new HiWind.EasyUI.Menu(UserID).GetMenusTree();
        }

        /// <summary>
        /// Search menu
        /// </summary>
        /// <returns></returns>

        public string GetMenusSearch()
        {
            return new HiWind.EasyUI.Menu(UserID).GetMenusList();
        }


        #region Add menu
        /// <summary>
        /// Add menu save
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string MenuAddSave()
        {
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            Hashtable formData = GetAddFormRequst();
            return new HiWind.EasyUI.Menu(UserID).MenuAddSave(tableName, formData);
        }
        #endregion

        #region Update menu save  
        /// <summary>
        /// Update menu  save  
        /// </summary>
        /// <returns></returns>

        [ValidateInput(false)]
        public string MenuEditSave()
        {
            string tableName = Request.QueryString["TableName"].ToString().Trim();
            string id = Request.QueryString["Id"].ToString().Trim();
            Hashtable formData = GetEditFormRequst();
            return new HiWind.EasyUI.Menu(UserID).EditSave(tableName, id, formData);
        }
        #endregion

        #region Delete menu
        /// <summary>
        /// Delete menu
        /// </summary>
        /// <param name="TableName"></param>
        /// <param name="Id"></param>
        /// <param name="Keys"></param>
        /// <returns></returns>
        public string MenuDelteData()
        {
            return new HiWind.EasyUI.Menu(UserID).DelteData(new List<HiWind.Model.SearchWhere>() {
                new HiWind.Model.SearchWhere()
                {
                    Table = Request.Params["TableName"].ToString().Trim(),
                    Filed = "Id",
                    Logic = "in",
                    Value = Request.Params["Id"].ToString().Trim()
                }
            });

        }
        #endregion
        #endregion

        #region Tree
        /// <summary>
        /// Show top menu 
        /// </summary>
        /// <returns></returns>
        public string GetTopMenuAuthorization()
        {
            return new HiWind.EasyUI.Tree(UserID).GetTopMenuAuthorization().ToString();
        }

        /// <summary>
        /// show child menu
        /// </summary>
        /// <returns></returns>
        public string GetChildrenMenusAuthorization(string parentId)
        {
            return new HiWind.EasyUI.Tree(UserID).GetChildrenMenusAuthorization(parentId).ToString();
        }


        #endregion

        #region Print
        /// <summary>
        /// Get print templagte
        /// </summary>
        /// <param name="templateId"></param>
        /// <returns></returns>
        public string GetPrintTemplate(string templateId)
        {
            return new HiWind.EasyUI.Print(UserID).GetTemplate(templateId);

        }
        /// <summary>
        /// Add print record
        /// </summary>
        /// <param name="templateId"></param>
        /// <param name="dataId"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public string AddPrintRecord(string templateId, string dataId, string data, string printCount, string type)
        {
            return new HiWind.EasyUI.Print(UserID).AddPrintRecord(templateId, dataId, data, printCount,type);
            
        }
        /// <summary>
        /// Get print template for lodop
        /// </summary>
        /// <param name="templateId"></param>
        /// <returns></returns>
        public string LodopPrint(string templateId, string data)
        {
            return new HiWind.EasyUI.Print(UserID).LodopPrint(templateId, data);
        }

        #endregion

        #region DataBackUp
        public string BackUpDataBase()
        {
            return new HiWind.EasyUI.DataBackUp(UserID).BackUpDataBase("Data",Server.MapPath("~/DataBackUp"));
        }
        public string GetFileNamePath()
        {
            return new HiWind.EasyUI.DataBackUp(UserID).GetFileNamePath("Data", Server.MapPath("~/DataBackUp"));
        }
        #endregion

        #endregion
    }
}
