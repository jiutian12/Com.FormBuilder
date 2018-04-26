using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;
using FormBuilder.Repository;
using FormBuilder.DataAccess.Interface;
using FormBuilder.DataAccess;

namespace FormBuilder.Service
{
    public class FBAccountService : Repository<FBAccountService>, IFBAccountService
    {
        #region ctr 
        public FBAccountService(IDbContext context) : base(context)
        {
            
        }
        #endregion

        public bool Login(string username, string password, out string mes)
        {
            mes = "";
            return AccountService.checkLogin(username, password, out mes, base.Db);
        }

        public void LogOut()
        {
            AccountService.LogOut();
        }
    }
}