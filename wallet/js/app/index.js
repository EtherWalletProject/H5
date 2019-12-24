(function($) {
	H.index = {
		init: function() {
			var aa = 'name=zs&key=' + md5Key;
			console.log(aa)
			console.log('md5:' + hex_md5(aa))
		}
	};

	W.commonApiPromotionHandler = function(data) {

	};
})(Zepto);

$(function() {
	H.index.init();
});

var BASE_URL = 'http://121.199.68.72/h5web/';
var GET_CODE = BASE_URL + 'h5/sendCode'; //发送手机验证码接口
var GET_LOGIN = BASE_URL + 'h5/login'; //发送手机验证码接口
var GET_SUGAR_INFO = BASE_URL + 'h5/getSugarInfo'; //获取糖包信息接口
var GET_SUGAR_DRAW = BASE_URL + 'h5/drawSugar'; //领糖包信息接口
var GET_SUGAR_RECORD = BASE_URL + 'h5/drawSugarRecord'; //糖包领取记录
var GET_MYSUGAR_RECORD = BASE_URL + 'h5/myDrawSugarRecord'; //获取自己是否糖包信息接口

function showToast(msg, duration) {
	duration = isNaN(duration) ? 3000 : duration;
	var m = document.createElement('div');
	m.innerHTML = msg;
	m.style.cssText =
		"width:60%; min-width:180px; background:#000; opacity:0.6; height:auto;min-height: 30px; color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:60%; left:20%; z-index:999999;";
	document.body.appendChild(m);
	setTimeout(function() {
		var d = 0.5;
		m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
		m.style.opacity = '0';
		setTimeout(function() {
			document.body.removeChild(m)
		}, d * 1000);
	}, duration);
}

function post(url, obj, callBack) {
	$.ajax({
		type: 'post',
		url: url,
		data: obj,
		contentType: "application/json",
		dataType: "json",
		success: function(data) {
			console.log(data);
			if (url == GET_SUGAR_DRAW) callBack(data);
			else if (data.code == 0) callBack(data.data);
			else showToast(data.msg, 1000);
		},
		error: function(error) {
			showToast(error, 1000);
		}
	})
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

var currency;
var number;

//var sugarId = getQueryVariable("id");
var sugarId = "15768307226811";

$(function() {
	sugarId = getQueryVariable("id");
	var obj = "{'sugarId':'" + sugarId + "','sign':'" + hex_md5('sugarId=' + sugarId + '&key=' + md5Key) + "'}"
	post(GET_SUGAR_INFO, obj, function(json) {
		$('.sugar-text').html(json.title);
		currency = json.currency;
		number = json.number;
	});

	$('#sugar-bag').click(function() {
		var value = window.sessionStorage.getItem("wallet_uid");
		if (value) {
			openSugar(value);
		} else {
			document.getElementById("dia").showModal();
		}
	});

	$('#dialog-getCode').click(function() {
		var phone = $('#dialog-phone').val();
		if (!phone) {
			showToast("手机号不能为空", 1000);
			return;
		}
		if (isSend) return;
		time($('#dialog-getCode'));
		var obj = "{'phone':'" + phone + "','sign':'" + hex_md5('phone=' + phone + '&key=' + md5Key) + "'}"
		post(GET_CODE, obj, function(json) {
			showToast("验证码发送成功", 1000);
		});
	});

	$('#dialog-btn').click(function() {
		var phone = $('#dialog-phone').val();
		if (!phone) {
			showToast("手机号不能为空", 1000);
			return;
		}
		var code = $('#dialog-code').val();
		if (!code) {
			showToast("验证码不能为空", 1000);
			return;
		}
		var obj = "{'phone':'" + phone + "','verificationCode':'" + code + "','sign':'" + hex_md5('phone=' + phone +
			'&verificationCode=' + code + '&key=' + md5Key) + "'}"
		post(GET_LOGIN, obj, function(json) {
			showToast("登陆成功", 1000);
			window.sessionStorage.setItem("wallet_uid", json.uId);
			openSugar(json.uId);
		});
	});
});

function openSugar(uid) {
	document.getElementById("dia").close();
	$('body').removeClass('body-bg');
	$('.main-sugar').addClass('display-none');
	$('#main-detail').removeClass('display-none');

	var obj = "{'sugarId':'" + sugarId + "','uId':'" + uid + "','sign':'" + hex_md5('sugarId=' + sugarId +
		'&uId=' + uid + '&key=' + md5Key) + "'}"
	post(GET_MYSUGAR_RECORD, obj, function(json) {
		if (json.amount) {
			getSugarRecord(uid);
			$('.sugar-money').html(json.amount + currency);
		} else {
			post(GET_SUGAR_DRAW, obj, function(json) {
				if (json.code == 0) {
					showToast("领取成功", 1000);
					$('.sugar-money').html(json.data + currency);
				} else {
					$('.sugar-money').html('已领完');
				}
				getSugarRecord(uid);
			});
		}
	});
}

function getSugarRecord(uid){
	var obj = "{'sugarId':'" + sugarId + "','uId':'" + uid + "','sign':'" + hex_md5('sugarId=' + sugarId +
		'&uId=' + uid + '&key=' + md5Key) + "'}"
	post(GET_SUGAR_RECORD, obj, function(json) {
		var groupContent = $('#main-detail');
		for (var i = 0; i < json.length; i++) {
			groupContent.append('<div class="divider" style="height: 1px;"></div>' +
				'<div class="sugar-item">' +
				'<div class="item-number">' + json[i].amount + currency + '</div>' +
				'<div class="item-name">' + json[i].nickName + '</div>' +
				'<div class="item-time">' + json[i].createTime + '</div>' +
				'</div>');
		}
		$('.sugar-info').html('已领取' + json.length + '/' + number + '个');
	});
}

var wait = 60;
var isSend = false;

function time(o) {
	if (wait == 0) {
		isSend = false;
		o.html("获取验证码");
		wait = 60;
	} else {
		isSend = true;
		o.html("重新发送(" + wait + ")");
		wait--;
		setTimeout(function() {
				time(o)
			},
			1000)
	}
}
