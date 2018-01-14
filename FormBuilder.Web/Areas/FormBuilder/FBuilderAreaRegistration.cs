using FormBuilder.Web.App_Start;
using System.Web.Mvc;
using System.Web.Optimization;

namespace FormBuilder.Web.Areas.FormBuilder
{
    public class FBuilderAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "FormBuilder";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            // 这里还得注册自定义Filter
            context.MapRoute(
                "FormBuilder_default",
                "FormBuilder/{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new string[] { "FormBuilder.Web.Areas.FormBuilder.Controllers" }
            );
        }
    }
}