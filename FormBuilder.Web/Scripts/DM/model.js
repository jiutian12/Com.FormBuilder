
var _siteurl = " http://localhost/FormBuilder.Web";
function zTreeOnClick(event, treeId, treeNode) {
    console.log(treeNode);
    alert(treeNode.tId + ", " + treeNode.name);
};

function bulidLabel(code, name) {
    return '<span style="margin-right:0px;font-weight:bold;" class="">[' + code + ']</span> - <span style="margin-right:0px;margin-left: 0;font-weight:bold;">' + name + '</span>';
}

function bulidColumnLabel(code, name) {
    return '<span style="color:blue;margin-right:0px;" class="">[' + code + ']</span> - <span style="color:red;margin-right:0px;margin-left: 0;">' + name + '</span>';
}

var model = {
    DataModel: {
        modelID: "00001",
        modelName: "供应商模型",
        modelCode: "DM_VMAPPINFO",
        createTime: "2010-09-09 11:00:33",
        createUser: "test01",
        lastModifyTime: "2010-09-09 11:00:33",
        lastModifyUser: "test01",
        Hirarchy: {

        },
        MainObject: {
            keyColID: "",
            Filter: "",
            objectID: "01",
            objectCode: "DO_GHML",
            objectName: "DO_供应基本信息",
            Label: "DO_GHML",
            elements: [{
                objectID: "01",
                elementid: "001",
                Code: "APPID",
                Name: "APPID",
                Label: "APPID",
                DatatType: "string",
                Length: "50",
                Decimal: "2",
                isList: true,
                isCard: false,
                isUpdate: true,
                isVirtual: true,
                VirtualExpress: " select() from label "
            }],
            isMainObject: true,
            refCondition: {

            }
        },
        ListObject: [{
            keyColID: "",
            Filter: "",
            objectID: "02",
            objectCode: "DO_GHML",
            objectName: "DO_供应商供货目录",
            elements: [{
                objectID: "02",
                elementid: "001",
                Code: "ID",
                Name: "ID",
                Label: "ID"
            }],
            isMainObject: true,
            refCondition: {

            }
        }, {
            keyColID: "",
            Filter: "",
            objectID: "03",
            objectCode: "DO_ZZXX",
            objectName: "DO_供应商资质信息",
            elements: [{
                objectID: "03",
                elementid: "0301",
                Code: "ID",
                Name: "ID",
                Label: "ID"
            }],
            isMainObject: true,
            refCondition: {

            }
        }]
    }
};

function treeCore() {

}
treeCore.prototype = {
    init: function () {
        //挂载模型
        //添加主对象
        this.rootTree = [];
        this.initRoot();
        //默认的element模型

    },
    getData: function () {

        return this.rootTree;
    },

    initRoot: function () {
        var self = this;
        this.rootTree.push({
            "name": ModelInstance.getModelName(),
            type: "root",
            open: true,
            icon: _global.sitePath + "/css/images/1_open.png",
            children: []
        });
        var secondTree = this.rootTree[0].children;
        var mainobj = ModelInstance.getMainObject();
        secondTree.push({
            "objectid": mainobj.objectID,
            "name": mainobj.objectName,
            type: "object",
            open: true,
            icon: _global.sitePath + "/css/images/9.png",
            children: []
        });
        self.initObject(secondTree[0].children, mainobj.objectID);
        var child = ModelInstance.getListObject();
        if (child.length > 0) {
            secondTree.push({
                "name": "子对象",
                type: "folder",
                open: true,
                icon: _global.sitePath + "/css/images/7.png",
                children: []
            });
            $.each(child, function (i, val) {
                secondTree[1].children.push({
                    "objectid": val.objectID,
                    "name": bulidLabel(val.objectCode, val.objectName),
                    type: "object",
                    open: true,
                    icon: _global.sitePath + "/css/images/9.png",
                    children: []
                });

                self.initObject(secondTree[1].children[i].children, val.objectID);
            });
        }
        //$.fn.zTree.init($("#treedemo"), setting, this.rootTree);
    },
    initObject: function (objectinfo, objectID) {
        objectinfo.push({
            name: "字段",
            type: "folder",
            open: true,
            icon: _global.sitePath + "/css/images/7.png",
            children: []
        });
        var object = ModelInstance.getObject(objectID);
        var elementlist = object.elements;
        $.each(elementlist, function (i, val) {
            objectinfo[0].children.push({
                elementid: val.elementid,
                objectid: objectID,
                name: bulidColumnLabel(val.Code, val.Name),
                type: "element",
                open: true,
                icon: _global.sitePath + "/css/images/2.png",
                children: []
            });
        });

    },
    initRelations: function (objectID, elementid) {

    }
};

