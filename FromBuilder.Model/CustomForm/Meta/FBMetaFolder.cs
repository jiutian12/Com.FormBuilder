using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBMetaFolder")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBMetaFolder
    {


        public string ID { get; set; }

        public string Name { get; set; }

        public string ParentID { get; set; }

        public string CreateTime { get; set; }


        public string CreateUser { get; set; }

        public string LastModifyTime { get; set; }

        public string LastModifyUser { get; set; }

    }

 

}
