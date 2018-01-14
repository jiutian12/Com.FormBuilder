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
    [TableName("FBDBSetting")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBDBSetting
    {
        public string ID { get; set; }

        public string Code { get; set; }

        public string DBType { get; set; }
        public string Name { get; set; }
        public string IPAddress { get; set; }
        public string UserName { get; set; }

        public string PassWord { get; set; }
        public string IsUsed { get; set; }
        public string CreateUser { get; set; }
        public string CreateTime { get; set; }
        public string LastModifyUser { get; set; }

        public string LastModifyTime { get; set; }


        /// <summary>
        /// 端口号
        /// </summary>
        public string PortInfo { get; set; }

        /// <summary>
        /// 数据库名
        /// </summary>
        public string Catalog { get; set; }
        
    }
}
