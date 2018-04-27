window.JSBridge = {
	load: function(data) {
		app.load(false);
		app.step(1);
		treeManager.init(data);
	},
	handleError: function(mes) {
		app.load(false);
		alert(mes);
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
		alert("完成")
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
					icoObj.before(switchObj).before(c)
						.before('<span id="' + treeNode.tId + '_my_ico"  class="tree_icon button"><i class="x-item-file x-folder txt small"></i></span>')
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

					var info = '<span class="time"> 2018-04-17 11:33:33</span>';
					info += '<span class="size">李伟龙</span>';
					info += '<span class="type">目录</span>';
					//info += '<span class="menu-item-parent icon-ellipsis-vertical"></span>';
					$("#" + treeNode.tId + "_span").after(info);

					switchObj.parent().addClass(treeNode.menuType);

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
		modal: false,
		explen: 0,
		expdata: [],
		isloading: false,
		loadingtext: "获取数据....",
		loginfo: "",
		keyword: "",
		viewindex: 0,
        per:0,
		form: {
			dbtype: "MSS",
			ip: "LIWL01\\SQLEXPRESS",
			catlog: "FormBulider",
			username: "sa",
			password: "123456a?",
            port:""
		}
	},
	computed: {

	},
	methods: {
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
			hostBridge.initDB(JSON.stringify(this.form)); // 传递数据连接信息
			// 成功后回调 
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
		step: function(index) {
			this.viewindex = index;
		},
		handleSubmit: function(index) {
 

		}
	}
})