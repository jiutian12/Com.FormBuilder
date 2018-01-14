using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{
    public interface IFBDBSettingService : IDisposable
    {
        void AddData(FBDBSetting model);

        FBDBSetting GetModel(string id);


        GridViewModel<FBDBSetting> GetPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems);
        List<FBDBSetting> GetDBSourceList(string keyword);
        void SaveModel(FBDBSetting model);
        void DeleteModel(string id);
        void ToogleEnable(string id, bool flag);
    }
}
