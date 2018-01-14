using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Service;
using Newtonsoft.Json;
using FormBuilder.Model;


namespace FormBuilder.Web.Controllers
{
    public class FBMetaController : Controller
    {

        IFBDataObjectService _service;
        public FBMetaController(IFBDataObjectService service)
        {
            this._service = service;
        }


        public ActionResult Index()
        {

            //throw new Exception("shit");
            //IKernel ninjectKernel = new StandardKernel();
            //ninjectKernel.Load("Config/NInject/*.xml");
            //FBDataObjectService s = ninjectKernel.Get<FBDataObjectService>();
            return View("List");
        }
        [HttpPost]
        // GET: FBMeta
        public JsonResult GetFBMetaData(string pagesize, string index, string condition)
        {
            try
            {
                long total = 0;
                long totalpage = 0;
                var list = this._service.getMetaDataList("", "", int.Parse(index), int.Parse(pagesize), out totalpage, out total);
                return Json(new { res = true, totalpage = totalpage, totalitems = total, data = list });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                throw ex;
                //return Json(new { res = true, mes = "操作失败" + ex.Message });
            }
        }
        [HttpPost]
        // GET: FBMeta
        public JsonResult SaveObjectInfo(string info)
        {
            try
            {
                JsonSerializerSettings jsetting = new JsonSerializerSettings(); jsetting.NullValueHandling = NullValueHandling.Ignore;
                FBDataObject model = JsonConvert.DeserializeObject<FBDataObject>(info, jsetting);
                this._service.AddData(model);
                return Json(new { res = true, mes = "保存成功" });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = true, mes = "保存失败" + ex.Message });
                //throw ex;
                //return Json(new { res = true, mes = "操作失败" + ex.Message });
            }
        }

    }
}