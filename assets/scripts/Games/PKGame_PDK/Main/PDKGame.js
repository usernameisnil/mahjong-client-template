cc.Class({
    extends: cc.Component,

    properties: {

        gameRoot: {
            default: null,
            type: cc.Node
        },

        prepareRoot: {
            default: null,
            type: cc.Node
        },

        invatePrefab:{
            default: null,
            type: cc.Prefab,

        },
        activeGuoBtn:{
            default: null,
            type: cc.Button
        },
        _readyBtn: null,

        _bgMgr: null,
        _SeatMgr: null,
        _gamecount: null,
        _myselfHolds: [],
        _myPKArr: [],
        _myPKPosX: [],
        _holdsnode: null,
        _selectedPK: [],
        _mahjongShooted: false,

        _StartTouchX: null,
        _EndTouchX: null,
        _isMoved: false,

        _showIPEqual: false,
        _hintPaiArr: [],
        _hintIndex: null,
        _bottomCards: [],
        _dipai: [],
        _holdsSprite:[],
        _xiajiabaodan:false,

    },


    onLoad: function () {
        
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if (!cc.vv) {
            cc.director.loadScene("loading");
            return;
        }
        cc.vv.pdkgame = this;
        this.gameDesignSize();
        
        //this.addComponent("NoticeTip");
        //this.addComponent("GameOver");
        // this.addComponent("DingQue");
        //this.addComponent("PengGangs");
        //this.addComponent("PKRoom");
        this.addComponent("PDKTimePointer");
        this.addComponent("PDKGameResult");
        // this.addComponent("PKGameOver");
        this.addComponent("Chat");
        this.addComponent("PDKFolds");
        this.addComponent("PDKReplayCtrl");
        this.addComponent("PopupMgr");
        //this.addComponent("HuanSanZhang");
        this.addComponent("ReConnect");
        this.addComponent("Voice");
        this.addComponent("UserInfoShow");
        this.addComponent("PDKrun");
        //this.addComponent("hunpaiIcon");


        this.initView();//初始化桌面所有牌
        this.initEventHandlers();

        this.gameRoot.active = true;
        this.prepareRoot.active = true;

        this._hint = cc.find('Canvas/hint');

        this.onGameBeign(); //开始之前的准备，所有牌的设计
        cc.vv.audioMgr.playMJGameBGM("bgFight.mp3",true);

        cc.vv.userMgr.returnRoomId = null;
        cc.vv.http.needHttpReconnect = false;

        // cc.game.on(cc.game.EVENT_HIDE, function () {

        //     cc.vv.gameNetMgr.projectState = 'hideState';
        // });

        // cc.game.on(cc.game.EVENT_SHOW, function () {

        //     if (cc.vv.gameNetMgr.projectState == 'hideState') {
        //         setTimeout(function () {
        //             cc.vv.gameNetMgr.projectState = 'showState';
        //         }, 2000)

        //     }
        // });


        cc.log("---------------------游戏 onLoad")

    },
    initBottomCards: function (cards) {
        if (this._bottomCards.length !== 0) {
            this._bottomCards.splice(0, this._bottomCards.length);
        }
        for (let i = 0; i < 3; ++i) {
            var mypk = cc.find("Canvas/game/MyPK");
            if (mypk) {
                mypk.removeFromParent(true);
            }
        }
        // ,,
        if (cards === 0) {
            var card_len = 3;
        } else {
            var card_len = cards.dipai.length;
        }
        for (let i = 0; i < card_len; ++i) {
            let prefab = cc.vv.prefabMgr.getPrefab('prefabs/Games/PKGame/Common/Poker/MyPK');
            let card = cc.instantiate(prefab);
            let sprite = card.getComponent(cc.Sprite);
            if (cards === 0) {
                this.setSpriteFrameByMJID("default-", sprite, '');
            } else {
                this.setSpriteFrameByMJID("default-", sprite, cards.dipai[i]);
            }
            card.parent = this.gameRoot;
            card.y = 60;
            card.x = (card.width * 0.8 + 20) * (3 - 1) * -0.5 + (card.width * 0.8 + 20) * i;
            this._bottomCards.push(card);
        }
        for (let i = 0; i < this._bottomCards.length; ++i) {
            let card = this._bottomCards[i];
            let width = card.width;
            this.runCardsAction(card, cc.p((this._bottomCards.length - 1) * -0.5 * width * 0.4 + width * 0.4 * i, 260));
//
        }
    },

    initBaoDanPalyer(){
        this._xiajiabaodan = false;
        cc.vv.gameNetMgr._xiajiabaodan = false;
    },

    initView: function () {

        this.initClubFriend();

        var bg = cc.find('Canvas/bg/Z_background');
        this._bgMgr = bg.getComponent('SpriteMgr');
        this._bgMgr.setIndex(cc.vv.controlMgr.getBGStyle());
        this._gamecount = this.gameRoot.getChildByName('gamecount').getComponent(cc.Label);
        this._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";
        var _holds = cc.find("Canvas/game/pai/Holds");
        this._holdsnode = _holds;
        var hold_len = _holds.childrenCount;
        for (var j = 0; j < hold_len; j++) {
            _holds.children[j].active = false
            this._myselfHolds.push(_holds.children[j]);
            var sprite = _holds.children[j].getComponent(cc.Sprite);
            sprite.node.isTouch = true;
            this._myPKArr.push(sprite);
            var PKPosX = _holds.children[j].x;
            this._myPKPosX.push(PKPosX);
            sprite.spriteFrame = null;

            _holds.children[j].tag = 0;
            var grayPk = _holds.children[j].getChildByName("grayPk");
            grayPk.active = false;

        };

        _holds.active = false;

        this._readyBtn = cc.find('Canvas/action/btn_ready');
        this._readyBtn.active = false;
        this._tiBtn = this.gameRoot.getChildByName('tigrp').getChildByName('ti');
        this._fantiBtn = this.gameRoot.getChildByName('tigrp').getChildByName('fanti');
        this._butiBtn = this.gameRoot.getChildByName('tigrp').getChildByName('buti');
        // this._giveupBtn = cc.find('Canvas/action/btn_giveup');
        // this._giveupBtn.active = false;
        this.hideTiBtn(false);

        console.log(this._myselfHolds);

    },


    onGameBeign: function () {

  
        var seats = cc.vv.pdkNetMgr.seats;
        var seatData = seats[cc.vv.pdkNetMgr.seatIndex];
        this.initCardTag();
        this.showGrapPK(false);//隐藏选牌遮罩
        var _holds = cc.find("Canvas/game/pai/Holds");
        if (seatData.holds != null && seatData.holds.length > 0) {
            _holds.active = true;
        } else {
            _holds.active = false;
        }

        if (cc.vv.pdkNetMgr.isSync) {
            cc.find('Canvas/infobar/times').getComponent(cc.Label).string = cc.vv.pdkNetMgr.beishu;
        } else {
            cc.find('Canvas/infobar/times').getComponent(cc.Label).string = '1';
        }

        this.initMahjongs();       

        this.setupReconnect()

       

    },

    sortHolds: function (seatData) {


        var holds = seatData.holds;

        if (holds == null) {
            return;
        }
        for (let i = 0; i < holds.length; i++) {
            if (holds[i] === 52 || holds[i] === 53) {
                holds[i] = (holds[i] + 1) * 100
            }
        }
        holds = cc.vv.controlMgr.sortPK(holds);
        for (let i = 0; i < holds.length; i++) {
            if (holds[i] > 99) {
                holds[i] = holds[i] / 100 - 1
            }
        }

        return holds;
    },

    initMahjongs: function () {
        this._holdsSprite = [];
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if (holds == null) {
            return;
        }
        var hold_length = holds.length;
       
        //得到需要隐藏的牌数
        var leftHideNum = Math.ceil((20 - hold_length) / 2);

        var rightHideNum = 20 - leftHideNum - hold_length;
        for (let k = 0; k < leftHideNum; k++) {
            this.hideHoldMahjong(k);
        }
        for (var i = leftHideNum; i < hold_length + leftHideNum; ++i) {
            var mjid = holds[i - leftHideNum];
            var index = i;
            if (index > 19 && cc.vv.alert) {
                //cc.vv.alert.show("数据错误:手牌下标越界，请解散房间！");
                if (cc.vv.net) {
                    cc.vv.net.activeDisConnect();
                }
                return;
            };
            var sprite = this._myPKArr[index];
            sprite.node.active = true;
            sprite.node.mjId = mjid;
            sprite.node.x = this._myPKPosX[index];
            sprite.node.y = 0;
            sprite.node.isTouch = true;
            sprite.node.scaleX = 1;
            sprite.node.scaleY = 1;
            this.setSpriteFrameByMJID("default-", sprite, mjid);
            this._holdsSprite.push(sprite);
        }

        for (var i = leftHideNum + hold_length; i < this._myPKArr.length; ++i) {
            this.hideHoldMahjong(i);
        }


    },

    hideHoldMahjong: function (index) {
        var sprite = this._myPKArr[index];
        sprite.node.x = this._myPKPosX[index];
        sprite.node.y = 0;
        sprite.node.scaleX = 1;
        sprite.node.scaleY = 1;
        sprite.node.mjId = null;
        sprite.spriteFrame = null;
        sprite.node.active = false;
    },

    setSpriteFrameByMJID: function (pre, sprite, mjid) {

        cc.vv.controlMgr.setSpriteFrameByMJID(pre, sprite, mjid)

    },

    setupReconnect: function () {

        //重连
        if (cc.vv.gameNetMgr.isSync == false) {
            return;
        }
        // this.initBottomCards(0);
        if (cc.vv.gameNetMgr.gamestate === 'playing'){
            // this.initBottomCards(cc.vv.gameNetMgr._dipai);
            var seats = cc.vv.gameNetMgr.seats;
            
        }
        cc.find('Canvas/infobar/base_score').getComponent(cc.Label).string = cc.vv.gameNetMgr.difen;
        if (seats == null) {
            return;
        }
        var seats = cc.vv.gameNetMgr.seats;
        if (cc.vv.gameNetMgr.gamestate === 'ti') {
            for (let i = 0; i < cc.vv.gameNetMgr.seats.length; ++i) {
                if (seats[i].userid === cc.vv.userMgr.userId) {
                    this._butiBtn.active = seats[i].canti || seats[i].canfanti;
                    this._tiBtn.active = seats[i].canti;
                    this._fantiBtn.active = seats[i].canfanti;
                }
            }
        }
        console.log("baihua2001cn")
        console.log(seats);

    },

    initEventHandlers: function () {

        cc.vv.gameNetMgr.dataEventHandler = this.node;

        //初始化事件监听器
        var self = this;


        this.node.on('game_liang_selectOver', function (data) {
            console.log('game_liang_selectOver');
            self.initMahjongs();
            self._selectedPK = [];

        });


        this.node.on('refresh_bg', function (data) {
            self._bgMgr.setIndex(data.detail);
        });


        this.node.on('game_holds', function (data) {

            var _holds = cc.find("Canvas/game/pai/Holds");
            _holds.active = true;

            self.initMahjongs();
            
        });
        // this.node.on('game_dizhu_push', function (data) {
        //     console.log('meng game_dizhu_push', data);
        //     if (data.detail.jiaofen)
        //         cc.find('Canvas/infobar/base_score').getComponent(cc.Label).string = data.detail.jiaofen;
        // });
        this.node.on('game_dipai', function (data) {
            console.log('meng game_dipai', data.detail);
            // self.initBottomCards(data.detail);

        });
        this.node.on('game_num', function (data) {
            self.initClubFriend();
            self._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";
        });
        this.node.on('game_ti_push', function (data) {
            console.log('meng game_ti', data.detail);
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail.userId);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            console.log('353 meng', localindex);
            if (localindex === 0) {
                self.setTiBtn(true);
            }
        });
        this.node.on('game_ti_notify', function (data) {
            self.hideTiBtn(false);

            self.setDoubleBaseScore();

        });
        this.node.on('game_fanti_push', function (data) {
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            console.log('365 meng', localindex);
            if (localindex === 0) {
                self.setTiBtn(false);
            }
        });
        this.node.on('game_begin', function (data) {
            self.initBaoDanPalyer();
            self.initClubFriend();
            if (self._showIPEqual == false) {
                self.showIPEqual();
            }
            cc.vv._zhaNum = 0;
            cc.find('Canvas/infobar/times').getComponent(cc.Label).string = 1;
            self.onGameBeign();
            // self.initBottomCards(0);
        });

        this.node.on('game_sync', function (data) {
            self.onGameBeign();

        });
        
        this.node.on('game_chupai', function (data) {
            
            self.initCardTag();
            self.showGrapPK(false);
            
            self._hintPaiArr = [];
            self._hintIndex = 0;
            var data = data.detail;
            var gameData = data.gamedata;
            var userid = gameData.userid;
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(userid);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            var holds = [];
            var lastpai = [];
            if (localindex === 0) {
                var LastPai = cc.vv.gameNetMgr.chupai_PK_last;
                for (let i = 0; i < LastPai.length; ++i) {
                    lastpai.push(self.getRealCardList(LastPai[i]));
                }
                var seat = cc.vv.gameNetMgr.getSeatByID(userid);
                for (let i = 0; i < seat.holds.length; ++i) {
                    holds.push(self.getRealCardList(seat.holds[i]));
                }
                // if (cc.vv.gameNetMgr.chupai_PK_last[0] === 54) {
                //     self._hintPaiArr = cc.vv.pdkpkmgr.getActivetips(holds);
                // } else {
                    self._hintPaiArr = cc.vv.pdkpkmgr.getTipsCardsList(lastpai, holds);
                // }
                console.log(self._hintPaiArr);
                console.log(self._myPKArr);
                console.log(self._holdsnode);
                console.log(self._holdsSprite);
                var isHavelastpai = true;
                if(lastpai.length === 0||(lastpai.length === 1 && lastpai[0] ===0)){
                    isHavelastpai = false;
                }
                self.setPkMask(isHavelastpai);
                if(self._hintPaiArr.length === 0 && cc.vv.gameNetMgr.conf.ncbc){
                    setTimeout(function(){
                        cc.vv.net.send("guo");
                    },500);
                }

                self.initActiveGuoBtn();

            }
            
        });

       
        this.node.on('game_action', function (data) {
            var data = data.detail;
            //self.showAction(data);
        });

        this.node.on('game_wait', function (data) {
            var data = data.detail;
            self.playTip();
        });


        this.node.on('mj_count', function (data) {
            self._mjcount.node.active = true;
            self._mjcount.string = "剩余" + cc.vv.gameNetMgr.numOfMJ + "张";
        });

        this.node.on('game_num', function (data) {
            self._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";
        });

        this.node.on('game_over', function (data) {

            self.initCardTag();
            self.showGrapPK(false);

            self._hintPaiArr = [];
            self._hintIndex = 0;
            self.gameRoot.active = false;
            self.prepareRoot.active = true;
        });


        this.node.on('game_chupai_notify', function (data) {
            self.isXiaJiaBaoDan(data);
            self.initCardTag();
            self.showGrapPK(false);

            var pai = [];
            for (let i = 0; i < data.detail.pai.length; ++i) {
                pai.push(self.getRealCardList(data.detail.pai[i]));
            }
            if (cc.vv.pdkpkmgr.isBoom(pai)) {
                cc.vv._zhaNum++;
                self.setDoubleBaseScore();
            }
            self.playAni(pai);
            self.showChuPaiOn(data);
        });

        this.node.on('game_fanti_notify', function () {
            //if(cc.vv.PDKReplayMgr.isReplay()){
            self.setDoubleBaseScore();
            //}
        });
        this.node.on('guo_notify', function (data) {
            //self.hideChupai();
            //self.hideOptions();
            var seatData = data.detail;
            //如果是自己，则刷新手牌
            if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex && self._hasTuidao != true) {
                cc.log("---------------------初始化自己手牌initMahjongs")
                self.initMahjongs();
            }
            // cc.vv.audioMgr.playMJGameSFX("give.mp3");
        });

        this.node.on('game_over_reset', function (data) {
            self._hintPaiArr = [];
            self._hintIndex = 0;
            self.ClearSelect();
        });

        this.node.on('PKguo_result', function (data) {
            console.log("megn pkguo_result 430", data);
            self._hintPaiArr = [];
            self._hintIndex = 0;
            //self._selectedPK = [];
            self.initMahjongs();
            console.log(self._selectedPK)

            var timeAudio = 0.0001;
            // if (cc.vv.PDKReplayMgr.isReplay()) {
            //     timeAudio = 1000;
            // }
            setTimeout(function () {
                var audioUrl = cc.CGameConfigDataModel.getPKAudioURLByOther('b_pass1',data.userId);

                // var audioUrl = 'b_pass1.mp3';
                // var seatindex=self.getSeatIndexByID(data.userId);
                // cc.vv.gameNetMgr.setAudioSFX(seatindex, -1, "poker", audioUrl, "");
                cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            }, timeAudio);


        });


       //myself的hold的点击事件监听

       var fnTouchStart = function (event) {

        var isReturn = self.mjClickedReturn(event, true);
        if (isReturn == true) {
            return true;
        }

        self.holdClickedStart(event);

    };

    var fnTouchMove = function (event) {

        var isReturn = self.mjClickedReturn(event, false);
        if (isReturn == true) {
            return true;
        }

        self.holdClickedMove(event);


    };

    var fnTouchEnd = function (event) {

        var isReturn = self.mjClickedReturn(event, false);
        if (isReturn == true) {
            return true;
        }

        self.holdClickedEnd(event);

    };

    var fnTouchCancel = function (event) {

        var target = event.target;
        var isReturn = self.mjClickedReturn(event, false);
        if (isReturn == true) {
            return true;
        }

        self.holdClickedCancel(event);

    };


        var myholds = cc.find("Canvas/game/pai/Holds");
        myholds.on(cc.Node.EventType.TOUCH_START, fnTouchStart);
        myholds.on(cc.Node.EventType.TOUCH_END, fnTouchEnd);
        myholds.on(cc.Node.EventType.TOUCH_MOVE, fnTouchMove);
        myholds.on(cc.Node.EventType.TOUCH_CANCEL, fnTouchCancel);

    },


    holdClickedStart: function (event) {
        var target = event.target;

        this.ClearSelect();
        this.showGrapPK(true);

        this.startCardRectArray = this.getCardRectArray();

        var touches = event.getTouches();
        // var startPosition = target.parent.convertTouchToNodeSpaceAR(touches[0]);
        var startPosition = target.convertTouchToNodeSpaceAR(touches[0]);
        this.touchStartPos = startPosition;

        var touchX = startPosition.x * 0.8, touchY = startPosition.y*0.88, touchW = 0, touchH = 0;
        var touchRect = new cc.Rect(touchX, touchY, touchW, touchH);

        this.testMoveIntersectsRect(touchRect);
    },

    holdClickedMove: function (event) {
        var target = event.target;

        var touches = event.getTouches();
        // var movePosition = target.parent.convertTouchToNodeSpaceAR(touches[0]);
        var movePosition = target.convertTouchToNodeSpaceAR(touches[0]);

        var touchRect = this.getTouchRect(movePosition);//new cc.Rect(touchX , touchY, touchW, touchH);

        this.testMoveIntersectsRect(touchRect);
    },

    holdClickedEnd: function (event) {
        var target = event.target;

        var touches = event.getTouches();
        // var endPosition = target.parent.convertTouchToNodeSpaceAR(touches[0]);
        var endPosition = target.convertTouchToNodeSpaceAR(touches[0]);

        var touchRect = this.getTouchRect(endPosition); //new cc.Rect(touchX , touchY, touchW, touchH);

        this.testIntersectsRect(touchRect);

        this.showGrapPK(true);
        var lastpai = cc.vv.gameNetMgr.chupai_PK_last;
        var isHavelastpai = true;
        if(lastpai.length === 0||(lastpai.length === 1 && lastpai[0] ===0)){
            isHavelastpai = false;
        }
        this.setPkMask(isHavelastpai);
    },

    holdClickedCancel: function (event) {
        var target = event.target;

        this.initCardTag();
        this.showGrapPK(true);
    },

    getCardRectArray: function () {
        var cardRectArray = [];

        var myholds = cc.find("Canvas/game/pai/Holds");

        var maxActiveTrueIndex = -1;
        var cardCount = myholds.childrenCount;
        for (var i = 0; i < cardCount; i++) {
            var pkNode = myholds.children[i];

            if (pkNode.active == true) {
                maxActiveTrueIndex = i;
            }

            var cardW = pkNode.width * 0.8;
            var cardH = pkNode.height * 0.88;
            var cardX = pkNode.x * 0.8 - cardW * 0.5;
            var cardY = pkNode.y * 0.88 - cardH * 0.5;

            if (i == cardCount - 1) {
                cardW = pkNode.width * 0.8;
            } else {
                cardW = pkNode.width * 0.4;
            }

            var cardRect = new cc.Rect(cardX, cardY, cardW, cardH);
            cardRectArray.push(cardRect);
        };

        var pkNode0 = myholds.children[0];
        cardRectArray[maxActiveTrueIndex].width = pkNode0.width * 0.8;

        return cardRectArray;
    },

    getTouchRect: function (endTouchPos) {
        var touchX = 0, touchY = 0, touchW = 0, touchH = 0;
        if (endTouchPos.x - this.touchStartPos.x >= 0) {
            touchX = this.touchStartPos.x*0.8;
            touchY = this.touchStartPos.y*0.88;

            touchW = (endTouchPos.x - this.touchStartPos.x) * 0.8;

        } else {
            touchX = endTouchPos.x*0.8;
            touchY = endTouchPos.y*0.88;

            touchW = (this.touchStartPos.x - endTouchPos.x) * 0.8;
        }
        touchH = Math.abs(this.touchStartPos.y - endTouchPos.y) * 0.88;
        var touchRect = new cc.Rect(touchX, touchY, touchW, touchH);

        return touchRect;
    },

    testMoveIntersectsRect: function (touchRect) {

        var intersectsCardIndex = [];

        var localCradCount = this.startCardRectArray.length;
        for (var i = 0; i < localCradCount; i++) {
            var cardRect = this.startCardRectArray[i];
            if (cc.rectIntersectsRect(cardRect, touchRect)) {
                intersectsCardIndex.push(i);
            }
        };

        var intersectsCardCount = intersectsCardIndex.length;
        var myTestholds = cc.find("Canvas/game/pai/Holds");

        var holdCount = myTestholds.childrenCount;
        for (var i = 0; i < holdCount; i++) {
            var grayPk = myTestholds.children[i].getChildByName("grayPk");
            let cunzai = false;
            for(let j = 0;j < this._hintPaiArr.length;j++){
                let one = this._hintPaiArr[j];
                for(let k = 0;k < one.length;k++){
                    let valueA = this.getRealCardList(myTestholds.children[i].mjId);
                    if(valueA == one[k]){
                        cunzai = true;
                    }
                }
            }
            if(!cunzai)
            continue;
            if (grayPk.active == true) {
                grayPk.active = false;
            }
        };
        for (var j = 0; j < intersectsCardCount; j++) {
            var index = intersectsCardIndex[j];

            var grayPk = myTestholds.children[index].getChildByName("grayPk");

            let cunzai = false;
            for(let i = 0;i < this._hintPaiArr.length;i++){
                let one = this._hintPaiArr[i];
                for(let k = 0;k < one.length;k++){
                    // let valueA = cc.vv.controlMgr.getPKrealNum(myTestholds.children[index].mjId);
                    let valueA = this.getRealCardList(myTestholds.children[index].mjId);
                    if(valueA == one[k]){
                        cunzai = true;
                    }
                }
            }
            if(!cunzai){
                grayPk.active = true;
                continue;
            }
            if(grayPk.active == false){
                grayPk.active = true;
            }
        };

    },



    testIntersectsRect: function (touchRect) {

        var intersectsCardIndex = [];

        var cardRectArray = this.getCardRectArray();

        var localCradCount = cardRectArray.length;
        for (var i = 0; i < localCradCount; i++) {
            var cardRect = cardRectArray[i];
            if (cc.rectIntersectsRect(cardRect, touchRect)) {
                intersectsCardIndex.push(i);
            }
        };

        var intersectsCardCount = intersectsCardIndex.length;
        var myholds = cc.find("Canvas/game/pai/Holds");
        for (var j = 0; j < intersectsCardCount; j++) {
            var index = intersectsCardIndex[j];

            if (myholds.children[index].active == false) {
                myholds.children[index].y = 0;
                myholds.children[index].tag = 0;
                continue;
            }
            let cunzai = false;
            for(let i = 0;i < this._hintPaiArr.length;i++){
                let one = this._hintPaiArr[i];
                for(let j = 0;j < one.length;j++){
                    let valueA = this.getRealCardList(myholds.children[index].mjId);
                    if(valueA == one[j]){
                        cunzai = true;
                    }
                }
            }
            if(!cunzai)
            continue;
            if (myholds.children[index].tag == 0) {
                myholds.children[index].y = 30;
                myholds.children[index].tag = 1;
            } else if (myholds.children[index].tag == 1) {
                myholds.children[index].y = 0;
                myholds.children[index].tag = 0;
            }
        };

        var myholdsCount = myholds.childrenCount;
        for (var k = 0; k < myholdsCount; k++) {
            if (myholds.children[k].active == true && myholds.children[k].tag == 1) {
                this._selectedPK.push(myholds.children[k]);
            }
        };

    },

    initCardTag: function () {

        this.ClearSelect();

        var myholds = cc.find("Canvas/game/pai/Holds");
        var myholdsCount = myholds.childrenCount;
        for (var k = 0; k < myholdsCount; k++) {
            myholds.children[k].y = 0;
            myholds.children[k].tag = 0;
        };
    },

    showGrapPK: function (isShow) {
        if(isShow){
            var myTestholds = cc.find("Canvas/game/pai/Holds");

            var cardCount = myTestholds.childrenCount;
            for (var i = 0; i < cardCount; i++) {
                var grayPk = myTestholds.children[i].getChildByName("grayPk");
                let cunzai = false;
                for(let j = 0;j < this._hintPaiArr.length;j++){
                    let one = this._hintPaiArr[j];
                    for(let k = 0;k < one.length;k++){
                        let valueA = this.getRealCardList(myTestholds.children[i].mjId);
                        if(valueA == one[k]){
                            cunzai = true;
                        }
                    }
                }
                if(!cunzai)
                continue;
                grayPk.active = false;
            }
        }else{
            var myTestholds = cc.find("Canvas/game/pai/Holds");

            var cardCount = myTestholds.childrenCount;
            for (var i = 0; i < cardCount; i++) {
                var grayPk = myTestholds.children[i].getChildByName("grayPk");
                grayPk.active = isShow;
            }
        }
    },


    initPKps: function () {
        console.log("baihua2001cn  start")
        console.log(this._StartTouchX)
        console.log(this._EndTouchX);
        var PKLength = this._myPKArr.length;
        for (var i = 0; i < PKLength; ++i) {
            var tmpNode = this._myPKArr[i].node;
            var tmpWordPoint = tmpNode.convertToWorldSpace(tmpNode.x, tmpNode.y);
            if (tmpWordPoint.x > this._StartTouchX && tmpWordPoint.x - 35 < this._EndTouchX) {
                console.log("meng starttouchx");
                if (this._selectedPK.indexOf(tmpNode) === -1) {
                    this._selectedPK.push(tmpNode)
                }
            }
        }

        console.log(this._selectedPK)
        this.checkPK();
    },
    checkPK: function () {
        console.log("this>_selectedPK", this._selectedPK);
        if (this._selectedPK.length === 0) {
            this.ClearSelect();
            return;
        }
        var tmpID = []
        for (let i = 0; i < this._selectedPK.length; i++) {
            if (this._selectedPK[i].mjId === null) {
                this._selectedPK.splice(i, 1);
            } else {
                tmpID.push(this.getRealCardList(this._selectedPK[i].mjId));
            }
        }
        console.log(cc.vv.pdkpkmgr.isLegality(tmpID));
        if (cc.vv.pdkpkmgr.isLegality(tmpID)) {
            console.log("meng islegality");
            for (let i = 0; i < this._selectedPK.length; i++) {
                this._selectedPK[i].y = 15;
            }
        } else {
            console.log("meng isnotlegality");
            for (let i = 0; i < this._selectedPK.length; i++) {
                this._selectedPK[i].y = 0;
            }
            this.ClearSelect();
        }

    },

    ClearSelect: function () {
        this._selectedPK = [];
    },

    showChuPaiOn: function (data) {



        //this.hideChupai();
        this.ClearSelect();
        var seatData = data.detail.seatData;

        //如果是自己，则刷新手牌
        if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
            this._mahjongShooted = true;

            this.initMahjongs();
        }

        var timeAudio = 0.0001;
        // if (cc.vv.PDKReplayMgr.isReplay()) {
        //     timeAudio = 1000;
        // }

        setTimeout(function () {
            if (data.detail.pai)
                var audioUrl = cc.vv.controlMgr.getAudioURLByMJID(data.detail.pai,seatData.userid);
            //cc.vv.gameNetMgr.setAudioSFX(seatData.seatindex, -1, "poker", audioUrl, "");
            cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
        }, timeAudio)
 

        var holdsNum = data.detail.holdsNum;
        if (holdsNum === 0) {
            var timeAudio = 800;

            setTimeout(function () {
                var audioUrl = cc.CGameConfigDataModel.getPKAudioURLByOther('go', data.userId);
                cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            }, timeAudio)
        }


    },


    mjClickedReturn: function (event, isStart) {
        var target = event.target;

        if (cc.vv.PDKReplayMgr.isReplay() == true) {
            console.log("this is replay.");
            return true;
        }

        if (cc.vv.gameNetMgr.gamestate == "liang") {
            if (cc.vv.gameNetMgr.isLiang == false) {
                console.log("not your turn.Liang");
                return true;
            } else return false;

        } else {
            //如果不是自己的轮子，则忽略
            if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
                console.log("not your turn." + cc.vv.gameNetMgr.turn);
                return true;
            }
        }

        // if (this._mahjongShooted == true) {
        //     console.log("you are shot, it is not your turn.");
        //     return true;
        // }
        return false;
    },
    myselfPKClickedStart: function (event) {
        var target = event.target;
        target.moved = false;
        target.ended = false;
        var PKLength = this._myPKArr.length;
        for (var i = 0; i < PKLength; ++i) {
            if ((this._myPKArr[i].node.x != this._myPKPosX[i] || this._myPKArr[i].node.y != 0) && this._selectedPK == null) {
                console.log("baihua2001cn  start")
                console.log(this._selectedPK);
                var tmpselectedPK = this._myPKArr[i].node;
                tmpselectedPK.x = this._myMJPosX[i];
                tmpselectedPK.y = 15;
                console.log("baihua2001cn  end")
                this._selectedPK.push(tmpselectedPK)
                break;
            }
        }

        for (var i = 0; i < PKLength; ++i) {
            if (event.target == this._myPKArr[i].node) {
                //如果是再次点击，则取消选择

                for (let i = 0; i < this._selectedPK.length; i++) {
                    if (event.target === this._selectedPK[i]) {
                        this._selectedPK[i].y = 0;
                        this._selectedPK.splice(i, 1);
                        return;
                    }
                }

                target.x = this._myPKPosX[i];
                target.y = 0;

                target.oldx = target.x;
                target.oldy = target.y;

                // event.target.y = 15;
                this._selectedPK.push(event.target);
                return;
            }
        }
    },

    myselfPKClickedMoved: function (event) {
        var target = event.target;

        if (this._isMoved) {

        }
        var touches = event.getTouches();
        console.log("baihua2001cn  start");
        console.log(target.touches);
        var position = target.parent.convertTouchToNodeSpaceAR(touches[0]);
        var s = target.getContentSize();
        var rect = cc.rect(target.oldx - s.width / 2, target.oldy - s.height / 2, s.width, s.height);

        if (target.moved === false) {
            //target.setPosition(position);
            target.y = 15;

        }

        //target.moved = true;
        // if (!cc.rectContainsPoint(rect, position)) {
        //     target.moved = true;
        // }

    },

    myselfPKClickedEnded: function (event) {

        var target = event.target;
        target.ended = true;
        var targetWordPoint = target.convertToWorldSpace(target.x, target.y);

        if (this._EndTouchX > targetWordPoint.x) {

            this.initPKps()
            return
        }


        if (this._selectedPK !== null) {

            if (this._selectedPK.indexOf(target) !== -1) {
                var touches = event.getTouches();
                var position = target.parent.convertTouchToNodeSpaceAR(touches[0]);
                var s = target.getContentSize();
                var rect = cc.rect(target.oldx - s.width / 2, target.oldy - s.height / 2, s.width, s.height);

                if (cc.rectContainsPoint(rect, position)) {
                    if (target.moved == true) {
                        target.x = target.oldx;
                        target.y = target.oldy;
                        // this.initMahjongsPos();
                    } else {
                        console.log("meng target.moved");
                        target.x = target.oldx;
                        target.y = target.oldy + 15;
                    }
                } else {
                    console.log("meng target.moved");
                    for (let ii = 0; ii < this._selectedPK.length; ii++) {
                        if (this._selectedPK[ii] === target) {
                            this._selectedPK.x = target.oldx;
                            this._selectedPK.y = 0;
                            this._selectedPK.splice(ii, 1);
                            return;
                        }

                    }
                }
            }
        }
        console.log("baihua2001cn  start")
        console.log(this._selectedPK)
        this.checkPK()
        if (cc.vv.gameNetMgr.isLiang) {
            var data = this._selectedPK
            cc.vv.gameNetMgr.dispatchEvent('game_liang_select', data);
        }
    },


    onPKClicked: function (event) {
        return true;
    },

    isXiaJiaBaoDan: function(data){
        var data = data.detail;
        var chupaiPalyerId = data.seatData.userid;
        var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(chupaiPalyerId);
        var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
        if(localindex === 1){
            if(data.num === 1){  //下家报单
                this._xiajiabaodan = true;
            }else
            this._xiajiabaodan = false;
        }
        

    },

  



    //出牌
    shoot: function () {
        var myjdArr = [];
        var lastpai = [];
        var myjdarr = [];
        for (let i = 0; i < this._selectedPK.length; i++) {
            var mjid = this._selectedPK[i].mjId;
            console.log(mjid);
            myjdArr.push(mjid);
        }
        if (myjdArr == null) {
            return;
        }
        var LastPai = cc.vv.gameNetMgr.chupai_PK_last;
        for (let i = 0; i < LastPai.length; ++i) {
            lastpai.push(this.getRealCardList(LastPai[i]));
        }
        for (let i = 0; i < myjdArr.length; ++i) {
            myjdarr.push(this.getRealCardList(myjdArr[i]));
        }
        if(!cc.vv.pdkpkmgr.getCardsValue(myjdarr)){
            //cc.vv.alert.show("该类型不存在,请重新选择");
            this._hint.getChildByName('label').getComponent(cc.Label).string = '该类型不存在,请重新选择!';
            this._hint.active = true;
            setTimeout(function () {
                
                this._hint.active = false;
            }.bind(this), 1000)
            return;
        }
        if (cc.vv.pdkpkmgr.compare(lastpai, myjdarr) === false) {
            cc.log("error: LastPai > SelectPai");
            //cc.vv.alert.show("没有上家大，请重新选择或者不出");
            this._hint.getChildByName('label').getComponent(cc.Label).string = '没有上家大，请重新选择或者不出!';
            this._hint.active = true;
            setTimeout(function () {
                this._hint.active = false;
            }.bind(this), 1000)
            return;
        }

        cc.log("cc.vv.net.send('chupai',mjId)", myjdArr)
       var isLegality= this.myjdArrisLegality(myjdarr);
        if(typeof isLegality === "boolean"){
            cc.vv.net.send('chupai', myjdArr);
        }else{
            if(isLegality[1]){
                //cc.vv.alert.show(isLegality[1]);
                this._hint.getChildByName('label').getComponent(cc.Label).string = isLegality[1];
                this._hint.active = true;
                setTimeout(function () {
                    this._hint.active = false;
                }.bind(this), 1000)
            }
        }
    },

    getDoubleBossFormHolds: function () {
        var turn = cc.vv.gameNetMgr.turn;
        var seats = cc.vv.gameNetMgr.seats;
        var returnArr = []
        if (cc.vv.gameNetMgr.getLocalIndex(turn) === 0) {
            var myHolds = seats[turn].holds;
        }
        for (let i = 0; i < myHolds.length - 1; i++) {
            if (myHolds[i] === 52 && myHolds[i + 1] === 53) {
                returnArr.push(myHolds[i]);
                returnArr.push(myHolds[i + 1])
                break;
            }
        }
        return returnArr
    },

    getPKarrFormHolds: function (realPai, nums) {
        var turn = cc.vv.gameNetMgr.turn;
        var seats = cc.vv.gameNetMgr.seats;
        var returnArr = []
        if (cc.vv.gameNetMgr.getLocalIndex(turn) === 0) {
            var myHolds = seats[turn].holds;
        }
        var tmpRealPaiArr = [];
        for (let k in myHolds) {
            var kRealpai = cc.vv.controlMgr.getPKrealNum(myHolds[k]);
            if (kRealpai < 5 || kRealpai > 51) {
                kRealpai = kRealpai * 100
            }
            tmpRealPaiArr.push(kRealpai)
        }


        if (realPai < 5 || realPai > 51) {
            realPai = realPai * 100
        }


        if (nums === 1) {
            for (let i = 0; i < tmpRealPaiArr.length; i++) {
                var tmpRealPai = tmpRealPaiArr[i];
                if (tmpRealPai > realPai) {
                    returnArr.push(myHolds[i]);
                    break;
                }
            }

            if (returnArr.length === 0) {
                returnArr = this.getPKarrFormHolds(0, 3)
            } else if (returnArr.length === 0) {
                returnArr = this.getPKarrFormHolds(0, 4)
            } else if (returnArr.length === 0) {
                returnArr = this.getDoubleBossFormHolds();
            }


        }
        if (nums === 2) {
            for (let i = 0; i < tmpRealPaiArr.length - 1; i++) {

                if (tmpRealPaiArr[i] === tmpRealPaiArr[i + 1]) {
                    if (tmpRealPaiArr[i] > realPai) {

                        returnArr.push(myHolds[i]);
                        returnArr.push(myHolds[i + 1])
                        break;
                    }
                }
            }

            if (returnArr.length === 0) {
                returnArr = this.getPKarrFormHolds(0, 3)
            } else if (returnArr.length === 0) {
                returnArr = this.getPKarrFormHolds(0, 4)
            } else if (returnArr.length === 0) {
                returnArr = this.getDoubleBossFormHolds();
            }

        }

        if (nums === 3) {
            for (let i = 0; i < tmpRealPaiArr.length - 2; i++) {

                if (tmpRealPaiArr[i] === tmpRealPaiArr[i + 1] && tmpRealPaiArr[i] === tmpRealPaiArr[i + 2]) {
                    if (tmpRealPaiArr[i] > realPai) {

                        returnArr.push(myHolds[i]);
                        returnArr.push(myHolds[i + 1])
                        returnArr.push(myHolds[i + 2])
                        break;
                    }
                }
            }

            if (returnArr.length === 0) {
                returnArr = this.getPKarrFormHolds(0, 4)
            } else if (returnArr.length === 0) {
                returnArr = this.getDoubleBossFormHolds();
            }
        }

        if (nums === 4) {
            for (let i = 0; i < tmpRealPaiArr.length - 3; i++) {

                if (tmpRealPaiArr[i] === tmpRealPaiArr[i + 1] && tmpRealPaiArr[i] === tmpRealPaiArr[i + 2] && tmpRealPaiArr[i] === tmpRealPaiArr[i + 3]) {
                    if (tmpRealPaiArr[i] > realPai) {

                        returnArr.push(myHolds[i]);
                        returnArr.push(myHolds[i + 1])
                        returnArr.push(myHolds[i + 2])
                        returnArr.push(myHolds[i + 3])
                        break;
                    }
                }
            }
            if (returnArr.length === 0) {
                returnArr = this.getDoubleBossFormHolds();
            }
        }

        return returnArr;
    },

    getRealCardList: function (card) {
        let realnum = cc.vv.PKlogic.getPKrealNum(card);
        if (realnum === 1 || realnum === 2) {
            realnum = realnum * 10 + 4;
        }
        return realnum;
    },
    AutoTiShi: function (lastpaiArr) {
        if (lastpaiArr === null) {
            return []
        }
        var realPai = cc.vv.controlMgr.getPKrealNum(lastpaiArr[0])
        switch (lastpaiArr.length) {
            case 1:
                return this.getPKarrFormHolds(realPai, 1)
                break;
            case 2:
                if (cc.vv.controlMgr.isShuangWang(lastpaiArr)) {
                    return [];
                } else {
                    return this.getPKarrFormHolds(realPai, 2)

                }

                break;

            case 3:
                return this.getPKarrFormHolds(realPai, 3)
                break;
            case 4:
                return this.getPKarrFormHolds(realPai, 4)
                break;
            default:
                return [];
                break;
        }
    },
    onTiShiBtnClick: function (event) {
        // var tmpNode = event.target;
        // var sequence = cc.sequence(cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.1, 1, 1))
        var map = {};
        // tmpNode.parent.runAction(sequence);
        console.log("meng this._hintPaiArr", this._hintPaiArr);
        // fdfff
        if (this._hintPaiArr.length === 0) {
            //不允许自动给过  提示一个没有牌大过上家的

             //cc.vv.alert.show("该类型不存在,请重新选择");
            this._hint.getChildByName('label').getComponent(cc.Label).string = '没有牌大过上家!';
            this._hint.active = true;
            setTimeout(function () {

                this._hint.active = false;
            }.bind(this), 1000)
           

            // if (cc.vv.alert) {
            //     var alertContent = "没有牌大过上家";
            //     cc.vv.alert.show(alertContent);
            // }
            // this.onGuoBtnClick(event);
        } else {
            var hintPaiIDArr = this._hintPaiArr[this._hintIndex];
            this._hintIndex = this._hintIndex + 1;
            if (this._hintIndex >= this._hintPaiArr.length) {
                this._hintIndex = 0;
            }
            for (let k in hintPaiIDArr) {
                map[k] = false;
            }
            this.ClearSelect();
            for (let i = 0; i < this._myPKArr.length; i++) {
                var tmpNode = this._myPKArr[i].node;
                console.log('1069', tmpNode.mjId);
                if (tmpNode.mjId || tmpNode.mjId === 0)
                    var pkid = this.getRealCardList(tmpNode.mjId);

                tmpNode.tag = 0;
                tmpNode.y = 0;


                for (let k in hintPaiIDArr) {
                    console.log('1073', map[k]);
                    if (pkid === hintPaiIDArr[k] && map[k] === false) {
                        console.log('10453');
			
                        tmpNode.tag = 1;
                        tmpNode.y = 30;

                        // tmpNode.y = 15;
                        console.log("meng 963tmpnode", tmpNode.y, tmpNode.mjId, tmpNode);
                        this._selectedPK.push(tmpNode);
                        map[k] = true;


                        break;
                    }
                }
            }
        }
    

        console.log('baihua2001cn +++++++++++++++++++++++')
        console.log(this._selectedPK)
    },
    onReadyBtnClick: function (event) {
        this.layerRoot.getChildByName("game_result").active = false;
        if (event.target.name == "btnReady") {
            this.gameRoot.getChildByName("arrow").active = false;
            var seats = cc.vv.gameNetMgr.seats;
            //清理掉其他人的牌数据
            for(var i = 0;i<seats.length;i++){
                var seat = seats[i];
                if(seat.userid == cc.vv.userMgr.userId){
                    continue;
                }else{
                    var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(seat.userid);
                    var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
                    if (localIndex !== 0) {
                        cc.vv.PDKFolds.initOtherFolds(localIndex-1);
                    }
                }
            }
            cc.vv.PDKFolds.hideAllFolds();
            for (let i = 0; i < this._myPKArr.length; ++i) {
                this.hideHoldMahjong(i);
            }
            if (this._bottomCards.length !== 0) {
                this._bottomCards.splice(0, this._bottomCards.length);
            }
        }
        this.gameRoot.active = true;
        cc.vv.net.send('ready');
        this._readyBtn.active = false;
        cc.vv.gameNetMgr.dispatchEvent('game_over_reset');
        console.log('baihua2001cn ++++++++++++onReadyBtnClick+++++++++++')

    },

    onReadyBtnTest: function () {
        var nseat = 3;
        var arr = [1, 8];
        cc.vv.PKlogic.nseat = nseat;
        cc.vv.PKlogic.getPaiWeight(arr);
    },


    onFireBtnClick: function (event) {
        // var tmpNode = event.target;
        // var sequence = cc.sequence(cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.1, 1, 1))
        // tmpNode.parent.runAction(sequence);
        this.shoot();
    },
    onGuoBtnClick: function (event) {
        if (event !== undefined) {
            // var tmpNode = event.target;
            // var sequence = cc.sequence(cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.1, 1, 1));
            // tmpNode.parent.runAction(sequence);
           
            cc.vv.net.send("guo", this.send_action_tags);
            // setTimeout(function () {
            //     var audioUrl = 'nv/b_pass3.mp3';
            //     cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            // }, 300)
        }
    },

    showIPEqual: function () {
        var seats = cc.vv.gameNetMgr.seats;

        for (var i = 0; i < seats.length; i++) {
            if (((typeof seats[i].ip) == "undefined") || (seats[i].ip == null)) {
                return;
            }
        }
        ;

        this.showIPArray = [];

        this.getEqualIP(seats);

        if (this.showIPArray.length == 0) {
            this._showIPEqual = true;
            return;
        }

        var tipIPString = this.showIPArray.join("\n");

        var self = this;
        var sureShowIP = function () {
            self._showIPEqual = true;
        }
        cc.vv.alert.show(tipIPString, sureShowIP);
    },

    getEqualIP: function (seats) {
        var seat_num = seats.length;
        var nameString = "";
        var ipString = "";
        var isbreak = false;
        var isEqualed = false;

        var notEqualSeats = [];

        for (var i = 0; i < seat_num - 1; i++) {
            var seatA = seats[i];
            notEqualSeats = [];
            for (var j = i + 1; j < seat_num; j++) {
                var seatB = seats[j];
                if (seatA.ip == seatB.ip) {

                    if (isEqualed == false) {
                        nameString = nameString + (seatA.name).toString() + "，" + (seatB.name).toString();
                        ipString = seatA.ip.replace("::ffff:", "");
                        isEqualed = true;
                    } else {
                        nameString += "，";
                        nameString += (seatB.name).toString();
                    }
                } else {
                    notEqualSeats.push(seatB);
                }

                if (isEqualed == true && j == seat_num - 1) {
                    isbreak = true;
                    break;
                }

            }
            ;

            if (isbreak == true) {
                break;
            }
        }
        ;

        if (nameString == "" || ipString == "") {
            return;
        }

        var tipString = nameString + "的IP相同" + "\n" + "IP：" + ipString;

        this.showIPArray.push(tipString);

        if (isEqualed = true && notEqualSeats.length > 1) {
            this.getEqualIP(notEqualSeats);
        }
    },
    setDoubleBaseScore: function () {
        var basescore = cc.find('Canvas/infobar/times').getComponent(cc.Label);
        var basecore = parseInt(basescore.string);
        basescore.string = basecore * 2;
    },
    start: function () {
        var mySeat = cc.vv.gameNetMgr.getSeatByID(cc.vv.gameNetMgr.getMySeatUserId());
        var LastPai = cc.vv.gameNetMgr.chupai_PK_last;
        var myholds = [];
        var lastpai = [];
        this._hintIndex = 0;
        if (LastPai !== undefined) {
            if (mySeat.holds !== undefined) {
                for (let i = 0; i < mySeat.holds.length; ++i) {
                    myholds.push(this.getRealCardList(mySeat.holds[i]));
                }
                for (let i = 0; i < LastPai.length; ++i) {
                    lastpai.push(this.getRealCardList(LastPai[i]));
                }
                // if (cc.vv.gameNetMgr.chupai_PK_last[0] === 54) {
                //     this._hintPaiArr = cc.vv.pdkpkmgr.getActivetips(myholds);
                // }
                if(cc.vv.gameNetMgr.turn == cc.vv.gameNetMgr.seatIndex && cc.vv.gameNetMgr.chupai_PK_last != cc.vv.gameNetMgr.seatIndex){
                    this._hintPaiArr = cc.vv.pdkpkmgr.getTipsCardsList(lastpai, myholds);
                    var LastPai = cc.vv.gameNetMgr.chupai_PK_last;
                    var isHavelastpai = true;
                    if(lastpai.length === 0||(lastpai.length === 1 && lastpai[0] ===0)){
                        isHavelastpai = false;
                    }
                    this.setPkMask(isHavelastpai);
                    if(this._hintPaiArr.length === 0 && cc.vv.gameNetMgr.conf.ncbc){
                        setTimeout(function(){
                            cc.vv.net.send("guo");
                        },500);
                    }
                }

            }

        }   
        
        if (this._showIPEqual == false) {
            this.showIPEqual();
        }


        var mySeat = cc.vv.gameNetMgr.getSeatByID(cc.vv.gameNetMgr.getMySeatUserId());
        if (mySeat.ready === false) this._readyBtn.active = true;

        if(cc.vv.gameNetMgr.gamestate !== "liang"){
            cc.vv.gameNetMgr.dispatchEvent("game_finished");
        }
        this.initActiveGuoBtn();
        

    },
    /**********动画********/
    play_feiji: function () {
        var ani_feiji = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/ChuPai/ani_feiji");
        var tmp_feiji = cc.instantiate(ani_feiji);
        this.gameRoot.addChild(tmp_feiji);
        for (let i = 0; i < tmp_feiji.childrenCount; i++) {
            var tmp_ani = tmp_feiji.children[i].getComponent(cc.Animation);
            if (tmp_ani) {
                tmp_ani.play()
            }
        }

        tmp_feiji.x = -900;

        var tmpAction = cc.moveTo(1.5, 1200, 0);
        tmp_feiji.runAction(tmpAction)

        // setTimeout(function () {
        //     var audioUrl = 'FaPai_voice/Special_card_type/airplane_beiguan.mp3';
        //     cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
        // }, 300)

        setTimeout(function () {
            tmp_feiji.destroy();
        }.bind(this), 2000);

    },

    play_roket: function () {
        var ani_roket = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/ChuPai/ani_roket");
        var tmp_roket = cc.instantiate(ani_roket);
        this.gameRoot.addChild(tmp_roket);
        var self = this;
        for (let i = 0; i < tmp_roket.childrenCount; i++) {
            var tmp_ani = tmp_roket.children[i].getComponent(cc.Animation);
            if (tmp_ani) {
                tmp_ani.play()
            }
            if (i === 3) {
                tmp_ani.on('finished', function () {
                    setTimeout(function () {
                        tmp_roket.destroy();
                    }.bind(self), 1000);
                })

            }
        }
        // setTimeout(function () {
        //     var audioUrl = 'FaPai_voice/Special_card_type/rocket.mp3';
        //     cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
        // }, 300)

    },

    play_shunzi: function () {

        var ani_shunzi = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/ChuPai/ani_shunzi");
        var tmp_shunzi = cc.instantiate(ani_shunzi);
        this.gameRoot.addChild(tmp_shunzi);
        var self = this;
        for (let i = 0; i < tmp_shunzi.childrenCount; i++) {
            var tmp_ani = tmp_shunzi.children[i].getComponent(cc.Animation);
            if (tmp_ani) {
                tmp_ani.play()
            }

            if (i === 0) {
                tmp_ani.on('finished', function () {
                    setTimeout(function () {
                        tmp_shunzi.destroy();
                    }.bind(self), 500);
                })
            }
        }

        // setTimeout(function () {
        //     var audioUrl = 'FaPai_voice/Special_card_type/shunzi.mp3';
        //     cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
        // }, 300)

    },

    play_liandui: function () {

        var ani_shunzi = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/ChuPai/ani_liandui");
        var tmp_shunzi = cc.instantiate(ani_shunzi);
        this.gameRoot.addChild(tmp_shunzi);
        var self = this;
        for (let i = 0; i < tmp_shunzi.childrenCount; i++) {
            var tmp_ani = tmp_shunzi.children[i].getComponent(cc.Animation);
            if (tmp_ani) {
                tmp_ani.play()
            }

            if (i === 0) {
                tmp_ani.on('finished', function () {
                    setTimeout(function () {
                        tmp_shunzi.destroy();
                    }.bind(this), 500);
                })
            }
        }
        // setTimeout(function () {
        //     var audioUrl = 'FaPai_voice/Special_card_type/shunzi.mp3';
        //     cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
        // }, 300)

    },


    play_chuntian: function (ischuntian) {
        console.log('1344', ischuntian);
        var ani_shunzi = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/JieSuan/ani_chuntian");
        var tmp_shunzi = cc.instantiate(ani_shunzi);
        if (ischuntian) {
            tmp_shunzi.rotation = 0;
        } else {
            tmp_shunzi.rotation = 180;
        }
        this.layerRoot.addChild(tmp_shunzi);
        var tmp_ani = tmp_shunzi.getComponent(cc.Animation);
        var self = this;

        tmp_ani.on('finished', function () {
            setTimeout(function () {
                tmp_shunzi.destroy();
                self.layerRoot.getChildByName('game_result').active = true;
            }.bind(self),10);
        })

        tmp_ani.play()

    },

    play_shibai: function () {
        var ani_shunzi = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/JieSuan/ani_shibai");
        var tmp_shunzi = cc.instantiate(ani_shunzi);
        this.gameRoot.addChild(tmp_shunzi);
        var tmp_ani = tmp_shunzi.children[0].getComponent(cc.Animation);
        var self = this;

        tmp_ani.on('finished', function () {
            setTimeout(function () {
                tmp_shunzi.destroy();
            }.bind(self), 10);
        })
        tmp_ani.play()
    },

    play_shengli: function () {

        var ani_shunzi = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/JieSuan/ani_shengli");
        var tmp_shunzi = cc.instantiate(ani_shunzi);
        this.gameRoot.addChild(tmp_shunzi);
        var tmp_ani = tmp_shunzi.children[0].getComponent(cc.Animation);
        var self = this;

        tmp_ani.on('finished', function () {
            setTimeout(function () {
                tmp_shunzi.destroy();
            }.bind(self), 10);
        })

        tmp_ani.play()

    },


    play_bomb: function (pos) {
        var ani_shunzi = cc.vv.prefabMgr.getPrefab("prefabs/Games/PKGame/Ani/ChuPai/ani_bomb");
        var tmp_shunzi = cc.instantiate(ani_shunzi);
        this.gameRoot.addChild(tmp_shunzi);
        var tmp_ani = tmp_shunzi.getComponent(cc.Animation);
        var self = this;
        tmp_ani.on('finished', function () {
            setTimeout(function () {
                tmp_shunzi.destroy();
            }.bind(self), 10);
        })

        tmp_shunzi.x = pos.x
        tmp_shunzi.y = pos.y
        var tmp_action = cc.moveTo(0.1, 0, 0);

        tmp_shunzi.runAction(cc.sequence(tmp_action, cc.callFunc(function () {
            console.log(self)
            var tmpnode = self.gameRoot.getChildByName('ani_bomb');
            tmpnode.getComponent(cc.Animation).play();
        })))
        // setTimeout(function () {
        //     var audioUrl = 'FaPai_voice/Special_card_type/bomb.mp3';
        //     cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
        // }, 300)

    },
    playAni: function (cardList) {
        var ddz = cc.vv.pdkpkmgr;
        if (ddz.isPlane(cardList) || ddz.isPlaneWithOne(cardList) || ddz.isPlaneWithTwo(cardList)) {
            this.play_feiji();
        }
        if (ddz.isKingBoom(cardList)) {
            this.play_roket();
        }
        if (ddz.isDoubleScroll(cardList)) {
            this.play_liandui();
        }
        if (ddz.isScroll(cardList)) {
            this.play_shunzi();
        }
        if (ddz.isFourBoom(cardList)) {
            let pos = new cc.Vec2(this.node.x, this.node.y);
            this.play_bomb(pos);
        }
    },
    runCardsAction: function (node, pos) {
        let moveAction = cc.moveTo(0.5, pos);
        let scaleAction = cc.scaleTo(0.5, 0.4);
        node.runAction(scaleAction);
        node.runAction(cc.sequence(moveAction, cc.callFunc(() => {
            // node.destroy();
        })));
    },
    setTiBtn: function (ishow) {

        this._tiBtn.active = ishow;
        this._fantiBtn.active = !ishow;
        this._butiBtn.active = true;
    },
    hideTiBtn: function (ishow) {
        this._tiBtn.active = ishow;
        this._fantiBtn.active = ishow;
        this._butiBtn.active = ishow;
    },
    btnTiClick: function () {
        cc.vv.net.send('ti');
        this.hideTiBtn(false);
    },
    btnFanTiClick: function () {
        cc.vv.net.send('fanti');
        this.hideTiBtn(false);
    },
    btnBuTiClick: function () {
        cc.vv.net.send('buti');
        this.hideTiBtn(false);
    },

    /*******************************************
    *** MODEL BEGIN (注释状态) ***
    *** 重写俱乐部 ***
    *******************************************/

    initClubFriend: function () {

        var btnClubFriend = this.btnNodes.getChildByName("btnClubFriend");
        var isIdle = (cc.vv.gameNetMgr.numOfGames == 0) ? true : false;
        if (cc.vv.gameNetMgr.conf.clubid && cc.vv.gameNetMgr.conf.clubid > 0 && isIdle == true) {
            btnClubFriend.active = true;
        } else {
            btnClubFriend.active = false;
        }


        if(cc.vv.PDKReplayMgr.isReplay()){
            btnClubFriend.active = false;
            var btnRefresh = this.btnNodes.getChildByName("btnRefresh");
            btnRefresh.active = false;
        };
    },

    onClubFriendClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        var invateView = cc.instantiate(this.invatePrefab);
        this.layerRoot.addChild(invateView);
    },

    //没在this._hintPaiArr中的pk设置不可点击并置灰
    setPkMask:function(isHavelastpai){
        if(!isHavelastpai){
            return;
        }
       
        if(this._hintPaiArr.length === 0){
            for(let i = 0;i <this._holdsSprite.length;i++ ){
                var pkSprite = this._holdsSprite[i].node;
                var  grayPk = pkSprite.getChildByName("grayPk");
                grayPk.active = true;
            }
        }else{
            var PaiArrValue = [];
            for(let i= 0;i<this._hintPaiArr.length;i ++){
                for(let n=0;n <this._hintPaiArr[i].length;n++){
                    // if( !PaiArrValue.hasOwnProperty(this._hintPaiArr[i][n])){
                    if( !this.isTableHasValue(PaiArrValue,this._hintPaiArr[i][n])){
                        PaiArrValue.push(this._hintPaiArr[i][n]);
                    }
                }
            }
            PaiArrValue.sort(function(a,b) {
                return a < b; 
            });

            for(let i = 0;i <this._holdsSprite.length;i++ ){
                var pkSprite = this._holdsSprite[i].node;
                    var pdIndex = this.getRealCardList(pkSprite.mjId);
                    console.log(PaiArrValue.hasOwnProperty(pdIndex));
                    if(!this.exchHasNum(PaiArrValue,pdIndex)){
                        var  grayPk = pkSprite.getChildByName("grayPk");
                        grayPk.active = true;
                    }
                
            }
        }
       
    },

    exchHasNum:function(PaiArrValue,num){
        for(let i= 0;i<PaiArrValue.length;i ++){
            if(num === PaiArrValue[i]){
                return true;
            }
        }
        return false;
    },

    isTableHasValue: function(PaiArrValue,value){
        var tableLength = PaiArrValue.length;
        for(var i = 0 ; i < tableLength;i ++){
            if(value === PaiArrValue[i]){
                return true;
            }
        }
        return false;
    },

