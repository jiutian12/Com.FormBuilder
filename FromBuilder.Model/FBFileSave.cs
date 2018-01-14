using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBFileSave")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBFileSave
    {

        public string ID { get; set; }

        public string FileID { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }
        public string CreateUser { get; set; }
        public string CreateTime { get; set; }
        public string FileExt { get; set; }
        public string FrmID { get; set; }
        public string DataID { get; set; }
        public string Note { get; set; }

    }

    public class JFBFileSave
    {

        public string id { get; set; }

        public string name { get; set; }

        public string ext { get; set; }

        public string src { get; set; }
        public string createuser { get; set; }
        public string createtime { get; set; }

    }

}
