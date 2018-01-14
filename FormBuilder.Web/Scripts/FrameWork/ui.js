$.leeUI.PopUp.FilterEditorInjector = function (options) {

    this.options = options;
    this.init();
    this.getFields = this.options.getFields;
}



$.leeUI.PopUp.FilterEditorInjector.prototype = {
    init: function () {
    },
    initUI: function () {

        var operateData = [
            { text: "=", "id": "=" },
            { text: ">=", "id": ">=" },
            { text: "<=", "id": "<=" },
            { text: "<>", "id": "<>" },
            { text: ">", "id": ">" },
            { text: "<", "id": "<" },
            { text: "like", "id": "<>" },
            { text: "left like", "id": "left like" },
            { text: "right like", "id": "right like " },
            { text: "is", "id": "is" },
            { text: " is not", "id": "is not" },
            { text: "in", "id": "in" },
            { text: "not in", "id": "notin" }
        ];
        var g = this,
            p = this.options;
        var data = [];
        var value = p.getValue();
        if (value) {
            data = $.parseJSON(p.getValue());
        }

        p.gridm = g.grid.leeGrid({
            columns: [
                {
                    display: '左括号', name: 'LeftBrace', align: 'left', width: 100,
                    editor: {
                        type: "dropdown",
                        data: [
                            { text: "(", "id": "(" },
                            { text: "((", "id": "((" },
                            { text: "(((", "id": "(((" }
                        ]
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '字段', name: 'ParamName', align: 'left', width: 100, editor: {
                        type: "dropdown",
                        data: this.getFields()
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '比较字符', name: 'Operate', align: 'left', width: 100, editor: {
                        type: "dropdown",
                        data: operateData
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '是否表达式', name: 'IsExpress', align: 'center', width: 80, render: leeUI.gridRender.ToogleRender
                },
                { display: '值', name: 'ExpressValue', align: 'left', width: 100, editor: { type: 'text' } },
                {
                    display: '右括号', name: 'RightBrace', align: 'left', width: 100, editor: {
                        type: "dropdown",
                        data: [{ text: ")", "id": ")" }, { text: "))", "id": "))" }, { text: ")))", "id": ")))" }]
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '关系', name: 'Logic', align: 'left', width: 100, editor: {
                        type: "dropdown",
                        data: [{ text: "并且", "id": "AND" }, { text: "或者", "id": "OR" }]
                    }, render: leeUI.gridRender.DropDownRender
                }
            ],
            toolbar: {
                items: [{
                    text: '添加', click: function () {
                        p.gridm.addRow({ LeftBrace: "", ParamName: "", Operate: "", IsExpress: false, ExpressValue: "", RightBrace: "", Logic: "" });
                    }, iconfont: "plus"
                }, {
                    line: true
                },
					{
					    text: '删除',
					    click: function () {
					        p.gridm.endEdit();

					        p.gridm.deleteRow(p.gridm.getSelected());
					    },
					    iconfont: "minus"
					}
                ]
            },
            alternatingRow: false,
            data: {
                Rows: data
            },
            enabledEdit: true,
            usePager: false,
            inWindow: false,
            height: "100%",
            rownumbers: true,
            rowHeight: 30
        });
        p.gridm._onResize();

    },
    clearSearch: function () {

    },
    getOptions: function () {
        return this.options;
    },
    clear: function () {
    },
    getRenderDom: function () {
        if (!this.grid) {
            this.grid = $("<div></div>");
        }
        return this.grid;
    },

    onResize: function () { },
    onConfirm: function (popup, dialog, $injector) {
        var p = $injector.options;
        var obj = {};
        var data = p.gridm.getData();
        popup.setText(JSON.stringify(data));
        popup.setValue(JSON.stringify(data));
        return true;
    }
};

window.fBulider.defaults = window.fBulider.defaults || {};
fBulider.defaults.datatype = [

    { id: "0", text: "varchar(字符)" },
    { id: "5", text: "char(定长)" },
    { id: "1", text: "int(整数)" },
    { id: "2", text: "demcimal(小数)" },
    { id: "3", text: "date(日期)" },
    { id: "4", text: "text(二进制)" },
    { id: "6", text: "bit" }
];