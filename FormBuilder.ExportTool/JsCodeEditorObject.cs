using System.Linq;

using Chromium.Remote;
using NetDimension.NanUI.ChromiumCore;
using NPoco;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using System.Threading;
using System.Windows.Forms;
using System.Text;

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


        private Database db;

        internal JsCodeEditorObject(Main parentForm)
        {
            this.parentForm = parentForm;

            AddFunction("initDB").Execute += initDB;

            AddFunction("begin").Execute += beginExport;

        }


        #region 初始化数据库
        private void initDB(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e)
        {
            parentForm.ShowDevTools();
            if (e.Arguments.Length > 0)
            {
                var str = e.Arguments[0].StringValue;
                var model = Newtonsoft.Json.JsonConvert.DeserializeObject<dbstr>(str);
                initDataBase(model);

                //var sql = "select id as id,name as name,parentid as pid,type as mtype,createuser as createuser ,lastmodifytime as time from fbmetadata";

                //List<meata> list = db.Fetch<meata>(sql);



                //parentForm.ExecuteJavascript("JSBridge.load(" + Newtonsoft.Json.JsonConvert.SerializeObject(list) + ");");


                Action action = new Action(loadMetaData);

                //新建一个Task
                Task t1 = new Task(action);
                t1.Start();
            }
            //parentForm.ExecuteJavascript("JSBridge.load([]);");

        }


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
        public void loadMetaData()
        {
            MyDelegate md = new MyDelegate(ExecScript);
            var sql = "select id as id,name as name,parentid as pid,type as mtype,createuser as createuser ,lastmodifytime as time from fbmetadata";

            List<meata> list = db.Fetch<meata>(sql);

            parentForm.BeginInvoke(md, "JSBridge.load(" + Newtonsoft.Json.JsonConvert.SerializeObject(list) + ");");

        }


        #endregion

        public delegate void MyDelegate(string s);

        public void ExecScript(string str)
        {
            parentForm.ExecuteJavascript(str);
        }
        public void AppendLog(string log)
        {
            parentForm.ExecuteJavascript("JSBridge.append('" + log + "');");
        }


        private void beginExport(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e)
        {
            //导出元数据
            if (e.Arguments.Length > 0)
            {
                var str = e.Arguments[0].StringValue;
                List<meata> list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<meata>>(str);

                Task.Factory.StartNew(StartExport, list);

            }

        }

        public void StartExport(Object obj)
        {
            List<meata> list = (List<meata>)obj;
            MyDelegate inv = new MyDelegate(AppendLog);
            MyDelegate exec = new MyDelegate(ExecScript);
            MyDelegate save = new MyDelegate(SaveFile);
            var len = 0;
            foreach (var item in list)
            {
                len++;
                parentForm.BeginInvoke(inv, "开始导出:" + item.name);
                var progress = len * 100 / list.Count;
                parentForm.BeginInvoke(exec, "JSBridge.progress(" + progress.ToString() + ")");


                Thread.Sleep(200);

            }


            parentForm.BeginInvoke(exec, "JSBridge.done()");

            parentForm.BeginInvoke(save, "sadfsadf");

        }

        public void SaveFile(string str)
        {
            var currentFilePath = "";
            var result = false;
            var saveFileDialog = new SaveFileDialog()
            {
                AddExtension = true,
                Filter = "支持的文件|*.sql",
                OverwritePrompt = true,
                FileName = DateTime.Now.ToString("yyyyMMdd-HHmmss")
            };
            if (saveFileDialog.ShowDialog(parentForm) == DialogResult.OK)
            {
                currentFilePath = saveFileDialog.FileName;
                result = true;

            }

            if (result)
            {
                System.IO.File.WriteAllText(currentFilePath, str, Encoding.UTF8);

            }
        }
    }
}
