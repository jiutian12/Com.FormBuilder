using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service 
{
    public class MySqlStrategy : ISQLStrategy
    {
        public string GetToken()
        {
            return "`";
        }

        public string ReplaceToken(string field)
        {
            return string.Format("`{0}`", field);
        }
    }
}
