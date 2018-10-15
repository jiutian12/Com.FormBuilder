using FormBuilder.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Core;
using FormBuilder.DataAccess;
using NPoco;

namespace FormBuilder.SessionProvider
{
    public class Session : ISessionProvider
    {
        public void AddCurrent(ISessionKey user)
        {
            // 创建服务器端令牌
            user.Token = StateChecker.CreateServerStateToken(user);
            // 写入cookie
            CookieHelper.WriteCookie(SYSConstants.LoginJWTKey, StateChecker.CreateJWTToken(user));

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
                    user = StateChecker.CheckAuthString(cookie);
                    // StateCheck 验证当前登录状态 todo

                    // Add Context
                    SetCallContextValue("FBState", user);
                }
                // 这里可以做线程缓存处理 ？这里需要check校验？ 分两步 第一步bulid 然后校验
                return user;
            }
            catch (Exception ex)
            {
                //return new ISessionKey();
                throw new Exception(ex.Message);
            }
        }


        public void EmptyCurrent()
        {
            ISessionKey user = GetCallContextValue("FBState") as ISessionKey;
            if (user != null)
            {
                StateChecker.RemoveOnlineUser(user);
            }

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
        /// 是否为有效的JWTtoken
        /// </summary>
        /// <returns></returns>
        public string IsAuthJWT()
        {
            try
            {
                var cookie = CookieHelper.GetCookie(SYSConstants.LoginJWTKey);
                StateChecker.CheckAuthString(cookie);
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }




        private static void SetCallContextValue(string key, object value) => CallContext.LogicalSetData(key, value);


        private static object GetCallContextValue(string key) => CallContext.LogicalGetData(key);

        public Database GetCurrentDataBase()
        {

            return new Database("DataPlatformDB");

        }
    }
}
