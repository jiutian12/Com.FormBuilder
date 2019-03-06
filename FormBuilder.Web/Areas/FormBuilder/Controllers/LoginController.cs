using FormBuilder.Service;
using FormBuilder.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class LoginController : Controller
    {

        IFBAccountService _service;
        // GET: FormBuilder/Login

        public LoginController(IFBAccountService service)
        {
            this._service = service;
        }
        public ActionResult Index(string callbackurl)
        {
            
            ViewData["callbackurl"] = callbackurl;
            return View();
        }
        public ActionResult LogOut()
        {
            this._service.LogOut();
            return new RedirectResult(ConfigHelper.getAppSettings("loginurl"));
        }



        [HttpPost]
        // GET: FBMeta
        public JsonResult AccLogin(string acc, string pwd, string code)
        {
            try
            {
                var mes = "";
                var flag = this._service.Login(acc, pwd, out mes);
                if (flag)
                    return Json(new { res = true, mes = "登录成功！" });
                else
                    return Json(new { res = false, mes = mes });
                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "登录异常" + ex.Message });
            }
        }
    }
}