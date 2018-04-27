using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Chromium;
using NetDimension.NanUI;


namespace FormBuilder.ExportTool
{
    public partial class Main : HtmlUIForm
    {
        public Main() : base("http://res.welcome.local/www/index.html")
        {
            InitializeComponent();

            GlobalObject.Add("hostBridge", new JsCodeEditorObject(this));

            //ShowDevTools();
        }
    }
}
