using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Utilities
{
    public class BaseSessionProvider : ISessionProvider
    {


        private string LoginUserKey = "FormBuilder";

        private string LoginTokenKey = "FormBuilderSid";
        public void AddCurrent(ISessionKey user)
        {
            // 登录成功写入cookie 写入JWTtoken？
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
                // 这里可以做线程缓存处理 ？这里需要check校验？ 分两步 第一步bulid 然后校验

                // Session build -StateCheck

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




        /// <summary>
        /// buildSession信息
        /// </summary>
        private void buildSession(string stateCookie)
        {
            var parts = stateCookie.Split('.');
            if (parts.Length != 3) throw new Exception("invalid Session Info!");
            var payload = parts[1];
            var payloadJson = Encoding.UTF8.GetString(Base64UrlDecode(payload));
            var session = Newtonsoft.Json.JsonConvert.DeserializeObject<ISessionKey>(payloadJson);

            //解析完成后存储在当前线程上下文


        }

        private static byte[] Base64UrlDecode(string input)
        {
            var output = input;
            output = output.Replace('-', '+'); // 62nd char of encoding  
            output = output.Replace('_', '/'); // 63rd char of encoding  
            switch (output.Length % 4) // Pad with trailing '='s  
            {
                case 0: break; // No pad chars in this case  
                case 2: output += "=="; break; // Two pad chars  
                case 3: output += "="; break; // One pad char  
                default: throw new System.Exception("Illegal base64url string!");
            }
            var converted = Convert.FromBase64String(output); // Standard base64 decoder  
            return converted;
        }

        public Database GetCurrentDataBase()
        {
            return new Database("DataPlatformDB");
        }
    }
}
