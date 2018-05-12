using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;

namespace FormBuilder.Model
{

    [TableName("FBFormLink")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBFormLink
    {
        /// <summary>
        /// ID
        /// 
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string FormID { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string LinkType { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string LinkURL { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string IsEnable { get; set; }

        public string Note { get; set; }
        public string IsSys { get; set; }


        public string Ord { get; set; }
    }

}
