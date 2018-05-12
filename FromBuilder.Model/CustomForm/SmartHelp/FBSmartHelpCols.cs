using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBSmartHelpCols")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBSmartHelpCols
    {

        /// <summary>
        /// ID主键
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// HelpID帮助ID
        /// 
        /// </summary>
        public string HelpID { get; set; }
        /// <summary>
        /// ColName名称
        /// 
        /// </summary>
        public string ColName { get; set; }
        /// <summary>
        /// ColCode编号
        /// 
        /// </summary>
        public string ColCode { get; set; }
        /// <summary>
        /// Level级别
        /// 
        /// </summary>
        public string Level { get; set; }
        /// <summary>
        /// Path分级码
        /// 
        /// </summary>
        public string Path { get; set; }
        /// <summary>
        /// isDetail是否明细
        /// 
        /// </summary>
        public string isDetail { get; set; }
        /// <summary>
        /// ParentID父ID
        /// 
        /// </summary>
        public string ParentID { get; set; }
        /// <summary>
        /// Align对齐方式
        /// 
        /// </summary>
        public string Align { get; set; }
        /// <summary>
        /// Width宽度
        /// 
        /// </summary>
        public string Width { get; set; }
        /// <summary>
        /// Format格式化参数
        /// 
        /// </summary>
        public string Format { get; set; }
        /// <summary>
        /// Render自定义渲染
        /// 
        /// </summary>
        public string Render { get; set; }
        /// <summary>
        /// Ord排序顺序
        /// 
        /// </summary>
        public string Ord { get; set; }



        public string Visible { get; set; }
    }
}
