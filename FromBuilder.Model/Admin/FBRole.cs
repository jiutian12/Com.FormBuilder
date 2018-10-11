using System.Collections.Generic;
using NPoco;

namespace FormBuilder.Model
{

    /// <summary>
    /// 用户角色表
    /// </summary>
    [TableName("FBRole")]
    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBRole
    {
        public string ID { get; set; }
        public string Code { get; set; }
       
        public string Name { get; set; }

        public string Ord { get; set; }

        public string Note { get; set; }

        public string State { get; set; }

    }


    /// <summary>
    /// 角色岗位授权结果表
    /// </summary>
    [TableName("FBAuthPermission")]

    [PrimaryKey("ID", AutoIncrement = false)]
    public class FBAuthPermission
    {

        /// <summary>
        /// 主键
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 授权维度
        /// </summary>
        public string MasterType { get; set; }
        /// <summary>
        /// 角色/岗位ID
        /// </summary>
        public string MasterValue { get; set; }
        /// <summary>
        /// 授权类型 Func 菜单/SetID 数据模型权限/Field 字段权限/Button 按钮权限
        /// </summary>
        public string Access { get; set; }
        /// <summary>
        /// 授权操作 * 无 select 查询update  更新delete 删除 insert 插入
        /// </summary>
        public string AccessOption { get; set; }
        /// <summary>
        /// 授权结果
        /// </summary>
        public string AccessID { get; set; }
    }
}
