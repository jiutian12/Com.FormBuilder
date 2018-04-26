using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;
using FormBuilder.Repository;
using System.IO;
using FormBuilder.DataAccess.Interface;

namespace FormBuilder.Service
{

    public class FBLog
    {

        private static Database db;

        public static void SetDb(Database DB)
        {
            db = DB;
        }
        private static void Save(Model.FBLog model)
        {
            model.ID = Guid.NewGuid().ToString();
            model.OpUser = SessionProvider.Provider.Current().UserName;
            model.OpTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            db.Insert<Model.FBLog>(model);
        }

        public static void LogError(string errorInfo)
        {
            Save(new Model.FBLog { LogLevel = "1", LogInfo = errorInfo });
        }

        public static void LogDebug(string debugInfo)
        {
            Save(new Model.FBLog { LogLevel = "0", LogInfo = debugInfo });
        }

        public static void LogInfo(string logInfo)
        {
            Save(new Model.FBLog { LogLevel = "2", LogInfo = logInfo });
        }
    }
}
