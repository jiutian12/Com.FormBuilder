using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.DataAccess
{
    public interface IDatabase
    {
        bool isInTransaction { get; set; }

        void BeginTrans();
        void Commit();
        void RollBack();

        void Close();

        int ExecuteBySql(StringBuilder strSql);
        int ExecuteBySql(StringBuilder strSql, DbParameter[] parameters);

        DataSet ExecuteDataSetBySql(string strSql);
        DataSet ExecuteDataSetBySql(string strSql, DbParameter[] parameters);

        #region 泛型 CURD操作

        int Insert<T>(T entity);
        int Insert<T>(T entity, DbTransaction isOpenTrans);
        int Insert<T>(List<T> entity);
        int Insert<T>(List<T> entity, DbTransaction isOpenTrans);
        int Insert(string tableName, Hashtable ht);
        int Insert(string tableName, Hashtable ht, DbTransaction isOpenTrans);

        int Update<T>(T entity);
        int Update<T>(T entity, DbTransaction isOpenTrans);
        int Update<T>(string propertyName, string propertyValue);
        int Update<T>(string propertyName, string propertyValue, DbTransaction isOpenTrans);
        int Update<T>(List<T> entity);
        int Update<T>(List<T> entity, DbTransaction isOpenTrans);
        int Update(string tableName, Hashtable ht, string propertyName);
        int Update(string tableName, Hashtable ht, string propertyName, DbTransaction isOpenTrans);

        int Delete<T>(T entity);
        int Delete<T>(T entity, DbTransaction isOpenTrans);
        int Delete<T>(object propertyValue);
        int Delete<T>(object propertyValue, DbTransaction isOpenTrans);
        int Delete<T>(string propertyName, string propertyValue);
        int Delete<T>(string propertyName, string propertyValue, DbTransaction isOpenTrans);
        int Delete(string tableName, string propertyName, string propertyValue);
        int Delete(string tableName, string propertyName, string propertyValue, DbTransaction isOpenTrans);
        int Delete(string tableName, Hashtable ht);
        int Delete(string tableName, Hashtable ht, DbTransaction isOpenTrans);
        int Delete<T>(object[] propertyValue);
        int Delete<T>(object[] propertyValue, DbTransaction isOpenTrans);
        int Delete<T>(string propertyName, object[] propertyValue);
        int Delete<T>(string propertyName, object[] propertyValue, DbTransaction isOpenTrans);
        int Delete(string tableName, string propertyName, object[] propertyValue);
        int Delete(string tableName, string propertyName, object[] propertyValue, DbTransaction isOpenTrans);
        #endregion

    }
}
