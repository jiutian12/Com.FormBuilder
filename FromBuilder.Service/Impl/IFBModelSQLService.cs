using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Utilities;
using System.IO;
using FormBuilder.Model;

namespace FormBuilder.Service
{


    /// <summary>
    /// 模型扩展SQL相关服务接口
    /// </summary>
    public interface IFBModelSQLService : IDisposable
    {

        List<FBModelSQL> getList(string modeID, string keyword);

        FBModelSQL getModel(string id);
        void saveData(FBModelSQL model);

        void deleteData(string id);

    }
}
