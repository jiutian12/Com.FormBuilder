using FormBuilder.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FormBuilder.Model;
using System.Web.Mvc;

namespace FormBuilder.Web.Areas.Admin.Controllers
{
    public class AuthController : Controller
    {

        IFBAuthService _service;

        public AuthController(IFBAuthService service)
        {
            this._service = service;
        }

        /// <summary>
        /// 保存授权结果
        /// </summary>
        /// <param name="data"></param>
        /// <param name="masterValue"></param>
        /// <param name="acessType"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SaveData(string data, string masterValue, string acessType)
        {
            try
            {

                List<FBAuthPermission> list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<FBAuthPermission>>(data);
                this._service.saveData(list, masterValue, acessType);
                return Json(new { res = true, mes = "授权成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "保存失败," + ex.Message });
            }

        }


    }
}