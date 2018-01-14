$(function() {
	var leftnavWrap=$(".left-nav");
	var rightnavWrap=$(".right-nav");
	
	var leftnav = $(".left-nav .btn-fold-menu");
	var rightnav = $(".right-nav .btn-fold-menu");
	var centernav = $(".center-nav");
	if(leftnav.length > 0) {
		leftnav.click(function() {
			if($(this).hasClass("fold")) {
				$(this).removeClass("fold");
				$(this).find("i").removeClass("icon-arrows_right_double-");
				toogleCenterPanel(true,false);
			} else {
				$(this).addClass("fold");
				$(this).find("i").addClass("icon-arrows_right_double-");
				toogleCenterPanel(true,true);
			}
		});
	}
	if(rightnav.length > 0) {
		rightnav.click(function() {
			if($(this).hasClass("fold")) {
				$(this).removeClass("fold");
				$(this).find("i").removeClass("icon-arrows_right_double-");
				toogleCenterPanel(false,false);
			} else {
				$(this).addClass("fold");
				$(this).find("i").addClass("icon-arrows_right_double-");
				toogleCenterPanel(false,true);
			}
		});
	}

	function toogleCenterPanel(isleft, flag) {
		if(isleft) {
			if(flag) {
				leftnavWrap.addClass("fold");
				centernav.addClass("hideleft");
				//leftnavWrap.animate({"width": "0"});
				//centernav.animate({"margin-left":"0"});
			} else {
				leftnavWrap.removeClass("fold");
				centernav.removeClass("hideleft");
				//leftnavWrap.animate({"width":"200px"});
				//centernav.animate({"margin-left":"200px"})
			}
		} else {
			if(flag) {
				centernav.addClass("hideright");
				rightnavWrap.addClass("fold");
				
				//rightnavWrap.animate({"width": "0"});
				//centernav.animate({"margin-right":"0"});
			} else {
				centernav.removeClass("hideright");
				rightnavWrap.removeClass("fold");
				
				//rightnavWrap.animate({"width":"200px"});
				//centernav.animate({"margin-right":"200px"});
			}
		}
	}
	
	
	var $tablebody=$(".lee-table-body-inner");
	var $tablehead=$(".lee-table-header-inner");
	var $grid2_lock=$(".lee-table-body .lee-table-body-lock");
	var grid2=$(".lee-table-body");
	grid2.height(400);
	$tablebody.bind("scroll",function(){
		var left=$(this).scrollLeft();
		var top=$(this).scrollTop();
		console.log(left);
		var tbheight=$tablebody.find("table").height();
		if(tbheight>400){
			$tablehead.addClass("padding");
			$grid2_lock.addClass("padding");
		}else{
			$tablehead.removeClass("padding");
			$grid2_lock.removeClass("padding");
		}
		$tablehead.scrollLeft(left);
		$grid2_lock.scrollTop(top);
	});
	
	function calcScroll()
	{
		//滚动条事件绑定
	}
	
	function autoResize()
	{
		//自动计算高度
		//计算主区域高度
		//计算滚动区域高度
		//计算固定列宽度  高度
		
	
	}
});

function autoFixLeeTable() {
    var $tablebody = $(".lee-table-body-inner");
    var $tablehead = $(".lee-table-header-inner");
    var $grid2_lock = $(".lee-table-body .lee-table-body-lock");
    var grid2 = $(".lee-table-body");
    grid2.height(400);
    $tablebody.bind("scroll", function () {
        var left = $(this).scrollLeft();
        var top = $(this).scrollTop();
        console.log(left);
        var tbheight = $tablebody.find("table").height();
        if (tbheight > 400) {
            $tablehead.addClass("padding");
            $grid2_lock.addClass("padding");
        } else {
            $tablehead.removeClass("padding");
            $grid2_lock.removeClass("padding");
        }
        $tablehead.scrollLeft(left);
        $grid2_lock.scrollTop(top);
    });
}