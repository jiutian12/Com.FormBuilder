/*默认表单生成  给表单初始化的时候生成默认的布局使用*/
function TmpGenerator() {

}

TmpGenerator.prototype = {
    init: function (modelID) {
        this.modelID = modelID;
        this.loadModelSchema();
    },
    setType: function (type) {
        this.type = type;
    },
    loadModelSchema: function () {
        var self = this;
        if (!this.model) {
            DataService.getModelSchema(this.modelID).done(function (data) {
                if (data.res) {
                    self.model = data.data;
                }
            });
        }
    },
    getDictMain: function () {
        var arr = [];
        var mianlayout = {
            "id": leeManger.getNewUid("col"),
            "type": "column",
            "auto": true,
            "height": "",
            "title": "",
            "minheight": "10",
            "ord": 0,
            "childs": this.getEditors(this.mainModel),
            "border": false,
            "formstyle": "1",
            "fill": false,
            "showtitle": false,
            "onAfterInit": "",
            "onBeforeInit": ""
        };
        arr.push(mianlayout);

        return arr.concat(this.getTabMX());
    },
    getMain: function () {
        var arr = [];
        var mianlayout = {
            "id": leeManger.getNewUid("col"),
            "type": "column",
            "auto": true,
            "height": "",
            "title": "",
            "minheight": "10",
            "ord": 0,
            "childs": this.getMainGrid(),
            "border": false,
            "formstyle": "0",
            "fill": false,
            "showtitle": false,
            "onAfterInit": "",
            "onBeforeInit": ""
        };
        arr.push(mianlayout);
        return arr;
    },
    getDictJson: function () {
        this.loadMain();
        var json = _const_tmplHash["1"];
        json.LayoutConfig.layout_main.childs = this.getDictMain();
        json.LayoutConfig.layout_list.childs = this.getMain();
        console.log(json);
        return json;
    },
    getListJson: function () {
        this.loadMain();
        var json = _const_tmplHash["2"];
        json.LayoutConfig.layout_main.childs = this.getMain();
        console.log(json);
        return json;
    },
    getJson: function () {
        this.loadMain();
        var json = _const_tmplHash["3"];
        json.LayoutConfig.layout_main.childs[0].childs = this.getEditors(this.mainModel);
        json.LayoutConfig.layout_mx.childs = this.getTabMX();
        console.log(json);
        return json;
    },
    getFinalJson: function (type) {
        if (type == "1") {
            return this.getDictJson();
        }
        else if (type == "2") {
            return this.getListJson();
        }
        else if (type == "3") {
            return this.getJson();
        }
    },
    refresh: function (type) {
        return this.getFinalJson(type);
    },
    getMainGrid: function () {
        var self = this;
        var maingrid = {
            bindtable: self.mainModel.ID,
            border: false,
            checkbox: false,
            colspan: 2,
            columns: self.getEditors(self.mainModel, "grid"),
            editors: {},
            filed: "",
            id: leeManger.getNewUid("grid"),
            label: "",
            margin: "",
            onAfterShowData: null,
            ord: 0,
            pager: true,
            readonly: true,
            rownumber: true,
            type: "grid"
        };
        return [maingrid];
    },
    getTabMX: function () {
        var self = this;
        var childcolarr = [];
        $.each(this.mxModel, function (i, model) {
            var childcol = {
                "id": leeManger.getNewUid("col"),
                "type": "column",
                "auto": true,
                "height": "",
                "title": "标题",
                "minheight": "100",
                "ord": 0,
                "label": model.tableName,
                "childs": [
                    {
                        "id": leeManger.getNewUid("grid"),
                        "type": "grid",
                        "label": "标题",
                        "field": "",
                        "colspan": "1",
                        "editors": {},
                        "margin": "1px",
                        "readonly": false,
                        "border": true,
                        "rownumber": true,
                        "pager": false,
                        "checkbox": false,
                        "bindtable": model.ID,
                        "onAfterShowData": null,
                        "columns": self.getEditors(model, "grid"),
                        "ord": 0,
                        "barid": "",
                        "treefield": "",
                        "async": false,
                        "tree": false
                    }
                ],
                "border": false,
                "formstyle": null,
                "fill": false,
                "showtitle": false,
                "onAfterInit": "",
                "onBeforeInit": ""
            }
            childcolarr.push(childcol);
        });
        return childcolarr;
    },
    getEditors: function (mainModel, gridid) {
        var editors = [];
        var i = 0;
        $.each(mainModel.cols, function (i, model) {
            var ctrl = {
                "id": leeManger.getNewUid("input"),//动态生成
                "type": "input",
                "label": model.name,
                "field": "",
                "colspan": "2",
                "editors": {

                },
                "editor_input": {

                },
                "required": false,
                "readonly": false,
                "onAfterInit": "",
                "onBeforeInit": "",
                "bindfield": model.label,
                "bindtable": mainModel.ID,
                "ord": i
            };
            if (gridid) {
                ctrl.colid = ctrl.id;
                ctrl.colname = model.name;
                ctrl.colwidth = "200";
            }
            editors.push(ctrl);
            i++;
        });
        return editors;
    },
    loadMain: function () {
        this.mxModel = [];
        var self = this;
        for (var item in self.model) {
            if (self.model[item].isMain) {
                self.mainModel = self.model[item];
            } else {
                self.mxModel.push(self.model[item]);
            }
        }
    }
};

