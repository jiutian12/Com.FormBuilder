using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    public class JFBTreeStruct
    {

        #region 分级码
        public string grade { get; set; }
        public string level { get; set; }
        public string isdetail { get; set; }


        /// <summary>
        /// 
        /// </summary>
        public string rootlevel { get; set; } = "1";

        /// <summary>
        /// 分级码格式
        /// </summary>
        public string format { get; set; }
        #endregion


        #region 父子
        public string id { get; set; }
        public string parentid { get; set; }

        public string ischild { get; set; }

        public string rootvalue { get; set; }
        #endregion



        public string treename { get; set; }

        public string treecode { get; set; }
         
    }


    public class JFBTimeStamp
    {

        public string lastModifyUser { get; set; }
        public string lastModifyTime { get; set; }
        public string createUser { get; set; }
        public string createTime { get; set; }
    }
}
