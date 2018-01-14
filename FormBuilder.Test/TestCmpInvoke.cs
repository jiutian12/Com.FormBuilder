using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace FormBuilder.Test
{
    public class TestCMPInvoke
    {

        public void CallStringMethod(string id, string name)
        {
            var res = id + name;
        }


        public string CallMehtod(DataSet ds, Dictionary<string, object> dict)
        {
            var tableCount = ds.Tables.Count;

            return "call ok";

        }
    }
}
