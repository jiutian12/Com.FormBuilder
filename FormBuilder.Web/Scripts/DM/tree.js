(function (window, $) {
    function treeManager() {
        this.init();
    };
    treeManager.prototype = {
        init: function () {
            this.ele = $("#modeltreee");
        },
        refresh: function () {
            DataService.getObjectList(BaseManger.getDataModelID()).done(function (data) {
                if (data.res) {
                    TreeManager.refreshTree(data.data);
                }
            }).fail(function (data) {
                console.log(data);
                //alert(data);
            });
        },
        getSelectObjectID: function () {
            var arr = [];
            var data = $("#modeltree").leeUI().getSelected();
            if (data) {
                return data.data["ObjectID"];
            }
            return "";
        },
        getSelectModelObjectID: function () {
            var arr = [];
            var data = $("#modeltree").leeUI().getSelected();
            if (data) {
                return data.data["ID"];
            }
            return "";
        },
        refreshTree: function (data) {
            var self = this;
            this.data = data;
            if (this.ele.leeUI())
                this.ele.leeUI().clear();
            $("#modeltree").leeTree({
                data: data,
                idFieldName: 'ID',
                textFieldName: "Name",
                parentIDFieldName: "ParentID",
                checkbox: false,
                onSelect: function (data) {
                    self.onSelect(data);
                },
                onBeforeCancelSelect: function () {
                    return false;
                },
                onCancelselect: function (data, treeitem) {
                    console.log(data.data);
                    console.log(data.target);
                }
            });
            $("#modeltree").leeUI().selectNode(data[0]["ID"]);

        },
        refeshSelected: function () {
            var id = this.getSelectModelObjectID();
            if (id) {
                this.refreshCard(id);
            }
        },
        refreshCard: function (id) {
            DataService.getObjectModel(BaseManger.getDataModelID(), id, true).done(function (data) {
                if (data.res) {
                    CardManager.setValue(data.data);
                }
            }).fail(function (data) {
                console.log(data);
                //alert(data);
            });
        },
        onSelect: function (data) {
            console.log(data.data);
            this.refreshCard(data.data["ID"]);

        }
    };
    window.TreeManager = new treeManager();
})(window, $);
