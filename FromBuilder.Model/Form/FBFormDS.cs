using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBFormDS")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBFormDS
    {
        /// <summary>
        /// ID
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 表单ID
        /// 
        /// </summary>
        public string FormID { get; set; }
        /// <summary>
        /// 数据源ID
        /// 
        /// </summary>
        public string DSID { get; set; }
        /// <summary>
        /// 分组名称
        /// 
        /// </summary>
        public string GroupInfo { get; set; }
        /// <summary>
        /// 是否单独加载
        /// 
        /// </summary>
        public string SingleLoad { get; set; }

    }

}
