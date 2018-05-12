using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;




namespace FormBuilder.Service
{
    public interface IFBMenuService : IDisposable
    {
        void saveData(FBMenuInfo model);

        void deleteData(string id);

        FBMenuInfo getModel(string id);

        GridViewModel<FBMenuInfo> getPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems);

        List<FBMenuInfo> getMenuList(string appcode, string keyword, string parentID, string filter);

    }
}
