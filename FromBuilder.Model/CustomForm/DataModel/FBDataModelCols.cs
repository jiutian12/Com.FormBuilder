using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBDataModelCols")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataModelCols
    {

        /// <summary>
        /// ID主键
        /// 
        /// </summary>
        public string ID { get; set; }



        /// <summary>
        /// ModelID模型ID
        /// 
        /// </summary>
        public string ModelID { get; set; }
        /// <summary>
        /// ModelObjectID子对象ID
        /// 
        /// </summary>
        public string ModelObjectID { get; set; }
        /// <summary>
        /// Code编号
        /// 
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// Label标签
        /// 
        /// </summary>
        public string Label { get; set; }
        /// <summary>
        /// Name名称
        /// 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// DataType类型
        /// 
        /// </summary>
        public string DataType { get; set; }
        /// <summary>
        /// Length长度
        /// 
        /// </summary>
        public string Length { get; set; }

        /// <summary>
        /// 精度
        /// </summary>
        public string Decimal { get; set; }
        /// <summary>
        /// isList是否列表
        /// 
        /// </summary>
        public string isList { get; set; }
        /// <summary>
        /// isCard是否卡片
        /// 
        /// </summary>
        public string isCard { get; set; }
        /// <summary>
        /// isReadOnly是否只读
        /// 
        /// </summary>
        public string isReadOnly { get; set; }
        /// <summary>
        /// isUpdate是否更新
        /// 
        /// </summary>
        public string isUpdate { get; set; }
        /// <summary>
        /// isVirtual是否虚字段
        /// 
        /// </summary>
        public string isVirtual { get; set; }
        /// <summary>
        /// VirtualExpress虚字段表达式
        /// 
        /// </summary>
        public string VirtualExpress { get; set; }
        /// <summary>
        /// ParentID父列
        /// 
        /// </summary>
        public string ParentID { get; set; }
        /// <summary>
        /// RelationID关联对象ID
        /// 
        /// </summary>
        public string RelationID { get; set; }
        /// <summary>
        /// isRelated是否关联字段
        /// 
        /// </summary>
        public string isRelated { get; set; }

        public string isPrimary { get; set; }


        public string Ord { get; set; }
    }
}
