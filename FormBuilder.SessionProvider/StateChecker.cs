using FormBuilder.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.SessionProvider
{
    /// <summary>
    /// 校验用户状态
    /// </summary>
    public class StateChecker
    {
        public void Check(ISessionKey user)
        {
            // 获取当前用户ID 和token 检查状态
            // 检查完之后更新最后访问时间
            // 如果检查不同过则返回状态校验不通过
        }
    }
}
