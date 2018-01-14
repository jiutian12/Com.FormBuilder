using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;
using System.Collections;
using System.Reflection;

namespace FormBuilder.Service
{
    public class AccountService
    {

        /// <summary>
        /// 验证登录成功
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public static bool checkLogin(string username, string password, out string mes, Database db)
        {
            mes = "";
            var sql = new Sql("select * from FBUserInfo  where usercode=@0 and userPwd=@1", username, password);
            var model = db.Fetch<FBUserInfo>(sql);
            if (model.Count <= 0)
            {
                mes = "用户名或密码不正确";
                return false;
            }
            else
            {
                LoginSucess(model[0]);//
                return true;
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="uid"></param>
        public static void LoginSucess(FBUserInfo user)
        {
            ISessionKey info = new ISessionKey();
            info.UserID = user.UID;
            info.UserName = user.UserName;
            info.UserCode = user.UserCode;
            info.CurDate = DateTime.Now.ToString("yyyy-MM-dd");
            SessionProvider.Provider.AddCurrent(info);
            // 写入cookie
        }

        public static void LogOut()
        {
            SessionProvider.Provider.EmptyCurrent();
        }

    }
}
