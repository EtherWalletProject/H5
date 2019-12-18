var W = W || window;
var showTipsFlag = true;

var __ns = function( fullNs ) {
	var nsArray = fullNs.split('.');
	var evalStr = '';
	var ns = '';
	for ( var i = 0, l = nsArray.length; i < l; i++ ) {
		i !== 0 && ( ns += '.' );
		ns += nsArray[i];
		evalStr += '( typeof ' + ns + ' === "undefined" && (' + ns + ' = {}) );';
	}
	evalStr !== '' && eval( evalStr );
};
__ns('H');

var isIOS = function() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	return isiOS;
};

var getQueryString = function( name, url ) {
	if (!url) url = location.href;
	var target = url.split('?');
	if (url.indexOf('?') >= 0) {
		var temp = '';
		for(var i = 1; i < target.length; i++) {
			if (i == 1) {
				temp = target[i];
			} else {
				temp = temp + '&' + target[i];
			}
		};
		var currentSearch = decodeURIComponent(temp);
		if (currentSearch != '') {
			var paras = currentSearch.split('&');
			for ( var i = 0, l = paras.length, items; i < l; i++ ) {
				var ori = paras[i];
				if (paras[i].indexOf('#') >= 0) {
					paras[i] = paras[i].split('#')[0];
				}
				items = paras[i].split('=');
				if ( items[0] === name) return items[1];
			};
			return '';
		} else {
			return '';
		}
	} else {
		return '';
	}
};

var scrollToTopInProgress = false
$.fn.scrollToTop = function(position, onEndCallback) {
	var $this = this,
		targetY = position || 0,
		initialY = $this.scrollTop(),
		lastY = initialY,
		delta = targetY - initialY,
		speed = Math.min(750, Math.min(1500, Math.abs(initialY - targetY))),
		start, t, y,
		frame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			var currTime = new Date().getTime(),
				timeToCall = Math.max(0, 16 - (currTime - lastTime)),
				timeOutId = setTimeout(function() {
					callback(currTime + timeToCall)
				}, timeToCall);
			lastTime = currTime + timeToCall
			return timeOutId
		},
		cancelScroll = function() {
			abort()
		}
	if (scrollToTopInProgress) return
	if (delta == 0) return

	function smooth(pos) {
		if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 5)
		return 0.5 * (Math.pow((pos - 2), 5) + 2)
	}

	function abort() {
		$this.off('touchstart', cancelScroll)
		scrollToTopInProgress = false
		if (typeof onEndCallback == 'function')
			onEndCallback.call(this, targetY)
	}
	$this.on('touchstart', cancelScroll)
	scrollToTopInProgress = true
	frame(function render(now) {
		if (!scrollToTopInProgress) return
		if (!start) start = now
		t = Math.min(1, Math.max((now - start) / speed, 0))
		y = Math.round(initialY + delta * smooth(t))
		if (delta > 0 && y > targetY) y = targetY
		if (delta < 0 && y < targetY) y = targetY
		if (lastY != y) $this.scrollTop(y)
		lastY = y
		if (y !== targetY) frame(render)
		else abort()
	})
};

