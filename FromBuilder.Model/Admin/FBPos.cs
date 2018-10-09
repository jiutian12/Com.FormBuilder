using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;


namespace FormBuilder.Model
{
    [TableName("FBPos")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBPos
    {
        /// <summary>
        /// 岗位ID
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 岗位编号
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 岗位名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 岗位类型 0 通用岗位 1.组织岗
        /// </summary>
        public string PosType { get; set; }
        /// <summary>
        /// 排序顺序
        /// </summary>
        public int Ord { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string Note { get; set; }
        /// <summary>
        /// 启用状态 0否1是
        /// </summary>

        public string State { get; set; }
        /// <summary>
        /// 关联组织ID
        /// </summary>
        public string OrgID { get; set; }

        /// <summary>
        /// 关联部门ID
        /// </summary>
        public string DepartID { get; set; }
    }
}
