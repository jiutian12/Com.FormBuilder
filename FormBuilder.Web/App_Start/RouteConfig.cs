using System.Web.Mvc;
using System.Web.Routing;

namespace FormBuilder.Web.App_Start
{
    public class RouteConfig
    {
        public static void Configure(RouteCollection routes)
        {
            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
            //    namespaces: new string[] { "FormBuilder.Web.Controllers" }
            //);

            //routes.MapRoute(
            //    name: "FormBuilder",
            //    url: "FormBuilder/{controller}/{action}/{id}",
            //    defaults: new { area = "FormBuilder", controller = "Home", action = "Index" }, //默认主页  
            //    namespaces: new string[] { "FormBuilder.Web.Areas.FormBuilder.Controllers" }
            //);
            //  routes.MapRoute(
            //    "Default",
            //    "FormBuilder/{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
            //    namespaces: new string[] { "FormBuilder.Web.Areas.FormBuilder.Controllers" }
            //);
        }
    }
}