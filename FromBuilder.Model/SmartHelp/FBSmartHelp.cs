using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBSmartHelp")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBSmartHelp
    {

        /// <summary>
        /// ID主键
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// Code编号
        /// 
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// Name名称
        /// 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Title标题
        /// 
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// ModelID模型id
        /// 
        /// </summary>
        public string ModelID { get; set; }
        /// <summary>
        /// Sort排序
        /// 
        /// </summary>
        public string Sort { get; set; }
        /// <summary>
        /// Filter过滤条件
        /// 
        /// </summary>
        public string Filter { get; set; }
        /// <summary>
        /// ViewType类型
        /// 1普通列表2 tree
        /// </summary>
        public string ViewType { get; set; }
        /// <summary>
        /// CreateTime创建时间
        /// 
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        /// CrateUser创建人
        /// 
        /// </summary>
        public string CreateUser { get; set; }
        /// <summary>
        /// LastModifyTime最后修改时间
        /// 
        /// </summary>
        public string LastModifyTime { get; set; }
        /// <summary>
        /// LastModifyUser最后修改人
        /// 
        /// </summary>
        public string LastModifyUser { get; set; }

        [Ignore]
        public List<FBSmartHelpCols> ColList { get; set; }

        [Ignore]
        public string parentID { get; set; }
    }
}
