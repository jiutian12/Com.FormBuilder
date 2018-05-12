using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBCMPPara")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBCMPPara
    {

        /// <summary>
        /// ID主键
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 方法ID
        /// </summary>
        public string MethodID { get; set; }

        /// <summary>
        /// 构件ID
        /// </summary>
        public string CMPID { get; set; }
        /// <summary>
        /// 参数名称
        /// </summary>
        public string ParamName { get; set; }
        /// <summary>
        /// 参数类型 string dictionary DataSet
        /// </summary>
        public string ParamType { get; set; }
        /// <summary>
        /// 顺序
        /// </summary>
        public string Ord { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string Note { get; set; }

        



    }
}
