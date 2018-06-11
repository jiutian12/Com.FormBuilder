using FormBuilder.Model;
using NPoco;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{


    /// <summary>
    /// 模型执行后sql定义
    /// </summary>

    public class DMSQL
    {
        public List<FBModelSQL> sqlList;
        public Database db;
        public Database ywdb;
        public DMSQL(string modelID, Database db, Database ywdb)
        {
            this.db = db;
            this.ywdb = ywdb;
            sqlList = getModelSQLlist(modelID);
        }
        public List<FBModelSQL> getModelSQLlist(string modelID)
        {
            return db.Fetch<FBModelSQL>(new Sql("select *from FBModelSQL where modelID=@0 and isUsed='1'", modelID));
        }


        public void ExecBeforeInsert(DataTable dt)
        {
            ActionSave(sqlList.Where(p => p.ActionType == "0").ToList(), dt);

        }
        public void ExecAfterInsert(DataTable dt)
        {
            ActionSave(sqlList.Where(p => p.ActionType == "1").ToList(), dt);
        }
        public void ExecBeforeSave(DataTable dt)
        {
            ActionSave(sqlList.Where(p => p.ActionType == "2").ToList(), dt);
        }
        public void ExecAfterSave(DataTable dt)
        {
            ActionSave(sqlList.Where(p => p.ActionType == "3").ToList(), dt);
        }

        public void ExecBeforeDelete(DataTable dt)
        {
            ActionSave(sqlList.Where(p => p.ActionType == "4").ToList(), dt);
        }
        public void ExecAfterDelete(DataTable dt)
        {
            ActionSave(sqlList.Where(p => p.ActionType == "5").ToList(), dt);
        }


        public void ActionSave(List<FBModelSQL> sqls, DataTable dt)
        {
            foreach (var item in sqls)
            {
                if (!string.IsNullOrEmpty(item.SQLInfo))
                {
                    var sql = dealSQL(item.SQLInfo, dt);
                    if (sql != null) ywdb.Execute(sql);//业务库执行sql
                }
            }
        }



        public string dealSqlSession(string sql)
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
        public Sql dealSQL(string sql, DataTable dt)
        {
            sql = dealSqlSession(sql);
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
                //{Session.UserID}
                //{Session.UserCode} 用户账号
                //{Session.UserName}
                //{Session.LoginDate}
                // 处理session 信息

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
    }
}
