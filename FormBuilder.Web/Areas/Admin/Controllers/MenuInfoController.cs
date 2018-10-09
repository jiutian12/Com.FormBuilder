using FormBuilder.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormBuilder.Web.Areas.Admin.Controllers
{
    public class MenuInfoController : Controller
    {

        IFBMenuService _service;

        public MenuInfoController(IFBMenuService service)
        {
            this._service = service;
        }

        /// <summary>
        /// 获取系统用户授权菜单
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetMenuList()
        {
            try
            {
                return Json(new { res = true, data = this._service.getMenuList("", "", "", "") });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "获取用户菜单失败！" + ex.Message });
            }

        }



        [HttpPost]
        public JsonResult GetUserFavorMenu()
        {
            try
            {
                return Json(new { res = true, data = this._service.getMenuList("", "", "", "") });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "获取用户菜单失败！" + ex.Message });
            }

        }


        [HttpPost]
        public JsonResult AddFavorMenu()
        {
            try
            {
                return Json(new { res = true, data = this._service.getMenuList("", "", "", "") });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "获取用户菜单失败！" + ex.Message });
            }

        }

        [HttpPost]
        public JsonResult RemoveFavorMenu()
        {
            try
            {
                return Json(new { res = true, data = this._service.getMenuList("", "", "", "") });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "获取用户菜单失败！" + ex.Message });
            }

        }

    }
}