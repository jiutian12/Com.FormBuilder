using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{


    /// <summary>
    /// sql 查询条件 序列化实体
    /// </summary>
    public class Condition
    {
        /// <summary>
        /// 左括号
        /// </summary>
        public string LeftBrace { get; set; }

        /// <summary>
        /// 查询字段
        /// </summary>
        public string ParamName { get; set; }

        /// <summary>
        /// 比较条件
        /// </summary>
        public string Operate { get; set; }

        /// <summary>
        /// 是否为表达式
        /// </summary>
        public bool IsExpress { get; set; }

        /// <summary>
        /// 表达式内容
        /// </summary>
        public object ExpressValue { get; set; }

        /// <summary>
        /// 右括号
        /// </summary>
        public string RightBrace { get; set; }


        /// <summary>
        /// 链接条件
        /// </summary>
        public string Logic { get; set; }
    }


    /// <summary>
    /// 查询条件序列化方法
    /// </summary>
    public class ConditionParser
    {

        #region 查询条件序列化方法

        public static string Serialize(List<Condition> conditions, string orderField = "", string orderType = "")
        {
            string startTime;
            string endTime;
            StringBuilder sbWhere = new StringBuilder();
            if (conditions.Count > 0)
            {
                sbWhere.Append(" AND");
            }
            int indexrow = 0;
            foreach (Condition item in conditions)
            {
                item.Logic = item.Logic.ToUpper().Trim();
                if (item.ExpressValue == null)
                    continue;
                string Logic = "", likevalue = string.Empty;
                if (string.IsNullOrEmpty(item.Logic))
                    Logic = "";
                else
                    Logic = item.Logic == "AND" ? "AND" : "OR";
                if (conditions.Count - 1 == indexrow) { Logic = ""; }//最后一行不加and or

                string fieldName = item.ParamName;
                string expressvalue = Convert.ToString(item.ExpressValue);
                if (!item.IsExpress)
                    expressvalue = " '" + expressvalue + "' ";

                switch (item.Operate.Trim().ToUpper())
                {
                    case "=":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " = " + expressvalue + item.RightBrace + " " + Logic);
                        break;
                    case "<>":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " <> " + expressvalue + item.RightBrace + " " + Logic);
                        break;
                    case ">":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " > " + expressvalue + item.RightBrace + " " + Logic);
                        break;
                    case "<":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " < " + expressvalue + item.RightBrace + " " + Logic);
                        break;
                    case ">=":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " >= " + expressvalue + item.RightBrace + " " + Logic);
                        break;
                    case "<=":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " <= " + expressvalue + item.RightBrace + " " + Logic);
                        break;
                    case "NULL":
                        sbWhere.Append(string.Format(" " + item.LeftBrace + "{0} is null ", fieldName) + item.RightBrace + " " + Logic);
                        break;
                    case "NOTNULL":
                        sbWhere.Append(string.Format(" " + item.LeftBrace + "{0} is not null ", fieldName) + item.RightBrace + " " + Logic);
                        break;
                    case "LIKE":
                        likevalue += item.IsExpress ? item.ExpressValue : "'%" + item.ExpressValue + "%'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " like " + likevalue + item.RightBrace + " " + Logic);
                        break;
                    case "NOTLIKE":
                        likevalue += item.IsExpress ? item.ExpressValue : "'%" + item.ExpressValue + "%'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " not like " + likevalue + item.RightBrace + " " + Logic);
                        break;
                    case "LEFTLIKE":
                        likevalue += item.IsExpress ? item.ExpressValue : "'" + item.ExpressValue + "%'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " like " + likevalue + item.RightBrace + " " + Logic);
                        break;
                    case "RIGHTLIKE":
                        likevalue += item.IsExpress ? item.ExpressValue : "'%" + item.ExpressValue + "'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " like " + likevalue + "%" + item.RightBrace + " " + Logic);
                        break;
                    case "IN":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " in " + item.ExpressValue + " " + item.RightBrace + " " + Logic);
                        break;
                    case "NOTIN":
                        sbWhere.Append(" " + item.LeftBrace + fieldName + " not in " + item.ExpressValue + " " + item.RightBrace + " " + Logic);
                        break;
                    case "YESTERDAY":
                        startTime = "'" + DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd") + " 00:00:00'";
                        endTime = "'" + DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd") + " 23:59:59'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + "  between " + startTime + " and " + endTime + item.RightBrace + " " + Logic);
                        break;
                    case "TODAY":
                        startTime = "'" + DateTime.Now.ToString("yyyy-MM-dd") + " 00:00:00'";
                        endTime = "'" + DateTime.Now.ToString("yyyy-MM-dd") + " 23:59:59'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + "  between " + startTime + " and " + endTime + item.RightBrace + " " + Logic);
                        break;
                    case "LASTWEEK":
                        startTime = "'" + DateTime.Now.AddDays(Convert.ToInt32(1 - Convert.ToInt32(DateTime.Now.DayOfWeek)) - 7).ToString("yyyy-MM-dd") + " 00:00:00'";
                        endTime = "'" + DateTime.Now.AddDays(Convert.ToInt32(1 - Convert.ToInt32(DateTime.Now.DayOfWeek)) - 1).ToString("yyyy-MM-dd") + " 23:59:59'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + "  between " + startTime + " and " + endTime + item.RightBrace + " " + Logic);
                        break;
                    case "LASTMONTH":
                        startTime = "'" + DateTime.Now.AddMonths(-1).ToString("yyyy-MM-01") + " 00:00:00'";
                        endTime = "'" + Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-01")).AddDays(-1).ToString("yyyy-MM-dd") + " 23:59:59'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + "  between " + startTime + " and " + endTime + item.RightBrace + " " + Logic);
                        break;
                    case "LASTQUARTER"://上个季度
                        startTime = "'" + DateTime.Now.AddMonths(-3).ToString("yyyy-MM-01") + " 00:00:00'";
                        endTime = "'" + Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-01")).AddDays(-1).ToString("yyyy-MM-dd") + " 23:59:59'";
                        sbWhere.Append(" " + item.LeftBrace + fieldName + "  between " + startTime + " and " + endTime + item.RightBrace + " " + Logic);
                        break;
                    default:
                        break;
                }
                indexrow++;
            }
            if (!string.IsNullOrEmpty(orderField))//判断是否有排序功能
            {
                orderType = orderType.ToLower() == "desc" ? "desc" : "asc";
                sbWhere.Append(" Order By " + orderField + " " + orderType + "");
            }

            return sbWhere.ToString();

        }
        #endregion
    }
}
