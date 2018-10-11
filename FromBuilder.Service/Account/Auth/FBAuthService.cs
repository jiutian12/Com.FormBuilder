using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.DataAccess.Interface;
using FormBuilder.Model;
using FormBuilder.Repository;
using NPoco;

namespace FormBuilder.Service
{
    public class FBAuthService : Repository<FBAuthPermission>, IFBAuthService
    {

        #region ctr

        IDbContext context; 
        //默认注入database实例
        public FBAuthService(IDbContext context) : base(context)
        {

            this.context = context;
        }

        #endregion
        public List<FBAuthPermission> getPermission()
        {
            throw new NotImplementedException();
        }

        public void saveData(List<FBAuthPermission> list, string masterValue, string AccessType)
        {

            try {
                base.Db.BeginTransaction();
                
                base.Db.Execute(new Sql("delete from FBAuthPermission where masterValue=@0 and Access=@1",masterValue,AccessType));
                foreach (var model in list) {
                    model.ID = Guid.NewGuid().ToString();
                    base.Add(model);
                }
                this.Db.CompleteTransaction();

            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }
    }
}
