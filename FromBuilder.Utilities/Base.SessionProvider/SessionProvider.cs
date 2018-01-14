using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Ninject;
using System.IO;
using System.Xml;

namespace FormBuilder.Utilities
{
    public class SessionProvider
    {
        private static ISessionProvider _service { get; set; }
        static SessionProvider()
        {
            try
            {

                FileInfo configFile = new FileInfo(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));
                var assemblyName = "";
                var className = "";
                XmlDocument xmlIAUConfig = new XmlDocument();
                xmlIAUConfig.Load(HttpContext.Current.Server.MapPath("~/config/FormBuilder.config"));

                String path = @"//configuration/IocProvider/add[@key='session']";
                XmlNodeList xmlAdds = xmlIAUConfig.SelectNodes(path);

                if (xmlAdds.Count == 1)
                {
                    XmlElement xmlAdd = (XmlElement)xmlAdds[0];

                    assemblyName = xmlAdd.GetAttribute("assembly");
                    className = xmlAdd.GetAttribute("classname");

                    _service = (ISessionProvider)Activator.CreateInstance(
                  Type.GetType(className + "," + assemblyName, false, true));
                }
                else
                {
                    throw new Exception("配置信息设置错误：键值为session 的元素不等于1");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        public static ISessionProvider Provider
        {
            // 这里反射依赖注入
            get { return _service; }
        }



        //public void AddCurrent(ISessionKey user)
        //{
        //    throw new NotImplementedException();
        //}


        //public ISessionKey getDebugSession()
        //{
        //    var session = new ISessionKey();
        //    session.UserID = "admin";
        //    session.UserCode = "admin";
        //    session.UserName = "管理员";
        //    session.IPAddress = "";
        //    return session;
        //}
        //public virtual ISessionKey Current()
        //{
        //    try
        //    {
        //        ISessionKey user = new ISessionKey();
        //        user = JsonConvert.DeserializeObject<ISessionKey>(DESEncrypt.Decrypt(CookieHelper.GetCookie(LoginUserKey)));
        //        if (user == null)
        //        {


        //            return getDebugSession();
        //            //throw new Exception("登录信息超时，请重新登录。");
        //        }
        //        return user;
        //    }
        //    catch
        //    {
        //        //return new ISessionKey();
        //        throw new Exception("登录信息超时，请重新登录。");
        //    }
        //}

        //public void EmptyCurrent()
        //{
        //    HttpCookie objCookie = new HttpCookie(LoginUserKey.Trim());
        //    objCookie.Expires = DateTime.Now.AddYears(-5);
        //    HttpContext.Current.Response.Cookies.Add(objCookie);
        //}

        //public bool IsOverdue()
        //{
        //    object str = "";
        //    str = CookieHelper.GetCookie(LoginUserKey);
        //    if (str != null && str.ToString() != "")
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}
    }
}
