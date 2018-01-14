using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{
    public class GridViewModel<T>
    {
        public List<T> Rows { get; set; }
        public long TotalCount { get; set; }

        public long Total { get; set; }
    }
}
