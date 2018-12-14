
cc.Class({
    extends: cc.Component,

    properties: {
        RoleViews_triple: {
            default: [],
            type: cc.Node
        },
        RoleViews_quadra: {
            default: [],
            type: cc.Node
        },
        RoleViews_penda: {
            default: [],
            type: cc.Node
        },
        RoleViews_hexa: {
            default: [],
            type: cc.Node
        },
        _voiceMsgQueue: [],
        _seats: [],


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        if (cc.vv == null) {
            return;
        }
        if (cc.vv.hall) {
            if (cc.vv.gameNetMgr.conf.clubid && cc.vv.gameNetMgr.conf.clubid > 0) {
                cc.vv.hall.isClubRoom = true;
                cc.vv.hall._isClub = true;
            } else {
                cc.vv.hall.isClubRoom = false;
                cc.vv.hall._isClub = false;
            }
        }
        this.initView();
        this.initSeats();
        this.setNetOffline();
        this.initEventHandlers();

    },

    setNetOffline: function () {
        // var seat = cc.vv.gameNetMgr.getSeatByID(cc.vv.userMgr.userId);
        var seat = cc.vv.gameNetMgr.getSeatByID(cc.vv.gameNetMgr.getMySeatUserId());

        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        if (this._seats[index] == null) {
            return;
        }
        var isOffline = !seat.online;
        console.log("setNetOffline isOffline:" + isOffline);
        this._seats[index].setOffline(isOffline);
    },

    initView: function () {
        var seats = cc.vv.gameNetMgr.seats;
        var nSeats = seats.length;


        switch (cc.vv.gameNetMgr.seats.length) {
            case 3:
                var roleViews = this.RoleViews_triple
                break;
            case 4:
                var roleViews = this.RoleViews_quadra
                break;
            case 5:
                var roleViews = this.RoleViews_penda
                break;
            case 6:
                var roleViews = this.RoleViews_hexa
                break;
        }

        for (var i = 0; i < nSeats; ++i) {
            var pf_rv = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Common/Role/RoleView");
            var rv = cc.instantiate(pf_rv);

            console.log("++++++baihua2001cn++++++");
            console.log(rv);
            var tmpSeat = rv.getComponent("Seat");
            tmpSeat.localIndex = i;
            roleViews[i].addChild(rv);
            this._seats.push(tmpSeat);
        }

        this.refreshBtns();

        this.lblRoomNo = cc.find("Canvas/infobar/roomTime/Z_room_txt/New Label").getComponent(cc.Label);
        this._timeLabel = cc.find("Canvas/infobar/roomTime/time").getComponent(cc.Label);
        this.lblRoomNo.string = cc.vv.gameNetMgr.roomId;

        // var sides = ["myself","right","up","left"];
        // for(var i = 0; i < sides.length; ++i){
        //     var sideNode = gameChild.getChildByName(sides[i]);
        //     var seat = sideNode.getChildByName("seat");
        //     this._seats2.push(seat.getComponent("Seat"));
        // }

        // var seatsArr = gameChild.getChildByName("seats")
        // for (var i = 0; i < seatsArr.childrenCount; i++) {
        //     var seat = seatsArr.children[i]
        //     this._seats2.push(seat.getComponent("Seat"));
        // }


        var btnWechat = cc.find("Canvas/prepare/btnWeichat");
        if (btnWechat) {
            cc.vv.utils.addClickEvent(btnWechat, this.node, "MJRoom", "onBtnWeichatClicked");
        }


        var titles = cc.find("Canvas/typeTitle");
        for (var i = 0; i < titles.children.length; ++i) {
            titles.children[i].active = false;
        }

        // if(cc.vv.gameNetMgr.conf){
        //     var type = cc.vv.gameNetMgr.conf.type;
        // if(type == null || type == ""){
        //     type = "zhangbei";
        // }

        titles.getChildByName("gametype").active = true;
        // }

        this.initWanfaLabel();
    },

    initWanfaLabel: function () {
        var wanfa = cc.find("Canvas/infobar/roomTime/wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();

        // var seats = this.node.getChildByName("game").getChildByName("seats");
        // var seat = seats.children[2];
        // var seat_bg = seat.getChildByName("Z_user");

        //var max_half_width = seat.x - seat_bg.width*0.5;
        var wanfa_half_width = wanfa.node.width * 0.5;

        var out_left_screen_width = wanfa_half_width - this.node.width * 0.5;
        //var wanfa_seat_overlap_width = wanfa_half_width - max_half_width;

        // if (out_left_screen_width >= 0) {
        //     wanfa.node.x += out_left_screen_width;
        // }else if (wanfa_seat_overlap_width > 0) {
        //     var left_move_width = wanfa_seat_overlap_width + out_left_screen_width;
        //     if (left_move_width >= 0) {
        //         wanfa.node.x -= out_left_screen_width;
        //     }else {
        //         wanfa.node.x -= wanfa_seat_overlap_width;
        //     }

        // }
    },

    refreshBtns: function () {
        if (this.node == null) {
            return;
        }
        var prepare = this.node.getChildByName("prepare");
        var btnExit = prepare.getChildByName("btnExit");
        var btnDispress = prepare.getChildByName("btnDissolve");
        var btnWeichat = prepare.getChildByName("btnWeichat");
        var btnBack = prepare.getChildByName("btnBack");
        if (cc.vv.PKReplayMgr.isReplay()) {
            var isIdle = cc.vv.gameNetMgr.conf.maxGames === 0;
            console.log('172',isIdle);
        } else {
            var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
        }
        btnExit.active = !cc.vv.gameNetMgr.isOwner() && isIdle;

        cc.log("cc.vv.gameNetMgr.conf.daikai:", cc.vv.gameNetMgr.conf.daikai)
        if (cc.vv.hall&&cc.vv.hall._isClub) {
            if (cc.vv.gameNetMgr.conf.daikai && cc.vv.gameNetMgr.conf.admin == cc.vv.gameNetMgr.conf.creator) {
                btnDispress.active = false;
                btnExit.active = isIdle;
            } else {
                btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;
            }
        } else {
            if (cc.vv.gameNetMgr.conf.daikai) {
                btnDispress.active = false
                btnExit.active = isIdle
            }
            else {
                btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;
            }
        }
        btnWeichat.active = isIdle;
        btnBack.active = isIdle;
    },

    initEventHandlers: function () {
        var self = this;
        this.node.on('new_user', function (data) {
            self.initSingleSeat(data.detail);
        });

        this.node.on('user_state_changed', function (data) {
            self.initSingleSeat(data.detail);
        });

        this.node.on('user_offline_state_changed', function (data) {
            self.setNetOffline();
        });

        this.node.on('game_begin', function (data) {
            self.refreshBtns();
            self.initSeats();
            for (let i = 0; i < self._seats.length; ++i) {
                self._seats[i].setDZ(false);
                self._seats[i].setNM(false);
            }
        });

        this.node.on('game_num', function (data) {
            self.refreshBtns();
        });

        this.node.on('game_huanpai', function (data) {
            for (var i in self._seats2) {
                self._seats2[i].refreshXuanPaiState();
            }
        });

        this.node.on('huanpai_notify', function (data) {
            var idx = data.detail.seatindex;
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats2[localIdx].refreshXuanPaiState();
        });

        this.node.on('game_huanpai_over', function (data) {
            for (var i in self._seats2) {
                self._seats2[i].refreshXuanPaiState();
            }
        });
        this.node.on('voice_msg', function (data) {
            var data = data.detail;
            self._voiceMsgQueue.push(data);
            self.playVoice();
        });

        this.node.on('chat_push', function (data) {
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats[localIdx].chat(data.content);

            // if (cc.vv.gameNetMgr.gamestate == 'playing' || cc.vv.gameNetMgr.isShowPao) {
            //     self._seats2[localIdx].chat(data.content);
            // }else {
            //     self._seats[localIdx].chat(data.content);
            // }
        });


        this.node.on('quick_chat_push',function name(data) {
            
            var data = data.detail;
            var tmpcontent = JSON.parse(data.content);
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);

            var game = cc.vv.SelectRoom.getGameName();
            var info = cc.CGameConfigDataModel.getChatItemData(game,tmpcontent.languageType,tmpcontent.sexType,tmpcontent.index);
            self._seats[localIdx].chat(info.content);

            cc.vv.audioMgr.playMJGameSFX(info.sound,true);
            
        });


        // this.node.on('quick_chat_push', function (data) {
        //     console.log("MJRoom PKquick_chat_push",data);
        //     console.log(data);
        //     var data = data.detail;
        //     var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
        //     var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
        //     var chatdata = JSON.parse(data.content);
        //     var languagetype = chatdata.languageType;
        //     var sextype = chatdata.sexType;
        //     var index = chatdata.index;
        //     var info = null;
        //     if (data.sender == cc.vv.gameNetMgr.getMySeatUserId()) {
        //         info = cc.vv.chat.getQuickChatInfo(languagetype, sextype, index);
        //     } else {
        //         info = cc.vv.chat.getOtherChatInfo(languagetype, sextype, index);
        //     }

        //     if (info == null) {
        //         return;
        //     }
        //     self._seats[localIdx].chat(info.content);

        //     // if (cc.vv.gameNetMgr.gamestate == 'playing' || cc.vv.gameNetMgr.isShowPao) {
        //     //     self._seats2[localIdx].chat(info.content);
        //     // }else {
        //     //     self._seats[localIdx].chat(info.content);
        //     // }
        //     cc.vv.gameNetMgr.setAudioSFX(idx, -1, "Quip", info.sound, languagetype);
        //     // cc.vv.audioMgr.playMJGameSFX(info.sound,false);
        // });

        this.node.on('emoji_push', function (data) {
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            console.log(data);

            self._seats[localIdx].emoji(data.content);

            // if (cc.vv.gameNetMgr.gamestate == 'playing' ) {
            //     self._seats2[localIdx].emoji(data.content);
            // }else {
            //     self._seats[localIdx].emoji(data.content);
            // }  
        });
        this.node.on('game_dizhu_push', function (data) {
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail.userId);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            for (let i = 0; i < self._seats.length; ++i) {
                if (i === localindex) {
                    self._seats[i].setDZ(true);
                } else {
                    // self._seats[i].setNM(true);
                }
            }
        });
    },

    initSeats: function () {
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null) {
            return;
        }
        for (var i = 0; i < seats.length; ++i) {
            this.initSingleSeat(seats[i]);
        }

        console.log(this._seats);
    },

    getChangFoldsIndex: function () {

    },

    initSingleSeat: function (seat) {

        var arr_ChangIndex = [];
        var peopleNum = cc.vv.SelectRoom.getRoomPeople();
        switch (peopleNum) {
            case 3 :
                arr_ChangIndex = [1];
                break;
            case 4 :
                arr_ChangIndex = [1];
                break;
            case 5 :
                arr_ChangIndex = [1, 2];
                break;
            case 6 :
                arr_ChangIndex = [1, 2];
                break;
        }


        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;

        console.log("isOffline:" + isOffline);
        if (this._seats[index] == null) {
            return;
        }

        this._seats[index].setInfo(seat.userid, seat.name, seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);

        if (index === 0) {
            this._seats[index].setChangChatBubbleY(3);
        }


        if (arr_ChangIndex.indexOf(index) !== -1) {
            this._seats[index].setFoldsPosX(-260);
            this._seats[index].setPaiCountPosX(-80);
            this._seats[index].setHoldsPosX(-150);
            this._seats[index].setArrowPosX(-127);
            this._seats[index].setBuchuPosX(-180);
            this._seats[index].ChangChatBubble();
        }


        // this._seats2[index].setInfo(seat.userid, seat.name,seat.score);
        // this._seats2[index].setZhuang(isZhuang);
        // this._seats2[index].setOffline(isOffline);
        // this._seats2[index].setID(seat.userid);
        // this._seats2[index].voiceMsg(false);
        // this._seats2[index].refreshXuanPaiState();
    },


    onBtnSettingsClicked: function () {
        cc.vv.popupMgr.showSettings();
    },

    onBtnBackClicked:function(){
        cc.vv.alert.show("返回大厅房间仍会保留，快去邀请大伙来玩吧！",function(){
            
            cc.vv.userMgr.returnRoomId = cc.vv.gameNetMgr.roomId;
            cc.vv.userMgr.roomData = null //

            cc.vv.gameNetMgr.clearHandlers();

            cc.vv.net.endSocket()
            cc.director.loadScene("hall");

           cc.vv.global._space = 'hall'; 
            // cc.director.loadScene("hall",function(){
            //     setTimeout(() => {
            //         cc.vv.hallgameNetMgr.createHallSocket()
            //     }, 2000);
                
            // })
        },true);
    },

    onBtnChatClicked: function () {

    },

    onBtnWeichatClicked: function () {
        var title = "<亲友圈棋牌>";
        if (cc.vv.gameNetMgr.conf.type == "xlch") {
            //var title = "<血流成河>";
        }
        title = "房号:" + cc.vv.gameNetMgr.roomId + " " + title;
        // cc.vv.anysdkMgr.share("河南麻将" + title,"房号:" + cc.vv.gameNetMgr.roomId + " 玩法:" + cc.vv.gameNetMgr.getWanfa());
        cc.vv.anysdkMgr.share(title, "玩法:" + cc.vv.gameNetMgr.getWanfa());
    },

    onBtnDissolveClicked: function () {
        cc.vv.alert.show("解散房间不扣房卡，是否确定解散？",function(){
            cc.vv.net.send("dispress");   
          
        },true,null,true);
    },

    onBtnExit: function () {

        cc.vv.net.send("exit");
    },

    playVoice: function () {
        if (this._playingSeat == null && this._voiceMsgQueue.length) {
            console.log("playVoice2");
            var data = this._voiceMsgQueue.shift();
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(idx);
            this._playingSeat = localIndex;
            this._seats[localIndex].voiceMsg(true);
            // this._seats2[localIndex].voiceMsg(true);

            var msgInfo = JSON.parse(data.content);

            var msgfile = "voicemsg.amr";
            console.log(msgInfo.msg.length);
            cc.vv.voiceMgr.writeVoice(msgfile, msgInfo.msg);
            cc.vv.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },
    update: function (dt) {
        var minutes = Math.floor(Date.now() / 1000 / 60);
        if (this._lastMinute != minutes) {
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10 ? "0" + h : h;
            var m = date.getMinutes();
            m = m < 10 ? "0" + m : m;
            this._timeLabel.string = "" + h + ":" + m;
        }
        if (this._lastPlayTime != null) {
            if (Date.now() > this._lastPlayTime + 200) {
                this.onPlayerOver();
                this._lastPlayTime = null;
            }
        }
        else {
            this.playVoice();
        }
    },
    onPlayerOver: function () {
        cc.vv.audioMgr.resumeAll();
        console.log("onPlayCallback:" + this._playingSeat);
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
    },

    onDestroy: function () {
        cc.vv.voiceMgr.stop();
    },
    start: function () {
        var localindex = cc.vv.gameNetMgr.getLocalIndex(cc.vv.gameNetMgr.dz);
        if (cc.vv.gameNetMgr.isSync && cc.vv.gameNetMgr.gamestate === 'playing') {
            for (let i = 0; i < this._seats.length; ++i) {
                if (i === localindex) {
                    this._seats[i].setDZ(true);
                } else {
                    // this._seats[i].setNM(true);
                }
            }
        }
    }
    // start () {
    //
    // },

    // update (dt) {},
});
