﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Utilities;
using System.Web;
using Newtonsoft.Json;
using Com.CF.FrameworkCore.Context;

namespace FormBuilder.LBSessionProvider
{
    public class Session : ISessionProvider
    {
        public static ISessionProvider Provider
        {
            get { return new Session(); }
        }


        public void AddCurrent(ISessionKey user)
        {
            throw new NotImplementedException();

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

        public ISessionKey getLBFSession()
        {
            var session = new ISessionKey();
            session.UserID = LBFContext.Current.Session.UserId;
            session.UserCode = LBFContext.Current.Session.UserCode;
            session.UserName = LBFContext.Current.Session.UserCode;
            session.IPAddress = "";
            return session;

        }
        public virtual ISessionKey Current()
        {
            try
            {
                // 根据 url querysstring build一下
                ISessionKey user = new ISessionKey();
                user = getLBFSession();
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

        }

        public bool IsOverdue()
        {

            try
            {
                // 初始化构造菜单token
                Com.CF.WebFramework.Services.Impl.FrameworkExtService svr = new Com.CF.WebFramework.Services.Impl.FrameworkExtService();
                svr.InitOpenFunc();
                //
                var session = Current();
                if (session == null || string.IsNullOrEmpty(session.UserID))
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