function ModelCore(model) {
    this.model = model;
    this.objectCahche = {}; //缓存主子对象方便查找对象
    this.init();
}

ModelCore.prototype = {
    constructor: ModelCore,
    init: function () {

        this.refreshCache();
        this.defelement = {
            objectID: "",
            elementid: "",
            Code: "",
            Name: "",
            Label: "",
            DatatType: "string",
            Length: "50",
            Decimal: "0",
            isList: true,
            isCard: true,
            isUpdate: false,
            isVirtual: false,
            VirtualExpress: ""
        };
    },
    refreshCache: function () {
        //缓存对象
        var self = this;
        var mainobj = this.model.DataModel.MainObject;
        var id = mainobj.objectID;
        this.addCache(id, mainobj);
        var listobject = this.model.DataModel.ListObject;
        $.each(listobject, function (i, value) {
            var id = value.objectID;
            self.addCache(id, value);
        });
    },
    addCache: function (key, value) {
        delete this.objectCahche[key];
        this.objectCahche[key] = value;
    },
    getModelName: function () {
        return bulidLabel(this.model.DataModel.modelCode, this.model.DataModel.modelName);
    },
    getModel: function () {
        return this.model.DataModel;
    },
    getMainObject: function () {
        return this.model.DataModel.MainObject;
    },
    getListObject: function () {
        return this.model.DataModel.ListObject;
    },
    getObject: function (objectid) {
        return this.objectCahche[objectid];
    },
    //添加对象 主子对象
    addObject: function (object, ismain) {
        if (ismain) {
            this.model.DataModel.ListObject = [];
            this.model.DataModel.MainObject = object;
        } else {
            this.model.DataModel.ListObject.push(object);
        }
        this.refreshCache();
    },
    removeObject: function (objectid) {
        if (this.objectCahche[objectid]) {
            delete this.objectCahche[objectid];
            var index = -1;
            $.each(this.model.DataModel.ListObject, function (i, val) {
                if (val.objectid = objectid) {
                    index = i;
                }
            });

            this.model.DataModel.ListObject.splice(index, 1);
        }

    },
    getElement: function (objectid, elementid) {
        return this.objectCahche[objectid].elements.find(function (i) {
            return i.elementid == elementid;
        });
    },
    addElement: function (objectid, element) {
        element = $.extend({}, this.defelement, element);
        if (this.objectCahche[objectid]) {
            this.objectCahche[objectid].elements.push(element);
        }
    },
    removeElement: function (objectid, elementid) {
        if (this.objectCahche[objectid]) {
            var index = -1;
            $.each(this.objectCahche[objectid].elements, function (i, val) {
                if (val.elementid == elementid) {
                    index = i;
                }
            });
            this.objectCahche[objectid].elements.splice(index, 1);
        }
    },
    existElementCode: function (objectid, field, value) {
        var flag = false;
        $.each(this.objectCahche[objectid].elements, function (i, val) {
            if (val[field] == value) {//如果有的话 则提示
                flag = true;
            }
        });
        return flag;
    },
    addElements: function (objectid, elements) {
        for (var item in elements) {
            if (!this.existElementCode(objectid, "Code", elements[item].Code)) {
                var elementinfo = $.extend({}, this.defelement, elements[item]);
                if (this.objectCahche[objectid]) {
                    this.objectCahche[objectid].elements.push(elementinfo);
                }
            }
        }

    },
    updateModelPorperty: function () {

    },
    updateObjectPorperty: function () {

    },
    updateElementPorperty: function () {

    }

};
var ModelInstance = new ModelCore(model);

$(document).ready(function () {
    var b = new treeCore();
    b.init();
});

var services = angular.module("model.services", []);

services.factory('DataService', ['$rootScope', '$http', '$q', '$timeout', '$location',
	function ($rootScope, $http, $q, $timeout, $location) {
	    return {
	        Init: function () {

	        }
	    };
	}
]);

