using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBMetaDependence")]
    [PrimaryKey("SourceID", AutoIncrement = false)]
    public class FBMetaDependence
    {

        /// <summary>
        /// 来源ID
        /// </summary>
        public string SourceID { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public string SourceType { get; set; }
        /// <summary>
        /// 依赖ID
        /// </summary>
        public string TargetID { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public string TargetType { get; set; }
         
    }

    public class JFBMetaDependence
    {

        /// <summary>
        /// 来源ID
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 依赖ID
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public string lx { get; set; }

    }

}
