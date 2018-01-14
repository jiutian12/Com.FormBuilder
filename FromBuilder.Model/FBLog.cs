using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBLog")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBLog
    {
        public string ID { get; set; }

        public string LogLevel { get; set; }

        public string LogInfo { get; set; }

        public string OpUser { get; set; }
        public string OpTime { get; set; }
    }
}
