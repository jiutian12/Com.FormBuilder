using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Service;
using FormBuilder.Model;

namespace FormBuilder.Web.Controllers
{
    public class SettingsController : Controller
    {



        #region ctr

        IFBDBSettingService _service;

        public SettingsController(IFBDBSettingService service)
        {
            this._service = service;
        }
        #endregion


        #region Views
        /// <summary>
        /// 视图返回数据库设置列表
        /// </summary>
        /// <returns></returns>
        public ActionResult DBConnection()
        {
            return View();
        }
        #endregion


        #region Ajax Requests
        [HttpPost]
        // GET: FBMeta
        public JsonResult GetDBSettings(string pagesize, string page, string condition)
        {
            try
            {
                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.GetPageList("", "", int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }






        [HttpPost]
        // GET: FBMeta
        public JsonResult GetModel(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return Json(new { res = true, data = new FBDBSetting() });
                }
                var model = this._service.GetModel(id);
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
        public JsonResult SaveModel(string id, string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBDBSetting>(model);
                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                }
                this._service.SaveModel(data);
                return Json(new { res = true, id = data.ID, mes = "修改成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        // GET: FBMeta
        public JsonResult DeleteModel(string id)
        {
            try
            {

                this._service.DeleteModel(id);
                return Json(new { res = true, mes = "删除成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        // GET: FBMeta
        public JsonResult ToogleEnable(string id, bool flag)
        {
            try
            {

                this._service.ToogleEnable(id, flag);
                var title = flag ? "启用成功" : "停用成功";
                return Json(new { res = true, mes = title });
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