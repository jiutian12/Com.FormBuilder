using System.Collections.Generic;
using NPoco;

namespace FormBuilder.Model
{

    /// <summary>
    /// 用户角色表
    /// </summary>
    [TableName("FBRole")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBRole
    {
        public string ID { get; set; }
        public string Code { get; set; }
       
        public string Name { get; set; }

        public string Ord { get; set; }

        public string Note { get; set; }

        public string State { get; set; }

    }
}
