using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{
    public class CheckExits
    {
        public string TableName { get; set; }
        public string ModeID { get; set; }
        public string DataID { get; set; }
        public string ValidField { get; set; }
        public string ValidValue { get; set; }
        public string Label { get; set; }
        public string KeyField { get; set; }
        public bool IsDataModel { get; set; }
        public List<Condition> Filter { get; set; }
    }
}
