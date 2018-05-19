
/*界面通用的业务方法 封装*/
Page.Api = {};

Page.Api.AddGridRow = function () {

}
Page.Api.DeleteRow = function () {

}
/*params 导入参数说明
{
    type:"",    //fileTypeCode
    tpl:"",     //TemplateType
    pid:"",     //ProductId
    query:"",   //query
    appcode:"", //AppInstanceID
} 
*/
Page.Api.openImport = function (params, height, width) {
    var ip = Page.Config.get("DataIP");
    if (ip.indexOf("http") != 0) ip = "http://" + ip;
    width = width || "700";
    height = height || "450";
    var url = "/Commonality/DataTempl/ImportManager?fileTypeCode=" + params.type + "&TemplateType=" + params.tpl + "&ProductId=" + params.pid + "&Creator=" + Page.Context.get("UserName")
        + "&query=" + params.query + "&AppInstanceID=" + params.appcode + "&UserId=" + Page.Context.get("UserID") + "&ProcessId=" + Page.Context.get("UserID")

    $.leeDialog.open({
        title: "导入",
        name: 'importwindow',
        isHidden: false,
        showMax: true,
        width: width,
        slide: false,
        height: height,
        onclose: function () {
        },
        url: ip + url,
        onLoaded: function () {
        }
    });


}
/*params 导出参数说明
{
    type:"", //Type
    code:"", //ExportCode
    where:"" //ExportWhere
} 

beforecheck
*/
Page.Api.openExport = function (params, beforecheck, width, height) {
    if (!params.where)
        params.where = Page.UI.params.getFilterDataSource(Page.UI.gridController.mainSourceID).getSql();

    var key = lb.crypto.randomKey();
    var sqlwhere = lb.crypto.strEncrypt(params.where, key);

    if (beforecheck) {
        if (!beforecheck(sqlwhere, Page.Context.get("UserID"), key, params.where)) {
            return false;
        }
    }

    var ip = Page.Config.get("DataIP");
    if (ip.indexOf("http") != 0) ip = "http://" + ip;
    var actionUrl = ip + "/Commonality/DataExportManager/Index?Type=" + params.type;
    // var url = "/Commonality/DataExportManager/Index?Type=" + params.type + "&ExportCode=" + params.code + "&ExportWhere=" + params.where + "&UserId=" + Page.Context.get("UserID");
    width = width || "580";
    height = height || "400";
    $.leeDialog.open({
        title: "导出",
        name: 'exportwindow',
        isHidden: false,
        showMax: true,
        width: width,
        slide: false,
        height: height,
        onclose: function () {
        },
        url: actionUrl,
        onLoaded: function () {

        }
    });
}


/*params 上传附件参数
{
    type:"", //Type
    id:"", //mainid
    name:"" //mainname
} 
*/
Page.Api.openFile = function (params, height, width) {
    var ip = Page.Config.get("FileIp");
    if (ip.indexOf("http") != 0) ip = "http://" + ip;
    var url = "/AttachmentManager/SelectAttachments?fileTypeCode=" + params.type + "&mainId=" + params.id + "&mainName=" + params.name + "&create=" + Page.Context.get("UserID");
    width = width || "400";
    height = height || "300";
    $.leeDialog.open({
        title: "附件上传",
        name: 'exportwindow',
        isHidden: false,
        showMax: true,
        width: width,
        slide: false,
        height: height,
        onclose: function () {
        },
        url: ip + url,
        onLoaded: function () {
        }
    });
}
Page.Api.openIcon = function (callback) {
    var self = this;
    var dialog = $.leeDialog.open({
        title: '选择图标',
        name: 'winselectorIcon',
        isHidden: false,
        showMax: true,
        width: "900",
        slide: false,
        height: "380",
        url: _global.sitePath + "/CommonFB/icons",
        buttons: [{
            text: '确定',
            cls: 'lee-btn-primary lee-dialog-btn-ok',
            onclick: function (item, dialog) {
                var selected = window.frames["winselectorIcon"].getSelectIcon();
                if (selected) {
                    callback(selected);
                    //self.setWrap(selected);
                    //$("#txtIcon").val(selected);
                    dialog.close();
                } else {
                    leeUI.Error("请选中图标");
                }
            }
        },
            {
                text: '取消',
                cls: 'lee-dialog-btn-cancel ',
                onclick: function (item, dialog) {
                    dialog.close();
                }
            }
        ]
    })
}