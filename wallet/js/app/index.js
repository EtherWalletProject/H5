(function($) {
	H.index = {
		init: function () {
			var aa=  'name=zs&key='+md5Key;
			console.log(aa)
			console.log('md5:'+hex_md5(aa))
		}
	};

	W.commonApiPromotionHandler = function(data) {
		
	};
})(Zepto);

$(function() {
	H.index.init();
});