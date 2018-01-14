$.leeUIDefaults.Grid = {
	title: null,
	width: 'auto', //宽度值
	height: 'auto', //高度度值
	columnWidth: null, //默认列宽度
	resizable: true, //table是否可改变宽度
	url: false, //动态取数url
	urlParms: null, //url参数信息
	data: null, //本地存储数据
	usePager: true, //是否分页
	hideLoadButton: false, //是否隐藏刷新按钮
	pagerRender: null, //分页栏自定义渲染函数
	page: 1, //默认当前页 
	pageSize: 10, //每页默认的结果数
	pageSizeOptions: [10, 20, 30, 40, 50], //可选择设定的每页结果数
	parms: [], //提交到服务器的参数 
	columns: [], //列配置信息
	minColToggle: 1, //最小显示的列
	dataType: 'server', //数据源：本地(local)或(server),本地是将读取p.data。不需要配置，取决于设置了data或是url
	dataAction: 'server', //提交数据的方式：本地(local)或(server),选择本地方式时将在客服端分页、排序。 
	showTableToggleBtn: false, //是否显示'显示隐藏Grid'按钮 
	switchPageSizeApplyComboBox: true, //切换每页记录数是否应用ligerComboBox
	allowAdjustColWidth: true, //是否允许调整列宽     
	checkbox: false, //是否显示复选框
	isSingleCheck: false, //复选框选择的时候是否单选模式 方便单选
	allowHideColumn: true, //是否显示'切换列层'按钮
	enabledEdit: false, //是否允许编辑
	isScroll: true, //是否滚动 
	dateFormat: 'yyyy-MM-dd', //默认时间显示格式？
	inWindow: true, //是否以窗口的高度为准 height设置为百分比时可用
	statusName: '__status', //状态名
	method: 'post', //获取数据http方式
	async: true,
	fixedCellHeight: true, //是否固定单元格的高度
	heightDiff: 0, //高度补差,当设置height:100%时，可能会有高度的误差，可以通过这个属性调整
	cssClass: null, //类名
	noborder:null,//不现实边框
	root: 'Rows', //数据源字段名
	record: 'Total', //数据源记录数字段名
	pageParmName: 'page', //页索引参数名，(提交给服务器)
	pagesizeParmName: 'pagesize', //页记录数参数名，(提交给服务器)
	sortnameParmName: 'sortname', //页排序列名(提交给服务器)
	sortorderParmName: 'sortorder', //页排序方向(提交给服务器) 
	allowUnSelectRow: false, //是否允许反选行 
	alternatingRow: false, //奇偶行效果
	mouseoverRowCssClass: 'lee-grid-row-over', //鼠标略过css样式
	enabledSort: true, //是否允许排序
	rowClsRender: null, //行自定义css class渲染器
	rowAttrRender: null, //行自定义属性渲染器(包括style，也可以定义)
	groupColumnName: null, //分组 - 列名
	groupColumnDisplay: '分组', //分组 - 列显示名字
	groupRender: null, //分组 - 渲染器
	totalRender: null, //统计行(全部数据)
	delayLoad: false, //初始化时是否不加载
	where: null, //数据过滤查询函数,(参数一 data item，参数二 data item index)
	selectRowButtonOnly: false, //复选框模式时，是否只允许点击复选框才能选择行 
	selectable: true,
	whenRClickToSelect: false, //右击行时是否选中
	contentType: null, //Ajax contentType参数  
	checkboxColWidth: 27, //复选框列宽度
	detailColWidth: 29, //明细列宽度
	clickToEdit: true, //是否点击单元格的时候就编辑
	detailToEdit: false, //是否点击明细的时候进入编辑
	onEndEdit: null,
	minColumnWidth: 80,
	tree: null, //treeGrid模式
	isChecked: null, //复选框 初始化函数
	isSelected: null, //选择 初始化函数
	frozen: true, //是否固定列
	frozenDetail: false, //明细按钮是否在固定列中
	frozenCheckbox: true, //复选框按钮是否在固定列中
	detail: null,
	detailHeight: 260,
	isShowDetailToggle: null, //是否显示展开/收缩明细的判断函数
	rownumbers: false, //是否显示行序号
	frozenRownumbers: true, //行序号是否在固定列中
	rownumbersColWidth: 26, //序号列宽度  
	colDraggable: false, //是否允许表头拖拽
	rowDraggable: false, //是否允许行拖拽
	rowDraggingRender: null, //拖拽渲染函数
	autoCheckChildren: true, //是否自动选中子节点
	onRowDragDrop: null, //行拖拽事件
	rowHeight: 28, //行默认的高度
	headerRowHeight: 36, //表头行的高度
	toolbar: null, //工具条,参数同 LeeToolBar,额外参数有title、icon
	toolbarShowInLeft: true, //工具条显示在左边
	headerImg: null, //表格头部图标  
	editorTopDiff: 0, //编辑器top误差
	editorLeftDiff: 1, //编辑器left误差
	editorHeightDiff: -1, //编辑器高度误差
	unSetValidateAttr: true, //是否不设置validate属性到inuput nouse
	autoFilter: false, //自动生成高级查询, 需要filter/toolbar组件支持. 需要引用skins/ligerui-icons.css nouse
	rowSelectable: true, //是否允许选择
	scrollToPage: false, //滚动时分页
	scrollToAppend: true, //滚动时分页 是否追加分页的形式
	noDataRender: null, //没有数据时候的提示
	/*事件接口方法*/
	onDragCol: null, //拖动列事件
	onToggleCol: null, //切换列事件
	onChangeSort: null, //改变排序事件
	onSuccess: null, //成功获取服务器数据的事件
	onDblClickRow: null, //双击行事件
	onSelectRow: null, //选择行事件
	onBeforeSelectRow: null, //选择前事件
	onUnSelectRow: null, //取消选择行事件
	onBeforeCheckRow: null, //选择前事件，可以通过return false阻止操作(复选框)
	onCheckRow: null, //选择事件(复选框)  
	onBeforeCheckAllRow: null, //选择前事件，可以通过return false阻止操作(复选框 全选/全不选)
	onCheckAllRow: null, //选择事件(复选框 全选/全不选)onextend
	onBeforeShowData: null, //显示数据前事件，可以通过reutrn false阻止操作
	onAfterShowData: null, //显示完数据事件
	onError: null, //错误事件
	onSubmit: null, //提交前事件
	onReload: null, //刷新事件，可以通过return false来阻止操作
	onToFirst: null, //第一页，可以通过return false来阻止操作
	onToPrev: null, //上一页，可以通过return false来阻止操作
	onToNext: null, //下一页，可以通过return false来阻止操作
	onToLast: null, //最后一页，可以通过return false来阻止操作
	onAfterAddRow: null, //增加行后事件
	onBeforeEdit: null, //编辑前事件
	onBeforeSubmitEdit: null, //验证编辑器结果是否通过
	onAfterEdit: null, //结束编辑后事件
	onLoading: null, //加载时函数
	onLoaded: null, //加载完函数
	onContextmenu: null, //右击事件
	onBeforeCancelEdit: null, //取消编辑前事件
	onAfterSubmitEdit: null, //提交后事件
	onRowDragDrop: null, //行拖拽后事件
	onGroupExtend: null, //分组展开事件
	onGroupCollapse: null, //分组收缩事件
	onTreeExpand: null, //树展开事件
	onTreeCollapse: null, //树收缩事件
	onTreeExpanded: null, //树展开事件
	onTreeCollapsed: null, //树收缩事件
	onLoadData: null, //加载数据前事件 
	onHeaderCellBulid: null
};

