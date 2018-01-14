using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBModelDeleteCheck")]
    [PrimaryKey("ID", AutoIncrement = false)]

    public class FBModelDeleteCheck
    {
        /// <summary>
        /// ID主键
        /// 
        /// </summary>
        public string ID { get; set; }


        /// <summary>
        /// 数据模型ID
        /// 
        /// </summary>
        public string ModelID { get; set; }

        /// <summary>
        /// 数据对象ID
        /// 
        /// </summary>
        public string ObjectID { get; set; }


        /// <summary>
        /// 关联ID
        /// </summary>
        public string RelationID { get; set; }


        /// <summary>
        /// 表名
        /// </summary>
        public string TableName { get; set; }


        /// <summary>
        /// 关联条件
        /// </summary>
        public string RefFilter { get; set; }


        /// <summary>
        /// 扩展条件
        /// </summary>
        public string ExtendFilter { get; set; }

        /// <summary>
        /// 删除提示
        /// </summary>
        public string DeleteTip { get; set; }


        public string IsUsed { get; set; }
    }
}
