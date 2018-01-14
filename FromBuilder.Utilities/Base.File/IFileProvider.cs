using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities.Base.File
{
    public interface IFileProvider
    {

        /// <summary>
        /// 上传接口
        /// </summary>
        /// <param name="file"></param>
        /// <param name="refMK"></param>
        /// <param name="refKey"></param>
        /// <returns></returns>
        string upload(Stream file, string refMK, string refKey);



        Stream download(string id);
    }
}
