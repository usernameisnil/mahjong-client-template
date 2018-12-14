cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomNo: {
            default: null,
            type: cc.Label
        },
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _seats: [],
        _seats2: [],
        _timeLabel: null,
        _voiceMsgQueue: [],
        _lastPlayingSeat: null,
        _playingSeat: null,
        _lastPlayTime: null,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv == null) {
            return;
        }

        console.log(cc.vv.gameNetMgr)
        if(cc.vv.gameNetMgr.conf !== null && cc.vv.gameNetMgr.conf !== undefined){
            if (cc.vv.gameNetMgr.conf.clubid && cc.vv.gameNetMgr.conf.clubid > 0) {
                this._isClub = true;
            } else {
                this._isClub = false;
            }
        }
       

        // if(cc.vv.gameNetMgr.conf.clubid!=0){
        //     cc.vv.hall.isClubRoom=true;
        //     cc.vv.hall._isClub=true;
        // }else {
        //     cc.vv.hall.isClubRoom=false;
        //     cc.vv.hall._isClub=false;
        // }

        this.initView();
        this.initSeats();
        this.setNetOffline();
        this.initEventHandlers();
    },

    initView: function () {
        var prepare = this.node.getChildByName("prepare");
        var seats = prepare.getChildByName("seats");
        for (var i = 0; i < seats.children.length; ++i) {
            this._seats.push(seats.children[i].getComponent("Seat"));
        }

        this.refreshBtns();

        this.lblRoomNo = cc.find("Canvas/infobar/roomTime/Z_room_txt/New Label").getComponent(cc.Label);
        this._timeLabel = cc.find("Canvas/infobar/roomTime/time").getComponent(cc.Label);
        this.lblRoomNo.string = cc.vv.gameNetMgr.roomId;
        var gameChild = this.node.getChildByName("game");
        // var sides = ["myself","right","up","left"];
        // for(var i = 0; i < sides.length; ++i){
        //     var sideNode = gameChild.getChildByName(sides[i]);
        //     var seat = sideNode.getChildByName("seat");
        //     this._seats2.push(seat.getComponent("Seat"));
        // }

        var seatsArr = gameChild.getChildByName("seats")
        for (var i = 0; i < seatsArr.childrenCount; i++) {
            var seat = seatsArr.children[i]
            this._seats2.push(seat.getComponent("Seat"));
        }

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
        var wanfa = cc.find("Canvas/infobar/wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();

        var seats = this.node.getChildByName("game").getChildByName("seats");
        var seat = seats.children[2];
        var seat_bg = seat.getChildByName("Z_user");

        var max_half_width = seat.x - seat_bg.width * 0.5;
        var wanfa_half_width = wanfa.node.width * 0.5;

        var out_left_screen_width = wanfa_half_width - this.node.width * 0.5;
        var wanfa_seat_overlap_width = wanfa_half_width - max_half_width;

        if (out_left_screen_width >= 0) {
            wanfa.node.x += out_left_screen_width;
        } else if (wanfa_seat_overlap_width > 0) {
            var left_move_width = wanfa_seat_overlap_width + out_left_screen_width;
            if (left_move_width >= 0) {
                wanfa.node.x -= out_left_screen_width;
            } else {
                wanfa.node.x -= wanfa_seat_overlap_width;
            }

        }
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
        var isIdle = cc.vv.gameNetMgr.numOfGames == 0;

        btnExit.active = !cc.vv.gameNetMgr.isOwner() && isIdle;


        cc.log("cc.vv.gameNetMgr.conf.daikai:", cc.vv.gameNetMgr.conf.daikai);
        //console.log("mengdong cc.vv.hall.isClubRoom", cc.vv.hall.isClubRoom);
        //console.log("mengdong admin=,creator=", cc.vv.gameNetMgr.conf.admin, cc.vv.gameNetMgr.conf.creator)
        //if (cc.vv.hall._isClub) {
        // if (this._isClub) {
        //     if (cc.vv.gameNetMgr.conf.daikai && cc.vv.gameNetMgr.conf.admin == cc.vv.gameNetMgr.conf.creator) {
        //         btnDispress.active = false;
        //         btnExit.active = isIdle;
        //     } else {
        //         btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;
        //     }
        // } else {
        //     if (cc.vv.gameNetMgr.conf.daikai) {
        //         btnDispress.active = false
        //         btnExit.active = isIdle
        //     }
        //     else {
        //         btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;
        //     }
        // }

         //重写俱乐部，退出房间、解散房间按钮的显示条件重写
         if (cc.vv.gameNetMgr.conf.clubid && cc.vv.gameNetMgr.conf.clubid > 0) {
            btnDispress.active = false;
            btnExit.active = isIdle;
        }else {
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
            self.initSeatPao();
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
            if (cc.vv.gameNetMgr.gamestate == 'playing' || cc.vv.gameNetMgr.isShowPao) {
                self._seats2[localIdx].chat(data.content);
            } else {
                self._seats[localIdx].chat(data.content);
            }
        });

        this.node.on('quick_chat_push', function (data) {
            console.log("MJRoom quick_chat_push");
            console.log(data);

            var data = data.detail;
            var tmpcontent = JSON.parse(data.content);
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
    
            //var info = cc.vv.chat.getQuickChatInfo(index);
            var game  = cc.vv.SelectRoom.getGameName();
            //"{"languageType":"Mandarin","sexType":"Woman","index":1}"
            var info = cc.CGameConfigDataModel.getChatItemData(game,tmpcontent.languageType,tmpcontent.sexType,tmpcontent.index);
            if (cc.vv.gameNetMgr.gamestate == 'playing' || cc.vv.gameNetMgr.isShowPao) {
                self._seats2[localIdx].chat(info.content);
            } else {
                self._seats[localIdx].chat(info.content);
            }
            cc.vv.audioMgr.playMJGameSFX(info.sound,true);
        });

        this.node.on('emoji_push', function (data) {
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            console.log(data);
            if (cc.vv.gameNetMgr.gamestate == 'playing' || cc.vv.gameNetMgr.isShowPao) {
                self._seats2[localIdx].emoji(data.content);
            } else {
                self._seats[localIdx].emoji(data.content);
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
    },

    initSingleSeat: function (seat) {
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;

        console.log("isOffline:" + isOffline);
        if (this._seats[index] == null || this._seats2[index] == null) {
            return;
        }
        this._seats[index].setInfo(seat.userid,seat.name, seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);

        this._seats2[index].setInfo(seat.userid,seat.name, seat.score);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].voiceMsg(false);
        this._seats2[index].refreshXuanPaiState();
    },

    initSeatPao: function () {
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null) {
            return;
        }

        for (var i = 0; i < seats.length; ++i) {
            var seat = seats[i];
            var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
            var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;
            this._seats2[index].setPao(isZhuang);
        }
    },

    setNetOffline: function () {

        // var seat = cc.vv.gameNetMgr.getSeatByID(cc.vv.userMgr.userId);
        var seat = cc.vv.gameNetMgr.getSeatByID(cc.vv.gameNetMgr.getMySeatUserId());
        
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        if (this._seats[index] == null || this._seats2[index] == null) {
            return;
        }
        var isOffline = !seat.online;
        console.log("setNetOffline isOffline:" + isOffline);
        this._seats[index].setOffline(isOffline);
        this._seats2[index].setOffline(isOffline);
    },

    onBtnSettingsClicked: function () {
        cc.vv.popupMgr.showSettings();
    },

    onBtnBackClicked:function(){
        cc.vv.alert.show("返回大厅房间仍会保留，快去邀请大伙来玩吧！",function(){
            cc.vv.userMgr.returnRoomId = cc.vv.gameNetMgr.roomId;
            cc.vv.userMgr.roomData = null //
            cc.vv.net.endSocket()
            cc.vv.global._space = 'hall';
            cc.director.loadScene("hall")
            // cc.director.loadScene("hall",function(){
            //     setTimeout(() => {
            //         cc.vv.hallgameNetMgr.createHallSocket()
            //     }, 500);
                
            // })
        },true);
    },

    onBtnChatClicked: function () {

    },

    onBtnWeichatClicked: function () {
        var title = "<燕赵麻将>";
        if (cc.vv.gameNetMgr.conf.type == "xlch") {
            var title = "<血流成河>";
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
            this._seats2[localIndex].voiceMsg(true);

            var msgInfo = JSON.parse(data.content);

            var msgfile = "voicemsg.amr";
            console.log(msgInfo.msg.length);
            cc.vv.voiceMgr.writeVoice(msgfile, msgInfo.msg);
            cc.vv.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },

    // called every frame, uncomment this function to activate update callback
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
        this._seats2[localIndex].voiceMsg(false);
    },

    onDestroy: function () {
        cc.vv.voiceMgr.stop();
//        cc.vv.voiceMgr.onPlayCallback = null;
    }
});
