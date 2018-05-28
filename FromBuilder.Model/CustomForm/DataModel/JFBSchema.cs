using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Utilities;
using Newtonsoft.Json;

namespace FormBuilder.Model
{

    /// <summary>
    /// web表单的数据模型的json结构实体 
    /// </summary>
    public class JFBSchema
    {

        public string ID { get; set; }
        public string tableName { get; set; }//表名称
        public string tableLabel { get; set; }//表别名
        public string pkCol { get; set; }//主键
        public string refCol { get; set; }//子表关联建 mainid[关联主表的主键字段]
        public bool isMain { get; set; }//是否主表
        public string isMainTable { get; set; }//是否主表

        public string tree { get; set; }

        public string changeFields { get; set; }
        public string condition { get; set; }

        public JFBTreeStruct treeInfo { get; set; }


        public JFBTimeStamp timeInfo { get; set; }

        public List<Condition> conditionInfo { get; set; }
        public List<JFBColumn> cols { get; set; }//字段集合

    }





    public class JFBColumn
    {
        public string id { get; set; }
        public string code { get; set; }

        public string label { get; set; }
        public string name { get; set; }



        public string isUnique { get; set; }
        public bool unique { get; set; }

        public string dataType { get; set; }

        public string isPkCol { get; set; }
        public bool pkcol { get; set; }//是否为主键

        public string isRelated { get; set; }
        public bool related { get; set; }//是否关联字段
    }


    /// <summary>
    /// 自定义数据源实体
    /// </summary>
    public class JFBDSSchema
    {
        public string ID { get; set; }

        public string Name { get; set; }
        public string DsType { get; set; }
        [JsonIgnore]
        public string Tree { get; set; }
        public JFBTreeStruct treeInfo { get; set; }
    }
}
