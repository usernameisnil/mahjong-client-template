var Buffer = require('buffer').Buffer;
cc.Class({
    extends: cc.Component,

    properties: {
        _history: null,
        _historyRoom: null,
        _historyDetail: null,

        _roomItemTemp: null,
        _gameItemTemp: null,

        _historyData: null,
        _curRoomInfo: null,
        _emptyTip: null,

        _others: null,

        cell: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var history = this.node.getChildByName("layerRoot").getChildByName("history");
        this._history = history;
        history.active = false;

        var historyRoom = history.getChildByName('historyRoom');
        var historyDetail = history.getChildByName('historyDetail');
        this._historyRoom = historyRoom;
        this._historyDetail = historyDetail;

        var emptyTip = cc.find('body/emptyTip', historyRoom);
        this._emptyTip = emptyTip;

        var viewlist = cc.find('body/roomlist', historyRoom);
        var content = cc.find("view/content", viewlist);

        var temp = content.children[0];
        this._roomItemTemp = temp;
        content.removeChild(temp);

        var gamelist = cc.find('body/gamelist', historyDetail);
        var gamecontent = cc.find("view/content", gamelist);

        temp = gamecontent.children[0];
        this._gameItemTemp = temp;
        gamecontent.removeChild(temp);

        var node = cc.find("Canvas/body/bottom_right/btn_zhanji");
        this.addClickEvent(node, this.node, "History", "onBtnHistoryClicked");

        var node = cc.find('body/btnBack', historyRoom);
        this.addClickEvent(node, this.node, "History", "onBtnBackClicked");

        var node = cc.find('body/btnBack', historyDetail);
        this.addClickEvent(node, this.node, "History", "onBtnBackClicked");

        var node = cc.find('body/btnOthers', historyRoom);
        this.addClickEvent(node, this.node, "History", "onBtnOthersClicked");

        this._others = this.node.getChildByName("layerRoot").getChildByName("JoinGame");
    },

    addClickEvent: function (node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    onBtnOthersClicked: function () {
        cc.vv.userMgr.boolReplyJoinGame = true;
        // this._others.active = true;
        cc.vv.utils.showDialog(this._others, 'panel', true);
    },

    onBtnBackClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        cc.vv.wc.hide();

        if (this._curRoomInfo == null) {
            this._historyData = null;
            cc.vv.utils.showFrame(this._historyRoom, 'head', 'body', false, this._history);
        } else {
            this._historyRoom.active = true;

            cc.vv.utils.showFrame(this._historyDetail, 'head', 'body', false);

            this.initRoomHistoryList(this._historyData);
        }
    },

    onBtnHistoryClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        var self = this;

        cc.vv.userMgr.getHistoryList(function (data) {

            self._history.active = true;
            self._historyDetail.active = false;           
            cc.vv.utils.showFrame(self._historyRoom, 'head', 'body', true);

            if (!data) {
                return;
            }

            data.sort(function (a, b) {
                return a.time < b.time;
            });

            self._historyData = data;
            for (var i = 0; i < data.length; ++i) {
                var numOfSeats = data[i].seats.length;
                for (var j = 0; j < numOfSeats; ++j) {
                    var s = data[i].seats[j];
                    s.name = new Buffer(s.name, 'base64').toString();
                }
            }

            // cc.log("战绩数据:",data)
            self.initRoomHistoryList(data);
        });
    },

    dateFormat: function (time) {
        var date = new Date(time);
        var datetime = "{0}-{1}-{2} {3}:{4}:{5}";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month >= 10 ? month : ("0" + month);
        var day = date.getDate();
        day = day >= 10 ? day : ("0" + day);
        var h = date.getHours();
        h = h >= 10 ? h : ("0" + h);
        var m = date.getMinutes();
        m = m >= 10 ? m : ("0" + m);
        var s = date.getSeconds();
        s = s >= 10 ? s : ("0" + s);
        datetime = datetime.format(year, month, day, h, m, s);
        return datetime;
    },

    initRoomHistoryList: function (data) {
        var userid = cc.vv.userMgr.userId;
        var content = cc.find("body/roomlist/view/content", this._historyRoom);
        for (var i = 0; i < data.length; i++) {
            var node = this.getRoomItem(i);
            var titleId = '' + (i + 1);

            node.idx = i;
            node.getChildByName('lblID').getComponent(cc.Label).string = titleId;
            // node.getChildByName('game_num').getComponent(cc.Label).string = data[i].maxGames;
            node.getChildByName("room_id").getComponent(cc.Label).string = data[i].id;

            var datetime = this.dateFormat(data[i].time * 1000);
            node.getChildByName("lblTime").getComponent(cc.Label).string = datetime;

            var seats = node.getChildByName('seats');// .arrivalOrder is removed, please use getSiblingIndex instead.
            var id = 1;

            for (var jj = 0; jj < seats.childrenCount; jj++) {
                var s = seats.children[jj];
                s.active = false;
            }
            ;

            for (var j = 0; j < data[i].seats.length; j++) {
                (function () {
                    var s = data[i].seats[j];
                    if (userid == s.userid) {
                        var seat = seats.children[0];
                        seat.active = true;
                        seat.getChildByName('score').getComponent(cc.Label).string = s.score;
//continue;
                    } else {
                        var seat = seats.children[id];
                        seat.active = true;
                        seat.getChildByName('lblName').getComponent(cc.Label).string = s.name;
                        seat.getChildByName('score').getComponent(cc.Label).string = s.score;
                        id++;
                    }
                })(i, j);
            }
        }

        this._emptyTip.active = data.length == 0;
        this.shrinkContent(content, data.length);
        this._curRoomInfo = null;
    },

    initGameHistoryList: function (roomInfo, data) {
        /*
                data.sort(function(a, b) {
                   return a.create_time < b.create_time;
                });
        */
        var names = cc.find('body/title/seats', this._historyDetail);
        for (var i = 0; i < names.childrenCount; i++) {
            var name = names.children[i];
            var s = roomInfo.seats[i];

            if (s != undefined) {
                name.getComponent(cc.Label).string = s.name;
            } else {
                name.getComponent(cc.Label).string = "";
            }
        }

        var content = cc.find("body/gamelist/view/content", this._historyDetail);

        for (var i = 0; i < data.length; ++i) {
            var node = this.getGameItem(i);
            var idx = i;
            var titleId = '' + (idx + 1);

            node.idx = data[i].game_index;//idx;

            node.getChildByName('lblID').getComponent(cc.Label).string = titleId;
            var datetime = this.dateFormat(data[i].create_time * 1000);
            node.getChildByName("lblTime").getComponent(cc.Label).string = datetime;

            if (cc.vv.userMgr.returnRoomId != null) {
                node.getChildByName('btnReplay').getComponent(cc.Button).interactable = false;
            } else {
                node.getChildByName('btnReplay').getComponent(cc.Button).interactable = true;
            }

            var result = JSON.parse(data[i].result);

            var seats = node.getChildByName('seats');
            for (var j = 0; j < seats.childrenCount; j++) {
                var seat = seats.children[j];
                if (result[j] != undefined) {
                    seat.getComponent(cc.Label).string = result[j];
                } else {
                    seat.getComponent(cc.Label).string = ""
                }
            }
        }

        this.shrinkContent(content, data.length);
        this._curRoomInfo = roomInfo;
    },

    getRoomItem: function (index) {
        var content = cc.find("body/roomlist/view/content", this._historyRoom);

        if (content.childrenCount > index) {
            return content.children[index];
        }

        // var node = cc.instantiate(this._roomItemTemp);
        var node = cc.instantiate(this.cell);
        content.addChild(node);
        return node;
    },

    getGameItem: function (index) {
        var content = cc.find("body/gamelist/view/content", this._historyDetail);

        if (content.childrenCount > index) {
            return content.children[index];
        }

        var node = cc.instantiate(this._gameItemTemp);
        content.addChild(node);
        return node;
    },

    shrinkContent: function (content, num) {
        while (content.childrenCount > num) {
            var lastOne = content.children[content.childrenCount - 1];
            content.removeChild(lastOne, true);
        }
    },

    getGameListOfRoom: function (idx) {
        var self = this;
        var roomInfo = this._historyData[idx];
        cc.vv.userMgr.getGamesOfRoom(roomInfo.uuid, function (data) {
            if (data != null && data.length > 0) {
                self._historyRoom.active = false;

                cc.vv.utils.showFrame(self._historyDetail, 'head', 'body', true);

                self.initGameHistoryList(roomInfo, data);
            }
        });
    },

    getDetailOfGame: function (idx) {
        var self = this;
        var roomUUID = this._curRoomInfo.uuid;
        cc.vv.userMgr.getDetailOfGame(roomUUID, idx, function (data) {
            data.base_info = JSON.parse(data.base_info);
            data.action_records = JSON.parse(data.action_records);
           
           var opType = data.base_info.conf.opType;
           cc.vv.SelectRoom.setGameName(data.base_info.conf.game);
           cc.vv.SelectRoom.setRoomType(opType);

           cc.vv.hallgameNetMgr.clearHandlers();
            // if (typeof (cc.vv.gameNetMgr) == 'object' && cc.vv.gameNetMgr != '') {

            //     if (typeof (cc.vv.gameNetMgr.clearHandlers) == 'function') {
            //         cc.vv.gameNetMgr.clearHandlers();
            //     }
            //     cc.vv.gameNetMgr = {};
            // }

           var  strGameType = data.base_info.conf.game; 

           cc.CGameConfigDataModel.initGameNetMgr(strGameType);

            // if (strGameType === 'ddz') {

            //     cc.vv.ddzNetMgr.init();
            //     cc.vv.ddzNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.ddzNetMgr
            // } else if (strGameType === 'pdk') {

            //     cc.vv.pdkNetMgr.init();
            //     cc.vv.pdkNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.pdkNetMgr
            // } else if (strGameType === 'huaian') {
            //     cc.vv.hagameNetMgr.init();
            //     cc.vv.hagameNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.hagameNetMgr;

            // } else if (strGameType === 'zhuolu') {
            //     cc.vv.mjgameNetMgr.init();
            //     cc.vv.mjgameNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.mjgameNetMgr
            // } else if (strGameType === 'tuidaohu') {
            //     cc.vv.tdhgameNetMgr.init();
            //     cc.vv.tdhgameNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.tdhgameNetMgr
            // } else if (strGameType === 'taikang') {
            //     cc.vv.tkgameNetMgr.init();
            //     cc.vv.tkgameNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.tkgameNetMgr
            // } else if (strGameType === 'erwuba') {
            //     cc.vv.EWBgameNetMgr.init();
            //     cc.vv.EWBgameNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.EWBgameNetMgr
            // } else if (strGameType === 'shanxi') {
            //     cc.vv.SXTDHgameNetMgr.init();
            //     cc.vv.SXTDHgameNetMgr.initHandlers();
            //     cc.vv.gameNetMgr = cc.vv.SXTDHgameNetMgr
            // }     
                   
            cc.vv.gameNetMgr.prepareReplay(self._curRoomInfo, data);

            if (strGameType == 'ddz') {         //'ddz' //add baihua2001cn cfg
                cc.vv.PKReplayMgr.init(data)
            } else if (strGameType == 'pdk') {
                cc.vv.PDKReplayMgr.init(data)
            } else cc.vv.replayMgr.init(data);

            cc.vv.SelectRoom.setScence();
        });
    },

    onViewItemClicked: function (event) {
        cc.vv.audioMgr.playButtonClicked();

        var idx = event.target.idx;

        if (this._curRoomInfo == null) {
            this.getGameListOfRoom(idx);
        } else {
            this.getDetailOfGame(idx);
        }
    },

    onBtnOpClicked: function (event) {

        if(event.target.name == 'btnReplay'){
            cc.vv.net_hall.endSocket();
        }

        cc.vv.audioMgr.playButtonClicked();

        var idx = event.target.parent.idx;

        if (this._curRoomInfo == null) {
            this.getGameListOfRoom(idx);
        } else {
            this.getDetailOfGame(idx);
        }
    },

    onBtnShareClicked: function (event) {
        cc.vv.audioMgr.playButtonClicked();

        var roomid = this._curRoomInfo.id;
        var roomUUID = this._curRoomInfo.uuid;
        var idx = event.target.parent.idx;

        var self = this;
        cc.vv.userMgr.getOtherReplyCode(roomid, roomUUID, idx, function (data) {
            var title = "<燕赵麻将>";
            var content = "玩家[" + cc.vv.userMgr.userName + "]分享了一个回放码:" + data.code.toString() + ",当日有效，在大厅点击战绩，然后点击查看他人回放，输入回放码即可查看精彩回放";
            cc.vv.anysdkMgr.share(title, content);
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
