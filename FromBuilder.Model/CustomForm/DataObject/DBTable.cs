using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    public class DBTable
    {

        public string TABLE_SCHEMA { get; set; }
        public string TABLE_NAME { get; set; }

        public string TABLE_TYPE { get; set; }

        public string CREATE_TIME { get; set; }
    }


    public class DBColumn

    {

        public string COLUMN_NAME { get; set; }

        public string DATA_TYPE { get; set; }

        public string IS_NULLABLE { get; set; }




        public string NLENGTH { get; set; }


        public string LENGTH { get; set; }
        public string PREC { get; set; }

    }
}
