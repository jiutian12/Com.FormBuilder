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
    public class DataModelSQLController : Controller
    {


        #region ctr

        IFBModelSQLService _service;
        public static LogHelper log = LogFactory.GetLogger(typeof(DataModelController));
        public DataModelSQLController(IFBModelSQLService service)
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


        #region Ajax Request

        [HttpPost]
        public JsonResult getList(string modelID, string keyword)
        {
            try
            {
                var list = this._service.getList(modelID, keyword);

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
        public JsonResult saveData(string data, string ModelID)
        {
            try
            {
                FBModelSQL model = Newtonsoft.Json.JsonConvert.DeserializeObject<FBModelSQL>(data);
                if (string.IsNullOrEmpty(model.ID))
                {
                    model.ID = Guid.NewGuid().ToString();
                }
                this._service.saveData(model);
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