// 检查下家报单时出牌数组，优先出大于单牌的组合
    myjdArrisLegality: function(myjdarr){
        var PaiArrValue = [];
        for(let i = 0; i <this._hintPaiArr.length;i ++ ){
            if(this._hintPaiArr[i].length === 1){
                PaiArrValue.push(this._hintPaiArr[i][0]);
            }
        }

        PaiArrValue.sort(function(a,b) {
            return a < b; 
        });
        
        if(this._xiajiabaodan || cc.vv.gameNetMgr._xiajiabaodan){
            var lastpaiIsNull = (cc.vv.gameNetMgr.chupai_PK_last[0] === 54 && cc.vv.gameNetMgr.chupai_PK_last.length === 1)
            if(myjdarr.length === 1 && lastpaiIsNull){
               if(this.exchPintPaiArr()){  //有大于单牌的组合
                   console.log("下家报单，优先出大于单牌的组合");
                   var content = "下家报单，优先出大于单牌的组合";
                   return [false,content];
               }else{ //没有大于单牌的组合  
                    
                    if(myjdarr[0] === PaiArrValue[0]){
                        return true;
                    }else{
                        console.log("下家报单，优先出最大的单牌");
                        var content = "下家报单，优先出最大的单牌";
                        return [false,content];
                    }

               }
            }else if(myjdarr.length === 1 && !lastpaiIsNull){
                if(myjdarr[0] === PaiArrValue[0]){
                    return true;
                }else{
                    console.log("下家报单，优先出最大的单牌");
                    var content = "下家报单，优先出最大的单牌";
                    return [false,content];
                }

            }

        }
        return true;

    },