var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
Math.sn = function (len, radix) {
	var chars = CHARS, sn = [], i;
	radix = radix || chars.length;
	if (len) {
		for (i = 0; i < len; i++) sn[i] = chars[0 | Math.random()*radix];
	} else {
		var r;
		sn[8] = sn[13] = sn[18] = sn[23] = '-';
		sn[14] = '4';
		for (i = 0; i < 36; i++) {
			if (!sn[i]) {
				r = 0 | Math.random()*16;
				sn[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	var re = new RegExp("-", "g");
	return sn.join('').toLocaleLowerCase().replace(re, "");
};

var from = getQueryString("from");
var gefrom = from || getQueryString("gefrom");

var showLoading = shownewLoading = function($container, tips) {
	var t = simpleTpl(),
		width = $(window).width(),
		height = $(window).height(),
		$container = $container || $('body'),
		$loading = $container ? $container.find('#mmld') : $('body').children('#mmld'),
		tips = tips || '努力加载中...';
	if ($loading.length > 0) $loading.remove();
	t._('<div class="mmld" id="mmld"><div id="qy_loading" class="qy-loading">')
		._('<div class="qy-loading-logo">')
			._('<div class="qy-logo-1"></div>')
			._('<div class="qy-logo-2"></div>')
			._('<div class="qy-logo-3"></div>')
		._('</div>')
		._('<div class="qy-loading-tips">' + tips+ '</div>')
	._('</div></div>');
	$container.append(t.toString());
};

var hideLoading = hidenewLoading = function($container) {
	if ($container) {
		$container.find('#mmld').remove();
	} else {
		$('body').children('#mmld').remove();
	}
};

var toUrl = function(url) {
	shownewLoading(null, '请稍后...');
	if (from != null && from != '') {
		if (url.indexOf(".html?") > 0) {
			url = url + "&gefrom=" + from;
		} else {
			url = url + "?gefrom=" + from;
		}
	}
	if (gefrom != null && gefrom != '') {
		if (url.indexOf("gefrom=") < 0) {
			if (url.indexOf(".html?") > 0) {
				url = url + "&gefrom=" + gefrom;
			} else {
				url = url + "?gefrom=" + gefrom;
			}
		}
	}
	setTimeout(function(){window.location.href = url}, 100);
};

var showTips = function(tips, timer) {
	if (tips == undefined) return;
	if (showTipsFlag) {
		showTipsFlag = false;
		$('body').append('<div class="showTips" style="position:fixed;max-width:80%;z-index:999999999999;color:#FFF;padding:15px 18px;font-size:17px;border-radius:3px;background:rgba(0,0,0,.7);text-align:center;opacity:0">' + tips + '</div>');
		var winW = $(window).width(), winH = $(window).height(), tipsW = $('.showTips').width(), tipsH = $('.showTips').height(), timer = timer || 1200;
		$('.showTips').css({'left':(winW - tipsW)/2, 'top':(winH - tipsH)/2.5}).animate({'opacity': '1'}, 300, function() {
			setTimeout(function() {
				$('.showTips').animate({'opacity':'0'}, 100, function() {
					$('.showTips').remove();
					showTipsFlag = true;
				});
			}, timer);
		});
	};
};

var getResult = function(url, data, callback, showloading, $target, isAsync) {
	if (showloading) shownewLoading();
	$.ajax({
		type : 'GET',
		async : typeof isAsync === 'undefined' ? false : isAsync,
		url : domain_url + url + dev,
		data: data,
		dataType : "jsonp",
		jsonp : callback,
		complete: function() {
			if (showloading) hidenewLoading();
		},
		success : function(data) {}
	});
};

var getPostResult = function(url, data, callback, showloading, $target, isAsync) {
	if (showloading) shownewLoading();
	$.ajax({
		type : 'post',
		async : typeof isAsync === 'undefined' ? false : isAsync,
		url : domain_url + url + dev,
		data: data,
		dataType : "jsonp",
		jsonp : callback,
		complete: function() {
			if (showloading) hidenewLoading();
		},
		success : function(data) {}
	});
};


var getBeforeDate = function(n){
	var n = n, d = new Date();
	var year = d.getFullYear(), mon=d.getMonth() + 1, day=d.getDate();
	if(day <= n){
		if(mon > 1) {
			mon = mon - 1;
		} else {
			year = year - 1;
			mon = 12;
		}
	}
	d.setDate(d.getDate() - n);
	year = d.getFullYear();
	mon=d.getMonth() + 1;
	day=d.getDate();
	s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
	return s;
};

var timeTransform = function(TimeMillis){
	var data = new Date(TimeMillis);
	var year = data.getFullYear();
	var month = data.getMonth()>=9?(data.getMonth()+1).toString():'0' + (data.getMonth()+1);
	var day = data.getDate()>9?data.getDate().toString():'0' + data.getDate();
	var hours = data.getHours()>9?data.getHours().toString():'0' + data.getHours();
	var minutes = data.getMinutes()>9?data.getMinutes().toString():'0' + data.getMinutes();
	var ss = data.getSeconds()>9?data.getSeconds().toString():'0' + data.getSeconds();
	var time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":"+ ss;
	return time;
};

var simpleTpl = function(tpl) {
	tpl = $.isArray(tpl) ? tpl.join('') : (tpl || '');
	return {
		store: tpl,
		_: function() {
			var me = this;
			$.each( arguments, function( index, value ) {
				me.store += value;
			} );
			return this;
		},
		toString: function() {
			return this.store;
		}
	};
};

var normalDate = function(stamp, format, zero) {
	var stamp = Number(stamp),
	date = new Date(stamp), formatDate,
	format = format ? format : "yyyy-mm-dd hh:ii:ss",
	zero = (zero === undefined) ? true : zero,
	dateNum = function(num) { return num < 10 ? '0' + num : num; },
	_d = zero ? dateNum : function(s){return s;};
	var year = _d(date.getFullYear()), month = _d(date.getMonth() + 1), day = _d(date.getDate()), hour = _d(date.getHours()), minute = _d(date.getMinutes()), second = _d(date.getSeconds());
	formatDate = format.replace(/yyyy/i, year).replace(/mm/i, month).replace(/dd/i, day).replace(/hh/i, hour).replace(/ii/i, minute).replace(/ss/i, second);
	return formatDate;
};

var str2date = function(str) {
	str = str.replace(/-/g, '/');
	return new Date(str);
};

var timestamp = function(str) {
	var timestamp = Date.parse(str2date(str));
	return timestamp;
};

var dateformat = function(date, format) {
	var z = {
		M : date.getMonth() + 1,
		d : date.getDate(),
		h : date.getHours(),
		m : date.getMinutes(),
		s : date.getSeconds()
	};
	format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
		return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
	});
	return format.replace(/(y+)/g, function(v) {
		return date.getFullYear().toString().slice(-v.length)
	});
};

var dateNum = function(num) {
	return num < 10 ? '0' + num : num;
};

var add_param = function(sourceUrl, parameterName, parameterValue, replaceDuplicates) {
	if ((sourceUrl == null) || (sourceUrl.length == 0)) {
		sourceUrl = document.location.href;
	}
	var urlParts = sourceUrl.split("?");
	var newQueryString = "";
	if (urlParts.length > 1) {
		var parameters = urlParts[1].split("&");
		for ( var i = 0; (i < parameters.length); i++) {
			var parameterParts = parameters[i].split("=");
			if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
				if (newQueryString == "") {
					newQueryString = "?";
				} else {
					newQueryString += "&";
				}
				newQueryString += parameterParts[0] + "=" + parameterParts[1];
			}
		};
	}
	if (parameterValue !== null) {
		if (newQueryString == "") {
			newQueryString = "?";
		} else {
			newQueryString += "&";
		}
		newQueryString += parameterName + "=" + parameterValue;
	}
	return urlParts[0] + newQueryString;
};

var comptime = function(beginTime, endTime){
	var beginTimes=beginTime.substring(0,10).split('-');  
	var endTimes=endTime.substring(0,10).split('-');  
	beginTime=beginTimes[1]+'-'+beginTimes[2]+'-'+beginTimes[0]+' '+beginTime.substring(10,19);  
	endTime=endTimes[1]+'-'+endTimes[2]+'-'+endTimes[0]+' '+endTime.substring(10,19);
	var a =(timestamp(endTime)-timestamp(beginTime))/3600/1000;
	if(a<0){
		return -1;
	}else if (a>0){  
		return 1;
	}else if (a==0){  
		return 0;
	}else{  
		return -2  
	}  
};

var getRandomArbitrary = function(min, max) {
	return parseInt(Math.random()*(max - min)+min);
};

function modify() {
	if ($('.quantity-wrapper').hasClass('disable')) {
		$("#number").val(1);
		$('.quantity-increase, .quantity-decrease').addClass('no');
		return;
	}
	var a = parseInt($("#number").val()), c = parseInt($(".kc label").html());
	if ("" == $("#number").val()) {
		$("#number").val(1);
		$('.quantity-increase').removeClass('no');
		$('.quantity-decrease').addClass('no');
		return;
	}
	if (!isNaN(a)) {
		if (a == 1 && a == c) {
			$("#number").val(1);
			$('.quantity-increase, .quantity-decrease').addClass('no');
			return;
		}
		if (a > 1 && a == c) {
			$("#number").val(a);
			$('.quantity-increase').addClass('no');
			$('.quantity-decrease').removeClass('no');
			return;
		}
		if (1 > a || a > c) {
			$("#number").val(1);
			$('.quantity-increase').removeClass('no');
			$('.quantity-decrease').addClass('no');
			return;
		} else {
			$("#number").val(a);
			$('.quantity-increase, .quantity-decrease').removeClass('no');
			return;
		}
	} else {
		$("#number").val(1);
		$('.quantity-increase').removeClass('no');
		$('.quantity-decrease').addClass('no');
	}
}

$.fn.countDown = function(options) {
	var defaultVal = {
		// 存放结束时间
		eAttr : 'etime',
		sAttr : 'stime', // 存放开始时间
		wTime : 100, // 以100毫秒为单位进行演算
		etpl : '%H%:%M%:%S%.%ms%', // 还有...结束
		stpl : '%H%:%M%:%S%.%ms%', // 还有...开始
		sdtpl : '已开始',
		otpl : '活动已结束', // 过期显示的文本模版
		stCallback: null,
		sdCallback: null,
		otCallback: null
	};
	var dateNum = function(num) {
		return num < 10 ? '0' + num : num;
	};
	var subNum = function(num){
		numF = num.toString().substring(0,1);
		numS = num.toString().substring(1,num.length);
		return num = numF + "" + numS;
	};
	var s = $.extend(defaultVal, options);
	var vthis = $(this);
	var num = 60;
	var runTime = function() {
		var nowTime = new Date().getTime();
		vthis.each(function() {
			var nthis = $(this);
			var sorgT = parseInt(nthis.attr(s.sAttr));
			var eorgT = parseInt(nthis.attr(s.eAttr));
			var sT = isNaN(sorgT) ? 0 : sorgT - nowTime;
			var eT = isNaN(eorgT) ? 0 : eorgT - nowTime;
			var showTime = function(rT, showTpl) {
				 var ss_ = Math.round(rT / s.wTime);
				ss_ = subNum(dateNum(Math.floor(ss_ *s.wTime/1000)));
				var s_ = Math.round((rT % 60000) / s.wTime);
				s_ = subNum(dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59)));
				var m_ = subNum(dateNum(Math.floor((rT % 3600000) / 60000)));
				var h_ = subNum(dateNum(Math.floor((rT % 86400000) / 3600000)));
				var d_ = subNum(dateNum(Math.floor(rT / 86400000)));
				nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_).replace(/%SS%/, ss_));
			};
			if (sT > 0) {
				showTime(sT, s.stpl);
				s.stCallback && s.stCallback();
			} else if (eT > 0) {
				showTime(eT, s.etpl);
				s.sdCallback && s.sdCallback();
			} else {
				nthis.html(s.otpl);
				s.otCallback && s.otCallback();
			}

		});
	};

	setInterval(function() {
		runTime();
	}, s.wTime);
};
$.fn.marqueen = function(options){
		$.fn.marqueen.defalut = {
			mode: "top",
			speed: 50,
			container: ".marqueen ul",
			row: 1,
			defaultIndex: 0,
			fixWidth: 0
		};
		return this.each(function(){
			var opts = $.extend({}, $.fn.marqueen.defalut, options);
			var index = opts.defaultIndex;
			var oldIndex = index;
			var fixWidth = opts.fixWidth;
			var container = $(opts.container, $(this));
			var containerSize = container.children().size();
			var slideH = 0;
			var slideW = 0;
			var selfW = 0;
			var selfH = 0;
			var flag = null;

			if(containerSize < opts.row) return;
			container.children().each(function(){
				if($(this).width() > selfW){
					selfW = $(this).width();
					slideW = $(this).width() + fixWidth;
				}
				if($(this).height() > selfH){
					selfH = $(this).height();
					slideH = $(this).height();
				}
			});
			switch(opts.mode){
				case "left":
					container.children().clone().appendTo(container).clone().prependTo(container); 
					container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;"></div>').css( { "width":containerSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-containerSize*slideW}).children().css({"float":"left","text-center":"center"});
					break;
				case "top":
					container.children().clone().appendTo(container).clone().prependTo(container); 
					container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;height:'+opts.row*slideH+'px"></div>').css( { "height":containerSize*slideH*3,"position":"relative","padding":"0","margin":"0","top":-containerSize*slideH}).children().css({"width":"100%","margin":"0","height":selfH});
					break;
			}
			var doPlay = function(){
				switch(opts.mode){
					case "left":
					case "top":
						if (index >= 2){
							index = 1;
						} else if(index < 0){
							index = 0;
						}
						break;
				}
				switch (opts.mode){
					case "left":
						var tempLeft = container.css("left").replace("px",""); 
						if(index == 0){
							container.animate({"left":++tempLeft},0,function(){
								if(container.css("left").replace("px","") >= 0){
									for(var i=0; i<containerSize; i++){
										container.children().last().prependTo(container);
									};
									container.css("left", -containerSize*slideW);
								}
							});
						} else {
							container.animate({"left":--tempLeft},0,function(){
								if(container.css("left").replace("px","") <= -containerSize*slideW*1.755){
									for(var i=0; i<containerSize; i++){
										container.children().first().appendTo(container);
									};
									container.css("left", -containerSize*slideW);}
							});
						}
						break;
					case "top":
						var tempTop = container.css("top").replace("px",""); 
						if(index == 0){
							container.animate({"top":++tempTop},0,function(){
								if(container.css("top").replace("px","") >= 0){
									for(var i=0; i<containerSize; i++){
										container.children().last().prependTo(container);
									};
									container.css("top",-containerSize*slideH);
								}
							});
						} else {
							container.animate({"top":--tempTop},0,function(){
								if(container.css("top").replace("px","") <= -containerSize*slideH*2){
									for(var i=0; i<containerSize; i++){
										container.children().first().appendTo(container);
									};
									container.css("top",-containerSize*slideH);
								}
							});
						}
						break;
					}
					oldIndex=index;
			};
	
			doPlay();
			index++;
			flag = setInterval(doPlay, opts.speed);
		});
	}
