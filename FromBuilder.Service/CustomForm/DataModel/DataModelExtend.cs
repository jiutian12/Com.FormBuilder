using NPoco;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;

namespace FormBuilder.Service
{
    public class DataModelExtend
    {
        List<IFBModelExtend> _servicelist = new List<IFBModelExtend>();
        public bool isExist
        {
            get { return list.Count > 0; }
        }
        private List<FBModelExtend> list = new List<FBModelExtend>();


        public DataModelExtend(string ModelID, Database db,Database ywDb)
        {
            var sql = "select * from FBModelExtend where ModelID=@0 and Isused='1'";
            list = db.Fetch<FBModelExtend>(new Sql(sql, ModelID));
            LoadData();
        }

        public void LoadData()
        {
            list.ForEach(n =>
            {
                try
                {
                    _servicelist.Add((IFBModelExtend)Activator.CreateInstance(Type.GetType(n.ClassName + "," + n.Assembly, false, true)));
                }
                catch (Exception ex)
                {
                    throw new Exception("创建模型扩展构件出错，请检查模型扩展事件定义的DLL是否符合规范；" + ex.Message);
                }
            });
        }


        public string ExecBeforeSave(string ModelID, DataSet ds, string Status, Database db)
        {
            List<string> result = new List<string>();
            _servicelist.ForEach(n =>
            {
                result.Add(n.BeforeSave(ModelID, ds, Status, db));
            });
            return String.Join("`", result);
        }


        public string ExecAfterSave(string ModelID, DataSet ds, string Status, Database db)
        {
            List<string> result = new List<string>();
            _servicelist.ForEach(n =>
            {
                result.Add(n.AfterSave(ModelID, ds, Status, db));
            });
            return String.Join("`", result);

        }

        public string ExecBeforeDelete(string ModelID, string DataID, Database db)
        {
            List<string> result = new List<string>();
            _servicelist.ForEach(n =>
            {
                result.Add(n.BeforeDelete(ModelID, DataID, db));
            });
            return String.Join("`", result);

        }

        public string ExecAfterDelete(string ModelID, string DataID, Database db)
        {
            List<string> result = new List<string>();
            _servicelist.ForEach(n =>
            {
                result.Add(n.AfterDelete(ModelID, DataID, db));
            });
            return String.Join("`", result);
        }
    }
}
