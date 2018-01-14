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
        public string UID { get; set; }

        public string UserCode { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }
        public string Telphone { get; set; }

        public string UserPwd { get; set; }

        public string UserSalt { get; set; }

        public string Note { get; set; }
        public string Avavtar { get; set; }
    }
}
