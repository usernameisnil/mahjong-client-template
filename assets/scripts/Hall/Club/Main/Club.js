cc.Class({
    extends: cc.Component,

    properties: {
        cell: {
            default: null,
            type: cc.Prefab
        },
        clubScrollView: cc.ScrollView,
        _clubid:[],
        roomScroll: {
            default: null,
            type: cc.ScrollView
        },
        _lv:{
            default:{}
        },
        _isLv:false
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    // use this for initialization
    onLoad: function () {
        cc.vv.club=this;
        this.initClubScroll();
    },
    initClubScroll:function () {
        var onCreateClub = function (ret) {

            if (ret.errcode == 0 && ret.list.length != 0) {
                this.setupRecording(ret.list);
            } else {

                this.node.getChildByName("club_all").active = false;
            }

        }
        var club_data={
            userid:cc.vv.userMgr.userId,
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign
        }
        cc.vv.http.sendRequest("/get_my_club",club_data,onCreateClub.bind(this));
    },
    setupRecording: function (data) {
        this.clubScrollView.content.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            this._lv[data[i].clubinfo.name]=data[i].lv;
            var item = cc.instantiate(this.cell);
            var club_name = item.getChildByName("club_name").getComponent(cc.Label);
            var club_id = item.getChildByName("club_id").getComponent(cc.Label);
            this._clubid.push(data[i].clubinfo.clubid);
            club_name.string = data[i].clubinfo.name;
            club_id.string = data[i].clubinfo.clubid;
            item.x = -80;
            item.y = -50 * (i + 1);
            this.clubScrollView.content.addChild(item);
        }
        // this.clubScrollView.content.setContentSize(cc.size(this.clubScrollView.node.width,30 * data.length));

    },
    init: function () {
        this._roomsData = cc.vv.roomCfg.getOpendedRoomsData();
        console.log("roomsdata= mengdong",this._roomsData);
        this._replaceRecordData = [];
        this._roomItems = [];
        this._isToggle = "opened";
        // this.title_Operation.active = false;
        this.initOpenedScroll();
    },
    initScroll: function () {
        var content = this.roomScroll.content;
        content.removeAllChildren();
        this._roomItems.splice(0, this._roomItems.length);
        this._roomItems = [];
    },

    getOpenedRoomData: function (roomData) {
        var roomInfo = {};
        roomInfo.roomid = roomData.roomid;
        roomInfo.createTime = this.getCreateTime(roomData.create_time);
        if (roomData.status == 0) {
            roomInfo.roomStatus = "未开始";
        }else if (roomData.status == 1) {
            roomInfo.roomStatus = "已开始";
        }else {
            roomInfo.roomStatus = "";
        }

        roomInfo.playerList = roomData.player_list;

        roomInfo.gamePlay = this.getGamePlay(roomData.conf);

        // cc.log("roomInfo = ", roomInfo);

        return roomInfo;
    },

    getCreateTime: function (createTime) {
        var createTime = new Date(createTime * 1000)
        var year = createTime.getFullYear()
        var month =(createTime.getMonth() + 1).toString()
        var day = (createTime.getDate()).toString()
        var hour = (createTime.getHours()).toString()
        var minute = (createTime.getMinutes()).toString()
        var seconds = (createTime.getSeconds()).toString()
        if (month.length == 1) {
            month = "0" + month
        }
        if (day.length == 1) {
            day = "0" + day
        }
        if (hour.length == 1) {
            hour = "0" + hour
        }
        if (minute.length == 1) {
            minute = "0" + minute
        }
        if (seconds.length == 1) {
            seconds = "0" + seconds
        }
        var timeString = year + "-" + month + "-" + day + "\n" + hour + ":" + minute + ":" + seconds;
        return timeString;

    },

    getGamePlay: function (conf) {

        if (conf && conf.maxGames != null) {

            return cc.CGameConfigDataModel.getWanfa(conf);

        }
        return "";

        // var strArr = [];
        // if (conf && conf.maxGames!=null) {
            
            

        //     if (conf.opType == 1) {
        //         strArr.push("燕赵玩法: ");
        //     } else if (conf.opType == 2) {
        //         strArr.push("红中玩法: ");
        //     } else if (conf.opType == 10) {
        //         strArr.push("斗地主玩法: ")
        //     } else if (conf.opType == 3) {
        //         strArr.push("159玩法");
        //     } else if (conf.opType == 4) {
        //         strArr.push("258玩法");
        //     }

        //     if (conf.nSeats && conf.nSeats > 0) {
        //         strArr.push(conf.nSeats + "人")
        //     }

        //     strArr.push(", " + conf.maxGames + "局");

        //     switch (conf.reset_count) {
        //         case 1:
        //             strArr.push(", 一局选漂");
        //             break;
        //         case 4:
        //             strArr.push(", 四局选漂");
        //             break;
        //     }

        //     if (conf.opType == 1) {

        //         if (conf.daifeng) {
        //             strArr.push(", 带风");
        //         }

        //         switch (conf.hunCount) {
        //             case 1:
        //                 strArr.push(", 单混(下)");
        //                 break;
        //             case 2:
        //                 strArr.push(", 2混(上下)");
        //                 break;
        //             case 3:
        //                 strArr.push(", 3混(上中下)");
        //                 break;
        //         }
                
        //     }else if (conf.opType == 2) {

        //         if (conf.dianpaopei) {
        //             strArr.push(", 大包");
        //         }

        //         switch (conf.hunCount) {
        //             case 1:
        //                 strArr.push(", 32封顶");
        //                 break;
        //             case 2:
        //                 strArr.push(", 64封顶");
        //                 break;
        //             case 3:
        //                 strArr.push(", 不限");
        //                 break;
        //         }
                
        //     } else if (conf.opType == 10) {
        //         if (conf.zha) {
        //             strArr.push(', 炸翻倍')
        //         }
        //     } else if (conf.opType == 3) {
        //         if (conf.fanpai == 2) {
        //             strArr.push("翻2张牌");
        //         } else if (conf.fanpai == 4) {
        //             strArr.push("翻4张牌");
        //         } else if (conf.fanpai == 6) {
        //             strArr.push("翻6张牌");
        //         }


        //     } else if (conf.opType == 4) {


        //     }


        //     if (conf.fangzuobi) {
        //         strArr.push(", 开启GPS");
        //     }

        //     strArr.push(".");

        //     return strArr.join("");
        // }

        // return "";
    },


    toggleTitle: function () {
        if (this._isToggle == "opened") {
            this.title_Player.active = true;
            this.title_Operation.active = false;
        }else if (this._isToggle == "replaceOpened") {
            this.title_Player.active = false;
            this.title_Operation.active = true;
        }
    },

    initOpenedScroll: function () {
        // this.toggleTitle();
        this.initScroll();
        var room_num = this._roomsData.length;
        if (room_num <= 0) {
            return;
        }

        var content_height = 0;
        var content = this.roomScroll.content;

        for (var i = 0; i < room_num; i++) {
            var roomList = this.getOpenedRoomData(this._roomsData[i]);
            console.log("mengdong roomlist",roomList);
            roomList.itemIndex = i+1;
            var roomInfo = cc.vv.prefabMgr.getPrefab("prefabs/OpenedClubRoomInfo");
            var roomItem = cc.instantiate(roomInfo);
            var CVscript = roomItem.getComponent('OpenedRoomInfo');
            if (CVscript) {
                CVscript.init(roomList);
            }

            content_height = content_height + roomItem.height;

            content.height = content_height;
            content.addChild(roomItem)

            this._roomItems.push(roomItem);
        };

        var n = room_num*2;
        for (var i = 0; i < room_num; i++) {
            this._roomItems[i].y = - content.height * ((2*i+1)/n);
        };
    },

    refreshOpenedScroll: function (index) {
        cc.log("index = ", index);
        cc.vv.roomCfg.removeAOpendedRoomsData(index);
        this._roomsData = cc.vv.roomCfg.getOpendedRoomsData();
        this.initOpenedScroll();
    },
    //代开记录

    initRecordScroll: function () {
        this.toggleTitle();
        this.initScroll();
        var room_num = this._replaceRecordData.length;
        if (room_num <= 0) {
            return;
        }

        var content_height = 0;
        var content = this.roomScroll.content;

        for (var i = 0; i < room_num; i++) {

            var recordList = this.getOpenedRoomData(this._replaceRecordData[i]);
            recordList.itemIndex = i+1;
            var RecordInfo = cc.vv.prefabMgr.getPrefab("prefabs/Hall/ReplaceRoom/HasCreateRoom/OpenRoomRecord");
            var recordItem = cc.instantiate(RecordInfo);
            var CVscript = recordItem.getComponent('OpenRoomRecord');
            if (CVscript) {
                CVscript.init(recordList);
            }
            content_height = content_height + recordItem.height;
            content.height = content_height;
            content.addChild(recordItem)

            this._roomItems.push(recordItem);
        };

        var n = room_num*2;
        for (var i = 0; i < room_num; i++) {
            this._roomItems[i].y = - content.height * ((2*i+1)/n);
        };
    },

    requestDaiKaiRooms: function () {
        var self = this;
        var showOpenedRecord = function (ret) {
            cc.log("showOpenedRecord ret = ", ret);
            self._isToggle = "opened";
            cc.vv.wc.hide();
            if(ret.errcode !== 0){
                cc.vv.alert.show("查看已开房间失败!");
            }else {
                self.removeReplaceRecordData();
                cc.vv.roomCfg.deleteOpenedRecordData();
                cc.vv.roomCfg.setOpendedRoomsData(ret.data);
                self._roomsData = ret.data;
                self.initOpenedScroll();
            }
        }
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            userid:cc.vv.userMgr.userId
        };
        if(self.isClub){
            data.clubid=self._clubid;
            cc.log("showOpenedRecord",data.clubid);
        }
        cc.vv.wc.show(2);
        cc.vv.http.sendRequest("/get_daikai_rooms", data, showOpenedRecord);
    },

    requestDaiKaiLogs: function () {
        var self = this;
        var showReplaceRecord = function (ret) {
            
         
            cc.log("showReplaceRecord ret = ", ret);
            self._isToggle = "replaceOpened";
            cc.vv.wc.hide();
            if(ret.errcode !== 0 || ret.clientErrorCode == -120){
                cc.vv.alert.show("查看代开记录失败!");

            }else {
                self.removeRoomsData();
                cc.vv.roomCfg.deleteOpendedRoomsData();
                cc.vv.roomCfg.setOpenedRecordData(ret.data);
                self._replaceRecordData = ret.data;
                self.initRecordScroll();
            }


        }

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            userid:cc.vv.userMgr.userId
        };
        if(self.isClub){
            data.clubid=self._clubid;
        }
        cc.vv.wc.show(2);
        cc.vv.http.sendRequest("/get_daikai_logs", data, showReplaceRecord,null,true);
    },

    Btn_Opened_OnClicked: function () {
        if (this._isToggle == "opened") {
            return;
        }

        // var script = this.buttonGroup[0].getComponent("RadioButton");
        // cc.vv.radiogroupmgr.check(script);
        this.requestDaiKaiRooms();
    },

    Btn_Replace_Opened_OnClicked: function () {
        if (this._isToggle == "replaceOpened") {
            return;
        }

        // var script = this.buttonGroup[1].getComponent("RadioButton");
        // cc.vv.radiogroupmgr.check(script);
        this.requestDaiKaiLogs();
    },

    Btn_Back_OnClicked: function () {
        this.node.removeFromParent(true);
    },

    Btn_Refresh_OnClicked: function () {
        if (this._isToggle == "opened") {
            this.requestDaiKaiRooms();
        }else if (this._isToggle == "replaceOpened") {
            this.requestDaiKaiLogs();
        }
    },
    Btn_Club_Refresh:function () {
      this.initClubScroll();

    },
    removeRoomsData: function () {
        this._roomsData.splice(0, this._roomsData.length);
        this._roomsData = [];
    },
    removeReplaceRecordData: function () {
        this._replaceRecordData.splice(0, this._replaceRecordData.length);
        this._replaceRecordData = [];
    },
    onBtnClose:function(){
        cc.vv.utils.showDialog(this.node, 'body', false);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
    btn_createRoom:function () {
        cc.vv.utils.showDialog(cc.vv.hall.createRoomWin, 'body', true);
    }
});
