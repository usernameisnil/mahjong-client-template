cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        lbl_roomID: {
            default: null,
            type: cc.Label
        },
        lbl_roomStatus: {
            default: null,
            type: cc.Label
        },
        lbl_createTime: {
            default: null,
            type: cc.Label
        },
        lbl_roomPlay: {
            default: null,
            type: cc.Label
        },
        node_playerList: {
            default: [],
            type: cc.Node
        },
    },

    onLoad: function () {
    },

    init: function (roomData) {
        this.roomData = roomData;

        this.initUI();
    },

    initUI: function () {

        this.lbl_roomID.string = this.roomData.roomid;
        this.lbl_roomStatus.string = this.roomData.roomStatus;
        this.lbl_createTime.string = this.roomData.createTime;
        this.lbl_roomPlay.string = this.roomData.gamePlay;

        this.initPlayer();

        if (cc.vv.hall.isClubRoom) {
            if (cc.vv.hall._isLv) {
                this.node.getChildByName("operationNode").getChildByName("btnInvitingFriends").y = -68;
                this.node.getChildByName("operationNode").getChildByName("btnEnterRoom").y = 45;
                this.node.getChildByName("line").y = -93;
                this.node.getChildByName("lblGamePlay").y = -68;
                this.node.getChildByName("operationNode").getChildByName("btnDissolveRoom").active = true;
            } else {
                this.node.getChildByName("operationNode").getChildByName("btnInvitingFriends").y = -48;
                this.node.getChildByName("operationNode").getChildByName("btnEnterRoom").y = 45;
                this.node.getChildByName("line").y = -99;
                this.node.getChildByName("lblGamePlay").y = -70;
                this.node.getChildByName("operationNode").getChildByName("btnDissolveRoom").active = false;
            }
        }

        if(this.roomData.roomStatus != '未开始'){
            this.node.getChildByName("operationNode").getChildByName("btnInvitingFriends").active = false;
            this.node.getChildByName("operationNode").getChildByName("btnDissolveRoom").active = false;
        }

    },

    initPlayer: function () {
        var playerNum = this.roomData.playerList.length;
        for (var i = 0; i < playerNum; i++) {
            var playerInfo = cc.vv.prefabMgr.getPrefab("prefabs/Hall/ReplaceRoom/HasCreateRoom/OpenedPlayerInfo");
            var playerView = cc.instantiate(playerInfo);
            var CVscript = playerView.getComponent('OpenedPlayerInfo');
            if (CVscript) {
                CVscript.init(this.roomData.playerList[i]);
            }
            if (this.node_playerList[i] == null) {
                break;
            }
            this.node_playerList[i].addChild(playerView);
        }
        ;
    },

    Btn_Inviting_friend_OnClicked: function () {
        var title = "<燕赵麻将> 代开房";
        title = "房号:" + this.roomData.roomid + " " + title;
        cc.vv.anysdkMgr.share(title, "玩法:" + this.roomData.gamePlay);
    },

    Btn_Dissolve_Room_OnClicked: function () {
        var self = this;

        var dissolveRoom = function (ret) {
            cc.log("dissolveRoom ret = ", ret);
            cc.vv.wc.hide();
            if (ret.errcode !== 0) {
                cc.vv.alert.show("解散房间失败!");
            } else {
                if (ret.own_card_num == null) {
                    cc.log("ret.own_card_num is null");
                    return;
                }
                cc.vv.hall.setGems(ret.own_card_num.gems);
                cc.vv.userMgr.gems = ret.own_card_num.gems;
                self.node.removeFromParent(true);


                cc.vv.OpenedRoomView.refreshOpenedScroll(self.roomData.itemIndex - 1);
                cc.vv.alert.show("解散房间成功！");
            }
        }

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            roomid: this.roomData.roomid
        };
        if (cc.vv.hall.isClub) {
            data.clubid = cc.vv.OpenedRoomView._clubid;
        }

        cc.vv.wc.show(2);
        cc.vv.http.sendRequest("/dissolve_daikai_room", data, dissolveRoom);
    },

    Btn_Enter_ClubRoom_OnClicked: function () {
        var roomId = this.roomData.roomid;
        cc.vv.userMgr.enterRoom(roomId, function (ret) {
            // if (ret.errcode == 0) {
            // } else if (ret.errcode == -1) {

            // } else if (ret.errcode==3) {
            //     cc.vv.alert.show("房间[" + roomId + "]不存在");
            // }
            // else {
            //     var content = "房间[" + roomId + "]不存在，请重新输入!";
            //     if (ret.errcode == 4) {
            //         content = "房间[" + roomId + "]已满!";
            //     } else if (ret.errcode == 5) {
            //         content = "房主不能进入自己代开的房间！";
            //     }else if(ret.errcode == 6){
            //         content ='与其他玩家ip相同或地理位置相近，无法进入该房间';
            //     }else if(ret.errcode==7){
            //         var chk=cc.vv.GPSMgr.chkGps();
            //         if(!chk){
            //             return;
            //         }
            //         content='GPS数据获取失败';
            //     }
            //     cc.vv.alert.show(content);
            // }
        }.bind(this));
    }


});