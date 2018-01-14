using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace FormBuilder.Web.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            #region 脚本Bundle
            //通用脚本Jquery JqueryUI 和BootStrap //可以打包
            bundles.Add(new ScriptBundle("~/Bundle/Scripts/Common")
                .Include("~/DList/jquery-1.10.2.min.js")
                .Include("~/DList/jquery-ui/jquery-ui.js")
                .Include("~/DList/bootstrap/js/bootstrap.min.js")
                .Include("~/Scripts/Utils/Guid.js")
                .Include("~/Scripts/Utils/Base64.js")
                 .Include("~/Scripts/config.js")
                .Include("~/Scripts/FrameWork/Core.js"));


            //通用脚本Jquery Guid Base 64 合并 config 全局站点配置 
            bundles.Add(new ScriptBundle("~/Bundle/Scripts/RuntimeCommon")
                .Include("~/DList/jquery-1.10.2.min.js")
                .Include("~/Scripts/Utils/Guid.js")
                .Include("~/Scripts/Utils/Base64.js")
                .Include("~/Scripts/config.js")
                .Include("~/Scripts/FrameWork/Core.js"));

            bundles.Add(new ScriptBundle("~/Bundle/Scripts/Layer")
                 .Include("~/DList/layer/layer.js"));

            //Angular 库 
            bundles.Add(new ScriptBundle("~/Bundle/Scripts/Angular")
                .Include("~/DList/angular/angular.js")
                .Include("~/DList/angular/angular-animate.js")
                .Include("~/DList/ngdialog/ngDialog.min.js"));

            //Angular 基础封装库
            bundles.Add(new ScriptBundle("~/Bundle/Scripts/AngularBase")
             .Include("~/Scripts/Base/ng.directive.js")
             .Include("~/Scripts/Base/ng.service.js"));

            //业务组件根据需要引入

            bundles.Add(new ScriptBundle("~/Bundle/Scripts/WDate")
            .Include("~/DList/DatePicker/WdatePicker.js"));

            //状态机
            bundles.Add(new ScriptBundle("~/Bundle/Scripts/StateMachine")
          .Include("~/DList/StateMachine/state-machine.js"));

            // 上传插件
            bundles.Add(new ScriptBundle("~/Bundle/Scripts/WebUploader")
                .Include("~/DList/webupload/webuploader.js"));

            //表单设计UI脚本 //可以打包
            bundles.Add(new ScriptBundle("~/Bundle/Scripts/LEEUI")
                .Include("~/DList/nicevalidator/jquery.validator.js")
                .Include("~/DList/nicevalidator/local/zh-CN.js")
                .Include("~/DList/leeui/js/Core.js")
                .Include("~/DList/leeui/js/Drag.js")
                .Include("~/DList/leeui/js/Resize.js")
                .Include("~/DList/leeui/js/Button.js")
                .Include("~/DList/leeui/js/ToolTip.js")
                .Include("~/DList/leeui/js/Messager.js")
                .Include("~/DList/leeui/js/Radio.js")
                .Include("~/DList/leeui/js/RadioList.js")
                .Include("~/DList/leeui/js/CheckBox.js")
                .Include("~/DList/leeui/js/CheckList.js")
                .Include("~/DList/leeui/js/Combox.js")
                .Include("~/DList/leeui/js/TextBox.js")
                .Include("~/DList/leeui/js/Popup.js")
                .Include("~/DList/leeui/js/Lookup.js")
                .Include("~/DList/leeui/js/DateTime.js")
                .Include("~/DList/leeui/js/Spinner.js")
                .Include("~/DList/leeui/js/Dialog.js")
                .Include("~/DList/leeui/js/Grid.Defaults.js")
                .Include("~/DList/leeui/js/Grid.js")
                .Include("~/DList/leeui/js/Grid.Render.js")
                .Include("~/DList/leeui/js/Layout.js")
                .Include("~/DList/leeui/js/Menu.js")
                .Include("~/DList/leeui/js/ToolBar.js")
                .Include("~/DList/leeui/js/Tree.js")
                .Include("~/DList/leeui/js/Tab.js")
                .Include("~/DList/leeui/js/Pager.js")
                .Include("~/DList/leeui/js/ListView.js")
                .Include("~/DList/leeui/js/Select.js")
                .Include("~/DList/leeui/js/Upload.js")
                .Include("~/DList/leeui/layout.js"));

            bundles.Add(new ScriptBundle("~/Bundle/Scripts/Ztree")
                .Include("~/DList/zTree/js/jquery.ztree.all-3.5.js"));


            bundles.Add(new ScriptBundle("~/Bundle/Scripts/FormDesign")
              .Include("~/Scripts/Common/global.js")
              .Include("~/Scripts/FRM/code.js")
              .Include("~/Scripts/FRM/template.js")
              .Include("~/Scripts/FRM/service.js")
              .Include("~/Scripts/FRM/calc.js")
              .Include("~/Scripts/FRM/checkrules.js")
              .Include("~/Scripts/FRM/designer.js")
              .Include("~/Scripts/FRM/datasource.js")
              .Include("~/Scripts/FRM/ctrleditor.js")
              .Include("~/Scripts/FRM/ctrlmanager.js")
              .Include("~/Scripts/FRM/defaultval.js")// 默认值
              .Include("~/Scripts/FRM/uihelper.js"));


            bundles.Add(new ScriptBundle("~/Bundle/Scripts/Layer")
                .Include("~/DList/layer/layer.js"));

            bundles.Add(new ScriptBundle("~/Bundle/Scripts/Ace")
              .Include("~/DList/Ace/src-min-noconflict/ace.js"));

            #endregion

            #region 样式Bundle
            /*样式Bundle*/

            /*Common样式*/
            bundles.Add(new StyleBundle("~/Bundle/Styles/Common")
              .Include("~/DList/bootstrap/css/bootstrap.min.css")
              .Include("~/DList/fontawsome/font-awesome.min.css")
              .Include("~/DList/ngdialog/ngDialog.min.css")
              .Include("~/DList/ngdialog/ngDialog-theme-default.css")
              .Include("~/CSS/iconfont/iconfont.css")
              .Include("~/CSS/hook.css")
              .Include("~/CSS/animate.css"));


            //表单设计器全局样式 LeeUI
            bundles.Add(new StyleBundle("~/Bundle/Styles/LEEUI")
                .Include("~/CSS/lee-ui.css")
                .Include("~/CSS/leeui/lee-loader.css")
                .Include("~/CSS/leeui/lee.button.css")
                .Include("~/CSS/leeui/lee.layout.css")
                .Include("~/CSS/leeui/lee.list.css")
                .Include("~/CSS/leeui/lee.table.css"));

            //表单设计器全局样式 LeeUI
            bundles.Add(new StyleBundle("~/Bundle/Styles/Ztree")
                .Include("~/DList/zTree/css/zTreeStyle/zTreeStyle.css"));



            bundles.Add(new StyleBundle("~/Bundle/Styles/BASEUI")
                .Include("~/DList/webupload/webuploader.css")
                .Include("~/DList/nicevalidator/jquery.validator.css")
                .Include("~/DList/leeui/css/common.css")
                .Include("~/DList/leeui/css/bulid.css")
                .Include("~/DList/leeui/css/icon.css"));

            /*表单设计器样式 single*/
            bundles.Add(new StyleBundle("~/Bundle/Styles/FormDesign")
               .Include("~/DList/fontawsome/font-awesome.min.css")
               .Include("~/DList/bootstrap/css/bootstrap.min.css")
               .Include("~/CSS/iconfont/iconfont.css")
               .Include("~/CSS/formDesign.css"));
            #endregion
        }
    }
}