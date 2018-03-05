using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Service;
using FormBuilder.Utilities;
using FormBuilder.Model;

namespace FormBuilder.Web.Controllers
{
    public class CommonController : Controller
    {
        #region ctr

        IFBCommonService _service;
        IFBDataModelService _serviceDM;
        IFBDataObjectService _serviceDO;
        IFBDataSourceService _serviceDS;
        IFBFormService _serviceFrm;
        IFBSmartHelpService _serviceHP;

        public CommonController(
            IFBCommonService service,
            IFBDataModelService serviceDM,
            IFBDataObjectService serviceDO,
            IFBDataSourceService serviceDS,
            IFBFormService serviceFrm,
            IFBSmartHelpService serviceHP)
        {
            this._service = service;
            this._serviceDM = serviceDM;
            this._serviceDS = serviceDS;
            this._serviceDO = serviceDO;
            this._serviceFrm = serviceFrm;
            this._serviceHP = serviceHP;
        }
        #endregion
        // GET: Common
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Icons()
        {
            return View();
        }

        public ActionResult Dependence()
        {
            return View();
        }

        public ActionResult Expression()
        {

            //表达式编辑器页面
            return View();
        }
        public ActionResult MetaExplorer()
        {

            //表达式编辑器页面
            return View();
        }



        [HttpPost]
        public JsonResult remoteCheck(string model)
        {
            try
            {

                string res = "";
                var modelID = HttpContext.Request.Headers.Get("modelID");

                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckExits>(model);
                if (string.IsNullOrEmpty(model))
                {
                    res = this._service.remoteCheck(data, "", modelID);
                }
                else
                {
                    res = this._service.remoteCheck(data);
                }

                if (res != "")
                {
                    return Json(new { error = res });
                }
                else
                {
                    return Json(new { });
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }

        }


        [HttpPost]
        public JsonResult getFolderList(string parentID, bool isSys, bool isFolder, string keyword, bool isMy = false)
        {
            try
            {

                var userID = "";
                if (isMy)
                    userID = "user";

                var res = this._service.getFolderList(parentID, userID, isSys, isFolder, keyword);
                return Json(new { res = true, data = res });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "获取元数据列表失败" + ex.Message });
            }

        }

        [HttpPost]
        public JsonResult searchMetaData(string keyword, string parentID)
        {
            try
            {

                var res = this._service.searchMetaData(keyword, parentID);
                return Json(new { res = true, data = res });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "获取元数据列表失败" + ex.Message });
            }

        }


        [HttpPost]
        public JsonResult addFolder(string name, string parentID)
        {
            try
            {
                FBMetaData model = new FBMetaData();
                model.Code = model.Name = name;
                model.ID = Guid.NewGuid().ToString();
                model.ParentID = parentID;
                model.Type = "9";
                this._service.addFolder(model);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "获取元数据列表失败" + ex.Message });
            }

        }

        [HttpPost]
        public JsonResult renameFolder(string name, string id)
        {
            try
            {

                this._service.renameFolder(name, id);
                return Json(new { res = true, mes = "重命名成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "重命名失败" + ex.Message });
            }

        }

        [HttpPost]
        public JsonResult moveFolder(string data, string id)
        {
            try
            {

                if (id.ToLower() == "root")
                {
                    id = "";
                }
                List<string> list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(data);
                this._service.moveMetaData(list, id);
                return Json(new { res = true, mes = "重命名成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "重命名失败" + ex.Message });
            }

        }


        [HttpPost]
        public JsonResult detleteMeta(string id, string type)
        {
            try
            {
                switch (type)
                {
                    case "0":
                        this._serviceDO.DeleteObject(id);
                        break;
                    case "1":
                        this._serviceDM.DeleteModelInfo(id);
                        break;
                    case "2":
                        this._serviceHP.deleteData(id);
                        break;
                    case "3":
                        this._serviceFrm.deleteData(id);
                        break;
                    case "5":
                        this._serviceDS.deleteData(id);
                        break;
                    case "9":
                        this._service.deleteMeta(id);
                        // 删除文件夹是否要删除下级节点？ 不删除放到回收站？
                        break;
                    default:
                        break;
                }


                return Json(new { res = true, mes = "删除成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "重命名失败" + ex.Message });
            }

        }


        [HttpPost]
        public JsonResult createMetaData(string data, string type)
        {
            try
            {
                var lastTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                var lastUser = SessionProvider.Provider.Current().UserName;
                var entity = Newtonsoft.Json.JsonConvert.DeserializeObject<FBMetaModel>(data);
                switch (type)
                {
                    case "0":
                        {
                            FBDataObject model = new FBDataObject();
                            model.ID = Guid.NewGuid().ToString();
                            model.Code = entity.Code;
                            model.AiasName = entity.Name;
                            model.TableName = entity.TableName;
                            model.ParentID = entity.ParentID;
                            this._serviceDO.AddObject(model);
                        }
                        break;
                    case "1":
                        {
                            FBDataModel model = new FBDataModel();
                            model.ID = Guid.NewGuid().ToString();
                            model.Name = entity.Name;
                            model.Code = entity.Code;
                            model.MainObectID = entity.ModelID;
                            model.parentID = entity.ParentID;
                            this._serviceDM.AddModel(model);
                        }
                        break;
                    case "2":
                        {
                            FBSmartHelp model = new FBSmartHelp();
                            model.ID = Guid.NewGuid().ToString();
                            model.Code = entity.Code;
                            model.Name = entity.Name;
                            model.ModelID = entity.ModelID;
                            model.parentID = entity.ParentID;
                            this._serviceHP.addData(model);
                        }
                        break;
                    case "3":
                        {
                            FBForm model = new FBForm();
                            model.ID = Guid.NewGuid().ToString();
                            model.Code = entity.Code;
                            model.Name = entity.Name;
                            model.ModelID = entity.ModelID;
                            model.parentID = entity.ParentID;
                            model.Type = entity.FormType;
                            this._serviceFrm.addData(model);
                        }
                        break;
                    case "5":
                        {
                            FBDataSource model = new FBDataSource();
                            model.ID = Guid.NewGuid().ToString();
                            model.Code = entity.Code;
                            model.Name = entity.Name;
                            model.parentID = entity.ParentID;
                            this._serviceDS.addData(model);
                        }
                        break;
                    default:
                        break;
                }


                return Json(new { res = true, mes = "删除成功！" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "重命名失败" + ex.Message });
            }

        }

    }
}