var _const_tmplHash = {
    "3": {
        formConfig: {
            "show_b": false, "show_c": true, "show_l": false, "show_t": false,
            "show_r": false, "show_cb": false, "show_websocket": false, "formtype": "3",
            "fsmid": "card_fsm", "theme": "white", "datamodel": "", "engine": "",
            "fix_t": false, "fix_b": false, "region": false,
            "l_width": "", "l_title": "", "r_width": "", "r_title": "", "t_title": "",
            "b_title": "", "c_title": ""
        },
        PageLayout: {
            "Center": [
                "layout_toolbar",
                "layout_main",
                "layout_mx"
            ],
            "Top": [],
            "Bottom": [],
            "Left": [],
            "Right": [],
            "CenterBottom": []
        },
        LayoutConfig: {
            "layout_toolbar": {
                "childs": [
                    {
                        "id": "col_j7et20ofjwkei7yl8l",
                        "type": "column",
                        "auto": true,
                        "height": "",
                        "title": "标题",
                        "minheight": "10",
                        "ord": 0,
                        "childs": [
                            {
                                "id": "bar_j7eih17gqiqn1wpby",
                                "type": "bar",
                                "label": "标题",
                                "field": "",
                                "colspan": "2",
                                "editors": {

                                },
                                "barid": "",
                                "ord": 0
                            }
                        ],
                        "border": false,
                        "formstyle": null,
                        "fill": false,
                        "showtitle": false,
                        "onAfterInit": "",
                        "onBeforeInit": ""
                    }
                ],
                "ord": 0,
                "parentid": "",
                "type": "1"
            },
            "layout_main": {
                "childs": [
                    {
                        "id": "col_j7egjpcx2aleavcxk",
                        "type": "column",
                        "auto": true,
                        "height": "",
                        "title": "基本信息",
                        "minheight": "10",
                        "ord": 0,
                        "childs": [],
                        "border": false,
                        "formstyle": "1",
                        "fill": false,
                        "showtitle": true,
                        "onAfterInit": "",
                        "onBeforeInit": ""
                    }
                ],
                "ord": 0,
                "parentid": "",
                "type": "1"
            },
            "layout_mx": {
                "childs": [

                ],
                "ord": 0,
                "parentid": "",
                "type": "9"
            }
        }
    },
    "1": {
        formConfig: {
            "show_b": false, "show_c": true, "show_l": true, "show_t": true, "show_r": false, "show_cb": false,
            "show_websocket": false, "formtype": "1", "fsmid": "card_fsm", "theme": "white",
            "datamodel": "", "engine": "1", "fix_t": true, "fix_b": false, "region": true, "l_width": "300",
            "l_title": "数据列表", "r_width": "", "r_title": "", "t_title": "", "b_title": "", "c_title": "基本信息"
        },
        PageLayout: {
            "Center": ["layout_main"], "Top": ["layout_toolbar"], "Bottom": [], "Left": ["layout_list"], "Right": [], "CenterBottom": []
        },
        LayoutConfig: {
            "layout_list": {
                "childs": [
                  {
                      "id": "col_j2u4wp1wv38nqhi849",
                      "type": "column",
                      "auto": true,
                      "height": "",
                      "title": "",
                      "minheight": "0",
                      "ord": 0,
                      "childs": [

                      ],
                      "onAfterInit": "", "onBeforeInit": "", "border": false, "fill": true, "formstyle": null
                  }],
                "ord": 0,
                "parentid": "",
                "type": "1"
            },
            "layout_toolbar": {
                "childs":
                  [{
                      "id": "col_j2u51w9zj2gkv2tavl",
                      "type": "column",
                      "auto": true, "height": "",
                      "title": "",
                      "minheight": "0",
                      "ord": 0, "childs": [{
                          "id": "bar_j2u51xzixo75k09acy",
                          "type": "bar",
                          "label": "标题",
                          "field": "",
                          "colspan": "2",
                          "editors": {},
                          "barid": "",
                          "ord": 0
                      }],
                      "onAfterInit": "",
                      "onBeforeInit": "",
                      "border": false,
                      "formstyle": "0",
                      "fill": false
                  }], "ord": 0, "parentid": "", "type": "1"
            },
            "layout_main": {
                "childs": [
                    {
                        "id": "col_j2y97q3ke27h1s0x8v",
                        "type": "column",
                        "auto": true,
                        "height": "",
                        "title": "标题",
                        "minheight": "200",
                        "ord": 0,
                        "childs": [

                        ],
                        "border": true,
                        "fill": false,
                        "onAfterInit": "",
                        "onBeforeInit": "",
                        "formstyle": "1",
                        "isqry": false,
                        "showtitle": false
                    }],
                "ord": 0,
                "parentid": "",
                "type": "1"
            }
        }
    },
    "2": {
        formConfig:
           {
               "show_b": false, "show_c": true, "show_l": false, "show_t": false, "show_r": false, "show_cb": false, "show_websocket": false, "formtype": "2", "fsmid": "", "theme": "", "datamodel": "", "engine": "", "fix_t": false, "fix_b": false, "region": true, "l_width": "", "l_title": "", "r_width": "", "r_title": "", "t_title": "", "b_title": "", "c_title": ""
           },
        PageLayout: {
            "Center": [
                "layout_toolbar",
                "layout_qry",
                "layout_main"
            ], "Top": [], "Bottom": [], "Left": [], "Right": [], "CenterBottom": []
        },
        LayoutConfig: {

            "layout_main": {
                "childs": [
                    {
                        "id": "col_j7y894160hf8oin70t9",
                        "type": "column",
                        "auto": true,
                        "height": "",
                        "title": "标题",
                        "minheight": "200",
                        "ord": 0,
                        "label": "",
                        "childs": []
                    }
                ],
                "ord": 0,
                "parentid": "",
                "type": "9"
            },
            "layout_toolbar": {
                "childs": [
                    {
                        "id": "col_j7y89ixw0deaszvpo",
                        "type": "column",
                        "auto": true,
                        "height": "",
                        "title": "标题",
                        "minheight": "30",
                        "ord": 0,
                        "childs": [
                            {
                                "id": "bar_j7yp37bz2fmlobwh5h",
                                "type": "bar",
                                "label": "",
                                "field": "",
                                "colspan": "2",
                                "editors": {},
                                "ord": 0,
                                "barid": ""
                            }
                        ],
                        "border": false,
                        "formstyle": "0",
                        "fill": false,
                        "showtitle": false,
                        "onAfterInit": "",
                        "onBeforeInit": "",
                        "dsid": "",
                        "isqry": false
                    }
                ],
                "ord": 0,
                "parentid": "",
                "type": "1"
            },
            "layout_qry": {
                "childs": [
                    {
                        "id": "col_j7ypz7wt13qyx5v4kg",
                        "type": "column",
                        "auto": true,
                        "height": "",
                        "title": "标题",
                        "minheight": "0",
                        "ord": 0,
                        "childs": [
                            {
                                "id": "btton_searchqry",
                                "type": "button",
                                "label": "标题",
                                "field": "",
                                "colspan": "20",
                                "editors": {},
                                "style": "2",
                                "text": "搜索",
                                "align": "2",
                                "icon": "",
                                "onClick": " Page.UI.gridController.reloadMain();",
                                "ord": 3
                            }
                        ],
                        "border": false,
                        "formstyle": "1",
                        "fill": false,
                        "showtitle": false,
                        "onAfterInit": "",
                        "onBeforeInit": "",
                        "isqry": true,
                        "dsid": "7b33334c-32a5-43d1-912c-c2a9ca426d61"
                    }
                ],
                "ord": 0,
                "parentid": "",
                "type": "1"
            }
        }
    }
}
