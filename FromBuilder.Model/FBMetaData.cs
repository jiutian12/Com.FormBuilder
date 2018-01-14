using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{
    [TableName("FBMetaData")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBMetaData
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
        /// Type类型
        /// 
        /// </summary>
        public string Type { get; set; }


        [NPoco.ResultColumn]
        public string MetaType { get; set; }
        /// <summary>
        /// CreateTime创建时间
        /// 
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        /// CreateUser创建人
        /// 
        /// </summary>
        public string CreateUser { get; set; }
        /// <summary>
        /// LsatModifyTime修改时间
        /// 
        /// </summary>
        public string LastModifyTime { get; set; }
        /// <summary>
        /// LastModifyUser修改人
        /// 
        /// </summary>
        public string LastModifyUser { get; set; }
        /// <summary>
        /// State元数据状态
        /// 
        /// </summary>
        public string State { get; set; }


        public string ParentID { get; set; }
        public string IsFolder { get; set; }


        public string UserID { get; set; }

    }

}
