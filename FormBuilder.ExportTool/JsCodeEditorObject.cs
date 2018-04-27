using System.Linq;

using Chromium.Remote;
using NetDimension.NanUI.ChromiumCore;



namespace FormBuilder.ExportTool
{

    public class dbstr
    {

        public string dbtype { get; set; }
        public string ip { get; set; }
        public string catlog { get; set; }

        public string username { get; set; }
        public string password { get; set; }

    }

    public class meata
    {

        public string id { get; set; }
        public string pId { get; set; }

        public string mtype { get; set; }

        public string user { get; set; }

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
    }
}
