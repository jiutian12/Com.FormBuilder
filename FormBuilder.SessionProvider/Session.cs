using FormBuilder.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Core;

namespace FormBuilder.SessionProvider
{
    public class Session : ISessionProvider
    {
        public void AddCurrent(ISessionKey user)
        {
            //// 登录成功写入cookie 写入JWTtoken？
            //CookieHelper.WriteCookie(LoginUserKey, DESEncrypt.Encrypt(JsonConvert.SerializeObject(user)));
            //CookieHelper.WriteCookie(LoginTokenKey, user.UserID);
            //// 数据库的话记录   tokenid
        }

        public virtual ISessionKey Current()
        {
            try
            {
                ISessionKey user = GetCallContextValue("FBState") as ISessionKey;
                if (user == null)
                {
                    if (user != null) return user;
                    user = new ISessionKey();
                    var cookie = CookieHelper.GetCookie(SYSConstants.LoginJWTKey);
                    // Session build 
                    user = buildSession(cookie);
                    // StateCheck 验证当前登录状态 todo

                    // Add Context
                    SetCallContextValue("FBState", user);
                }
                // 这里可以做线程缓存处理 ？这里需要check校验？ 分两步 第一步bulid 然后校验
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
            // 清除cookie
            SetCallContextValue("FBState", null);
            CookieHelper.DelCookie(SYSConstants.LoginJWTKey);
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
        /// 通过客户端cookie信息反序列化当前用户信息
        /// </summary>
        private ISessionKey buildSession(string stateCookie)
        {
            var parts = stateCookie.Split('.');
            if (parts.Length != 3) throw new Exception("invalid Session Info!");
            var payload = parts[1];
            var payloadJson = Encoding.UTF8.GetString(Base64UrlDecode(payload));
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ISessionKey>(payloadJson);
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



        private static void SetCallContextValue(string key, object value) => CallContext.LogicalSetData(key, value);


        private static object GetCallContextValue(string key) => CallContext.LogicalGetData(key);
    }
}
