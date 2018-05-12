using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBModelModifyCheck")]
    [PrimaryKey("ID", AutoIncrement = false)]

    public class FBModelModifyCheck
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
        /// 表名
        /// </summary>
        public string TableName { get; set; }


        /// <summary>
        /// 关联条件
        /// </summary>
        public string Filter { get; set; }

        
        /// <summary>
        /// 保存检查提示
        /// </summary>
        public string Tips { get; set; }

        public string IsUsed { get; set; }
    }
}
