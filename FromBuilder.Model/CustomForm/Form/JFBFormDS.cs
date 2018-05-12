using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    public class JFBFormDS
    {

        /// <summary>
        /// 主键 数据源id/模型id
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 数据源id 模型的时候则是objectid 
        /// 语义对象的时候为空
        /// </summary>
        public string dataid { get; set; }

        public string name { get; set; }
        public string modelid { get; set; }

        /// <summary>
        /// 是否表单绑定模型
        /// </summary>
        public bool issys { get; set; }
        public bool ismain { get; set; }
        public string text { get; set; }

        public List<JFBFormDSFields> columns { get; set; }
    }

    public class JFBFormDSFields
    {
        public string id { get; set; }
        public string fieldid { get; set; }
        public string text { get; set; }
        public string type { get; set; }

        public bool isrelated { get; set; }
    }
}
