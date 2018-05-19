using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBModelExtend")]
    [PrimaryKey("ID", AutoIncrement = false)]

    public class FBModelExtend
    {
        /// <summary>
        /// ID主键
        /// </summary>
        public string ID { get; set; }


        /// <summary>
        /// 数据模型ID
        /// </summary>
        public string ModelID { get; set; }


        /// <summary>
        /// 程序集
        /// </summary>
        public string Assembly { get; set; }


        /// <summary>
        /// 执行类名
        /// </summary>
        public string ClassName { get; set; }

        /// <summary>
        /// 是否启用
        /// </summary>
        public string IsUsed { get; set; }
    }



}
