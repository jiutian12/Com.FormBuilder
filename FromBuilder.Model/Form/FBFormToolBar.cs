using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBFormToolBar")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBFormToolBar
    {

        /// <summary>
        /// IDID
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// FormID表单ID
        /// 
        /// </summary>
        public string FormID { get; set; }
        /// <summary>
        /// BarID工具条ID
        /// 
        /// </summary>
        public string BarID { get; set; }
        /// <summary>
        /// IsRoot是否为根目录【工具条】
        /// 0 工具项 1工具条
        /// </summary>
        public string IsRoot { get; set; }
        /// <summary>
        /// BarType类型
        /// 0.分隔条.1.按钮2.搜索框3.超链接4.下拉框5.多选框 
        /// </summary>
        public string BarType { get; set; }
        /// <summary>
        /// TypeOptions详细配置
        /// 
        /// </summary>
        public string TypeOptions { get; set; }
        /// <summary>
        /// Icon图标
        /// 
        /// </summary>
        public string Icon { get; set; }
        /// <summary>
        /// Func执行方法
        /// 
        /// </summary>
        public string Func { get; set; }
        /// <summary>
        /// ParentID父ID
        /// 
        /// </summary>
        public string ParentID { get; set; }
        /// <summary>
        /// Ord排序顺序
        /// 
        /// </summary>
        public string Ord { get; set; }
        /// <summary>
        /// IsUsed是否可用
        /// 
        /// </summary>
        public string IsUsed { get; set; }
        /// <summary>
        /// IsSys是否系统按钮
        /// 
        /// </summary>
        public string IsSys { get; set; }
        /// <summary>
        /// BizObject授权对象
        /// 
        /// </summary>
        public string BizObject { get; set; }
        /// <summary>
        /// Text工具项名称
        /// 
        /// </summary>
        public string Text { get; set; }
        /// <summary>
        /// IsFixed是否锁定
        /// 1.是0否
        /// </summary>
        public string IsFixed { get; set; }



        public string PropName { get; set; }

        /// <summary>
        /// 对齐方式 0靠左1.靠右
        /// </summary>
        public string Align { get; set; }


        /// <summary>
        /// 动作
        /// </summary>
        public string Action { get; set; }

        /// <summary>
        /// 按钮样式
        /// </summary>
        public string BtnStyle { get; set; }
    }

}
