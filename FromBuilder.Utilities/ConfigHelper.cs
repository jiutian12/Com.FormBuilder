using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace FormBuilder.Utilities
{
    public class ConfigHelper
    {


        static ConfigHelper()
        {

        }

        /// <summary>
        /// 获取AppSettings方法
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string getAppSettings(string key)
        {
            XmlDocument xmlIAUConfig = new XmlDocument();

            xmlIAUConfig.Load(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));

            String path = @"//configuration/AppSettings/add[@key='" + key + "']";
            XmlNodeList xmlAdds = xmlIAUConfig.SelectNodes(path);
            if (xmlAdds.Count == 1)
            {
                XmlElement xmlAdd = (XmlElement)xmlAdds[0];

                return xmlAdd.GetAttribute("value");

            }
            else
            {
                return "";
            }
        }

        public static Hashtable getAppSettingsWeb()
        {
            XmlDocument xmlIAUConfig = new XmlDocument();
            Hashtable ht = new Hashtable();
            xmlIAUConfig.Load(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));
            string[] keys = { "DataIPIntranet", "DataIP", "FileIpIntranet", "FileIp" };
            foreach (var key in keys)
            {
                String path = @"//configuration/AppSettings/add[@key='" + key + "']";
                XmlNodeList xmlAdds = xmlIAUConfig.SelectNodes(path);
                if (xmlAdds.Count == 1)
                {
                    XmlElement xmlAdd = (XmlElement)xmlAdds[0];
                    ht.Add(key, xmlAdd.GetAttribute("value"));

                }

            }
            return ht;
        }
    }
}
