using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service
{
    public class FileOpService
    {

        private IFBFileService _svr;

        public FileOpService(IFBFileService svr)
        {
            this._svr = svr;
        }


        public FileOpService()
        {
            
        }



        public IFBFileService svr
        {
            get { return _svr; }
        }
    }
}
