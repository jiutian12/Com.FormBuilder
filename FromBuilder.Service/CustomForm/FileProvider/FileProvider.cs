using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Web;

namespace FormBuilder.Service
{
    public class FileProvider
    {
        private static IFBFileService _service { get; set; }
        static FileProvider()
        {
            try
            {
                FileInfo configFile = new FileInfo(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));
                var assemblyName = "";
                var className = "";
                XmlDocument xmlIAUConfig = new XmlDocument();
                xmlIAUConfig.Load(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));

                String path = @"//configuration/IocProvider/add[@key='file']";
                XmlNodeList xmlAdds = xmlIAUConfig.SelectNodes(path);

                if (xmlAdds.Count == 1)
                {
                    XmlElement xmlAdd = (XmlElement)xmlAdds[0];

                    assemblyName = xmlAdd.GetAttribute("assembly");
                    className = xmlAdd.GetAttribute("classname");

                    _service = (IFBFileService)Activator.CreateInstance(
                  Type.GetType(className + "," + assemblyName, false, true));
                }
                else
                {
                    throw new Exception("配置信息设置错误：键值为file 的元素不等于1");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        public static IFBFileService Provider
        {
            // 这里反射依赖注入
            get { return _service; }
        }

    }
}
