using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{
    public interface IFBDataModelService : IDisposable
    {
        /// <summary>
        /// 获取数据模型的对象关系列表
        /// </summary>
        /// <param name="mnodeid"></param>
        /// <returns></returns>
        List<FBDataModelObjects> GetObjectList(string ModelID);


        List<FBDataModelObjects> GetObjectList(string ModelID, bool hasRelation);

        bool checkDeleteCol(string ModelID, string ObjectID, string ColName, out string Mes);

        void DeleteModelInfo(string ModelID);


        void AddModel(FBDataModel model);



        void SaveRelation(FBDataModelRealtions model);
        void deleteRelation(string modelID, string relationID);


        FBDataModelRealtions GetRelationInfo(string modelID, string ModelObjectID, string ModelObjectColID);

        FBDataModel GetModel(string ModelID);

        /// <summary>
        /// 获取字段信息 
        /// </summary>
        /// <param name="ModelID">模型ID</param>
        /// <param name="ObjectID">对象ID</param>
        /// <param name="hasRealtion">是否显示关联字段</param>
        /// <returns></returns>
        List<FBDataModelCols> GetObjectColList(string ModelID, string ObjectID, bool hasRealtion);





        /// <summary>
        /// 获取对象的基本信息
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="ObjectID"></param>
        /// <param name="hasDetail"></param>
        /// <returns></returns>
        FBDataModelObjects GetObjectModel(string ModelID, string ObjectID, bool hasDetail);




        GridViewModel<FBDataObjectCols> GetObjectColumns(string objectid, int currentPage, int perPage, out long totalPages, out long totalItems);
        GridViewModel<FBDataModelCols> GetMainColumns(string modelid, int currentPage, int perPage, out long totalPages, out long totalItems);




        GridViewModel<FBDataModel> GetDataModelList(string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems);
        GridViewModel<FBDataObject> GetObjects(string keyword, int currentPage, int perPage, out long totalPages, out long totalItems);

        /// <summary>
        /// 保存模型基本信息
        /// </summary>
        /// <param name="model"></param>
        void SaveDataModel(FBDataModel model);


        /// <summary>
        /// 保存数据对象信息
        /// </summary>
        /// <param name="model"></param>
        void SaveObject(FBDataModelObjects model);


        void AddObject(string modelID, string objectID);

        /// <summary>
        /// 保存字段信息
        /// </summary>
        /// <param name="model"></param>
        void SaveObjectCols(FBDataObject model);

        /// <summary>
        /// 删除子对象信息
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="objectID"></param>
        void DeleteObject(string ModelID, string objectID, string modelObjectID);

        void SaveAttr(FBDataModel model);

        //begin Web Runtime 使用

        List<JFBSchema> getModelSchemaForWeb(string modelID);

        List<dynamic> getModelDataByDataID(string modelID, string dataid, bool detail);

        /// <summary>
        /// 获取数据模型上的分页数据
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="currentPage"></param>
        /// <param name="perPage"></param>
        /// <param name="filter"></param>
        /// <param name="order"></param>
        /// <param name="totalPages"></param>
        /// <param name="totalItems"></param>
        /// <returns></returns>
        GridViewModel<dynamic> getModelPageList(string modelID, int currentPage, int perPage, string filter, string order, out long totalPages, out long totalItems);




        /// <summary>
        /// 获取模型上所有数据 不分页
        /// </summary>
        /// <param name="modelID"></param>
        /// <param name="filter"></param>
        /// <param name="order"></param>
        /// <returns></returns>
        List<dynamic> getModelData(string modelID, string filter, string order);

        /// <summary>
        /// 获取数据模型加载数据
        /// </summary>
        /// <param name="modeID"></param>
        /// <param name="level"></param>
        /// <param name="path"></param>
        /// <param name="parentID"></param>
        /// <param name="keyWord"></param>
        /// <param name="filter"></param>
        /// <param name="order"></param>
        /// <returns></returns>
        //List<dynamic> getModelTreeData(string modeID, string level, string path, string parentID, string keyWord, string filter, string order);
        List<Dictionary<string, object>> getModelTreeDataDictList(string modeID, string level, string path, string parentID, string keyWord, string filter, string order);


        List<Dictionary<string, object>> getModelTreeDataALL(string modeID, string keyWord, string filter, string order);

        void saveModel(string modelID, DataSet ds, string status);


        void saveModel(string modelID, DataSet ds, string status, TreeNode tree);


        void saveModelALL(string modelID, string dataID, DataSet ds, string status);

        void saveModelList(string modelID, DataSet ds, DataTable dsDel);

        void deleteModel(string modelID, string dataid);

        List<dynamic> getQueryHelpSwitch(string helpID, string keyword, string codeField, string nameField, string filter, bool isParent);



        GridViewModel<dynamic> getDSPageList(string dsID, int currentPage, int perPage, string filter, string order, out long totalPages, out long totalItems);

    }
}
