$(function() {

	var useMethod =
		'区聊1.0是一款集合了区块链钱包，微博于一体的一站式区块链服务软件，区聊本地钱包是完全的去中心化钱包，安全性与imtoken完全一致，完全遵循区块链去中心化的特点，区聊云钱包则是一款中心化钱包，他脱离于以太坊网络，实现了区聊云钱包网络内互相转账免费的特点，为大家节省了一大笔旷工费，区聊里可以实现微博功能，发送糖包一旦有人领取，自动成为你的粉丝，增加用户粘性，区聊2.0将会加入社交功能，未来区聊将会成为区块链一站式服务软件.';
	var investmentApp = '区聊现在正式开启天使轮融资，资方需是有实力的投资方，计划融资1000万人民币，出让20%股权，资方不得干涉区聊公司的运营，不得短期要求公司盈利，只接受长期投资方，否则拒绝接受.';
	var recruit =
		'节点分为超级节点和普通节点，要想成为节点首先得联系微信客服2460739157，接受审核与考核，合格后才能成为节点，超级节点招募20名，普通节点招募100名，超级节点需持有50万枚QOP，每个月可以挖1万枚QOP，连挖100个月，普通节点需要有10万枚QOP，每个月可以挖1500枚，可挖80个月，持币之前需要先联系客服审核与考核，签署协议，否则无法成为节点.';
	var connectUs = '客服微信:2460739157';
	var development = '区聊属于QOP集团，未来将会孵化出10大子项目，区聊属于QOP集团第二大子项目，QOP属于QOP集团的积分通证，QOP集团10大子项目获取的利润70%都将会回馈给持有QOP积分通证的用户.';
	var hint = '1.本着去中心化的特点，为了保护您的数字资产安全，本公司提供的是去中心化的服务，大大区别于银行业，金融机构，用户了解并接受，本公司不承担以下责任：<br>' +
		'（1）存储用户的密码，即用户创建，导入钱包时设置的密码，私钥，助记词或keystore<br>' +
		'（2）找回用户的钱包密码，私钥，助记词或keystore<br>' +
		'（3）冻结本地钱包<br>' +
		'（4）挂失本地钱包<br>' +
		'（5）恢复本地钱包<br>' +
		'2.	您应当保存和保管您的钱包密码，私钥，助记词或keystore,尽量抄写于纸质材料并复制多份保存在多处你认为安全的地方， 因为自己的麻痹大意丢失或者泄露密码，私钥，助记词或keystore而引发的数字资产丢失，将与本公司无关;<br>' +
		'3.	各国用户在使用区聊时，应遵守各国的法律，不得将区聊用于违法，犯罪活动，否则本公司有权配合各国司法机关调查取证;<br>' +
		'4.	由于数字资产领域的法规政策尚未健全，数字资产价格波动较大，请大家谨慎投资.';

	$('.close').click(function() {
		$('#dia').addClass('display-none');
	});

	$('#item-use-method').click(function() {
		console.log('data');
		$('#dia').removeClass('display-none');
		$('#dia-content').html(useMethod);
	});

	$('#item-investment-app').click(function() {
		console.log('data');
		$('#dia').removeClass('display-none');
		$('#dia-content').html(investmentApp);
	});

	$('#item-recruit').click(function() {
		console.log('data');
		$('#dia').removeClass('display-none');
		$('#dia-content').html(recruit);
	});

	$('#item-connect-us').click(function() {
		console.log('data');
		$('#dia').removeClass('display-none');
		$('#dia-content').html(connectUs);
	});

	$('#item-development').click(function() {
		console.log('data');
		$('#dia').removeClass('display-none');
		$('#dia-content').html(development);
	});

	$('#item-hint').click(function() {
		console.log('data');
		$('#dia').removeClass('display-none');
		$('#dia-content').html(hint);
	});
});
