using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBMetaModel")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBMetaModel
    {


        public string ID { get; set; }

        public string Name { get; set; }
        public string Code { get; set; }

        public string ModelID { get; set; }

        public string TableName { get; set; }

        public string ParentID { get; set; }

        public string ObjectID { get; set; }
        

        public string FormType { get; set; }






    }



}
