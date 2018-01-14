leeUI.gridRender = {};

leeUI.gridRender.DropDownRender = function (rowdata, rowindex, value, column) {
    var colname = column.columnname;
    var vsdata = column.editor.data;
    var valuefield = "id";
    if (column.editor.valueField) valuefield = column.editor.valueField;
    if (column.editor.valueColumnName) valuefield = column.editor.valueColumnName;
    var namefield = "text";
    if (column.editor.textField) namefield = column.editor.textField;
    if (column.editor.displayColumnName) namefield = column.editor.displayColumnName;
    if (column.editor.isMultiSelect) {
        var arrdata = [];
        var valuedata = value.split(";");
        for (var n = 0; n < vsdata.length; n++) {
            for (var j = 0; j < vsdata.length; j++) {
                if (valuedata[n] == vsdata[j][valuefield]) {
                    arrdata.push(vsdata[j][namefield]);
                    break;
                }
            }

        }

        return arrdata.join(";");

    } else {
        for (var i = 0; i < vsdata.length; i++) {
            if (value == vsdata[i][valuefield])
                return vsdata[i][namefield];
        }
    }
};

leeUI.gridRender.ToogleRender = function (rowdata, rowindex, value, column) {
    if (typeof value != "boolean") {
        value = value == '1' ? true : false;
    }

    var checked = value ? "checked='checked'" : "";
    var disabled = column.readonly ? "disabled" : "";
    var ctrlid = this.id + '_chk_' + column.name + '_' + rowindex;
    var iconHtml = '<div style="padding:1px;"><input type="checkbox" class="lee-toggle-switch" ' + checked + ' ' + disabled + ' id="' + ctrlid + '"/>';
    iconHtml += "<label for='" + ctrlid + "'/></div>";
    return iconHtml;
}

leeUI.gridRender.bind = function () {

    $("body").on("click", ".lee-grid-row-cell-inner .lee-toggle-switch", function (e) {

        var grid = $(this).closest(".lee-ui-grid").leeUI();
        var cell = $(this).closest(".lee-grid-row-cell");
        var row = $(this).closest(".lee-grid-row");
        var rowobj = grid.getRow(row.attr("id").split("|")[2]);
        console.log(rowobj);
        var column = grid.getColumn(cell.attr("id").split("|")[3]);
        console.log(column);
        var checked = $(this).prop("checked") ? "1" : "0";
        if (typeof rowobj[column.columnname] == "boolean") {
            checked = $(this).prop("checked");
        }
        if (grid.options.onBeforeCheckEditor) {
            if (grid.options.onBeforeCheckEditor.call(this, rowobj, column.columnname)) {

                grid.updateCell(column.columnname, checked, rowobj);
            }
        } else {
            grid.updateCell.leeDefer(grid, 200, [column.columnname, checked, rowobj]);
        }
        e.stopPropagation();

    });


    $("body").on("click", ".lee-grid-row-cell-inner .lee-checkbox-wrapper", function (e) {


        if ($(this).hasClass("lee-disabled")) return;
        var grid = $(this).closest(".lee-ui-grid").leeUI();
        var cell = $(this).closest(".lee-grid-row-cell");
        var row = $(this).closest(".lee-grid-row");
        var span = $(cell.find("span"));
        var rowobj = grid.getRow(row.attr("id").split("|")[2]);
        console.log(rowobj);
        var column = grid.getColumn(cell.attr("id").split("|")[3]);
        console.log(column);
        span.toggleClass("lee-checkbox-checked");
        var checked = span.hasClass("lee-checkbox-checked") ? "1" : "0";



        if (grid.options.onBeforeCheckEditor) {
            if (grid.options.onBeforeCheckEditor.call(this, rowobj, column.columnname)) {

                grid.updateCell(column.columnname, checked, rowobj);
            }
        } else {
            grid.updateCell.leeDefer(grid, 200, [column.columnname, checked, rowobj]);
        }
        e.stopPropagation();

    });


}
$(function () {
    leeUI.gridRender.bind();
});


leeUI.gridRender.CheckboxRender = function (rowdata, rowindex, value, column) {
    value = value == '1' ? true : false;
    var iconHtml = '<div class="lee-checkbox-wrapper ' + (column.readonly ? "  lee-disabled " : "") + '> ';



    iconHtml += ' rowid = "' + rowdata['__id'] + '"';
    iconHtml += ' gridid = "' + this.id + '"';
    iconHtml += ' columnname = "' + column.name + '"';


    iconHtml += '><span class="lee-checkbox ';

    if (value) iconHtml += ' lee-checkbox-checked ';
    iconHtml += '"></span></div>';
    return iconHtml;
};