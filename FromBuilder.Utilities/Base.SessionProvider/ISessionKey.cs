using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{
    public class ISessionKey
    {
        public string UserID { get; set; }
        public string UserCode { get; set; }

        public string UserName { get; set; }


        public string CompnayID { get; set; }

        public string CompanyCode { get; set; }

        public string CompanyName { get; set; }


        public string CurDate { get; set; }

        public string SecretKey { get; set; }
        public string Password { get; set; }

        public string DepartmentID { get; set; }

        public string IPAddress { get; set; }


        //其他信息后续扩展

    }
}
