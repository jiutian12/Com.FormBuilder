using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{
    public class ISessionKey
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public string UserID { get; set; }
        
        /// <summary>
        /// 用户编号
        /// </summary>
        public string UserCode { get; set; }

        /// <summary>
        /// 用户名称
        /// </summary>
        public string UserName { get; set; }


        /// <summary>
        /// 默认单位ID
        /// </summary>
        public string CompnayID { get; set; }

        /// <summary>
        /// 默认单位编号
        /// </summary>
        public string CompanyCode { get; set; }

        /// <summary>
        /// 默认单位名称
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// 登陆日期
        /// </summary>
        public string CurDate { get; set; }

        public string SecretKey { get; set; }
        public string Password { get; set; }


        /// <summary>
        /// 部门ID
        /// </summary>
        public string DepartmentID { get; set; }

        /// <summary>
        /// 登录IP
        /// </summary>
        public string IPAddress { get; set; }


        //其他信息后续扩展

    }
}
