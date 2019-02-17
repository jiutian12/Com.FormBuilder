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
    public class VisioController : Controller
    {
        #region ctr

        IFBVisioGraphService _service;

        public VisioController(IFBVisioGraphService service)
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
                var model = this._service.GetModel(dataid);
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
                var list = this._service.GetPageList(order, keyword,  int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult deleteData(string graphID)
        {
            try
            {
                this._service.DeleteModel(graphID);
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
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBVisioGraph>(model);
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
                this._service.SaveModel(data);
                return Json(new { res = true, mes = "保存成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        #endregion




    }
}