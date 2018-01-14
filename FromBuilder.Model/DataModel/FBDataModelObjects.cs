using System.Collections.Generic;
using NPoco;
namespace FormBuilder.Model
{
    [TableName("FBDataModelObjects")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDataModelObjects
    {

        /// <summary>
        /// IDID
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// ModelID模型ID
        /// 
        /// </summary>
        public string ModelID { get; set; }
        /// <summary>
        /// ObjectID数据对象ID
        /// 
        /// </summary>
        public string ObjectID { get; set; }



        /// <summary>
        /// Code编号（表名）
        /// 
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// Name名称
        /// 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Level级数
        /// 
        /// </summary>
        public string Level { get; set; }
        /// <summary>
        /// ParentID父对象ID
        /// 
        /// </summary>
        public string ParentID { get; set; }

        [Ignore]
        public string ParentObjectName { get; set; }
        /// <summary>
        /// isMain是否主对象
        /// 
        /// </summary>
        public string isMain { get; set; }


        /// <summary>
        /// 是否启用时间戳
        /// </summary>
        public string isTimeStamp { get; set; }


        /// <summary>
        /// 是否保存
        /// </summary>
        public string isSave { get; set; }
        /// <summary>
        /// Filter过滤条件
        /// 
        /// </summary>
        public string Filter { get; set; }
        /// <summary>
        /// Sort排序条件
        /// 
        /// </summary>
        public string Sort { get; set; }
        /// <summary>
        /// PKCOLName主键列ID
        /// 
        /// </summary>
        public string PKCOLName { get; set; }

        public string Label { get; set; }

        public string Tree { get; set; }


        public string Condition { get; set; }

        /// <summary>
        /// 最后修改人最后修改时间字段
        /// </summary>
        public string changeFields { get; set; }

        /// <summary>
        /// 字段列表
        /// </summary>
        /// 
        [Ignore]
        public List<FBDataModelCols> ColList { get; set; }

        /// <summary>
        /// 删除检查列表
        /// </summary>
        [Ignore]
        public List<FBModelDeleteCheck> DeleteCheckList { get; set; }

        [Ignore]
        public List<FBModelModifyCheck> ModifyCheckList { get; set; }
        /// <summary>
        /// 关联对象信息
        /// </summary>
        [Ignore]
        public List<FBDataModelRealtions> Relation { get; set; }
    }
}
