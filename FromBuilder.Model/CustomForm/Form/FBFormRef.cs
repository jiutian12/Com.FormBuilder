using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBFormRef")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBFormRef
    {
        /// <summary>
        /// ID
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 表单ID
        /// </summary>
        public string FormID { get; set; }
        /// <summary>
        ///模型ID
        /// </summary>
        public string ModelID { get; set; }
        /// <summary>
        /// 数据对象ID
        /// </summary>
        public string ObjectID { get; set; }
        /// <summary>
        /// 依赖的字段列表
        /// </summary>
        public string ColList { get; set; }

        /// <summary>
        /// 自定义数据源
        /// </summary>
        public string DSID { get; set; }

        /// <summary>
        /// 依赖类型 1 字段 2其他
        /// </summary>
        public string RefType { get; set; }

        /// <summary>
        ///  依赖值 暂时为空
        /// </summary>


        public string RefID { get; set; }
        public string RefValue { get; set; }

    }

}