$.fn.progress = function(options) {
	var defaultVal = { 
		eAttr : 'data-etime',
		sAttr : 'data-stime',
		stpl : '%H%:%M%:%S%',
		wTime : 500,
		cTime : new Date().getTime(),
		callback: null
	};
	var s = $.extend(defaultVal, options);
	window.progressTimeInterval = 0;
	var vthis = $(this);
	var width = $(window).width();
	var runTime = function() {
		s.cTime += s.wTime;
		vthis.each(function() {
			var nthis = $(this);
			var sorgT = parseInt(nthis.attr(s.sAttr));
			var eorgT = parseInt(nthis.attr(s.eAttr));
			var porgT = parseInt(nthis.attr(s.pAttr));
			var sT = isNaN(sorgT) ? 0 : sorgT - s.cTime;
			var eT = isNaN(eorgT) ? 0 : eorgT - s.cTime;
			var showTime = function(rT, showTpl) {
				var s_ = Math.round((rT % 60000) / s.wTime);
				s_ = dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59));
				var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
				var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
				var d_ = dateNum(Math.floor(rT / 86400000));
				nthis.attr('data-timestr', showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
			};
			
			var state = 0;
			if (sT > 0) {// 即将开始
				state = 1;
				showTime(sT, s.stpl);
			} else if (eT > 0) {//正在进行
				state = 2;
			} else {// 比赛结束
				state = 3;
			}
			s.callback && s.callback(state);
		});
	};
	runTime();
	window.progressTimeInterval = setInterval(function() {
		runTime();
	}, s.wTime);
};

