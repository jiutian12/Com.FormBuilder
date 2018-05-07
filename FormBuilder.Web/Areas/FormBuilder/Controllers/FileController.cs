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
using System.IO;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
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


        public byte[] StreamToBytes(Stream stream)
        {
            byte[] bytes = new byte[stream.Length];
            stream.Read(bytes, 0, bytes.Length);
            stream.Seek(0, SeekOrigin.Begin);
            return bytes;
        }

        /// <summary>
        /// 上传附件
        /// </summary>
        /// <param name="dataID"></param>
        /// <param name="frmID"></param>
        /// <param name="field"></param>
        /// <returns></returns>
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
                    _service.saveFile(model, StreamToBytes(file.InputStream));

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


        /// <summary>
        /// 获取附件列表
        /// </summary>
        /// <param name="dataID"></param>
        /// <param name="frmID"></param>
        /// <param name="field"></param>
        /// <returns></returns>
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

        /// <summary>
        /// 删除附件
        /// </summary>
        /// <param name="fileID"></param>
        /// <returns></returns>

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

        /// <summary>
        /// 下载附件
        /// </summary>
        /// <param name="fileid"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult DownFile(string fileid)
        {
            Stream fs = this._service.downLoad(fileid);
            var fileName = this._service.getFileInfo(fileid).name;//获取文件名

            byte[] bytes = new byte[(int)fs.Length];
            fs.Read(bytes, 0, bytes.Length);
            fs.Close();
            Response.Charset = "UTF-8";
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("UTF-8");
            Response.ContentType = "application/octet-stream";

            Response.AddHeader("Content-Disposition", "attachment; filename=" + Server.UrlEncode(fileName));
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
            return new EmptyResult();

        }
    }
}