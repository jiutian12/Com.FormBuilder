using FormBuilder.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service
{
    /// <summary>
    /// 授权服务
    /// </summary>
    public interface IFBAuthService
    {

        /// <summary>
        /// 保存授权
        /// </summary>
        /// <param name="list"></param>
        void saveData(List<FBAuthPermission> list,string masterValue,string AccessType);

        /// <summary>
        /// 获取授权结果
        /// </summary>
        /// <returns></returns>
        List<FBAuthPermission> getPermission();
    }
}
