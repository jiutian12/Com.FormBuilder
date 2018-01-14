using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBDataModel")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataModel
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
        /// DataSource数据源
        /// 
        /// </summary>
        public string DataSource { get; set; }
        /// <summary>
        /// MainObectID主对象信息
        /// 
        /// </summary>
        public string MainObectID { get; set; }
        /// <summary>
        /// PKCOL主键字段
        /// 
        /// </summary>
        public string PKCOL { get; set; }
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
        /// 启用缓存
        /// </summary>
        public string EnableCache { get; set; }

        /// <summary>
        /// 子表保存方式
        /// </summary>
        public string DetailSaveMode { get; set; }

        /// <summary>
        /// 对象列表
        /// </summary>
        [Ignore]
        public List<FBDataModelObjects> List { get; set; }




        [Ignore]
        public string parentID { get; set; }
    }
}
