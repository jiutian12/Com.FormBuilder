using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using NPoco;
using FormBuilder.Utilities;
using System.Collections;
using System.Text.RegularExpressions;
using FormBuilder.DataAccess;
using System.Reflection;

namespace FormBuilder.Service
{
    /// <summary>
    /// 用户自定义数据源通用类 包括获取数据 获取数据源结构信息
    /// </summary>
    public class DataSourceCom
    {


        #region  获取自定义数据源的列相关信息
        /// <summary>
        /// 获取自定义数据源的列相关信息
        /// </summary>
        /// <param name="frmID"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        public static List<FBDataSource> getFormDataSource(string frmID, Database db)
        {
            List<FBDataSource> list = new List<FBDataSource>();
            list = db.Fetch<FBDataSource>(@"select FBDataSource.* from FBFormDS 
                left join FBDataSource on FBFormDS.DSID = FBDataSource.ID where 1=1 and FBFormDS.FormID=@0", frmID);

            foreach (var item in list)
            {
                item.ColList = db.Fetch<FBDataSourceCols>(@"select * from FBDataSourceCols where DSID=@0", item.ID);
            }
            return list;
        }
        #endregion

        //public static List<FBDataSourceCols> getColList(string frmID, Database db)
        //{
        //    List<FBDataSourceCols> collits = new List<FBDataSourceCols>();
        //    List<FBDataSource> list = new List<FBDataSource>();
        //    list = db.Fetch<FBDataSource>(@"select FBDataSource.* from FBFormDS  where 1=1 and FBFormDS.FormID=@0", frmID);

        //    if (list.Count == 1)
        //    {
        //        var type = list[0].DsType;
        //        var sql = list[0].SqlInfo;
        //        List<dynamic> list1 = db.Fetch<dynamic>(new Sql(sql));

        //    }


        //    return collits;
        //}


        #region 获取自定义数据源基本模型
        public static FBDataSource getDSModel(string dsID, Database db)
        {
            try
            {
                FBDataSource model = new FBDataSource();
                model = db.Single<FBDataSource>(@"select FBDataSource.* from FBDataSource  where 1=1 and FBDataSource.ID=@0", dsID);

                if (model == null)
                {
                    throw new Exception(" DataSouceID is not found on the platform");
                }
                if (!string.IsNullOrEmpty(model.Tree))
                {
                    //获取树形结构
                    model.treeInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTreeStruct>(model.Tree);
                }
                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region 获取分页列表信息
        public static GridViewModel<dynamic> getDSPageList(string dsID, int currentPage, int perPage, string filter, string order, out long totalPages, out long totalItems, Database db)
        {

            FBDataSource model = getDSModel(dsID, db);
            Database ywDB = getModelDataSource(model.DsCode);

            var type = model.DsType;
            var sql = model.SqlInfo;
            if (string.IsNullOrEmpty(sql))
            {
                throw new Exception(" DataSource didn't define SqlString ");
            }


            // 过滤条件
            if (!string.IsNullOrEmpty(filter) && filter != "[]")
            {


                //StringBuilder sbfilter = new StringBuilder();
                List<Condition> filters = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Condition>>(filter);


                sql += string.Format(" {0} ", ConditionParser.Serialize(filters));
                //参数改造？
            }
            Page<dynamic> page = ywDB.Page<dynamic>(currentPage, perPage, sql);

            totalPages = page.TotalPages;

            totalItems = page.TotalItems;

            GridViewModel<dynamic> result = new GridViewModel<dynamic>();

            result.Rows = page.Items;
            result.TotalCount = totalItems;

            result.Total = totalItems;
            return result;

        }
        #endregion

        #region 获取异步记载数据源的节点数据（包含根节点）
        public static List<Dictionary<string, object>> getDSTreeData(string dsID, string level, string path, string parentID, string keyWord, string filter, string order, Database Db)
        {


            FBDataSource model = getDSModel(dsID, Db);

            Database ywDB = getModelDataSource(model.DsCode);

            var type = model.DsType;
            var sql = model.SqlInfo;
            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();

            // 获取树形取数的Sql信息
            StringBuilder sb = new StringBuilder();
            sb.Append(sql);

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
                sb.AppendFormat(" and {0}='{1}'", model.treeInfo.parentid, parentID);
            }
            else
            {
                if (string.IsNullOrEmpty(level))
                {
                    level = model.treeInfo.rootlevel;
                }
                else
                {
                    level = (Convert.ToInt32(level) + 1).ToString();
                }
                if (string.IsNullOrEmpty(path))
                {
                    sb.AppendFormat(" and {0}='{1}' ", model.treeInfo.level, level);
                }
                else
                {
                    sb.AppendFormat(" and  {0}='{1}' and {2} like '{3}%'", model.treeInfo.level, level, model.treeInfo.grade, path);
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
                string qrySql = string.Format(" and {0} like '{1}%'", model.treeInfo.treename, keyWord);
                var resultList = ywDB.Fetch<Dictionary<string, object>>(new Sql(sql).Append(new Sql(qrySql)));

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

        #region 获取树形数据源的所有节点数据
        public static List<Dictionary<string, object>> getDSTreeDataALL(string dsID, string keyWord, string filter, string order, Dictionary<string, object> formstate, Database Db)
        {

            FBDataSource model = getDSModel(dsID, Db);

            Database ywDB = getModelDataSource(model.DsCode);

            var type = model.DsType;
            var sql = model.SqlInfo;



            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();

            // 获取树形取数的Sql信息
            StringBuilder sb = new StringBuilder();
            sb.Append(sql);

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
            result = ywDB.Fetch<Dictionary<string, object>>(dealSQL(sb.ToString(), formstate));



            if (!string.IsNullOrEmpty(keyWord))
            {
                string qrySql = string.Format(" and  {0} like '{1}%'", model.treeInfo.treename, keyWord);
                var resultList = ywDB.Fetch<Dictionary<string, object>>(dealSQL(sbInit, formstate).Append(new Sql(qrySql)));

                foreach (var item in result)
                {
                    // 获取命中信息
                    var res = resultList.Where(p => p[model.treeInfo.grade].ToString().StartsWith(item[model.treeInfo.grade].ToString()));
                    if (res.ToList().Count > 0)
                    {
                        item["_istarget"] = "1";
                        item["isexpand"] = true;
                    }

                }

            }


            return result;
        }
        #endregion



        /// <summary>
        /// 处理sql业务
        /// </summary>
        /// <param name="sourceID"></param>
        /// <param name="frmID"></param>
        /// <param name="arr"></param>
        /// <param name="Db"></param>
        public static void execDataSource(string sourceID, string frmID, Dictionary<string, object> arr, Database Db)
        {
            FBDataSource model = getDSModel(sourceID, Db);

            Database ywDB = getModelDataSource(model.DsCode);
            var type = model.DsType;
            var sql = model.SqlInfo;
            if (model.IsUpdate == "1")
            {

                ywDB.Execute(dealSQL(model.SqlInfo, arr));
            }
        }


        private static Database getModelDataSource(string DataSource)
        {
            return DataBaseManger.GetDB(DataSource);
        }


        /// <summary>
        /// 反射后台的dll
        /// </summary>
        /// <param name="assInfo"></param>
        /// <param name="arr"></param>
        /// <param name="Db"></param>
        /// <returns></returns>
        public static string execAssLoader(string assInfo, Dictionary<string, object> arr, Database Db)
        {

            var className = "";
            var assemblyName = "";
            var methodInfo = "";
            Type t = Type.GetType(className + "," + assemblyName, false, true);
            var instance = Activator.CreateInstance(t);
            MethodInfo mi = t.GetMethod(methodInfo);
            //调用show方法 
            Object[] params_obj = new Object[1];
            params_obj[0] = arr;
            var result = mi.Invoke(instance, params_obj);
            return result.ToString();

        }

        private static Sql dealSQL(string sql, Dictionary<string, object> dict)
        {
            sql = dealSqlSession(sql);
            if (sql.IndexOf("@") != -1)
            {
                ArrayList arr = new ArrayList();
                var i = 0;
                foreach (var item in dict)
                {
                    string columnname = item.Key;
                    var sqlStrTmp = "#" + columnname;
                    if (sql.IndexOf(sqlStrTmp) != -1)
                        sql = sql.Replace("#" + columnname, item.Value.ToString());

                    if (sql.IndexOf("@" + columnname, StringComparison.OrdinalIgnoreCase) == -1)
                        continue;
                    sql = Regex.Replace(sql, "@" + columnname, "@" + i.ToString(), RegexOptions.IgnoreCase);
                  

                    arr.Add(item.Value);

                    i++;
                }


                object[] para = arr.ToArray();
                return new Sql(sql, para);
            }
            else if (!string.IsNullOrEmpty(sql))
            {
                return new Sql(sql);
            }
            else
            {
                return null;
            }
        }

        public static string dealSqlSession(string sql)
        {
            var session = SessionProvider.Provider.Current();
            sql = sql.Replace("{Session.UserID}", session.UserID);
            sql = sql.Replace("{Session.UserCode}", session.UserCode);
            sql = sql.Replace("{Session.UserName}", session.UserName);
            sql = sql.Replace("{Session.CurDate}", session.CurDate);
            sql = sql.Replace("{Session.Now}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            //应用服务器时间
            //其他信息
            return sql;
        }

    }
}
