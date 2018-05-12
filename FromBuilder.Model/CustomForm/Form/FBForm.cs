using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBForm")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBForm
    {

        /// <summary>
        /// ID表单ID
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
        /// Type类型
        /// 
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// ModelID模型ID
        /// 
        /// </summary>
        public string ModelID { get; set; }

        [Ignore]
        public string ModelName { get; set; }

        /// <summary>
        /// BaseController基类控制器
        /// 
        /// </summary>
        public string BaseController { get; set; }
        /// <summary>
        /// Theme主题
        /// 
        /// </summary>
        public string Theme { get; set; }
        /// <summary>
        /// CodeEngine代码引擎
        /// 
        /// </summary>
        public string CodeEngine { get; set; }
        /// <summary>
        /// ConfigInfo表单属性配置
        /// 
        /// </summary>
        public string Config { get; set; }
        /// <summary>
        /// HtmlInfoHTML代码
        /// 
        /// </summary>
        public string HtmlInfo { get; set; }
        /// <summary>
        /// JSInfoJavaScript代码
        /// 
        /// </summary>
        public string JSInfo { get; set; }
        /// <summary>
        /// CSSInfo自定义样式
        /// 
        /// </summary>
        public string CSSInfo { get; set; }
        /// <summary>
        /// LayoutConfig布局属性
        /// 
        /// </summary>
        public string LayoutConfig { get; set; }
        /// <summary>
        /// PageLayout //区域布局关联信息
        /// 
        /// </summary>
        /// 
        public string PageLayout { get; set; }
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


        /// <summary>
        /// 默认值设置
        /// </summary>
        public string DefaultInfo { get; set; }

        [Ignore]
        /// <summary>
        /// 工具栏配置信息
        /// </summary>
        public string ToolBarConfig { get; set; }


        [Ignore]
        /// <summary>
        /// 工具栏配置信息
        /// </summary>
        public string SchemaInfo { get; set; }

        /// <summary>
        /// 表单状态机
        /// </summary>
        public string FSMID { get; set; }

        [Ignore]
        public List<string> dplist { get; set; }


        [Ignore]
        public string parentID { get; set; }

        public string UserJS { get; set; }


        public string Note { get; set; }
        [Ignore]
        public  string dsSchema { get; set; }

        /// <summary>
        /// 计算表达式信息
        /// </summary>
        public string ExpressInfo { get; set; }
    }

}
