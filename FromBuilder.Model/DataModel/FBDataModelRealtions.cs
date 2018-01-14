using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBDataModelRealtions")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataModelRealtions
    {

        /// <summary>
        /// 主键主键
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// Model模型ID
        /// 
        /// </summary>
        public string ModelID { get; set; }
        /// <summary>
        /// ObjectID对象ID
        /// 
        /// </summary>
        public string ObjectID { get; set; }
        /// <summary>
        /// ObjectCode关联表名称
        /// 
        /// </summary>
        public string ObjectCode { get; set; }
        /// <summary>
        /// ObjectLabel关联标签
        /// 
        /// </summary>
        public string ObjectLabel { get; set; }
        /// <summary>
        /// IsMainObject是否主对象的关联
        /// 
        /// </summary>
        public string IsMainObject { get; set; }
        /// <summary>
        /// ModelObjectID所属对象ID
        /// 
        /// </summary>
        public string ModelObjectID { get; set; }
        /// <summary>
        /// ModlelObjectCol所属字段关联字段名
        /// 
        /// </summary>
        public string ModelObjectCol { get; set; }
        /// <summary>
        /// Filter关联条件
        /// 
        /// </summary>
        public string Filter { get; set; }
        /// <summary>
        /// FilterExt附加条件
        /// 
        /// </summary>
        public string FilterExt { get; set; }
        /// <summary>
        /// JoinType关联类型
        /// 
        /// </summary>
        public string JoinType { get; set; }


        /// <summary>
        /// 数据对象名称
        /// </summary>
        [Ignore]
        public string ObjectName { get; set; }


        /// <summary>
        /// 关联主表字段的编号
        /// </summary>
       
        public string ModelObjectColCode { get; set; }

        [Ignore]
        public List<FBDataModelCols> ColList { get; set; }
    }
}