//检测提示数组中是否有大于单牌的组合
    exchPintPaiArr:function(){
        for(let i= 0;i<this._hintPaiArr.length;i ++){
            if(this._hintPaiArr[i].length >=2){
                return true;
            }
        } 
        return false;
    },

    initActiveGuoBtn:function(){
        if((cc.vv.gameNetMgr.conf.ncbc && this._hintPaiArr.length != 0) || (cc.vv.gameNetMgr.chupai_PK_last && ( cc.vv.gameNetMgr.chupai_PK_last[0] === 54 && cc.vv.gameNetMgr.chupai_PK_last.length === 1))){
            this.activeGuoBtn.getComponent(cc.Button).interactable = false;
        }else{
            this.activeGuoBtn.getComponent(cc.Button).interactable = true;
        }

    },
    /**************** MODEL END ****************/

    //重启游戏 
    onRefreshGameClicked: function () {
        
        cc.vv.alert.show("确定要重置游戏吗？",function(){
            cc.vv.global.restartGame();
          
        },true,null,true); 
        
       
    }, 

        /********************************
    ***** 全面屏适配 *****
    ********************************/
     
    gameDesignSize: function () {
        var cvs = this.node.getComponent(cc.Canvas);
        var isAllScreen = cc.AdaptationMgr.getAllScreenBool();
        if (isAllScreen == false) {
            cvs.fitHeight = true;
        }else {
            cvs.fitHeight = false;
        }
        cvs.fitWidth = true;

        this.btnNodes = this.node.getChildByName("btnNodes");
        this.layerRoot = this.node.getChildByName("layerRoot");

        if (isAllScreen == true) {
            this.setScaleAndOffestByGameUI();
            this.setUIByLeftAndRightOffest();
        }
    },

    setScaleAndOffestByGameUI: function () {
        var offestScaleUINames = ["typeTitle", "infobar", "btnNodes", "prepare", "game", "replay", "layerRoot", "action", "hint"];
        var nodeArray = [];

        var sceneScale = cc.AdaptationMgr.getNodeScale();
        var homeHeight = cc.AdaptationMgr.getIOSHomeHeight();
        for (var i = 0, uiLen = offestScaleUINames.length; i < uiLen; i++) {
            var node = this.node.getChildByName(offestScaleUINames[i]);
            if (node) {
                nodeArray.push(node);
                // node.setScale(sceneScale);
                if (offestScaleUINames[i] != "infobar") {
                    node.y = node.y + homeHeight * sceneScale * 0.5;
                }
            }
        };

        cc.AdaptationMgr.setRootNodeScaleWidth(nodeArray, sceneScale);
    },

    setUIByLeftAndRightOffest: function () {
        var nodeNames = cc.AdaptationMgr.getNodeNamesByScene("mjGame");
        cc.AdaptationMgr.setNodeOffestByName(nodeNames, this.node);
    },

    setSceneBottomOffest: function (sceneScale) {
        var homeHeight = cc.AdaptationMgr.getIOSHomeHeight();
        this.body.y = this.body.y + homeHeight * sceneScale * 0.5;
        this.layerRoot.y = this.layerRoot.y + homeHeight * sceneScale * 0.5;
    },

    /*******************************/

    // update (dt) {},
});
