window.JSBridge = {
	load: function(data) {
		app.load(false);
		app.step(1);
		treeManager.init(data);
	},
	handleError: function(mes) {
		app.load(false);
		app.error(mes);


	},
    progress:function(per){
        app.progress(per);
    },
	begin: function(total) {
		// 开始导出
	},
	append: function(mes) {
		// 写入日志
		app.append(mes);
	},
	updateloading: function(progress) {
		
	},
	done: function() {
		//完成导出
		app.scuess("导出完成！")
	}
};
var data;
var hostBridge = {
	initDB: function() {
 

	},
    begin:function(){
    }
};
var count = 0;
var treeManager = {
	init: function(data) {

		var setting = {
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			view: {
				showLine: false,
				selectedMulti: false,
				expandSpeed: "fast",
				addDiyDom: function(treeId, treeNode) {
					var spaceWidth = 15; //相差宽度
					var switchObj = $("#" + treeNode.tId + "_switch"),
						icoObj = $("#" + treeNode.tId + "_ico"),
						c = $("#" + treeNode.tId + "_check");
					switchObj.remove();
					c.remove();
					treeNode.iconSkin = treeNode.tree_icon;

					$("#" + treeNode.tId + "_span").addClass('name');
					var tree_icon = treeNode.tree_icon;
					if(treeNode.ext) {
						tree_icon = treeNode.ext;
					} else if(!treeNode.tree_icon) {
						tree_icon = treeNode.type;
					}
                    var css="";
                    if(treeNode.mtype=="9"||treeNode.mtype==null) {
                        css="x-folder";
                    }
					icoObj.before(switchObj).before(c)
						.before('<span id="' + treeNode.tId + '_my_ico"  class="tree_icon button"><i class="x-item-file '+css+' txt small"></i></span>')
						.remove();

					if(treeNode.ext != undefined) { //如果是文件则用自定义图标
						icoObj.attr('class', '')
							.addClass('file ' + treeNode.ext).removeAttr('style');;
					}
					if(treeNode.level >= 1) {
						var spaceStr = "<span class='space' style='display: inline-block;width:" +
							(spaceWidth * treeNode.level) + "px'></span>";
						switchObj.before(spaceStr);
					}

					var info = '<span class="time"> '+treeNode.time+'</span>';
					info += '<span class="size">'+treeNode.createuser+'</span>';
					info += '<span class="type">'+getMetaName(treeNode.mtype)+'</span>';
					//info += '<span class="menu-item-parent icon-ellipsis-vertical"></span>';
					$("#" + treeNode.tId + "_span").after(info);

					switchObj.parent().addClass(treeNode.menuType);

                    function getMetaName(type){
                        var res="文件夹";    
                        switch(type) {
                            case "0":
                                res="数据对象";
                                break;
                            case "1":
                                res="数据模型";
                                break;
                            case "2":
                                res="智能帮助";
                                break;
                            case "3":
                                res="自定义表单";
                                break;
                            case "5":
                                res="自定义数据源";
                                break;
                            case "6":
                                res="业务构件";
                                break;
                            default:
                                break;
                        }
                        return res;
                    }

				}
			}
		};

		$.fn.zTree.init($("#treeView"), setting, data);

	},
	getSelect: function() {
		var zTree = $.fn.zTree.getZTreeObj("treeView");

		var arr = zTree.getCheckedNodes();
		return arr;
	},
	filter: function(key) {

		for(var item in data) {
			if(data[item]["name"].indexOf(key) != -1) {
				data[item].isHidden = false;
			} else {
				data[item].isHidden = true;
			}
		}

	},
	autoMatch: function(keyword) {

		var treeObj = $.fn.zTree.getZTreeObj("treeView");
		treeObj.showNodes(hiddenNodes);
		//查找不符合条件的叶子节点
		function filterFunc(node) {
			if(node.isParent || node.name.indexOf(keyword) != -1) return false;
			return true;
		};
		//获取不符合条件的叶子结点
		hiddenNodes = treeObj.getNodesByFilter(filterFunc);

		//隐藏不符合条件的叶子结点
		treeObj.hideNodes(hiddenNodes);
	}
}

var hiddenNodes = [];
var app = new Vue({
	el: '#app',
	data: {
		columns: [{
				title: 'ID',
				key: 'id',
				sortable: true
			},
			{
				title: '名称',
				key: 'name',
				sortable: true
			},
			{
				title: '类型',
				key: 'type',
				sortable: true
			}
		],
        hisdb:[],
        datastr:[],
        showfolder:true,
		modal: false,
        st:"",
		explen: 0,
		expdata: [],
		isloading: false,
		loadingtext: "获取数据....",
		loginfo: "",
		keyword: "",
		viewindex: 0,
        per:0,
		form: {
			dbtype: "",
			ip: "",
			catlog: "",
			username: "",
			password: "",
            port:""
		}
	},
	computed: {

	},
	methods: {
        sethis:function(data){
            this.hisdb=data;
            for(var item in data){
                this.datastr.push(data[item].ip);
            }
        },
        progress:function(num){
            this.per=num;
        },
        clearlog:function(){
            this.loginfo="";
        },
		load: function(flag, mes) {
			this.isloading = flag;
			this.loadingtext = mes || "加载中...";
		},
		search: function() {

			treeManager.autoMatch(this.keyword);
		},
		enter: function() {
			this.load(true, "初始化数据库信息")
			hostBridge.initDB(JSON.stringify(this.form),this.showfolder,this.st); // 传递数据连接信息
			// 成功后回调 
		},
        error:function(desc){
            this.$Notice.warning({
                title: '系统提示',
                desc: desc
            });
        },
        sortchange:function(name){
            if(name=="1"){
                if(this.st==""||this.st=="2"){
                    this.st="1";
                }else{
                     this.st="2";
                }
            }else{
                if(this.st==""||this.st=="4"){
                    this.st="3";
                }else{
                     this.st="4";
                }
            }
            this.refreshList();
            //alert(name);
        },
        refreshList:function(){

			this.load(true, "加载中...")
            hostBridge.refresh(this.showfolder,this.st); // 传递数据连接信息
        },
        scuess:function(desc){
            this.$Notice.success({
                title: '系统提示',
                desc: desc
            });
        },
		append: function(mes) {
			this.loginfo += mes + "\n";
            $("#txtlog>textarea")[0].scrollTop=$("#txtlog>textarea")[0].scrollHeight
		},
		beginExport: function() {
			
			this.append("开始导出..... 一共" + this.explen + "条记录");
            hostBridge.begin(JSON.stringify(this.expdata)); // 传递数据连接信息
		},
		stepExport: function() {
			var data = treeManager.getSelect();

			this.explen = data.length;
			this.expdata=data;
            this.per=0;
            this.clearlog();
			this.viewindex = 2;
		},
        open:function(){
            hostBridge.open();
        },
		step: function(index) {
			this.viewindex = index;
		},
		handleSubmit: function(index) {
 

		},
        selectip:function(value){
    
            var row=this.hisdb.find(function(i){return i.ip==value});
            if(row){
                this.form.catlog=row.catlog;
                this.form.ip=row.ip;
                this.form.password=row.password;
                this.form.port=row.port;
                this.form.username=row.username
                this.form.dbtype=row.dbtype;
            }
        },
        filterMethod (value, option) {
                return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        }
	}
});

var data=eval(hostBridge.load());
app.sethis(data); 