using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Utilities;
using FormBuilder.Model;

namespace FormBuilder.Service
{

    public interface IFBCommonService : IDisposable
    {
        /// <summary>
        /// 远程校验数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        string remoteCheck(CheckExits model);

        List<FBMetaData> getFolderList(string parentID, string userID, bool isSYS, bool isFolder, string keyword);

        List<FBMetaData> searchMetaData(string keyword, string parentID);

        void addFolder(FBMetaData model);

        void renameFolder(string name, string id);

        void moveMetaData(List<string> data, string targetID);

        void deleteMeta(string id);

        void LogError(string errorInfo);

        void LogInfo(string logInfo);
        void LogDebug(string debugInfo);

        GridViewModel<Model.FBLog> GetLogList(string keyword, string filter, string order, int currentPage, int perPage, out long totalPages, out long totalItems);
    }
}
