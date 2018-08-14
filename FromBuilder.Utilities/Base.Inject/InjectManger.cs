using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace FormBuilder.Utilities
{
    public class InjectManger
    {
        private static XmlNodeList nodelist;
        static InjectManger()
        {
            try
            {
                FileInfo configFile = new FileInfo(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));
                var assemblyName = "";
                var className = "";
                XmlDocument xmlIAUConfig = new XmlDocument();
                xmlIAUConfig.Load(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));
                 
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
