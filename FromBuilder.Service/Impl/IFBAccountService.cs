using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Utilities;
using System.IO;
using FormBuilder.Model;

namespace FormBuilder.Service
{

    public interface IFBAccountService : IDisposable
    {
        bool ChangePassWord(string uid, string password, out string mes);

        bool Login(string username, string password, out string mes);


        void LogOut();
        bool LockUser(string uid);


        bool UnLockUser(string uid);
    }
}