var replaceParamVal = function(href,paramName,replaceWith) {
	var re=eval('/('+ paramName+'=)([^&]*)/gi');
	var nUrl = href.replace(re,paramName+'='+replaceWith);
	return nUrl;
};

var delQueStr = function(url, ref) {
	var str = "";
	if (url.indexOf('?') != -1)
		str = url.substr(url.indexOf('?') + 1);
	else
		return url;
	var arr = "";
	var returnurl = "";
	var setparam = "";
	if (str.indexOf('&') != -1) {
		arr = str.split('&');
		for (i in arr) {
			if (arr[i].split('=')[0] != ref) {
				returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
			}
		}
		return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
	}
	else {
		arr = str.split('=');
		if (arr[0] == ref)
			return url.substr(0, url.indexOf('?'));
		else
			return url;
	}
};

var add_yao_prefix = function(url) {
	return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
};

var is_android = function() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("android") > -1;
};

var getUrl = function(openid) {
	var href = window.location.href;
	href = add_param(share_url.replace(/[^\/]*\.html/i, 'index.html'), 'resopenid', hex_md5(openid), true);
	href = add_param(href, 'from', 'share', true);
	href = delQueStr(href, "openid");
	href = delQueStr(href, "matk");
	href = delQueStr(href, "markJump");
	href = delQueStr(href, "headimgurl");
	href = delQueStr(href, "nickname");
	href = delQueStr(href, "cardPU");
	href = delQueStr(href, "cardRU");
	href = delQueStr(href, "userName");
	href = delQueStr(href, "duiback");
	href = delQueStr(href, "payback");
	href = delQueStr(href, "exchange");
	href = delQueStr(href, "swiperJump");
	return add_yao_prefix(href);
};

var imgReady = (function () {
	var list = [], intervalId = null,

	// 用来执行队列
	tick = function () {
		var i = 0;
		for (; i < list.length; i++) {
			list[i].end ? list.splice(i--, 1) : list[i]();
		}
		;
		!list.length && stop();
	},

	// 停止所有定时器队列
	stop = function () {
		clearInterval(intervalId);
		intervalId = null;
	};

	return function (url, ready, load, error) {
		var onready, width, height, newWidth, newHeight,
			img = new Image();

		img.src = url;

		// 如果图片被缓存，则直接返回缓存数据
		if (img.complete) {
			ready.call(img);
			load && load.call(img);
			return;
		}
		;

		width = img.width;
		height = img.height;

		// 加载错误后的事件
		img.onerror = function () {
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		};

		// 图片尺寸就绪
		onready = function () {
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||
			// 如果图片已经在其他地方加载可使用面积检测
				newWidth * newHeight > 1024
				) {
				ready.call(img);
				onready.end = true;
			}
			;
		};
		onready();

		// 完全加载完毕的事件
		img.onload = function () {
			// onload在定时器时间差范围内可能比onready快
			// 这里进行检查并保证onready优先执行
			!onready.end && onready();

			load && load.call(img);

			// IE gif动画会循环执行onload，置空onload即可
			img = img.onload = img.onerror = null;
		};

		// 加入队列中定期执行
		if (!onready.end) {
			list.push(onready);
			// 无论何时只允许出现一个定时器，减少浏览器性能损耗
			if (intervalId === null) intervalId = setInterval(tick, 40);
		};
	};
})();

var getShareUrl = function(openid) {
	var href = window.location.href;
	href = add_param(share_url.replace(/[^\/]*\.html/i, sharePage), 'resopenid', hex_md5(openid), true);
	href = add_param(href, 'from', 'share', true);
	href = delQueStr(href, "openid");
	href = delQueStr(href, "matk");
	href = delQueStr(href, "markJump");
	href = delQueStr(href, "headimgurl");
	href = delQueStr(href, "nickname");
	href = delQueStr(href, "duiback");
	href = delQueStr(href, "payback");
	href = delQueStr(href, "exchange");
	href = delQueStr(href, "swiperJump");

	href = add_param(href, 'cardPU', H.card.cardPU, true);
	href = add_param(href, 'cardRU', H.card.cardRU, true);
	href = add_param(href, 'userName', nickname, true);

	return add_yao_prefix(href);
};

