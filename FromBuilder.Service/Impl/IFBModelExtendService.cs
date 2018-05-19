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
    /// 模型扩展DLL相关服务接口
    /// </summary>
    public interface IFBModelExtendService : IDisposable
    {

        List<FBModelExtend> getList(string modeID);

        FBModelExtend getModel(string id);
        void saveData(FBModelExtend model);

        void deleteData(string id);

    }
}
