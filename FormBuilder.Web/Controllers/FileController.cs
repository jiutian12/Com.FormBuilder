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

namespace FormBuilder.Web.Controllers
{
    public class FileController : Controller
    {


        #region ctr

        IFBFileService _service;
        public static LogHelper log = LogFactory.GetLogger(typeof(DataModelController));
        public FileController(IFBFileService service)
        {

            //log.Error("ddd");
            this._service = service;
        }
        #endregion




        [HttpPost]
        public JsonResult Upload(string dataID, string frmID, string field)
        {
            try
            {
                FBFileSave model = new FBFileSave();
                model.ID = Guid.NewGuid().ToString();
                HttpPostedFileBase file = Request.Files["file"];
                if (file != null)
                {
                    model.DataID = dataID;
                    model.FrmID = frmID;
                    model.FileName = file.FileName;
                    _service.saveFile(model);

                }
                else
                {
                    throw new Exception("未获取到文件信息！");
                }
                return Json(new { res = true, data = model.ID });
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return Json(new { res = false, mes = "上传失败" + ex.Message });
                //throw ex;
            }
        }


        [HttpPost]
        public JsonResult GetFileList(string dataID, string frmID, string field)
        {
            try
            {
                return Json(new { res = true, data = this._service.getFileList(dataID, frmID, field) });
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return Json(new { res = false, mes = "获取文件接口请求失败：" + ex.Message });
                //throw ex;
            }
        }


        [HttpPost]
        public JsonResult DeleteFile(string fileID)
        {
            try
            {
                this._service.deleteFile(fileID);
                return Json(new { res = false, mes = "删除成功！" });
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return Json(new
                {
                    res = false,
                    mes = "删除附件失败：" + ex.Message
                });
            }
        }
    }
}