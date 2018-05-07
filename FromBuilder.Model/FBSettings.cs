using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;


namespace FormBuilder.Model
{

    /// <summary>
    /// 数据对象模型
    /// </summary>
    [TableName("FBSettings")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBSettings
    {
        public string ID { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }
        public string DataType { get; set; }
        public string DataValue { get; set; }
        public string Note { get; set; }

        public string IsClient { get; set; }
        public string IsSys { get; set; }
        
    }
}
