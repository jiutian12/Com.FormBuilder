using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.DataAccess.Interface;
using FormBuilder.Model;
using FormBuilder.Repository;
using FormBuilder.Utilities;
using NPoco;

namespace FormBuilder.Service
{
    public class FBCommonService : Repository<FBDataModel>, IFBCommonService
    {

        #region ctr
        public FBCommonService(IDbContext context) : base(context)
        {
        }
        #endregion

        #region 元数据资源管理器操作

        #region 获取目录下的文件夹/文件

        /// <summary>
        /// 获取当前目录的文件夹
        /// </summary>
        /// <param name="parentID"></param>
        /// <param name="userID"></param>
        /// <param name="isSYS"></param>
        /// <returns></returns>
        public List<FBMetaData> getFolderList(string parentID, string userID, bool isSYS, bool isFolder, string keyword)
        {
            List<FBMetaData> list = new List<FBMetaData>();
            FBMetaData model = new FBMetaData();

            var sql = new Sql("select FBMetaData.*,FBMetaType.Name as MetaType from FBMetaData left join FBMetaType on FBMetaType.CODE=FBMetaData.type where parentID=@0 ", parentID);
            if (string.IsNullOrEmpty(parentID))
                sql.Append(new Sql(" or parentID is null"));
            sql.Append(new Sql(" order by  IsFolder Desc,Type,LastModifyTime desc"));
            if (isFolder)
            {
                sql = new Sql("select  FBMetaData.*,FBMetaType.Name as MetaType from FBMetaData left join FBMetaType on FBMetaType.CODE=FBMetaData.type  where IsFolder=@0 order by  IsFolder Desc,LastModifyTime desc", "1");
            }
            if (!string.IsNullOrEmpty(userID))
            {
                sql = new Sql("select  FBMetaData.*,FBMetaType.Name as MetaType from FBMetaData left join FBMetaType on FBMetaType.CODE=FBMetaData.type  where IsFolder=@0  and CreateUser=@1 order by  IsFolder Desc,LastModifyTime desc", "1", SessionProvider.Provider.Current().UserName);
            }

            if (!string.IsNullOrEmpty(keyword))
            {
                sql = new Sql("select  FBMetaData.*,FBMetaType.Name as MetaType from FBMetaData left join FBMetaType on FBMetaType.CODE=FBMetaData.type   where  1=1  and( FBMetaData.id like '%" + keyword + "%' or FBMetaData.name like '%" + keyword + "%')  order by  IsFolder Desc,LastModifyTime desc");
            }
            list = Db.Fetch<FBMetaData>(sql);
            return list;
        }
        #endregion

        #region 搜索元数据
        public List<FBMetaData> searchMetaData(string keyword, string parentID)
        {
            List<FBMetaData> list = new List<FBMetaData>();
            FBMetaData model = new FBMetaData();
            var sql = new Sql("select * from FBMetaData where IsFolder is null and( id like '" + keyword + "'or name like '" + keyword + "%')  order by  IsFolder Desc,LastModifyTime desc", parentID);
            list = Db.Fetch<FBMetaData>(sql);
            return list;
        }
        #endregion

        #region 添加文件夹
        public void addFolder(FBMetaData model)
        {
            FBMeta.AddMeataData(model, base.Db);
        }
        #endregion

        #region 重命名
        public void renameFolder(string name, string id)
        {
            FBMeta.UpdateFolderName(name, id, base.Db);
        }
        #endregion

        #region 删除元数据
        public void deleteMeta(string id)
        {
            FBMeta.DeleteMetaData(id, base.Db);
        }
        #endregion

        #region 移动文件夹
        public void moveMetaData(List<string> data, string targetID)
        {
            FBMeta.MoveMetaData(data, targetID, base.Db);
        }
        #endregion
        #endregion

        #region 远程校验
        public string remoteCheck(CheckExits model)
        {

            Sql sql = new NPoco.Sql(string.Format("select count(1) from {0} where {1}='{2}'", model.TableName, model.ValidField, model.ValidValue));

            if (!string.IsNullOrEmpty(model.DataID))
            {
                sql.Append(string.Format(" and {0}<>'{1}' ", model.KeyField, model.DataID));
            }
            if (model.Filter != null)
            {
                sql.Append(ConditionParser.Serialize(model.Filter));
            }

            if (this.Db.Single<long>(sql) > 0)
            {
                return string.Format("{0}的值已存在", model.Label);
            }
            return "";
            //
        }


        public string remoteCheck(CheckExits model, string frmID, string dataModelID)
        {
            Sql sql = new NPoco.Sql(string.Format("select count(1) from {0} where {1}='{2}'", model.TableName, model.ValidField, model.ValidValue));

            if (!string.IsNullOrEmpty(model.DataID))
            {
                sql.Append(string.Format(" and {0}<>'{1}' ", model.KeyField, model.DataID));
            }
            if (model.Filter != null)
            {
                sql.Append(ConditionParser.Serialize(model.Filter));
            }

            if (this.Db.Single<long>(sql) > 0)
            {
                return string.Format("{0}的值已存在", model.Label);
            }
            return "";
        }


        #endregion


        #region 日志处理

        public void LogError(string errorInfo)
        {
            FBLog.SetDb(Db);
            FBLog.LogError(errorInfo);
        }

        public void LogInfo(string logInfo)
        {
            FBLog.SetDb(Db);
            FBLog.LogInfo(logInfo);
        }

        public void LogDebug(string debugInfo)
        {
            FBLog.SetDb(Db);
            FBLog.LogDebug(debugInfo);
        }

        #region 获取分页列表日志信息
        public GridViewModel<Model.FBLog> GetLogList(string keyword, string filter, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBLog where 1=1 ");



            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and loginfo like @0", "%" + keyword + "%"));
            }
            if (string.IsNullOrEmpty(order))
            {
                sql.Append(" order by OpTime desc");
            }
            Page<Model.FBLog> page = base.Page<Model.FBLog>(currentPage, perPage, sql);
            totalPages = page.TotalPages;
            totalItems = page.TotalItems;

            GridViewModel<Model.FBLog> model = new GridViewModel<Model.FBLog>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }
        #endregion
        #endregion

    }
}
