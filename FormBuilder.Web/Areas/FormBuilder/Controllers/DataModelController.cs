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
using System.Threading.Tasks;
using System.IO;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class DataModelController : Controller
    {

        #region ctr

        IFBDataModelService _service;
        IFBDataSourceService _serviceCutomDS;
        public static LogHelper log = LogFactory.GetLogger(typeof(DataModelController));
        public DataModelController(IFBDataModelService service, IFBDataSourceService serviceCutomDS)
        {

            //log.Error("ddd");
            this._service = service;
            this._serviceCutomDS = serviceCutomDS;
        }
        #endregion


        #region View Request
        // GET: DataModel
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Design()
        {
            return View();
        }

        public ActionResult Edit()
        {
            return View();
        }

        public ActionResult List()
        {
            return View();
        }
        #endregion


        #region Ajax Request




        #region 获取数据模型基本信息 getModel
        [HttpPost]
        public JsonResult GetModel(string dataid)
        {
            FBDataModel model = this._service.GetModel(dataid);
            return Json(new { res = true, data = model });
        }
        #endregion

        #region 获取数据模型列表 getModelList
        [HttpPost]
        public JsonResult GetDataModelList(string pagesize, string page, string keyword, string order, string sortname, string sortorder)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.GetDataModelList(keyword, order, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }
        #endregion


        #region 获取数据模型子对象信息 getModelObjectList
        [HttpPost]

        // GET: FBMeta
        public JsonResult GetObjectList(string modelid)
        {
            try
            {
                var model = this._service.GetObjectList(modelid);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "取数失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 获取单个子对象的详细信息 getModelObjectSingle
        [HttpPost]
        // GET: FBMeta
        public JsonResult GetObjectModel(string modelid, string objectid, bool hasdetail)
        {
            try
            {
                var model = this._service.GetObjectModel(modelid, objectid, hasdetail);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "取数失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 获取数据模型列的关联信息 getModelRealtionList
        [HttpPost]
        // GET: FBMeta
        public JsonResult GetRelationInfo(string modelid, string modelobjectid, string modelobjectidcolid)
        {
            try
            {
                var model = this._service.GetRelationInfo(modelid, modelobjectid, modelobjectidcolid);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "取数失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 获取数据对象列信息 getObjectColList
        /// <summary>
        /// 获取数据对象列信息接口
        /// </summary>
        /// <param name="pagesize"></param>
        /// <param name="page"></param>
        /// <param name="objectid"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetObjectColumns(string pagesize, string page, string objectid)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.GetObjectColumns(objectid, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }
        #endregion

        #region  获取模型主表列信息  getMainColumns
        [HttpPost]
        public JsonResult GetMainColumns(string pagesize, string page, string modelid)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.GetMainColumns(modelid, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }
        #endregion

        #region 获取数据对象列表 getDataObjectList
        /// <summary>
        /// 获取数据对象列表接口
        /// </summary>
        /// <param name="pagesize"></param>
        /// <param name="page"></param>
        /// <param name="keword"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetObjects(string pagesize, string page, string keyword)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.GetObjects(keyword, int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }
        #endregion

        #region 获取数据模型的字段信息 getDataModelObjectColList
        [HttpPost]
        public JsonResult GetObjectColList(string modelID, string objectID)
        {
            try
            {
                var data = this._service.GetObjectColList(modelID, objectID, true);
                return Json(new { res = true, data = data, mes = "ok" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion


        #region 删除数据模型 
        public JsonResult DeleteModelInfo(string modelID)
        {
            try
            {

                this._service.DeleteModelInfo(modelID);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 保存模型基本属性


        [HttpPost]
        public JsonResult SaveAttr(string model)
        {
            try
            {
                //JsonSerializerSettings jsetting = new JsonSerializerSettings();
                //jsetting.NullValueHandling = NullValueHandling.Ignore;
                FBDataModel data = JsonConvert.DeserializeObject<FBDataModel>(model);

                data.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                data.LastModifyUser = SessionProvider.Provider.Current().UserName;
                this._service.SaveAttr(data);
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
        #endregion

        #region 添加数据模型
        public JsonResult AddModel(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBDataModel>(model);
                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                    data.LastModifyTime = data.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = data.CreateUser = SessionProvider.Provider.Current().UserName;

                }
                this._service.AddModel(data);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "取数失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 保存关联信息
        [HttpPost]
        // GET: FBMeta
        public JsonResult SaveRelation(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBDataModelRealtions>(model);
                this._service.SaveRelation(data);
                return Json(new { res = true, mes = "保存成功" });
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
        public JsonResult CheckCol(string ModelID, string objectID, string colname)
        {
            try
            {

                string mes = "";
                var flag = this._service.checkDeleteCol(ModelID, objectID, colname, out mes);
                return Json(new { res = flag, mes = mes });

                //return Content("213213");
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "验证失败" + ex.Message });
            }
        }

        #endregion

        #region 删除关联信息      
        [HttpPost]
        public JsonResult deleteRelation(string modelID, string relationID)
        {
            try
            {

                this._service.deleteRelation(modelID, relationID);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 保存数据模型子对象
        [HttpPost]
        public JsonResult SaveObject(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBDataModelObjects>(model);
                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                }
                this._service.SaveObject(data);
                return Json(new { res = true, id = data.ID, mes = "修改成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 添加子对象
        [HttpPost]
        public JsonResult AddObject(string modelID, string objectID)
        {
            try
            {

                this._service.AddObject(modelID, objectID);
                return Json(new { res = true, mes = "修改成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 删除子对象
        public JsonResult DeleteObject(string modelID, string objectID, string modelObjectID)
        {
            try
            {

                this._service.DeleteObject(modelID, objectID, modelObjectID);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #endregion


        #region Runtime Request 表单运行时所需数据模型接口Api的封装

        #region  获取数据模型上的单一数据(也就是卡片数据的结构化数据)

        [HttpPost]
        public string getModelDataByDataID(string modelID, string dataID, bool detail)
        {
            try
            {
                var data = this._service.getModelDataByDataID(modelID, dataID, detail);
                DataTable dt = new DataTable();
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = true, data = data });
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = false, mes = "失败" + ex.Message });
            }
        }
        #endregion

        #region 获取数据模型主表的分页接口【分页】
        [HttpPost]
        // GET: FBMeta
        public string getModelPageList(string modelID, string pagesize, string page, string filter, string order, string sortname, string sortorder)
        {
            try
            {
                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                if (string.IsNullOrEmpty(order))
                {
                    // 采用列表的排序规则
                    if (!string.IsNullOrEmpty(sortname) && !string.IsNullOrEmpty(sortorder))
                    {
                        order = "[{\"Field\":\"" + sortname + "\",\"Order\":\"" + sortorder + "\"}]";
                    }
                }
                var list = this._service.getModelPageList(modelID, int.Parse(page), int.Parse(pagesize), filter, order, out totalpage, out total);
                return Newtonsoft.Json.JsonConvert.SerializeObject(list);
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { error = true, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion






        #region 获取数据模型主表数据接口【不分页】
        [HttpPost]
        public string getModelData(string modelID, string filter, string order)
        {
            try
            {
                var data = this._service.getModelData(modelID, filter, order);
                DataTable dt = new DataTable();
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = true, data = data });
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = false, mes = "失败" + ex.Message });
            }
        }
        #endregion

        #region 树形列表异步加载的接口【不分页】
        /// <summary>
        /// 树形列表异步加载的接口 1.第一次取数 2.加载下级 3.查询结果
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="level">查询级数</param>
        /// <param name="path">上级分级码</param>
        /// <param name="parentID">父节点值</param>
        /// <param name="keyWord">关键字 有则对整棵树过滤</param>
        /// <param name="filter">过滤条件</param>
        /// <param name="order">排序条件</param>
        /// <returns></returns>
        [HttpPost]
        public string getModelTreeData(string modelID, string level, string path, string parentID, string keyWord, string filter, string order, bool isCustom)
        {
            try
            {
                List<Dictionary<string, object>> data;
                if (isCustom)
                {
                    data = this._serviceCutomDS.getModelTreeDataDictList(modelID, level, path, parentID, keyWord, filter, order);
                }
                else
                {
                    data = this._service.getModelTreeDataDictList(modelID, level, path, parentID, keyWord, filter, order);
                }

                DataTable dt = new DataTable();
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = true, data = data });
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = false, mes = "失败" + ex.Message });
            }
        }
        #endregion



        #region 获取数据模型主表数据接口【不分页】
        [HttpPost]
        public string getModelTreeDataALL(string modelID, string keyword, string filter, string order, bool isCustom)
        {
            try
            {
                // var data = this._service.getModelTreeDataALL(modelID, keyword, filter, order);

                List<Dictionary<string, object>> data;
                if (isCustom)
                {
                    data = this._serviceCutomDS.getModelTreeDataALL(modelID, keyword, filter, order);
                }
                else
                {
                    data = this._service.getModelTreeDataALL(modelID, keyword, filter, order);
                }

                DataTable dt = new DataTable();
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = true, data = data });
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = false, mes = "失败" + ex.Message });
            }
        }
        #endregion


        [HttpPost]
        public ActionResult getExcelServer(string modelID, string keyword, string filter, string order, bool isCustom, string cols)
        {
            try
            {
                // var data = this._service.getModelTreeDataALL(modelID, keyword, filter, order);
                DataTable dt = Newtonsoft.Json.JsonConvert.DeserializeObject<DataTable>(cols);
                List<Dictionary<string, object>> data;
                if (isCustom)
                {
                    data = this._serviceCutomDS.getModelTreeDataALL(modelID, keyword, filter, order);
                }
                else
                {
                    data = this._service.getModelTreeDataALL(modelID, keyword, filter, order);
                }

                DataToExcel converter = new DataToExcel();
                var bytes = converter.tOExcel(dt, data);


                Response.Charset = "UTF-8";
                Response.ContentType = "application/octet-stream";
                //Response.ContentEncoding = encoding;
                Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode("导出.xls", System.Text.Encoding.UTF8));
                Response.BinaryWrite(bytes);
                Response.Flush();
                Response.End();
                return new EmptyResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult getExcel(string cols, string data)
        {
            DataTable dt = Newtonsoft.Json.JsonConvert.DeserializeObject<DataTable>(cols);
            List<Dictionary<string, object>> list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(data);
            DataToExcel converter = new DataToExcel();
            var bytes = converter.tOExcel(dt, list);
            //return new FileStreamResult(stream, "application/x-xls");


            Response.Charset = "UTF-8";
            Response.ContentType = "application/octet-stream";
            //Response.ContentEncoding = encoding;
            Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode("导出.xls", System.Text.Encoding.UTF8));
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
            return new EmptyResult();
        }


        #region 数据模型通用保存restful 方法 只有主表
        /// <summary>
        /// 数据模型保存方法只保存主表信息
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="model"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult saveModel(string modelID, string model, string status, string treeNode)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<DataSet>(model);
                var parentTree = Newtonsoft.Json.JsonConvert.DeserializeObject<TreeNode>(treeNode);
                this._service.saveModel(modelID, data, status, parentTree);
                return Json(new { res = true, mes = "保存成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion





        #region 数据模型通用保存restful 方法 包括子对象
        /// <summary>
        /// 数据模型通用保存方法保函子对象数据的保存
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="dataID"></param>
        /// <param name="model"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult saveModelALL(string modelID, string dataID, string model, string status, string treeNode)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<DataSet>(model);

                TreeNode parentTree = null;
                if (!string.IsNullOrEmpty(treeNode))
                {
                    parentTree = Newtonsoft.Json.JsonConvert.DeserializeObject<TreeNode>(treeNode);
                }
                this._service.saveModelALL(modelID, dataID, data, status, parentTree);
                return Json(new { res = true, mes = "保存成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 数据模型List保存 restful 方法 仅助对象

        [HttpPost]
        public JsonResult saveModelList(string modelID, string saveData, string deleteData)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<DataSet>(saveData);
                var delData = Newtonsoft.Json.JsonConvert.DeserializeObject<DataTable>(deleteData);
                this._service.saveModelList(modelID, data, delData);
                return Json(new { res = true, mes = "保存成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion


        #region 数据模型删除方法
        [HttpPost]
        // GET: FBMeta
        public JsonResult deleteModel(string modelID, string dataID)
        {
            try
            {

                this._service.deleteModel(modelID, dataID);
                return Json(new { res = true, mes = "删除成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 根据模型获取数据模型的结构描述信息
        [HttpPost]
        public JsonResult getModelSchema(string modelID)
        {
            try
            {

                var data = this._service.getModelSchemaForWeb(modelID);
                return Json(new { res = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #region 帮助值查找
        [HttpPost]
        public string getQueryHelpSwitch(string helpID, string keyword, string codeField, string nameField, string filter, bool isParent)
        {
            try
            {
                var data = this._service.getQueryHelpSwitch(helpID, keyword, codeField, nameField, filter, isParent);
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = true, data = data });
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { res = false, mes = "失败" + ex.Message });
            }
        }
        #endregion

        #endregion




        #region Runtime Sql服务 接口API


        #region  自定义数据源 获取自定义数据源分类接口

        #region 获取数据模型主表的分页接口【分页】
        [HttpPost]
        // GET: FBMeta
        public string getDSPageList(string dsID, string pagesize, string page, string filter, string order, string sortname, string sortorder)
        {
            try
            {
                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                if (string.IsNullOrEmpty(order))
                {
                    // 采用列表的排序规则
                    if (!string.IsNullOrEmpty(sortname) && !string.IsNullOrEmpty(sortorder))
                    {
                        order = "[{\"Field\":\"" + sortname + "\",\"Order\":\"" + sortorder + "\"}]";
                    }
                }
                var list = this._service.getDSPageList(dsID, int.Parse(page), int.Parse(pagesize), filter, order, out totalpage, out total);
                return Newtonsoft.Json.JsonConvert.SerializeObject(list);
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { error = true, mes = "取数失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion




        #endregion


        #region SQL服务接口

        [HttpPost]
        public JsonResult callCustomService(string dsID, string frmID, string data)
        {
            try
            {
                var dict = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(data);

                this._serviceCutomDS.execDataSource(dsID, frmID, dict);
                return Json(new { res = true, mes = "执行成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "执行失败" + ex.Message });
                //throw ex;
            }
        }
        #endregion

        #endregion

    }
}