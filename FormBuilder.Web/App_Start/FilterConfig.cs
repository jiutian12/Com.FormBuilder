

using System.Web.Mvc;

namespace FormBuilder.Web.App_Start
{
    public class FilterConfig
    {
        public static void Configure(System.Web.Mvc.GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute() );
            //filters.Add(new AuthenticationAttribute());
        }
    }
}
