using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Core;
using FormBuilder.Utilities;
using FormBuilder.DataAccess;
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
                // 用户状态
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

            info.Token = CreateServerStateToken(info);
            // 生成token 更新在线用户列表


            // 这里自己写入即可？不需要做分支？JWTtoken？
            SessionProvider.Provider.AddCurrent(info);
            // 写入cookie
            CookieHelper.WriteCookie(SYSConstants.LoginJWTKey, CreateJWTToken(info));

            // 更新token 在线用户


            // 记录登陆日志
        }


        public static string CreateJWTToken(ISessionKey info)
        {
            return JsonWebToken.Encode(info, "XB#4%", JwtHashAlgorithm.RS256);
        }


        public static string CreateServerStateToken(ISessionKey info)
        {
            Database db = DataBaseManger.GetDB("");
            var token = Guid.NewGuid().ToString();
            // 这里要预留出pc端登陆的接口
            var clearSql = new Sql("delete from FBOnlineUser where uid=@0 and DeviceType='PC'", info.UserID);
            db.Execute(clearSql);
            var sql = new Sql("insert into FBOnlineUser(ID,UID,LoginIP,LoginMachine,State,CreateTime,UserToken,DeviceType) values(@0,@1,@2,@3,@4,@5,@0,@6)", 
                token, info.UserID, info.IPAddress, "", "1", DateTime.Now.ToString(),"PC");
            db.Execute(sql);
            return token;
        }
        public static void LogOut()
        {
            SessionProvider.Provider.EmptyCurrent();
        }

    }
}
