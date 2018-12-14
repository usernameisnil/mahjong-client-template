
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
		this.shop = this.node.getChildByName("layerRoot").getChildByName('shop');
		this.shop.active = false;
	
		// var btnBuy = cc.find('body/bottom_right/btn_buy', this.node);
		// cc.vv.utils.addClickEvent(btnBuy, this.node, 'Shop', 'onBtnShopClicked');

		var btnAddGems = cc.find('body/top_left/gemsinfo/bg/btnAddGems', this.node);
		cc.vv.utils.addClickEvent(btnAddGems, this.node, 'Shop', 'onBtnShopClicked');

		var btnBack = cc.find('head/btnBack', this.shop);
		cc.vv.utils.addClickEvent(btnBack, this.node, 'Shop', 'onBtnBackClicked');

		var goods = cc.find('body/goods', this.shop);
		for (var i = 0; i < goods.childrenCount; i++) {
			var good = goods.children[i];
			cc.vv.utils.addClickEvent(good, this.node, 'Shop', 'onBtnGoodsClicked');
		}
    },

	onBtnGoodsClicked: function(event) {
		console.log('onBtnGoodsClicked');
    },

	onBtnShopClicked: function(event) {
		var self = this;

		cc.vv.audioMgr.playButtonClicked();
		cc.vv.utils.showFrame(this.shop, 'head', 'body', true);

		// todo
		var goods = cc.find('body/goods', this.shop);
		var data = [
					{goods_price: 10, goods_num: 10},
					{goods_price: 50, goods_num: 50},
					{goods_price: 100, goods_num: 100}]

		for (var i = 0; i < goods.childrenCount; i++) {
				var good = goods.children[i];
				var info = data[i];

				var price = cc.find('bgMoney/price', good).getComponent(cc.Label);
				var number = cc.find('cardNum', good).getComponent(cc.Label);

				price.string = '￥' + info.goods_price;
				number.string = info.goods_num + '个';

				good.goodsInfo = info;
			}
		//

		// cc.vv.userMgr.getGameGoods(function(data) {
		// 	var goods = cc.find('body/goods', this.shop);
		// 	cc.log("pppppppp--------------",data)
		// 	if (!data) {
		// 		return;
		// 	}

		// 	for (var i = 0; i < data.length && i < goods.childrenCount; i++) {
		// 		var good = goods.children[i];
		// 		var info = data[i];

		// 		var price = cc.find('bgMoney/price', good).getComponent(cc.Label);
		// 		var number = cc.find('cardNum', good).getComponent(cc.Label);

		// 		price.string = '￥' + info.goods_price;
		// 		number.string = info.goods_num + '张';

		// 		good.goodsInfo = info;
		// 	}
		// });
    },

	onBtnBackClicked: function(event) {

		cc.vv.audioMgr.playButtonClicked();
	    cc.vv.utils.showFrame(this.shop, 'head', 'body', false);
    },
});

