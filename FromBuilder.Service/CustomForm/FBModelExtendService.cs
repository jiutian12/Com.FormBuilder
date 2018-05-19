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
    public class FBModelExtendService : Repository<FBModelSQL>, IFBModelExtendService
    {
        #region ctr 
        public FBModelExtendService(IDbContext context) : base(context)
        {

        }
        #endregion


        public void deleteData(string id)
        {
            var sql = new Sql("delete from FBModelExtend where id=@0", id);
            base.Db.Execute(sql);
        }
        public List<FBModelExtend> getList(string modeID)
        {
            return Db.Fetch<FBModelExtend>(new Sql("select * from FBModelExtend where ModelID=@0", modeID));

        }

        public FBModelExtend getModel(string id)
        {
            return Db.Single<FBModelExtend>(new Sql("select *from FBModelExtend where id=@0", id));
        }

        public void saveData(FBModelExtend model)
        {

            base.Db.Save<FBModelExtend>(model);
        }

        public void saveData(List<FBModelExtend> list, string ModelID)
        {
            base.Db.Execute(new Sql("delete from FBModelExtend where  ModelID=@0", ModelID));
            foreach (FBModelExtend model in list)
            {
                if (string.IsNullOrEmpty(model.ID))
                {
                    model.ID = Guid.NewGuid().ToString();
                }

                model.ModelID = ModelID;

                base.Db.Save<FBModelExtend>(model);
            }
            
        }
    }
}
