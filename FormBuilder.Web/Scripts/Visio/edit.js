var VisioController = {
    model: {},
    GraphConfig:{},
    setModel: function (model) {
        this.model = model;
        if(this.model.GraphConfig){
            this.GraphConfig=JSON.parse(this.model.GraphConfig);
        }
    },
    getModel: function () {
        this.model.GraphConfig=JSON.stringify(this.GraphConfig);
        return this.model;
    },
    getConfig: function () {
        this.GraphConfig= this.GraphConfig||{};
        return this.GraphConfig;
    },
    setConfig: function (id, value) {
        this.model.GraphConfig[id] = value;
    },
    load: function (editor) {
        $.leeDialog.loading("正在初始化....");
        var self=this;
        var id=urlParams.dataid;
        $.post(_global.sitePath + "/Visio/GetModel", { id: id }, function (res) {
            if (res.res) {
                self.setModel(res.data);
                self.initGraph(editor);
            }else{
                $.leeUI.Error(res.mes);
            }
            $.leeDialog.hideLoading();
        });
    },
    initGraph:function(editor){
       
        var doc = mxUtils.parseXml(this.getXML()); 
        editor.setGraphXml(doc.documentElement);
        editor.setFilename(this.model.Name);
	    editor.setModified(false);
	    editor.undoManager.clear();
    },
    saveConfig:function(xml){
        var model=this.getModel();
        model.GraphXML=Base64.encode(xml);
        this.save(model);
    },
    getXML:function(){
        return Base64.decode(this.model.GraphXML);
    },
    save: function (model) {

        $.leeDialog.loading("正在保存....");
        $.post(_global.sitePath + "/Visio/saveData", {  id: model.ID, model: JSON.stringify(model) }, function (res) {
            if (res.res) {
                 $.leeUI.Success("保存成功");
            }  else{
                $.leeUI.Error(res.mes);
            }
            $.leeDialog.hideLoading();
        });
    }
}