$.leeUIDefaults.GridString = {
	errorMessage: '发生错误',
	pageStatMessage: '共{total}条记录  ， 显示第 {from} 条- 第{to} 条 ',
	pageTextMessage: 'Page',
	loadingMessage: '正在加载中...',
	findTextMessage: '查找',
	noRecordMessage: '没有符合条件的记录存在',
	isContinueByDataChanged: '数据已经改变,如果继续将丢失数据,是否继续?',
	cancelMessage: '取消',
	saveMessage: '保存',
	applyMessage: '应用',
	draggingMessage: '{count}行'
};

 
//排序器扩展
$.leeUIDefaults.Grid.sorters = $.leeUIDefaults.Grid.sorters || {};

//格式化器扩展
$.leeUIDefaults.Grid.formatters = $.leeUIDefaults.Grid.formatters || {};

//编辑器扩展
$.leeUIDefaults.Grid.editors = $.leeUIDefaults.Grid.editors || {};

$.leeUIDefaults.Grid.sorters['date'] = function(val1, val2) {
	return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
};
$.leeUIDefaults.Grid.sorters['int'] = function(val1, val2) {
	return parseInt(val1) < parseInt(val2) ? -1 : parseInt(val1) > parseInt(val2) ? 1 : 0;
};
$.leeUIDefaults.Grid.sorters['float'] = function(val1, val2) {
	return parseFloat(val1) < parseFloat(val2) ? -1 : parseFloat(val1) > parseFloat(val2) ? 1 : 0;
};
$.leeUIDefaults.Grid.sorters['string'] = function(val1, val2) {
	if(!val1) return false;
	return val1.localeCompare(val2);
};

$.leeUIDefaults.Grid.formatters['date'] = function(value, column) {
	function getFormatDate(date, dateformat) {
		var g = this,
			p = this.options;
		if(isNaN(date)) return null;
		var format = dateformat;
		var o = {
			"M+": date.getMonth() + 1,
			"d+": date.getDate(),
			"h+": date.getHours(),
			"m+": date.getMinutes(),
			"s+": date.getSeconds(),
			"q+": Math.floor((date.getMonth() + 3) / 3),
			"S": date.getMilliseconds()
		}
		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
					("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	if(!value) return "";
	// /Date(1328423451489)/
	if(typeof(value) == "string" && /^\/Date/.test(value)) {
		value = value.replace(/^\//, "new ").replace(/\/$/, "");
		eval("value = " + value);
	}
	if(value instanceof Date) {
		var format = column.format || this.options.dateFormat || "yyyy-MM-dd";
		return getFormatDate(value, format);
	} else {
		return value.toString();
	}
}

//引用类型,数据形式表现为[id,text] 
$.leeUIDefaults.Grid.formatters['ref'] = function(value) {
	if($.isArray(value)) return value.length > 1 ? value[1] : value[0];
	return value;
};