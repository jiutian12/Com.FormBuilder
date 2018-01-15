using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Model;
using FormBuilder.Service;
using FormBuilder.Utilities;
using System.Reflection;
using System.Data;
using System.IO;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class CMPController : Controller
    {
        #region ctr

        IFBCMPService _service;

        public static LogHelper log = LogFactory.GetLogger(typeof(CMPController));

        public CMPController(IFBCMPService service)
        {
            this._service = service;
        }
        #endregion

        #region views
        // GET: SmartHelp
        public ActionResult Index()
        {
            return View();
        }

        // GET: SmartHelp
        public ActionResult List()
        {
            return View();
        }
        // GET: SmartHelp
        public ActionResult Edit()
        {
            return View();
        }
        #endregion


        #region Ajax Request


        [HttpPost]
        // GET: FBMeta
        public JsonResult GetModel(string dataid)
        {
            try
            {
                if (string.IsNullOrEmpty(dataid))
                {
                    return Json(new { res = true, data = new FBDataSource() });
                }
                var model = this._service.getModel(dataid);
                return Json(new { res = true, data = model });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }
        [HttpPost]
        public JsonResult getPageList(string pagesize, string page, string keyword, string order)
        {
            try
            {

                // string page=HttpContext.Request.Form.Get("page");
                long total = 0;
                long totalpage = 0;
                var list = this._service.getPageList(order, keyword, "", int.Parse(page), int.Parse(pagesize), out totalpage, out total);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json(new { error = true, mes = "失败" + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult deleteData(string dataid)
        {
            try
            {
                this._service.deleteData(dataid);
                return Json(new { res = true, mes = "删除成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }



        [HttpPost]
        public JsonResult saveData(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBComponent>(model);
                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                    data.LastModifyTime = data.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = data.CreateUser = SessionProvider.Provider.Current().UserName;
                }
                else
                {
                    data.LastModifyTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = SessionProvider.Provider.Current().UserName;
                }
                this._service.saveData(data);
                return Json(new { res = true, mes = "保存成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        public JsonResult saveMethod(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBCMPMethod>(model);

                this._service.saveMethod(data);
                return Json(new { res = true, mes = "保存成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        [HttpPost]
        public JsonResult addData(string model)
        {
            try
            {
                var data = Newtonsoft.Json.JsonConvert.DeserializeObject<FBComponent>(model);
                if (string.IsNullOrEmpty(data.ID))
                {
                    data.ID = Guid.NewGuid().ToString();
                    data.LastModifyTime = data.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    data.LastModifyUser = data.CreateUser = SessionProvider.Provider.Current().UserName;
                }
                this._service.addData(data);
                return Json(new { res = true, mes = "添加成功" });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }



        [HttpPost]
        // GET: FBMeta
        public JsonResult InvokeMethod(string componentID, string methodName, string paraArr)
        {
            try
            {
                var paraList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(paraArr);

                var res = this._service.invokeMethod(componentID, methodName, paraList);
                return Json(new { res = true, data = res });
            }
            catch (Exception ex)
            {
                log.Error(string.Format("执行构件发生异常 构件ID:{0},方法名：{1} 参数：{2}", componentID, methodName, paraArr), ex);
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }

        private byte[] StreamToBytes(Stream stream)
        {
            byte[] bytes = new byte[stream.Length];
            stream.Read(bytes, 0, bytes.Length);
            // 设置当前流的位置为流的开始
            stream.Seek(0, SeekOrigin.Begin);
            return bytes;
        }

        /// <summary>
        /// 获取dll的方法列表
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult getMethodList()
        {
            try
            {

                HttpPostedFileBase file = Request.Files["file"];
                var path = AppDomain.CurrentDomain.BaseDirectory + "DllTmp/";
                path += file.FileName;

                file.SaveAs(path);


                List<FBComponent> list = new List<FBComponent>();

                Assembly ass = Assembly.Load(StreamToBytes(file.InputStream));


                foreach (var type in ass.GetTypes())
                {

                    FBComponent model = new FBComponent();
                    model.AssemblyName = type.Namespace;
                    model.ClassName = type.Name;
                    MethodInfo[] members = type.GetMethods(BindingFlags.Public | BindingFlags.Instance);//
                    model.MethodList = new List<FBCMPMethod>();
                    foreach (MethodInfo member in members)
                    {
                        if (member.Name != "ToString"
                                  && member.Name != "Equals"
                                  && member.Name != "GetHashCode"
                                  && member.Name != "GetType")
                        {
                            FBCMPMethod mMethod = new FBCMPMethod();
                            mMethod.MethodName = member.Name;
                            mMethod.ReturnType = getByType(member.ReturnType);
                            mMethod.ParaList = new List<FBCMPPara>();

                            foreach (var para in member.GetParameters())
                            {


                                FBCMPPara mPara = new FBCMPPara();

                                mPara.ParamName = para.Name;
                                mPara.ParamType = getByType(para.ParameterType);
                                mMethod.ParaList.Add(mPara);

                            }
                            model.MethodList.Add(mMethod);

                        }

                        //Console.WriteLine(type.Name + "." + member.Name);
                    }
                    list.Add(model);
                }

                return Json(new { res = true, data = list });
            }
            catch (Exception ex)
            {
                return Json(new { res = false, mes = "操作失败" + ex.Message });
                //throw ex;
            }
        }


        private string getByType(Type t)
        {
            var def = "";
            if (t.Equals(typeof(System.String)))
            {
                def = "1";
            }
            else if (t.Equals(typeof(void)))
            {
                def = "0";
            }
            else if (t.Equals(typeof(DataSet)))
            {
                def = "3";
            }
            else if (t.Equals(typeof(DataTable)))
            {
                def = "4";
            }
            else
            {
                def = "2";
            }
            return def;
        }

        #endregion
    }
}