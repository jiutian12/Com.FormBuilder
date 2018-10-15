using FormBuilder.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FormBuilder.Utilities;
using System.Web.Mvc;

namespace FormBuilder.Web.Areas.Admin.Controllers
{
    public class AccountController : Controller
    {


        IFBAccountService _service;

        public AccountController(IFBAccountService service)
        {
            this._service = service;
        }
        // GET: Admin/Account
        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// 修改用户密码
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="password"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult ChangePwd(string uid, string password, string salt)
        {
            try
            {

                //修改用户密码
                //检查用户权限
                //var pwd = AESHelper.Decrypt(password, salt + salt, salt);
                var mes = "修改成功";
                var flag = this._service.ChangePassWord(uid, password, out mes);

                return Json(new { res = flag, mes = mes });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "修改失败：" + ex.Message });
            }

        }

        /// <summary>
        /// 注销在线用户
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult OfflineUser(string uid)
        {
            try
            {

                //修改用户密码
                //检查用户权限
                return Json(new { res = true, mes = "修改成功！ " });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "修改失败：" + ex.Message });
            }

        }


        /// <summary>
        /// 锁定用户
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult LockUser(string uid)
        {
            try
            {

                //修改用户密码
                //检查用户权限
                return Json(new { res = true, mes = "修改成功！ " });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "修改失败：" + ex.Message });
            }

        }

        /// <summary>
        /// 解锁用户
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UnLockUser(string uid)
        {
            try
            {

                //修改用户密码
                //检查用户权限
                return Json(new { res = true, mes = "修改成功！ " });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "修改失败：" + ex.Message });
            }

        }

    }
}