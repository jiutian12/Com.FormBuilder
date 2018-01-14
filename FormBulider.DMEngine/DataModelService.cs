using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;

namespace FormBulider.DMEngine
{
    public class DataModelService
    {
        #region ctr
        private DataModel modelInfo;

        public DataModelService()
        {
        }
        public DataModelService(DataModel modelInfo)
        {
            this.modelInfo = modelInfo;
        }

        public void setModel(DataModel modelInfo)
        {
            this.modelInfo = modelInfo;
        }
        #endregion

        /// <summary>
        /// 根据列ID获取字段信息
        /// </summary>
        /// <param name="colid">列ID</param>
        /// <returns></returns>
        public Column getElementByID(string colid)
        {
            return null;
        }

        /// <summary>
        /// 通过标签获取列信息
        /// </summary>
        /// <param name="colid"></param>
        /// <returns></returns>
        public Column getElementByLabel(string colid)
        {
            return null;
        }

        /// <summary>
        /// 通过字段名称获取列信息
        /// </summary>
        /// <param name="colid"></param>
        /// <returns></returns>
        public Column getElementByCode(string colid)
        {
            return null;
        }
        /// <summary>
        /// 获取主对象的主键等信息
        /// </summary>
        /// <returns></returns>
        public Column getPrimaryInfo()
        {
            return null;
        }

        /// <summary>
        /// 获取主对象的字段列表 包含关联条件
        /// </summary>
        /// <returns></returns>
        public List<Column> getColList()
        {
            return null;
        }

        //##query
        //字段信息
        //表名关联
        //过滤条件
        //排序
        //分组
        //##InsertOrUpdate
        //序列化DataSet 
        //根据model拼接成相关SQL 保存 新增 主从
        //##Delete
        //根据模型生成删除sql主从删 还是删除主表




    }
}
