using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBCMPMethod")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBCMPMethod
    {

        /// <summary>
        /// ID主键
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 构件ID
        /// </summary>
        public string CMPID { get; set; }
        /// <summary>
        /// 方法名
        /// </summary>
        public string MethodName { get; set; }
        /// <summary>
        /// 返回值类型
        /// </summary>
        public string ReturnType { get; set; }

        public string Note { get; set; }

        [Ignore]
        public List<FBCMPPara> ParaList { get; set; }


    }
}
