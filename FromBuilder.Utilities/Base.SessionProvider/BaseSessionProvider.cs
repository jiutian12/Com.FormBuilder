using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{
    public class BaseSessionProvider : ISessionProvider
    {


        private string LoginUserKey = "FormBuilder";

        private string LoginTokenKey = "FormBuilderSid";
        public void AddCurrent(ISessionKey user)
        {
            // 登录成功写入cookie
            CookieHelper.WriteCookie(LoginUserKey, DESEncrypt.Encrypt(JsonConvert.SerializeObject(user)));

            CookieHelper.WriteCookie(LoginTokenKey, user.UserID);

            // 数据库的话记录   tokenid
        }


        public ISessionKey getDebugSession()
        {
            var session = new ISessionKey();
            session.UserID = "admin";
            session.UserCode = "admin";
            session.UserName = "管理员";
            session.IPAddress = "";
            return session;
        }
        public virtual ISessionKey Current()
        {
            try
            {
                ISessionKey user = new ISessionKey();
                user = JsonConvert.DeserializeObject<ISessionKey>(DESEncrypt.Decrypt(CookieHelper.GetCookie(LoginUserKey)));
                //if (user == null)
                //{
                //    return getDebugSession();
                //    //throw new Exception("登录信息超时，请重新登录。");
                //}
                return user;
            }
            catch
            {
                //return new ISessionKey();
                throw new Exception("登录信息超时，请重新登录。");
            }
        }

        public void EmptyCurrent()
        {
            // 如果是数据库记录则清空数据

            // 清除cookie
            CookieHelper.DelCookie(LoginUserKey);
        }



        /// <summary>
        /// 是否登录超时
        /// </summary>
        /// <returns></returns>
        public bool IsOverdue()
        {
            var session = Current();
            if (session == null)
                return true;
            else
                return false;
        }
    }
}
