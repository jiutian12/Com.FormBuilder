using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Model
{
    [TableName("FBMenuInfo")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBMenuInfo
    {

        /// <summary>
        /// 菜单ID
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 菜单编号
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 菜单名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 分级码
        /// </summary>
        public string Path { get; set; }
        /// <summary>
        /// 级数
        /// </summary>
        public string Layer { get; set; }
        /// <summary>
        /// 是否明细
        /// </summary>
        public string IsDetail { get; set; }

        /// <summary>
        /// 父ID
        /// </summary>
        public string PID { get; set; }
        /// <summary>
        /// 调用地址
        /// </summary>

        public string URL { get; set; }
        /// <summary>
        /// 按钮图标
        /// </summary>
        public string ICON { get; set; }

        /// <summary>
        /// 业务系统标识
        /// </summary>

        public string AppCode { get; set; }

        /// <summary>
        /// 自定义表单ID
        /// </summary>
        public string FormID { get; set; }
        /// <summary>
        /// 展现方式
        /// </summary>
        public string ShowType { get; set; }
    }


    [TableName("FBMenuBtn")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBMenuBtn
    {

        public string ID { get; set; }
        public string MenuID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

    }
}
