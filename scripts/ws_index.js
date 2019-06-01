$(function() {
	//聚焦，失焦
	$("#inputSearch").each(function() {
		//获取input框的值
		var oldValue = $(this).val();
		//聚焦
		$(this).focus(function() {
				if($(this).val() == oldValue) {
					$(this).addClass("focus");
					$(this).val('')
				}
			})
			//失焦
			.blur(function() {
				if($(this).val() == "") {
					$(this).removeClass("focus");
					$(this).val(oldValue)
				}
			});
	});

	//主体色彩切换
	$("#skin>li").each(function(index, item) {
		$(item).click(function() {
			//点击按钮添加样式
			$(this).addClass("selected").siblings().removeClass("selected");
			$("#cssfile").attr({
				rel: "stylesheet",
				type: 'text/css',
				href: 'styles/skin/skin_' + index + '.css'
			});
		});
	});

	//导航栏切换
	$("#caption>ul>li").each(function(index, item) {
		//鼠标移到当前菜单时
		$(this).mousemove(function() {
			//find是会找到所有级别的class=jnNav
			$(this).find(".jnNav").show();
		});
		//鼠标移出时
		$(this).mouseout(function() {
			$(this).find(".jnNav").hide();
		});
	});

	//热卖商品展示
	$(".promoted").append($("<s class='hot'></s>"));

	//右侧上部的广告轮播效果
	var index = 0; //图片的索引
	var $imgrolls = $("#jnImageroll div a");
	$("#jnImageroll div a").mouseover(function() {
		index = $imgrolls.index(this);
		showImg(index);
	}).eq(0).mouseover();
	//滑入停止动画，画出开始动画
	var adTimer = null;
	$("#jnImageroll").hover(function() {
		if(adTimer) {
			clearInterval(adTimer);
		}
	}, function() {
		adTimer = setInterval(function() {
			showImg(index);
			index++;
			if(index == $imgrolls.length) {
				index = 0;
			}
		}, 3000);
	}).trigger("mouseleave");
	//图片轮播的显示图片函数
	function showImg(index) {
		var $rollobj = $("#jnImageroll");
		var $rolllist = $rollobj.find("div a");
		var newhref = $rolllist.eq(index).attr("href");
		$("#JS_imgWrap").attr("href", newhref)
			.find("img").eq(index).stop(true, true).fadeIn()
			.siblings().fadeOut();
		$rolllist.removeClass("chos").css("opacity", "0.7")
			.eq(index).addClass("chos").css("opacity", "1");
	}

	//超链接文字提示动画
	var x = 5;
	var y = 5;
	$("a.tooltip").mouseenter(function(e) {
		//当鼠标滑入时，给对象添加一个新属性，并把title的值传给这个属性，
		this.myTitle = this.title;
		//然后清空属性title的值
		this.title = "";
		//创建div元素
		var tooltip = "<div id='tooltip'>" + this.myTitle + "</div>";
		//把他追加到文本中
		$("body").append(tooltip);
		$("#tooltip").css({
			"left": (e.pageX + x) + "px",
			"top": (e.pageY + y) + "px"
		}).show("fast"); //设置
		//当鼠标滑出时，
	}).mouseout(function() {
		// 再把对象的myTitle属性的值又赋给属性title。
		this.title = this.myTitle;
		$("#tooltip").remove(); //移除
	}).mousemove(function(e) {
		$("#tooltip").css({
			"left": (e.pageX + x) + "px",
			"top": (e.pageY + y) + "px"
		});
	});

	//品牌活动区特效
	function showBrandList(index) {
		var $rollobj = $("#jnBrandList");
		var rollWidth = $rollobj.find("li").outerWidth(); //li元素的外部宽度
		rollWidth = rollWidth * 4; //一个版面的宽度
		//1秒钟移动到距左侧偏移量
		$rollobj.stop(true, false).animate({
			left: -rollWidth * index
		}, 1000);
	}
	$("#jnBrandTab li a").click(function() {
		$(this).parent().addClass("chos").siblings().removeClass("chos");
		var id = $("#jnBrandTab li a").index(this);
		showBrandList(id);
		return false;
	}).eq(0).click(); //默认加载后点击第一个元素

	//鼠标移到图片覆盖放大镜
	$("#jnBrandList li").each(function(index) {
		var $this = $(this);
		var $img = $this.find("img");
		setTimeout(function() {
			var img_w = $img.width(); //图片的宽度
			var img_h = $img.height(); //图片的高度
			var spanHtml = '<span ' + 'style="position:absolute;top:0;left:0;width:' + img_w + 'px;height:' + img_h + 'px;" class="imageMask"></span>';
			//给每个产品图片的父级li元素添加放大镜spanHtml
			$(spanHtml).appendTo($this);
		}, 500);
	});
	//控制放大镜的显示与隐藏
	$("#jnBrandList").delegate(".imageMask", "mouseenter mouseleave", function() {
		$(this).toggleClass("imageOver");
	});

	/*
	 * 详情页
	 */
	//图片放大
	//为小图片添加hover事件 鼠标移动到小图片上时，放大区域和大图片的div需要显示出来，反之隐藏
	$(".jqzoomWrap").hover(function() {
		$(".bimg").css("display", "block");
		$("#move").css("display", "block");
	}, function() {
		$(".bimg").css("display", "none");
		$("#move").css("display", "none");
	});
	//需要为小图片的div添加一个鼠标移动时间
	$(".jqzoomWrap").mousemove(function(event) {
		// 一、首先实现“放大镜”框跟随鼠标移动的功能（我们让鼠标处于“放大镜”框的中心）

		// 获取鼠标当前位置
		var pageX = event.pageX; //鼠标到文档头部距离
		var pageY = event.pageY; //鼠标到文档左侧距离

		// 获取“小图”窗口在整个文档中的偏移位置
		var offsetX = $('.jqzoomWrap').offset().left; //当前元素到左侧距离
		var offsetY = $('.jqzoomWrap').offset().top; //当前元素到头部距离
		// 计算鼠标在小图中的相对位置
		var relativeX = pageX - offsetX;
		var relativeY = pageY - offsetY;

		// 考虑到鼠标处于“放大镜”框的中心，我们要根据鼠标位置计算“放大镜”框的位置
		var magOffsetX = $('.move').width() / 2; //遮罩层宽的一半
		var magOffsetY = $('.move').height() / 2; //遮罩层高的一半

		var left1 = relativeX - magOffsetX;
		var top1 = relativeY - magOffsetY;

		$('.move').css({
			left: left1 + 'px',
			top: top1 + 'px'
		});
		// 二、处理越界情况  
		// 确定边界
		var maxMagX = $('.jqzoomWrap').width() - $('.move').width();
		var maxMagY = $('.jqzoomWrap').height() - $('.move').height();
		// 左边界
		if(left1 <= 0) {
			left1 = 0;
			$('.move').css('left', '0px');
		}
		// 右边界
		if(left1 >= maxMagX) {
			left1 = maxMagX;
			$('.move').css('left', maxMagX + 'px');
		}
		// 上边界
		if(top1 <= 0) {
			top1 = 0;
			$('.move').css('top', '0px');
		}
		// 下边界
		if(top1 >= maxMagY) {
			top1 = maxMagY;
			$('.move').css('top', maxMagY + 'px');
		}
		// 三、其次实现“原图”窗口中的图片随“放大镜”框的移动而相应移动   
		// 按照之前确定的缩放比例移动“原图”窗口中的图片
		// 图片的移动方向与鼠标的移动方向是相反的！
		var maxMagX2 = $('.bimg img').width() - $('.bimg').width();
		var maxMagY2 = $('.bimg img').height() - $('.bimg').height();

		var left2 = left1 / maxMagX * maxMagX2;
		var top2 = top1 / maxMagY * maxMagY2;
		$('.bimg img').css({
			marginLeft: -left2 + 'px',
			marginTop: -top2 + 'px'
		});
	});

	//下面小图片切换大图片，单击“观看清晰图片”的大图更新
	$("#jnProitem ul.imgList li a").bind("click", function() {
		var imgSrc = $(this).find("img").attr("src");
		var index = imgSrc.lastIndexOf(".");
		var unit = imgSrc.substring(index);
		imgSrc = imgSrc.substring(0, index);
		var imgSrc_big = imgSrc + "_big" + unit;
		$("#thickImg").attr("href", imgSrc_big);
	});
	//产品属性介绍之类的选项卡
	var $div_li = $(".tab_menu ul li a");
	$div_li.click(function() {
		$(this).parent().addClass("chos")
			.siblings().removeClass("chos");
		var index = $div_li.index(this);
		$(".tab_box div").eq(index).show()
			.siblings().hide();
	}).eq(0).click();
	//右侧产品颜色切换

	$(".color_change ul li img").click(function() {
		var imgSrc = $(this).attr("src");
		var i = imgSrc.lastIndexOf(".");
		var unit = imgSrc.substring(i);
		imgSrc = imgSrc.substring(0, i);
		var imgSrc_big = imgSrc + "_ong_big" + unit;
		var imgSrc_small = imgSrc + "_one_small" + unit;
		$("#bigImg").attr("src", imgSrc_small);
		$("thickImg").attr("href", imgSrc_big);
		var newImgSrc = imgSrc.replace("images/pro_img/", "");
		$("#jnProitem .imgList li").hide();
		$("#jnProitem .imgList").find(".imgList_" + newImgSrc).show();
		var alt = $(this).attr("alt");
		$(".color_change strong").text(alt);
		//不动手单击缩略图，放大镜效果还是之前的图片
		$("#jnProitem .imgList").find(".imgList_" + newImgSrc).eq(0).find("a").click();
	});
	//右侧产品尺寸切换
	$(".pro_size ul li").click(function() {
		$(this).addClass("cur")
			.siblings().removeClass("cur");
		var size = $(this).text();
		$(".pro_size strong").text(size);
	});
	//右侧产品数量和价格联动
	var $span = $(".pro_price strong");
	var proprice = $span.text();
	$("#num_sort").change(function() {
		var num = $(this).val();
		var price = num * proprice;
		$span.text(price);
	}).change();
	//右侧评分效果，星星评分
	$(".pro_rating ul li a").click(function() {
		// var title=$(this).attr("title");
		// alert("您给次商品的评分是："+title);
		console.log($(".pro_rating ul li a").index(this));
		var cl = $(this).parent().attr("class");
		$(this).parent().parent().removeClass().addClass("rating " + cl + "star");
		$(this).blur();
		return false;
	});
	//购买
	var $product = $(".jnProDetail");
	$("#cart a").click(function(e) {
		var pro_name = $product.find("h4:first").text();
		var pro_size = $product.find(".pro_size strong").text();
		var pro_color = $(".color_change strong").text();
		var pro_num = $product.find("#num_sort").val();
		var pro_price = $product.find(".pro_price strong").text();
		var dialog = "感谢您的购买。<div style='font-size:12px;font-weight:400;'>您购买的产品是：" + pro_name + "；" +
			"尺寸是：" + pro_size + "；" +
			"颜色是：" + pro_color + "；" +
			"数量是：" + pro_num + "；" +
			"总价是：" + pro_price + "元。</div>";
		$("#jnDialogContent").html(dialog);
		$('#basic-dialog-ok').modal();
		return false; //避免页面跳转
	});

});