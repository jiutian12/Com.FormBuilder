using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using NPoco;

namespace FormBuilder.DataAccess
{
    public class DataBaseManger
    {

        private static Dictionary<string, DataBaseCache> _dictDataBase = new Dictionary<string, DataBaseCache>();
        private static Database _mainDB;

        static DataBaseManger()
        {
            _mainDB = new Database("DataPlatformDB");
            initDBCache();
        }

        private static void initDBCache()
        {
            var sql = new Sql("select Code,Catalog,DBType,Name,IPAddress,UserName,PassWord,PortInfo from FBDBSetting where IsUsed='1'");
            List<Dictionary<string, object>> list = _mainDB.Fetch<Dictionary<string, object>>(sql);

            foreach (var item in list)
            {
                try
                {
                    DatabaseType dbType = DatabaseType.MySQL;

                    string connectionStr = "Data Source={0};Initial Catalog={1};User ID={2};Password={3};";
                    connectionStr = string.Format(connectionStr, item["IPAddress"].ToString(), item["Catalog"].ToString(), item["UserName"].ToString(), item["PassWord"].ToString());
                    if (item["DBType"].ToString().ToUpper() == "MSS")
                    {
                        dbType = DatabaseType.SqlServer2008;
                        connectionStr += "Persist Security Info = True;";
                    }
                    else if (item["DBType"].ToString().ToUpper() == "ORA")
                    {
                        dbType = DatabaseType.Oracle;
                    }
                    else if (item["DBType"].ToString().ToUpper() == "MYSQL")
                    {
                        connectionStr += "port=" + item["PortInfo"].ToString() + ";";
                    }
                    _dictDataBase[item["Code"].ToString()] = new DataBaseCache { ConnectStr = connectionStr, DbType = dbType };
                }
                catch (Exception ex)
                {
                    //记录异常日志   
                }
            }
            //去数据库读取并缓存
        }




        /// <summary>
        /// 获取上下文数据信息
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static Database GetDB(string code)
        {
            if (string.IsNullOrEmpty(code)) code = "defalutconnection";

            if (_dictDataBase.ContainsKey(code))
            {
                return new Database(_dictDataBase[code].ConnectStr, _dictDataBase[code].DbType);
            }

            return new Database("DataPlatformDB");
        }


    }

    public class DataBaseCache
    {
        public string ConnectStr { get; set; }
        public DatabaseType DbType { get; set; }
    }
}
