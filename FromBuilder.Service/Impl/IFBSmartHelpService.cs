using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{

    public interface IFBSmartHelpService : IDisposable
    {


        void addData(FBSmartHelp model);

        FBSmartHelp getModel(string helpid);
        JFBSmartHelp getRuntimeModel(string helpid);
        void saveData(FBSmartHelp model);

        void deleteData(string helpid);


        GridViewModel<FBSmartHelp> getPageList(string type, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems);



    }
}
