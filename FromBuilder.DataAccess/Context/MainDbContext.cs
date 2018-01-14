using System;
using FormBuilder.DataAccess.Interface;
using NPoco;

namespace FormBuilder.DataAccess
{
    /// <summary>
    /// DBContext实例化之后类
    /// </summary>
    public class MainDbContext : IDisposable, IMainDbContext
    {


        public Database Db { get; }

        public MainDbContext()
        {
            this.Db = new Database("DataPlatformDB");
        }

        public void Dispose()
        {
            this.Db.Dispose();
        }
    }
}
