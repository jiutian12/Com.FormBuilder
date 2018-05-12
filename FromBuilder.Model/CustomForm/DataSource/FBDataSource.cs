using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    //自定义数据源主表
    [TableName("FBDataSource")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataSource
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
        /// DsType数据源类型
        /// 0 sql1 反射dll2.web地址
        /// </summary>
        public string DsType { get; set; }
        /// <summary>
        /// DsCode数据源编号
        /// 
        /// </summary>
        public string DsCode { get; set; }
        /// <summary>
        /// SqlInfoSql配置信息
        /// 
        /// </summary>
        public string SqlInfo { get; set; }
        /// <summary>
        /// Reflect反射调用信息
        /// 
        /// </summary>
        public string Reflect { get; set; }
        /// <summary>
        /// RemoteURL远程调用地址
        /// 
        /// </summary>
        public string RemoteURL { get; set; }
        /// <summary>
        /// CreateTime创建时间
        /// 
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        /// CreateUser创建用户
        /// 
        /// </summary>
        public string CreateUser { get; set; }
        /// <summary>
        /// LastModifyTime最后修改时间
        /// 
        /// </summary>
        public string LastModifyTime { get; set; }
        /// <summary>
        /// LastModifyUser最后修改人
        /// 
        /// </summary>
        public string LastModifyUser { get; set; }

        [Ignore]
        public List<FBDataSourceCols> ColList { get; set; }


        [Ignore]
        public string parentID { get; set; }

        [Ignore]
        public JFBTreeStruct treeInfo { get; set; }
        public string Tree { get; set; }


        public string IsUpdate { get; set; }
    }


    /// <summary>
    /// 自定义数据源明细列表
    /// </summary>
    [TableName("FBDataSourceCols")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataSourceCols
    {

        /// <summary>
        /// ID主键
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// DSID数据源ID
        /// 
        /// </summary>
        public string DSID { get; set; }
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

    }



}
