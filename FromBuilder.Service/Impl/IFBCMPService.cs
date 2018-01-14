using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;


namespace FormBuilder.Service
{

    public interface IFBCMPService : IDisposable
    {
        void addData(FBComponent model);

        FBComponent getModel(string id);

        void saveData(FBComponent model);

        void saveMethod(FBCMPMethod model);

        void deleteData(string id);

        GridViewModel<FBComponent> getPageList(string type, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems);

        /// <summary>
        /// 反射调用构件方法
        /// </summary>
        /// <param name="componentID"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        object invokeMethod(string componentID, string methodName, List<string> args);

    }
}
