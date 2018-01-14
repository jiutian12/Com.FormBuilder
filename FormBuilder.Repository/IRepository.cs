using System;
using System.Collections.Generic;
using System.Data.Common;
using NPoco;
//这个是接口层
namespace FormBuilder.Repository
{


    public interface IRepository<TEntity> : IDisposable
    {


        void Add(TEntity entity);
        void Add(List<TEntity> entitys);
        TEntity GetBykey(object key);
        long GetCount(SqlBuilder.Template template);
        long GetCount(string sql, object[] parameters);
        bool IsExists(SqlBuilder.Template template);
        void Remove(TEntity entity);
        void Remove(SqlBuilder.Template template);
        void Remove(object key);
        void Remove(string where, object[] parameters);
        TEntity SingleById(object key);
        void Update(TEntity entity);
        void Update(TEntity entity, Snapshot<TEntity> snapshot);
        void Update(string sql, object[] parameters);


        List<T> Fetch<T>();
        List<T> Fetch<T>(Sql sql);
        List<T> Fetch<T>(string sql, params object[] args);
        List<T> Fetch<T>(long page, long itemsPerPage, Sql sql);
        List<T> Fetch<T>(long page, long itemsPerPage, string sql, params object[] args);


        Page<T> Page<T>(long curretnPage, long perPage, Sql sql);


        void BeginTransaction();
        void CompleteTransaction();
        void AbortTransaction();
    }
}