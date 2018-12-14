cc.Class({
    extends: cc.Component,

    properties: {

        _currIndex: -1,
        _timeLabel: [],
        _paicountLabel: [],
        _timeRoot: [],
        _ZhunBei: [],
        _time: -1,
        _alertTime: -1,
        _arrowRoot: null,
        _activeGuoBtn: null,
        _otherHolds: [],
        _dzholdsnum: 20,
        _notdzholdsnum: []

    },

    // use this for initialization
    onLoad: function () {

        var peoples = cc.vv.SelectRoom.getRoomPeople();
        switch (peoples) {
            case 3:
                var peopleName = "triple";
                break;
            case 4:
                var peopleName = "quadra";
                break;
            case 5:
                var peopleName = "penda";
                break;
            case 6:
                var peopleName = "hexa";
                break;
            default:
                break;
        }
        for (let i = 0; i < 3; ++i) {
            this._notdzholdsnum.push(17);
        }
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(peopleName);

        console.log(sideRoot);

        for (var i = 0; i < sideRoot.children.length; ++i) {


            if (i === 0) {
                var n = sideRoot.children[i];
                n = n.children[0];
                var paiRoot = n.getChildByName("arrow");
                var paicount = n.getChildByName("paicount");
                var nn = paiRoot.getChildByName('Time');
                var nnZhunBei = paiRoot.getChildByName('showZhunBei');
                nnZhunBei.active = false;
                nn.active = false;
                var paiRoot = game.getChildByName("arrow");
                this._arrowRoot = paiRoot;
                this._activeGuoBtn = paiRoot.getChildByName('activeGuoBtn');
                this._activeTiShiBtn=paiRoot.getChildByName('activeTiShiBtn');
                var nn = paiRoot.getChildByName('Time');
                var nnZhunBei = game.getChildByName('showZhunBei');

            } else {
                var n = sideRoot.children[i];
                n = n.children[0];
                var paiRoot = n.getChildByName("arrow");
                var paicount = n.getChildByName("paicount");
                var nn = paiRoot.getChildByName('Time');
                var nnZhunBei = paiRoot.getChildByName('showZhunBei')
                var otherholds = n.getChildByName('Holds');
            }
            nn.active = false;
            this._timeRoot.push(nn)
            //nnZhunBei.active = false;
            this._ZhunBei.push(nnZhunBei);
            var sprite = nn.children[1].getComponent(cc.Label);
            sprite.string = "";
            this._timeLabel.push(sprite);
            var sprite = paicount.children[0].getComponent(cc.Label);
            sprite.string = "";
            this._paicountLabel.push(sprite);
            otherholds && this._otherHolds.push(otherholds);
        }

        console.log(this._timeLabel);

        this.hideAllTime();
        this.hideAllzhunBei();

        var self = this;

        this.node.on('game_begin', function (data) {
            self.initPointer();
        });

        this.node.on('guo_notify', function (data) {
            self.hideAllTime();

        });
        this.node.on('PKguo_result', function (data) {
            self.hideAllTime();

        });
        this.node.on('user_state_changed', function () {
            self.showZhunBei();

        });
        this.node.on('game_chupai_notify', function (data) {
            var data = data.detail;
            var localindex = cc.vv.gameNetMgr.getLocalIndex(data.index);
            if (cc.vv.PKReplayMgr.isReplay()) {
                if (data.index === cc.vv.gameNetMgr.dzindex) {
                    self._dzholdsnum -= data.pai.length;
                    self.showPaiCount_step(localindex, self._dzholdsnum,data.seatData);
                    self.initOtherHolds(localindex, data.seatData);
                } else {
                    self._notdzholdsnum[localindex] -= data.pai.length;
                    self.showPaiCount_step(localindex, self._notdzholdsnum[localindex],data.seatData);
                    self.initOtherHolds(localindex, data.seatData);
                }
            } else {
                self.showPaiCount_step(localindex, data.num);
                // self.initOtherHolds(localindex, data.num);
            }
            if (data.pai[0] < 4) {
                var seatdata = data.seatData;
                var liangList = seatdata.liangList;
                var isagainLiang = true;
                for (var k in liangList) {
                    for (let kk = 0; kk < data.pai.length; kk++) {
                        if (data.pai[kk] === liangList[k]) {
                            isagainLiang = false;
                        }
                    }
                }
                if (isagainLiang) {

                    var tmpArr = data.pai;
                    var tmpArr = tmpArr.concat(liangList);

                    var tmpdata = {
                        userId: seatdata.userid,
                        pai: tmpArr,
                    }
                    cc.vv.gameNetMgr.dispatchEvent('game_lastliang_notify', tmpdata);
                }


            }

        });
        this.node.on('game_dizhu_push', function (data) {

            if (!cc.vv.PKReplayMgr.isReplay()) {
                var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail.userId);
                var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);

                self._paicountLabel[localindex].string = 20;
                // self.initOtherHolds(localindex, 20);
            }
        });
        this.node.on('game_dipai',function (data) {
            if(cc.vv.PKReplayMgr.isReplay()){
                var seatData=cc.vv.gameNetMgr.seats[data.detail.seatindex];
                var localindex = cc.vv.gameNetMgr.getLocalIndex(data.detail.seatindex);
                for(let i=0;i<self._paicountLabel.length;++i){
                    if(i===localindex){
                        self._paicountLabel[i].string = 20;
                        self.initOtherHolds(i, cc.vv.gameNetMgr.seats[data.detail.seatindex]);
                    }else{

                        self._paicountLabel[i].string = 17;
                            for(let j=0;j<cc.vv.gameNetMgr.seats.length;++j){
                                var localindex=cc.vv.gameNetMgr.getLocalIndex(cc.vv.gameNetMgr.seats[j].seatindex);
                                if(i===localindex){
                                    self.initOtherHolds(i, cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seats[j].seatindex]);
                                }
                            }
                    }

                }
            }
        });
        this.node.on('game_finished', function (data) {
            console.log("game_finished");
            if (cc.vv.gameNetMgr.gamestate !== '' && cc.vv.gameNetMgr.gamestate !== "liang") {
                self.initPointer();
                self._time = 15;
                self._alertTime = 3;
            }

        });
        this.node.on('game_liang', function (data) {
            self.hideAllzhunBei();
        });

        this.node.on('game_over_reset', function (data) {
            self.restPaiCount()
        });

        this.node.on('game_holds_num', function (data) {
            var data = data.detail;

                var list = data.list;
                for (let k in list) {
                    var loaclIndex = cc.vv.gameNetMgr.getLocalIndex(k);
                    self.showPaiCount_step(loaclIndex, list[k])
                }


        });


        this.node.on('game_chupai', function (data) {

            self.initPointer();
            self._time = 15;
            self._alertTime = 3;
        });

        this.node.on('game_over_timePointer', function (data) {

            self._alertTime = -1;
            
        });


    },

    start: function () {
        if (cc.vv.gameNetMgr.isSync === false) {
            this.showZhunBei();
        } else {
            this.showPaiCount();
        }

    },

    hideAllTime: function () {
        this._arrowRoot.active = false;
        for (var k in this._timeLabel) {
            this._timeRoot[k].active = false
            //this._timeLabel[k].node.active = false;

        }
    },

    restPaiCount: function () {
        var seats = cc.vv.gameNetMgr.seats;
        for (let k in seats) {
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seats[k].seatindex)
            //this._paicountLabel[localindex].string = seats[k].holdsNum;
            this.showPaiCount_step(localindex, '')
        }
    },

    showPaiCount_step: function (localindex, holdsNum,holds) {
        if(cc.vv.PKReplayMgr.isReplay()) {
            this.initOtherHolds(localindex, holds);
        }
        this._paicountLabel[localindex].string = holdsNum;
    },

    showPaiCount: function () {
        var seats = cc.vv.gameNetMgr.seats;
        for (let k in seats) {
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seats[k].seatindex)
            //this._paicountLabel[localindex].string = seats[k].holdsNum;
            this.showPaiCount_step(localindex, seats[k].holdsNum)
        }
    },

    showZhunBei: function (index) {
        if (cc.vv.gameNetMgr.gamestate === '') {
            var seats = cc.vv.gameNetMgr.seats;
            for (let k in seats) {
                var localindex = cc.vv.gameNetMgr.getLocalIndex(seats[k].seatindex)
                this._ZhunBei[localindex].active = seats[k].ready;
            }

        }

    },

    hideAllzhunBei: function () {
        for (let k in this._ZhunBei) {
            this._ZhunBei[k].active = false;
        }
    },

    initPointer: function () {
        if (cc.vv == null) {
            return;
        }
        this.hideAllTime();
        var turn = cc.vv.gameNetMgr.turn;
        this._currIndex = cc.vv.gameNetMgr.getLocalIndex(turn);
        if (this._currIndex === 0) {
            this._arrowRoot.active = cc.vv.gameNetMgr.gamestate == "playing";
            if (cc.vv.gameNetMgr.chupai_PK_last !== undefined) {
                if (cc.vv.gameNetMgr.chupai_PK_last[0] === 54 && cc.vv.gameNetMgr.chupai_PK_last.length === 1) {
                    this._activeTiShiBtn.active=false;
                    this._activeGuoBtn.getComponent(cc.Button).interactable = false
                } else {
                    this._activeTiShiBtn.active=true;
                    this._activeGuoBtn.getComponent(cc.Button).interactable = true
                }
            }


        }

        this._timeRoot[this._currIndex].active = cc.vv.gameNetMgr.gamestate == "playing";

    },
    initOtherHolds: function (index, holds) {
        var hold=this.node.getComponent('PKGame').sortHolds(holds);
        if (index !== 0) {
            this._otherHolds[index - 1].removeAllChildren();
            for (let i = 0; i < hold.length; i++) {
                let holdspk = cc.vv.prefabMgr.getPrefab('prefabs/Games/PKGame/Common/Poker/MyPK');
                let card = cc.instantiate(holdspk);
                let height = card.width;
                let sprite = card.getComponent(cc.Sprite);
                cc.vv.controlMgr.setSpriteFrameByMJID('', sprite, hold[i]);
                card.parent = this._otherHolds[index - 1];
                if (index === 1) {
                    card.rotation = 270;
                    card.y = i * 0.5 * height * 0.5 * 0.6 - (hold.length - 1) * 0.5 * height * 0.5 * 0.3-0.5 * height * 0.5 * 2;
                } else {
                    card.rotation = 90;
                    card.y = (hold.length - 1) * 0.5 * height * 0.5 * 0.3 - i * 0.5 * height * 0.5 * 0.6  - 0.5 * height * 0.5 * 2;
                }
                card.scale = 0.4;
            }
        }

    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this._time > 0) {
            this._time -= dt;
            if (this._alertTime > 0 && this._time < this._alertTime) {
                // cc.vv.audioMgr.playMJGameSFX("timeup_alarm.mp3");
                this._alertTime = -1;
            }
            var pre = "";
            if (this._time < 0) {
                this._time = 0;
            }

            var t = Math.ceil(this._time);
            if (t < 10) {
                pre = "0";
            }
            this._timeLabel[this._currIndex].string = pre + t;
        }
    },
});
