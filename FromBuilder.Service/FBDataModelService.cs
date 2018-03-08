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
using System.Data;

namespace FormBuilder.Service
{
    public class FBDataModelService : Repository<FBDataModel>, IFBDataModelService
    {
        #region ctr

        IDbContext context;
        public static LogHelper log = LogFactory.GetLogger(typeof(FBDataModelService));
        //默认注入database实例


        public FBDataModelService(IDbContext context) : base(context)
        {

            this.context = context;
        }

        #endregion

        #region Model Desgin Api Service

        #region 保存依赖信息
        private void saveDependence(string ModelID, Database db)
        {
            var sql = new Sql(@"
                select ObjectID from FBDataModelObjects where ModelID=@0 
            union all select ObjectID from FBDataModelRealtions where ModelID = @0", ModelID);

            List<string> list = db.Fetch<string>(sql);

            List<FBMetaDependence> listSave = new List<FBMetaDependence>();
            foreach (var item in list)
            {
                FBMetaDependence model = new FBMetaDependence();
                model.SourceID = ModelID;
                model.TargetID = item.ToString();
                listSave.Add(model);
            }
            FBMeta.SaveDependence(ModelID, listSave, db);
        }
        #endregion

        #region 删除子对象信息
        public void DeleteObject(string ModelID, string objectID, string modelObjectID)
        {
            try
            {
                base.Db.BeginTransaction();



                Sql sql = new Sql(@"delete  from FBDataModelObjects where ModelID=@0 and ObjectID=@1", ModelID, objectID);
                base.Db.Execute(sql);


                sql = new Sql(@"delete  from FBDataModelCols where ModelID=@0 and ModelObjectID=@1", ModelID, modelObjectID);
                base.Db.Execute(sql);

                //删除关联
                sql = new Sql(@"
                delete from FBDataModelRealtions where ModelID=@0 and ModelObjectID=@1 ", ModelID, modelObjectID);
                base.Db.Execute(sql);


                saveDependence(ModelID, base.Db);
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }

        }
        #endregion

        #region 列表删除模型
        /// <summary>
        /// 列表删除模型
        /// </summary>
        /// <param name="ModelID"></param>
        public void DeleteModelInfo(string ModelID)
        {
            try
            {
                base.Db.BeginTransaction();

                FBMeta.deleteCheck(ModelID, base.Db);
                FBMeta.DeleteMetaData(ModelID, base.Db);//删除元数据

                Sql sql = new Sql(@"delete  from FBDataModel where ID=@0", ModelID);
                base.Db.Execute(sql);

                sql = new Sql(@"delete  from FBMetaData where ID=@0", ModelID);
                base.Db.Execute(sql);

                sql = new Sql(@"delete  from  FBDataModelObjects where ModelID=@0", ModelID);
                base.Db.Execute(sql);

                sql = new Sql(@"delete  from FBDataModelCols where ModelID=@0", ModelID);
                base.Db.Execute(sql);


                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }

        }

        #endregion

        #region 保存数据模型基本属性
        public void SaveAttr(FBDataModel model)
        {
            try
            {
                base.Db.BeginTransaction();
                base.Db.Save<FBDataModel>(model);

                FBMeta.UpdateMeataInfo(model.Name, model.Code, model.ID, base.Db);//更新元数据编号
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 添加数据模型
        public void AddModel(FBDataModel model)
        {

            try
            {
                base.Db.BeginTransaction();
                //保存元数据
                FBMetaData meta = new FBMetaData();
                meta.ID = model.ID;
                meta.Type = "2";
                meta.State = "1";
                meta.Name = model.Name;
                meta.Code = model.Code;
                base.Db.Save<FBMetaData>(meta);


                //保存数据模型
                base.Save(model);

                //获取数据对象信息
                FBDataObject obj = new FBDataObject();
                FBDataObjectService svr = new FBDataObjectService(this.context);
                List<FBDataObjectCols> list = new List<FBDataObjectCols>();
                list = svr.GetColumn(model.MainObectID);
                obj = svr.GetModel(model.MainObectID);

                //保存主对象
                FBDataModelObjects modelmain = new FBDataModelObjects();
                modelmain.ID = Guid.NewGuid().ToString();
                modelmain.ModelID = model.ID;
                modelmain.Code = obj.Code;
                modelmain.Name = obj.AiasName;
                modelmain.ObjectID = model.MainObectID;
                var listres = list.Where(p => p.IsPrimary == "1").ToList();
                if (listres.Count <= 0)
                {
                    throw new Exception("数据对象必须定义一个主键！");
                }
                modelmain.PKCOLName = list.Where(p => p.IsPrimary == "1").ToList()[0].Code;
                modelmain.Level = "1";
                modelmain.isMain = "1";
                modelmain.Label = obj.Code;
                modelmain.ParentID = "";
                base.Db.Save<FBDataModelObjects>(modelmain);//保存列信息

                //保存子对象
                foreach (FBDataObjectCols col in list)
                {

                    FBDataModelCols mcol = new FBDataModelCols();
                    mcol.ID = Guid.NewGuid().ToString();
                    mcol.Code = col.Code;
                    mcol.Name = col.Name;
                    mcol.ModelID = model.ID;
                    mcol.ModelObjectID = modelmain.ID;
                    mcol.Label = col.Code;
                    mcol.isCard = "1";
                    mcol.isList = "1";
                    mcol.isReadOnly = "0";
                    mcol.isRelated = "0";
                    mcol.isUpdate = "1";
                    mcol.isVirtual = "0";
                    mcol.VirtualExpress = "";
                    mcol.RelationID = "";
                    mcol.ParentID = "";
                    mcol.Length = col.Length.ToString();
                    mcol.DataType = col.DataType;
                    mcol.isPrimary = col.IsPrimary;
                    mcol.Ord = col.Ord;
                    Db.Save<FBDataModelCols>(mcol);
                }

                FBMeta.AddMeataData(model.ID, model.Code, model.Name, "1", model.parentID, base.Db);
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 获取数据模型信息
        public FBDataModel GetModel(string ModelID)
        {
            FBDataModel model = new FBDataModel();
            model = base.SingleById(ModelID);
            return model;
        }

        #endregion


        public List<FBModelDeleteCheck> GetObjectDeleteCheckList(string ModelID, string ObjectID)
        {

            List<FBModelDeleteCheck> list = new List<FBModelDeleteCheck>();
            list = Db.Fetch<FBModelDeleteCheck>("select * from FBModelDeleteCheck where ModelID=@0 and ObjectID=@1", ModelID, ObjectID);
            return list;
        }

        public List<FBModelModifyCheck> GetObjectModifyCheckList(string ModelID, string ObjectID)
        {

            List<FBModelModifyCheck> list = new List<FBModelModifyCheck>();
            list = Db.Fetch<FBModelModifyCheck>("select * from FBModelModifyCheck where ModelID=@0 and ObjectID=@1", ModelID, ObjectID);
            return list;
        }

        #region 获取数据模型数据对象的列信息

        public List<FBDataModelCols> GetObjectColList(string ModelID, string ObjectID, bool hasRealtion)
        {
            if (string.IsNullOrEmpty(ObjectID))
            {
                ObjectID = DataModelCom.getMainModelObjectID(ModelID, base.Db);
            }
            List<FBDataModelCols> list = new List<FBDataModelCols>();
            list = Db.Fetch<FBDataModelCols>("select * from FBDataModelCols where ModelID=@0 and ModelObjectID=@1", ModelID, ObjectID);
            return list;
        }
        #endregion

        #region 获取数据模型数据对象的列表
        public List<FBDataModelObjects> GetObjectList(string ModelID)
        {

            Sql sql = new Sql(@"select * from FBDataModelObjects where ModelID=@0", ModelID);
            List<FBDataModelObjects> list = base.Fetch<FBDataModelObjects>(sql);
            return list;
        }
        #endregion

        #region 获取完整的数据模型信息
        /// <summary>
        /// 获取完整的数据模型信息（包含字段）
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="hasDetail"></param>
        /// <returns></returns>
        public List<FBDataModelObjects> GetObjectList(string ModelID, bool hasRelation)
        {

            Sql sql = new Sql(@"select * from FBDataModelObjects where ModelID=@0", ModelID);
            List<FBDataModelObjects> list = base.Fetch<FBDataModelObjects>(sql);

            foreach (FBDataModelObjects model in list)
            {
                model.ColList = this.GetObjectColList(ModelID, model.ObjectID, hasRelation);
                model.DeleteCheckList = this.GetObjectDeleteCheckList(ModelID, model.ObjectID);

                model.ModifyCheckList = this.GetObjectModifyCheckList(ModelID, model.ObjectID);
            }

            return list;
        }
        #endregion

        #region 获取数据对象字段信息
        public GridViewModel<FBDataObjectCols> GetObjectColumns(string objectid, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBDataObjectCols where objectid=@0 order by ord", objectid);

            Page<FBDataObjectCols> page = base.Page<FBDataObjectCols>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBDataObjectCols> model = new GridViewModel<FBDataObjectCols>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            model.Total = totalItems;
            return model;
        }
        #endregion

        #region 获取模型种某一个数据对象的字段信息
        public FBDataModelObjects GetObjectModel(string ModelID, string ObjectID, bool hasDetail)
        {
            Sql sql = new Sql(@"select * from FBDataModelObjects  where ModelID=@0 and ID=@1", ModelID, ObjectID);

            FBDataModelObjects model = base.Db.FirstOrDefault<FBDataModelObjects>(sql);


            if (model.ParentID != "")
            {
                model.ParentObjectName = Db.Single<string>("select Name from FBDataModelObjects where ID=@0", model.ParentID);
            }


            if (hasDetail)
            {
                //获取字段信息
                model.ColList = base.Db.Fetch<FBDataModelCols>(
                    new Sql(@"select * from FBDataModelCols where ModelObjectID=@0 and ModelID=@1 order by ord",
                    model.ID, model.ModelID));

                model.DeleteCheckList = this.GetObjectDeleteCheckList(ModelID, model.ObjectID);

                model.ModifyCheckList = this.GetObjectModifyCheckList(ModelID, model.ObjectID);

            }
            return model;
        }
        #endregion

        #region 保存数据模型

        public void SaveDataModel(FBDataModel model)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region 保存数据子对象信息
        public void SaveObject(FBDataModelObjects model)
        {

            try
            {
                base.Db.BeginTransaction();
                base.Db.Save<FBDataModelObjects>(model);
                base.Db.Execute(new Sql(@" delete from  FBDataModelCols where  ModelID =@0 and ModelObjectID =@1 and  isRelated='0'", model.ModelID, model.ID));
                int i = 0;
                foreach (FBDataModelCols col in model.ColList.Where(p => p.isRelated == "0").ToList())
                {

                    if (string.IsNullOrEmpty(col.ID))
                    {
                        col.ID = Guid.NewGuid().ToString();
                    }
                    col.Ord = i.ToString();
                    i++;
                    col.ModelObjectID = model.ID;
                    base.Db.Save<FBDataModelCols>(col);
                }


                base.Db.Execute(new Sql(@" delete from  FBModelDeleteCheck where  ModelID =@0 and ObjectID =@1 ", model.ModelID, model.ObjectID));
                foreach (FBModelDeleteCheck item in model.DeleteCheckList)
                {
                    if (string.IsNullOrEmpty(item.ID))
                    {
                        item.ID = Guid.NewGuid().ToString();
                    }
                    base.Db.Save<FBModelDeleteCheck>(item);
                }


                base.Db.Execute(new Sql(@" delete from  FBModelModifyCheck where  ModelID =@0 and ObjectID =@1 ", model.ModelID, model.ObjectID));
                foreach (FBModelModifyCheck item in model.ModifyCheckList)
                {
                    if (string.IsNullOrEmpty(item.ID))
                    {
                        item.ID = Guid.NewGuid().ToString();

                    }
                    item.ModelID = model.ModelID;
                    item.ObjectID = model.ObjectID;
                    base.Db.Save<FBModelModifyCheck>(item);
                }

                saveDependence(model.ModelID, base.Db);
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 保存子对象的列信息
        public void SaveObjectCols(FBDataObject model)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region 添加子对象
        public void AddObject(string modelID, string objectID)
        {
            //获取数据对象列表
            //获取数据对象字段信息
            //处理数据
            //保存
            try
            {
                base.Db.BeginTransaction();

                if (base.Db.Single<long>(new Sql("select count(1) from FBDataModelObjects where objectid=@0 and modelID=@1", objectID, modelID)) > 0)
                {
                    throw new Exception("数据模型中已存在该数据对象！");
                }
                List<FBDataModelCols> list = new List<FBDataModelCols>();
                FBDataModelObjects model = new FBDataModelObjects();

                FBDataObject obj_model = new FBDataObject();
                obj_model = base.Db.SingleById<FBDataObject>(objectID);

                List<FBDataObjectCols> obj_list = new List<FBDataObjectCols>();
                obj_list = base.Db.Fetch<FBDataObjectCols>(new Sql(@"select * from FBDataObjectCols where ObjectID=@0", objectID));


                model.ID = Guid.NewGuid().ToString();
                model.Code = obj_model.Code;
                model.Name = obj_model.AiasName;
                model.ModelID = modelID;
                model.ObjectID = objectID;
                model.isMain = "0";
                model.Label = "";
                model.isSave = "1";//默认是否保存勾选
                model.Level = "2";
                model.ParentID =
                    base.Db.Single<string>(
                        new Sql(@"select id from FBDataModelObjects where ModelID=@0 and level='1' and isMain='1'", modelID));
                model.PKCOLName = obj_list.Where(p => p.IsPrimary == "1").ToList()[0].Code;
                model.Filter = "";
                model.Sort = "";
                base.Db.Save<FBDataModelObjects>(model);
                int i = 0;
                foreach (FBDataObjectCols col in obj_list)
                {
                    FBDataModelCols mcol = new FBDataModelCols();
                    mcol.ID = Guid.NewGuid().ToString();
                    mcol.Code = col.Code;
                    mcol.Name = col.Name;
                    mcol.ModelID = modelID;
                    mcol.ModelObjectID = model.ID;
                    mcol.Label = col.Code;
                    mcol.isCard = "1";
                    mcol.isList = "1";
                    mcol.isReadOnly = "0";
                    mcol.isRelated = "0";
                    mcol.isUpdate = "1";
                    mcol.isVirtual = "0";
                    mcol.VirtualExpress = "";
                    mcol.RelationID = "";
                    mcol.ParentID = "";
                    mcol.Ord = i.ToString();
                    mcol.Length = col.Length.ToString();
                    mcol.DataType = col.DataType;
                    mcol.isPrimary = col.IsPrimary;
                    base.Db.Save<FBDataModelCols>(mcol);//保存列表
                    i++;
                }

                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion

        #region 获取要添加数据对象列表
        public GridViewModel<FBDataObject> GetObjects(string keyword, int currentPage, int perPage, out long totalPages, out long totalItems)
        {

            Sql sql = new Sql("select * from FBDataObject where 1=1");
            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and (ID like @0 or AiasName  like @0 or Code like @0) ", "%" + keyword + "%"));
            }
            sql.Append(" order by lastModifytime desc");

            Page<FBDataObject> page = base.Page<FBDataObject>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBDataObject> model = new GridViewModel<FBDataObject>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            model.Total = totalItems;
            return model;
        }
        #endregion

        #region 保存关联
        public void SaveRelation(FBDataModelRealtions model)
        {
            try
            {
                Db.BeginTransaction();
                //删除次字段的其他关联
                Db.Save<FBDataModelRealtions>(model);

                Db.Execute(new Sql("delete from FBDataModelCols where ParentID=@0 and RelationID=@1 and isRelated='1'", model.ModelObjectCol, model.ID));
                foreach (FBDataModelCols col in model.ColList)
                {
                    col.ParentID = model.ModelObjectCol;
                    //删除冗余字段
                    Db.Save<FBDataModelCols>(col);
                }
                saveDependence(model.ModelID, base.Db);

                UpdateDeleteCheck(model, base.Db);
                Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
        #endregion


        private void UpdateDeleteCheck(FBDataModelRealtions model, Database db)
        {

            Sql sql = new Sql("select id from FBDataModel where MainObectID=@0", model.ObjectID);
            var list = db.Fetch<Dictionary<string, object>>(sql);

            Sql sqlModel = new Sql("select Code,Name,PKColName from FBDataModelObjects where id=@0", model.ModelObjectID);
            var SoucreModelObject = db.Single<Dictionary<string, object>>(sqlModel);



            db.Execute(new Sql("delete from FBModelDeleteCheck where ObjectID=@0 and RelationID=@1", model.ObjectID, model.ID));

            foreach (var item in list)
            {
                FBModelDeleteCheck modelCheck = new FBModelDeleteCheck();
                modelCheck.ID = Guid.NewGuid().ToString();
                modelCheck.ModelID = item["id"].ToString();
                modelCheck.ObjectID = model.ObjectID;
                modelCheck.RelationID = model.ID;
                modelCheck.TableName = SoucreModelObject["code"].ToString();
                modelCheck.RefFilter = " and " + model.ModelObjectColCode + "=@0 ";
                modelCheck.ExtendFilter = "";
                modelCheck.DeleteTip = "数据{0}已经被" + SoucreModelObject["Name"].ToString() + "引用！";
                modelCheck.IsUsed = "0";
                db.Save<FBModelDeleteCheck>(modelCheck);
            }

        }

        #region 删除关联信息
        /// <summary>
        /// 删除关联信息
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="RelationID"></param>
        public void deleteRelation(string modelID, string RelationID)
        {
            try
            {
                Db.BeginTransaction();
                //删除次字段的其他关联
                //Db.Save<FBDataModelRealtions>(model);
                Db.Execute(new Sql("delete from FBDataModelRealtions where   ID=@0", RelationID));

                Db.Execute(new Sql("delete from FBDataModelCols where   RelationID=@0 and isRelated='1'", RelationID));

                saveDependence(modelID, base.Db);
                // 删除 删除检查
                Db.Execute(new Sql("delete from FBModelDeleteCheck where ObjectID=@0 and RelationID=@1", modelID, RelationID));

                Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        #endregion

        #region 获取关联信息
        public FBDataModelRealtions GetRelationInfo(string modelID, string ModelObjectID, string ModelObjectColID)
        {

            FBDataModelRealtions model = Db.FirstOrDefault<FBDataModelRealtions>("select * from FBDataModelRealtions where modelid=@0 and ModelObjectID=@1 and ModelObjectCol=@2", modelID, ModelObjectID, ModelObjectColID);

            if (model == null) model = new FBDataModelRealtions();
            if (string.IsNullOrEmpty(model.ID))
            {


                model.ID = Guid.NewGuid().ToString();
                model.ModelID = modelID;
                model.ModelObjectID = ModelObjectID;
                model.ModelObjectCol = ModelObjectColID;
                model.JoinType = "0";//0 左连接 1有链接 2 全链接 
                model.ModelObjectColCode = Db.Single<string>("select Label from FBDataModelCols where ID=@0", ModelObjectColID);
                //model.ObjectColCode=ModelObjectID
            }
            else
            {
                model.ColList = Db.Fetch<FBDataModelCols>("select * from FBDataModelCols where RelationID=@0", model.ID);
                model.ObjectName = Db.Single<string>("select AiasName from FBDataObject where ID=@0", model.ObjectID);
            }
            return model;
        }

        #endregion

        #region 获取数据模型列表

        public GridViewModel<FBDataModel> GetDataModelList(string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBDataModel where  1=1");


            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and (Code like '" + keyword + "%' or Name like  '" + keyword + "%')"));
            }
            Page<FBDataModel> page = base.Page<FBDataModel>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBDataModel> model = new GridViewModel<FBDataModel>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            model.Total = totalItems;
            return model;
        }

        public GridViewModel<FBDataModelCols> GetMainColumns(string modelid, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBDataModelCols b  where exists (select 1 from FBDataModelObjects a where a.ID=b.ModelObjectID and a.isMain='1' and ModelID=@0 )", modelid);

            Page<FBDataModelCols> page = base.Page<FBDataModelCols>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBDataModelCols> model = new GridViewModel<FBDataModelCols>();
            model.Rows = page.Items;
            // model.TotalCount = totalItems;
            model.Total = totalItems;
            return model;
        }


        #endregion

        #region 检查列是否被引用
        public bool checkDeleteCol(string ModelID, string ModelObjectID, string ColName, out string Mes)
        {
            Mes = "";
            var flag = true;
            var sql = new Sql("select count(*) from FBFormRef where RefID=@0 and ColList like @1", ModelObjectID, "%" + ColName + "%");

            if (Db.ExecuteScalar<long>(sql) > 0)
            {
                flag = false;
                Mes = "字段已经被表单引用无法删除，详细请查看依赖！";
            }
            return flag;
        }
        #endregion
        #endregion

        #region  Runtime Service

        #region 获取数据模型的数据结构
        public List<JFBSchema> getModelSchemaForWeb(string modelID)
        {
            // 基础数据源
            return DataModelCom.getModelSchemaForWeb(modelID, base.Db);
        }

        #endregion

        #region 智能帮助控件查询接口
        /// <summary>
        /// 帮助控件查询接口
        /// </summary>
        /// <param name="helpID"></param>
        /// <param name="keyword"></param>
        /// <param name="codeField"></param>
        /// <param name="nameField"></param>
        /// <param name="isParent"></param>
        /// <returns></returns>
        public List<dynamic> getQueryHelpSwitch(string helpID, string keyword, string codeField, string nameField, string filter, bool isParent)
        {
            var svr = new FBSmartHelpService(context);
            var model = svr.getModel(helpID);
            return DataModelCom.getQueryHelpSwitch(model.ModelID, keyword, codeField, nameField, filter, isParent, base.Db);
        }
        #endregion

        #region 根据主键数据获取结果集
        public List<dynamic> getModelDataByDataID(string modelID, string dataid, bool detail)
        {
            return DataModelCom.getModelDataByDataID(modelID, dataid, detail, base.Db);
        }

        #endregion

        #region 获取数据模型分页列表数据
        public GridViewModel<dynamic> getModelPageList(string modelID, int currentPage, int perPage, string filter, string order, out long totalPages, out long totalItems)
        {

            return DataModelCom.getModelPageList(modelID, currentPage, perPage, filter, order, out totalPages, out totalItems, base.Db);
        }
        #endregion

        #region 获取数据模型列表数据
        public List<dynamic> getModelData(string modelID, string filter, string order)
        {

            return DataModelCom.getModelData(modelID, filter, order, base.Db);
        }
        #endregion

        #region 获取异步加载树形数据  异步加载
        public List<Dictionary<string, object>> getModelTreeDataDictList(string modeID, string level, string path, string parentID, string keyWord, string filter, string order)
        {
            return DataModelCom.getModelTreeData(modeID, level, path, parentID, keyWord, filter, order, base.Db);
        }
        #endregion

        #region 获取树形结构数据 非异步加载
        public List<Dictionary<string, object>> getModelTreeDataALL(string modeID, string keyWord, string filter, string order)
        {
            return DataModelCom.getModelTreeDataALL(modeID, keyWord, filter, order, base.Db);
        }
        #endregion

        #region 保存数据模型 非树形结构
        public void saveModel(string modelID, DataSet ds, string status)
        {
            //try
            //{
            //    base.Db.BeginTransaction();


            DataModelCom.saveModel(modelID, ds, status, base.Db);
            //    base.Db.CompleteTransaction();
            //}
            //catch (Exception ex)
            //{
            //    base.Db.AbortTransaction();
            //    log.Error(ex.Message, ex);
            //    throw ex;
            //}
        }

        #endregion

        #region 保存数据模型 树形结构
        public void saveModel(string modelID, DataSet ds, string status, TreeNode tree)
        {
            //try
            //{
            //    base.Db.BeginTransaction();
            FBDataModel model = this.GetModel(modelID);
            DataModelCom.saveModel(modelID, model, ds, status, tree, base.Db);

            //    base.Db.CompleteTransaction();
            //}
            //catch (Exception ex)
            //{
            //    base.Db.AbortTransaction();
            //    log.Error(ex.Message, ex);
            //    throw ex;
            //}
        }

        #endregion

        #region  保存所有的数据 包子表
        public void saveModelALL(string modelID, string dataID, DataSet ds, string status, TreeNode tree)
        {
            //try
            //{
            //    base.Db.BeginTransaction();
            FBDataModel model = this.GetModel(modelID);
            DataModelCom.saveModelALL(modelID, model, dataID, ds, status, tree, base.Db);

            //    base.Db.CompleteTransaction();
            //}
            //catch (Exception ex)
            //{
            //    base.Db.AbortTransaction();
            //    log.Error(ex.Message, ex);
            //    throw ex;
            //}
        }

        #endregion

        #region 保存列表数据
        /// <summary>
        /// List Save
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="ds"></param>
        /// <param name="dsDel"></param>
        public void saveModelList(string modelID, DataSet ds, DataTable dsDel)
        {

            //try
            //{
            //    base.Db.BeginTransaction();
            DataModelCom.saveModelList(modelID, ds, dsDel, base.Db);
            //    base.Db.CompleteTransaction();
            //}
            //catch (Exception ex)
            //{
            //    base.Db.AbortTransaction();
            //    log.Error(ex.Message, ex);
            //    throw ex;
            //}

        }

        #endregion

        #region 删除模型数据
        public void deleteModel(string modelID, string dataid)
        {
            //try
            //{
            //    base.Db.BeginTransaction();

            // 启用依赖检查
            DataModelCom.deleteModelByDataID(modelID, dataid, true, base.Db);
            //    this.Db.CompleteTransaction();
            //}
            //catch (Exception ex)
            //{
            //    base.Db.AbortTransaction();
            //    throw ex;
            //}
        }
        #endregion

        #region 获取自定义数据分页数据
        public GridViewModel<dynamic> getDSPageList(string dsID, int currentPage, int perPage, string filter, string order, out long totalPages, out long totalItems)
        {
            return DataSourceCom.getDSPageList(dsID, currentPage, perPage, filter, order, out totalPages, out totalItems, base.Db);
        }


        #endregion





        #endregion
    }
}
