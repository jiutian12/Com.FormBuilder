using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{

    #region 数据模型的实体类信息
    /// <summary>
    /// 数据模型结构实体
    /// </summary>
    /// Modelheader:chidren
    /// 
    public class DataModel
    {
        /// <summary>
        /// 数据模型ID
        /// </summary>
        public string modelID { get; set; }

        /// <summary>
        /// 模型分级信息
        /// </summary>
        public HirarchyInfo Hirarchy { get; set; }

        public DataModelObject MainObject { get; set; }//主对象


        public List<DataModelObject> ListObject { get; set; }//子对象
    }
    #endregion


    #region 对象实体(主对象or子对象的数据结构)

    /// <summary>
    /// 对象实体
    /// </summary>
    public class DataModelObject
    {
        /// <summary>
        /// 主键字段ColID
        /// </summary>
        public string keyColID { get; set; }

        /// <summary>
        /// 对象的过滤条件
        /// </summary>
        public string Filter { get; set; }
        /// <summary>
        /// 数据对象ID
        /// </summary>
        public string objectID { get; set; }

        /// <summary>
        /// 列信息
        /// </summary>
        public List<Column> elements { get; set; }

        /// <summary>
        /// 是否为主对象
        /// </summary>
        public bool isMainObject { get; set; }

        /// <summary>
        /// 子对象时和主对象关联条件
        /// </summary>
        public List<refColInfo> refCondition { get; set; }

    }
    #endregion


    #region  对象的过滤和排序信息
    /// <summary>
    /// 对象的过滤条件
    /// </summary>
    public class Filter
    {
    }

    #endregion


    #region 主对象or子对象的约束限制信息
    /// <summary>
    /// 约束限制条件  主键 or 联合主键
    /// </summary>
    public class Constraints
    {

    }
    #endregion

    #region 字段关联条件
    /// <summary>
    /// 字段关联
    /// </summary>
    public class Assocation
    {
        public string ObjectID { get; set; }//关联对象
        public List<refColInfo> refCondition { get; set; }
        public string refType { get; set; }//左连接  右连接 全链接
        public List<RefColumn> RefElement { get; set; }//关联字段信息
    }
    #endregion

    #region 【列】数据模型中main-column
    public class Column
    {
        public string ID { get; set; }
        public string Code { get; set; }
        public string ObjectColID { get; set; }
        public string Name { get; set; }

        public string Label { get; set; }
        public string DatatType { get; set; }
        public string Length { get; set; }
        public bool isList { get; set; }
        public bool isCard { get; set; }

        public bool isReadOnly { get; set; }
        public bool isUpdate { get; set; }

        /// <summary>
        /// 是否虚字段
        /// </summary>
        public bool isVirtual { get; set; }
        /// <summary>
        /// 虚字段表达式
        /// </summary>
        public string VirtualExpress { get; set; }

        /// <summary>
        /// 关联条件
        /// </summary>
        public List<Assocation> assocationList { get; set; }
    }
    #endregion

    #region 【列】模型的关联字段列 ref-cloumn 
    public class RefColumn
    {
        public string ID { get; set; }
        public string Code { get; set; }
        public string ObjectColID { get; set; }
        public string Name { get; set; }

        public string Label { get; set; }
        public string DatatType { get; set; }
        public string Length { get; set; }
        public bool isList { get; set; }
        public bool isCard { get; set; }

    }
    #endregion

    #region 关联条件信息
    /// <summary>
    /// 关联条件 Element 自身的列ID  RefElement 被关联的对象的列ID
    /// </summary>
    public class refColInfo
    {
        public string Element { get; set; }//本方列ID
        public string RefElement { get; set; }//目标方列ID
    }
    #endregion

    #region 模型分级信息


    /// <summary>
    /// 分级信息
    /// 此实体为标记数据模型的数据结构信息 便于存储方便 这里的字段会存储 数据对象本身的列名字段 【理论上 同一个主/子对象的列名是不会重复的】
    /// </summary>
    public class HirarchyInfo
    {


        /// <summary>
        /// 分级码字段
        /// </summary>
        public string PathField { get; set; }

        /// <summary>
        /// 级数字段
        /// </summary>
        public string LevelField { get; set; }

        /// <summary>
        /// 明细字段
        /// </summary>
        public string DetailField { get; set; }


        /// <summary>
        /// 父字段
        /// </summary>
        public string PIDFiled { get; set; }

        /// <summary>
        /// 父子结构字段
        /// </summary>
        public string RootField { get; set; }

        /// <summary>
        /// 一般是空或者null
        /// </summary>
        public string RootValue { get; set; }

        /// <summary>
        /// 初始级别
        /// </summary>
        public string RootLevel { get; set; }

        /// <summary>
        /// 分级结构
        /// </summary>
        public string PathFormat { get; set; }


    }

    #endregion
}
