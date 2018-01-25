using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;
using System.Collections;
using System.Reflection;
using System.Text.RegularExpressions;
using FormBuilder.DataAccess;

namespace FormBuilder.Service
{

    /// <summary>
    /// 处理数据模型通用方法
    /// </summary>
    public static class DataModelCom
    {



        #region 获取主对象的信息
        /// <summary>
        /// 获取主对象的信息
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="Db"></param>
        /// <returns></returns>
        public static JFBSchema getModelMainSchemaForWeb(string modelID, Database Db)
        {
            JFBSchema model = new JFBSchema();
            var token = "";
            if (Db.DatabaseType == DatabaseType.MySQL)
                token = "`";
            //获取数据模型的表关联信息
            Sql sql = new Sql(" select " + token + "Condition" + token + ",Tree,ID,Code as tableName,PKCOLName as pkCol,Label as tableLabel, isMain as isMainTable from FBDataModelObjects where ModelID =@0 and ismain = '1'", modelID);
            model = Db.FirstOrDefault<JFBSchema>(sql);
            model.isMain = model.isMainTable == "1" ? true : false;
            if (!string.IsNullOrEmpty(model.tree))
            {
                //获取树形结构
                model.treeInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTreeStruct>(model.tree);
            }
            if (!string.IsNullOrEmpty(model.condition))
            {

                model.conditionInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Condition>>(model.condition);
            }
            return model;
        }
        #endregion

        #region web平台公用数据模型schema信息序列化
        /// <summary>
        /// web平台公用数据模型schema信息序列化
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="Db"></param>
        /// <returns></returns>
        public static List<JFBSchema> getModelSchemaForWeb(string modelID, Database Db)
        {
            List<JFBSchema> list = new List<JFBSchema>();

            var token = "";
            if (Db.DatabaseType == DatabaseType.MySQL)
            {
                token = "`";
            }
            //获取数据模型的表关联信息
            Sql sql = new Sql(@" select  " + token + "Condition" + token + ", Tree,ID,Code as tableName,PKCOLName as pkCol,Label as tableLabel , isMain as isMainTable  from FBDataModelObjects where ModelID=@0", modelID);
            list = Db.Fetch<JFBSchema>(sql);

            foreach (var item in list)
            {
                item.isMain = item.isMainTable == "1" ? true : false;
                if (!string.IsNullOrEmpty(item.tree))
                {
                    //获取树形结构
                    item.treeInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTreeStruct>(item.tree);
                }
                //获取明细列信息
                List<JFBColumn> obj_list = new List<JFBColumn>();
                // 这里改成用字母排序 方便查看
                obj_list = Db.Fetch<JFBColumn>(new Sql(@"select id,code,label,name,datatype, isprimary as ispkcol, isrelated  as isrelated from FBDataModelCols where ModelObjectID=@0 and ModelID=@1 order by label asc", item.ID, modelID));
                foreach (var col in obj_list)
                {
                    col.related = col.isRelated == "1";
                    col.pkcol = col.isPkCol == "1";
                }
                item.cols = obj_list;
            }
            return list;
        }
        #endregion

        // 表单操作

        #region 查 Query


        private static ISQLStrategy getStrategy(Database db)
        {
            if (db.DatabaseType == DatabaseType.MySQL)
            {
                return new MySqlStrategy();
            }
            return new MSSStrategy();
        }
        #region  获取模型的一条记录 QuerySingle
        public static List<dynamic> getModelDataByDataID(string modelID, string dataid, bool detail, Database Db)
        {
            FBDataModel modelDM = getDataModelInfo(modelID, Db);
            Database ywDB = getModelDataSource(modelDM.DataSource);


            List<dynamic> result = new List<dynamic>();

            //var relationList = DataModelCom.getModelRelations(modelID, Db);
            var list = getModelObjects(modelID, detail, Db);
            foreach (var item in list)
            {


                DataModelEngine.setStrategy(getStrategy(ywDB));

                StringBuilder sb = DataModelEngine.BuildSelectSql(item, item.Relation);
                if (item.isMain == "1")
                {
                    sb.AppendFormat(" and {2}.{0}='{1}'", item.PKCOLName, dataid, item.Label);
                }
                else
                {
                    sb.AppendFormat(" and {2}.{0}='{1}'", item.Condition, dataid, item.Label);
                }
                var data = ywDB.Fetch<dynamic>(sb.ToString());// 业务db

                result.Add(new { id = item.ID, code = item.Code, data = data });
            }

            return result;
        }
        #endregion

