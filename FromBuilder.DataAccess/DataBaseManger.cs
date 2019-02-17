using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using NPoco;
using FormBuilder.Utilities;
using System.IO;

namespace FormBuilder.DataAccess
{
    public class DataBaseManger
    {

        private static Dictionary<string, DataBaseCache> _dictDataBase = new Dictionary<string, DataBaseCache>();
        private static Database _mainDB;
        private static object lockObject = new object();

        static DataBaseManger()
        {
            lock (lockObject)//加锁，处理并发
            {
                _mainDB = new Database("DataPlatformDB");

                //_mainDB = SessionProvider.Provider.GetCurrentDataBase();
                initDBCache();
            }
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

            try
            {
                if (string.IsNullOrEmpty(code)) code = "defalutconnection";

                if (_dictDataBase.ContainsKey(code))
                {
                    return new Database(_dictDataBase[code].ConnectStr, _dictDataBase[code].DbType);
                }


                return new Database("DataPlatformDB");
            }
            catch (Exception ex) {
                WriteLog(ex.Message + ex.StackTrace);
                throw ex;
            }
            

        }

        public static void WriteLog(string logInfo)
        {

            string Prefix = "FBBuilder";
            string fileName = Prefix + DateTime.Now.ToString("yyyyMMdd") + ".txt";

            //using (StreamWriter writer = new StreamWriter(fileName))
            //{
            //    //1,写入文本
            //    writer.Write(str);
            //}
            ////2,追加文本
            StreamWriter sw = System.IO.File.AppendText(fileName);
            sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + logInfo);//自动换行
            sw.Close();
        }


    }

    public class DataBaseCache
    {
        public string ConnectStr { get; set; }
        public DatabaseType DbType { get; set; }
    }
}
