using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace FormBuilder.ExportTool
{

    public class ExportPackage
    {
        public string metaType { get; set; }


        public List<TableInfo> list { get; set; }


    }

    public class TableInfo
    {
        public string key { get; set; }
        public string pk { get; set; }
        public string tablename { get; set; }

        public bool ismain { get; set; } = false;

        public string desc { get; set; }
    }


    public class SQLBuilder
    {
        private static List<ExportPackage> pkglist = new List<ExportPackage>();

        public static Database db;
        static SQLBuilder()
        {
            XmlDocument doc = new XmlDocument();
            doc.Load("table.config");
            XmlNodeList schoolNodeList = doc.SelectNodes("/root/package");
            //  ExportPackage pkg = new ExportPackage();
            foreach (XmlNode item in schoolNodeList)
            {
                ExportPackage pkg = new ExportPackage();
                pkg.list = new List<TableInfo>();
                pkg.metaType = item.Attributes["id"].InnerText;
                var name = item.Attributes["name"];
                foreach (XmlNode table in item.ChildNodes)
                {
                    TableInfo tb = new TableInfo();
                    tb.key = table.Attributes["key"].InnerText;
                    tb.tablename = table.Attributes["tablename"].InnerText;
                    tb.pk = table.Attributes["pk"].InnerText;
                    tb.desc = table.Attributes["desc"].InnerText;
                    tb.ismain = table.Attributes["ismain"].InnerText == "1" ? true : false;
                    pkg.list.Add(tb);
                }

                pkglist.Add(pkg);
            }

        }


        public static string buildSql(string metaid, string metatype)
        {
            try
            {
                if (string.IsNullOrEmpty(metatype)) metatype = "9";
                StringBuilder sb = new StringBuilder();
                var model = pkglist.FirstOrDefault(n => n.metaType == metatype);
                if (model != null)
                {
                    foreach (var item in model.list)
                    {
                        var data = getMetaData(item, metaid);
                        sb.Append(generateSql(item, data, metaid));
                    }

                }
                return sb.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        public static List<Dictionary<string, object>> getMetaData(TableInfo tb, string dataid)
        {
            var sql = "select * from {0} where {1}=@0";
            sql = string.Format(sql, tb.tablename, tb.key);
            var selectSql = new Sql(sql, dataid);
            List<Dictionary<string, object>> list = db.Fetch<Dictionary<string, object>>(selectSql);
            return list;
        }


        public static string generateSql(TableInfo tb, List<Dictionary<string, object>> list, string dataid)
        {
            if (list.Count == 0) return string.Empty;

            StringBuilder sb = new StringBuilder();
            sb.Append("/*" + tb.desc + "*/");
            sb.Append("\r\n");
            var delTmpl = string.Format("delete from {0} where {1}='{2}';", tb.tablename, tb.key, dataid);
            var tmpl = @"insert into {0}({1}) values({2});";


            var cols = "";


            var dict = list[0];
            foreach (var key in dict)
            {
                cols += ",`" + key.Key + "`";
            }
            cols = cols.Substring(1);

            var count = 0;
            foreach (var row in list)
            {
                var valuestr = "";
                foreach (var key in row)
                {

                    if (key.Value != null)
                    {
                        valuestr += ",'" + key.Value.ToString().Replace("'", "''") + "'";
                    }
                    else
                    {
                        valuestr += ",''";
                    }
                }
                valuestr = valuestr.Substring(1);
                if (count == 0)
                {
                    //第一行才生成删除sql
                    sb.Append(delTmpl);
                    sb.Append("\r\n");
                }
                sb.AppendFormat(tmpl, tb.tablename, cols, valuestr);
                sb.Append("\r\n");
                count++;
            }
            sb.Append("GO\r\n");
            return sb.ToString();
        }


    }
}
