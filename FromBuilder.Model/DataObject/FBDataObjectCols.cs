using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    /// <summary>
    /// 数据模型列相关信息
    /// </summary>
    [TableName("FBDataObjectCols")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataObjectCols
    {

        /// <summary>
        /// ID主键
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// ObjectID数据对象ID
        /// 
        /// </summary>
        public string ObjectID { get; set; }
        /// <summary>
        /// Code字段编号
        /// 
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// Name名称
        /// 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// DataType数据类型
        /// 
        /// </summary>
        public string DataType { get; set; }
        /// <summary>
        /// Length长度
        /// 
        /// </summary>
        public int Length { get; set; }
        /// <summary>
        /// Decimal精度
        /// 
        /// </summary>
        public int Decimal { get; set; }
        /// <summary>
        /// DefaultValue默认值
        /// 
        /// </summary>
        public string DefaultValue { get; set; }
        /// <summary>
        /// IsRequired是否必须
        /// 
        /// </summary>
        public string IsRequired { get; set; }
        /// <summary>
        /// IsUninque是否唯一
        /// 
        /// </summary>
        public string IsUninque { get; set; }
        /// <summary>
        /// IsPrimary是否主键
        /// 
        /// </summary>
        public string IsPrimary { get; set; }
        /// <summary>
        /// IsSys是否系统字段
        /// 
        /// </summary>
        public string IsSys { get; set; }
        /// <summary>
        /// Note备注
        /// 
        /// </summary>
        public string Note { get; set; }


        //排序
        public string Ord { get; set; }
    }

}
