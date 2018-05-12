using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.DataAccess.Interface;
using FormBuilder.Model;
using FormBuilder.Repository;
using FormBuilder.Utilities;
using NPoco;
using FormBuilder.DataAccess;

namespace FormBuilder.Service
{
    public class FBMenuService : Repository<FBMenuInfo>, IFBMenuService
    {

        #region ctr
        public FBMenuService(IDbContext context) : base(context)
        {


        }
        #endregion



        public void deleteData(string id)
        {
            throw new NotImplementedException();
        }

        public List<FBMenuInfo> getMenuList(string appcode, string keyword, string parentID, string filter)
        {
            throw new NotImplementedException();
        }

        public FBMenuInfo getModel(string id)
        {
            throw new NotImplementedException();
        }

        public GridViewModel<FBMenuInfo> getPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            throw new NotImplementedException();
        }

        public void saveData(FBMenuInfo model)
        {
            throw new NotImplementedException();
        }




    }
}