var directives = angular.module('model.directives', ['model.services']);
directives.directive("modelTree", function () {
    return {
        restrict: 'E',
        scope: {
            vm: "=tree"
        },

        transclude: true,
        template: '<ul id="treedemo" class="ztree"></ul>',
        link: function (scope, elem, attrs, ctrl) {

            console.log(scope.vm);
            var data = [];
            var setting = {
                view: {
                    nameIsHTML: true
                },
                callback: {
                    onClick: zTreeOnClick,
                    beforeClick: beforeClick
                }
            };
            if (scope.vm) {
                data = scope.vm;
            }
            $.fn.zTree.init($(elem).find(".ztree"), setting, data);

            function zTreeOnClick(event, treeId, treeNode) {
                //console.log("我被点击了！");
                var data = {};
                if (treeNode.type == "element") {
                    data = {
                        type: "element",
                        id: treeNode.elementid,
                        oid: treeNode.objectid
                    }
                }
                if (treeNode.type == "object") {
                    data = {
                        type: "object",
                        oid: treeNode.objectid
                    }
                }
                if (treeNode.type == "root") {
                    data = {
                        type: "root"
                    }
                }
                scope.$emit("onselect", data);
            }

            function beforeClick(treeId, treeNode) {
                //文件夹类型的不允许选中
                return treeNode.type !== "folder";
            }

            scope.$on("treechange", function (event, data) {
                console.log("parent msg", data);
                scope.vm = data;
                $.fn.zTree.init($(elem).find(".ztree"), setting, scope.vm);
            });

            scope.$on("addelement", function (event, data) {

            });
            scope.$watch(scope.vm, function () {

            }, true);

        }
    }
});

directives.directive("modelAttr", function () {
    return {
        restrict: 'E',
        scope: {
            vm: "=props"
        },
        transclude: true,
        templateUrl: _global.sitePath + "/tmpl/modelAttr.html",
        controller: ["$scope", "$rootScope", function ($scope, $rootScope) {
            var vm = $scope.vm;
            $scope.tab = 1;
            vm.prop = {};

            $scope.setTab = function (e) {
                $scope.tab = e;
            }

        }],
        link: function (scope, elem, attrs, ctrl) {

            var hash = {
                "element": 1,
                "object": 4,
                "root": 3
            }
            scope.$on("treeselect", function (event, data) {
                console.log("parent msg", data);
                scope.vm.ele = data.ele;
                scope.vm.type = data.type;
                scope.vm.object = data.object;
                scope.vm.root = data.root;
                scope.tab = hash[data.type];
                scope.$apply();

            });

            scope.$watch(function () {
                return scope.vm.ele;
            }, function () {
                //alert(1);
                //scope.$emit("attrchange", "列属性改变了");
            }, true);
        }
    }
});
var app = angular.module('formbulider', ["model.services", "model.directives", "ngDialog", "lbm.common.services"]);

