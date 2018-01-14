using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{
    /// <summary>
    /// 数据对象模型
    /// </summary>
    [TableName("FBDataObject")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataObject
    {

        /// <summary>
        /// IDID
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// Code编号
        /// 
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// TableName表名
        /// 
        /// </summary>
        public string TableName { get; set; }
        /// <summary>
        /// AiasName名称
        /// 
        /// </summary>
        public string AiasName { get; set; }
        /// <summary>
        /// DataSource数据源链接
        /// 
        /// </summary>
        public string DataSource { get; set; }
        /// <summary>
        /// Note备注
        /// 
        /// </summary>
        public string Note { get; set; }
        /// <summary>
        /// CreateUser创建人
        /// 
        /// </summary>
        public string CreateUser { get; set; }
        /// <summary>
        /// CreateTime创建时间
        /// 
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        /// LastModifyUser最后修改人
        /// 
        /// </summary>
        public string LastModifyUser { get; set; }
        /// <summary>
        /// LastModifyTime最后修改时间
        /// 
        /// </summary>
        public string LastModifyTime { get; set; }


        [Ignore]
        public List<FBDataObjectCols> ColList { get; set; }

        [Ignore]
        public string ParentID { get; set; }

    }
}
