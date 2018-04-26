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

namespace FormBuilder.Service
{
    public class FBSmartHelpService : Repository<FBSmartHelp>, IFBSmartHelpService
    {


        #region ctr 
        public FBSmartHelpService(IDbContext context) : base(context)
        {

        }
        #endregion

        private void saveDependence(string ID, Database db)
        {
            var sql = new Sql(@"
                select ModelID from FBSmartHelp where ID=@0  ", ID);

            List<string> list = db.Fetch<string>(sql);

            List<FBMetaDependence> listSave = new List<FBMetaDependence>();
            foreach (var item in list)
            {
                FBMetaDependence model = new FBMetaDependence();
                model.SourceID = ID;
                model.TargetID = item.ToString();
                listSave.Add(model);
            }
            FBMeta.SaveDependence(ID, listSave, db);
        }
        public void addData(FBSmartHelp model)
        {
            try
            {
                this.Db.CompleteTransaction();
                base.Db.Save<FBSmartHelp>(model);
                FBMeta.AddMeataData(model.ID, model.Code, model.Name, "2", model.parentID, base.Db);
                this.Db.CompleteTransaction();

            }
            catch (Exception ex)
            {
                this.Db.AbortTransaction();
                throw ex;
            }
        }

        public void saveData(FBSmartHelp model)
        {
            try
            {
                base.Db.BeginTransaction();
                base.Db.Save<FBSmartHelp>(model);
                base.Db.Execute(new Sql(@" delete from  FBSmartHelpCols where  HelpID =@0  ", model.ID));
                int i = 1;
                foreach (FBSmartHelpCols col in model.ColList)
                {
                    if (string.IsNullOrEmpty(col.ID))
                    {
                        col.ID = Guid.NewGuid().ToString();
                    }

                    col.HelpID = model.ID;
                    col.Ord = i.ToString();
                    base.Db.Save<FBSmartHelpCols>(col);
                    i++;
                }
                saveDependence(model.ID, base.Db);

                FBMeta.UpdateMeataInfo(model.Name, model.Code, model.ID, base.Db);//更新元数据编号
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        public void deleteData(string helpid)
        {
            try
            {
                base.Db.BeginTransaction();
                FBMeta.deleteCheck(helpid, base.Db);
                FBMeta.DeleteMetaData(helpid, base.Db);//删除元数据
                base.Db.Execute(new NPoco.Sql("delete from FBSmartHelp where id=@0", helpid));
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        public FBSmartHelp getModel(string helpid)
        {
            Sql sql = new Sql(@"select * from FBSmartHelp  where  ID=@0", helpid);
            FBSmartHelp model = base.Db.FirstOrDefault<FBSmartHelp>(sql);

            sql = new Sql(@"select * from    FBSmartHelpCols where HelpID =@0 order by ord asc", helpid);

            model.ColList = base.Db.Fetch<FBSmartHelpCols>(sql);

            return model;
        }

        public JFBSmartHelp getRuntimeModel(string helpid)
        {
            Sql sql = new Sql(@"select id,modelID,title,viewtype as type from FBSmartHelp  where  ID=@0", helpid);

            JFBSmartHelp model = base.Db.FirstOrDefault<JFBSmartHelp>(sql);

            var dmmodel = DataModelCom.getModelMainSchemaForWeb(model.modelID, base.Db);
            model.treeInfo = dmmodel.treeInfo;//树形结构
            model.pkCol = dmmodel.pkCol;

            sql = new Sql(@"select ColName as name,ColCode as code,align,width, ord,Visible from  FBSmartHelpCols where HelpID =@0 order by ord asc", helpid);

            model.ColList = base.Db.Fetch<JFBSmartHelpCols>(sql);

            return model;
        }


        public GridViewModel<FBSmartHelp> getPageList(string type, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBSmartHelp where 1=1");
            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and (Code like '" + keyword + "%' or Name like  '" + keyword + "%')"));

            }
            sql.Append(" order by lastModifytime desc");

            Page<FBSmartHelp> page = base.Page<FBSmartHelp>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBSmartHelp> model = new GridViewModel<FBSmartHelp>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }
    }
}
