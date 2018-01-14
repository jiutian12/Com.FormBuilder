using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using FormBuilder.Model;
using FormBuilder.Service;
using FormBuilder.Utilities;
using Newtonsoft.Json;


namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class DataObjectController : Controller
    {

        #region ctr
        IFBDataObjectService _service;

        public DataObjectController(IFBDataObjectService service)
        {
            this._service = service;
        }
        #endregion

        #region Views
        // GET: DataObject
        public ActionResult Index()
        {
            return View("List");
        }
        public ActionResult List()
        {
            return View("List");
        }
        public ActionResult Design()
        {
            return View();
        }
        public ActionResult Edit()
        {
            ViewData["schema"] = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getDBSChema());
            return View();
        }
        #endregion

        #region Ajax Request
        [HttpPost]
        public JsonResult GetModel(string dataid)
        {
            FBDataObject model = this._service.GetModel(dataid);
            if (string.IsNullOrEmpty(model.ID))
            {
                model.ID = dataid;
                model.CreateTime = DateTime.Now.ToString();
                model.CreateUser = SessionProvider.Provider.Current().UserName;
                model.LastModifyTime = model.CreateTime;
                model.LastModifyUser = model.CreateUser;
            }
            return Json(new { res = true, data = model });
        }
        [HttpPost]
        // GET: FBMeta
        public JsonResult SaveModel(string data)
        {
            try
            {
                JsonSerializerSettings jsetting = new JsonSerializerSettings(); jsetting.NullValueHandling = NullValueHandling.Ignore;
                FBDataObject model = JsonConvert.DeserializeObject<FBDataObject>(data, jsetting);

                model.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                model.LastModifyUser = SessionProvider.Provider.Current().UserName;
                this._service.AddData(model);
                return Json(new { res = true, mes = "保存成功" });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "保存失败" + ex.Message });
                //throw ex;
                //return Json(new { res = true, mes = "操作失败" + ex.Message });
            }
        }

        /// <summary>
        /// 获取数据对象列表
        /// </summary>
        /// <param name="objectid"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetObjectList(string filter)
        {
            try
            {
                return Json(new { res = true, mes = "成功", data = this._service.GetObjectList("") });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "失败" + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult GetColumnList(string objectid)
        {
            try
            {

                return Json(new { res = true, mes = "成功", data = this._service.GetColumn(objectid) });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "失败" + ex.Message });
            }
        }


        /// <summary>
        /// 获取多个objectid的列信息 按照列排序
        /// </summary>
        /// <param name="objectids"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetMultiColumnList(string objectids)
        {
            try
            {
                List<List<FBDataObjectCols>> list = new List<List<FBDataObjectCols>>();
                foreach (string key in objectids.Split(','))
                {
                    list.Add(this._service.GetColumn(key));
                }
                return Json(new { res = true, mes = "成功", data = list });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "失败" + ex.Message });
            }
        }





        #region 获取数据对象列表接口
        /// <summary>
        /// 获取数据对象列表接口
        /// </summary>
        /// <param name="pagesize"></param>
        /// <param name="page"></param>
        /// <param name="keword"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetDataObjectList(string pagesize, string page, string keyword, string order)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.GetDataObjectList(keyword, order, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }
        #endregion



        #region 删除数据模型
        public JsonResult DeleteObject(string ID)
        {
            try
            {

                this._service.DeleteObject(ID);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion


        #region 添加数据模型
        public JsonResult AddObject(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBDataObject>(model);
                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                    data.LastModifyTime = data.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = data.CreateUser = SessionProvider.Provider.Current().UserName;

                }
                else
                {
                    data.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = SessionProvider.Provider.Current().UserName;
                }
                this._service.AddObject(data);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "取数失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion


        #region 验证字段是否被引用




        /// <summary>
        /// 验证字段是否被引用
        /// </summary>
        /// <param name="objectID"></param>
        /// <param name="colname"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult CheckCol(string objectID, string colname)
        {
            try
            {

                string mes = "";
                var flag = this._service.checkDeleteCol(objectID, colname, out mes);
                return Json(new { res = flag, mes = mes });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "验证失败" + ex.Message });
            }
        }

        #endregion
        #endregion




        #region getDBTables 获取数据库中所有的表 某一个用户下
        /// <summary>
        /// 获取数据对象列表接口
        /// </summary>
        /// <param name="pagesize"></param>
        /// <param name="page"></param>
        /// <param name="keword"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult getDBTables(string pagesize, string page, string schema, string keyword, string order)
        {
            try
            {
                var list = this._service.getDBTables(schema, keyword, int.Parse(page), int.Parse(pagesize));
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }
        #endregion



        #region getDBSChema 获取所有的数据库用户下
        /// <summary>
        /// 获取数据对象列表接口
        /// </summary>
        /// <param name="pagesize"></param>
        /// <param name="page"></param>
        /// <param name="keword"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult getDBSChema()
        {
            try
            {
                var list = this._service.getDBSChema();
                return Json(new { res = true, data = list });
            }
            catch (Exception ex)
            {

                return Json(new { res = false, mes = "失败" + ex.Message });
            }
        }
        #endregion


        #region getDBSChema 获取所有的数据库用户下
        /// <summary>
        /// 获取数据对象列表接口
        /// </summary>
        /// <param name="pagesize"></param>
        /// <param name="page"></param>
        /// <param name="keword"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult getDBColumnList(string table, string schema)
        {
            try
            {
                var list = this._service.getDBColumnList(table, schema);
                return Json(new { res = true, data = list });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "失败" + ex.Message });
            }
        }
        #endregion





    }
}