using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;

namespace FormBuilder.Service
{

    public interface IFBFormService : IDisposable
    {


        void addData(FBForm model);

        FBForm getModel(string helpid);

        /// <summary>
        /// 获取表单数据源的字段合集
        /// </summary>
        /// <param name="frmID"></param>
        /// <param name="dmID"></param>
        /// <returns></returns>
        List<JFBFormDS> getFormDS(string frmID, string dmid);

        void saveData(FBForm model);

        void publicPage(FBForm model);


        List<FBFormLink> getFormLink(string fromID, string keyword);
        void deleteData(string helpid);


        GridViewModel<FBForm> getPageList(string type, string keyword, int currentPage, int perPage, out long totalPages, out long totalItems);


        GridViewModel<JFBMetaDependence> getDepenceList(string type, string keyword, string id, int currentPage, int perPage, out long totalPages, out long totalItems);

        void savePage(FBForm model);
        void saveAttr(FBForm model);
        void pubUserResource(FBForm model, List<FBFormLink> linkList);

        void saveDefaultValue(string data, string formID);

        #region 表单工具栏接口

        /// <summary>
        /// 添加一个工具条信息
        /// </summary>
        /// <param name="model"></param>
        void addToolBar(FBFormToolBar model);

        /// <summary>
        /// 删除一个工具条 并删除孩子节点
        /// </summary>
        /// <param name="id"></param>
        void removeToolBar(string id);

        /// <summary>
        /// 保存单个工具条项
        /// </summary>
        /// <param name="model"></param>
        void saveToolBar(FBFormToolBar model);

        /// <summary>
        /// 保存多个工具栏项
        /// </summary>
        /// <param name="list"></param>
        void saveToolBarList(List<FBFormToolBar> list);

        /// <summary>
        /// 获取工具条树
        /// </summary>
        /// <param name="frmID"></param>
        List<FBFormToolBar> getToolBarTree(string frmID, bool isUsed = false);


        /// <summary>
        /// 获取工具条
        /// </summary>
        /// <param name="frmID"></param>
        /// <returns></returns>
        List<FBFormToolBar> getToolBarRoot(string frmID);

        /// <summary>
        /// 获取工具条的详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        FBFormToolBar getToolBar(string id);


        #endregion




        #region 表单引入数据源接口
        /// <summary>
        /// 删除引入数据源
        /// </summary>
        /// <param name="frmID">表单id</param>
        /// <param name="ids">数据源ID 多条</param>
        void deleteDSInfo(string frmID, string ids);


        /// <summary>
        /// 获取表单已经引入的数据源
        /// </summary>
        /// <param name="frmID"></param>
        /// <param name="keyword"></param>
        /// <param name="order"></param>
        /// <param name="currentPage"></param>
        /// <param name="perPage"></param>
        /// <param name="totalPages"></param>
        /// <param name="totalItems"></param>
        /// <returns></returns>
        GridViewModel<FBDataSource> getDSImport(string frmID, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems);

        /// <summary>
        /// 获取表单已未引入的数据源
        /// </summary>
        /// <param name="frmID"></param>
        /// <param name="keyword"></param>
        /// <param name="order"></param>
        /// <param name="currentPage"></param>
        /// <param name="perPage"></param>
        /// <param name="totalPages"></param>
        /// <param name="totalItems"></param>
        /// <returns></returns>
        GridViewModel<FBDataSource> getDSNotImport(string frmID, string keyword, string order, int currentPage, int perPage, out long totalPages, out long totalItems);

        /// <summary>
        /// 保存引入的数据源
        /// </summary>
        /// <param name="frmID"></param>
        /// <param name="list"></param>
        void saveDsInfo(string frmID, List<FBFormDS> list);


        List<JFBDSSchema> getCustomDSSchema(string frmID);


        /// <summary>
        /// 保存表单引用的字段集合
        /// </summary>
        /// <param name="FormID"></param>
        /// <param name="list"></param>
        /// 
        void saveFormRef(string FormID, List<FBFormRef> list);
        #endregion
    }
}
