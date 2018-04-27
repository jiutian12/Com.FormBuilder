using System.Linq;

using Chromium.Remote;
using NetDimension.NanUI.ChromiumCore;
using NPoco;
using System.Collections.Generic;

namespace FormBuilder.ExportTool
{

    public class dbstr
    {

        public string dbtype { get; set; }
        public string ip { get; set; }
        public string catlog { get; set; }

        public string username { get; set; }
        public string password { get; set; }
        public string port { get; set; }

    }

    public class meata
    {

        public string id { get; set; }
        public string pId { get; set; }

        public string mtype { get; set; }

        public string createuser { get; set; }

        public string time { get; set; }

        public string name { get; set; }


    }
    class JsCodeEditorObject : JSObject
    {

        Main parentForm;

        internal JsCodeEditorObject(Main parentForm)
        {
            this.parentForm = parentForm;

            AddFunction("initDB").Execute += initDB;



        }

        private void initDB(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e)
        {
            parentForm.ShowDevTools();
            if (e.Arguments.Length > 0)
            {
                var str = e.Arguments[0].StringValue;
                var model = Newtonsoft.Json.JsonConvert.DeserializeObject<dbstr>(str);
                initDataBase(model);

                var sql = "select id as id,name as name,parentid as pid,type as mtype,createuser as createuser ,lastmodifytime as time from fbmetadata";

                List<meata> list = db.Fetch<meata>(sql);

                parentForm.ExecuteJavascript("JSBridge.load(" + Newtonsoft.Json.JsonConvert.SerializeObject(list) + ");");
            }
            //parentForm.ExecuteJavascript("JSBridge.load([]);");

        }


        private void beginExport(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e)
        {
            //导出元数据
            if (e.Arguments.Length > 0)
            {
                var str = e.Arguments.First(p => p.IsBool).StringValue;
            }

        }

        private Database db;

        private void initDataBase(dbstr model)
        {
            var dbType = DatabaseType.MySQL;
            string connectionStr = "Data Source={0};Initial Catalog={1};User ID={2};Password={3};";
            connectionStr = string.Format(connectionStr, model.ip, model.catlog, model.username, model.password);
            if (model.dbtype.ToUpper() == "MSS")
            {
                dbType = DatabaseType.SqlServer2008;
                connectionStr += "Persist Security Info = True;";
            }
            else if (model.dbtype.ToUpper() == "ORA")
            {
                dbType = DatabaseType.Oracle;
            }
            else if (model.dbtype.ToUpper() == "MYSQL")
            {
                connectionStr += "port=" + model.port + ";";
            }

            db = new Database(connectionStr, dbType);
        }
    }
}
