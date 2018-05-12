using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    public class TreeNode
    {
        public string grade { get; set; }
        public string level { get; set; }

        public string parentid { get; set; }
        public string id { get; set; }

        public string dataid { get; set; }
    }
}
