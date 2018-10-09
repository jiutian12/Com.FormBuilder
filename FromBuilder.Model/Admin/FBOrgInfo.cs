using System.Collections.Generic;
using NPoco;

namespace FormBuilder.Model
{


    /// <summary>
    /// 系统组织表
    /// </summary>
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

        /// <summary>
        /// 排序
        /// </summary>
        public string Ord { get; set; }

        /// <summary>
        /// 启用状态
        /// </summary>
        public string State { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// 负责人
        /// </summary>
        public string AuthUser { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public string CreateUser { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public string CreateTime { get; set; }

        /// <summary>
        /// 最后修改人
        /// </summary>
        public string LastModifyUser { get; set; }

        /// <summary>
        /// 最后修改时间
        /// </summary>
        public string LastModifyTime { get; set; }

    }
}
