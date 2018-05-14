
/*界面通用的业务方法 封装*/
Page.Api = {};

Page.Api.AddGridRow = function () {

}
Page.Api.DeleteRow = function () {

}

Page.Api.openImport = function (params, height, width, ip) {
    var url = "/Commonality/DataTempl/ImportManager?fileTypeCode={0}&TemplateType={1}&ProductId={3}&Creator={4}&query={5}&AppInstanceID={6}&UserId={7}&ProcessId={8}"
}
Page.Api.openExport = function (params, height, width, ip) {
    var url = "/Commonality/DataExportManager/Index?Type=DetailsExport"
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