$(function() {
	$('html').css('font-size', $(window).width() / 320 * 16);
	// document.querySelector('html').style.fontSize = `${document.body.clientWidth / 320 * 16}px`
	var $copyright = $('.copyright'), cbUrl = window.location.href;
	if($copyright) $copyright.html(copyright);
	if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
		$('#div_subscribe_area').css('height', '0');
		$('body').removeClass('subscribe');
	} else {
		$('#div_subscribe_area').css('height', '50px');
		$('body').addClass('subscribe');
	}
	$("script").each(function(i, item) {
		var scr = $(this).attr("src");
		$(this).attr("src", scr + "?v=" + version);
	});
	
	// 从data_collect.js里转移过来的
	
	$('body').delegate("*[data-collect='true']", "click", function(e) {
		e.preventDefault();

		if ($(this).attr('data-stoppropagation') == 'true') {
			e.stopPropagation();
		}
		recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
		var href = $(this).attr('href'); 
		if (href && href !== '#') {
			setTimeout(function() {
				window.location.href = href;
			}, 10);
		}
	});
});

var provinces = [
	{ text: '北京', value: '北京' },
	{ text: '上海', value: '上海' },
	{ text: '天津', value: '天津' },
	{ text: '重庆', value: '重庆' },
	{ text: '河北', value: '河北' },
	{ text: '山西', value: '山西' },
	{ text: '内蒙古', value: '内蒙古' },
	{ text: '辽宁', value: '辽宁' },
	{ text: '吉林', value: '吉林' },
	{ text: '黑龙江', value: '黑龙江' },
	{ text: '江苏', value: '江苏' },
	{ text: '浙江', value: '浙江' },
	{ text: '安徽', value: '安徽' },
	{ text: '福建', value: '福建' },
	{ text: '江西', value: '江西' },
	{ text: '山东', value: '山东' },
	{ text: '河南', value: '河南' },
	{ text: '湖北', value: '湖北' },
	{ text: '湖南', value: '湖南' },
	{ text: '广东', value: '广东' },
	{ text: '广西', value: '广西' },
	{ text: '海南', value: '海南' },
	{ text: '四川', value: '四川' },
	{ text: '贵州', value: '贵州' },
	{ text: '云南', value: '云南' },
	{ text: '西藏', value: '西藏' },
	{ text: '陕西', value: '陕西' },
	{ text: '甘肃', value: '甘肃' },
	{ text: '宁夏', value: '宁夏' },
	{ text: '青海', value: '青海' },
	{ text: '新疆', value: '新疆' }
];

