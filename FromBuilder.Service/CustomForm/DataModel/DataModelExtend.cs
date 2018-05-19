using NPoco;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service.CustomForm.DataModel
{
    public class DataModelExtend
    {
        IFBModelExtend _service;
        public bool isExist = false;

        public DataModelExtend(string ModeID, Database db)
        {


        }

        public void LoadData()
        {
            var assemblyName = "";
            var className = "";
            _service = (IFBModelExtend)Activator.CreateInstance(
               Type.GetType(className + "," + assemblyName, false, true));
        }


        public string ExecBeforeSave(string ModelID, DataSet ds, string Status, Database db)
        {
            return _service.BeforeSave(ModelID, ds, Status, db);
        }


        public string ExecAfterSave(string ModelID, DataSet ds, string Status, Database db)
        {

            return _service.AfterSave(ModelID, ds, Status, db);
        }

        public string ExecBeforeDelete(string ModelID, string DataID, Database db)
        {

            return _service.BeforeDelete(ModelID, DataID, db);
        }

        public string ExecAfterDelete(string ModelID, string DataID, Database db)
        {

            return _service.AfterDelete(ModelID, DataID, db);
        }
    }
}
