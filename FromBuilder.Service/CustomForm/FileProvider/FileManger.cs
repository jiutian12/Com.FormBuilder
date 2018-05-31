using NPoco;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service
{
    public class FileManger
    {
        public static void saveFileList(string modelID, string dataID, DataSet ds, Database Db)
        {
            if (!ds.Tables.Contains("FBFileSave")) return;
            DataTable dt = ds.Tables["FBFileSave"];
            DataTable dtdel = ds.Tables["FBFileDel"];
            foreach (DataRow row in dtdel.Rows)
            {
                FileProvider.Provider.deleteFile(row["ID"].ToString());
            }

            foreach (DataRow row in dt.Rows)
            {
                if (!row["DataID"].ToString().Equals(dataID))
                {
                    FileProvider.Provider.setFileMainID(row["ID"].ToString(), dataID);
                }
            }
        }

    }
}
