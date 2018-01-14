using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBComponent")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBComponent
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
        /// Name数据模型名称
        /// 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 程序集
        /// </summary>
        public string AssemblyName { get; set; }
        /// <summary>
        /// 类名
        /// </summary>
        public string ClassName { get; set; }
        /// <summary>
        /// 是否静态类
        /// </summary>
        public string IsStatic { get; set; }

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


        /// <summary>
        /// 备注
        /// </summary>
        public string Note { get; set; }

        [Ignore]
        public List<FBCMPMethod> MethodList { get; set; }
        [Ignore]
        public string parentID { get; set; }

    }
}
