using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Service;
using FormBuilder.Utilities;
using FormBuilder.Web.App_Start;

namespace FormBuilder.Web.Areas.FormBuilder.Controllers
{
    public class RuntimeController : Controller
    {
        #region ctr

        IFBFormService _service;

        IFBDataModelService _serviceModel;

        IFBSmartHelpService _serviceHelp;



        public RuntimeController(IFBFormService service, IFBDataModelService serviceModel, IFBSmartHelpService serviceHelp)
        {
            this._service = service;
            this._serviceModel = serviceModel;
            this._serviceHelp = serviceHelp;
        }
        #endregion

        [Authentication]
        // GET: Runtime
        public ActionResult Dict(string frmid)
        {
            Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(frmid);
            model.ToolBarConfig
                = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getToolBarTree(model.ID, true));
            model.SchemaInfo = Newtonsoft.Json.JsonConvert.SerializeObject(this._serviceModel.getModelSchemaForWeb(model.ModelID));

            model.dsSchema = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getCustomDSSchema(frmid));

            if (!string.IsNullOrEmpty(model.ExpressInfo))
                model.ExpressInfo = BASE64.DeCode(model.ExpressInfo);

            return View(model);
        }

        /// <summary>
        /// 卡片视图 Get：Runtime
        /// </summary>
        /// <param name="dataid"></param>
        /// <returns></returns>
        public ActionResult Card(string frmid)
        {
            Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(frmid);
            model.ToolBarConfig
                = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getToolBarTree(model.ID, true));
            model.SchemaInfo = Newtonsoft.Json.JsonConvert.SerializeObject(this._serviceModel.getModelSchemaForWeb(model.ModelID));
            model.dsSchema = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getCustomDSSchema(frmid));
            if (!string.IsNullOrEmpty(model.ExpressInfo))
                model.ExpressInfo = BASE64.DeCode(model.ExpressInfo);
            return View(model);
        }


        public ActionResult List(string frmid)
        {
            Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(frmid);
            model.ToolBarConfig
                = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getToolBarTree(model.ID, true));
            model.SchemaInfo = Newtonsoft.Json.JsonConvert.SerializeObject(this._serviceModel.getModelSchemaForWeb(model.ModelID));
            model.dsSchema = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getCustomDSSchema(frmid));
            if (!string.IsNullOrEmpty(model.ExpressInfo))
                model.ExpressInfo = BASE64.DeCode(model.ExpressInfo);
            return View(model);
        }

        public ActionResult ListRequire(string frmid)
        {
            Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(frmid);
            model.ToolBarConfig
                = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getToolBarTree(model.ID, true));
            model.SchemaInfo = Newtonsoft.Json.JsonConvert.SerializeObject(this._serviceModel.getModelSchemaForWeb(model.ModelID));
            model.dsSchema = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getCustomDSSchema(frmid));
            if (!string.IsNullOrEmpty(model.ExpressInfo))
                model.ExpressInfo = BASE64.DeCode(model.ExpressInfo);
            return View(model);
        }

        public ActionResult Preview(string dataid)
        {
            Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(dataid);
            if (model.Type == "1")
            {
                Response.Redirect("Dict?frmid=" + dataid);


            }
            else if (model.Type == "2")
            {
                Response.Redirect("List?frmid=" + dataid);
            }
            else
            {
                Response.Redirect("Card?frmid=" + dataid);
            }
            return View(model);
        }

        /// <summary>
        /// 普通列表帮助
        /// </summary>
        /// <returns></returns>
        public ActionResult ListLookUp()
        {
            var helpid = Request.QueryString["dataid"];
            var model = this._serviceHelp.getRuntimeModel(helpid);
            return View(model);
        }



    }
}