        #region 获取分页的主表信息 QueryListPage
        public static GridViewModel<dynamic> getModelPageList(string modelID, int currentPage, int perPage, string filter, string order, out long totalPages, out long totalItems, Database Db)
        {
            FBDataModel modelDM = getDataModelInfo(modelID, Db);
            Database ywDB = getModelDataSource(modelDM.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));

            List<dynamic> result = new List<dynamic>();

            StringBuilder sb = new StringBuilder();


            // 过滤条件
            if (!string.IsNullOrEmpty(filter) && filter != "[]")
            {


                //StringBuilder sbfilter = new StringBuilder();
                List<Condition> filters = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Condition>>(filter);

                sb = getModelSelectSql(modelID, false, true, ref filters, Db);
                sb.AppendFormat(" {0} ", ConditionParser.Serialize(filters));
                //参数改造？
            }
            else
            {
                sb = getModelSelectSql(modelID, false, true, Db);
            }
            //排序
            if (!string.IsNullOrEmpty(order))
            {
                List<SortCondition> orders = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SortCondition>>(order);
                if (orders.Count > 0)
                    sb.AppendFormat(" order by {0} ", SortConditionParser.Serialize(orders));
            }


            Page<dynamic> page = ywDB.Page<dynamic>(currentPage, perPage, sb.ToString());// 业务db

            totalPages = page.TotalPages;

            totalItems = page.TotalItems;
            GridViewModel<dynamic> model = new GridViewModel<dynamic>();

            model.Rows = page.Items;
            model.TotalCount = totalItems;

            model.Total = totalItems;
            return model;
        }
        #endregion


        #region 获取数据模型上的数据 不分页 QueryList
        public static List<dynamic> getModelData(string modelID, string filter, string order, Database Db)
        {
            FBDataModel modelDM = getDataModelInfo(modelID, Db);
            Database ywDB = getModelDataSource(modelDM.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));

            List<dynamic> result = new List<dynamic>();



            StringBuilder sb = new StringBuilder();


            // 过滤条件
            if (!string.IsNullOrEmpty(filter) && filter != "[]")
            {


                //StringBuilder sbfilter = new StringBuilder();
                List<Condition> filters = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Condition>>(filter);

                sb = getModelSelectSql(modelID, false, true, ref filters, Db);
                sb.AppendFormat(" {0} ", ConditionParser.Serialize(filters));
                //参数改造？
            }
            else
            {
                sb = getModelSelectSql(modelID, false, true, Db);
            }


