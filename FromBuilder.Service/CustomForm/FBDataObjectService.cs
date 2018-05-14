using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Repository;
using FormBuilder.DataAccess.Interface;
using FormBuilder.Model;
using NPoco;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{
    public class FBDataObjectService : Repository<FBDataObject>, IFBDataObjectService
    {
        #region ctr
        //默认注入database实例
        public FBDataObjectService(IDbContext context) : base(context)
        {

        }
        #endregion

        #region 获取所有注册元数据信息 列表查询使用
        /// <summary>
        /// 分页获取元数据信息
        /// </summary>
        /// <param name="type"></param>
        /// <param name="keyword"></param>
        /// <param name="currentPage"></param>
        /// <param name="perPage"></param>
        /// <param name="totalPages"></param>
        /// <param name="totalItems"></param>
        public List<FBMetaData> getMetaDataList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBMetaData where 1=1");

            Page<FBMetaData> page = base.Page<FBMetaData>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;

            return page.Items;
        }
        #endregion

        #region 添加模型 Add

        public void AddData(FBDataObject model)
        {
            try
            {
                base.BeginTransaction();
                if (string.IsNullOrEmpty(model.TableName))
                    model.TableName = model.Code;
                base.Save(model);
                var list = model.ColList;
                if (string.IsNullOrEmpty(model.ID))
                {
                    model.ID = Guid.NewGuid().ToString();
                }
                base.Db.Execute(new Sql("delete from FBDataObjectCols where ObjectID=@0", model.ID));
                int i = 0;
                foreach (FBDataObjectCols col in list)
                {
                    if (string.IsNullOrEmpty(col.ID))
                    {
                        col.ID = Guid.NewGuid().ToString();
                        col.ObjectID = model.ID;

                    }
                    col.Ord = i.ToString();
                    i++;
                    this.Db.Save<FBDataObjectCols>(col);
                }
                FBMeta.UpdateMeataInfo(model.AiasName, model.Code, model.ID, base.Db);//更新元数据编号
                this.CompleteTransaction();
            }
            catch (Exception ex)
            {
                this.AbortTransaction();
                throw ex;
            }
        }

        #endregion

        #region 获取列表数据  SelectList
        /// <summary>
        /// 获取列表数据
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [Obsolete]
        public List<FBDataObject> GetObjectList(string filter)
        {
            return base.Fetch<FBDataObject>("select * from FBDataObject where 1=1 " + filter);
        }
        #endregion

        #region 删除数据对象 Delete
        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="id"></param>
        public void DeleteData(string id)
        {
            try
            {
                base.Db.BeginTransaction();
                FBMeta.deleteCheck(id, base.Db);
                FBMeta.DeleteMetaData(id, base.Db);
                base.Remove(new NPoco.Sql("delete from FBDataObject where id=@id", id));

                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 获取模型记录 SingleSelect
        /// <summary>
        /// 获取一条数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public FBDataObject GetModel(string id)
        {
            FBDataObject model = new FBDataObject();
            List<FBDataObjectCols> list = new List<FBDataObjectCols>();
            list = base.Fetch<FBDataObjectCols>(new NPoco.Sql("select * from FBDataObjectCols where objectid=@0 order by ord", id));

            if (base.ExistsById(id))
            {
                model = base.SingleById(id);
            }
            else
            {
                //model.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                //model.CreateUser = "";
                //model.LastModifyTime = model.CreateTime;
            }
            model.ColList = list;
            return model;
        }
        #endregion

        #region 获取对象的列信息 SelectChilds
        public List<FBDataObjectCols> GetColumn(string objectid)
        {
            return base.Fetch<FBDataObjectCols>(new NPoco.Sql("select * from FBDataObjectCols where objectid=@0 order by ord", objectid));

        }
        #endregion

        #region 分页获取数据对象列表


        /// <summary>
        /// 分页获取数据对象列表
        /// </summary>
        /// <param name="keyword"></param>
        /// <param name="order"></param>
        /// <param name="currentPage"></param>
        /// <param name="perPage"></param>
        /// <param name="totalPages"></param>
        /// <param name="totalItems"></param>
        /// <returns></returns>
        public GridViewModel<FBDataObject> GetDataObjectList(string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBDataObject where 1=1");
            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and (Code like '" + keyword + "%' or AiasName like  '" + keyword + "%')"));

            }
            sql.Append(" order by lastModifytime desc");

            Page<FBDataObject> page = base.Page<FBDataObject>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBDataObject> model = new GridViewModel<FBDataObject>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            model.Total = page.TotalItems;
            return model;
        }
        #endregion

        #region 删除数据对象
        public void DeleteObject(string ID)
        {
            try
            {
                base.Db.BeginTransaction();
                FBMeta.deleteCheck(ID, base.Db);
                FBMeta.DeleteMetaData(ID, base.Db);
                base.Db.Execute(new NPoco.Sql("delete from FBDataObject where id=@0", ID));
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 新增数据对象初始保存
        public void AddObject(FBDataObject model)
        {
            try
            {
                base.Db.BeginTransaction();
                FBMeta.AddMeataData(model.ID, model.Code, model.AiasName, "0", model.ParentID, base.Db);
                base.Save(model);


                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        public bool checkDeleteCol(string objectid, string colname, out string mes)
        {
            mes = "";
            var flag = true;
            var sql = new Sql(@"
            select  count(1) from FBDataModelCols a  join 
            FBDataModelObjects b on a.ModelID=b.ModelID and 
            a.ModelObjectID=b.ID where ObjectID=@0 and a.code=@1", objectid, colname);


            if (Db.ExecuteScalar<long>(sql) > 0)
            {
                flag = false;
                mes = "已经被数据模型的字段引用，无法删除！";
            }


            sql = new Sql(@"
            select count(1) from FBDataModelCols a  join FBDataModelRealtions b on a.RelationID = b.ID 
            where b.ObjectID=@0 and a.code=@1", objectid, colname);
            if (Db.ExecuteScalar<long>(sql) > 0)
            {
                flag = false;
                mes = "已经被数据关联引用 无法删除！";
            }
            return flag;
        }
        #endregion



        public List<string> getDBSChema()
        {
            Sql sql = new Sql();
            if (Db.DatabaseType == DatabaseType.MySQL)
            {
                sql.Append("select distinct TABLE_SCHEMA from INFORMATION_SCHEMA.tables");
            }
            else if (Db.DatabaseType == DatabaseType.Oracle)
            {

            }
            else
            {
                sql.Append("SELECT distinct TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES");
            }

            return Db.Fetch<string>(sql);
        }
        public GridViewModel<DBTable> getDBTables(string tableSchema, string keyword, int currentPage, int perPage)
        {

            Sql sql = new Sql();
            if (Db.DatabaseType == DatabaseType.MySQL)
            {
                sql.Append("Select TABLE_SCHEMA,TABLE_NAME,TABLE_TYPE,CREATE_TIME from information_schema.tables where 1=1 ");
            }
            else if (Db.DatabaseType == DatabaseType.Oracle)
            {

            }
            else
            {
                sql.Append("Select  TABLE_SCHEMA,TABLE_NAME,TABLE_TYPE,'' CREATE_TIME from information_schema.tables  where 1=1 ");
            }

            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(" and TABLE_NAME like @0", "%" + keyword + "%");
            }

            sql.Append(" and TABLE_SCHEMA = @0", tableSchema);

            sql.Append(" order by TABLE_NAME ");

            Page<DBTable> page = base.Page<DBTable>(currentPage, perPage, sql);



            GridViewModel<DBTable> model = new GridViewModel<DBTable>();
            model.Rows = page.Items;
            model.TotalCount = page.TotalItems;

            model.Total = page.TotalItems;
            return model;

        }



        public List<DBColumn> getDBColumnList(string tablename, string tableSchema)
        {
            Sql sql = new Sql();
            if (Db.DatabaseType == DatabaseType.MySQL)
            {
                sql.Append(@"
                select 
            COLUMN_NAME,DATA_TYPE,IS_NULLABLE , 
            CHARACTER_MAXIMUM_LENGTH as LENGTH,
            NUMERIC_PRECISION as NLENGTH, NUMERIC_SCALE AS PREC 
            from information_schema.COLUMNS where table_name = @0 and TABLE_SCHEMA=@1", tablename, tableSchema);
            }
            else if (Db.DatabaseType == DatabaseType.Oracle)
            {
            }
            else
            {
                sql.Append(@"
                select 
            COLUMN_NAME,DATA_TYPE,IS_NULLABLE , 
            CHARACTER_MAXIMUM_LENGTH as LENGTH,
            NUMERIC_PRECISION as NLENGTH, NUMERIC_SCALE AS PREC 
            from information_schema.COLUMNS where table_name = @0 and TABLE_SCHEMA=@1", tablename, tableSchema);
            }


            sql.Append(" order by ORDINAL_POSITION ");
            return Db.Fetch<DBColumn>(sql);

        }
    }
}
