using System;
using System.Collections.Generic;
using System.Linq;
using FormBuilder.DataAccess.Interface;
using NPoco;

namespace FormBuilder.Repository
{

    public class Repository<TEntity> : IRepository<TEntity>
    {
        public Database Db { get; }

        /// <summary>
        /// 初始化的时候注入Db对象
        /// </summary>
        /// <param name="context"></param>
        public Repository(IDbContext context)
        {
            this.Db = context.Db;
        }

        public virtual void Add(TEntity entity)
        {
            if (entity == null) return;
            try
            {
                this.Db.Insert<TEntity>(entity);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public virtual void Save(TEntity entity)
        {
            if (entity == null) return;
            try
            {
                this.Db.Save<TEntity>(entity);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public virtual void Add(List<TEntity> entitys)
        {
            if (entitys == null || !entitys.Any()) return;
            this.Db.InsertBulk<TEntity>(entitys);
        }
        public virtual void Remove(Sql sql)
        {
            this.Db.Delete<TEntity>(sql);
        }
        public virtual void Remove(TEntity entity)
        {
            if (entity == null)
            {
                return;
            }
            this.Db.Delete<TEntity>(entity);
        }

        public virtual void Remove(object key)
        {
            this.Db.Delete<TEntity>(key);
        }

        public virtual void Remove(string where, object[] parameters)
        {
            this.Db.Delete<TEntity>(where, parameters);
        }


        public virtual void Remove(SqlBuilder.Template template)
        {
            if (template == null)
            {
                return;
            }
            this.Db.Execute(template);
        }

        public virtual void Update(TEntity entity, Snapshot<TEntity> snapshot)
        {
            if (entity != null)
            {
                this.Db.Update<TEntity>(entity, snapshot);
            }
        }

        public virtual void Update(TEntity entity)
        {
            if (entity != null)
            {
                this.Db.Update(entity);
            }
        }
        public virtual void Update(string sql, object[] parameters)
        {
            this.Db.Update<TEntity>(sql, parameters);
        }
        public virtual TEntity GetBykey(object key)
        {
            return this.Db.SingleById<TEntity>(key);
        }

        public virtual bool IsExists(SqlBuilder.Template template)
        {
            var result = false;
            var num = GetCount(template);
            if (num >= 1)
            {
                result = true;
            }
            return result;
        }

        public virtual long GetCount(SqlBuilder.Template template)
        {
            return this.Db.ExecuteScalar<long>(template);
        }
        public virtual long GetCount(string sql, object[] parameters)
        {
            return this.Db.ExecuteScalar<long>(sql, parameters);
        }

        public virtual TEntity SingleById(object key)
        {

            return key == null ? default(TEntity) : this.Db.SingleById<TEntity>(key);
        }


        public bool ExistsById(object key)
        {
            return this.Db.Exists<TEntity>(key);
        }
        public virtual void BeginTransaction()
        {
            this.Db.BeginTransaction();
        }


        public void Dispose()
        {
            this.Db.Dispose();
        }

        public void CompleteTransaction()
        {
            this.Db.CompleteTransaction();
        }

        public void AbortTransaction()
        {
            this.Db.AbortTransaction();
        }

        public List<T> Fetch<T>()
        {
            return this.Db.Fetch<T>();

        }



        public List<T> Fetch<T>(Sql sql)
        {
            return this.Db.Fetch<T>(sql);
        }

        public List<T> Fetch<T>(string sql, params object[] args)
        {
            return this.Db.Fetch<T>(sql, args);
        }

        public List<T> Fetch<T>(long page, long itemsPerPage, Sql sql)
        {
            return this.Db.Fetch<T>(page, itemsPerPage, sql);
        }

        public List<T> Fetch<T>(long page, long itemsPerPage, string sql, params object[] args)
        {
            return this.Db.Fetch<T>(page, itemsPerPage, sql, args);

        }

        /// <summary>
        /// 获取分页数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="curretnPage"></param>
        /// <param name="perPage"></param>
        /// <param name="sql"></param>
        /// <returns></returns>
        public Page<T> Page<T>(long curretnPage, long perPage, Sql sql)
        {
            return this.Db.Page<T>(curretnPage, perPage, sql);
        }
    }
}
