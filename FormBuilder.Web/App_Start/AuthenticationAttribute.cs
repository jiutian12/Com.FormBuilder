using FormBuilder.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace FormBuilder.Web.App_Start
{
    public class AuthenticationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            if (SessionProvider.Provider.IsOverdue())
            {


                var returnURL = filterContext.HttpContext.Request.Url.ToString();
                if (ConfigHelper.getAppSettings("loginurlBase64") == "1")
                {
                    returnURL = BASE64.EnCode(returnURL);
                }

                filterContext.Result = new RedirectResult(ConfigHelper.getAppSettings("loginurl") + returnURL); // new RedirectToRouteResult(new RouteValueDictionary { { "from", filterContext.HttpContext.Request.Url.ToString() } });
            }
            base.OnActionExecuting(filterContext);
            //if (filterContext.HttpContext.Session["username"] == null)
            //    filterContext.Result = new RedirectResult(ConfigHelper.getAppSettings("loginurl") +BASE64.EnCode(filterContext.HttpContext.Request.Url.ToString())); // new RedirectToRouteResult(new RouteValueDictionary { { "from", filterContext.HttpContext.Request.Url.ToString() } });
            //base.OnActionExecuting(filterContext);
        }
    }
}