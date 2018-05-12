using System.Collections.Generic;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBOrgInfo")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBOrgInfo
    {
        public string ID { get; set; }
        public string Code { get; set; }
        public string Path { get; set; }
        public string Layer { get; set; }
        public string IsDetail { get; set; }
        public string PID { get; set; }

        public string Name { get; set; }

        /// <summary>
        /// 1集团公司2.子公司3.部门
        /// </summary>
        public string OrgType { get; set; }

        public string Ord { get; set; }

        public string State { get; set; }

        public string Note { get; set; }

        /// <summary>
        /// 负责人
        /// </summary>
        public string AuthUser { get; set; }

        public string CreateUser { get; set; }
        public string CreateTime { get; set; }

        public string LastModifyUser { get; set; }

        public string LastModifyTime { get; set; }

    }
}
