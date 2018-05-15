using System.Web.Mvc;
using FormBuilder.DataAccess.Interface;
using FormBuilder.Service;
using Ninject;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class HomePageController : Controller
    {

        IFBDataObjectService _service;
        public HomePageController(IFBDataObjectService service)
        {
            this._service = service;
        }
        // GET: Home
        public ActionResult Index()
        {

            //IKernel ninjectKernel = new StandardKernel();
            //ninjectKernel.Load("Config/NInject/*.xml");
            //FBDataObjectService s = ninjectKernel.Get<FBDataObjectService>();
            return View("~/Settings/DBConnection");
        }


        public ActionResult Home()
        {

            //IKernel ninjectKernel = new StandardKernel();
            //ninjectKernel.Load("Config/NInject/*.xml");
            //FBDataObjectService s = ninjectKernel.Get<FBDataObjectService>();
            return View();
        }

        
        public ActionResult Main()
        {

            //IKernel ninjectKernel = new StandardKernel();
            //ninjectKernel.Load("Config/NInject/*.xml");
            //FBDataObjectService s = ninjectKernel.Get<FBDataObjectService>();
            return View();
        }

        /// <summary>
        /// 添加一条数据
        /// </summary>
        public void AddData()
        {
            this._service.AddData(null);
        }
    }
}