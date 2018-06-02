using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{

    /// <summary>
    /// 智能帮助模型信息
    /// </summary>
    public class JFBSmartHelp
    {
        public string id { get; set; }
        public string type { get; set; }

        /// <summary>
        /// 是否分页
        /// </summary>
        public bool page { get; set; }


        /// <summary>
        /// 只选明细
        /// </summary>
        public bool childOnly { get; set; }

        /// <summary>
        /// 是否收藏
        /// </summary>
        public bool favor { get; set; }
        /// <summary>
        /// 数据模型ID
        /// </summary>
        public string modelID { get; set; }


        public string filter { get; set; }
        /// <summary>
        /// 主键列
        /// </summary>
        public string pkCol { get; set; }

        public string title { get; set; }


        public string pageSize { get; set; }
        public string pageOption { get; set; }
        /// <summary>
        /// 模型的分级结构
        /// </summary>
        public JFBTreeStruct treeInfo { get; set; }

        public List<JFBSmartHelpCols> ColList { get; set; }

    }


    public class JFBSmartHelpCols
    {
        public string code { get; set; }
        public string name { get; set; }
        public string width { get; set; }

        public string align { get; set; }

        public string dataType { get; set; }


        public string visible { get; set; }
    }
}
