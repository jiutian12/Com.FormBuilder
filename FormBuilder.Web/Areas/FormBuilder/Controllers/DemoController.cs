using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FormBuilder.Utilities;
using System.Web.Mvc;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class DemoController : Controller
    {
        // GET: Demo
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Dict()
        {
            //var res = AESHelper.DecryptByAES("E94B7uOi9pDeG64wyPwJ/g==", "fb12345fb12345", "fb12345");
            //"E94B7uOi9pDeG64wyPwJ/g==";
            //fb12345
            return View();
        }

        [HttpGet]
        public string Get(string data,string key)
        {
            var res = AESHelper.Decrypt(data, key+ key, key);
            //"E94B7uOi9pDeG64wyPwJ/g==";
            //fb12345
            return res;
        }

        public ActionResult ListView()
        {
            return View();
        }

        
        public ActionResult Timeline()
        {
            return View();
        }


        
        
        public class QueryResult
        {
            public string id { get; set; }

            public string name { get; set; }
        }
        [HttpPost]
        // GET: FBMeta
        public JsonResult Query(string q)
        {
            try
            {
                var list = new List<QueryResult> {
                    new QueryResult { id="1",name="北京"},
                    new QueryResult { id="2",name="上海"},
                    new QueryResult { id="3",name="天津"}
                };
                return Json(list.Where(n => n.name == q));
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
    }
}