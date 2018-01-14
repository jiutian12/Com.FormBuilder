using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{
    public interface IFBDataObjectService : IDisposable
    {
        void AddData(FBDataObject model);

        FBDataObject GetModel(string id);

        List<FBDataObject> GetObjectList(string filter);

        List<FBDataObjectCols> GetColumn(string objectid);

        List<FBMetaData> getMetaDataList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems);


        bool checkDeleteCol(string objectid, string colname, out string mes);

        /// <summary>
        /// 分页获取数据对象列表
        /// </summary>
        /// <param name="keyword"></param>
        /// <param name="order"></param>
        /// <param name="currentPage"></param>
        /// <param name="perPage"></param>
        /// <param name="totalPages"></param>
        /// <param name="totalItems"></param>
        /// <returns></returns>
        GridViewModel<FBDataObject> GetDataObjectList(string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems);


        /// <summary>
        /// 删除数据对象
        /// </summary>
        /// <param name="ModelID"></param>
        void DeleteObject(string ModelID);



        /// <summary>
        /// 添加数据对象
        /// </summary>
        /// <param name="model"></param>
        void AddObject(FBDataObject model);


        List<string> getDBSChema();

        GridViewModel<DBTable> getDBTables(string tableSchema, string keyword, int currentPage, int perPage);
        List<DBColumn> getDBColumnList(string tablename, string tableSchema);
    }
}