var citys = {
	'北京': [
		{ text: '东城', value: '东城' },
		{ text: '西城', value: '西城' },
		{ text: '崇文', value: '崇文' },
		{ text: '宣武', value: '宣武' },
		{ text: '朝阳', value: '朝阳' },
		{ text: '丰台', value: '丰台' },
		{ text: '石景山', value: '石景山' },
		{ text: '海淀', value: '海淀' },
		{ text: '门头沟', value: '门头沟' },
		{ text: '房山', value: '房山' },
		{ text: '通州', value: '通州' },
		{ text: '顺义', value: '顺义' },
		{ text: '昌平', value: '昌平' },
		{ text: '大兴', value: '大兴' },
		{ text: '平谷', value: '平谷' },
		{ text: '怀柔', value: '怀柔' },
		{ text: '密云', value: '密云' },
		{ text: '延庆', value: '延庆' }
	],
	'上海': [
		{ text: '黄浦', value: '黄浦' },
		{ text: '卢湾', value: '卢湾' },
		{ text: '徐汇', value: '徐汇' },
		{ text: '长宁', value: '长宁' },
		{ text: '静安', value: '静安' },
		{ text: '普陀', value: '普陀' },
		{ text: '闸北', value: '闸北' },
		{ text: '虹口', value: '虹口' },
		{ text: '杨浦', value: '杨浦' },
		{ text: '闵行', value: '闵行' },
		{ text: '宝山', value: '宝山' },
		{ text: '嘉定', value: '嘉定' },
		{ text: '浦东', value: '浦东' },
		{ text: '金山', value: '金山' },
		{ text: '松江', value: '松江' },
		{ text: '青浦', value: '青浦' },
		{ text: '南汇', value: '南汇' },
		{ text: '奉贤', value: '奉贤' },
		{ text: '崇明', value: '崇明' }
	],
	'天津': [
		{ text: '和平', value: '和平' },
		{ text: '东丽', value: '东丽' },
		{ text: '河东', value: '河东' },
		{ text: '西青', value: '西青' },
		{ text: '河西', value: '河西' },
		{ text: '津南', value: '津南' },
		{ text: '南开', value: '南开' },
		{ text: '北辰', value: '北辰' },
		{ text: '河北', value: '河北' },
		{ text: '武清', value: '武清' },
		{ text: '红挢', value: '红挢' },
		{ text: '塘沽', value: '塘沽' },
		{ text: '汉沽', value: '汉沽' },
		{ text: '大港', value: '大港' },
		{ text: '宁河', value: '宁河' },
		{ text: '静海', value: '静海' },
		{ text: '宝坻', value: '宝坻' },
		{ text: '蓟县', value: '蓟县' }
	],
	'重庆': [
		{ text: '万州', value: '万州' },
		{ text: '涪陵', value: '涪陵' },
		{ text: '渝中', value: '渝中' },
		{ text: '大渡口', value: '大渡口' },
		{ text: '江北', value: '江北' },
		{ text: '沙坪坝', value: '沙坪坝' },
		{ text: '九龙坡', value: '九龙坡' },
		{ text: '南岸', value: '南岸' },
		{ text: '北碚', value: '北碚' },
		{ text: '万盛', value: '万盛' },
		{ text: '双挢', value: '双挢' },
		{ text: '渝北', value: '渝北' },
		{ text: '巴南', value: '巴南' },
		{ text: '黔江', value: '黔江' },
		{ text: '长寿', value: '长寿' },
		{ text: '綦江', value: '綦江' },
		{ text: '潼南', value: '潼南' },
		{ text: '铜梁', value: '铜梁' },
		{ text: '大足', value: '大足' },
		{ text: '荣昌', value: '荣昌' },
		{ text: '壁山', value: '壁山' },
		{ text: '梁平', value: '梁平' },
		{ text: '城口', value: '城口' },
		{ text: '丰都', value: '丰都' },
		{ text: '垫江', value: '垫江' },
		{ text: '武隆', value: '武隆' },
		{ text: '忠县', value: '忠县' },
		{ text: '开县', value: '开县' },
		{ text: '云阳', value: '云阳' },
		{ text: '奉节', value: '奉节' },
		{ text: '巫山', value: '巫山' },
		{ text: '巫溪', value: '巫溪' },
		{ text: '石柱', value: '石柱' },
		{ text: '秀山', value: '秀山' },
		{ text: '酉阳', value: '酉阳' },
		{ text: '彭水', value: '彭水' },
		{ text: '江津', value: '江津' },
		{ text: '合川', value: '合川' },
		{ text: '永川', value: '永川' },
		{ text: '南川', value: '南川' }
	],
	'河北': [
		{ text: '石家庄', value: '石家庄' },
		{ text: '邯郸', value: '邯郸' },
		{ text: '邢台', value: '邢台' },
		{ text: '保定', value: '保定' },
		{ text: '张家口', value: '张家口' },
		{ text: '承德', value: '承德' },
		{ text: '廊坊', value: '廊坊' },
		{ text: '唐山', value: '唐山' },
		{ text: '秦皇岛', value: '秦皇岛' },
		{ text: '沧州', value: '沧州' },
		{ text: '衡水', value: '衡水' }
	],
	'山西': [
		{ text: '太原', value: '太原' },
		{ text: '大同', value: '大同' },
		{ text: '阳泉', value: '阳泉' },
		{ text: '长治', value: '长治' },
		{ text: '晋城', value: '晋城' },
		{ text: '朔州', value: '朔州' },
		{ text: '吕梁', value: '吕梁' },
		{ text: '忻州', value: '忻州' },
		{ text: '晋中', value: '晋中' },
		{ text: '临汾', value: '临汾' },
		{ text: '运城', value: '运城' }
	],
	'内蒙古': [{ text: '呼和浩特', value: '呼和浩特' },
		{ text: '包头', value: '包头' },
		{ text: '乌海', value: '乌海' },
		{ text: '赤峰', value: '赤峰' },
		{ text: '呼伦贝尔盟', value: '呼伦贝尔盟' },
		{ text: '阿拉善盟', value: '阿拉善盟' },
		{ text: '哲里木盟', value: '哲里木盟' },
		{ text: '兴安盟', value: '兴安盟' },
		{ text: '乌兰察布盟', value: '乌兰察布盟' },
		{ text: '锡林郭勒盟', value: '锡林郭勒盟' },
		{ text: '巴彦淖尔盟', value: '巴彦淖尔盟' },
		{ text: '伊克昭盟', value: '伊克昭盟' }
	],
	'辽宁': [
		{ text: '沈阳', value: '沈阳' },
		{ text: '大连', value: '大连' },
		{ text: '鞍山', value: '鞍山' },
		{ text: '抚顺', value: '抚顺' },
		{ text: '本溪', value: '本溪' },
		{ text: '丹东', value: '丹东' },
		{ text: '锦州', value: '锦州' },
		{ text: '营口', value: '营口' },
		{ text: '阜新', value: '阜新' },
		{ text: '辽阳', value: '辽阳' },
		{ text: '盘锦', value: '盘锦' },
		{ text: '铁岭', value: '铁岭' },
		{ text: '朝阳', value: '朝阳' },
		{ text: '葫芦岛', value: '葫芦岛' }
	],
	'吉林': [
		{ text: '长春', value: '长春' },
		{ text: '吉林', value: '吉林' },
		{ text: '四平', value: '四平' },
		{ text: '辽源', value: '辽源' },
		{ text: '通化', value: '通化' },
		{ text: '白山', value: '白山' },
		{ text: '松原', value: '松原' },
		{ text: '白城', value: '白城' },
		{ text: '延边', value: '延边' }
	],
	'黑龙江': [{ text: '哈尔滨', value: '哈尔滨' },
		{ text: '齐齐哈尔', value: '齐齐哈尔' },
		{ text: '牡丹江', value: '牡丹江' },
		{ text: '佳木斯', value: '佳木斯' },
		{ text: '大庆', value: '大庆' },
		{ text: '绥化', value: '绥化' },
		{ text: '鹤岗', value: '鹤岗' },
		{ text: '鸡西', value: '鸡西' },
		{ text: '黑河', value: '黑河' },
		{ text: '双鸭山', value: '双鸭山' },
		{ text: '伊春', value: '伊春' },
		{ text: '七台河', value: '七台河' },
		{ text: '大兴安岭', value: '大兴安岭' }
	],
	'江苏': [
		{ text: '南京', value: '南京' },
		{ text: '镇江', value: '镇江' },
		{ text: '苏州', value: '苏州' },
		{ text: '南通', value: '南通' },
		{ text: '扬州', value: '扬州' },
		{ text: '盐城', value: '盐城' },
		{ text: '徐州', value: '徐州' },
		{ text: '连云港', value: '连云港' },
		{ text: '常州', value: '常州' },
		{ text: '无锡', value: '无锡' },
		{ text: '宿迁', value: '宿迁' },
		{ text: '泰州', value: '泰州' },
		{ text: '淮安', value: '淮安' }
	],
	'浙江': [
		{ text: '杭州', value: '杭州' },
		{ text: '宁波', value: '宁波' },
		{ text: '温州', value: '温州' },
		{ text: '嘉兴', value: '嘉兴' },
		{ text: '湖州', value: '湖州' },
		{ text: '绍兴', value: '绍兴' },
		{ text: '金华', value: '金华' },
		{ text: '衢州', value: '衢州' },
		{ text: '舟山', value: '舟山' },
		{ text: '台州', value: '台州' },
		{ text: '丽水', value: '丽水' }
	],
	'安徽': [
		{ text: '合肥', value: '合肥' },
		{ text: '芜湖', value: '芜湖' },
		{ text: '蚌埠', value: '蚌埠' },
		{ text: '马鞍山', value: '马鞍山' },
		{ text: '淮北', value: '淮北' },
		{ text: '铜陵', value: '铜陵' },
		{ text: '安庆', value: '安庆' },
		{ text: '黄山', value: '黄山' },
		{ text: '滁州', value: '滁州' },
		{ text: '宿州', value: '宿州' },
		{ text: '池州', value: '池州' },
		{ text: '淮南', value: '淮南' },
		{ text: '巢湖', value: '巢湖' },
		{ text: '阜阳', value: '阜阳' },
		{ text: '六安', value: '六安' },
		{ text: '宣城', value: '宣城' },
		{ text: '亳州', value: '亳州' }
	],
	'福建': [
		{ text: '福州', value: '福州' },
		{ text: '厦门', value: '厦门' },
		{ text: '莆田', value: '莆田' },
		{ text: '三明', value: '三明' },
		{ text: '泉州', value: '泉州' },
		{ text: '漳州', value: '漳州' },
		{ text: '南平', value: '南平' },
		{ text: '龙岩', value: '龙岩' },
		{ text: '宁德', value: '宁德' }
	],
	'江西': [
		{ text: '南昌市', value: '南昌市' },
		{ text: '景德镇', value: '景德镇' },
		{ text: '九江', value: '九江' },
		{ text: '鹰潭', value: '鹰潭' },
		{ text: '萍乡', value: '萍乡' },
		{ text: '新馀', value: '新馀' },
		{ text: '赣州', value: '赣州' },
		{ text: '吉安', value: '吉安' },
		{ text: '宜春', value: '宜春' },
		{ text: '抚州', value: '抚州' },
		{ text: '上饶', value: '上饶' }
	],
	'山东': [
		{ text: '济南', value: '济南' },
		{ text: '青岛', value: '青岛' },
		{ text: '淄博', value: '淄博' },
		{ text: '枣庄', value: '枣庄' },
		{ text: '东营', value: '东营' },
		{ text: '烟台', value: '烟台' },
		{ text: '潍坊', value: '潍坊' },
		{ text: '济宁', value: '济宁' },
		{ text: '泰安', value: '泰安' },
		{ text: '威海', value: '威海' },
		{ text: '日照', value: '日照' },
		{ text: '莱芜', value: '莱芜' },
		{ text: '临沂', value: '临沂' },
		{ text: '德州', value: '德州' },
		{ text: '聊城', value: '聊城' },
		{ text: '滨州', value: '滨州' },
		{ text: '菏泽', value: '菏泽' }
	],
	'河南': [
		{ text: '郑州', value: '郑州' },
		{ text: '开封', value: '开封' },
		{ text: '洛阳', value: '洛阳' },
		{ text: '平顶山', value: '平顶山' },
		{ text: '安阳', value: '安阳' },
		{ text: '鹤壁', value: '鹤壁' },
		{ text: '新乡', value: '新乡' },
		{ text: '焦作', value: '焦作' },
		{ text: '濮阳', value: '濮阳' },
		{ text: '许昌', value: '许昌' },
		{ text: '漯河', value: '漯河' },
		{ text: '三门峡', value: '三门峡' },
		{ text: '南阳', value: '南阳' },
		{ text: '商丘', value: '商丘' },
		{ text: '信阳', value: '信阳' },
		{ text: '周口', value: '周口' },
		{ text: '驻马店', value: '驻马店' },
		{ text: '济源', value: '济源' }
	],
	'湖北': [
		{ text: '武汉', value: '武汉' },
		{ text: '宜昌', value: '宜昌' },
		{ text: '荆州', value: '荆州' },
		{ text: '襄樊', value: '襄樊' },
		{ text: '黄石', value: '黄石' },
		{ text: '荆门', value: '荆门' },
		{ text: '黄冈', value: '黄冈' },
		{ text: '十堰', value: '十堰' },
		{ text: '恩施', value: '恩施' },
		{ text: '潜江', value: '潜江' },
		{ text: '天门', value: '天门' },
		{ text: '仙桃', value: '仙桃' },
		{ text: '随州', value: '随州' },
		{ text: '咸宁', value: '咸宁' },
		{ text: '孝感', value: '孝感' },
		{ text: '鄂州', value: '鄂州' }
	],
	'湖南': [
		{ text: '长沙', value: '长沙' },
		{ text: '常德', value: '常德' },
		{ text: '株洲', value: '株洲' },
		{ text: '湘潭', value: '湘潭' },
		{ text: '衡阳', value: '衡阳' },
		{ text: '岳阳', value: '岳阳' },
		{ text: '邵阳', value: '邵阳' },
		{ text: '益阳', value: '益阳' },
		{ text: '娄底', value: '娄底' },
		{ text: '怀化', value: '怀化' },
		{ text: '郴州', value: '郴州' },
		{ text: '永州', value: '永州' },
		{ text: '湘西', value: '湘西' },
		{ text: '张家界', value: '张家界' }
	],
	'广东': [
		{ text: '广州', value: '广州' },
		{ text: '深圳', value: '深圳' },
		{ text: '珠海', value: '珠海' },
		{ text: '汕头', value: '汕头' },
		{ text: '东莞', value: '东莞' },
		{ text: '中山', value: '中山' },
		{ text: '佛山', value: '佛山' },
		{ text: '韶关', value: '韶关' },
		{ text: '江门', value: '江门' },
		{ text: '湛江', value: '湛江' },
		{ text: '茂名', value: '茂名' },
		{ text: '肇庆', value: '肇庆' },
		{ text: '惠州', value: '惠州' },
		{ text: '梅州', value: '梅州' },
		{ text: '汕尾', value: '汕尾' },
		{ text: '河源', value: '河源' },
		{ text: '阳江', value: '阳江' },
		{ text: '清远', value: '清远' },
		{ text: '潮州', value: '潮州' },
		{ text: '揭阳', value: '揭阳' },
		{ text: '云浮', value: '云浮' }
	],
	'广西': [
		{ text: '南宁', value: '南宁' },
		{ text: '柳州', value: '柳州' },
		{ text: '桂林', value: '桂林' },
		{ text: '梧州', value: '梧州' },
		{ text: '北海', value: '北海' },
		{ text: '防城港', value: '防城港' },
		{ text: '钦州', value: '钦州' },
		{ text: '贵港', value: '贵港' },
		{ text: '玉林', value: '玉林' },
		{ text: '南宁地区', value: '南宁地区' },
		{ text: '柳州地区', value: '柳州地区' },
		{ text: '贺州', value: '贺州' },
		{ text: '百色', value: '百色' },
		{ text: '河池', value: '河池' }
	],
	'海南': [
		{ text: '海口', value: '海口' },
		{ text: '三亚', value: '三亚' }
	],
	'四川': [
		{ text: '成都', value: '成都' },
		{ text: '绵阳', value: '绵阳' },
		{ text: '德阳', value: '德阳' },
		{ text: '自贡', value: '自贡' },
		{ text: '攀枝花', value: '攀枝花' },
		{ text: '广元', value: '广元' },
		{ text: '内江', value: '内江' },
		{ text: '乐山', value: '乐山' },
		{ text: '南充', value: '南充' },
		{ text: '宜宾', value: '宜宾' },
		{ text: '广安', value: '广安' },
		{ text: '达川', value: '达川' },
		{ text: '雅安', value: '雅安' },
		{ text: '眉山', value: '眉山' },
		{ text: '甘孜', value: '甘孜' },
		{ text: '凉山', value: '凉山' },
		{ text: '泸州', value: '泸州' }
	],
	'贵州': [
		{ text: '贵阳', value: '贵阳' },
		{ text: '六盘水', value: '六盘水' },
		{ text: '遵义', value: '遵义' },
		{ text: '安顺', value: '安顺' },
		{ text: '铜仁', value: '铜仁' },
		{ text: '黔西南', value: '黔西南' },
		{ text: '毕节', value: '毕节' },
		{ text: '黔东南', value: '黔东南' },
		{ text: '黔南', value: '黔南' }
	],
	'云南': [
		{ text: '昆明', value: '昆明' },
		{ text: '大理', value: '大理' },
		{ text: '曲靖', value: '曲靖' },
		{ text: '玉溪', value: '玉溪' },
		{ text: '昭通', value: '昭通' },
		{ text: '楚雄', value: '楚雄' },
		{ text: '红河', value: '红河' },
		{ text: '文山', value: '文山' },
		{ text: '思茅', value: '思茅' },
		{ text: '西双版纳', value: '西双版纳' },
		{ text: '保山', value: '保山' },
		{ text: '德宏', value: '德宏' },
		{ text: '丽江', value: '丽江' },
		{ text: '怒江', value: '怒江' },
		{ text: '迪庆', value: '迪庆' },
		{ text: '临沧', value: '临沧' }
	],
	'西藏': [
		{ text: '拉萨', value: '拉萨' },
		{ text: '日喀则', value: '日喀则' },
		{ text: '山南', value: '山南' },
		{ text: '林芝', value: '林芝' },
		{ text: '昌都', value: '昌都' },
		{ text: '阿里', value: '阿里' },
		{ text: '那曲', value: '那曲' }
	],
	'陕西': [
		{ text: '西安', value: '西安' },
		{ text: '宝鸡', value: '宝鸡' },
		{ text: '咸阳', value: '咸阳' },
		{ text: '铜川', value: '铜川' },
		{ text: '渭南', value: '渭南' },
		{ text: '延安', value: '延安' },
		{ text: '榆林', value: '榆林' },
		{ text: '汉中', value: '汉中' },
		{ text: '安康', value: '安康' },
		{ text: '商洛', value: '商洛' }
	],
	'甘肃': [
		{ text: '兰州', value: '兰州' },
		{ text: '嘉峪关', value: '嘉峪关' },
		{ text: '金昌', value: '金昌' },
		{ text: '白银', value: '白银' },
		{ text: '天水', value: '天水' },
		{ text: '酒泉', value: '酒泉' },
		{ text: '张掖', value: '张掖' },
		{ text: '武威', value: '武威' },
		{ text: '定西', value: '定西' },
		{ text: '陇南', value: '陇南' },
		{ text: '平凉', value: '平凉' },
		{ text: '庆阳', value: '庆阳' },
		{ text: '临夏', value: '临夏' },
		{ text: '甘南', value: '甘南' }
	],
	'宁夏': [
		{ text: '银川', value: '银川' },
		{ text: '石嘴山', value: '石嘴山' },
		{ text: '吴忠', value: '吴忠' },
		{ text: '固原', value: '固原' }
	],
	'青海': [
		{ text: '西宁', value: '西宁' },
		{ text: '海东', value: '海东' },
		{ text: '海南', value: '海南' },
		{ text: '海北', value: '海北' },
		{ text: '黄南', value: '黄南' },
		{ text: '玉树', value: '玉树' },
		{ text: '果洛', value: '果洛' },
		{ text: '海西', value: '海西' }
	],
	'新疆': [
		{ text: '乌鲁木齐', value: '乌鲁木齐' },
		{ text: '石河子', value: '石河子' },
		{ text: '克拉玛依', value: '克拉玛依' },
		{ text: '伊犁', value: '伊犁' },
		{ text: '巴音郭勒', value: '巴音郭勒' },
		{ text: '昌吉', value: '昌吉' },
		{ text: '克孜勒苏柯尔克孜', value: '克孜勒苏柯尔克孜' },
		{ text: '博尔塔拉', value: '博尔塔拉' },
		{ text: '吐鲁番', value: '吐鲁番' },
		{ text: '哈密', value: '哈密' },
		{ text: '喀什', value: '喀什' },
		{ text: '和田', value: '和田' },
		{ text: '阿克苏', value: '阿克苏' }
	],
};