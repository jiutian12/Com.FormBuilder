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
    public class FBDBSettingService : Repository<FBDBSetting>, IFBDBSettingService
    {
        #region ctr
        public FBDBSettingService(IDbContext context) : base(context)
        {

        }

        public void AddData(FBDBSetting model)
        {
            throw new NotImplementedException();
        }

        public GridViewModel<FBDBSetting> GetPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBDBSetting where 1=1");

            Page<FBDBSetting> page = base.Page<FBDBSetting>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBDBSetting> model = new GridViewModel<FBDBSetting>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }
        public List<FBDBSetting> GetDBSourceList(string keyword)
        {
            Sql sql = new Sql("select * from FBDBSetting where 1=1");
            return Db.Fetch<FBDBSetting>(sql);
        }

        /// <summary>
        /// 获取模型记录
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public FBDBSetting GetModel(string id)
        {
            FBDBSetting model = new FBDBSetting();

            model = base.GetBykey(id);


            return model;
        }


        public void DeleteModel(string id)
        {
            base.Remove(id);
        }


        public void SaveModel(FBDBSetting model)
        {
            base.Save(model);
        }

        public void ToogleEnable(string id, bool flag)
        {
            Sql sql = new Sql(@"update FBDBSetting set isUsed=@0 where id=@1", flag ? "1" : "0", id);
            base.Db.Execute(sql);
        }
        #endregion
    }
}