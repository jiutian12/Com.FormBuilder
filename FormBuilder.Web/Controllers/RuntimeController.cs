using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FormBuilder.Service;

namespace FormBuilder.Web.Controllers
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
        // GET: Runtime
        public ActionResult Dict(string frmid)
        {
            FormBuilder.Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(frmid);
            model.ToolBarConfig
                = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getToolBarTree(model.ID));
            model.SchemaInfo = Newtonsoft.Json.JsonConvert.SerializeObject(this._serviceModel.getModelSchemaForWeb(model.ModelID));
            return View(model);
        }

        /// <summary>
        /// 卡片视图 Get：Runtime
        /// </summary>
        /// <param name="dataid"></param>
        /// <returns></returns>
        public ActionResult Card(string frmid)
        {
            FormBuilder.Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(frmid);
            model.ToolBarConfig
                = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getToolBarTree(model.ID));
            model.SchemaInfo = Newtonsoft.Json.JsonConvert.SerializeObject(this._serviceModel.getModelSchemaForWeb(model.ModelID));
            return View(model);
        }


        public ActionResult List(string frmid)
        {
            FormBuilder.Model.FBForm model = new Model.FBForm();
            model = this._service.getModel(frmid);
            model.ToolBarConfig
                = Newtonsoft.Json.JsonConvert.SerializeObject(this._service.getToolBarTree(model.ID));
            model.SchemaInfo = Newtonsoft.Json.JsonConvert.SerializeObject(this._serviceModel.getModelSchemaForWeb(model.ModelID));
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