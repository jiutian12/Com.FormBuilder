using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBModelSQL")]
    [PrimaryKey("ID", AutoIncrement = false)]

    public class FBModelSQL
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
        /// 执行SQL信息
        /// </summary>
        public string SQLInfo { get; set; }


        /// <summary>
        /// 执行时机
        /// 
        /// </summary>
        public string ActionType { get; set; }


        /// <summary>
        /// 说明提示
        /// </summary>
        public string Tips { get; set; }

        /// <summary>
        /// 是否启用
        /// </summary>
        public string IsUsed { get; set; }
    }


    /// <summary>
    /// 模型执行动作
    /// </summary>
    public enum ModelActionType
    {
        BeforeAdd = 0,
        AfterAdd = 1,
        BeforeSave = 2,
        AfterSave = 3,
        BeforeDelete = 4,
        AfterDelete = 5
    }
}
