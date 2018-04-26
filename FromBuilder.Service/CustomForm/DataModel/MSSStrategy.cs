using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service
{
    public class MSSStrategy : ISQLStrategy
    {
        public string GetToken()
        {
            return "";
        }

        public string ReplaceToken(string field)
        {
            return field;
        }
    }
}
