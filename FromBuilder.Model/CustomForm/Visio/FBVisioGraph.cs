using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{

    /// <summary>
    /// 矢量图管理
    /// </summary>
    [TableName("FBVisioGraph")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBVisioGraph
    {
        /// <summary>
        /// ID主键
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// Code编号
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// Name名称
        /// </summary>
        public string Name { get; set; }


        /// <summary>
        /// 流程图类型
        /// </summary>
        public string GraphType { get; set; }

        /// <summary>
        /// 节点配置
        /// </summary>
        public string GraphConfig { get; set; }

        /// <summary>
        /// 流程图XML
        /// </summary>
        public string GraphXML { get; set; }

       

        /// <summary>
        /// CreateUser创建人
        /// 
        /// </summary>
        public string CreateUser { get; set; }
        /// <summary>
        /// CreateTime创建时间
        /// 
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        /// LastModifyUser最后修改人
        /// 
        /// </summary>
        public string LastModifyUser { get; set; }
        /// <summary>
        /// LastModifyTime最后修改时间
        /// 
        /// </summary>
        public string LastModifyTime { get; set; }

   
        public string Note { get; set; }

    }
}
