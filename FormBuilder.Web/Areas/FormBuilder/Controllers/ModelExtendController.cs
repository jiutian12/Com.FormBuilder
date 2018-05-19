using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Model;
using FormBuilder.Service;
using FormBuilder.Utilities;
using Newtonsoft.Json;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class ModelExtendController : Controller
    {


        #region ctr

        IFBModelExtendService _service;
        public static LogHelper log = LogFactory.GetLogger(typeof(ModelExtendController));
        public ModelExtendController(IFBModelExtendService service)
        {

            //log.Error("ddd");
            this._service = service;

        }
        #endregion


        #region View
        // GET: FormBuilder/DataModelSQL
        public ActionResult Index()
        {
            return View();
        }
        #endregion

        #region View
        // GET: FormBuilder/DataModelSQL

        #endregion
        #region Ajax Request

        [HttpPost]
        public JsonResult getList(string modelID)
        {
            try
            {
                var list = this._service.getList(modelID);

                return Json(new { res = true, data = list });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult deleteData(string id)
        {
            try
            {

                this._service.deleteData(id);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }


        [HttpPost]
        public JsonResult getModel(string id)
        {
            try
            {

                return Json(new { res = true, data = this._service.getModel(id) });
            }
            catch (Exception ex)
            {

                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        public JsonResult saveData(string data, string modelID)
        {
            try
            {
                List<FBModelExtend> list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<FBModelExtend>>(data);

                this._service.saveData(list, modelID);
                return Json(new { res = true, mes = "保存成功！" });
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