using FormBuilder.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using System.IO;
using Com.BF.Commonality.Api;
using Com.BF.Commonality.Services;
using Com.CF.FrameworkCore.Context;

namespace FormBuilder.LBFileProvider
{
    public class FileService : IFBFileService
    {
        AttachmentExService svr = new AttachmentExService();
        public void deleteFile(string fileID)
        {
            svr.DelFile(fileID);
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public Stream downLoad(string fileid)
        {
            Stream stream = new MemoryStream(svr.GetDownloadFile(fileid));
            return stream;

        }
        public int setFileMainID(string fileID, string mainID)
        {
            return svr.SetFileMainId(fileID, mainID);
        }

        public byte[] downLoadFile(string fileid)
        {

            return svr.GetDownloadFile(fileid);
        }

        public JFBFileSave getFileInfo(string fileid)
        {
            FileAttachment model = svr.GetAttInfoById(fileid);

            JFBFileSave entity = new JFBFileSave
            {
                name = model.FileName,
                id = model.Id,
                ext = model.Extension,
                createtime = model.CreateTime,
                createuser = model.Creator
            };
            return entity;
        }

        public List<JFBFileSave> getFileList(string dataID, string frmID, string field)
        {
            List<JFBFileSave> list = new List<JFBFileSave>();
            var reslist = svr.GetAttInfoByMainId(dataID);// svr.GetAttInfoByMainIdAndType(dataID, field);

            foreach (var item in reslist)
            {
                list.Add(new JFBFileSave
                {
                    id = item.Id,
                    name = item.FileName,
                    ext = item.Extension,
                    src = "",
                    createtime = item.CreateTime,
                    createuser = item.Creator
                });
            }
            return list;

        }

        public void saveFile(FBFileSave model)
        {
            AttrachmentUploadEntity entity = new AttrachmentUploadEntity();

            //entity.FileString
            svr.SaveFile(entity, null);

        }

        public void saveFile(FBFileSave model, byte[] data)
        {
            AttrachmentUploadEntity entity = new AttrachmentUploadEntity();
            entity.FileId = model.ID;
            entity.FileName = model.FileName;
            entity.MainId = model.DataID;
            entity.MainType = "";
            entity.Extension = model.FileExt;
            entity.Creator = LBFContext.Current.Session.UserName;
            if (string.IsNullOrEmpty(model.TypeCode))

                entity.FileTypeCode = "LBMAttFiles";

            else
                entity.FileTypeCode = model.TypeCode;

            //entity.FileString
            svr.SaveFile(entity, data);
        }

        public void upload(string frmID, string dataID, string fileid, string key, string fileName, byte[] file)
        {
            throw new NotImplementedException();
        }
    }
}
