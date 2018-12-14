var ClubPayBase = require('ClubPayBase');
cc.Class({
    extends: cc.Component,

    properties: {
        
    
    },

    // use this for initialization
    onLoad: function () {

        this._payClubApi = new ClubPayBase();
       
       
    },


    init: function (data) {
        this.getGoodsList();
    },




    getGoodsList:function(){
       
        var body = this.node.getChildByName('body');
        var goods = body.getChildByName('goods');
                     
        this._payClubApi.goodsList(function(data){
            show(data);
        });
        function show(data){
            for (var i = 0; i < goods.childrenCount; i++) {
                var good = goods.children[i];
                var info = data[i] || {};
    
                var price = cc.find('bgMoney/price', good).getComponent(cc.Label);
                var number = cc.find('cardNum', good).getComponent(cc.Label);
    
                price.string = '￥' + (info.goods_price || "??");
                number.string = (info.goods_num || "??") + '个';
    
                good.goodsInfo = info;
            }
        }
    },


    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        this.node.destroy();
    },

    onBtnGoodsClicked: function(event) {
		console.log('onBtnGoodsClicked');

		var good = event.target;
        var info=good.goodsInfo;
        
		if(info.type){
			var url=this._payClubApi.payUrl(cc.vv.userMgr.userId,info.type);
			cc.sys.openURL(url);
		}
    },
    /////////////////////////////////////////////////////////////


});
