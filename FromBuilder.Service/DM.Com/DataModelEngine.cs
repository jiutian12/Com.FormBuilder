using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using NPoco;

namespace FormBuilder.Service
{
    public class DataModelEngine
    {
        private static ISQLStrategy _stratergy;

        public static void setStrategy(ISQLStrategy str)
        {
            _stratergy = str;
        }

        private static string getJoinType(string type)
        {
            string joinstr = "";
            switch (type)
            {
                case "0":
                    joinstr = " LEFT OUTER ";
                    break;
                case "3":
                    joinstr = " RIGHT OUTER ";
                    break;
                case "2":
                    joinstr = "  ";
                    break;
                default:
                    break;
            }
            return joinstr;
        }
        /// <summary>
        /// 创建查询语句
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static StringBuilder BuildSelectSql(FBDataModelObjects obj, List<FBDataModelRealtions> relationList, bool isTree = false, bool isCard = false, bool isList = false)
        {
            //List<FBDataModelRealtions> relationList = new List<FBDataModelRealtions>();//当前关联信息集合

            //relationList=DataModelCom.getModelRelations(obj.ModelID,obj.ID,db)
            StringBuilder sb = new StringBuilder();
            //拼接字段
            string aliasTableName = obj.Label;
            string tableName = obj.Code;//表名
            sb.Append(" SELECT ");
            var i = 1;
            foreach (FBDataModelCols col in obj.ColList)
            {
                if ((isCard && col.isCard == "0") || (isList && col.isList == "0"))
                {
                    //卡片模式但是 是否卡片没有勾选 或者 列表模式但是是否列表没有勾选
                    break;
                }
                //这里要处理mysql关键字 shit
                col.Label = _stratergy.ReplaceToken(col.Label);

                if (col.isRelated == "1")
                {
                    //关联字段的情况下
                    sb.AppendFormat(" {0}.{1} AS {2}", relationList.Find(p => p.ID == col.RelationID).ObjectLabel, col.Code, col.Label);
                }
                else if (col.isVirtual == "1")
                {
                    sb.AppendFormat("({0}) as {1}", col.VirtualExpress, col.Label);
                }
                else
                {
                    sb.AppendFormat(" {0}.{1} AS {2}", aliasTableName, col.Code, col.Label);
                }
                if (i != obj.ColList.Count)
                {
                    sb.Append(",");
                }
                i++;
            }

            if (isTree)
            {
                sb.Append(" , '0' as _istarget ");
            }
            sb.AppendFormat(" from {0} {1} ", tableName, aliasTableName);

            foreach (FBDataModelRealtions model in relationList.Where(p => p.ModelObjectID == obj.ID))
            {
                sb.AppendFormat("{0} JOIN {1} {2} ON {2}.{3}={4}.{5}",
                    getJoinType(model.JoinType),
                    model.ObjectCode,
                    model.ObjectLabel,
                    model.Filter,
                    aliasTableName,
                    model.ModelObjectColCode);
            }

            sb.Append(" where 1=1 ");
            // 这里应该加上模型本身的过滤条件\权限条件 todo

            return sb;
        }

        /// <summary>
        /// 创建新增语句
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static List<Sql> BuildInsertSql(FBDataModelObjects obj, DataSet ds)
        {

            //拼接字段
            string aliasTableName = obj.Label;
            string tableName = obj.Code;//表名
            List<Sql> sqlList = new List<Sql>();
            foreach (DataRow row in ds.Tables[obj.Code].Rows)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(" INSERT INTO {0} (", obj.Code);
                foreach (FBDataModelCols col in obj.ColList)
                {
                    if (col.isRelated != "1" && col.isUpdate == "1")
                    {
                        //关联字段的情况下
                        sb.AppendFormat("{0},", col.Code);
                    }
                }
                //这里是否可以缓存？
                sb.Remove(sb.Length - 1, 1);
                sb.Append(") VALUES (");
                int index = 0;
                // ArrayList paramvalues = new ArrayList();
                List<object> list = new List<object>();

                foreach (FBDataModelCols col in obj.ColList)
                {
                    if (col.isRelated != "1" && col.isUpdate == "1")
                    {
                        //关联字段的情况下
                        sb.AppendFormat("@{0},", index.ToString());
                        //paramvalues.Add(row[col.Code]);//记录字段值内容
                        list.Add(row[col.Code]);
                        index++;
                    }
                }
                //这里是否可以缓存？

                object[] para = list.ToArray();
                sb.Remove(sb.Length - 1, 1);
                sb.Append(")");
                Sql sql = new Sql(sb.ToString(), para);
                sqlList.Add(sql);
            }
            return sqlList;
        }

