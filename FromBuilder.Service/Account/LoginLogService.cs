using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Core;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;

namespace FormBuilder.Service
{
    public class LoginLogService
    {

        public static void AddLog(string mes, Database db)
        {
            FBLoginLog model = new FBLoginLog();
            model.ID = Guid.NewGuid().ToString();
            model.LoginTime = CommonHelper.GetDateTime();
            model.LoginIP = WebHelper.GetIP();
            model.LoginMachine = WebHelper.GetMachineName();
            model.LoginResult = mes;
            db.Save<FBLoginLog>(model);
        }
    }
}
