using NPoco;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service.Impl
{

    /// <summary>
    /// 数据模型的扩展接口  处理 删除 和修改 时候的处理
    /// </summary>
    public interface IFBModelExtend
    {

        /// <summary>
        /// 保存前事件扩展
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="ds"></param>
        /// <param name="Status"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        string BeforeSave(string ModelID, DataSet ds, string Status, Database db);

        /// <summary>
        /// 保存后事件扩展
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="ds"></param>
        /// <param name="Status"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        string AfterSave(string ModelID, DataSet ds, string Status, Database db);


        /// <summary>
        /// 删除前扩展
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="DataID"></param>
        /// <param name="db"></param>
        /// <returns></returns>

        string BeforeDelete(string ModelID, string DataID, Database db);

        /// <summary>
        /// 删除后扩展
        /// </summary>
        /// <param name="ModelID"></param>
        /// <param name="DataID"></param>
        /// <param name="db"></param>
        /// <returns></returns>

        string AfterDelete(string ModelID, string DataID, Database db);
    }
}