        /// <summary>
        /// 创建查询语句
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static Sql BuildUpdateSql(FBDataModelObjects obj, DataSet ds)
        {

            StringBuilder sb = new StringBuilder();
            //拼接字段
            string aliasTableName = obj.Label;
            string tableName = obj.Code;//表名
            sb.AppendFormat(" UPDATE {0} SET ", obj.Code);
            int index = 0;


            ArrayList paramvalues = new ArrayList();
            foreach (FBDataModelCols col in obj.ColList)
            {
                if (col.isRelated != "1" && col.isUpdate == "1" && col.isPrimary != "1")
                {
                    //关联字段的情况下
                    sb.AppendFormat("{0}=@{1},", col.Code, index.ToString());
                    paramvalues.Add(ds.Tables[0].Rows[0][col.Code]);//记录字段值内容
                    index++;
                }
            }
            sb.Remove(sb.Length - 1, 1);
            sb.AppendFormat(" where {0}=@{1}", obj.PKCOLName, index.ToString());
            paramvalues.Add(ds.Tables[0].Rows[0][obj.PKCOLName]);
            object[] para = new object[paramvalues.Count];
            for (int i = 0; i < para.Length; i++)
            {
                para[i] = paramvalues[i];
            }
            Sql sql = new Sql(sb.ToString(), para);
            return sql;
        }


        public static Sql BuildUpdateSql(FBDataModelObjects obj, DataRow row)
        {

            StringBuilder sb = new StringBuilder();
            //拼接字段
            string aliasTableName = obj.Label;
            string tableName = obj.Code;//表名
            sb.AppendFormat(" UPDATE {0} SET ", obj.Code);
            int index = 0;


            ArrayList paramvalues = new ArrayList();
            foreach (FBDataModelCols col in obj.ColList)
            {
                if (col.isRelated != "1" && col.isUpdate == "1" && col.isPrimary != "1")
                {
                    //关联字段的情况下
                    sb.AppendFormat("{0}=@{1},", col.Code, index.ToString());
                    paramvalues.Add(row[col.Code]);//记录字段值内容
                    index++;
                }
            }
            sb.Remove(sb.Length - 1, 1);
            sb.AppendFormat(" where {0}=@{1}", obj.PKCOLName, index.ToString());
            paramvalues.Add(row[obj.PKCOLName]);
            object[] para = new object[paramvalues.Count];
            for (int i = 0; i < para.Length; i++)
            {
                para[i] = paramvalues[i];
            }
            Sql sql = new Sql(sb.ToString(), para);
            return sql;
        }


        /// <summary>
        /// 按照主键删除主对象
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="dataid"></param>
        /// <returns></returns>
        public static Sql BuildDeleteSql(FBDataModelObjects obj, string dataid)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("delete from {0}  where 1=1 and {1}='{2}'", obj.Code, obj.Condition, dataid);//删除主表信息

            //拼接字段
            Sql sql = new Sql(sb.ToString());
            return sql;
        }
        public static Sql BuildDeleteDetailSql(string tablename, string pkcol, string detailDataID)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("delete from {0}  where 1=1 and {1}='{2}'", tablename, pkcol, detailDataID);//删除主表信息

            //拼接字段
            Sql sql = new Sql(sb.ToString());
            return sql;
        }

        public static Sql BuildDeleteMainSql(FBDataModelObjects obj, string dataid)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("delete from {0}  where 1=1 and {1}='{2}'", obj.Code, obj.PKCOLName, dataid);//删除主表信息

            //拼接字段
            Sql sql = new Sql(sb.ToString());
            return sql;
        }

        public static Sql BuildDeleteSql(FBDataModelObjects obj)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("delete from {0}  where 1=1  ", obj.Code);//删除主表信息

            //拼接字段
            Sql sql = new Sql(sb.ToString());
            return sql;
        }
    }
}
