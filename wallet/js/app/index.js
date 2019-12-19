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

var BASE_URL = 'http://121.199.68.72:8080/';
var GET_CODE = BASE_URL + 'mine/sendCode'; //发送手机验证码接口


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

function post(obj, callBack) {
	var httpRequest = new XMLHttpRequest(); //第一步：创建需要的对象
	httpRequest.open('POST', GET_CODE, true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
	httpRequest.setRequestHeader("Content-type", "application/json"); //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
	httpRequest.send(JSON.stringify(obj)); //发送请求 将json写入send中
	/**
	 * 获取数据后的处理程序
	 */
	httpRequest.onreadystatechange = function() { //请求后的回调接口，可将请求成功后要执行的程序写在其中
		if (httpRequest.readyState == 4 && httpRequest.status == 200) { //验证请求是否发送成功
			var json = httpRequest.responseText; //获取到服务端返回的数据
			console.log(json);
			callback(json);
		} else {
			showToast("请求出错", 1000);
		}
	};
}

$(function() {
	$('#sugar-bag').click(function() {
		document.getElementById("dia").showModal();
	});

	$('#dialog-getCode').click(function() {
		var phone = $('#dialog-phone').val();
		if (!phone) {
			showToast("手机号不能为空", 1000);
			return;
		}
		var obj = {
			name: 'phone',
			age: phone
		};
		post(obj, function(json) {
			console.log(json); // Cliton:Javascript
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
		document.getElementById("dia").close();
		$('body').removeClass('body-bg');
		$('.main-sugar').addClass('display-none');
		$('#main-detail').removeClass('display-none');
		var groupContent = $('#main-detail');
		for (var i = 1; i <= 15; i++) {
			groupContent.append('<div class="divider" style="height: 1px;"></div>' +
				'<div class="sugar-item">' +
				'<div class="item-number">12eth</div>' +
				'<div class="item-name">Tom</div>' +
				'<div class="item-time">2019-12-19 15:09</div>' +
				'</div>');
		}
	});
});
