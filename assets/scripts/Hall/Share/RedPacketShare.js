cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite: {
            default: null,
            type: cc.Sprite
        },
        bgFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        radioButtons: {
            default: [],
            type: cc.Node
        },
        models: {
            default: [],
            type: cc.Node
        },
        rpScroll: {
            default: null,
            type: cc.ScrollView
        },
        lblRPReceiveState: {
            default: null,
            type: cc.Label
        },
        shareScroll: {
            default: null,
            type: cc.ScrollView
        },
        lblAcerNumber: {
            default: null,
            type: cc.Label
        },
        btnShareReceive: {
            default: null,
            type: cc.Button
        },
        lblShareReceiveSuccess: {
            default: null,
            type: cc.Label
        },
        cellArray: {
            default: [],
            type: cc.Node
        }
    },

    onLoad: function () {
        cc.vv.redpacketshare=this;
        var self = this
        this.node.on("rb-updated", function (event) {
            var index = event.detail.id;
            self.initRadioView(index);
        });

        this.showHead();
    },

    start: function () {
        this.showRootNode(false);
    },

    init: function (radioIndex) {

        var localRadioButton = this.radioButtons[radioIndex].getComponent("RadioButton");
        localRadioButton.onClicked();

        this.initRadioView(radioIndex);

        this.showActionRootNode(true);

    },

    initRadioView: function (index) {
        if (index == 0) {
            this.sendRedPacket();
        } else if (index == 1) {
            this.sendShare();
        } else if (index == 2) {
            this.sendIntegral();
        }

        this.initBg(index);
        this.initModel(index);
    },

    initBg: function (index) {
        this.bgSprite.spriteFrame = this.bgFrames[index];
    },

    initModel: function (index) {
        for (var i = 0; i < this.models.length; i++) {
            var node = this.models[i];
            if (i == index) {
                node.active = true;
            } else {
                node.active = false;
            }
        }
        ;
    },

    showRootNode: function (isShow) {
        this.node.active = isShow;
    },

    sendShare: function () {

        this.lblShareReceiveSuccess.node.active = false;
        var self = this;
        cc.vv.userMgr.getAchieveLogs(function (data) {
            if (!data) {
                return
            }

            self.lblAcerNumber.string = data.card_num;

            if (parseInt(data.card_num) > 0) {
                self.btnShareReceive.interactable = true;
            }
            else {
                self.btnShareReceive.interactable = false;
            }

            self.userNum = data.user_num;
            self.canReceiveNum = data.card_num;
            self.cardArr = data.data;
            self.initShareUI(data.data);
        })

        this.showShareLayer(false);
    },

    showActionRootNode: function (isShow) {
        cc.vv.audioMgr.playButtonClicked();
        cc.vv.utils.showDialog(this.node, 'body', isShow);
    },

    initShareUI: function (data) {

        if (data.length) {

            this.shareScroll.content.removeAllChildren();

            for (var i = 0; i < data.length; i++) {
                var recording = data[i];

                var cloneItem = cc.instantiate(this.cellArray[1]);
                var contentL = cloneItem.getChildByName("content").getComponent(cc.Label);
                cloneItem.x = -30;
                cloneItem.y = -35 * i;
                this.shareScroll.content.addChild(cloneItem);

                if (recording.time.toString().length == 13) {
                    var date = new Date(recording.time);
                } else {
                    var date = new Date(recording.time * 1000);
                }

                var timeStr = this.getTimes(date, "share");
                contentL.string = timeStr + " 您领取了" + recording.num + "个房卡";
            }

            this.shareScroll.content.setContentSize(cc.size(this.shareScroll.node.width, 35 * data.length));
        }
    },

    sendRedPacket: function () {

        this.lblRPReceiveState.string = "";

        var self = this;
        cc.vv.userMgr.getActivity(function (data) {

            if (!data) {
                return;
            }

            console.log("getActivityInfo", data);
            switch (data.status) {
                case 0:

                    self.currentRound = 0;
                    self.rewardRound = data.activity.conf.rule["0"];
                    for (var i = 0; i < data.tongji.length; i++) {
                        if (data.tongji[i].type == 0) {
                            self.currentRound = data.tongji[i].num;
                        }
                    }
                    self.lblRPReceiveState.string = self.currentRound + "/" + self.rewardRound + "局,差" + (self.rewardRound - self.currentRound) + "局奖励一个红包，加油哦！";

                    console.log("getActivityInfo", data);

                    break;

                case 1:
                    self.node.getChildByName("body").getChildByName("redPocketModel").getChildByName("shareRP").active = false;
                    self.lblRPReceiveState.string = "您已有红包一个\n请前往微信公众号：云端世纪 客户中心点击领取红包";
                    break;

                case 2:

                    self.lblRPReceiveState.string = "恭喜您，已成功领取红包！";
                    break;

                case 3:
                    self.lblRPReceiveState.string = "抱歉，今天的红包已经领完了，下一次早点哦！";
                    break;
                case 4:
                    self.node.getChildByName("body").getChildByName("redPocketModel").getChildByName("shareRP").active = true;
                    self.lblRPReceiveState.string = "您已有红包一个,                         后即可领取";
                    break;
            }
        }, 1);

        this.initRedPacketRecord();

    },

    initRedPacketRecord: function () {

        this.rpScroll.content.removeAllChildren();

        var self = this;
        cc.vv.userMgr.getAwardsLog(function (data) {

            if (data.errcode == 0) {

                console.log("getRedPacketRecord", data);

                self.initRPScroll(data.list);
            }

        })
    },

    initRPScroll: function (data) {

        if (data.length) {

            this.rpScroll.content.removeAllChildren();

            for (var i = 0; i < data.length; i++) {

                var recording = data[i];
                var cloneItem = cc.instantiate(this.cellArray[0]);
                var contentL = cloneItem.getChildByName("content").getComponent(cc.Label);

                cloneItem.x = 0;
                cloneItem.y = -45 * i;
                this.rpScroll.content.addChild(cloneItem);

                if (recording.time.toString().length == 13) {
                    var date = new Date(recording.time)
                }
                else {
                    var date = new Date(recording.time * 1000)
                }

                var timeStr = this.getTimes(date, "redPacket");

                var userid = (recording.userid + "").substring(0, 2) + "***" + (recording.userid + '').substr(5, 1);
                if (recording.type == 0 && recording.status == 1) {
                    contentL.string = timeStr + "，玩家" + userid + "领取了一个现金红包";
                }
            }

            this.rpScroll.content.setContentSize(cc.size(this.rpScroll.node.width, 45 * data.length));
        }

    },

    getTimes: function (date, type) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString();
        var day = (date.getDate()).toString();
        var hour = (date.getHours()).toString();
        var minute = (date.getMinutes()).toString();

        if (month.length == 1) {
            month = "0" + month;
        }

        if (day.length == 1) {
            day = "0" + day;
        }

        if (hour.length == 1) {
            hour = "0" + hour;
        }

        if (minute.length == 1) {
            minute = "0" + minute;
        }

        var timeStr = "";
        if (type == "share") {
            timeStr = year + "-" + month + "-" + day + " " + hour + ":" + minute;
        } else if (type == "redPacket") {
            timeStr = hour + ":" + minute;
        }

        return timeStr;
    },

    onCloseClicked: function () {
        this.showActionRootNode(false);
    },

    onShareReceiveClicked: function () {

        var self = this;

        var hideFun = function () {
            self.lblShareReceiveSuccess.node.active = false;
        };

        cc.vv.userMgr.getAchieveCard(self.userNum, function (data) {
            if (!data || data.errcode != 0) {
                self.lblShareReceiveSuccess.node.active = true;
                self.lblShareReceiveSuccess.string = "领取失败,请稍后再试";

                setTimeout(hideFun, 1000);
                return;
            }

            // 刷新元宝界面

            self.lblShareReceiveSuccess.node.active = true;
            self.lblShareReceiveSuccess.string = "领取成功";

            if (cc.vv.hall) {
                cc.vv.hall.lblGems.string = data.own_card_num.gems;
            }
            cc.vv.userMgr.gems = data.own_card_num.gems;

            setTimeout(hideFun, 1000);

            self.lblAcerNumber.string = "0";
            self.btnShareReceive.interactable = false;

            //刷新scrollview
            var timestamp = new Date().getTime();
            var data = {
                time: timestamp,
                num: self.canReceiveNum
            }
            self.cardArr.splice(0, 0, data);
            self.initShareUI(self.cardArr);
        })
    },

    sendIntegral: function () {
        cc.vv.userMgr.setFirstIntegralPopup(false);
    },

    onShareWeChatFriendClicked: function () {
        this.share(false);
    },

    onShareWeChatFriendsCircleClicked: function () {
        this.share(true);
    },

    share: function (timeLine) {

        var shareWXNode = cc.vv.hall.node.getChildByName("shareWechat");
        shareWXNode.active = true;
        this.showShareLayer(false);

        cc.vv.audioMgr.playButtonClicked();
        setTimeout(function () {
            cc.vv.anysdkMgr.shareQRCode(shareWXNode, timeLine);
        }, 100);
    },
    onShareFriendCircleRP: function () {
        setTimeout(function () {
            cc.vv.anysdkMgr.shareRedPack();
        }, 100);
    },

    //二维码
    onShowShareLayerClicked: function () {
        this.showShareLayer(true);
    },

    onCloseShareLayerClicked: function () {
        this.showShareLayer(false);
    },

    showShareLayer: function (isShow) {
        var shareLayer = this.models[1].getChildByName("bottom").getChildByName("shareNode");
        shareLayer.active = isShow;
    },

    showHead: function () {
        var qrcodeNode = this.models[1].getChildByName("bottom").getChildByName("qrcodeNode");
        var imgLoader = qrcodeNode.getChildByName("myHead").getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
    }
});