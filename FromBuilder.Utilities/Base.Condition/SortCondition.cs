using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{
    public class SortCondition
    {
        private string _field;
        private string _order;

        public SortCondition()
        {
            this._field = string.Empty;
        }

        public SortCondition(string field, string order)
        {
            this._field = string.Empty;
            this.Field = field;
            this.Order = order;
        }

        public string Field
        {
            get
            {
                return this._field;
            }
            set
            {
                this._field = value;
            }
        }

        public string Order
        {
            get
            {
                return this._order;
            }
            set
            {
                this._order = value;
            }
        }
    }
    /// <summary>
    /// 排序条件解析器
    /// </summary>
    public class SortConditionParser
    {
        public static string Serialize(List<SortCondition> sortConditions)
        {
            
            StringBuilder builder = new StringBuilder();
            foreach (SortCondition condition in sortConditions)
            {
                builder.AppendFormat(",{0} {1}", condition.Field, condition.Order.ToString());
            }
            if (builder.Length > 0) builder.Remove(0, 1);
            return builder.ToString();
        }
    }
}
