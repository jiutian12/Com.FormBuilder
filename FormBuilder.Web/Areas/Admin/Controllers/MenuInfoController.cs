using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormBuilder.Web.Areas.Admin.Controllers
{
    public class MenuInfoController : Controller
    {
        // GET: Admin/Menu
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Dict()
        {
            return View();
        }

        
    }
}