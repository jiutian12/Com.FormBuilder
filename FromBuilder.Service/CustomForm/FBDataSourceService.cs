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
    public class FBDataSourceService : Repository<FBDataSource>, IFBDataSourceService
    {


        #region ctr 
        public FBDataSourceService(IDbContext context) : base(context)
        {

        }
        #endregion

        #region Design Service
        public void addData(FBDataSource model)
        {
            try
            {
                this.Db.BeginTransaction();
                base.Db.Save<FBDataSource>(model);
                FBMeta.AddMeataData(model.ID, model.Code, model.Name, "5", model.parentID, base.Db);
                this.Db.CompleteTransaction();

            }
            catch (Exception ex)
            {
                this.Db.AbortTransaction();
                throw ex;
            }
        }

        public void saveData(FBDataSource model)
        {

            try
            {
                base.Db.BeginTransaction();
                base.Db.Save<FBDataSource>(model);
                base.Db.Execute(new Sql(@" delete from  FBDataSourceCols where  DSID =@0  ", model.ID));
                foreach (FBDataSourceCols col in model.ColList)
                {
                    if (string.IsNullOrEmpty(col.ID))
                    {
                        col.ID = Guid.NewGuid().ToString();
                    }

                    col.DSID = model.ID;
                    base.Db.Save<FBDataSourceCols>(col);
                }

                FBMeta.UpdateMeataInfo(model.Name, model.Code, model.ID, base.Db);//更新元数据编号
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        /// <summary>
        /// 删除自定义数据源
        /// </summary>
        /// <param name="id"></param>
        public void deleteData(string id)
        {
            try
            {
                base.Db.BeginTransaction();
                FBMeta.deleteCheck(id, base.Db);
                FBMeta.DeleteMetaData(id, base.Db);//删除元数据
                base.Db.Execute(new NPoco.Sql("delete from FBDataSource where id=@0", id));
                base.Db.Execute(new NPoco.Sql("delete from FBDataSourceCols where DSID=@0", id));
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        public FBDataSource getModel(string helpid)
        {
            Sql sql = new Sql(@"select * from FBDataSource  where  ID=@0", helpid);
            FBDataSource model = base.Db.FirstOrDefault<FBDataSource>(sql);

            sql = new Sql(@"select * from    FBDataSourceCols where DSID =@0", helpid);

            model.ColList = base.Db.Fetch<FBDataSourceCols>(sql);

            return model;
        }

        public GridViewModel<FBDataSource> getPageList(string type, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBDataSource where 1=1");
            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and (Code like '" + keyword + "%' or Name like  '" + keyword + "%')"));

            }
            if (string.IsNullOrEmpty(order))
            {
                sql.Append(" order by lastModifytime desc");
            }
            else
            {
                sql.Append(order);
            }

            Page<FBDataSource> page = base.Page<FBDataSource>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBDataSource> model = new GridViewModel<FBDataSource>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }
        #endregion


        #region Rutime Sevice

        #region 获取异步加载树形数据  异步加载
        public List<Dictionary<string, object>> getModelTreeDataDictList(string modeID, string level, string path, string parentID, string keyWord, string filter, string order)
        {
            return DataSourceCom.getDSTreeData(modeID, level, path, parentID, keyWord, filter, order, base.Db);
        }
        #endregion

        #region 获取树形结构数据 非异步加载
        public List<Dictionary<string, object>> getModelTreeDataALL(string modeID, string keyWord, string filter, string order, Dictionary<string, object> formstate)
        {
            return DataSourceCom.getDSTreeDataALL(modeID, keyWord, filter, order, formstate,base.Db);
        }
        #endregion


        public bool execDataSource(string sourceID, string frmID, Dictionary<string, object> arr)
        {
            DataSourceCom.execDataSource(sourceID, frmID, arr, base.Db);
            //execDataSource(sourceID, frmID, arr);
            return true;
        }
        #endregion
    }
}
