cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _gameresult:null,
        _seats:[],
        owners: [],

        _lastSeconds: 0,
        _time: null,
        _roominfo: null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        var layerRoot = this.node.getChildByName("layerRoot");
        this._gameresult = layerRoot.getChildByName("game_over");
        //this._gameresult.active = false;
        this._time = cc.find('head/time', this._gameresult).getComponent(cc.Label);
        this._roominfo = cc.find('head/roominfo', this._gameresult).getComponent(cc.Label);

        for(var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); ++i){
            var seatPre=cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Common/seat");
            var seat=cc.instantiate(seatPre);
            this._seats.push(seat.getComponent("Seat"));
            var fangzhu = seat.getChildByName("fangzhu");
            this.owners.push(fangzhu);
        }
        var btnClose = cc.find("btnClose", this._gameresult);
        if(btnClose){
            cc.vv.utils.addClickEvent(btnClose,this.node,"PKGameResult","onBtnCloseClicked");
        }
        var btnShare = cc.find("btnShare", this._gameresult);
        if(btnShare){
            cc.vv.utils.addClickEvent(btnShare,this.node,"PKGameResult","onBtnShareClicked");
        }

        //初始化网络事件监听器
        var self = this;
        this.node.on('game_over',function(data){self.onGameEnd(data.detail);});
        this.onEventListener();
    },

    showResult:function(seat,info,isZuiJiaPaoShou){
        seat.node.getChildByName("zuijiapaoshou").active = isZuiJiaPaoShou;

        seat.node.getChildByName("zimocishu").getComponent(cc.Label).string = info.numzimo;
        seat.node.getChildByName("jiepaocishu").getComponent(cc.Label).string = info.numjiepao;
        seat.node.getChildByName("dianpaocishu").getComponent(cc.Label).string = info.numdianpao;
        seat.node.getChildByName("angangcishu").getComponent(cc.Label).string = info.numangang;
        seat.node.getChildByName("minggangcishu").getComponent(cc.Label).string = info.numminggang;
        seat.node.getChildByName("wangangcishu").getComponent(cc.Label).string = info.numwangang;
        seat.node.getChildByName("diangangcishu").getComponent(cc.Label).string = info.numdiangang;
    },

    onGameEnd:function(data){
        //增加代开房主
        var endinfo = data.endinfo
        var info = data.info

        var ownerImg = cc.find("owner", this._gameresult);
        var ownerName = cc.find("name", this._gameresult);

        var daikai = info.daikai

        var self = this
        if (daikai)
        {
            for (var i = 0; i < self.owners.length; i++) {
                self.owners[i].active = false;
            };
            ownerImg.active = true
            ownerName.getComponent(cc.Label).string = info.creator_name
        }
        else
        {
            ownerImg.active = false
            ownerName.getComponent(cc.Label).string = ""
        }

        var seats = cc.vv.ddzNetMgr.seats;
        var maxscore = -1;
        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            if(seat.score > maxscore){
                maxscore = seat.score;
            }
        }

        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            var isBigwin = false;
            if(seat.score > 0){
                isBigwin = seat.score == maxscore;
            }
            this._seats[i].setInfo(seat.userid, seat.name,seat.score, isBigwin);
            this._seats[i].setID(seat.userid);
            var num=cc.vv.SelectRoom.getRoomPeople();
            if(num==3){
                var scale=1;
                var offset=1.5;
            }else if(num==4){
                var scale=1;
                var offset=2.3;
            }else if(num==5){
                var scale=0.8;
                var offset=2.7;
            }else{
                var scale=0.6;
                var offset=3;
            }
            var width=scale*this._seats[i].node.getChildByName("GameEnd2").width;
            var tap=1280/num-width;
            this._seats[i].node.getChildByName("GameEnd2").setScale(scale,1);
            this._seats[i].node.parent= this._gameresult.getChildByName("seats");
            var pos=this._seats[i].node.parent.convertToWorldSpaceAR(cc.p((i-num+offset)*width+tap,246));
            var p=this._gameresult.convertToNodeSpaceAR(pos);
            this._seats[i].node.setPosition(p);
            // this.showResult(this._seats[i],endinfo[i],isZuiJiaPaoShou);
        }
        var gameNetMgr = cc.vv.ddzNetMgr;
        var roomid = gameNetMgr.roomId;
        if (gameNetMgr.roomId == null && cc.vv.userMgr.playingRoomId != null) {
            roomid = cc.vv.userMgr.playingRoomId;
        }
        this._roominfo.string = '房间号: ' + roomid + ' 局数: ' + gameNetMgr.numOfGames + '/' + gameNetMgr.maxNumOfGames;
        this._gameresult.active=true;
    },

    onBtnCloseClicked:function(){
        cc.vv.ddzNetMgr.seats = null;
       
        cc.vv.gameNetMgr.clearHandlers();

        cc.vv.net.endInterval();
        cc.vv.net.endSocket();

        // setTimeout(() => {
        //     cc.vv.net.isPinging = false;
        //     cc.vv.hallgameNetMgr.createHallSocket()
        //     cc.director.loadScene("hall")
        // }, 500);
        
        cc.director.loadScene("hall")

    },

    onBtnShareClicked:function(){
        cc.vv.ddzNetMgr.seats = null;
        cc.vv.anysdkMgr.shareResult();
    },

    onEventListener: function () {
        this._gameresult.on(cc.Node.EventType.TOUCH_START,function(event){
        });
    },

    curentTime: function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        var clock = year + "-";

        if (month < 10) {
            clock += "0";
        }

        clock += month + "-";

        if (day < 10) {
            clock += "0";
        }

        clock += day + " ";

        if (hh < 10) {
            clock += "0";
        }

        clock += hh + ":";
        if (mm < 10) {
            clock += '0';
        }

        clock += mm + ":";

        if (ss < 10) {
            clock += '0';
        }

        clock += ss;

        return clock;
    },

    update: function (dt) {
        var seconds = Math.floor(Date.now()/1000);
        if (this._lastSeconds != seconds) {
            this._lastSeconds = seconds;

            this._time.string = this.curentTime();
        }
    },
});
