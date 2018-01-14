using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Model;
using FormBuilder.Service;
using FormBuilder.Utilities;

namespace FormBuilder.Web.Controllers
{
    public class FormController : Controller
    {
        #region ctr

        IFBFormService _service;

        public FormController(IFBFormService service)
        {
            this._service = service;
        }
        #endregion

        #region views
        // GET: SmartHelp
        public ActionResult Index()
        {
            return View();
        }

        // GET: SmartHelp
        public ActionResult List()
        {
            return View();
        }
        // GET: SmartHelp
        public ActionResult Edit()
        {
            return View();
        }

        public ActionResult ToolBar(string dataid)
        {
            ViewData["FSMID"] = this._service.getModel(dataid).FSMID;
            return View();
        }

        /// <summary>
        /// 表单引入自定义数据源设置
        /// </summary>
        /// <returns></returns>
        public ActionResult DSInfo()
        {
            return View();
        }

        public ActionResult FormCode(string dataid)
        {
            Model.FBForm model = this._service.getModel(dataid);
            return View(model);
        }




        #endregion


        #region Ajax Request


        [HttpPost]
        // GET: FBMeta
        public JsonResult GetModel(string dataid)
        {
            try
            {
                if (string.IsNullOrEmpty(dataid))
                {
                    return Json(new { res = true, data = new FBForm() });
                }
                var model = this._service.getModel(dataid);
                model.LayoutConfig = BASE64.DeCode(model.LayoutConfig);

                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        // GET: FBMeta
        public JsonResult getFormDS(string frmID, string modelID)
        {
            try
            {
                var model = this._service.getFormDS(frmID, modelID);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        public JsonResult getPageList(string pagesize, string page, string keyword, string type)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.getPageList(type, keyword, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }


        [HttpPost]
        public JsonResult GetDependence(string pagesize, string page, string keyword, string type, string id)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.getDepenceList(type, keyword, id, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }



        [HttpPost]
        public JsonResult deleteData(string helpID)
        {
            try
            {
                this._service.deleteData(helpID);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }



        [HttpPost]
        public JsonResult saveData(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBForm>(model);
                JFBFormPage pageconfig = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBFormPage>(data.Config);
                data.Theme = pageconfig.theme;
                data.Type = pageconfig.formtype;
                data.CodeEngine = pageconfig.engine;
                data.BaseController = "";
                data.LayoutConfig = BASE64.EnCode(data.LayoutConfig);
                data.FSMID = pageconfig.fsmid;
                if (string.IsNullOrEmpty(data.ID))
                {

                    data.ID = Guid.NewGuid().ToString();
                    data.LastModifyTime = data.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = data.CreateUser = SessionProvider.Provider.Current().UserName;
                }
                else
                {
                    data.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = SessionProvider.Provider.Current().UserName;
                }
                this._service.saveData(data);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }


        /// <summary>
        /// 发布表单
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult publicPage(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBForm>(model);
                JFBFormPage pageconfig = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBFormPage>(data.Config);
                data.Theme = pageconfig.theme;
                data.Type = pageconfig.formtype;
                data.CodeEngine = pageconfig.engine;
                data.BaseController = "";
                if (string.IsNullOrEmpty(data.ID))
                {

                    data.ID = Guid.NewGuid().ToString();
                    data.LastModifyTime = data.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = data.CreateUser = SessionProvider.Provider.Current().UserName;
                }
                else
                {
                    data.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = SessionProvider.Provider.Current().UserName;
                }
                this._service.publicPage(data);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }



        /// <summary>
        /// 发布用户自定义脚本和CSS
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult publicUser(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBForm>(model);
                data.LayoutConfig = BASE64.EnCode(data.LayoutConfig);
                this._service.pubUserResource(data, null);
                return Json(new { res = true, mes = "用户自定义代码发布成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }




        /// <summary>
        /// 保存表单默认值方法 
        /// </summary>
        /// <param name="data"></param>
        /// <param name="formID"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult saveDefaultValue(string data, string formID)
        {
            try
            {

                this._service.saveDefaultValue(data, formID);
                return Json(new { res = true, mes = "保存成功!" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "保存失败" + ex.Message });
                //throw ex;
            }
        }
        [HttpPost]
        public JsonResult addData(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBForm>(model);
                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                    data.LastModifyTime = data.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = data.CreateUser = SessionProvider.Provider.Current().UserName;
                }
                this._service.addData(data);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }




        #endregion



        #region Ajax ToolBar 

        [HttpPost]
        // GET: FBMeta
        public JsonResult getToolBarTree(string dataID)
        {
            try
            {
                var model = this._service.getToolBarTree(dataID);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        [HttpPost]
        // GET: FBMeta
        public JsonResult getToolBarRoot(string dataID)
        {
            try
            {
                var model = this._service.getToolBarRoot(dataID);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }



        [HttpPost]
        // GET: FBMeta
        public JsonResult addToolBar(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBFormToolBar>(model);
                data.ID = Guid.NewGuid().ToString();
                if (data.FormID == "")
                {
                    throw new Exception("未获取到表单ID！");
                }
                this._service.addToolBar(data);
                return Json(new { res = true, mes = "添加成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        // GET: FBMeta
        public JsonResult removeToolBar(string id)
        {
            try
            {
                this._service.removeToolBar(id);
                return Json(new { res = true, mes = "删除成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        [HttpPost]
        public JsonResult saveToolBar(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBFormToolBar>(model);

                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                }
                this._service.saveToolBar(data);
                return Json(new { res = true, mes = "修改成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        public JsonResult getToolBar(string id)
        {
            try
            {
                var model = this._service.getToolBar(id);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion



        #region AjaxDsInfo
        [HttpPost]
        public JsonResult getDSImport(string frmID, string order, string pagesize, string page, string keyword)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.getDSImport(frmID, keyword, order, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }


        [HttpPost]
        public JsonResult getDSNotImport(string frmID, string order, string pagesize, string page, string keyword)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.getDSNotImport(frmID, keyword, order, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }


        [HttpPost]
        public JsonResult saveDsInfo(string frmID, string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<List<FBFormDS>>(model);
                this._service.saveDsInfo(frmID, data);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult deleteDSInfo(string frmID, string ids)
        {
            try
            {
                this._service.deleteDSInfo(frmID, ids);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
            }
        }
        #endregion
    }
}