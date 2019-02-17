using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{

    public interface IFBVisioGraphService : IDisposable
    {
        void AddData(FBVisioGraph model);

        FBVisioGraph GetModel(string id);

        GridViewModel<FBVisioGraph> GetPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems);
        void SaveModel(FBVisioGraph model);
        void DeleteModel(string id);
    }
}
