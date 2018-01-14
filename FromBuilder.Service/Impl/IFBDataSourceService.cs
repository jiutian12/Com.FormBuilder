using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;


namespace FormBuilder.Service
{

    public interface IFBDataSourceService : IDisposable
    {
        void addData(FBDataSource model);

        FBDataSource getModel(string id);

        void saveData(FBDataSource model);

        void deleteData(string id);

        GridViewModel<FBDataSource> getPageList(string type, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems);

        List<Dictionary<string, object>> getModelTreeDataDictList(string modeID, string level, string path, string parentID, string keyWord, string filter, string order);
        List<Dictionary<string, object>> getModelTreeDataALL(string modeID, string keyWord, string filter, string order);



        bool execDataSource(string sourceID, string frmID, Dictionary<string, object> arr);
    }
}