            //排序
            if (!string.IsNullOrEmpty(order))
            {
                List<SortCondition> orders = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SortCondition>>(order);
                if (orders.Count > 0)
                    sb.AppendFormat(" order by {0} ", SortConditionParser.Serialize(orders));
            }
            result = ywDB.Fetch<dynamic>(sb.ToString());
            return result;
        }
        #endregion


        #region 获取树形节点的异步加载数据 queryTreeAyncLoad
        /// <summary>
        /// 获取树形节点的异步加载数据
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="level"></param>
        /// <param name="path"></param>
        /// <param name="parentID"></param>
        /// <param name="keyWord"></param>
        /// <param name="filter"></param>
        /// <param name="order"></param>
        /// <param name="Db"></param>
        /// <returns></returns>

        public static List<Dictionary<string, object>> getModelTreeData(string modelID, string level, string path, string parentID, string keyWord, string filter, string order, Database Db)
        {

            FBDataModel modelDM = getDataModelInfo(modelID, Db);


            Database ywDB = getModelDataSource(modelDM.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));

            JFBSchema model = new JFBSchema();
            model = getModelMainSchemaForWeb(modelID, Db);

            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();

            // 获取树形取数的Sql信息
            StringBuilder sb = getModelTreeSelectSql(modelID, Db);
            string sbInit = sb.ToString();



            //过滤条件
            if (!string.IsNullOrEmpty(filter))
            {
                StringBuilder sbfilter = new StringBuilder();
                List<Condition> filters = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Condition>>(filter);
                sb.AppendFormat(" {0} ", ConditionParser.Serialize(filters));
            }

            JFBTreeStruct treeInfo = model.treeInfo;
            var isParentModel = true;

            if (string.IsNullOrEmpty(treeInfo.parentid))
                isParentModel = false;

            #region 获取子节点数据
            if (isParentModel)
            {
                if (string.IsNullOrEmpty(parentID) && !string.IsNullOrEmpty(treeInfo.rootvalue))
                {
                    parentID = treeInfo.rootvalue;
                }
                sb.AppendFormat(" and {0}.{1}='{2}'", model.tableLabel, model.treeInfo.parentid, parentID);
            }
            else
            {
                if (string.IsNullOrEmpty(path))
                {
                    sb.AppendFormat(" and {0}.{1}='{2}' ", model.tableLabel, model.treeInfo.level, level);
                }
                else
                {
                    sb.AppendFormat(" and {0}.{1}='{2}' and {0}.{3} like '{4}%'", model.tableLabel, model.treeInfo.level, level, model.treeInfo.grade, path);
                }
            }
            #endregion



            //排序
            if (!string.IsNullOrEmpty(order))
            {
                List<SortCondition> orders = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SortCondition>>(order);
                if (orders.Count > 0)
                    sb.AppendFormat(" order by {0} ", SortConditionParser.Serialize(orders));
            }


            result = ywDB.Fetch<Dictionary<string, object>>(sb.ToString());



            if (!string.IsNullOrEmpty(keyWord))
            {
                string qrySql = string.Format(" and {0}.{1} like '{2}%'", model.tableLabel, model.treeInfo.treename, keyWord);
                var resultList = ywDB.Fetch<Dictionary<string, object>>(new Sql(sbInit).Append(new Sql(qrySql)));

                foreach (var item in result)
                {
                    // 获取命中信息
                    var res = resultList.Where(p => p[model.treeInfo.grade].ToString().StartsWith(item[model.treeInfo.grade].ToString()));
                    if (res.ToList().Count > 0)
                    {
                        item["_istarget"] = "1";
                    }

                }

            }


            return result;
        }

        #endregion


        #region 获取树形的所有数据 queryTreeAll
        public static List<Dictionary<string, object>> getModelTreeDataALL(string modelID, string keyWord, string filter, string order, Database Db)
        {


            FBDataModel modelDM = getDataModelInfo(modelID, Db);

            Database ywDB = getModelDataSource(modelDM.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));

            JFBSchema model = new JFBSchema();
            model = getModelMainSchemaForWeb(modelID, Db);

            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();

            // 获取树形取数的Sql信息
            StringBuilder sb = getModelTreeSelectSql(modelID, Db);
            string sbInit = sb.ToString();
            //过滤条件
            if (!string.IsNullOrEmpty(filter))
            {
                StringBuilder sbfilter = new StringBuilder();
                List<Condition> filters = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Condition>>(filter);
                sb.AppendFormat(" {0} ", ConditionParser.Serialize(filters));
            }

            JFBTreeStruct treeInfo = model.treeInfo;

            //排序
            if (!string.IsNullOrEmpty(order))
            {
                List<SortCondition> orders = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SortCondition>>(order);
                if (orders.Count > 0)
                    sb.AppendFormat(" order by {0} ", SortConditionParser.Serialize(orders));
            }
            result = ywDB.Fetch<Dictionary<string, object>>(sb.ToString());



            if (!string.IsNullOrEmpty(keyWord))
            {
                string qrySql = string.Format(" and {0}.{1} like '{2}%'", model.tableLabel, model.treeInfo.treename, keyWord);
                var resultList = ywDB.Fetch<Dictionary<string, object>>(new Sql(sbInit).Append(new Sql(qrySql)));

                foreach (var item in result)
                {
                    // 获取命中信息
                    var res = resultList.Where(p => p[model.treeInfo.grade].ToString().StartsWith(item[model.treeInfo.grade].ToString()));
                    if (res.ToList().Count > 0)
                    {
                        item["_istarget"] = "1";
                    }

                }

            }


            return result;
        }
        #endregion


        #region  获取帮助模型查询 getQueryHelpSwitch
        public static List<dynamic> getQueryHelpSwitch(string modelID, string keyword, string codeField, string nameField, string filter, bool isParent, Database Db)
        {
            List<dynamic> result = new List<dynamic>();

            FBDataModel model = getDataModelInfo(modelID, Db);

            Database ywDB = getModelDataSource(model.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));


            //var relationList = DataModelCom.getModelRelations(modelID, Db);
            var list = getModelObjects(modelID, false, Db);
            foreach (var item in list)
            {
                StringBuilder sb = DataModelEngine.BuildSelectSql(item, item.Relation);
                // 树形的查询条件增加是否明细这个参数
                sb.AppendFormat(" and ({0}.{2} like '{1}%' or {0}.{3} like '{1}%')", item.Label, keyword, codeField, nameField);
                //过滤条件
                if (!string.IsNullOrEmpty(filter))
                {
                    StringBuilder sbfilter = new StringBuilder();
                    List<Condition> filters = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Condition>>(filter);
                    sb.AppendFormat(" {0} ", ConditionParser.Serialize(filters));
                }
                var data = ywDB.Fetch<dynamic>(sb.ToString());

                result = data;
                break;
            }

            return result;
        }
        #endregion

        #endregion

        #region 删 Delete
        #region 根据DataID 删除数据 deleteByDataID
        public static void deleteModelByDataID(string modelID, string dataid, bool detail, Database Db)
        {

            FBDataModel model = getDataModelInfo(modelID, Db);

            Database ywDB = getModelDataSource(model.DataSource);

            DataModelEngine.setStrategy(getStrategy(ywDB));
            try
            {
                ywDB.BeginTransaction();
                // 删除检查

                // 这里调用扩展删除前 表单扩展删除后事件

                var list = getModelObjects(modelID, detail, Db);


                foreach (var item in list)
                {
                    //  主表删除检查
                    if (item.isMain == "1")
                    {
                        var checkList = Db.Fetch<FBModelDeleteCheck>("select * from FBModelDeleteCheck where ModelID=@0 and ObjectID=@1 and isused='1'", modelID, item.ObjectID);

                        foreach (var checkitem in checkList)
                        {
                            Sql checksql = new Sql(string.Format("select count(1) from {0} where 1=1 {1}", checkitem.TableName, checkitem.RefFilter + " " + checkitem.ExtendFilter), dataid);
                            if (ywDB.ExecuteScalar<long>(checksql) > 0)
                            {
                                throw new Exception("删除失败！" + string.Format(checkitem.DeleteTip, ""));
                            }
                        }
                    }


                    Sql sql = DataModelEngine.BuildDeleteSql(item);
                    if (item.isMain == "1")
                    {
                        sql.Append(" and " + item.PKCOLName + "=@0 ", dataid);
                    }
                    else
                    {
                        sql.Append(" and " + item.Condition + "=@0 ", dataid);
                    }

                    ywDB.Execute(sql);
                }
                //这里调用扩展构件 表单扩展删除后事件
                //广播删除后事件
                //记录日志
                ywDB.CompleteTransaction();
            }
            catch (Exception ex)
            {
                ywDB.AbortTransaction();
                throw ex;
            }
        }
        #endregion
        #endregion

        #region 改 Update or Insert
        #region 数据模型通用保存方法 saveModel
        public static void saveModel(string modelID, DataSet ds, string status, Database Db)
        {

            List<dynamic> result = new List<dynamic>();

            FBDataModel model = getDataModelInfo(modelID, Db);
            Database ywDB = getModelDataSource(model.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));
            try
            {
                ywDB.BeginTransaction();
                DMSQL sqlActionMgr = new DMSQL(modelID, Db, ywDB);

                var list = getModelObjects(modelID, true, Db);
                if (status == "edit")
                {
                    sqlActionMgr.ExecBeforeSave(ds.Tables[0]);
                    // 业务库
                    ywDB.Execute(DataModelEngine.BuildUpdateSql(list[0], ds));
                    sqlActionMgr.ExecAfterSave(ds.Tables[0]);
                }
                else
                {
                    sqlActionMgr.ExecBeforeInsert(ds.Tables[0]);
                    // 业务库
                    ywDB.Execute(DataModelEngine.BuildInsertSql(list[0], ds)[0]);

                    sqlActionMgr.ExecAfterInsert(ds.Tables[0]);
                }
                ywDB.CompleteTransaction();
            }
            catch (Exception ex)
            {
                ywDB.AbortTransaction();
                throw ex;
            }
        }
        #endregion


        #region 数据模型通用保存方法 树形结构 saveModelTree
        public static void saveModel(string modelID, FBDataModel model, DataSet ds, string status, TreeNode treeNode, Database Db)
        {

            Database ywDB = getModelDataSource(model.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));
            try
            {
                ywDB.BeginTransaction();
                status = status.ToLower();
                List<dynamic> result = new List<dynamic>();
                var editFlag = status == "edit" ? true : false;
                var list = getModelObjects(modelID, true, Db);

                DMSQL sqlActionMgr = new DMSQL(modelID, Db, ywDB);

                var mainCode = "";
                var dataID = "";
                foreach (var item in list)
                {
                    if (item.isMain == "1")
                    {
                        // 更新主表
                        if (editFlag)
                        {
                            sqlActionMgr.ExecBeforeSave(ds.Tables[item.Code]);

                            //isTimeStamp
                            //
                            // 业务库
                            ywDB.Execute(DataModelEngine.BuildUpdateSql(item, ds));

                        }
                        else
                        {
                            sqlActionMgr.ExecBeforeInsert(ds.Tables[item.Code]);

                            // 处理树形数据
                            if (status == "addsame" || status == "addchild")
                            {
                                DMTreeHelper treeHelper = new DMTreeHelper();
                                treeHelper.db = ywDB;
                                treeHelper.tree = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTreeStruct>(item.Tree);
                                if (treeHelper.isPath())  // 新增状态处理分级码
                                    treeHelper.getMaxPath(item, treeNode.grade, treeNode.level, status == "addsame", ref ds);

                                if (status == "addchild")
                                    // 更新上级是否明细字段
                                    treeHelper.updateMXField(item, treeNode);
                            }
                            // 业务库
                            // 新增数据
                            ywDB.Execute(DataModelEngine.BuildInsertSql(item, ds)[0]);// 只执行单条主表sql
                            sqlActionMgr.ExecAfterInsert(ds.Tables[item.Code]);

                        }
                        dataID = ds.Tables[item.Code].Rows[0][item.PKCOLName].ToString();//记录主键
                        saveFileList(modelID, dataID, ds, Db); //保存主表附件信息
                        saveTimeStampInfo(item, editFlag, true, dataID, ywDB); // 时间戳处理
                    }
                    else if (item.isSave == "1") // 如果明细表启用了保存的话
                    {

                        if (model.DetailSaveMode == "1")
                        {
                            #region 获取原有的数据
                            DataTable dt = ds.Tables[item.Code];
                            DataTable dtNew = dt.Clone();
                            var getDataSql = DataModelEngine.BuildSelectSql(item, item.Relation);
                            getDataSql.AppendFormat(" and {0}=@0", item.Condition);
                            List<Dictionary<string, object>> beforeList
                                = ywDB.Fetch<Dictionary<string, object>>(new Sql(getDataSql.ToString(), dataID));// 获取原有数据
                            #endregion

                            #region 循环并且处理Update的数据
                            foreach (DataRow row in dt.Rows)
                            {
                                if (beforeList.Count > 0)
                                {
                                    var filterResult = beforeList.Where(p => p[item.PKCOLName].ToString() == row[item.PKCOLName].ToString());
                                    if (filterResult.ToArray().Length > 0)
                                    {
                                        beforeList.Remove(filterResult.Single());
                                        ywDB.Execute(DataModelEngine.BuildUpdateSql(item, row));
                                        // 时间戳处理
                                        saveTimeStampInfo(item, editFlag, true, row[item.PKCOLName].ToString(), ywDB);
                                    }
                                    else
                                    {
                                        dtNew.ImportRow(row);
                                    }
                                }
                                else
                                {
                                    dtNew.ImportRow(row);
                                }
                            }
                            #endregion

                            #region 循环处理Insert数据
                            DataSet dsInsert = new DataSet();
                            dsInsert.Tables.Add(dtNew);

                            var sqlList = DataModelEngine.BuildInsertSql(item, dsInsert);
                            foreach (var sql in sqlList)
                            {
                                Db.Execute(sql);
                            }

                            #region 时间戳处理
                            // 循环处理新增的数据的时间戳字段
                            foreach (DataRow rowinfo in dsInsert.Tables[item.Code].Rows)
                            {
                                saveTimeStampInfo(item, false, true, rowinfo[item.PKCOLName].ToString(), ywDB);
                            }
                            #endregion
                            #endregion

                            #region 删除本次要删除的数据
                            // 删除本次删除列表数据
                            foreach (Dictionary<string, object> delItem in beforeList)
                            {
                                ywDB.Execute(DataModelEngine.BuildDeleteDetailSql(item.Code, item.PKCOLName, delItem[item.PKCOLName].ToString()));
                            }
                            #endregion

                        }
                        else
                        {
                            // 先删后增
                            Db.Execute(DataModelEngine.BuildDeleteSql(item, dataID));
                            var sqlList = DataModelEngine.BuildInsertSql(item, ds);
                            foreach (var sql in sqlList)
                            {
                                ywDB.Execute(sql);
                            }

                            saveTimeStampInfo(item, editFlag, false, dataID, ywDB);
                        }
                    }
                }
                #region 保存后扩展
                // 保存后sql 
                if (editFlag)
                {
                    sqlActionMgr.ExecAfterSave(ds.Tables[mainCode]);
                }
                else
                {
                    sqlActionMgr.ExecAfterInsert(ds.Tables[mainCode]);
                }
                ywDB.CompleteTransaction();
                #endregion
            }
            catch (Exception ex)
            {
                ywDB.AbortTransaction();
                throw ex;
            }
        }
        #endregion


        /// <summary>
        /// 保存时间戳字段
        /// </summary>
        /// <param name="item">数据对象的结构信息</param>
        /// <param name="isEdit">是否是编辑状态</param>
        /// <param name="isRelated">是否主从关联 如果是true的话则用明细表关联主表字段进行更新 适用于批量更新</param>
        /// <param name="dataID">数据id 正常为数据主键 isRelated 为关联建数据</param>
        /// <param name="db"></param>
        private static void saveTimeStampInfo(FBDataModelObjects item, bool isEdit, bool isRelated, string dataID, Database db)
        {


            if (item.isTimeStamp == "1")
            {
                JFBTimeStamp time = new JFBTimeStamp();
                time = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTimeStamp>(item.changeFields);
                var timeNow = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                var opUser = SessionProvider.Provider.Current().UserName;
                //var dataID = "";
                var dataField = isRelated ? item.PKCOLName : item.Condition;
                if (isEdit)
                {
                    string updateSql = string.Format("update {0} set {1}=@0,{2}=@1 where {3}=@2", item.Code, time.lastModifyTime, time.lastModifyUser, dataField);
                    var sql = new Sql(updateSql, timeNow, opUser, dataID);
                    db.Execute(sql);
                }
                else
                {
                    string updateSql = string.Format("update {0} set {1}=@0,{2}=@1 where {3}=@2", item.Code, time.createTime, time.createUser, dataField);
                    var sql = new Sql(updateSql, timeNow, opUser, dataID);
                    db.Execute(sql);
                }
            }
        }

        #region 数据模型通用保存方法 包括子表 SaveModelALL
        public static void saveModelALL(string modelID, FBDataModel model, string dataID, DataSet ds, string status, Database Db)
        {

            Database ywDB = getModelDataSource(model.DataSource);
            DataModelEngine.setStrategy(getStrategy(ywDB));
            try
            {
                ywDB.BeginTransaction();
                var list = getModelObjects(modelID, true, Db);
                List<dynamic> result = new List<dynamic>();

                var editFlag = status == "edit" ? true : false;

                DMSQL sqlActionMgr = new DMSQL(modelID, Db, ywDB);

                var mainCode = "";
                foreach (var item in list)
                {
                    if (item.isMain == "1")
                    {
                        mainCode = item.Code;
                        if (editFlag)
                        {
                            sqlActionMgr.ExecBeforeSave(ds.Tables[item.Code]);
                            ywDB.Execute(DataModelEngine.BuildUpdateSql(item, ds));
                        }
                        else
                        {
                            sqlActionMgr.ExecBeforeInsert(ds.Tables[item.Code]);
                            ywDB.Execute(DataModelEngine.BuildInsertSql(item, ds)[0]);
                        }
                        //保存卡片附件信息
                        saveFileList(modelID, dataID, ds, Db);
                        saveTimeStampInfo(item, editFlag, true, dataID, ywDB); // 时间戳处理
                    }
                    else if (item.isSave == "1") // 如果明细表启用了保存的话
                    {

                        if (model.DetailSaveMode == "1")
                        {
                            #region 获取原有的数据
                            DataTable dt = ds.Tables[item.Code];
                            DataTable dtNew = dt.Clone();
                            var getDataSql = DataModelEngine.BuildSelectSql(item, item.Relation);
                            getDataSql.AppendFormat(" and {0}=@0", item.Condition);
                            List<Dictionary<string, object>> beforeList
                                = ywDB.Fetch<Dictionary<string, object>>(new Sql(getDataSql.ToString(), dataID));// 获取原有数据
                            #endregion

                            #region 循环并且处理Update的数据
                            foreach (DataRow row in dt.Rows)
                            {
                                if (beforeList.Count > 0)
                                {
                                    var filterResult = beforeList.Where(p => p[item.PKCOLName].ToString() == row[item.PKCOLName].ToString());
                                    if (filterResult.ToArray().Length > 0)
                                    {
                                        beforeList.Remove(filterResult.Single());
                                        ywDB.Execute(DataModelEngine.BuildUpdateSql(item, row));
                                        saveTimeStampInfo(item, editFlag, true, row[item.PKCOLName].ToString(), ywDB);//更新时间戳
                                    }
                                    else
                                    {
                                        dtNew.ImportRow(row);
                                    }
                                }
                                else
                                {
                                    dtNew.ImportRow(row);
                                }
                            }
                            #endregion

                            #region 循环处理Insert数据
                            DataSet dsInsert = new DataSet();
                            dsInsert.Tables.Add(dtNew);

                            var sqlList = DataModelEngine.BuildInsertSql(item, dsInsert);
                            foreach (var sql in sqlList)
                            {
                                ywDB.Execute(sql);
                            }

                            #region 时间戳处理
                            foreach (DataRow rowinfo in dsInsert.Tables[item.Code].Rows)
                            {
                                saveTimeStampInfo(item, false, true, rowinfo[item.PKCOLName].ToString(), ywDB);
                            }
                            #endregion
                            #endregion

                            #region 删除本次要删除的数据
                            // 删除本次删除列表数据
                            foreach (Dictionary<string, object> delItem in beforeList)
                            {
                                ywDB.Execute(DataModelEngine.BuildDeleteDetailSql(item.Code, item.PKCOLName, delItem[item.PKCOLName].ToString()));
                            }
                            #endregion

                        }
                        else
                        {
                            // 先删后增
                            Db.Execute(DataModelEngine.BuildDeleteSql(item, dataID));
                            var sqlList = DataModelEngine.BuildInsertSql(item, ds);
                            foreach (var sql in sqlList)
                            {
                                ywDB.Execute(sql);
                            }

                            saveTimeStampInfo(item, editFlag, false, dataID, ywDB);
                        }



                    }

                }

                if (status == "edit")
                {
                    sqlActionMgr.ExecAfterSave(ds.Tables[mainCode]);
                }
                else
                {
                    sqlActionMgr.ExecAfterInsert(ds.Tables[mainCode]);
                }
                ywDB.CompleteTransaction();

            }
            catch (Exception ex)
            {
                ywDB.AbortTransaction();
                throw ex;
            }


        }
        #endregion




        #region 数据模型通用保存方法列表保存  SaveList 待完善 多数据源 todo
        public static void saveModelList(string modelID, DataSet ds, DataTable dsDel, Database Db)
        {
            List<dynamic> result = new List<dynamic>();

            var list = getModelObjects(modelID, false, Db);
            var mainCode = list[0].Code;//主表编号
            //界面上先删后增
            foreach (DataRow row in dsDel.Rows)
            {
                // 删除主表信息
                Db.Execute(DataModelEngine.BuildDeleteMainSql(list[0], row[list[0].PKCOLName].ToString()));
            }
            //根据模型策略是先删后增还是部分新增

            //保存or更新列表上的数据
            foreach (DataRow row in ds.Tables[mainCode].Rows)
            {
                // 检查权限？
                Db.Execute(DataModelEngine.BuildDeleteMainSql(list[0], row[list[0].PKCOLName].ToString()));
            }
            //插入数据


            var sqlList = DataModelEngine.BuildInsertSql(list[0], ds);
            foreach (var sql in sqlList)
            {
                Db.Execute(sql);
            }


        }
        #endregion
        #endregion

        #region private methods


        #region 保存附件信息 saveFileList
        private static void saveFileList(string modelID, string dataID, DataSet ds, Database Db)
        {
            if (!ds.Tables.Contains("FBFileSave")) return;
            DataTable dt = ds.Tables["FBFileSave"];
            List<JFBFileSave> list = Db.Fetch<JFBFileSave>(new Sql(" select  id,filename name ,fileext ext,'' src,createuser,createtime from FBFileSave  where dataid=@0 ", dataID));

            List<string> deleteArr = new List<string>();
            foreach (var item in list)
            {

                if (dt.Rows.Count == 0 || dt.Select(" id='" + item.id + "'").Length <= 0)//如果保存的数据里没有 则删除数据库记录
                    deleteArr.Add(item.id);
            }
            //删除记录
            foreach (var item in deleteArr)
            {
                Db.Execute(new Sql("delete from FBFileSave where id=@0", item));
            }
        }
        #endregion


        #region 获取模型的数据源以及列字段信息 getModelDSList
        /// <summary>
        /// 获取模型的数据源以及列字段信息
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="hasDetail"></param>
        /// <param name="Db"></param>
        /// <returns></returns>
        public static List<FBDataModelObjects> getModelDSList(string ModelID, bool hasDetail, Database Db)
        {
            Sql sql = new Sql(@"select * from FBDataModelObjects  where ModelID=@0", ModelID);

            List<FBDataModelObjects> model = Db.Fetch<FBDataModelObjects>(sql);
            if (hasDetail)
            {
                foreach (FBDataModelObjects info in model)
                {
                    //获取字段信息
                    info.ColList = Db.Fetch<FBDataModelCols>(
                        new Sql(@"select * from FBDataModelCols where ModelObjectID=@0 and ModelID=@1 order by Label asc",
                        info.ID, info.ModelID));
                }

            }
            return model;
        }
        #endregion


        #region 获取数据模型主对象的ID信息 getMainModelObjectID
        /// <summary>
        /// 获取数据模型主对象的ID信息
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        public static string getMainModelObjectID(string modelID, Database db)
        {
            var sql = new Sql(@"select id from FBDataModelObjects where ModelID=@0 and level='1' and isMain='1'", modelID);

            return db.Single<string>(sql);
        }
        // 
        #endregion


        #region 获取数据模型的表信息、字段信息、关联信息 getModelObjects
        private static List<FBDataModelObjects> getModelObjects(string modelID, bool detail, Database Db)
        {
            List<FBDataModelObjects> list = new List<FBDataModelObjects>();
            Sql sql = new Sql(@" select *  from FBDataModelObjects where ModelID=@0 ", modelID);
            //获取数据模型的表关联信息
            if (!detail) sql.Append(" and ismain='1' ");
            sql.Append(" order by isMain desc ");
            list = Db.Fetch<FBDataModelObjects>(sql);
            foreach (var item in list)
            {
                //获取关联信息
                item.Relation = Db.Fetch<FBDataModelRealtions>(
                    new Sql(@"select * from FBDataModelRealtions where modelid=@0 and ModelObjectID=@1",
                    modelID, item.ID));
                //获取列信息
                item.ColList = Db.Fetch<FBDataModelCols>(
                    new Sql(@"select * from FBDataModelCols where ModelObjectID=@0 and ModelID=@1",
                    item.ID, modelID));
                //处理查询条件和排序

            }
            return list;
        }
        #endregion

        private static FBDataModel getDataModelInfo(string ModelID, Database Db)
        {
            FBDataModel model = new FBDataModel();
            model = Db.SingleById<FBDataModel>(ModelID);
            return model;
        }

        /// <summary>
        /// 获取模型的执行数据源
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        private static Database getModelDataSource(string DataSource)
        {
            return DataBaseManger.GetDB(DataSource);
        }

        #region   获取通用主表selectSql getModelSelectSql
        private static StringBuilder getModelSelectSql(string modelID, bool islist, bool iscard, Database Db)
        {
            //如果是有缓存 那么则从sql缓存处理
            var list = getModelObjects(modelID, false, Db);
            StringBuilder sb = DataModelEngine.BuildSelectSql(list[0], list[0].Relation, false, iscard, islist);
            return sb;

        }


        private static StringBuilder getModelSelectSql(string modelID, bool islist, bool iscard, ref List<Condition> filterList, Database Db)
        {
            //如果是有缓存 那么则从sql缓存处理
            var list = getModelObjects(modelID, false, Db);
            // 处理关联字段 的过滤条件


            foreach (var item in filterList)
            {
                var field = item.ParamName;

                var res = list[0].ColList.Where(p => p.isRelated == "1" & p.Label.ToString().ToUpper() == field.ToUpper()).ToList();

                if (res.Count > 0)
                {
                    var realtionID = res[0].RelationID;
                    var table = list[0].Relation.Where(p => p.ID == realtionID).ToList();
                    if (table.Count > 0)
                    {
                        item.ParamName = string.Format("{0}.{1}", table[0].ObjectLabel, res[0].Code);
                    }
                }
                else
                {
                    item.ParamName = string.Format("{0}.{1}", list[0].Label, item.ParamName);
                }
            }

            StringBuilder sb = DataModelEngine.BuildSelectSql(list[0], list[0].Relation, false, iscard, islist);
            return sb;

        }


        private static StringBuilder getModelTreeSelectSql(string modelID, Database Db)
        {
            //如果是有缓存 那么则从sql缓存处理
            var list = getModelObjects(modelID, false, Db);
            StringBuilder sb = DataModelEngine.BuildSelectSql(list[0], list[0].Relation, true);
            return sb;

        }
        #endregion


        #endregion


        /// <summary>
        /// 保存时替换sql的变量
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="dt"></param>
        /// <param name="db"></param>
        private static void formatSqlInfo(string sql, DataTable dt, Database db)
        {
            if (sql.IndexOf("@") != -1)
            {
                ArrayList arr = new ArrayList();
                var paramIndex = 0;
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    string columnname = dt.Columns[i].ColumnName;
                    if (sql.IndexOf("@" + columnname, StringComparison.OrdinalIgnoreCase) == -1)
                        continue;
                    sql = Regex.Replace(sql, "@" + columnname, "@" + paramIndex.ToString(), RegexOptions.IgnoreCase);
                    arr.Add(dt.Rows[0][columnname]);
                    paramIndex++;
                    //sql = sql.Replace("@" + columnname, string.Format(prop.SqlToken, columnname));

                }

                db.Execute(new Sql(sql, arr));
            }

        }




    }
}

