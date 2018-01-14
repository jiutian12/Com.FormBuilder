using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Model;
using FormBuilder.Service;
using FormBuilder.Utilities;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class SmartHelpController : Controller
    {
        #region ctr

        IFBSmartHelpService _service;
        IFBDataModelService _serviceDM;

        public SmartHelpController(IFBSmartHelpService service, IFBDataModelService serviceDM)
        {
            this._service = service;
            this._serviceDM = serviceDM;
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
                    return Json(new { res = true, data = new FBSmartHelp() });
                }
                var model = this._service.getModel(dataid);
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
        public JsonResult getRuntimeModel(string dataid)
        {
            try
            {
                if (string.IsNullOrEmpty(dataid))
                {
                    return Json(new { res = true, data = new FBSmartHelp() });
                }
                var model = this._service.getRuntimeModel(dataid);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        
        [HttpPost]
        public JsonResult getPageList(string pagesize, string page, string keyword, string order)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.getPageList(order, keyword, "", int.Parse(page), int.Parse(pagesize), out totalpage, out total);
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
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBSmartHelp>(model);
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

        [HttpPost]
        public JsonResult addData(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBSmartHelp>(model);
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




        #region 获取数据模型的字段信息
        [HttpPost]
        public JsonResult getSmartHelpCols(string helpID)
        {
            try
            {
                string modelID = this._service.getModel(helpID).ModelID;
                if (string.IsNullOrEmpty(modelID))
                    return Json(new { res = false, mes = "此帮助未定义数据模型信息" });
                var data = this._serviceDM.GetObjectColList(modelID, "", true);
                return Json(new { res = true, data = data, mes = "ok" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #endregion




    }
}