app.controller('basecontroller', function ($rootScope, $scope, $http, $sce, $window, $timeout, ngDialog, $lbmdialog, $lbmnotify, $lbDataService) {
    var b = new treeCore();
    b.init();
    $scope.treedata = b.getData();



    //$scope.clickToOpen();
    $scope.cleartree = function () {

        if ($scope.treedata.length == 0) {
            $scope.treedata = b.getData();
        } else {
            $scope.treedata = [];
        }
        //$scope.$apply();
        $scope.$broadcast("treechange", $scope.treedata);

    }
    $scope.refresh = function () {

        b.init();
        $scope.treedata = b.getData();
        //$scope.$apply();
        $scope.$broadcast("treechange", $scope.treedata);

    }
    $scope.selected = {};
    $scope.$on("onselect", function (event, data) {
        $scope.selected.type = data.type;


        if (data.type == "element") {
            var id = data.id;
            var oid = data.oid;

            $scope.$broadcast("treeselect", {
                type: "element",
                ele: ModelInstance.getElement(oid, id)
            });
            $scope.selected.value = ModelInstance.getElement(oid, id);

        }
        if (data.type == "object") {
            var oid = data.oid;

            $scope.$broadcast("treeselect", {
                type: "object",
                object: ModelInstance.getObject(oid)
            });
            $scope.selected.value = ModelInstance.getObject(oid);

        }
        if (data.type == "root") {
            $scope.$broadcast("treeselect", {
                type: "root",
                root: ModelInstance.getModel()
            });
            $scope.selected.value = ModelInstance.getModel();
        }
        //alert(data);
    });

    $scope.$on("attrchange", function (event, data) {

        alert(data);
    });
    $scope.props = {
        ele: {
            elementid: "001"
        }
    };
    $scope.addCol = function () {
        //添加列 获取当前选中对象
        //弹出对话框 显示列信息
        //选中 回写treecore 刷新树
        function callback(data, objectid) {
            var elements = [];
            $.each(data, function (i, value) {
                var element = {
                    objectID: objectid,
                    elementid: Guid.NewGuid().ToString(),
                    Code: value.Code,
                    Name: value.Name,
                    Label: value.Code,
                    isVirtual: false
                };
                elements.push(element);
            });
            ModelInstance.addElements(objectid, elements);
            root.refresh();

        }
        if ($scope.selected.type == "object") {
            var objectid = $scope.selected.value.objectID;
            $scope.showObjectColumns(objectid, callback);
        }


    }


    $scope.showObjectColumns = function (objectid, callback) {
        ngDialog.open({
            template: _siteurl + '/tmpl/model.addcol.html',
            className: 'ngdialog-theme-default',
            closeByEscape: false,
            width: 440,
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                $timeout(function () {
                    autoFixLeeTable();
                    $lbmdialog.hidetoast();
                }, 500);


                $lbmdialog.showtoast();

                $lbDataService.Request("/DataObject/GetColumnList", { objectid: "001" }).then(function (data) {
                    if (data.res) {
                        $scope.data = data.data;
                    } else {
                        $lbmnotify.show(data.mes);
                    }
                    $lbmdialog.hidetoast();
                });
                autoFixLeeTable();

                $scope.confirm = function () {
                    var arr = [];
                    $.each($scope.data, function (i, value) {
                        if (value["checked"]) {
                            arr.push(value);
                        }

                    });
                    callback.call(this, arr, objectid);
                    //alert(arr.length);
                    $scope.closeThisDialog();
                }
            }]
        });
    }
    $scope.addVCol = function () {

        if ($scope.selected.type == "object") {
            var objectid = $scope.selected.value.objectID;
            ngDialog.open({
                template: _siteurl + '/tmpl/model.addvcol.html',
                className: 'ngdialog-theme-default',
                closeByEscape: false,
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    $scope.confirm = function () {
                        //
                        var code = $scope.codefield;
                        var name = $scope.namefield;
                        var element = {
                            objectID: objectid,
                            elementid: Guid.NewGuid().ToString(),
                            Code: code,
                            Name: name,
                            Label: code,
                            isVirtual: true
                        };
                        if (ModelInstance.existElementCode(objectid, "Code", code)) {
                            alert("字段编号重复！");
                            return;
                        }
                        if (ModelInstance.existElementCode(objectid, "Label", code)) {
                            alert("字段标签重复！");
                            return;
                        }
                        ModelInstance.addElement(objectid, element);
                        root.refresh();
                        $scope.closeThisDialog();
                    }
                }]
            });
        }
    }
    var root = $scope;
    $scope.removeCol = function () {

        if ($scope.selected.type == "element") {
            var eleid = $scope.selected.value.elementid;
            var objectid = $scope.selected.value.objectID;
            ngDialog.open({
                template: _siteurl + '/tmpl/confirm.html',
                className: 'ngdialog-theme-default',
                closeByEscape: false,
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    $scope.message = "确认要删除改字段吗？";
                    $scope.confirm = function () {
                        //$scope.closeThisDialog();
                        ModelInstance.removeElement(objectid, eleid);
                        root.refresh();
                        $scope.closeThisDialog();
                    }
                }]
            });
        }

        //获取选中行
        //符合规则
        //对话框提示
        //调用treecore 刷新树
    }
    $scope.removeChild = function () {
        if ($scope.selected.type == "object") {

            var objectid = $scope.selected.value.objectID;
            ngDialog.open({
                template: _siteurl + '/tmpl/confirm.html',
                className: 'ngdialog-theme-default',
                closeByEscape: false,
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    $scope.message = "确认要删除此对象吗？";
                    $scope.confirm = function () {
                        //
                        ModelInstance.removeObject(objectid);
                        root.refresh();
                        $scope.closeThisDialog();
                    }
                }]
            });
        }
        //获取选中行
        //符合规则
        //对话框提示
        //调用treecore 刷新树
    }
    $scope.addChild = function () {
        //获取选中行
        //符合规则
        //弹出模型列表 选中数据 
        //下一步 弹出 关联条件编辑页面 确定
        //然后回写treecore
    }
    $scope.saveModel = function () {

    }
    //$scope.treedata =b.getData();
});

