﻿using System;
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
            //password = DESEncrypt.Encrypt(password);
            var sql = new Sql("select * from FBUserInfo where usercode=@0 and userPwd=@1", username, password);
            var model = db.Fetch<FBUserInfo>(sql);
            if (model.Count <= 0)
            {
                // 用户状态
                mes = "用户名或密码不正确";
                LoginLogService.AddLog(username + "登录失败：" + mes, db);
                return false;
            }
            else
            {

                var usermodel = model[0];

                if (usermodel.UserState == "0")
                {
                    mes = "用户已经被锁定，无法登录";
                    LoginLogService.AddLog(usermodel.UserCode + usermodel.UserName + "登录失败：" + mes, db);
                    return false;
                }

                LoginSucess(usermodel);//
                LoginLogService.AddLog(usermodel.UserCode + usermodel.UserName + "登录成功", db);
                return true;
            }
            //记录登录失败or成功日志

        }

        public static bool changePassWord(string uid, string password, out string mes, Database db)
        {

            //如果是自己的用户
            //如果是自己管理范围的用户

            mes = "修改成功";
            //password = DESEncrypt.Encrypt(password);
            var sql = new Sql("update FBUserInfo  set UserPwd=@0 where  UserId=@1", password, uid);
            db.Execute(sql);
            return true;
        }




        public static void LockUser(string uid, Database db)
        {
            var sql = new Sql("update FBUserInfo  set State=@0 where  UserID=@1", "0", uid);
            db.Execute(sql);
        }

        public static void UnLockUser(string uid, Database db)
        {
            var sql = new Sql("update FBUserInfo  set State=@0 where  UserID=@1", "1", uid);
            db.Execute(sql);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="uid"></param>
        public static void LoginSucess(FBUserInfo user)
        {
            ISessionKey info = new ISessionKey();
            info.UserID = user.UserID;
            info.UserName = user.UserName;
            info.UserCode = user.UserCode;
            info.CurDate = DateTime.Now.ToString("yyyy-MM-dd");
            info.IPAddress = WebHelper.GetIP();

            //info.Token = CreateServerStateToken(info);
            // 生成token 更新在线用户列表
            // 这里自己写入即可？不需要做分支？JWTtoken？
            SessionProvider.Provider.AddCurrent(info);
            // 写入cookie
            //CookieHelper.WriteCookie(SYSConstants.LoginJWTKey, CreateJWTToken(info));

            // 更新token 在线用户


            // 记录登陆日志
        }



        public static void LogOut(Database db)
        {
            var usermodel = SessionProvider.Provider.Current();
            LoginLogService.AddLog(usermodel.UserCode + usermodel.UserName + "注销登录", db);
            SessionProvider.Provider.EmptyCurrent();
        }
        public static void OfflineUser(string uid, Database db)
        {
            var usermodel = SessionProvider.Provider.Current();
            LoginLogService.AddLog($"管理员{usermodel.UserName}注销登录", db);
            SessionProvider.Provider.EmptyUser(uid);
        }


    }
}
