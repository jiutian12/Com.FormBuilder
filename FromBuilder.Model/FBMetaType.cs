using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    public class FBMetaType
    {
        public enum MetaType
        {
            DataObject = 0,
            DataModel = 1,
            SmartHelp = 2,
            Form = 3,
            DataSource = 5,
            Folder = 9
        }
    }
}
