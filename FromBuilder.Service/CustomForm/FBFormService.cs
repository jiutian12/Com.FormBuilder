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

/// <summary>
/// 表单处理类 author:skip 2017/10/13
/// </summary>
namespace FormBuilder.Service
{
    public class FBFormService : Repository<FBForm>, IFBFormService
    {
        #region ctr 
        public FBFormService(IDbContext context) : base(context)
        {

        }
        #endregion

        #region 表单基本属性 Service

        #region 增加表单数据
        public void addData(FBForm model)
        {
            try
            {
                this.Db.CompleteTransaction();
                base.Db.Save<FBForm>(model);
                FBMeta.AddMeataData(model.ID, model.Code, model.Name, "3", model.parentID, base.Db);
                this.Db.CompleteTransaction();

            }
            catch (Exception ex)
            {
                this.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 保存表单数据
        public void saveData(FBForm model)
        {
            try
            {
                base.Db.BeginTransaction();

                Sql sql = new Sql(@"
            update FBForm set 
            Type=@0,Theme=@1,CodeEngine=@2,Config=@3,
            LayoutConfig=@4,PageLayout=@5,LastModifyTime=@6,
            LastModifyUser=@7,FSMID=@9,Note=@10 where ID=@8",
          model.Type, model.Theme, model.CodeEngine, model.Config,
          model.LayoutConfig, model.PageLayout, model.LastModifyTime,
          model.LastModifyUser, model.ID, model.FSMID, model.Note);
                base.Db.Execute(sql);
                //base.Db.Save<FBForm>(model);

                saveDependence(model.ID, model.ModelID, model.dplist, base.Db);

                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 删除表单
        /// <summary>
        /// 删除表单
        /// </summary>
        /// <param name="frmID"></param>
        public void deleteData(string frmID)
        {
            try
            {
                base.Db.BeginTransaction();
                FBMeta.deleteCheck(frmID, base.Db);
                FBMeta.DeleteMetaData(frmID, base.Db);//删除元数据
                base.Db.Execute(new NPoco.Sql("delete from FBForm where id=@0", frmID));
                base.Db.Execute(new NPoco.Sql("delete from FBFormDS where FormID=@0", frmID));
                base.Db.Execute(new NPoco.Sql("delete from FBFormToolBar where FormID=@0", frmID));
                base.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 获取表单模型
        public FBForm getModel(string helpid)
        {
            Sql sql = new Sql(@"select * from FBForm  where  ID=@0", helpid);
            FBForm model = base.Db.FirstOrDefault<FBForm>(sql);



            return model;
        }
        #endregion

        #region 分页获取表单列表
        public GridViewModel<FBForm> getPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBForm where 1=1 ");
            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and (Code like '" + keyword + "%' or Name like  '" + keyword + "%')"));

            }

            if (!string.IsNullOrEmpty(type))
            {
                sql.Append(new Sql(" and type='" + type + "' "));

            }

            sql.Append(new Sql(" order by lastModifytime desc "));
            Page<FBForm> page = base.Page<FBForm>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBForm> model = new GridViewModel<FBForm>();
            model.Rows = page.Items;
            model.TotalCount = totalItems;
            model.Total = totalItems;
            return model;
        }
        #endregion

        #region 保存表单设计器配置信息
        /// <summary>
        /// 保存表单设计器配置信息
        /// </summary>
        /// <param name="model"></param>
        public void savePage(FBForm model)
        {
            Sql sql = new Sql(@"
            update FBForm set 
            Type=@0,Theme=@2,CodeEngine=@3,Config=@4,
            LayoutConfig=@5,PageLayout=@6,LastModifyTime=@7,
            LastModifyUser=@8,ExpressInfo=@10 where ID=@9",
            model.Type, model.Theme, model.CodeEngine, model.Config,
            model.LayoutConfig, model.PageLayout, model.LastModifyTime,
            model.LastModifyUser, model.ID, model.ExpressInfo);
            saveDependence(model.ID, model.ModelID, model.dplist, base.Db);

            base.Db.Execute(sql);
        }


        public void pubUserResource(FBForm model, List<FBFormLink> linkList)
        {

            try
            {
                Db.BeginTransaction();
                model.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                model.LastModifyUser = SessionProvider.Provider.Current().UserName;
                Sql sql = new Sql(@"
            update FBForm set 
            CSSInfo=@0,UserJS=@1,LastModifyTime=@2,
            LastModifyUser=@3 where ID=@4",
                model.CSSInfo, model.UserJS, model.LastModifyTime,
                model.LastModifyUser, model.ID);
                base.Db.Execute(sql);

                base.Db.Execute(new Sql("delete from FBFormLink where formID=@0", model.ID));

                var i = 0;
                foreach (var item in linkList)
                {
                    item.Ord = i.ToString();
                    i += 5;
                    // 循环保存引用
                    Db.Save<FBFormLink>(item);
                }
                Db.CompleteTransaction();


            }
            catch (Exception ex)
            {
                Db.AbortTransaction();
                throw ex;
            }

        }


        public void publicPage(FBForm model)
        {
            Sql sql = new Sql(@"
            update FBForm set 
            Type=@0,Theme=@1,CodeEngine=@2,Config=@3,
            LayoutConfig=@4,PageLayout=@5,LastModifyTime=@6,
            LastModifyUser=@7,JSInfo=@8 ,
            HtmlInfo=@9  , ExpressInfo=@11 where ID=@10",
           model.Type, model.Theme, model.CodeEngine, model.Config,
           model.LayoutConfig, model.PageLayout, model.LastModifyTime,
           model.LastModifyUser, model.JSInfo, model.HtmlInfo, model.ID, model.ExpressInfo);
            saveDependence(model.ID, model.ModelID, model.dplist, base.Db);

            base.Db.Execute(sql);
        }

        #endregion

        #region 保存表单依赖信息

        private void saveDependence(string frmID, string modelID, List<string> list, Database db)
        {

            if (!string.IsNullOrEmpty(modelID))
            {
                list.Add(modelID);
            }

            List<FBMetaDependence> listSave = new List<FBMetaDependence>();
            var sql = new Sql("select  DSID from FBFormDS where FormID=@0", frmID);
            var list1 = db.Fetch<string>(sql);

            list = list.Union(list1).ToList<string>(); //剔除重复项 

            foreach (var item in list)
            {
                FBMetaDependence model = new FBMetaDependence();
                model.SourceID = frmID;
                model.TargetID = item.ToString();
                listSave.Add(model);
            }


            FBMeta.SaveDependence(frmID, listSave, db);
        }
        #endregion

        [Obsolete]
        public void saveAttr(FBForm model)
        {
            throw new NotImplementedException();
        }

        #region 保存表单默认值
        public void saveDefaultValue(string data, string formID)
        {
            Sql sql = new Sql(@"
            update FBForm set  DefaultInfo=@0  where ID=@1", data, formID);
            base.Db.Execute(sql);
        }

        #endregion

        #region 获取表单数据源的字段合集
        /// <summary>
        /// 获取表单数据源的字段合集
        /// </summary>
        /// <param name="frmid"></param>
        /// <param name="dmid"></param>
        /// <returns></returns>
        public List<JFBFormDS> getFormDS(string frmid, string dmid)
        {
            List<FBDataModelObjects> list = DataModelCom.getModelDSList(dmid, true, base.Db);

            List<JFBFormDS> ds = new List<JFBFormDS>();
            foreach (FBDataModelObjects model in list)
            {
                JFBFormDS info = new JFBFormDS();
                info.id = model.ID;
                info.ismain = model.isMain == "1" ? true : false;
                info.issys = true;
                info.dataid = model.ObjectID;//
                info.modelid = model.ModelID;
                info.text = model.Name;
                info.name = model.Code;
                List<JFBFormDSFields> collist = new List<JFBFormDSFields>();
                foreach (FBDataModelCols col in model.ColList)
                {
                    collist.Add(new JFBFormDSFields { id = col.Label, fieldid = col.ID, text = col.Label + "[" + col.Name + "]", type = col.DataType, isrelated = col.isRelated == "1" });
                }
                info.columns = collist;
                ds.Add(info);
            }
            //添加用户自定义数据源信息
            List<FBDataSource> customDS = DataSourceCom.getFormDataSource(frmid, base.Db);
            foreach (var model in customDS)
            {
                JFBFormDS info = new JFBFormDS();
                info.id = model.ID;
                info.ismain = false;
                info.issys = false;
                info.dataid = model.ID;
                info.modelid = model.ID;
                info.text = model.Name;
                List<JFBFormDSFields> collist = new List<JFBFormDSFields>();
                foreach (FBDataSourceCols col in model.ColList)
                {
                    collist.Add(new JFBFormDSFields { id = col.Code, fieldid = col.ID, text = col.Code + "[" + col.Name + "]", type = col.DataType, isrelated = false });
                }
                info.columns = collist;
                ds.Add(info);
            }
            return ds;
        }
        #endregion

        #endregion

        #region 表单工具栏Service

        #region 添加工具栏
        public void addToolBar(FBFormToolBar model)
        {
            base.Db.Save<FBFormToolBar>(model);
        }
        #endregion

        #region 引入工具栏项信息
        public void saveToolBarList(List<FBFormToolBar> list)
        {
            try
            {
                base.Db.BeginTransaction();
                foreach (var item in list)
                {

                    Db.Save<FBFormToolBar>(item);
                }
                base.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 删除工具项or 工具栏
        public void removeToolBar(string id)
        {
            base.Db.Execute(new Sql("delete from FBFormToolBar where id=@0", id));
        }
        #endregion

        #region 保存工具项信息
        public void saveToolBar(FBFormToolBar model)
        {
            base.Db.Save<FBFormToolBar>(model);
        }
        #endregion

        #region 获取表单工具栏所有数据
        public List<FBFormToolBar> getToolBarTree(string frmID, bool isUsed = false)
        {
            //List<FBFormToolBar> list = base.Db.Fetch<FBFormToolBar>(new Sql("select * from FBFormToolBar where formid=@0 order by ord asc", frmID));

            var sql = new Sql("select * from FBFormToolBar where formid=@0", frmID);
            if (isUsed)
            {
                sql.Append(" and IsUsed='1' ");
            }

            sql.Append(" order by ord asc");
            List<FBFormToolBar> list = base.Db.Fetch<FBFormToolBar>(sql);
            return list;


        }
        #endregion




        #region 获取表单工具栏根节点
        public List<FBFormToolBar> getToolBarRoot(string frmID)
        {
            List<FBFormToolBar> list = base.Db.Fetch<FBFormToolBar>(new Sql("select * from FBFormToolBar where formid=@0 and isroot='1' order by ord asc", frmID));
            return list;
        }
        #endregion

        #region 获取表单工具栏
        public FBFormToolBar getToolBar(string id)
        {
            return base.Db.SingleById<FBFormToolBar>(id);
        }
        #endregion
        #endregion

        #region 表单引入数据源 Service

        #region 删除引用数据源
        /// <summary>
        /// 删除已经引入的数据源信息
        /// </summary>
        /// <param name="frmID"></param>
        /// <param name="ids"></param>
        public void deleteDSInfo(string frmID, string ids)
        {
            try
            {
                base.Db.BeginTransaction();
                var list = ids.Split(',');
                foreach (var item in list)
                {

                    base.Db.Execute(
                        new Sql("delete from FBFormDS where FormID=@0 and DSID=@1", frmID, item));
                }
                base.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 获取引用数据源
        public GridViewModel<FBDataSource> getDSImport(string frmID, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql(
                @"select FBDataSource.* from FBFormDS 
                left join FBDataSource on FBFormDS.DSID=FBDataSource.ID 
                where 1=1");
            sql.Append(@" and FBFormDS.FormID=@0", frmID);

            Page<FBDataSource> page = base.Page<FBDataSource>(currentPage, perPage, sql);
            totalPages = page.TotalPages;
            totalItems = page.TotalItems;
            GridViewModel<FBDataSource> model = new GridViewModel<FBDataSource>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }
        #endregion

        #region 获取未引入数据源
        public GridViewModel<FBDataSource> getDSNotImport(string frmID, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql(
               @"select * from FBDataSource 
                where not exists 
                (select 1 from FBFormDS where FBFormDS.DSID=FBDataSource.ID and FBFormDS.FormID=@0) ", frmID);

            if (!string.IsNullOrEmpty(keyword))
            {
                //过滤条件
                sql.Append(" and (FBDataSource.id like '%" + keyword + "%' or FBDataSource.Code  like '%" + keyword + "%' or FBDataSource.Name  like '%" + keyword + "%')");
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

        #region 保存引入数据源
        public void saveDsInfo(string frmID, List<FBFormDS> list)
        {
            try
            {
                base.Db.BeginTransaction();
                foreach (var item in list)
                {

                    base.Db.Execute(
                        new Sql("delete from FBFormDS where FormID=@0 and DSID=@1", frmID, item.DSID));
                    base.Db.Save<FBFormDS>(item);
                }
                base.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 获取依赖列表
        /// <summary>
        /// 获取依赖列表
        /// </summary>
        /// <param name="type"></param>
        /// <param name="keyword"></param>
        /// <param name="id"></param>
        /// <param name="currentPage"></param>
        /// <param name="perPage"></param>
        /// <param name="totalPages"></param>
        /// <param name="totalItems"></param>
        /// <returns></returns>
        public GridViewModel<JFBMetaDependence> getDepenceList(string type, string keyword, string id, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql(@"select  c.id,c.type,c.name,e.Name as lx from  FBMetaDependence  a
                    left join  FBMetaData b on b.ID = a.SourceID
                    left join  FBMetaData c on c.ID = a.TargetID
                    left join FBMetaType e on e.Code = c.Type where 1=1");
            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and c.name like '" + keyword + "%' "));

            }

            if (!string.IsNullOrEmpty(type) & type == "1")
            {
                sql.Append(new Sql(" and TargetID='" + id + "'"));

            }
            else
            {
                sql.Append(new Sql(" and SourceID='" + id + "'"));
            }
            Page<JFBMetaDependence> page = base.Page<JFBMetaDependence>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<JFBMetaDependence> model = new GridViewModel<JFBMetaDependence>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }

        #endregion

        #region 保存表单引用字段


        /// <summary>
        /// 保存表单引用字段
        /// </summary>
        /// <param name="FormID"></param>
        /// <param name="list"></param>
        public void saveFormRef(string FormID, List<FBFormRef> list)
        {
            try
            {
                base.Db.BeginTransaction();

                foreach (var item in list)
                {
                    Db.Execute(new Sql("delete from FBFormRef where FormID=@0 and RefID=@1 ", FormID, item.RefID));
                    if (string.IsNullOrEmpty(item.ID))
                    {
                        item.ID = Guid.NewGuid().ToString();
                    }
                    Db.Save<FBFormRef>(item);
                    Db.CompleteTransaction();
                }

            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        #endregion
        #endregion


        #region 获取表单依赖引用
        public List<FBFormLink> getFormLink(string frmID, string keyword)
        {
            var sql = new Sql("select * from  FBFormLink  where FBFormLink.FormID=@0 order by Ord", frmID);
            List<FBFormLink> list = base.Db.Fetch<FBFormLink>(sql);


            return list;
        }
        #endregion




        #region Runtime Service
        public List<JFBDSSchema> getCustomDSSchema(string frmID)
        {

            var sql = new Sql("select FBDataSource.ID,FBDataSource.Name,FBDataSource.Tree from  FBFormDS  left join  FBDataSource on FBFormDS.DSID=FBDataSource.ID where FBFormDS.FormID=@0", frmID);
            List<JFBDSSchema> list = base.Db.Fetch<JFBDSSchema>(sql);

            foreach (var item in list)
            {
                if (!string.IsNullOrEmpty(item.Tree))
                    item.treeInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTreeStruct>(item.Tree);
            }



            return list;
        }


        #endregion



    }
}
