using NetDimension.NanUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace FormBuilder.ExportTool
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            HtmlUILauncher.EnableFlashSupport = true;


            // Application.Run(new Main());

            if (HtmlUILauncher.InitializeChromium((args =>
            {
                args.Settings.LogSeverity = Chromium.CfxLogSeverity.Default;
            })))
            {
                //初始化成功，加载程序集内嵌的资源到运行时中
                HtmlUILauncher.RegisterEmbeddedScheme(System.Reflection.Assembly.GetExecutingAssembly(), domainName: "res.welcome.local");

                //启动主窗体
                Application.Run(new Main());
            }

        }
    }
}
