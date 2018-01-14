using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormBuilder.Model;
using FormBuilder.Utilities;
using NPoco;
using FormBuilder.Repository;
using System.IO;
using FormBuilder.DataAccess.Interface;

namespace FormBuilder.Service
{

    public class FBMeta
    {
        private static void Save(FBMetaData model, Database db)
        {


            db.Save<FBMetaData>(model);

        }

        /// <summary>
        /// 添加元数据管理
        /// </summary>
        /// <param name="id"></param>
        /// <param name="code"></param>
        /// <param name="name"></param>
        /// <param name="type">0数据对象 1数据模型 2帮助 3表单 4构件</param>
        /// <param name="db"></param>
        public static void AddMeataData(string id, string code, string name, string type, string parentID, Database db)
        {
            FBMetaData model = new FBMetaData();
            model.ID = id;
            model.Code = code;
            model.Name = name;
            model.Type = type;
            model.IsFolder = "0";
            model.ParentID = parentID;
            model.UserID = SessionProvider.Provider.Current().UserID;
            model.LastModifyTime = model.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            model.LastModifyUser = model.CreateUser = SessionProvider.Provider.Current().UserName;
            Save(model, db);
        }

        public static void AddMeataData(FBMetaData model, Database db)
        {
            model.IsFolder = "1";
            model.UserID = SessionProvider.Provider.Current().UserID;
            model.CreateTime = model.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            model.CreateUser = model.LastModifyUser = SessionProvider.Provider.Current().UserName;
            model.Type = "9";
            Save(model, db);
        }

        public static void UpdateFolderName(string name, string id, Database db)
        {
            FBMetaData model = new FBMetaData();

            model.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            model.LastModifyUser = SessionProvider.Provider.Current().UserName;
            var sql = new Sql("update FBMetaData set name=@0,LastModifyTime=@1,LastModifyUser=@2 where id=@3", name, model.LastModifyTime, model.LastModifyUser, id);
            db.Execute(sql);
        }

        public static void UpdateMeataInfo(string name, string code, string id, Database db)
        {
            FBMetaData model = new FBMetaData();

            model.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            model.LastModifyUser = SessionProvider.Provider.Current().UserName;
            var sql = new Sql("update FBMetaData set name=@0, code=@4 ,LastModifyTime=@1,LastModifyUser=@2 where id=@3", name, model.LastModifyTime, model.LastModifyUser, id, code);
            db.Execute(sql);
        }

        /// <summary>
        /// 移动文件夹
        /// </summary>
        /// <param name="data"></param>
        /// <param name="targetID"></param>
        /// <param name="db"></param>
        public static void MoveMetaData(List<string> data, string targetID, Database db)
        {
            FBMetaData model = new FBMetaData();

            model.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            model.LastModifyUser = SessionProvider.Provider.Current().UserName;
            foreach (var id in data)
            {
                var sql = new Sql("update FBMetaData set parentid=@0,LastModifyTime=@1,LastModifyUser=@2 where id=@3", targetID, model.LastModifyTime, model.LastModifyUser, id);
                db.Execute(sql);
            }

        }

        public static void UpdateMetaData(string id, string code, string name, Database db)
        {
            FBMetaData model = new FBMetaData();
            model.ID = id;
            model.Code = code;
            model.Name = name;
            model.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            model.LastModifyUser = SessionProvider.Provider.Current().UserName;
            Sql sql = new Sql("udpate FBMetaData set Code=@0,Name=@1,LastModifyTime=@2,LastModifyUser=@3 where ID=@4", model.Code, model.Name, model.LastModifyTime, model.LastModifyUser, model.ID);
            db.Execute(sql);
        }


        public static void DeleteMetaData(string id, Database db)
        {
            Sql sql = new Sql("Delete from  FBMetaData  where  ID=@0", id);


            db.Execute(sql);
            sql = new Sql("Delete from  FBMetaDependence  where  SourceID=@0", id);


            db.Execute(sql);
        }


        public static void SaveDependence(string sourceID, List<FBMetaDependence> list, Database db)
        {
            Sql sql = new Sql("Delete from  FBMetaDependence  where  sourceID=@0 ", sourceID);
            db.Execute(sql);
            foreach (var model in list)
            {

                db.Insert<FBMetaDependence>(model);
            }
        }

        public static List<JFBMetaDependence> getDependList(string sourceID, Database db)
        {
            var sql = new Sql(
                @" select  c.id,c.type,c.name,e.Name as lx from  FBMetaDependence  a
                    left join  FBMetaData b on b.ID=a.SourceID
                    left join  FBMetaData c on c.ID=a.TargetID
                    left join FBMetaType e on e.Code=c.Type
                where  sourceID=@0 ", sourceID);
            List<JFBMetaDependence> list = db.Fetch<JFBMetaDependence>(sql);

            return list;
        }
        public static List<JFBMetaDependence> getDependTargetList(string targetID, Database db)
        {
            var sql = new Sql(
                @" select  b.id,b.type,b.name,e.Name as lx from  FBMetaDependence  a
                    left join  FBMetaData b on b.ID=a.SourceID
                    left join  FBMetaData c on c.ID=a.TargetID
                    left join FBMetaType e on e.Code=b.Type
                where  targetID=@0 ", targetID);
            List<JFBMetaDependence> list = db.Fetch<JFBMetaDependence>(sql);

            return list;
        }

        public static List<JFBMetaDependence> deleteCheck(string TargetID, out string tips, Database db)
        {
            var sql = new Sql(
                @" select  b.id,b.type,b.name,e.Name as lx from  FBMetaDependence  a
                    left join  FBMetaData b on b.ID=a.SourceID
                    left join  FBMetaData c on c.ID=a.TargetID
                    left join FBMetaType e on e.Code=b.Type
                where  TargetID=@0 ", TargetID);
            List<JFBMetaDependence> list = db.Fetch<JFBMetaDependence>(sql);
            StringBuilder mes = new StringBuilder();
            if (list.Count > 0)
                mes.Append("您的元数据已经被如下列表引用：</br>");
            foreach (var item in list)
            {
                mes.AppendFormat("类型:{0};名称:{1};元数据ID:{2}", item.lx, item.name, item.id);
                mes.Append("</br>");
            }
            tips = mes.ToString();
            return list;
        }



        public static void deleteCheck(string TargetID, Database db)
        {
            string mes = "";
            var list = deleteCheck(TargetID, out mes, db);
            if (list.Count > 0)
            {
                throw new Exception("删除失败！</br>" + mes);
            }
        }
    }

}
