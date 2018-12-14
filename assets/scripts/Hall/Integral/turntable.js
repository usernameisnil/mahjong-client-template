cc.Class({
	extends: cc.Component,

	properties: {

		pointer: {
			default: null,
			type: cc.Sprite
		},

		pointerButton: {
			default: null,
			type: cc.Node
		},
		recodeScroll: {
			default: null,
			type: cc.ScrollView
		}
	},

	pointerButtonStartControl: function (event) {

		if (this.turntableInfo == null) {
			return;
		}
		
		if (this.luckDrawNumber <= 0 && cc.vv.alert) {
			this.showNoLuckyDrawPopup(true, "您没有抽奖机会啦，请分享获得抽奖次数！");
			return;
		};

		this.setLuckyDrawBtnDisabled(false);
		cc.vv.userMgr.getActivityRequest("/activity/lucky_draw", this.getWinningThePrizeId.bind(this), 3);
	},

	getWinningThePrizeId: function (getRet) {
		if (getRet == null || getRet.data == null) {
			return;
		}

		var winningIndex = this.getPrizeIndexById(getRet.data.gid);

		//Math.random() * X   +  Y  // Y:是 固定 角度  X 是随即数
		var awardAngle = parseInt(Math.random() * 30 + (winningIndex - 1) * 36 - 15); //1 
		var rotateBy = cc.rotateBy(this.pointRotateTimes, awardAngle + 360 * this.pointRotateRounds + this.pointLocalRotate);
		var actionStepA = this.pointer.node.runAction(rotateBy.easing(cc.easeCubicActionOut()));
		this.pointLocalRotate = 360 - awardAngle;

		this.getPrizeAlert(getRet.data.gid);
		this.setluckDraw(1);
	},

	getPrizeIndexById: function (id) {
		if (cc.vv.utils.isNullOrUndefined(this.prizeTypeIndexArray[id])) {
			return -1;
		}else {
			var typeNumber = this.prizeTypeIndexArray[id].length;
			var randomIndex = Math.floor(Math.random() * typeNumber);
			return this.prizeTypeIndexArray[id][randomIndex] + 1;
		}
	},

	getPrizeInfoById: function (id) {
		return this.turntableInfo.list[id];
	},

	getPrizeNameById: function (id) {
		if (this.turntableInfo.list[id]) {
			return this.turntableInfo.list[id].name;
		}else {
			return null;
		}
		
	},

	getPrizeAlert: function (id) {

		var prizeInfo = this.getPrizeInfoById(id);
		this.scheduleOnce(function () { //播放完毕

			var alertContent = "恭喜您抽中了" +  prizeInfo.name + "，前往抽奖记录查看具体中奖信息。";
			if (id.toString() == this.thanksID) {
				alertContent = "很遗憾，您没有中奖，谢谢参与，请再接再厉！";
			}
			if (cc.vv.alert) {
				cc.vv.alert.show(alertContent);
			};

			this.setLuckyDrawBtnDisabled(true);

		}, this.pointRotateTimes + 0.5);
	},

	setLuckyDrawBtnDisabled: function (isClicked) {
		var tmpButton = this.pointerButton.getComponent("cc.Button");
		tmpButton.interactable = isClicked;
	},

	showNoLuckyDrawPopup: function (isShowPopup, contentString) {

		if (this.noPupop) this.noPupop.active = isShowPopup;
		if (isShowPopup == false) return;

		var lblPupopContent = this.noPupop.getChildByName("lblContent").getComponent("cc.Label");
		lblPupopContent.string = contentString;
	},

	onCloseNoPopupClicked: function () {
		this.showNoLuckyDrawPopup(false);
	},

	setRecordItemModel: function () {
   	
    	var recordItem = cc.find('turntable_table/prizeGroup',this.body);
    	this.recordItemModel = cc.instantiate(recordItem);
    	recordItem.destroy();

    	var scrollItem = this.recodeScroll.content.getChildByName("item");
    	this.scrollItemModel = cc.instantiate(scrollItem);
    	scrollItem.destroy();

	},

	// use this for initialization
	onLoad: function () {
	},

	init: function (turntableInfo) {

		cc.vv.turntable = this;
		this.body = this.node.getChildByName("body");

		this.pointRotateTimes = 6;      //设置转盘指针多时间
		this.pointRotateRounds = 10;	//设置转盘指针多少圈
		this.pointLocalRotate = 0;      //当前指针的角度

		this.showPrizeRecode(false);
		this.setRecordItemModel();

		this.turntableInfo = null, 
		this.prizeTypeNumber = 10, 
		this.thanksID = null, 
		this.thanksNumber = 0, 
		this.luckDrawNumber = 0, 
		this.sharePath = "";

		this.noPupop = this.body.getChildByName("noLuckyDrawPopup");
		this.showNoLuckyDrawPopup(false);

		this.getTurntableInfo(turntableInfo);
	},

	getTurntableInfo: function (getRet) {
		if (getRet != null && getRet.activity != null && getRet.activity.conf != null) {
			this.turntableInfo = getRet.activity.conf;
			this.thanksID = this.turntableInfo.none.toString();
			this.luckDrawNumber = getRet.drawnum;

			this.sharePath = this.turntableInfo.path + this.turntableInfo.shareimg + "." + this.turntableInfo.ext;

			this.initTurntableUI();
			this.setExplain(this.turntableInfo.desc);
		}

		this.lblDrawNumber = this.body.getChildByName("turntable_info").getChildByName("lblDrawNumber").getComponent("cc.Label");
		this.setluckDraw(0);
	},

	setluckDraw: function (subtractNumber) {
		this.luckDrawNumber -= subtractNumber;
		this.lblDrawNumber.string = this.luckDrawNumber.toString();
	},

	initTurntableUI: function () {

		this.prizeTypeIndexArray = {};//对不同奖品进行下标统计

		var sureTurntableInfo = this.getShowTurntableInfo(this.turntableInfo.list);
		
		var content = this.body.getChildByName('turntable_table');
		var turntableNumber = sureTurntableInfo.length;
		for (var i = 0; i < turntableNumber; i++) {

			var recordItemModel = cc.instantiate(this.recordItemModel);

			var imgPath = this.turntableInfo.path + sureTurntableInfo[i].img + "." + this.turntableInfo.ext;
			var prizeSprite = recordItemModel.getChildByName("sprite").getComponent("cc.Sprite");
			this.setPrizePicture(prizeSprite, imgPath);

			var prizeName = recordItemModel.getChildByName("label").getComponent("cc.Label");
			prizeName.string = sureTurntableInfo[i].name;
			
			recordItemModel.rotation = i*36;
			content.addChild(recordItemModel);  

			var idString = sureTurntableInfo[i].id.toString();
			if (cc.vv.utils.isNullOrUndefined(this.prizeTypeIndexArray[idString])) {
				this.prizeTypeIndexArray[idString] = [];
			}
			this.prizeTypeIndexArray[idString].push(i);  		
    	};
	},

	setPrizePicture: function (sprite, murl) {
        var self = this;
        cc.loader.load(murl,function (err, texture) {
            var frame = new cc.SpriteFrame(texture);
            sprite.spriteFrame = frame;
        });
    },

	getShowTurntableInfo: function (info) {

		var sureInfo = [], thanksInfo = null;
		for (var key in info) {
			var prizeID = info[key].id.toString();
			if (prizeID != this.thanksID) {
				sureInfo.push(info[key]);
			}else {
				thanksInfo = info[key];
			}
		}

		var prizeNumber = sureInfo.length;
		this.thanksNumber = this.prizeTypeNumber - prizeNumber;

		if (this.thanksNumber > 0) {
			var thanksInsertIndex = [], maxIndex = this.prizeTypeNumber-1;
			for (var i = 0; i < this.thanksNumber; i++) {
				var index = Math.floor(Math.random()*(maxIndex+1));
				thanksInsertIndex.push(index);
				sureInfo.push(null);
			};

			for (var j = 0; j < this.thanksNumber; j++) {
				var index = thanksInsertIndex[j];
				sureInfo.splice(index, 0, thanksInfo);
			};

			var turntableNumber = sureInfo.length;
			for (var k = turntableNumber-1; k >= 0; k--) {
				if (sureInfo[k] == null) {
					sureInfo.splice(k, 1);
				}
			};
		}else {
			this.thanksNumber = 0;
			for (var l = prizeNumber-1; l > 10; l--) {
				sureInfo.splice(l, 1);
			};
		}

		return sureInfo;
	},

	setExplain: function (explainArray) {

		var explainString = "";
		for (var i = 0, explainLen = explainArray.length; i < explainLen; i++) {
			if (explainString != "") {
				explainString = explainString + "\n" + explainArray[i];
			}else {
				explainString = explainString + explainArray[i];
			}
		};

		var lblExplain = this.body.getChildByName("lblExplain").getComponent("cc.Label");
		lblExplain.string = explainString;
	},

	showPrizeRecode: function (isShow) {
		var prizeRecode = this.body.getChildByName("turntable_jiangli");
		prizeRecode.active = isShow;
	},

	maskBackClicked: function () {
		this.node.removeFromParent(true);
	},

	maskRecodeBackClicked: function () {
		this.showPrizeRecode(false);
	},

	onPrizeRecodeClicked: function () {
		cc.vv.userMgr.getActivityRequest("/activity/get_awards_log", this.getPrizeRecodeInfo.bind(this), 3);
	},

	getPrizeRecodeInfo: function (getRet) {

		if (getRet == null || getRet.list == null) {
			return;
		}

		this.showPrizeRecode(true);

		this.recodeScroll.content.removeAllChildren(true);

		var recodeNumber = getRet.list.length;
		for (var i = 0; i < recodeNumber; i++) {
			var oneInfo = getRet.list[i];

			var nameString = this.getPrizeNameById(oneInfo.type);
			if (nameString == null) {
				continue;
			}

			var itemModel = cc.instantiate(this.scrollItemModel);

			var lblId = itemModel.getChildByName("Prize_id").getComponent("cc.Label");
			lblId.string = oneInfo.id.toString();

			var lblName = itemModel.getChildByName("Prize_name").getComponent("cc.Label");
			lblName.string = nameString;

			var lblTime = itemModel.getChildByName("Prize_time").getComponent("cc.Label");
			lblTime.string = cc.vv.global.dateChangeLineFormat(oneInfo.time);

			var lblCDK = itemModel.getChildByName("Prize_cdk").getComponent("cc.Label");
			lblCDK.string = oneInfo.sn;

			var btnCopy = itemModel.getChildByName("btnCDKCopy");
			btnCopy.cdk = oneInfo.sn;

			this.recodeScroll.content.addChild(itemModel);
		};

	},

	onCopyCDKClicked: function (event) {
		var cdk = event.target.cdk;
		cc.vv.anysdkMgr._putText(cdk);
		cc.vv.alert.show("已经复制到剪切板，"+"\n"+"请联系客户处理相关事宜！");
	},

	onShareClicked: function () {
		cc.vv.audioMgr.playButtonClicked();
		if (this.sharePath == "") {
			return;
		}
		cc.vv.anysdkMgr.shareIntegralShop(this.sharePath, null, true);
	},

	onShareRefreshLuckyDraw: function (getRet) {

		if (getRet == null || getRet.num == null) {
			return;
		}

		this.luckDrawNumber = getRet.num;
		this.lblDrawNumber.string = this.luckDrawNumber.toString();
	},

	onDestroy: function () {
		if (cc.vv.turntable != null) cc.vv.turntable = null;
	},

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});
