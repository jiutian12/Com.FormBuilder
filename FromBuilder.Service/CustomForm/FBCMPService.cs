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
using System.Reflection;
using System.Data;

namespace FormBuilder.Service
{
    public class FBCMPService : Repository<FBCMPService>, IFBCMPService
    {


        #region ctr 
        public FBCMPService(IDbContext context) : base(context)
        {

        }
        #endregion

        #region Design Service
        public void addData(FBComponent model)
        {
            try
            {
                this.Db.BeginTransaction();
                base.Db.Save<FBComponent>(model);// 保存数据 明细表数据
                FBMeta.AddMeataData(model.ID, model.Code, model.Name, "6", model.parentID, base.Db);
                this.Db.CompleteTransaction();

            }
            catch (Exception ex)
            {
                this.Db.AbortTransaction();
                throw ex;
            }
        }

        public void saveData(FBComponent model)
        {

            try
            {
                base.Db.BeginTransaction();
                base.Db.Save<FBComponent>(model);
                base.Db.Execute(new Sql(@" delete from  FBCMPMethod where  CMPID =@0  ", model.ID));
                foreach (FBCMPMethod col in model.MethodList)
                {
                    if (string.IsNullOrEmpty(col.ID))
                    {
                        col.ID = Guid.NewGuid().ToString();
                    }

                    col.CMPID = model.ID;
                    base.Db.Save<FBCMPMethod>(col);
                    base.Db.Execute(new Sql(@" delete from  FBCMPPara where  MethodID =@0  ", col.ID));
                    foreach (FBCMPPara para in col.ParaList)
                    {
                        if (string.IsNullOrEmpty(para.ID))
                        {
                            para.ID = Guid.NewGuid().ToString();
                        }

                        para.CMPID = model.ID;
                        para.MethodID = col.ID;
                        base.Db.Save<FBCMPPara>(para);
                    }
                }

                FBMeta.UpdateMeataInfo(model.Name, model.Code, model.ID, base.Db);//更新元数据编号
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        /// <summary>
        /// 删除自定义数据源
        /// </summary>
        /// <param name="id"></param>
        public void deleteData(string id)
        {
            try
            {
                base.Db.BeginTransaction();
                FBMeta.deleteCheck(id, base.Db);
                FBMeta.DeleteMetaData(id, base.Db);//删除元数据
                base.Db.Execute(new NPoco.Sql("delete from FBComponent where ID=@0", id));
                base.Db.Execute(new NPoco.Sql("delete from FBCMPMethod where CMPID=@0", id));
                base.Db.Execute(new NPoco.Sql("delete from FBCMPPara where CMPID=@0", id));
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }

        public FBComponent getModel(string id)
        {
            Sql sql = new Sql(@"select * from FBComponent  where  ID=@0", id);
            FBComponent model = base.Db.FirstOrDefault<FBComponent>(sql);

            sql = new Sql(@"select * from   FBCMPMethod where CMPID =@0", id);

            model.MethodList = base.Db.Fetch<FBCMPMethod>(sql);
            foreach (var item in model.MethodList)
            {
                sql = new Sql(@"select * from   FBCMPPara where CMPID =@0 and MethodID=@1", id, item.ID);
                item.ParaList = base.Db.Fetch<FBCMPPara>(sql);
            }

            return model;
        }

        public GridViewModel<FBComponent> getPageList(string type, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems)
        {
            Sql sql = new Sql("select * from FBComponent where 1=1");
            if (!string.IsNullOrEmpty(keyword))
            {
                sql.Append(new Sql(" and (Code like '" + keyword + "%' or Name like  '" + keyword + "%')"));

            }
            if (string.IsNullOrEmpty(order))
            {
                sql.Append(" order by lastModifytime desc");
            }
            else
            {
                sql.Append(order);
            }

            Page<FBComponent> page = base.Page<FBComponent>(currentPage, perPage, sql);
            totalPages = page.TotalPages;

            totalItems = page.TotalItems;


            GridViewModel<FBComponent> model = new GridViewModel<FBComponent>();
            model.Rows = page.Items;
            model.TotalCount = totalPages;
            return model;
        }

        public void saveMethod(FBCMPMethod model)
        {

            try
            {
                base.Db.BeginTransaction();
                base.Db.Save<FBCMPMethod>(model);

                base.Db.Execute(new Sql(@" delete from  FBCMPPara where  MethodID =@0  ", model.ID));
                foreach (FBCMPPara para in model.ParaList)
                {
                    if (string.IsNullOrEmpty(para.ID))
                    {
                        para.ID = Guid.NewGuid().ToString();
                    }

                    para.CMPID = model.CMPID;
                    para.MethodID = model.ID;
                    base.Db.Save<FBCMPPara>(para);
                }
                //FBMeta.UpdateMeataInfo(model.Name, model.Code, model.ID, base.Db);//更新元数据编号
                this.Db.CompleteTransaction();
            }
            catch (Exception ex)
            {
                base.Db.AbortTransaction();
                throw ex;
            }
        }


        #endregion




        public object invokeMethod(string componentID, string methodName, List<string> args)
        {

            try
            {
                object execReusult = "";
                var model = this.getModel(componentID);
                var assName = model.AssemblyName;
                var className = model.ClassName;
                var method = model.MethodList.SingleOrDefault(p => p.MethodName.ToUpper() == methodName.ToUpper());
                if (method.ParaList != null)
                {

                    Assembly assembly = Assembly.LoadFile(AppDomain.CurrentDomain.BaseDirectory + "Bin/" + assName + ".dll");

                    Type t = assembly.GetType(assName + "." + className, false, true);
                    var instance = Activator.CreateInstance(t);
                    MethodInfo mi = t.GetMethod(method.MethodName);
                    //调用show方法 
                    Object[] params_obj = new Object[method.ParaList.Count];
                    for (var i = 0; i < method.ParaList.Count; i++)
                    {
                        if (method.ParaList[i].ParamType == "2")
                        {
                            params_obj[i] = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(args[i].ToString());
                        }
                        else if (method.ParaList[i].ParamType == "3")
                        {
                            params_obj[i] = Newtonsoft.Json.JsonConvert.DeserializeObject<DataSet>(args[i].ToString());
                        }
                        else if (method.ParaList[i].ParamType == "4")
                        {
                            params_obj[i] = Newtonsoft.Json.JsonConvert.DeserializeObject<DataTable>(args[i].ToString());
                        }
                        else
                        {
                            params_obj[i] = args[i].ToString();
                        }


                    }

                    //params_obj[0] = arr;
                    execReusult = mi.Invoke(instance, params_obj);
                    //return result.ToString();
                }
                else
                {
                    throw new Exception(string.Format("Cannot Find MethodName {0} in ComponentID:{1}", componentID, methodName));
                }

                return new { res = true, data = execReusult };
            }
            catch (Exception ex)
            {
                // 记录执行异常
                throw ex;
            }

        }
    }
}
