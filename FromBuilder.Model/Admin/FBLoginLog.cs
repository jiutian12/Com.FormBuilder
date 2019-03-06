using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    [TableName("FBLoginLog")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBLoginLog
    {
        public string ID { get; set; }
        public string UserID { get; set; }
        public string LoginIP { get; set; }
        public string LoginMachine { get; set; }
        public string LoginResult { get; set; }
        public string LoginTime { get; set; }

    }
}
