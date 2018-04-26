using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;
using FormBuilder.Repository;
using FormBuilder.DataAccess.Interface;

namespace FormBuilder.Service
{
    public class FBModelSQLService : Repository<FBModelSQL>, IFBModelSQLService
    {
        #region ctr 
        public FBModelSQLService(IDbContext context) : base(context)
        {

        }
        #endregion


        public void deleteData(string id)
        {
            var sql = new Sql("delete from FBModelSQL where id=@0", id);
            base.Db.Execute(sql);
        }
        public List<FBModelSQL> getList(string modeID, string keyword)
        {
            return Db.Fetch<FBModelSQL>(new Sql("select * from FBModelSQL where ModelID=@0", modeID));

        }

        public FBModelSQL getModel(string id)
        {
            return Db.Single<FBModelSQL>(new Sql("select *from FBModelSQL where id=@0", id));
        }

        public void saveData(FBModelSQL model)
        {

            base.Db.Save<FBModelSQL>(model);
        }
    }
}
