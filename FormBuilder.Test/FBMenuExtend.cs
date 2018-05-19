using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using FormBuilder.Service;
using NPoco;

namespace FormBuilder.Test
{
    public class FBMenuExtend : IFBModelExtend
    {
        public string AfterDelete(string ModelID, string DataID, Database db)
        {
            return "";
        }

        public string AfterSave(string ModelID, DataSet ds, string Status, Database db)
        {
            return "";
        }

        public string BeforeDelete(string ModelID, string DataID, Database db)
        {
            return "";
        }

        public string BeforeSave(string ModelID, DataSet ds, string Status, Database db)
        {
            db.Execute("delete from FBLog");
            return "";
        }
    }
}
