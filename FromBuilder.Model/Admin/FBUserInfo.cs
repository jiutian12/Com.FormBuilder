using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBUserInfo")]
    [PrimaryKey("UID", AutoIncrement = false)]
    public class FBUserInfo
    {
        public string UserID { get; set; }

        public string UserCode { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }
        public string Telphone { get; set; }

        public string UserPwd { get; set; }

        public string UserSalt { get; set; }

        public string Note { get; set; }
        public string Avavtar { get; set; }

        /// <summary>
        /// 用户状态 1正常0 锁定  master分支
        /// </summary>
        public string UserState { get; set; }
    }
}
