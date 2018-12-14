cc.Class({
    extends: cc.Component,

    properties: {
    	buttonGroup: {
    		default: [],
    		type: cc.Node
    	},
    	rBviews: {
    		default: [],
    		type: cc.Node
    	},
    	helpPopup: {
    		default: null,
    		type: cc.Node
    	},
    	prizeScroll: {
    		default: null,
    		type: cc.ScrollView
    	},
    	recordScroll: {
    		default: null,
    		type: cc.ScrollView
    	},
    	recordItemBgFrames: {
    		default: [],
    		type: cc.SpriteFrame
    	},
    	lblEmptyRecord: {
    		default: null,
    		type: cc.Node
    	},
    	lblMyIntegral: {
    		default: null,
    		type: cc.Label
    	},
    },

    onLoad: function () {
    	this.shareUrl = "";
    	this.prizeModel = this.getPrizeModel();
    	this.prizeItemModel = this.getPrizeItemModel();
    	this.recordItemModel = this.getRecordItemModel();
    	this.showView(false);
    	cc.vv.integralShop = this;
    },

    onEnable: function () {
    	this.prizeData = null;
    	this._isToggle = "";
    	this.showHelpTip(false);
    	this.Btn_Prize_OnClicked();
    	this.refreshMyIntegral();
    },

    showView: function (isShow) {
    	this.node.active = isShow;
    },

    showRBView: function (index) {
    	var rBviewLen = this.rBviews.length;
    	for (var i = 0; i < rBviewLen; i++) {
    		if (index == i) {
    			this.rBviews[i].active = true;
    		}else {
    			this.rBviews[i].active = false;
    		}
    		
    	};
    },

    getPrizeModel: function () {
    	var content = this.prizeScroll.content;
    	var firstItem = content.getChildByName("prizeItem");
    	var prizeNode = firstItem.getChildByName("prize");
    	var prizeModel = cc.instantiate(prizeNode);

    	// prizeNode.destroy();

    	return prizeModel;
    },

    getPrizeItemModel: function () {
    	var content = this.prizeScroll.content;
    	var prizeItem = content.getChildByName("prizeItem");
    	var prizeItemModel = cc.instantiate(prizeItem);
    	for (var i = 0; i < prizeItemModel.childrenCount; i++) {
    		prizeItemModel.children[i].destroy();
    	};

    	prizeItem.destroy();

    	return prizeItemModel;
    },

    getRecordItemModel: function () {
    	var content = this.recordScroll.content;
    	var recordItem = content.getChildByName("recordItem");
    	var recordItemModel = cc.instantiate(recordItem);

    	recordItem.destroy();

    	return recordItemModel;

    },

    requestPrize: function () {

    	var self = this;
    	cc.vv.userMgr.getIntegralPrize(function (ret) {

    		var conf = ret.conf;
    		self.shareUrl = ret.conf.shareimg;


    		var prizeRet = ret.list;
    		self.prizeData = prizeRet;
    		self._isToggle = "prize";
    		self.initPrizeContent();

    		self.showRBView(0);

    		var getPrizeScrollArray = self.getPrizeItemArray(prizeRet);
    		var itemLen = getPrizeScrollArray.length;
    		for (var i = 0; i < itemLen; i++) {
    			var prizeLen = getPrizeScrollArray[i].length;
    			self.initPrizeItem(prizeLen, getPrizeScrollArray[i], ret.conf);
    		};
    		
    	});
    },

    initPrizeContent: function () {
    	var content = this.prizeScroll.content;
    	for (var i = 0; i < content.childrenCount; i++) {
    		content.children[i].destroy();
    	};
    },

    getPrizeItemArray: function (ret) {
    	var retLen = ret.length;

    	var itemPrizeArray = [];

    	for (var i = 0; i < retLen; i++) {
    		if (i % 3 == 0) {
    			var prizeArray = [];
    			itemPrizeArray.push(prizeArray);
    		}

    		var itemMaxIndex = itemPrizeArray.length-1;
    		if (itemMaxIndex < 0) {
    			return;
    		}
    		itemPrizeArray[itemMaxIndex].push(ret[i]);
    	};

    	return itemPrizeArray;
    },

    initPrizeItem: function (prizeCount, itemRet, conf) {

    	var prizeItemModel = cc.instantiate(this.prizeItemModel);

    	var content = this.prizeScroll.content;

    	for (var i = 0; i < prizeCount; i++) {
			
			var prizeNode = cc.instantiate(this.prizeModel);
			
			var prizeSp = prizeNode.getChildByName("prizeBg").getComponent("cc.Sprite");

			var prizeInfo = cc.vv.userMgr.getPrizeKeyInfo(itemRet[i]["prizeRes"]);
			if (prizeInfo == null || prizeInfo.prizeName != itemRet[i]["prizeName"]) {
				var prizeRes = conf.path + itemRet[i]["prizeRes"] + conf.ext;
				this.setPrizePicture(prizeSp, itemRet[i]["prizeName"], itemRet[i]["prizeRes"], prizeRes);
			}else {
				prizeSp.spriteFrame = prizeInfo.prizeFrame;
			}

			var prizeNum = itemRet[i]["prizeNumber"];
			var surplusNode = prizeNode.getChildByName("surplus");
			var lblNum = surplusNode.getChildByName("lblPrizeNum").getComponent("cc.Label");
			if (prizeNum > 3) {
				surplusNode.active = false;
				lblNum.string = "";
			}else {
				surplusNode.active = true;
				lblNum.string = prizeNum.toString();
			}

			var lblIntegral = prizeNode.getChildByName("integralNum").getComponent("cc.Label");
			lblIntegral.string = itemRet[i]["prizeIntegral"];

			var ndExchange = prizeNode.getChildByName("btnExchange");
			var btnExchange = ndExchange.getComponent("cc.Button");
			if (prizeNum > 0) {
				btnExchange.interactable = true;
			}else {
				btnExchange.interactable = false;
			}

			var customEventData = this.getPrizeIndexByName(itemRet[i]["prizeName"])+1;
			cc.vv.utils.addClickEvent(ndExchange, this.node, "IntegralShop", "Btn_Exchange_OnClicked", customEventData);

			prizeNode.x = 280 * (i - 1);
			prizeNode.y = 0;

			prizeItemModel.addChild(prizeNode);
    	};

    	content.addChild(prizeItemModel);
    },

    setPrizePicture: function (sprite, prizeName, picName, murl) {
        var self = this;
        cc.loader.load(murl,function (err, texture) {
            var frame = new cc.SpriteFrame(texture);

            var info = {
            	prizeName: prizeName,
            	prizeFrame: frame
            };
            cc.vv.userMgr.setPrizeKeyInfo(picName, info);
            sprite.spriteFrame = frame;
        });
    },

    setSpriteFrame: function (sprite, frameRes) {
    	cc.vv.utils.createSpriteFrame({path : frameRes},function(sp){
            sprite.spriteFrame = sp;
        });
    },

    getPrizeIndexByName: function (name) {
    	var index = -1;
    	var prizeCount = this.prizeData.length;
    	for (var i = 0; i < prizeCount; i++) {
    		if (name == this.prizeData[i]["prizeName"]) {
    			index = i;
    			break;
    		}
    	};

    	return index;
    },

    Btn_Prize_OnClicked: function () {
        if (this._isToggle == "prize") {
            return;
        }
        var script = this.buttonGroup[0].getComponent("RadioButton");
        cc.vv.radiogroupmgr.check(script);

        this.requestPrize();
    },

    requestRecord: function () {
    	
    	var self = this;
    	cc.vv.userMgr.getExchangeRecord(function (ret) {

			
			self._isToggle = "record";
			self.initRecordContent();
    		self.showRBView(1);			
			self.initRecordItem(ret.list);
			if (ret.list.length !== 0) {
				self.lastid = ret.list[ret.list.length - 1].id;
			}	


    	},0);
	},
	
	requestRecord_Add: function () {
		var self = this;
		if (self.lastid === self.oldLastid) {
			return;
		}
		self.oldLastid = self.lastid;
		cc.vv.userMgr.getExchangeRecord(function (ret) {
		
			self._isToggle = "record";
			self.showRBView(1);			
			self.initRecordItem(ret.list);
			if (ret.list.length !== 0) {
				self.lastid = ret.list[ret.list.length - 1].id;
			}	
		}, self.lastid);
	},

    initRecordContent: function () {
		var content = this.recordScroll.content;
		content.y = 255;//初始位置
		content.removeAllChildren();
    },

    initRecordItem: function (recordRet) {
    	

		var content = this.recordScroll.content;
		var startIndex = content.childrenCount;


    	var itemLen = recordRet.length;
    	if (itemLen == 0) {
    		this.lblEmptyRecord.active = true;
    	}else {
    		this.lblEmptyRecord.active = false;
    	}

    	for (var i = 0; i < itemLen; i++) {
    		var itemData = recordRet[i];

    		var recordItemModel = cc.instantiate(this.recordItemModel);

    		var itemBgSp = recordItemModel.getChildByName("itemBg").getComponent("cc.Sprite");
    		var bgIndex = i % 2;
    		itemBgSp.spriteFrame = this.recordItemBgFrames[bgIndex];

    		var lblIndex = recordItemModel.getChildByName("lblIndex").getComponent("cc.Label");
			lblIndex.string = (i + 1 + startIndex).toString();

			var prizeName = itemData.good["prizeName"];
			var lblName = recordItemModel.getChildByName("lblPrizeName").getComponent("cc.Label");
    		lblName.string = prizeName;

    		var prizeIntegral = itemData["prizeIntegral"];
    		var lblIntegral = recordItemModel.getChildByName("lblIntegral").getComponent("cc.Label");
    		lblIntegral.string = prizeIntegral.toString();

    		var lblTime = recordItemModel.getChildByName("lblTime").getComponent("cc.Label");
			lblTime.string = this.getExchangeTime(itemData["exchangeTime"] * 1000); //itemData["exchangeTime"];//this.getExchangeTime(itemData["exchangeTime"]);
			
			var lblCDK = recordItemModel.getChildByName("lblCDK").getChildByName("label").getComponent("cc.Label");
			lblCDK.string = itemData["sn"]; 
			var btnCopy = recordItemModel.getChildByName("lblCDK").getChildByName("btn-copy");
			if (btnCopy) {
				cc.vv.utils.addClickEvent(btnCopy, this.node, "IntegralShop", "setCDKtoClipboard", itemData["sn"]);
			}		

    		var ndState = recordItemModel.getChildByName("lblState");
    		var stateString = "";
			if (itemData["status"] == 0) {
    			stateString = "未兑换";
    			ndState.color = new cc.Color(245, 8, 188);
			}else if (itemData["status"] == 1) {
    			stateString = "已兑换";
    			ndState.color = new cc.Color(0, 0, 0);
    		}
    		var lblState = ndState.getComponent("cc.Label");
    		lblState.string = stateString;

    		content.addChild(recordItemModel);

    	};
    },

    getExchangeTime: function (time) {
    	var getDate = cc.vv.global.dateFormat_date(time);
    	var getTime = cc.vv.global.dateFormat_time(time);

    	var timeStr = getDate + "\n" + getTime;
    	return timeStr;
    },

    Btn_Record_OnClicked: function () {
        if (this._isToggle == "record") {
            return;
        }

        var script = this.buttonGroup[1].getComponent("RadioButton");
        cc.vv.radiogroupmgr.check(script);

        this.requestRecord();
    },

    Btn_Back_OnClicked: function () {
    	cc.vv.utils.showDialog(this.node, 'body', false);
    },

    Btn_Exchange_OnClicked: function (event, customEventData) {

		cc.log("wujun customEventData = ", customEventData);
		customEventData -= 1;
    	if (customEventData < 0) {
    		return;
    	}
	
		var self = this;
		var prizeData = this.prizeData[customEventData];
		var gid = prizeData.id;
		cc.vv.userMgr.IntegralExchange(gid, function (ret) {
			console.log("baihua2001cn", ret);
			// errcode： 1:'商品不存在' 2:'库存不足' 3:'积分不足'
			var content = "";
			if (ret.errcode !== 0) {
				if (ret.errcode == 1) {
					content = "商品不存在！";
				} else if (ret.errcode == 2) {
					content = "商品库存不足！";
				} else if (ret.errcode == 3) {
					content = "您的积分不足，无法兑换该奖品！";
				}
				cc.vv.alert.show(content);
			} else {
				// credits: 946752
				// errcode: 0
				// errmsg: "ok"
				// sn: "7454817671326272"
				self.lblMyIntegral.string = ret.credits;
				cc.vv.alert.show("兑换已成功，确定后将被复制！")

			}

		})    	

    },

    showHelpTip: function (isShow) {
    	this.helpPopup.active = isShow;
    },

    Btn_Help_OnClicked: function () {
    	this.showHelpTip(true);
    },

    Btn_Close_Help_OnClicked: function () {
    	this.showHelpTip(false);
    },

    Btn_Share_OnClicked: function () {
    	if (this.shareUrl == "") {
    		return;
    	}
    	// var self = this;
    	// setTimeout(function () {
            cc.vv.anysdkMgr.shareIntegralShop(this.shareUrl);
        // }, 100);
    },

    refreshMyIntegral: function () {
    	var self = this;
    	cc.vv.userMgr.getUserScore(function (ret) {
            if (ret.credits != null) {
                self.lblMyIntegral.string = ret.credits;
            }else {
            	self.lblMyIntegral.string = "0";
            }
        })
	},
	
		
	recordScrollBack:function(event){
        var item = event.content.children;
		var item_len = item.length;
		if (item_len === 0) {
			return;
		}

        var last_item = item[item_len - 1];
        var targetWordPoint = last_item.convertToWorldSpace(last_item.x, last_item.y);
        //在0到-100请求一次后面数据
        if(targetWordPoint.y >-100 && targetWordPoint.y < 0){            
            this.requestRecord_Add();
        }
        //console.log(targetWordPoint);
	},

	setCDKtoClipboard: function (evnet,CDK) {
		cc.vv.anysdkMgr._putText(CDK);
		cc.vv.alert.show("已经复制到剪切板，"+"\n"+"请联系客户处理相关事宜！");
	},	


    setMyIntegarl: function (number) {
    	this.lblMyIntegral.string = number;
    },

    onDestroy: function () {
    	cc.vv.integralShop = null;
    },
});