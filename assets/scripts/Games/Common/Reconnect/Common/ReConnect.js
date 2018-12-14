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
        // ...
        _reconnect: null,
        _focusBtn: null,
        _lblTip: null,
        _timeoutObj: null,
        _lastPing: 0,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv) {
            cc.vv.reconnect = this;
        }

        this._reconnect = cc.find("Canvas/layerRoot/reconnect");
        this._lblTip = cc.find("tip", this._reconnect).getComponent(cc.Label);
        this._focusBtn = cc.find("btnFocusConnet", this._reconnect);
        cc.vv.utils.addClickEvent(this._focusBtn,this.node,"ReConnect","onClickedFouceBtn");
        this._focusBtn.active = false;
        var self = this;

        var fnTestServerOn = function () {
            cc.vv.net.test(function (ret) {
                if (ret) {
                    cc.vv.gameNetMgr.reset();
                    //cc.director.loadScene('hall');
                    
                    if(cc.vv.gameNetMgr.isOver == false){
                        cc.vv.userMgr.oldRoomId = cc.vv.gameNetMgr.roomId;              
                    }
                    var roomId = cc.vv.userMgr.oldRoomId;
                    if (roomId != null) {
                        cc.vv.userMgr.oldRoomId = null;
                        cc.vv.userMgr.enterRoom(roomId, function (ret) {
                            if (ret.errcode != 0) {
                                cc.vv.gameNetMgr.roomId = null;
                                cc.director.loadScene('hall');
                            }
                        });
                    }
                }
                else {
                    self.cleanTimeout();
                    self._timeoutObj = setTimeout(fnTestServerOn, 3000);
                }
            });
        }

        this.reconnectFn = function () {
            if (this.node == null) {
                return;
            }

            if (cc.vv.gameNetMgr.isOver == true) {
                this._reconnect.active = false;  //加入这句
                return;
            }

            this.node.off('disconnect', fn);
            this._reconnect.active = true;
            cc.vv.gameNetMgr.setSeatOnline(false);
            cc.vv.gameNetMgr.dispatchEvent('user_offline_state_changed');
            this.cleanTimeout();
            fnTestServerOn();
        };

        var fn = function (data) {
           
            setTimeout(function () {
                if (cc.vv.global._space === 'game') {
                    self.reconnectFn();
                }else{
                    console.log('已经离开游戏！');
                }
            }, 1000);
        };
        

        this.node.on('game_finished', function () {
            self._reconnect.active = false;
            cc.vv.gameNetMgr.setSeatOnline(true);
            self.node.on('disconnect', fn);
        });
        this.node.on('disconnect', fn);
    },

    cleanTimeout: function () {
        if (this._timeoutObj != null) {
            clearTimeout(this._timeoutObj);
        }
        this._timeoutObj = null;
    },

    onClickedFouceBtn: function () {
        var net = cc.vv.net;
        if(net.sio && net.sio.connected){
            net.sio.connected = false;
            net.sio.disconnect();
        }
        net.sio = null;
        this.reconnectFn();

        this._focusBtn.active = false;
        this._lastPing = 0;
    },

    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this._reconnect.active) {
            
            var t = Math.floor(Date.now() / 1000) % 4;
            this._lblTip.string = "正在连接牌局";
            for(var i = 0; i < t; ++ i){
                this._lblTip.string += '.';
            }

            if (cc.vv.net.sio && cc.vv.net.sio.connected == true) {
                this._reconnect.active = false;
                cc.vv.gameNetMgr.setSeatOnline(true);
                cc.vv.gameNetMgr.dispatchEvent('user_offline_state_changed');
            }

            if (this._lastPing >= 10) {
                this._focusBtn.active = true;
            }else {
                this._lastPing += dt;
            }
        }
    },

    onDestroy:function(){
        console.log("reconnect onDestroy");
        if(cc.vv && cc.vv.reconnect){
            this.cleanTimeout();
            cc.vv.reconnect = null;  
        }
    }
});
