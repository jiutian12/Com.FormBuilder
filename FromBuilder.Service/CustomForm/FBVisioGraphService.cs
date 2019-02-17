using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Utilities;
using FormBuilder.Repository;
using FormBuilder.DataAccess.Interface;
using FormBuilder.Model;
using NPoco;
namespace FormBuilder.Service
{
    public class FBVisioGraphService : Repository<FBVisioGraph>, IFBVisioGraphService
    {
        #region ctr
        public FBVisioGraphService(IDbContext context) : base(context)
        {

        }

        public void AddData(FBVisioGraph model)
        {
            throw new NotImplementedException();
        }

        public GridViewModel<FBVisioGraph> GetPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBVisioGraph where 1=1");

            Page<FBVisioGraph> page = base.Page<FBVisioGraph>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBVisioGraph> model = new GridViewModel<FBVisioGraph>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }

 

        /// <summary>
        /// 获取模型记录
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public FBVisioGraph GetModel(string id)
        {
            FBVisioGraph model = new FBVisioGraph();
            model = base.GetBykey(id);
            return model;
        }


        public void DeleteModel(string id)
        {
            base.Remove(id);
        }


        public void SaveModel(FBVisioGraph model)
        {
            base.Save(model);
        }
        #endregion
    }
}