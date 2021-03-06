﻿using FormBuilder.Utilities;
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

            var returnURL = filterContext.HttpContext.Request.Url.ToString();
            if (ConfigHelper.getAppSettings("loginurlBase64") == "1")
            {
                returnURL = BASE64.EnCode(returnURL);
            }
            try
            {
                if (SessionProvider.Provider.IsOverdue())
                {
                    filterContext.Result = new RedirectResult(ConfigHelper.getAppSettings("loginurl") + returnURL); // new RedirectToRouteResult(new RouteValueDictionary { { "from", filterContext.HttpContext.Request.Url.ToString() } });
                }

            }
            catch (Exception ex)
            {
                filterContext.Result = new RedirectResult(ConfigHelper.getAppSettings("loginurl") + returnURL);
            }
            base.OnActionExecuting(filterContext);
            //if (filterContext.HttpContext.Session["username"] == null)
            //    filterContext.Result = new RedirectResult(ConfigHelper.getAppSettings("loginurl") +BASE64.EnCode(filterContext.HttpContext.Request.Url.ToString())); // new RedirectToRouteResult(new RouteValueDictionary { { "from", filterContext.HttpContext.Request.Url.ToString() } });
            //base.OnActionExecuting(filterContext);

        }
    }

    public class AjaxAuthenticationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            //var returnURL = filterContext.HttpContext.Request.Url.ToString();
            
            ContentResult Content = new ContentResult();

            try
            {
                if (SessionProvider.Provider.IsOverdue())
                {
                    Content.Content = Newtonsoft.Json.JsonConvert.SerializeObject(new { res = false, error = true, mes = "身份验证失效,请重新登录", redirect = ConfigHelper.getAppSettings("loginurl")  });
                    filterContext.Result = Content;
                }

            }
            catch (Exception ex)
            {
                Content.Content = Newtonsoft.Json.JsonConvert.SerializeObject(new { res = false, error = true, mes = ex.Message, redirect = ConfigHelper.getAppSettings("loginurl")  });
                filterContext.Result = Content;
            }
            base.OnActionExecuting(filterContext);
            //if (filterContext.HttpContext.Session["username"] == null)
            //    filterContext.Result = new RedirectResult(ConfigHelper.getAppSettings("loginurl") +BASE64.EnCode(filterContext.HttpContext.Request.Url.ToString())); // new RedirectToRouteResult(new RouteValueDictionary { { "from", filterContext.HttpContext.Request.Url.ToString() } });
            //base.OnActionExecuting(filterContext);

        }
    }

}