using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;
using FormBuilder.Repository;
using FormBuilder.DataAccess.Interface;

namespace FormBuilder.Service
{
    public class FBFileService : Repository<FBFileService>, IFBFileService
    {
        #region ctr 
        public FBFileService(IDbContext context) : base(context)
        {

        }

        public void deleteFile(string fileID)
        {
            var sql = new Sql("delete from FBFileSave where id=@0", fileID);
            base.Db.Execute(sql);
            //记录日志
        }


        #endregion


        public Stream downLoad(string fileid)
        {
            throw new NotImplementedException();
        }

        public JFBFileSave getFileInfo(string fileid)
        {
            throw new NotImplementedException();
        }

        // 获取文件列表
        public List<JFBFileSave> getFileList(string dataID, string frmID, string field)
        {
            List<JFBFileSave> list = Db.Fetch<JFBFileSave>(new Sql(" select  id,filename name ,fileext ext,'' src,createuser,createtime from FBFileSave  where dataid=@0 and frmID=@1 ", dataID, frmID));
            return list;
        }

    

        /// <summary>
        /// 保存文件
        /// </summary>
        /// <param name="model"></param>

        public void saveFile(FBFileSave model)
        {
            base.Db.Save<FBFileSave>(model);
        }

        public void saveFile(FBFileSave model, byte[] data)
        {
            throw new NotImplementedException();

        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="frmID"></param>
        /// <param name="dataID"></param>
        /// <param name="fileid"></param>
        /// <param name="key"></param>
        /// <param name="fileName"></param>
        /// <param name="file"></param>
        public void upload(string frmID, string dataID, string fileid, string key, string fileName, byte[] file)
        {
            throw new NotImplementedException();
        }


    }
}
