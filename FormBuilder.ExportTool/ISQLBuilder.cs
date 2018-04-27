using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.ExportTool
{
    public interface ISQLBuilder
    {



        string GetToken();//获取字段关联token 

        string GenerateInsertSql(string tablename, string keyfield, string dataid);//生成insertSQL

        //string GenerateDeleteSql(string tablename, string keyfield, string dataid));//生成delete


    }
}
