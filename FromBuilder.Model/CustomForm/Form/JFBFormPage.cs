using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    /// <summary>
    /// JSON 配置实体类 pageconfig
    /// </summary>
    public class JFBFormPage
    {
        public string engine { get; set; }
        public string datamodel { get; set; }
        public string theme { get; set; }
        public string formtype { get; set; }

        public string fsmid { get; set; }
        public bool show_websocket { get; set; }
        public bool show_b { get; set; }
        public bool show_c { get; set; }
        public bool show_t { get; set; }
        public bool show_l { get; set; }
        public bool show_r { get; set; }
        public bool show_cb { get; set; }

    }
}
