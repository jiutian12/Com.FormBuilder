using FormBuilder.Model;
using NPoco;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Service
{
    public class DMTreeHelper
    {

        public Database db;
        public JFBTreeStruct tree { get; set; }
        /// <summary>
        /// 是否父子模式
        /// </summary>
        /// <param name="tree"></param>
        /// <returns></returns>
        public bool isParent()
        {
            if (tree.parentid != "" && tree.id != "")
                return true;
            return false;
        }
        public bool isPath()
        {
            if (tree.grade != "" && tree.level != "")
                return true;
            return false;
        }

        /// <summary>
        /// 获取最大分级码
        /// </summary>
        /// <param name="tree"></param>
        /// <param name="path"></param>
        /// <param name="level"></param>
        /// <param name="isSame"></param>
        /// <returns></returns>
        public string getMaxPath(FBDataModelObjects objectModel, string path, string level, bool isSame, ref DataSet ds)
        {



            if (string.IsNullOrEmpty(level))
            {
                level = "1";
            }
            var format = tree.format == "" ? "44444444444444444444" : tree.format;
            var formatIndexLen = 4;
            var alllen = 0;
            //var indexLen = 0;
            var i = 1;
            foreach (var len in format)
            {
                //indexLen += int.Parse(len.ToString());
                //2
                if (i >= int.Parse(level))
                {
                    formatIndexLen = Convert.ToInt32(len.ToString());
                    if (!isSame)
                    {
                        alllen += int.Parse(len.ToString());
                    }
                    break;
                }
                alllen += int.Parse(len.ToString());
                i++;
            }
            if (isSame)
            {

                path = path.Substring(0, alllen); //3001
                //处理path
            }
            else
            {
                level = (int.Parse(level) + 1).ToString();
            }
            var sql = "select max({0}) from {1} where {0} like '{2}%' and {3}='{4}'";
            sql = string.Format(sql, tree.grade, objectModel.Code, path, tree.level, level);

            var maxPath = db.Single<string>(sql);

            if (string.IsNullOrEmpty(maxPath))
            {
                maxPath = path + "1".ToString().PadLeft(formatIndexLen, '0');
            }
            else
            {
                maxPath = maxPath.Substring(0, alllen)
                    + (int.Parse(maxPath.Substring(alllen, maxPath.Length - alllen)) + 1).ToString().PadLeft(formatIndexLen, '0');
            }
            ds.Tables[0].Rows[0][tree.grade] = maxPath;
            return maxPath;
        }

        public void updateParentMXField(FBDataModelObjects objectModel, string dataid, Dictionary<string, object> dict)
        {


            string parentID = dict[this.tree.parentid].ToString();
            var tableName = objectModel.Code;

            //this.tree = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTreeStruct>(objectModel.Tree);

            if (!string.IsNullOrEmpty(this.tree.parentid))
            {
                //父子结构
                string vssql = "select count(1) from {0} where {1}=@0";


                vssql = string.Format(vssql, objectModel.Code, this.tree.parentid);


                if (db.ExecuteScalar<long>(new Sql(vssql, parentID)) == 0)
                {


                    Sql execSql = new Sql(string.Format("update {0} set {1}=@1 where {2}=@0", objectModel.Code, this.tree.isdetail, objectModel.PKCOLName), parentID, 1);
                    db.Execute(execSql);
                }

            }
        }


        public void updateMXField(FBDataModelObjects objectModel, TreeNode tree)
        {
            this.tree = Newtonsoft.Json.JsonConvert.DeserializeObject<JFBTreeStruct>(objectModel.Tree);
            var sql = "update {0} set {1}='0' where {2}='{3}'";

            if (!string.IsNullOrEmpty(this.tree.isdetail))
            {

                var datatypeList = objectModel.ColList.Where(p => p.Code == this.tree.isdetail).ToList();
                if (datatypeList.Count == 1 && datatypeList[0].DataType == "6")
                {
                    //bit类型
                    sql = "update {0} set {1}=@0 where {2}='{3}'";
                    Sql execSql = new Sql(string.Format(sql, objectModel.Code, this.tree.isdetail, objectModel.PKCOLName, tree.dataid), false);
                    db.Execute(execSql);
                }
                else
                {
                    Sql execSql = new Sql(string.Format(sql, objectModel.Code, this.tree.isdetail, objectModel.PKCOLName, tree.dataid));
                    db.Execute(execSql);
                }
            }
            if (!string.IsNullOrEmpty(this.tree.ischild) && this.tree.ischild != this.tree.isdetail)
            {
                // 是否child定义并且 两个字段不一致 才更新 一致的话不更新
                var datatypeList = objectModel.ColList.Where(p => p.Code == this.tree.ischild).ToList();


                if (datatypeList.Count == 1 && datatypeList[0].DataType == "6")
                {
                    //bit类型
                    sql = "update {0} set {1}=@0 where {2}='{3}'";
                    Sql execSql = new Sql(string.Format(sql, objectModel.Code, this.tree.ischild, objectModel.PKCOLName, tree.dataid), false);
                    db.Execute(execSql);
                }
                else
                {
                    Sql execSql = new Sql(string.Format(sql, objectModel.Code, this.tree.ischild, objectModel.PKCOLName, tree.dataid));
                    db.Execute(execSql);
                }
            }
        }
    }
}
