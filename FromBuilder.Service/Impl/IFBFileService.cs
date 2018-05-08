using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Utilities;
using System.IO;
using FormBuilder.Model;

namespace FormBuilder.Service
{

    public interface IFBFileService : IDisposable
    {


        Stream downLoad(string fileid);

        byte[] downLoadFile(string fileid);
        void upload(string frmID, string dataID, string fileid, string key, string fileName, byte[] file);


        void saveFile(FBFileSave model);

        void saveFile(FBFileSave model, byte[] data);
        List<JFBFileSave> getFileList(string dataID, string frmID, string field);


        JFBFileSave getFileInfo(string fileid);


        void deleteFile(string fileID);
    }
}
