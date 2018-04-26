using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service
{
    public interface ISQLStrategy
    {

        /// <summary>
        /// 替换字符串
        /// </summary>
        /// <param name="field"></param>
        /// <returns></returns>
        string ReplaceToken(string field);

        /// <summary>
        /// 获取字符串
        /// </summary>
        /// <returns></returns>
        string GetToken();
    }
}
