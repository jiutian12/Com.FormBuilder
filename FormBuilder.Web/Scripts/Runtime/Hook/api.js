Page.Api = {};


Page.Api.AddGridRow = function () {

}
Page.Api.DeleteRow = function () {

}


Page.Api.openImport = function (params, height, width, ip) {
    var url="/Commonality/DataTempl/ImportManager?fileTypeCode={0}&TemplateType={1}&ProductId={3}&Creator={4}&query={5}&AppInstanceID={6}&UserId={7}&ProcessId={8}"
}
Page.Api.openExport = function (params, height, width, ip) {
    var url = "/Commonality/DataExportManager/Index?Type=DetailsExport"
}