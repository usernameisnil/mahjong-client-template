cc.Class({
    extends: cc.Component,

    properties: {        
        gameRoot:{
            default:null,
            type:cc.Node
        },
        
        prepareRoot:{
            default:null,
            type:cc.Node   
        },
        
        _myMJArr:[],
        _myMJPosX:[],
        _options:null,
        _selectedMJ:null,
        _chupaiSprite:[],
        _mjcount:null,
        _gamecount:null,
        _hupaiTips:[],
        _hupaiLists:[],
        _playEfxs:[],
        _opts:[],
        _myselfHolds:[],
        _upHolds:[],
        _leftHolds:[],
        _rightHolds:[],
        _mahjongShooted: false,

        _showIPEqual: false,
        
        _bgMgr:null,

        _huTemplates: [],

        spTing:cc.Node,
        tips:{
            default:[],
            type:[cc.Node]
        },
        operationTing:false,
        _hasTuidao:false,

        spHu:cc.Node,
        chiTip:{
            default:null,
            type:cc.Prefab
        },
        _huPromptList: [],
        _huPromptPosList: [],
        huPaiTypeList: {
            default: [],
            type: cc.SpriteFrame
        },
        huTips:{
            default:null,
            type:cc.Prefab
        },
        _moreHuPaiBtnList: [],
        _showTingsData:[],
        _haveHuGuoTip:false,
        _isMing: false,
        _huaPaiList: [],
        flopPrefab:{
            default:null,
            type:cc.Prefab
        },
        _flopDelayTime: 0,
        beardCardsUIArray:[],

        leftRightMahjongPosY:[],

        hunPrefab:{
            default:null,
            type:cc.Prefab
        },
        _isShowHunNode: false,

        replyActionFrames: {
            default: [],
            type: cc.SpriteFrame
        },

        invatePrefab: {
            default:null,
            type:cc.Prefab
        },
    },
    
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        this.gameDesignSize();

        this.addComponent("NoticeTip");
        this.addComponent("GameOver");
        // this.addComponent("DingQue");
        this.addComponent("PengGangs");
        this.addComponent("MJRoom");
        this.addComponent("TimePointer");
        this.addComponent("GameResult");
        this.addComponent("Chat");
        this.addComponent("Folds");
        this.addComponent("ReplayCtrl");
        this.addComponent("PopupMgr");
        this.addComponent("HuanSanZhang");
        this.addComponent("ReConnect");
        this.addComponent("Voice");
        this.addComponent("UserInfoShow");
        // this.addComponent("run");
        this.addComponent("hunpaiIcon");
        
        this.otherHoldPos = {};
        this.send_action_tags = {};
        this.initView();
        this.initEventHandlers();
        
        this.gameRoot.active = false;
        this.prepareRoot.active = true;
        // this.initWanfaLabel();
        this.onGameBeign();
        cc.vv.audioMgr.playMJGameBGM("bgFight.mp3");

        cc.vv.userMgr.returnRoomId = null;
        cc.vv.http.needHttpReconnect = false;

        // cc.game.on(cc.game.EVENT_HIDE, function () {
        //     console.log("luobin", "on cc.game.EVENT_HIDE");
        //     cc.vv.gameNetMgr.projectState = 'hideState';
        // });

        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     console.log("luobin", "on cc.game.EVENT_SHOW");
        //     if (cc.vv.gameNetMgr.projectState == 'hideState') {
        //         setTimeout(function () {
        //             cc.vv.gameNetMgr.projectState = 'showState';
        //         }, 2000)
                
        //     }
        // });

        cc.log("---------------------游戏 onLoad")

    },

    setupReconnect:function()
    {
        // 重连后可能听牌提示
        // var mySeat = cc.vv.gameNetMgr.getSeatByID(cc.vv.userMgr.userId);
        var mySeat = cc.vv.gameNetMgr.getSeatByID(cc.vv.gameNetMgr.getMySeatUserId());
        if (mySeat.canting)
        {
            mySeat.canting = false;
            if (cc.vv.gameNetMgr.turn != mySeat.seatindex) {
                return;
            }
            cc.log("重连后可以听牌");
            if(mySeat.Tingobj.length)
            {
                this.tingObj = mySeat.Tingobj;
                mySeat.Tingobj = [];

                this.iCanTing = true;
            }
        }

        //重连
        if (cc.vv.gameNetMgr.isSync == false) {
            return;
        }

        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null) {
            return;
        }

        //胡牌提示和听牌
        var type = cc.vv.gameNetMgr.conf.opType;//游戏玩法类型，视游戏工程不同需要修改
        for (var i = 0; i < seats.length; i++) {
            var seat = seats[i];

            var userId=seat.userid;
            var holds=seat.holds;
            if(seat.isting)
            {
                this.someoneTing(userId);
                if (seat.isming) {
                   this.showTingHoldsSomeone(userId,holds); 
                } 
            }

            // if ((type == 1 && seat.isting != true && seat.isming != true) || seat.seatHuPaiTips.length == 0) {
            //     continue;
            // }
            if (seat.seatHuPaiTips.length == 0) {
                continue;
            }
            var data = {
                ting: seat.seatHuPaiTips
            };
            var userid = seat.userid;
            this.showHupaiTip(data, userid);
        };
    },

    start: function () {
        cc.vv.gameNetMgr.dispatchEvent("game_finished");

        this.startBrightSecretHolds();

        this.syncHunPai();

        if (this._showIPEqual == false) {
            this.showIPEqual();
        }

        //beardCards(重连)
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null) {
            return;
        }
        for (var i = 0; i < seats.length; i++) {
            var seat = seats[i];
            this.showBeardCardsUI(seat.seatindex);
        };

        
        // 补花(重连)
        // for (var i = 0; i < 4; i++) {
        //     var seatData = seats[i];
        //     if (seatData.buhua == null || seatData.buhua.length == 0) {
        //         continue;
        //     }

        //     var userid = seatData.userid;
        //     var data = {
        //         userid: userid,
        //         buhua: seatData.buhua
        //     };
        //     cc.vv.gameNetMgr.dispatchEvent("buhua_notify",data);
        // };

        //检测当前是自己轮次，手牌是否有花牌
        // if (cc.vv.gameNetMgr.turn != -1 && cc.vv.gameNetMgr.turn == cc.vv.gameNetMgr.seatIndex) {
            // //this.sendHua(cc.vv.userMgr.userId);
        //     this.sendHua(cc.vv.gameNetMgr.getMySeatUserId());
        // }
    },

    startBrightSecretHolds: function () {
        var gameManager = cc.vv.gameNetMgr;
        if (gameManager.gamestate == "runSelect") {
            if (gameManager.seats == null) {
                return;
            }
            if (gameManager.isSync == false) {
                var mySeat = gameManager.seats[gameManager.seatIndex];
                var data = {
                    holds: mySeat.operation,
                    bsRound: gameManager._bright_secret_round-1,
                    isBS: true,
                }
                gameManager.dispatchEvent("game_bright_secret",data);
            }else {
                this.syncOtherSeatDeal();
                gameManager.setMyDealHold();
            }
        }
    },

    syncOtherSeatDeal: function () {
        var gameManager = cc.vv.gameNetMgr;
        var other_hold_number = gameManager.getHoldNumberOfRound();

        for (var seatindex in gameManager.seats) {
            if (seatindex != gameManager.seatIndex) {
                var seatData = gameManager.seats[seatindex];
                var bright_secret_operation_length = seatData.bright.length + seatData.secret.length + seatData.operation.length;
                var deal_ready_mahjong_count = other_hold_number - bright_secret_operation_length;
                if (deal_ready_mahjong_count < 0) {
                    cc.log("-------------------- syncOtherSeatDeal deal_ready_mahjong_count = ", deal_ready_mahjong_count);
                    return;
                }else if (deal_ready_mahjong_count == 0) {
                    var data = {
                        seatIndex: seatindex
                    }
                    gameManager.dispatchEvent('game_runSelect_notify',data);
                }else if (deal_ready_mahjong_count > 0) {
                    var hold_count = bright_secret_operation_length + deal_ready_mahjong_count;
                    this.initOtherMahjongs(seatData, hold_count, true);
                }
            }
        }
    },

    syncHunPai: function () {

        // if (cc.vv.gameNetMgr.gamestate == "xiapao") {
        //     return;
        // }
        
        if (cc.vv.gameNetMgr.gamestate == "runSelect") {
            return;
        }

        if (cc.vv.gameNetMgr.isSync == true) {
            cc.vv.gameNetMgr.dispatchEvent('game_hunpai',true);
        }else if (this._isShowHunNode == false) {
            cc.vv.gameNetMgr.dispatchEvent('game_hunpai',false);
        }
    },
    
    initView:function(){
        this.initClubFriend();

        this.initOps();
        this.initReplyQi();
        
        //搜索需要的子节点
        var gameChild = this.node.getChildByName("game");
        
        this._mjcount = gameChild.getChildByName('mjcount').getComponent(cc.Label);
        this._mjcount.string = "剩余" + cc.vv.gameNetMgr.numOfMJ + "张";
        this._gamecount = gameChild.getChildByName('gamecount').getComponent(cc.Label);
        this._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";

        if (cc.vv.replayMgr.isReplay()) {
            this._mjcount.node.active = false;
            this._gamecount.node.active = false;
        }

        var myselfChild = gameChild.getChildByName("myself");
        var myholds = myselfChild.getChildByName("holds");
        
        for(var i = 0; i < myholds.children.length; ++i){
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            sprite.node.isTouch = true;
            this._myMJArr.push(sprite);
            var mjPosX = myholds.children[i].x;
            this._myMJPosX.push(mjPosX);
            sprite.spriteFrame = null;
        }
        
        var realwidth = cc.director.getVisibleSize().width;
        myholds.scaleX *= realwidth/1280;
        myholds.scaleY *= realwidth/1280;  
        
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            var side = sides[i];
            
            var sideChild = gameChild.getChildByName(side);
            this._hupaiTips.push(sideChild.getChildByName("HuPai"));
            this._hupaiLists.push(sideChild.getChildByName("hupailist"));
            this._playEfxs.push(sideChild.getChildByName("play_efx").getComponent(cc.Animation));
            this._chupaiSprite.push(sideChild.getChildByName("ChuPai").children[0].getComponent(cc.Sprite));
            
            var opt = sideChild.getChildByName("opt");
            opt.active = false;
            var sprite = opt.getChildByName("pai").getComponent(cc.Sprite);
            var data = {
                node:opt,
                sprite:sprite
            };
            this._opts.push(data);

            //beardCards
            var beardCardsUI = sideChild.getChildByName("beardCards");
            beardCardsUI.ative = false;
            this.beardCardsUIArray.push(beardCardsUI);

            var _holds = cc.find("holds", sideChild);
            var hold_len = _holds.childrenCount;
            switch(i)
            {
                case 0:
                    for (var j = 0; j < hold_len; j++) {
                        this._myselfHolds.push(_holds.children[j]);
                    };
                    break;
                case 1:
                    this.leftRightMahjongPosY[0] = [];
                    for (var j = 0; j < hold_len; j++) {
                        this._rightHolds.push(_holds.children[j]);
                        
                        this.leftRightMahjongPosY[0].push(_holds.children[j].y);
                    };

                    break;
                case 2:
                    for (var j = 0; j < hold_len; j++) {
                        this._upHolds.push(_holds.children[j]);
                    };
                    break;
                case 3:

                    this.leftRightMahjongPosY[1] = [];
                    for (var j = 0; j < hold_len; j++) {
                        this._leftHolds.push(_holds.children[j]);
                        
                        this.leftRightMahjongPosY[1].push(_holds.children[j].y);
                    };
                    break;
            }

            if (i != 0) {
                this.otherHoldPos[side] = {};
                this.otherHoldPos[side].posX = _holds.x;
                this.otherHoldPos[side].posY = _holds.y;
            }

            //huPromptList
            this._huPromptList.push(sideChild.getChildByName("huPrompt"));
            this._huPromptPosList.push(sideChild.getChildByName("huPrompt").getPosition());
            var prompt = sideChild.getChildByName("huPrompt");
            var hulist = cc.find("hupais/hulist", prompt);
            this._huTemplates.push(hulist.children[0]);
        }
        

      
        //console.log(this._playEfxs)

        this.hideChupai();
        this.clearHoldsIcon();

        var bg = cc.find('Canvas/bg/Z_backgroud');
        this._bgMgr = bg.getComponent('SpriteMgr');
        this._bgMgr.setIndex(cc.vv.controlMgr.getBGStyle());

        var tingOpt = gameChild.getChildByName("tingOpt");
        this.tingOpt = tingOpt;
        this.showTingOpt(false);

        //moreHuPaiBtns
        var moreBtnNode = gameChild.getChildByName("moreTing");
        for (var i = 0; i < moreBtnNode.childrenCount; i++) {
            moreBtnNode.children[i].active = false;
            this._moreHuPaiBtnList.push(moreBtnNode.children[i]);
            this._showTingsData[i] = [];
        };

        this.setHuaPaiList();
    },

    showTingOpt: function(enable) {
        this.tingOpt.active = enable;
    },

    showIPEqual: function () {
        var seats = cc.vv.gameNetMgr.seats;

        for (var i = 0; i < seats.length; i++) {
            if (((typeof seats[i].ip) == "undefined") || (seats[i].ip == null)) {
                return;
            }
        };

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

        for (var i = 0; i < seat_num-1; i++) {
            var seatA = seats[i];
            notEqualSeats = [];
            for (var j = i+1; j < seat_num; j++) {
                var seatB = seats[j];
                if (seatA.ip == seatB.ip) {

                    if (isEqualed == false) {
                        nameString = nameString + (seatA.name).toString() + "，" + (seatB.name).toString();
                        ipString = seatA.ip.replace("::ffff:", "");
                        isEqualed = true;
                    }else {
                        nameString += "，";
                        nameString += (seatB.name).toString();
                    }
                }else {
                    notEqualSeats.push(seatB);
                }

                if (isEqualed == true && j == seat_num-1) {
                    isbreak = true;
                    break;
                }
                
            };

            if (isbreak == true) {
                break;
            }
        };

        if (nameString == "" || ipString == "") {
            return;
        }

        var tipString = nameString + "的IP相同" + "\n" + "IP：" + ipString;

        this.showIPArray.push(tipString);

        if (isEqualed = true && notEqualSeats.length > 1) {
            this.getEqualIP(notEqualSeats);
        }
    },
    
    hideChupai:function(){
        if (this._chupaiSprite == null) {
            return;
        }
        for(var i = 0; i < this._chupaiSprite.length; ++i){
            this._chupaiSprite[i].node.active = false;
        }        
    },

    showHunPrefab: function (isPlay) {

        this.clearHoldsIcon();
        this.removeHunNode();

        if (cc.vv.gameNetMgr.showHunMahjongArray.length == 0) {
            return;
        }

        var gameChild = this.node.getChildByName("game");
        var hunNode = cc.instantiate(this.hunPrefab);
        var hunScript = hunNode.getComponent("ShowHunView");
        if (hunScript) {
            hunScript.init(isPlay);
        }
        gameChild.addChild(hunNode);

        this._isShowHunNode = true;

        this.initMahjongs();
        this.initGameOtherHolds();
    },

    removeHunNode: function () {
        var hunNode = this.node.getChildByName("game").getChildByName("showHunpai");
        if (hunNode) {
            hunNode.destroy();
        }

        this._isShowHunNode = false;
    },

    removeHunIcon: function (node) {
        if (cc.vv.gameNetMgr.getHoldEqualHunValue(node.mjId)) {
            var icon = node.getChildByName("hupaiIcon");
            if (icon) {
                icon.removeFromParent(true);
                icon = null;
            }

        }
    },

    showTingTriangle: function (data) {
        if (!data || data.length == 0)
        {
            cc.log("----------showTingTriangle:data",data)
            return; 
        }

        this.clearTingTip();

        var data_length = data.length;

        // var mySeatData = cc.vv.gameNetMgr.getSeatByID(cc.vv.userMgr.userId);
        var mySeatData = cc.vv.gameNetMgr.getSeatByID(cc.vv.gameNetMgr.getMySeatUserId());
        var lackingNum = this.getChiPengGangNumber(mySeatData);
        //bright
        var bright_ting_mahjong_array = [];
        var brights = mySeatData.bright;//亮起的牌
        var brights_len = 0;
        if (brights != null && brights.length > 0) {
            brights_len = brights.length;

            for (var i = 0; i < brights_len; i++) {
                var bright_mahjong_id = brights[i];
                var index = i + lackingNum;
                var sprite = this._myMJArr[index];

                for (var j = 0; j < data_length; j++) {
                    var tingObj = data[j];
                    if (!tingObj.CanTing) {
                        continue;
                    }
                    var canting_mahjong_id = tingObj.Pai;

                    if (bright_mahjong_id == canting_mahjong_id) {
                        var spTing = cc.instantiate(this.spTing);
                        spTing.setPosition(-7,19);
                        spTing.scaleX = 0.72;
                        spTing.scaleY = 0.72; 
                        sprite.node.addChild(spTing);

                        bright_ting_mahjong_array.push(bright_mahjong_id);
                        break;

                    }
                };
            };
        }

        //holds(operation)
        var holds = mySeatData.holds;
        var conf = cc.vv.gameNetMgr.conf;
        if (!cc.vv.replayMgr.isReplay() && conf && conf.type == cc.vv.brightGameName && conf.opType == 2) {
            holds = mySeatData.operation;
        }

        if (holds == null || holds.length == 0) {
            return;
        }

        var bright_ting_mahjong_count = bright_ting_mahjong_array.length;
        var holds_length = holds.length;
        for (var i = 0; i < holds_length; i++) {
            var index = i + lackingNum + brights_len;
            var sprite = this._myMJArr[index];
            var operation_mahjong_id = holds[i];
            var equal_bright_operation_mahjong = false;
            if (bright_ting_mahjong_count > 0) {
                for (var j = 0; j < bright_ting_mahjong_count; j++) {
                    var bright_ting_mahjong_id = bright_ting_mahjong_array[j];
                    if (operation_mahjong_id == bright_ting_mahjong_id) {
                        equal_bright_operation_mahjong = true;
                        break;
                    }
                };
            }

            if (equal_bright_operation_mahjong == false) {
                for (var k = 0; k < data_length; k++) {
                    var tingObj = data[k];
                    if (!tingObj.CanTing) {
                        continue;
                    }
                    var canting_mahjong_id = tingObj.Pai;
                    if (canting_mahjong_id == operation_mahjong_id) {
                        var spTing = cc.instantiate(this.spTing);
                        spTing.setPosition(-10,10);
                        spTing.scaleX = 0.8;
                        spTing.scaleY = 0.8; 
                        sprite.node.addChild(spTing);

                        break;
                    }
                };
            }
        };
    },

    onTingCancelClicked: function() {
        this.showTingOpt(false);
        this.isTing = false;
        this.clearTingTip();
        // cc.vv.net.send("guo");
    },

    initEventHandlers:function(){

        cc.vv.gameNetMgr.dataEventHandler = this.node;

        //初始化事件监听器
        var self = this;

        this.node.on('game_holds',function(data){
            self.initMahjongs();
            self.checkQueYiMen();
        });

        this.node.on('game_bright',function(data){
            for (var i = 0; i < cc.vv.gameNetMgr.seats.length; i++) {
                var seatData = cc.vv.gameNetMgr.seats[i];
                if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
                    self.initMahjongs();
                }else {
                    self.initOtherMahjongs(seatData);
                }
            };
            self.checkQueYiMen();
        });

        this.node.on('game_begin',function(data){
            if (self._showIPEqual == false) {
                self.showIPEqual();
            }

            self.initClubFriend();

            self.onGameBeign();
        });

        this.node.on('game_sync',function(data){
            self.onGameBeign();
        });

        this.node.on('game_chupai',function(data){
            data = data.detail;
            self.hideChiOptions();
            self.hideChupai();
            self.checkQueYiMen();

            self._mahjongShooted = false;

            if(data.last != cc.vv.gameNetMgr.seatIndex){
                self.initMopai(data.last,null);
            }
            if(!cc.vv.replayMgr.isReplay() && data.turn != cc.vv.gameNetMgr.seatIndex){
                self.initMopai(data.turn,-1);
            }

            if(!cc.vv.replayMgr.isReplay())
            {
                var turnId = data.gamedata.userid || ""
                // if(cc.vv.userMgr.userId == turnId)
                if(cc.vv.gameNetMgr.getMySeatUserId() == turnId)
                {
                    //花牌
                    // var ishua = self.sendHua(data.gamedata.userid);
                    // if (ishua == true) {
                    //     return;
                    // }


                    //听牌
                    self.tingObj = data.gamedata.Tingobj || []
                    cc.log("---------------self.tingObj:",self.tingObj)
                }
                var canTing = data.gamedata.canting || false;
                if (canTing)
                {
                    cc.log("可以听牌------------game_chupai");
                    self.iCanTing = true
                }
                else
                {
                    self.iCanTing = false
                }
            }
        });

        this.node.on('game_mopai',function(data){
            self.hideChupai();
            data = data.detail;
            var pai = data.pai;
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(data.seatIndex);
            cc.log("localIndex=================="+localIndex)
            if(localIndex == 0){
                var index = 13;
                var sprite = self._myMJArr[index];
                self.setSpriteFrameByMJID("M_",sprite,pai);
                sprite.node.mjId = pai;

                if (cc.vv.gameNetMgr.getHoldEqualHunValue(sprite.node.mjId)) {
                    var args = {
                        pos:cc.v2(8, -10),
                        scaleX:1,
                        scaleY:1,
                        rotate:0
                    };
                    cc.vv.hunpaiIcon.addIcon(sprite.node,args);
                }
            }
            else if(cc.vv.replayMgr.isReplay()){
                self.initMopai(data.seatIndex,pai);
            }
            else
            {
                var pre = cc.vv.controlMgr.getFoldPre(localIndex);
                cc.log("pre=================="+pre)
                switch(pre){
                    case "L_":
                        var index = 13;
                        var mjnode = self._leftHolds[index];
                        var sprite = mjnode.getComponent(cc.Sprite);
                        sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,pai);
                        break;
                    case "R_":
                        var index = 0;
                        var mjnode = self._rightHolds[index];
                        var sprite = mjnode.getComponent(cc.Sprite);
                        sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,pai);
                        break;
                    case "B_":
                        var index = 0;
                        var mjnode = self._upHolds[index];
                        var sprite = mjnode.getComponent(cc.Sprite);
                        sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,pai);
                        sprite.node.scaleX = 0.72;
                        sprite.node.scaleY = 0.72;
                        break;
                }
                sprite.node.mjId = pai;
            }
        });

        this.node.on('buhua_notify',function(data){
            // data = data.detail;
            // self.showHuaPai(data.userid);
            // cc.vv.gameNetMgr.setAudioSFX(seatindex, -1, "Mahjong", "buhua.mp3", "");
        });

        this.node.on('buhua_replay',function(data){
            cc.log("handle buhua_replay data = ", data);
            data = data.detail;
            //花牌
            var localHuapais = self.getMyselfHuapai(data.userid);
            if (localHuapais.length == 0) {
                return;
            }

            var addHuaData = {
                userid: data.userid,
                buhua: localHuapais
            }
            cc.vv.gameNetMgr.addBuHuaData(addHuaData);
            self.showHuaPai(data.userid);
            // cc.vv.gameNetMgr.setAudioSFX(seatindex, -1, "Mahjong", "buhua.mp3", "");

            //更新手牌
            var huaLength = localHuapais.length-1;
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.userid);
            var addHolds = cc.vv.replayMgr.getBuHuaPai(seatindex, huaLength, data.pai);
            cc.vv.gameNetMgr.addHuaHolds(seatindex, addHolds);
            // if (cc.vv.userMgr.userid == data.userid) {
            if (cc.vv.gameNetMgr.getMySeatUserId() == data.userid) {
                self.initMahjongs();
            }else {
                var seatData = cc.vv.gameNetMgr.getSeatByID(data.userid);
                self.initOtherMahjongs(seatData);
            }
            
        });

        this.node.on('game_action',function(data){
            var data = data.detail;
            self.showAction(data);
        });

        this.node.on('game_wait',function(data){
            var data = data.detail;
            self.playTip();
        });

        this.node.on('hupai',function(data){
            self.iCanTing = false;
            self.hideChiOptions();
            self.showOps(false);
            var data = data.detail;

            self.showGameHuType(data);

            // //多次胡
            // self.moreHuAction(seatIndex);
            
        });

        this.node.on('game_fanpai',function(data){
            var data = data.detail;

            self.setFlopData(data);
        });

        this.node.on('mj_count',function(data){
            self._mjcount.node.active = true;
            self._mjcount.string = "剩余" + cc.vv.gameNetMgr.numOfMJ + "张";
        });

        this.node.on('game_num',function(data){
            self.initClubFriend();
            self._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";
        });

        this.node.on('game_over',function(data){
            self._haveHuGuoTip = false;
            self._isMing = false;
            self.gameRoot.active = false;
            self.prepareRoot.active = true;
            self.removeHunNode();
            self.clearHoldsIcon();
            self.hideChiOptions();
            self.showOps(false);
            // 清除 别人听牌 的提示
            self.clearSbTing()
            self._hasTuidao=false;
            self.initMJScale();
            self.clearOtherHolds();
            self.hideAllHupaiTip();
        });


        this.node.on('game_chupai_notify',function(data){
            self.showChuPaiOn(data);
        });

        this.node.on('guo_notify',function(data){
            self.hideChupai();
            self.hideChiOptions();
            self.showOps(false);
            var seatData = data.detail;
            //如果是自己，则刷新手牌
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex && self._hasTuidao!=true){
                cc.log("---------------------初始化自己手牌initMahjongs")
                self.initMahjongs();
            }
            // cc.vv.audioMgr.playMJGameSFX("give.mp3");
        });

        this.node.on('guo_result',function(data){
            self.hideChiOptions();
            cc.log("----------this.iCanTing", self.iCanTing);
            self.showAction(null);
            // cc.vv.audioMgr.playMJGameSFX("nv/g_guo.mp3");
        });

        this.node.on('game_dingque_finish',function(data){
            self.initMahjongs();
        });


        this.node.on('game_hunpai',function(data){
            self.showHunPrefab(data.detail);
        });

        this.node.on('game_xiapao_finish',function(data){
            self.paoInitGame(true);
            self.initMahjongs();
        });

        this.node.on('chi_notify', function(data) {
            self.chiOperation(data);
        });

        this.node.on('peng_notify',function(data){
            self.pengOperation(data);
        });

        this.node.on('gang_notify',function(data){

            self.hideChupai();
            self.hideChiOptions(); 
            self.showOps(false);
            var data = data.detail;
            var seatData = data.seatData;
            var gangtype = data.gangtype;
            var userId=seatData.userid;
            var holds=seatData.holds;
            if(self._hasTuidao==true)
            {
                self.showTingHoldsSomeone(userId,holds);
            }
            else if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();
            }
            else{
                self.initOtherMahjongs(seatData);
            }

            var localIndex = self.getLocalIndex(seatData.seatindex);

            var getLName = cc.vv.audioMgr.getLanguageName();
            if (getLName == "Dialect") {
                if (gangtype == "angang") {
                    self.setplayEfxAndAudio(localIndex, "play_gang", cc.CGameConfigDataModel.getAudioURLByOther("angang"));
                }else {
                    self.setplayEfxAndAudio(localIndex, "play_gang", cc.CGameConfigDataModel.getAudioURLByOther("minggang"));
                }
            }else {
                self.setplayEfxAndAudio(localIndex, "play_gang", cc.CGameConfigDataModel.getAudioURLByOther("gang"));
            }
            

        });

        this.node.on("hangang_notify",function(data){
            var data = data.detail;
            var localIndex = self.getLocalIndex(data);

            var getLName = cc.vv.audioMgr.getLanguageName();
            if (getLName == "Dialect") {
                self.setplayEfxAndAudio(localIndex, "play_gang", cc.CGameConfigDataModel.getAudioURLByOther("minggang"));
            }else {
                self.setplayEfxAndAudio(localIndex, "play_gang",cc.CGameConfigDataModel.getAudioURLByOther("gang"));
            }
            
            if (localIndex == 0) {
                self.showOps(false);
            }
            self.hideChiOptions(); 
        });

        this.node.on("game_ting",function(data){
            cc.log("---------------------游戏 胡牌提示")
            var data = data.detail
            // self.showHupaiTip(data, cc.vv.userMgr.userId);
            self.showHupaiTip(data, cc.vv.gameNetMgr.getMySeatUserId());
        });

        this.node.on("ting_notify",function(data){
            var data=data.detail;
            var userId=data.userId;
            var holds=data.holds;
            cc.log("---------------------ting_notify", data, userId);
            self.someoneTing(userId);
            //
            var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(userId);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
            cc.vv.gameNetMgr.seats[seatIndex].isting = true;
            cc.vv.gameNetMgr.setAudioSFX(seatIndex, -1, "Mahjong", "ting.mp3", "");


            //胡牌提示
            // if (data.seatHuPaiTips && data.seatHuPaiTips.length > 0) {
            //     var dataTing = {
            //         ting:data.seatHuPaiTips
            //     };
            //     self.showHupaiTip(dataTing, userId);
            // }
            
            self.initMahjongsPos();

            if (userId == cc.vv.gameNetMgr.getMySeatUserId()) {
                self.isTing = false;
                self.clearTingTip();
            }
            
        });

        this.node.on("ming_notify",function(data){
            var data=data.detail;
            var userId=data.userId;
            var holds=data.holds;
            cc.log("--------------------- ming_notify ", data, userId);

            var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(userId);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
            cc.vv.gameNetMgr.seats[seatIndex].isming = true;

            self.showTingHoldsSomeone(userId,holds);

            //胡牌提示
            if (data.seatHuPaiTips && data.seatHuPaiTips.length > 0) {
                var dataTing = {
                    ting:data.seatHuPaiTips
                };
                self.showHupaiTip(dataTing, userId);
            }

            if (userId == cc.vv.gameNetMgr.getMySeatUserId()) {
                self.isTing = false;
                self._isMing = false;
                self.clearTingTip();
            }

            // this.initMahjongsPos();
            
        });

        this.node.on("tuidao_notify",function(data){
            // var data=data.detail;
            // cc.log("---------------------tuidao_notify", data);

            // if(cc.vv.gameNetMgr.conf.type == cc.vv.gameName)
            // {
            //     self._hasTuidao=true;
            // }

            // self.showTingHoldsEverybody(data);
        });

        this.node.on('game_bright_secret', function(data) {

            data = data.detail;
           // console.log("game_bright_secret data = ", data);

            self._mjcount.node.active = false;

            var deal_round = data.bsRound;
            var select_state_mahjong_count = 4;
            if (deal_round == 4) {
                select_state_mahjong_count = 1;
            }

            self.initMahjongs();

            if (deal_round < 5) {
                if (data.isSyncMy == null || data.isSyncMy == false) {
                    self.initDealOtherHolds(select_state_mahjong_count);
                }
                
                if (data.isBS == true) {
                    cc.vv.gameNetMgr.isShowPao = true;
                    cc.vv.gameNetMgr.dispatchEvent('game_runSelect');
                }else {
                    cc.vv.net.send("runSelect",0);
                }
            }

        });

        this.node.on('game_runSelect_notify', function(data) {
            data = data.detail;
           // console.log("game_runSelect_notify data = ", data);

            if (data.seatIndex == cc.vv.gameNetMgr.seatIndex) {
                self.initMahjongs();
            }else {
                var seatData = cc.vv.gameNetMgr.seats[data.seatIndex];
                var hold_count = seatData.bright.length + seatData.secret.length + seatData.operation.length;
                self.initOtherMahjongs(seatData, hold_count, true);
            }
        });

        this.node.on('game_replyQi', function(data) {
            var data = data.detail;
            self.showReplySeatQi(data.seatIndex, data.actionType);
        });

        this.node.on('refresh_bg', function(data) {
            self._bgMgr.setIndex(data.detail);
        });

        this.node.on('game_replyPlayOption', function(data) {
            var optionData = data.detail;
            self.addOptions(optionData);
            self.replyHideOption();
        });


        //myself的hold的点击事件监听

        var fnTouchStart = function (event) {
            var isReturn = self.mjClickedReturn(event, true);
            if (isReturn == true) {
                return true;
            }

            self.myselfMJClickedStart(event);
        };

        var fnTouchMove = function (event) {
            var isReturn = self.mjClickedReturn(event, false);
            if (isReturn == true) {
                return true;
            }

            self.myselfMJClickedMoved(event);
        };

        var fnTouchEnd = function (event) {
            var isReturn = self.mjClickedReturn(event, false);
            if (isReturn == true) {
                return true;
            }

            self.myselfMJClickedEnded(event);
        };

        var fnTouchCancel = function (event) {
            var target = event.target;

            var isReturn = self.mjClickedReturn(event, false);
            if (isReturn == true) {
                return true;
            }

            if (self._selectedMJ != null) {
                self._selectedMJ = null;
            }

            self.initMahjongsPos();

        };

        for (var i = 0; i < this._myselfHolds.length; i++) {
            var mjnode = this._myselfHolds[i];

            mjnode.on(cc.Node.EventType.TOUCH_START, fnTouchStart);
            mjnode.on(cc.Node.EventType.TOUCH_END, fnTouchEnd);
            mjnode.on(cc.Node.EventType.TOUCH_MOVE, fnTouchMove);
            mjnode.on(cc.Node.EventType.TOUCH_CANCEL, fnTouchCancel);
        }
    },

    clearSbTing:function()
    {
        for (var i = 0; i < this.tips.length; i++) {
            this.tips[i].active = false
        }
        this.iCanTing = false
    },

    //听牌后所有人的牌都要推倒
    showTingHoldsEverybody:function(data)
    {
        for(var i=0;i<data.length;++i)
        {
            var userId=data[i].userId;
            var holds=data[i].holds;
            this.showTingHoldsSomeone(userId,holds);

        }
    },
    //某一个听牌人的牌要推倒
    showTingHoldsSomeone:function(userId,data)
    {   
        var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(userId);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);

        cc.log("---------------推倒手牌data:", data)
        cc.log("---------------推倒手牌userId:", userId)
        cc.log("---------------localIndex:", localIndex)
        cc.log("---------------seatIndex:", seatIndex)
        if (localIndex==0)
        {
            this.initMahjongs();
        }
        else
        {
            var seatData = cc.vv.gameNetMgr.seats[seatIndex];
            seatData.holds=[];
            for(var i in data)
            {
                seatData.holds.push(data[i]);
            }
            this.initOtherMahjongs(seatData);
        }
    },

    showHuPaiTipType: function (localIndex) {
        var hupais = this._huPromptList[localIndex].getChildByName('hupais');
        var huTypeSp = hupais.getChildByName('hutips');
        var type = cc.vv.gameNetMgr.conf.opType;
        // if (type == 1) {
        //     huTypeSp.getComponent(cc.Sprite).spriteFrame = this.huPaiTypeList[0];
        //     huTypeSp.width = 85;
        // }else {
            huTypeSp.getComponent(cc.Sprite).spriteFrame = this.huPaiTypeList[1];
            huTypeSp.width = 37;
        // }
    },

    showHupaiTip: function (data, userid) {

        if (data == null || data.ting == null || userid == null || userid < 0) {
            return;
        }

        if (this._huPromptList == null || this._huPromptList.length == 0 || this._huTemplates == null || this._huTemplates.length == 0) {
            return;
        }

        var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(userid);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatindex);

        if (localIndex < 0 && localIndex > 3) {
            return;
        }

        this.showHuPaiTipType(localIndex);
        
        var huTemplate = this._huTemplates[localIndex];
        var huPrompt = this._huPromptList[localIndex];
        var hupais = huPrompt.getChildByName('hupais');
        var hulist = hupais.getChildByName('hulist');

        hulist.removeAllChildren();

        var tingLength = data.ting.length;

        this._moreHuPaiBtnList[localIndex].active = tingLength > 9;
        if (tingLength > 9) {
            if (this._showTingsData[localIndex] && this._showTingsData[localIndex].length > 0) {
                this._showTingsData[localIndex].splice(0, this._showTingsData[localIndex].length);
            }
            this._showTingsData[localIndex] = [];
            for (var i = 0; i < data.ting.length; i++) {
                this._showTingsData[localIndex].push(data.ting[i]);
            };
            tingLength = 9;

            huPrompt.setPosition(this._huPromptPosList[localIndex]);
        }else {
            this.setOtherHuPromptPos(localIndex);
        }

        for (var i = 0; i < tingLength; i++) {
            var hupainode = cc.instantiate(huTemplate);
            
            var pre = cc.vv.controlMgr.getFoldPre(localIndex);
            if (localIndex == 1) {
                hupainode.setLocalZOrder(tingLength-i);
            }
            hupainode.getComponent(cc.Sprite).spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,data.ting[i]);
            hupainode.active = true;
            hulist.addChild(hupainode);
        }

        hupais.active = tingLength > 0;
        huPrompt.active = tingLength > 0;
    },

    setOtherHuPromptPos: function (localIndex) {
        var huPrompt = this._huPromptList[localIndex];
        var huPromptPos = this._huPromptPosList[localIndex];
        var posX = huPromptPos.x, posY = huPromptPos.y;

        switch (localIndex) {
            case 0:
                huPrompt.setPosition(huPromptPos);
                break;
            case 1: 
                posY -= 90;
                var pos = cc.v2(posX, posY);
                huPrompt.setPosition(pos);
                break;
            case 2: 
                posX += 110;
                var pos = cc.v2(posX, posY);
                huPrompt.setPosition(pos);
                break;
            case 3: 
                posY += 90;
                var pos = cc.v2(posX, posY);
                huPrompt.setPosition(pos);
                break;
        }
    },

    hideHupaiTip:function(seatindex)
    {
        cc.log("--------------------- hideHupaiTip");
        if (this._huPromptList == null || this._huPromptList.length == 0) {
            return;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
        if (localIndex < 0 && localIndex > 3) {
            return;
        }
        if (this._huPromptList[localIndex].active) {
            this._huPromptList[localIndex].active = false;
        }
        
    },

    hideAllHupaiTip:function()
    {
        if (this._huPromptList == null) {
            return;
        }
        for (var i = 0; i < this._huPromptList.length; i++) {
            this._huPromptList[i].active = false;
        };
    },

    someoneTing:function(userId)
    {
        var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(userId);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        cc.log("someoneTing:-----seatIndex:", seatIndex, "localIndex:",localIndex);
        this.showSbTing(localIndex)
    },

    showSbTing:function(index)
    {
        if(index < this.tips.length)
        {
            this.tips[index].active = true
        }
    },

    mjClickedReturn: function (event, isStart) {
        var target = event.target;

        if (cc.vv.replayMgr.isReplay() == true) {
            console.log("this is replay.");
            return true;
        }

        if(cc.vv.gameNetMgr.isHuanSanZhang){
            if (isStart == true) {
                this.node.emit("mj_clicked",event.target);
            }
            return true;
        }
        
        //如果不是自己的轮子，则忽略
        if(cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex){
            console.log("not your turn." + cc.vv.gameNetMgr.turn);
            return true;
        }

        if (cc.vv.gameNetMgr.getHoldEqualHunValue(target.mjId)) {
            console.log("it is hunpai, it is not clicked.");
            return true;
        }

        // if (this._selectedMJ != null && this._selectedMJ != target && this._selectedMJ.ended == false) {
        //     console.log("you are clicking a majiang");
        //     return true;
        // }


        if (this._mahjongShooted == true) {
            console.log("you are shot, it is not your turn.");
            return true;
        }

        if (!this.isTing && target.isTouch == false) {
            console.log("target is bright and not ting, target can not click.");
            return true; 
        }

        if (this.isTing)
        {
            cc.log("听牌点麻将:",event.target.mjId, "tingObj:", this.tingObj)
            var clickMj = event.target.mjId
            return this.clickMjOrTingMj(clickMj)
        }

        // var mySeat = cc.vv.gameNetMgr.getSeatByID(cc.vv.userMgr.userId);
        var mySeat = cc.vv.gameNetMgr.getSeatByID(cc.vv.gameNetMgr.getMySeatUserId());
        if (mySeat.isting) 
        {
            console.log("you are ting, you can not click majiang");
            return true
        }

        return false;
    },

    clickMjOrTingMj:function(mjId)
    {
        if (this.tingObj)
        {
            for (var i = 0; i < this.tingObj.length; i++) {
                if (this.tingObj[i].Pai == mjId) {
                    if(this.tingObj[i].CanTing == false)
                    {
                        return true
                    }
                    else
                    {
                        return false
                    }
                    break
                }
            };
        }

        return true
    },

    clickedTingMJ: function (mjid) {
        
        for (var i = 0; i < this.tingObj.length; i++) {
            if (this.tingObj[i].Pai == mjid) {
                if (this.tingObj[i].CanTing == false) {
                    this.hideHupaiTip(cc.vv.gameNetMgr.seatIndex);
                    if (this._moreHuPaiBtnList[0].active) {
                        this._moreHuPaiBtnList[0].active = false;
                    }
                    
                }else {
                    var data = {
                        ting : this.tingObj[i].Tings
                    };
                    // this.showHupaiTip(data, cc.vv.userMgr.userId); 
                    this.showHupaiTip(data, cc.vv.gameNetMgr.getMySeatUserId());
                }
                break;
            }
        };
        
    },

    myselfMJClickedStart: function (event) {
        var target = event.target;

        target.moved = false;
        target.ended = false;

        var MJLength = this._myMJArr.length;
        for(var i = 0; i < MJLength; ++i){
            if ((this._myMJArr[i].node.x != this._myMJPosX[i] || this._myMJArr[i].node.y != 0) && this._selectedMJ == null) {
                this._selectedMJ = this._myMJArr[i].node;
                this._selectedMJ.x = this._myMJPosX[i];
                this._selectedMJ.y = 15;
                break;
            }
        }
        
        for(var i = 0; i < MJLength; ++i){
            if(event.target == this._myMJArr[i].node){
                //如果是再次点击，则出牌
                if(event.target == this._selectedMJ){

                    this.shoot(this._selectedMJ.mjId);
                    this._selectedMJ.y = 0;

                    this.removeHunIcon(this._selectedMJ);

                    this._selectedMJ = null;
                    return;
                }
                if(this._selectedMJ != null){
                    this._selectedMJ.y = 0;
                }

                target.x = this._myMJPosX[i];
                target.y = 0;

                target.oldx = target.x;
                target.oldy = target.y;

                // event.target.y = 15;
                this._selectedMJ = event.target;

                if (this.tingObj)
                {
                    this.clickedTingMJ(this._selectedMJ.mjId);
                }
                return;
            }
        }
    },

    myselfMJClickedMoved: function (event) {
        var target = event.target;
       

        if (this._selectedMJ != null && this._selectedMJ == target) {
            
            var touches = event.getTouches();
            var position = target.parent.convertTouchToNodeSpaceAR(touches[0]);
            var s = target.getContentSize();
            var rect = cc.rect(target.oldx - s.width / 2, target.oldy - s.height / 2, s.width, s.height);

            target.setPosition(position);

            if (!cc.rectContainsPoint(rect, position)) {
                target.moved = true;
            }
        }
    },

    myselfMJClickedEnded: function (event) {
        var target = event.target;

        target.ended = true;

        if (this._selectedMJ != null && this._selectedMJ == target) {
            var touches = event.getTouches();
            var position = target.parent.convertTouchToNodeSpaceAR(touches[0]);
            var s = target.getContentSize();
            var rect = cc.rect(target.oldx - s.width / 2, target.oldy - s.height / 2, s.width, s.height);

            if (cc.rectContainsPoint(rect, position)) {
                if (target.moved == true) {
                    target.x = target.oldx;
                    target.y = target.oldy;
                    this._selectedMJ = null;
                    this.initMahjongsPos();
                }else {
                    target.x = target.oldx;
                    target.y = target.oldy + 15;
                }
            }else {
                this.shoot(this._selectedMJ.mjId); 
                this._selectedMJ.x = target.oldx;
                this._selectedMJ.y = 0;

                this.removeHunIcon(this._selectedMJ);

                this._selectedMJ = null;
                return;
            }
        }
    },
    
    showChupai:function(){
        var pai = cc.vv.gameNetMgr.chupai;
        cc.log("pai=============="+pai);
        if( pai >= 0 ){
            //
            var localIndex = this.getLocalIndex(cc.vv.gameNetMgr.turn);
            cc.log("cc.vv.gameNetMgr.turn=============="+cc.vv.gameNetMgr.turn);
            if (this._chupaiSprite == null) {
                return;
            }
            var sprite = this._chupaiSprite[localIndex];
            sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_",pai);
            sprite.node.active = true;   
        }

        if (!cc.vv.replayMgr.isReplay()) {
            var self = this;
            setTimeout(function () {
                self.hideChupai();
            }, 500)
        }
    },

    showAction:function(data){

        this.send_action_tags = {};

        this.showOps(false);

        if (this.isChiOptionsActive() == true) {
            return;
        }

        var actionData = {
            mjId: -1,
            playArray:[],
            gangIdArray:[]
        };

        if (data == null) // 判断能不能听
        {
            if (this.iCanTing)
            {   

                var cancelTingBtn=this.tingOpt.getChildByName("btnCancel");
                cancelTingBtn.active = true;

                // this.setForceTingPai();//强制报听
                
                actionData.playArray.push("ting");
                this.addOptions(actionData);

                this.isShowBtnTing = true;
            }

        }else if (typeof data == "string" && data == "showMing") {
            actionData.playArray.push("ming");
            this.addOptions(actionData);

        }else if(data && (data.hu || data.gang || data.peng || data.chi)){  // 点弃后 判断能不能听
            this.send_action_tags = {
                hu: data.hu,
                peng: data.peng,
                gang: data.gang,
                chi: data.chi
            };

            actionData.mjId = data.pai;
            actionData.playArray = this.getPlayArray(data);

            if(data.gang){
                var gang_length = data.gangpai.length;
                for(var i = 0; i < gang_length;++i){
                    if (i > 0) {
                       actionData.playArray.push("gang"); 
                    }
                    actionData.gangIdArray.push(data.gangpai[i]);
                }
            }

            if(data.hu){
                this._haveHuGuoTip = true;
                // this.setForceHuPai();
            }

            this.addOptions(actionData);

        }
    },

    setForceHuPai: function () {
        var conf = cc.vv.gameNetMgr.conf;
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null || cc.vv.gameNetMgr.seatIndex < 0) {
            return;
        }
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        if (conf && conf.daihun && seatData && seatData.holds) {
            var holdsLength = seatData.holds.length;
            if (holdsLength == 2) {
                var isAllLai = true;
                for (var i = 0; i < holdsLength; i++) {
                    var holdPai = seatData.holds[i];
                    if (!cc.vv.gameNetMgr.getHoldEqualHunValue(holdPai)) {
                        isAllLai = false;
                        break;
                    }
                };

                var btnGuo = this._options.getChildByName("btnGuo");
                if (isAllLai == true) {
                    btnGuo.active = false;
                }else {
                    btnGuo.active = true;
                }
            }
        }
    },

    setForceTingPai: function () {
        var conf = cc.vv.gameNetMgr.conf;
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null || cc.vv.gameNetMgr.seatIndex < 0) {
            return;
        }
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = seatData.holds;
        if (conf && cc.vv.gameNetMgr.conf.type == cc.vv.brightGameName && conf.opType == 2) {
            holds = seatData.operation;
        }

        var btnGuo = this._options.getChildByName("btnGuo");
        var cancelTingBtn=this.tingOpt.getChildByName("btnCancel");
        if (holds != null && holds.length == 0) {
            btnGuo.active = false;
            cancelTingBtn.active = false;
        }
    },
    
    initWanfaLabel:function(){
        var wanfa = cc.find("Canvas/infobar/wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
    },
    
    initHupai:function(localIndex,pai){
        if(cc.vv.gameNetMgr.conf.type == "xlch"){
            var hupailist = this._hupaiLists[localIndex];
            for(var i = 0; i < hupailist.children.length; ++i){
                var hupainode = hupailist.children[i]; 
                if(hupainode.active == false){
                    var pre = cc.vv.controlMgr.getFoldPre(localIndex);
                    hupainode.getComponent(cc.Sprite).spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,pai);
                    hupainode.active = true;
                    break;
                }
            }   
        }
    },
    
    playEfx:function(index,name){
        if (cc.vv.gameNetMgr.projectState == 'hideState') {
            return;
        }

        if (this._playEfxs == null || this._playEfxs.length == 0) {
            return;
        }
        this._playEfxs[index].node.active = true;
        this._playEfxs[index].stop();
        this._playEfxs[index].play(name);
    },

    moreHuAction: function (seatIndex) {
        this.removeMopai(seatIndex);
        this.showBeardCardsUI(seatIndex);
    },

    removeMopai: function (seatIndex) {
        console.log("removeMopai");
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.controlMgr.getSide(localIndex);
        var pre = cc.vv.controlMgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");

        var lastIndex = this.getMJIndex(side,13);
        var nc = holds.children[lastIndex];

        nc.scaleX = 1.0;
        nc.scaleY = 1.0;

        nc.active = false;

        var conf = cc.vv.gameNetMgr.conf;
        var holds = cc.vv.gameNetMgr.seats[seatIndex].holds;
        if (!cc.vv.replayMgr.isReplay() && conf && conf.type == cc.vv.brightGameName && conf.opType == 2) {
            holds = cc.vv.gameNetMgr.seats[seatIndex].operation;
        }
        if (holds == null) {
            return;
        }

        var l = holds.length;
        if (!cc.vv.replayMgr.isReplay() && conf && conf.type == cc.vv.brightGameName && conf.opType == 2) {
            if (cc.vv.gameNetMgr.seats[seatIndex].bright != null) {
                l += cc.vv.gameNetMgr.seats[seatIndex].bright.length;
            }
        } 

        if( l == 2 || l == 5 || l == 8 || l == 11 || l == 14){
            holds.pop();
        }

        if (localIndex == 0) {
            this.initMahjongs();
        }else {
            this.initOtherMahjongs(cc.vv.gameNetMgr.seats[seatIndex]);
        }
    },

    showBeardCardsUI: function (seatIndex) {
        var beardCardsList = cc.vv.gameNetMgr.seats[seatIndex].beardCardsList;
        if (beardCardsList == null || beardCardsList.length == 0) {
            return;
        }

        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var showBeardCard = this.beardCardsUIArray[localIndex];
        var bdChildrenCount = showBeardCard.childrenCount;
        var templateChild = showBeardCard.children[0];
        
        var pre = cc.vv.controlMgr.getFoldPre(localIndex);

        var beardCard_count = beardCardsList.length;
        if (bdChildrenCount > beardCard_count) {
            for (var i = bdChildrenCount-1; i >= beardCard_count; i--) {
                showBeardCard.children[i].removeFromParent(true);
            };
            
        }
        for (var i = 0; i < beardCard_count; i++) {
            var mahjong_id = beardCardsList[i];
            if (localIndex == 1) {
                mahjong_id = beardCardsList[beardCard_count-1-i];
            }

            var change_mahjong = null;
            if (i >= bdChildrenCount) {
                change_mahjong = cc.instantiate(templateChild);
                showBeardCard.addChild(change_mahjong);
            }else {
                change_mahjong = showBeardCard.children[i];
            }

            if (change_mahjong == null) {
                break;
            }

            var change_mahjong_sprite = change_mahjong.getComponent(cc.Sprite);

            if (mahjong_id < 0) {
                var side = cc.vv.controlMgr.getSide(localIndex);
                if (side == "myself" || side == "up") {
                    change_mahjong_sprite.spriteFrame = cc.vv.controlMgr.getmyselfAndUpKouSpriteFrame();
                }else {
                    change_mahjong_sprite.spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame(side);
                }
            }else {
                change_mahjong_sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,mahjong_id); 
            }
        };

        showBeardCard.active = true;
    },

    hideAllBeardCardsUI: function () {
        if (this.beardCardsUIArray == null || this.beardCardsUIArray.length == 0) {
            return;
        }
        for (var i = 0; i < this.beardCardsUIArray.length; i++) {
            var beardCardUI = this.beardCardsUIArray[i];
            var bdChildrenCount = beardCardUI.childrenCount;
            if (bdChildrenCount > 1) {
                for (var j = bdChildrenCount-1; j >= 1; j--) {
                    beardCardUI.children[j].removeFromParent(true);
                };
            }
            
            this.beardCardsUIArray[i].active = false;
        };
    },

    paoInitGame: function (isShow) {
        var sides = ["right","up","left"];        
        var gameChild = this.node.getChildByName("game");
        for(var i = 0; i < sides.length; ++i){
            var sideChild = gameChild.getChildByName(sides[i]);
            var holds = sideChild.getChildByName("holds");
            holds.active = isShow;       
        }
    },

    dealHideOtherHolds: function (isShow) {
        var sides = ["right","up","left"];        
        var gameChild = this.node.getChildByName("game");
        for(var i = 0; i < sides.length; ++i){
            var sideChild = gameChild.getChildByName(sides[i]);
            var holds = sideChild.getChildByName("holds");
            for (var i = 0; i < holds.childrenCount; i++) {
                holds.children[i].active = isShow;
            };    
        }
    },

    initGameOtherHolds: function () {
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null) {
            return;
        }
        for(var i in seats){
            var seatData = seats[i];
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            if(localIndex != 0){
                this.initOtherMahjongs(seatData);
                if(i == cc.vv.gameNetMgr.turn){
                    this.initMopai(i,-1);
                }
                else{
                    this.initMopai(i,null);
                }
            }
        }
    },
    
    onGameBeign:function() {

        this.hideAllHupaiTip();
        this.hideChiOptions();
        this.showOps(false);

        this._haveHuGuoTip = false;
        this._isMing = false;

        if (this._moreHuPaiBtnList == null || this._playEfxs == null || this._hupaiLists == null || cc.vv.gameNetMgr.seats == null) {
            return;
        }

        this.hideAllBeardCardsUI();

        //moreHuPaiBtns
        for (var i = 0; i < this._moreHuPaiBtnList.length; i++) {
            this._moreHuPaiBtnList[i].active = false;
            this._showTingsData[i].splice(0,this._showTingsData[i].length);
            this._showTingsData[i] = [];
        };

        for(var i = 0; i < this._playEfxs.length; ++i){
            this._playEfxs[i].node.active = false;
        }
        
        for(var i = 0; i < this._hupaiLists.length; ++i){
            for(var j = 0; j < this._hupaiLists[i].childrenCount; ++j){
                this._hupaiLists[i].children[j].active = false;
            }
        }
        
        for(var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i){
            var seatData = cc.vv.gameNetMgr.seats[i];
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);        
            var hupai = this._hupaiTips[localIndex];
            if (cc.vv.gameNetMgr.conf.opType === 4) {
                this._hupaiTips[localIndex].getChildByName('sprLaolaolong').active = false;
                this._hupaiTips[localIndex].getChildByName('sprLaolong').active = false;
                this._hupaiTips[localIndex].getChildByName('sprShaolong').active = false;
                this._hupaiTips[localIndex].getChildByName('sprKan').active = false;
                this._hupaiTips[localIndex].getChildByName('sprLouzi').active = false;
                this._hupaiTips[localIndex].getChildByName('sprZimo').active = false;
            }
            if (cc.vv.gameNetMgr.conf.opType === 2) {
                this._hupaiTips[localIndex].getChildByName('sprLaolaolong').active = false;
                this._hupaiTips[localIndex].getChildByName('sprLaolong').active = false;
                this._hupaiTips[localIndex].getChildByName('sprShaolong').active = false;
            }
            hupai.active = seatData.hued;
            
            if(seatData.hued){
                
                var hu_type = -1;//seatData.GameType;
                if (cc.vv.gameNetMgr.opType == 1) {
                    hu_type = seatData.cgType;
                }else if (cc.vv.gameNetMgr.opType == 2) {
                    hu_type = seatData.GameType;
                }
                this.setHupaiSpr(localIndex, hu_type);
            }
            
            if(seatData.huinfo){
                for(var j = 0; j < seatData.huinfo.length; ++j){
                    var info = seatData.huinfo[j];
                    if(info.ishupai){
                        this.initHupai(localIndex,info.pai);    
                    }
                }
            }
        }

        this.hideAllHuaPai();
        
        this.hideChupai();
        this.initMJScale();
        var sides = ["right","up","left"];        
        var gameChild = this.node.getChildByName("game");
        for(var i = 0; i < sides.length; ++i){
            var sideChild = gameChild.getChildByName(sides[i]);
            var holds = sideChild.getChildByName("holds");

            holds.x = this.otherHoldPos[sides[i]].posX;
            holds.y = this.otherHoldPos[sides[i]].posY;

            var mahjongPosYArray = null;
            if (sides[i] == "left") {
                mahjongPosYArray = this.leftRightMahjongPosY[1];
            }else if (sides[i] == "right") {
                mahjongPosYArray = this.leftRightMahjongPosY[0];
            }

            var holds_length = holds.childrenCount;
            for(var j = 0; j < holds_length; ++j){
                var nc = holds.children[j];
                nc.active = true;
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;
                if (mahjongPosYArray != null && mahjongPosYArray.length == holds_length) {
                    nc.y = mahjongPosYArray[j];
                }
                var sprite = nc.getComponent(cc.Sprite); 
                sprite.spriteFrame = cc.vv.controlMgr.holdsEmpty[i+1];
                nc.removeAllChildren();
            }            
        }
      
        if(cc.vv.gameNetMgr.gamestate == "" && cc.vv.replayMgr.isReplay() == false){
            return;
        }

        this.gameRoot.active = true;
        this.prepareRoot.active = false;
        this.initMahjongs();
        // this.syncTuiDao();
        this.initGameOtherHolds();
        
        this.showChupai();
        this.setupReconnect()
        if(cc.vv.gameNetMgr.curaction != null){
            this.showAction(cc.vv.gameNetMgr.curaction);
            // cc.vv.gameNetMgr.curaction = null;
        }
        else
        {
            this.showAction(null);
            this.iCanTing = false;
        }
        
        this.checkQueYiMen();

        var conf = cc.vv.gameNetMgr.conf;
        if (conf && conf.opType == 2 && cc.vv.gameNetMgr.gamestate == "runSelect") {
            this.dealHideOtherHolds(false);
        }else if (conf && conf.opType == 1 && conf.paoType) {
            var is_show_pao = (cc.vv.gameNetMgr.numOfGames % 4 == 1)?true:false;
            if (conf.reset_count == 1) {
                is_show_pao = true;
            }
            if ((cc.vv.gameNetMgr.gamestate == "begin" || cc.vv.gameNetMgr.gamestate == "xiapao") && is_show_pao) {
                this.paoInitGame(false);
            }else {
                var data = [];
                for (var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); i++) {
                    var xiapao = cc.vv.gameNetMgr.seats[i].xiapao;
                    data.push(xiapao);
                };
                cc.vv.gameNetMgr.dispatchEvent('game_xiapao_begin',data);
            }
        } 
    },
    setHuaPaiList: function () {
        var gameChild = this.node.getChildByName("game");
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            var side = sides[i];
            var sideChild = gameChild.getChildByName(side);
            var huapaiNode = sideChild.getChildByName("huaPaiList");
            this._huaPaiList[i] = [];
            for (var j = 0; j < huapaiNode.childrenCount; j++) {
                var sprite = huapaiNode.children[j].getComponent(cc.Sprite);
                this._huaPaiList[i].push(sprite);
            };
        } 
    },

    getMyselfHuapai: function (userid) {
        var seatData = cc.vv.gameNetMgr.getSeatByID(userid);
        var holds = seatData.holds;
        var localHuapai = [];
        if (holds == null || holds.length == 0) {
            return localHuapai;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        for (var i = holds.length-1; i >= 0; i--) {
            var mjType = cc.vv.controlMgr.getMahjongType(holds[i]);
            if (mjType == 5) {
                var huaMJid = holds[i];
                seatData.holds.splice(i, 1);
                localHuapai.push(huaMJid);
            }
        };

        return localHuapai;
    },

    sendHua: function (userid) {
        var localHuapais = this.getMyselfHuapai(userid);
        if (localHuapais != null && localHuapais.length > 0) {
            cc.log("sendHua localHuapais = ", localHuapais);
            cc.vv.net.send("buhua", localHuapais);
            return true;
        }
        return false;
    },

    showHuaPai: function (userid, data) {
        if (this._huaPaiList == null) {
            return;
        }
        
        var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(userid);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatindex);

        var pre = cc.vv.controlMgr.getFoldPre(localIndex);

        var huapaiList = cc.vv.gameNetMgr.seats[seatindex].buhua;
        var seatHuapaiLength = huapaiList.length;
        var seatMaxHuapaiLength = this._huaPaiList[localIndex].length;
        for (var i = 0; i < seatHuapaiLength; i++) {
            var index = i;
            if (localIndex == 0) {
                index = (seatMaxHuapaiLength-1)-i;
            }
            var sprite = this._huaPaiList[localIndex][index];
            sprite.node.active = true;
            var mjid = huapaiList[i];
            this.setSpriteFrameByMJID(pre,sprite,mjid);
        };
        
        if (seatHuapaiLength < seatMaxHuapaiLength) {
            for (var i = seatHuapaiLength; i < seatMaxHuapaiLength; i++) {
                var index = i;
                if (localIndex == 0) {
                    index = i - seatHuapaiLength;
                }
                var sprite = this._huaPaiList[localIndex][index];
                sprite.node.active = false;
            };
        }
    },

    hideAllHuaPai: function () {
        if (this._huaPaiList == null) {
            return;
        }
        for (var i = 0; i < this._huaPaiList.length; i++) {
            for (var j = 0; j < this._huaPaiList[i].length; j++) {
                var sprite = this._huaPaiList[i][j];
                sprite.node.active = false;
            };
        };
    },

    //同步推倒断线后处理
    syncTuiDao:function()
    {
        // var seats = cc.vv.gameNetMgr.seats;
        // for(var i in seats){
        //     var seatData = seats[i];
        //     var userId=seatData.userid;
        //     var holds=seatData.holds;
        //     cc.log("seatData", seatData)
        //     cc.log("userId", userId)
        //     cc.log("holds", holds)
        //     cc.log("isTing", seatData.isting)
        //     if(seatData.isting)
        //     {
        //         this.showTingHoldsSomeone(userId,holds);
        //         if(cc.vv.gameNetMgr.conf.type == cc.vv.gameName)
        //         {
        //             self._hasTuidao=true;
        //         }
        //     }
        // }
    },

    onMJClicked:function(event){
        return true;
    },
    
    //出牌
    shoot:function(mjId){
        if(mjId == null){
            return;
        }

        if (this.isTing)
        {
            cc.log("cc.vv.net.send('ting',mjId)", mjId)
            
            if (this._isMing == true) {
                cc.vv.net.send('ming',mjId);
            }else {
                cc.vv.net.send('ting',mjId);
            }

            // this.isTing = false;
            // this._isMing = false;
            // this.clearTingTip();
        }
        else
        {
            cc.log("cc.vv.net.send('chupai',mjId)", mjId)
            cc.vv.net.send('chupai',mjId);
        }

        this.iCanTing = false
    },

    clearTingTip:function()
    {
        var holds = cc.find("game/myself/holds", this.node);
        var mjcnt = holds.childrenCount;
        
        for (var i = 0; i < mjcnt; i++) {
            var mjnode = holds.children[i];
            if (mjnode.childrenCount == 0) {
                continue;
            }
            var tingTip = mjnode.getChildByName("spTing");
            if (tingTip) {
                tingTip.removeFromParent(true);
                tingTip = null;
            }
        }
    },
    
    getMJIndex:function(side,index){
        if(side == "right" || side == "up"){
            return 13 - index;
        }
        return index;
    },
    
    initMopai:function(seatIndex,pai){
        console.log("initMopai");
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.controlMgr.getSide(localIndex);
        var pre = cc.vv.controlMgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");

        var lastIndex = this.getMJIndex(side,13);
        var nc = holds.children[lastIndex];

        nc.scaleX = 1.0;
        nc.scaleY = 1.0;
        
        console.log("initMopai pai = ", pai);          
        if(pai == null){
            nc.active = false;
        }
        else if(pai >= 0){
            nc.active = true;
            if(side == "up"){
                nc.scaleX = 0.72;
                nc.scaleY = 0.72;                    
            }
            if(this._hasTuidao==false)
            {
                 var sprite = nc.getComponent(cc.Sprite);
                 sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,pai);
            }
        }
        else if(pai != null){
            nc.active = true;

            if(side == "up")
            {
                if(this._hasTuidao)
                {
                    nc.scaleX = 0.72;
                    nc.scaleY = 0.72;
                }else{
                    nc.scaleX = 1;
                    nc.scaleY = 1;
                }
            }
            if(this._hasTuidao==false){
                var sprite = nc.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.controlMgr.getHoldsEmptySpriteFrame(side);
            }
        }
    },
    
    initEmptySprites:function(seatIndex){
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.controlMgr.getSide(localIndex);
        var pre = cc.vv.controlMgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");
        var spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame(side);
        for(var i = 0; i < holds.childrenCount; ++i){
            var nc = holds.children[i];
            nc.scaleX = 1.0;
            nc.scaleY = 1.0;
            
            var sprite = nc.getComponent(cc.Sprite); 
            sprite.spriteFrame = spriteFrame;
        }
    },

    initDealOtherHolds: function (selectCount) {
        var gameManager = cc.vv.gameNetMgr;
        var seats = gameManager.seats;
        if (seats == null) {
            return;
        }
        for (var index in seats) {
            if (index != gameManager.seatIndex) {
                var hold_count = seats[index].bright.length + seats[index].secret.length + seats[index].operation.length + selectCount;
                cc.log(" ------------------- initDealOtherHolds hold_count = ", hold_count);
                this.initOtherMahjongs(seats[index], hold_count, true);
            };
        }
    },

    initOtherMahjongs:function(seatData, setupHoldsCount, isSetup){
        //console.log("seat:" + seatData.seatindex);
        console.log("initOtherMahjongs");
        var localIndex = this.getLocalIndex(seatData.seatindex);
        if(localIndex == 0){
            return;
        }
        var side = cc.vv.controlMgr.getSide(localIndex);
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        var sideHolds = sideRoot.getChildByName("holds");

        var num = this.getChiPengGangNumber(seatData);
        
        this.setOtherHoldsPos(num, side, sideHolds);

        for(var i = 0; i < num; ++i){
            var idx = this.getMJIndex(side,i);
            sideHolds.children[idx].active = false;
        }

        var holds = seatData.holds;
        if (isSetup == null) {
            holds = this.sortHolds(seatData);
        }
        
        var conf = cc.vv.gameNetMgr.conf;
        if (!cc.vv.replayMgr.isReplay() && conf && conf.type == cc.vv.brightGameName && conf.opType == 2) {
            holds = null;
        }

        var pre = cc.vv.controlMgr.getFoldPre(localIndex);
        var bsNum = this.initBrightMahjongs(seatData, sideHolds, side, pre, num);

        if(holds != null && holds.length > 0){
            this.setOtherReplayHolds(holds, num, bsNum, side, pre);

        }else if (holds == null) {
            this.setOtherBSOperationHolds(num, bsNum, setupHoldsCount, side, localIndex);

        }

        if (cc.vv.replayMgr.isReplay()) {
           bsNum =  holds.length;
        }
        var stand_mahjong_count = sideHolds.childrenCount - num - bsNum;
        if (bsNum == 0) {
            return;
        }
        this.setShowLeftOrRightPosY(sideHolds, side, bsNum, stand_mahjong_count, num);
    },

    setOtherReplayHolds: function (holds, num, bsNum, side, pre) {
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        var sideHolds = sideRoot.getChildByName("holds");

        var holds_length = holds.length;

        for(var i = 0; i < holds_length; ++i){
            var index = i + num + bsNum;
            var idx = this.getMJIndex(side,index);
            var sprite = sideHolds.children[idx].getComponent(cc.Sprite);
            if(side == "up"){
                sprite.node.scaleX = 0.72;
                sprite.node.scaleY = 0.72;
            }
            sprite.node.active = true;
            sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,holds[i]);

            this.setOtherMahjongsHunIcon(holds[i], side, sprite.node);
        }

        if(holds_length + num + bsNum == 13){
            var lasetIdx = this.getMJIndex(side,13);
            sideHolds.children[lasetIdx].active = false;
            sideHolds.children[lasetIdx].removeAllChildren();
        }
    },

    setOtherBSOperationHolds: function (num, bsNum, setupHoldsCount, side, localIndex) {
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        var sideHolds = sideRoot.getChildByName("holds");

        var bsHoldsCount = setupHoldsCount;
        var sideHoldsCount = sideHolds.childrenCount;
        var init_index = num + bsNum;
        if (setupHoldsCount == null) {
            bsHoldsCount = sideHoldsCount;
        }else if (setupHoldsCount < init_index) {
            bsHoldsCount = init_index;
        }
        
        for(var j = init_index; j < bsHoldsCount; ++j){
            var index = this.getMJIndex(side,j);
            var mahjong = sideHolds.children[index];
            mahjong.active = true;
            mahjong.scaleX = 1.0;
            mahjong.scaleY = 1.0;
            var sprite = mahjong.getComponent(cc.Sprite); 
            sprite.spriteFrame = cc.vv.controlMgr.holdsEmpty[localIndex];
            mahjong.removeAllChildren();
        }

        if (bsHoldsCount < sideHoldsCount) {
            for (var i = bsHoldsCount; i < sideHoldsCount; i++) {
                var index = this.getMJIndex(side,i);
                sideHolds.children[index].active = false;
            }; 
        }

        // var lasetIdx = this.getMJIndex(side,13);
        // sideHolds.children[lasetIdx].active = false;
    },

    setShowLeftOrRightPosY: function (sideHolds, side, fall_mahjong_count, stand_mahjong_count, state_count) {
        var posYArray = null;
        if (side == "left") {
            posYArray = this.leftRightMahjongPosY[1];
        }else if (side == "right") {
            posYArray = this.leftRightMahjongPosY[0];
        };

        if (posYArray == null || posYArray.length == 0) {
            return;
        }

        var fall_gap = 31, stand_gap = 27, d_value_gap = 4;
        var total_mahjong_count = fall_mahjong_count + stand_mahjong_count;

        for (var i = 0; i < total_mahjong_count; i++) {
            var idx = this.getMJIndex(side,i + state_count);
            var mahjong = sideHolds.children[idx];

            var add_gap = 0;
            if (i < fall_mahjong_count) {
                add_gap = d_value_gap*i;
            }else {
                add_gap = d_value_gap*fall_mahjong_count;
            }

            if (side == "left") {
                add_gap = -add_gap;
            }

            mahjong.y = posYArray[idx] + add_gap;
        };
        
    },

    initBrightMahjongs: function (seatData, sideHolds, side, pre, num) {
        var bsNum = 0;
        var brights = seatData.bright;//亮起的牌
        if (brights != null && brights.length > 0) {
            var brights_len = brights.length;
            //亮起的牌
            for (var i = 0; i < brights_len; i++) {
                var idx = this.getMJIndex(side,i + num + bsNum);
                var sprite = sideHolds.children[idx].getComponent(cc.Sprite); 
                if(side == "up"){
                    sprite.node.scaleX = 0.72;
                    sprite.node.scaleY = 0.72;                    
                }
                sprite.node.active = true;
                sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,brights[i]);

                this.setOtherMahjongsHunIcon(brights[i], side, sprite.node);
            };
            bsNum = bsNum + brights_len;
        }

        var secrets = seatData.secret;//扣起的牌
        cc.log("--------------- initBrightMahjongs secrets = ", secrets);
        if (secrets != null && secrets.length > 0) {
            var secrets_len = secrets.length;
            //扣起的牌
            for (var i = 0; i < secrets_len; i++) {
                var idx = this.getMJIndex(side,i + num + bsNum);
                var sprite = sideHolds.children[idx].getComponent(cc.Sprite);
                if(side == "up"){
                    sprite.node.scaleX = 40/38;
                    sprite.node.scaleY = 1;
                }
                sprite.node.active = true;
                sprite.spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame(side);
                // this.setSpriteFrameBySide(side,sprite);
            };
            bsNum = bsNum + secrets_len;
        }

        return bsNum;
    },

    setOtherBrightSecretHolds: function (sideHolds, holds, pre, side, num, bsNum, scaleX, scaleY, isBright) {
        var bright_secret_num = 0;
        
        if (holds != null && holds.length > 0) {
            var holds_len = holds.length;
            for (var i = 0; i < holds_len; i++) {
                var idx = this.getMJIndex(side,i + num + bsNum);
                var sprite = sideHolds.children[idx].getComponent(cc.Sprite); 
                if(side == "up"){
                    sprite.node.scaleX = scaleX;
                    sprite.node.scaleY = scaleY;                    
                }
                sprite.node.active = true;

                if (isBright == true) {
                    sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,holds[i]);
                    this.setOtherMahjongsHunIcon(holds[i], side, sprite.node);
                }else {
                    this.setSpriteFrameBySide(side,sprite);
                }
            };
            bright_secret_num = holds_len;
        }

        return bright_secret_num;
    },

    setOtherHoldsPos: function (num, side, sideHolds) {
        var totalGap = ((num/3)-1) * 5;
        if (side == "left") {
            var mahjong_gap = 4 * num;
            totalGap += mahjong_gap;
            sideHolds.y = this.otherHoldPos[side].posY - totalGap;
        }else if (side == "right") {
            var mahjong_gap = 4 * num - 30;
            totalGap += mahjong_gap;
            sideHolds.y = this.otherHoldPos[side].posY + totalGap;
        }else if (side == "up") {
            sideHolds.x = this.otherHoldPos[side].posX - totalGap;
        }
    },

    setOtherMahjongsHunIcon: function (mahjongId, side, mahjongNode) {
        if (cc.vv.gameNetMgr.getHoldEqualHunValue(mahjongId)) {
            var args = this.setOtherHunIconAttr(side);
            var spNodeChildCount = mahjongNode.children.length;
            if (spNodeChildCount == 0) {
                cc.vv.hunpaiIcon.addIcon(mahjongNode,args);
            }else if (spNodeChildCount > 0) {

                var icon = mahjongNode.getChildByName("hupaiIcon");
                if (icon) {
                   // icon.setPosition(args.pos); 
                }
            }
        }else {

            var icon = mahjongNode.getChildByName("hupaiIcon");
            if (icon) {
               icon.removeFromParent(true); 
               icon = null;
            }
        }
    },

    setOtherHunIconAttr: function (side) {

        //mask
        var args = {};
        if (side == "left") {
            args.scaleX = 52 / 75;
            args.scaleY = 47 / 110;
        }else if (side == "right") {
            args.scaleX = 52 / 75;
            args.scaleY = 47 / 110;
        }else if (side == "up") {
            args.scaleX = 54 / 75;
            args.scaleY = 80 / 110;
        }

        return args;

         /*
        *   斜三角的混icon
        *   
        var args = {};
        if (side == "left") {
            args.rotate = 90;
            args.pos = cc.v2(0, 8);
            args.scaleX = 0.58;
            args.scaleY = 0.58;
        }else if (side == "right") {
            args.rotate = -90;
            args.pos = cc.v2(0, 7);
            args.scaleX = 0.58;
            args.scaleY = 0.58;
        }else if (side == "up") {
            args.rotate = 0;
            args.pos = cc.v2(-1, -4);
            args.scaleX = 1;
            args.scaleY = 1;
        }

        return args;
        */
    },
    
    sortHolds:function(seatData){
        var holds = seatData.holds;
        var conf = cc.vv.gameNetMgr.conf;
        if (!cc.vv.replayMgr.isReplay() && conf && conf.type == cc.vv.brightGameName && conf.opType == 2) {
            holds = seatData.operation;
        }

        if(holds == null){
            return null;
        }
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = holds.length;
        if (!cc.vv.replayMgr.isReplay() && conf && conf.type == cc.vv.brightGameName && conf.opType == 2) {
            if (seatData.bright != null) {
                l += seatData.bright.length;
            }

            if (seatData.secret != null) {
                l += seatData.secret.length;
            }
        } 
        if( l == 2 || l == 5 || l == 8 || l == 11 || l == 14){
            mopai = holds.pop();
        }
        
        // var dingque = seatData.dingque;
        // cc.vv.controlMgr.sortMJ(holds,dingque);

        //add hunpai
        cc.vv.controlMgr.sortMJ(holds,true);
        
        //将摸牌添加到最后
        if(mopai != null){
            holds.push(mopai);
        }
        return holds;
    },

    initMahjongs:function(){
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        cc.log("initMahjongs holds = ", holds);
        if(holds == null){
            return;
        }

        //初始化手牌
        var lackingNum = this.getChiPengGangNumber(seatData);

        //亮起的牌、扣起的牌
        var bsNum = 0;

        var bright_scaleX = 75/54, bright_scaleY = 110/80;
        var bright_num = this.setMyBrightSecretHolds(seatData.bright, lackingNum, bsNum, bright_scaleX, bright_scaleY, true);
        bsNum = bsNum + bright_num;

        var secret_scaleX = 75/36, secret_scaleY = 110/57;
        var secret_num = this.setMyBrightSecretHolds(seatData.secret, lackingNum, bsNum, secret_scaleX, secret_scaleY, false);
        bsNum = bsNum + secret_num;
       

        var hold_length = holds.length;
        for(var i = 0; i < hold_length; ++i){
            var mjid = holds[i];
            var index = i + lackingNum + bsNum;
            if (index >= 14 && cc.vv.alert) {

                // console.log(holds);
                // cc.vv.alert.show("数据错误:手牌下标越界，请解散房间！");
                
                if (cc.vv.net) {
                    cc.vv.net.endActiveSocket();
                }
                return;
            };
            var sprite = this._myMJArr[index];
            sprite.node.active = true;
            sprite.node.mjId = mjid;
            sprite.node.x = this._myMJPosX[index];
            sprite.node.y = 0;
            sprite.node.isTouch = true;

            var hunIconPos = {posX: 8, posY: -10};

            if (seatData.isming == true) {
                sprite.node.scaleX = 75/54;
                sprite.node.scaleY = 110/80;
                sprite.node.isTuidao = true;
                this.setSpriteFrameByMJID("B_",sprite,mjid);

                hunIconPos = {posX: 0, posY: 0};
            }else {
                sprite.node.scaleX = 1;
                sprite.node.scaleY = 1;
                sprite.node.isTuidao = false;
                this.setSpriteFrameByMJID("M_",sprite,mjid);
            }

            this.setMahjongsHunIcon(sprite.node, sprite.node.mjId, cc.v2(hunIconPos.posX, hunIconPos.posY));
        }

        for(var i = 0; i < lackingNum; ++i){
            this.hideHoldMahjong(i);
        }

        var mopaiIndex = lackingNum + bsNum + hold_length;
        for(var i = mopaiIndex; i < this._myMJArr.length; ++i){
            this.hideHoldMahjong(i);
        }
    },

    setMyBrightSecretHolds: function (holds, lackingNum, bsNum, scaleX, scaleY, isBright) {
        var bright_secret_num = 0;
        if (holds != null && holds.length > 0) {
            var holds_len = holds.length;
            //亮起的牌
            for (var i = 0; i < holds_len; i++) {
                var index = i + lackingNum + bsNum;
                var mjid = holds[i];
                var sprite = this._myMJArr[index];
                sprite.node.active = true;
                sprite.node.mjId = mjid;
                sprite.node.isTouch = false;
                sprite.node.x = this._myMJPosX[index];
                sprite.node.y = 0;
                sprite.node.scaleX = scaleX;
                sprite.node.scaleY = scaleY; 

                if (isBright == true) {
                    this.setSpriteFrameByMJID("B_",sprite,mjid);
                    this.setMahjongsHunIcon(sprite.node, sprite.node.mjId, cc.v2(-1, -4));
                }else {
                    this.setSpriteFrameBySide("myself",sprite);
                }
                
            };

            bright_secret_num = holds_len;
        }

        return bright_secret_num;
    },

    setMahjongsHunIcon: function (mahjongNode, mahjongId, position) {
        if (cc.vv.gameNetMgr.getHoldEqualHunValue(mahjongId)) {
            var spNodeChildCount = mahjongNode.children.length;
            if (spNodeChildCount == 0) {
                var args = {
                    pos:position,
                    scaleX:1,
                    scaleY:1,
                    rotate:0
                };
                cc.vv.hunpaiIcon.addIcon(mahjongNode,args);
            }else if (spNodeChildCount > 0) {

                var icon = mahjongNode.getChildByName("hupaiIcon");
                if (icon) {
                    // icon.setPosition(position); 
                }
            }
        }else {

            var icon = mahjongNode.getChildByName("hupaiIcon");
            if (icon) {
               icon.removeFromParent(true); 
               icon = null;
            }
        }
    },

    hideHoldMahjong: function (index) {
        var sprite = this._myMJArr[index];
        sprite.node.x = this._myMJPosX[index];
        sprite.node.y = 0;
        sprite.node.scaleX = 1;
        sprite.node.scaleY = 1;

        this.removeHunIcon(sprite.node);

        sprite.node.mjId = null;
        sprite.spriteFrame = null;
        sprite.node.active = false;
    },

    refreshMopai:function(){
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if(holds == null){
            return;
        }
        var lackingNum = this.getChiPengGangNumber(seatData);
        for(var i = lackingNum + holds.length; i < this._myMJArr.length; ++i){
            this.hideHoldMahjong(i);
        }
    },

    getChiPengGangNumber: function (seatData) {
        var lackingNum = 0;
        if (seatData.pengs != null && seatData.angangs != null && seatData.diangangs != null && seatData.wangangs != null && seatData.chis != null) {
            lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length + seatData.chis.length) * 3;
        }

        return lackingNum;
    },

    setSpriteFrameByMJID:function(pre,sprite,mjid){
        sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,mjid);
        sprite.node.active = true;
    },

    setSpriteFrameBySide:function(side,sprite){
        sprite.spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame(side);
        sprite.node.active = true;
    },

    //如果玩家手上还有缺的牌没有打，则只能打缺牌
    checkQueYiMen:function(){
        return;
        if(cc.vv.gameNetMgr.conf==null || cc.vv.gameNetMgr.conf.type != "xlch" || !cc.vv.gameNetMgr.getSelfData().hued){
            //遍历检查看是否有未打缺的牌 如果有，则需要将不是定缺的牌设置为不可用
            var dingque = cc.vv.gameNetMgr.dingque;
    //        console.log(dingque)
            var hasQue = false;
            if(cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn){
                for(var i = 0; i < this._myMJArr.length; ++i){
                    var sprite = this._myMJArr[i];
    //                console.log("sprite.node.mjId:" + sprite.node.mjId);
                    if(sprite.node.mjId != null){
                        var type = cc.vv.controlMgr.getMahjongType(sprite.node.mjId);
                        if(type == dingque){
                            hasQue = true;
                            break;
                        }
                    }
                }            
            }

    //        console.log("hasQue:" + hasQue);
            for(var i = 0; i < this._myMJArr.length; ++i){
                var sprite = this._myMJArr[i];
                if(sprite.node.mjId != null){
                    var type = cc.vv.controlMgr.getMahjongType(sprite.node.mjId);
                    if(hasQue && type != dingque){
                        sprite.node.getComponent(cc.Button).interactable = false;
                    }
                    else{
                        sprite.node.getComponent(cc.Button).interactable = true;
                    }
                }
            }   
        }
        else{
            if(cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn){
                for(var i = 0; i < 14; ++i){
                    var sprite = this._myMJArr[i]; 
                    if(sprite.node.active == true){
                        sprite.node.getComponent(cc.Button).interactable = i == 13;
                    }
                }
            }
            else{
                for(var i = 0; i < 14; ++i){
                    var sprite = this._myMJArr[i]; 
                    if(sprite.node.active == true){
                        sprite.node.getComponent(cc.Button).interactable = true;
                    }
                }
            }
        }
    },
    
    getLocalIndex: function (index) {
        var ret = cc.vv.SelectRoom.getLocalIndex(index);
        return ret;

    },

    showChiOptions: function (pai, types) {
        cc.log("showChiOptions");

        this.showOps(false);

        var chiOpt = cc.find('game/chiOpt', this.node);
        chiOpt.active = true;

        var body = chiOpt.getChildByName('body');
        var chis = body.getChildByName('chis');
        var chiCount = chis.childrenCount;
        var chiNum = types.length;

        var realwidth = cc.director.getVisibleSize().width;
        var scaleX = realwidth/1280;
        var chiOptBg = chiOpt.getChildByName('bg');
        var chiTag = body.getChildByName('opChi');
        var chiTipWidth = this.chiTip.data.width;
        if (chiTipWidth == null || chiTipWidth <= 0) {
            chiTipWidth = 165;
        }
        chiOptBg.width = chiTipWidth * chiNum + 20 * (chiNum-1) + (chiTag.width*0.7+ 20)*2 + 87;

        var distanceCount = chiCount - chiNum;
        if (distanceCount > 0) {
            for (var i = 0; i < distanceCount; i++) {
                var index = (chiCount-1) - i;
                var chi = chis.children[index];
                chi.removeFromParent(true);
            };
        }else if (distanceCount < 0) {
            distanceCount = Math.abs(distanceCount);
            for (var i = 0; i < distanceCount; i++) {
                var addChi = cc.instantiate(this.chiTip);
                chis.addChild(addChi);
            };
        }

        for (var i = 0; i < chiNum && i < chis.childrenCount; i++) {
            var chiIndex = chiNum - (i+1);
            var chi = chis.children[chiIndex];
            var arr = cc.vv.gameNetMgr.getChiArr(types[i] * 100 + pai);
            var chiType = types[i];

            var chiScript = chi.getComponent("ChiTip");
            if (chiScript) {
                chiScript.init(arr, chiType);
            }
        };
    },

    hideChiOptions: function() {
        var chiOpt = cc.find('game/chiOpt', this.node);
        chiOpt.active = false;
    },

    isChiOptionsActive: function () {
        var chiOpt = cc.find('game/chiOpt', this.node);
        return chiOpt.active;
    },

    playTip:function(){
        if (this.node == null) {
            return;
        }
        var tipNode = this.layerRoot.getChildByName("penggangTip");
        if (tipNode.active == true) {
            return;
        }
        tipNode.active = true;
        var ani = tipNode.getComponent("cc.Animation");
        ani.on('finished', this.onFinished, this);
        ani.play("pgtip");
    },

    onFinished: function () {
        if (this.node == null) {
            return;
        }
        var tipNode = this.layerRoot.getChildByName("penggangTip");
        tipNode.active = false;
    },

    getHuMjData: function (index) {
        var seatTingData = this._showTingsData[index];
        cc.vv.controlMgr.sortMJ(seatTingData, false);

        var mjData = [];
        for(var i = 0; i < 4; ++i){
            mjData[i] = [];
        };
        for (var i = 0; i < seatTingData.length; i++) {
            var mjid = seatTingData[i];
            var mjType = cc.vv.controlMgr.getMahjongType(mjid);
            var mjIndex = parseInt(mjType);
            if (mjIndex > 3) {
                mjIndex = 3;
            }
            mjData[mjIndex].push(mjid);
        };

        return mjData;
    },

    getBtnIndex: function (name) {
        var index = -1;
        switch (name) {
            case "myselfBtn":
                index = 0;
                break;
            case "rightBtn":
                index = 1;
                break;
            case "upBtn":
                index = 2;
                break;
            case "leftBtn":
                index = 3;
                break;
        }

        return index;
    },

    onMoreHuClicked: function (event) {

        var seatBtnIndex = this.getBtnIndex(event.target.name);
        var mjData = this.getHuMjData(seatBtnIndex);

        var huTips = cc.instantiate(this.huTips);
        huTips.x = -this.node.width*0.5;
        huTips.y = -this.node.height*0.5;
        this.layerRoot.addChild(huTips);
        var script = huTips.getComponent("HuTips");
        if (script) {
            var conf = cc.vv.gameNetMgr.conf;
            var isWind = true;
            if (conf) {
                var daihun = conf.daihun;
                var daifeng = conf.daifeng;
                if (daifeng != null && daifeng == false && daihun != null && daihun == true) {
                    isWind = false;
                }
            }
            
            script.init(mjData, isWind);
        }
    },

    setFlopData: function (data) {
        if (this.flopArray != null && this.flopArray.length > 0) {
            this.flopArray.splice(0, this.flopArray.length);
            this.flopArray = [];
        }else if (this.flopArray == null) {
            this.flopArray = [];
        }

        if (data.holds == null || data.holds.length == 0) {
            return;
        }

        var flopCount = data.holds.length;
        cc.vv.gameNetMgr._gameOverDelayTime += (flopCount+1)*1000;

        for (var i = 0; i < flopCount; i++) {
            this.flopArray.push(data.holds[i]);
        };

        this.flopScore = data.score || 0;

        var self = this;
        setTimeout(function () {
            self.addFlopView();
        }, 1500);
    },

    addFlopView: function () {
        if (this.flopArray == null || this.flopArray.length == 0) {
            return;
        }
        var flopCount = this.flopArray.length;

        var flopview = cc.instantiate(this.flopPrefab);
        var flopScript = flopview.getComponent("ShowFlops");
        if (flopScript) {
            flopScript.init(this.flopArray, this.flopScore);
        }
        this.layerRoot.addChild(flopview);

        this.flopArray.splice(0, flopCount);
        this.flopArray = [];
        this.flopScore = -1;
    },

    clearHoldsIcon: function () {
        var gameChild = this.node.getChildByName("game");
        var myselfChild = gameChild.getChildByName("myself");
        var myholds = myselfChild.getChildByName("holds");

        for (var i = 0; i < myholds.children.length; i++) {
            var hold = myholds.children[i];
            if (hold.children.length > 0) {
                var icon = hold.getChildByName("hupaiIcon");
                if (icon) {
                    icon.removeFromParent(true);
                    icon = null;
                }
            }
        };
    },

    initMahjongsPos: function () {
        var myMahjongLength = this._myMJArr.length;
        for (var i = 0; i < myMahjongLength; i++) {
            if (this._myMJPosX[i] == null) {
                break;
            }
            this._myMJArr[i].node.x = this._myMJPosX[i];
            this._myMJArr[i].node.y = 0;
        };
    },

    initMJScale: function () {
        var myMahjongLength = this._myMJArr.length;
        for (var i = 0; i < myMahjongLength; i++) {
            this._myMJArr[i].node.scaleX = 1;
            this._myMJArr[i].node.scaleY = 1;
        }; 
    },

    clearOtherHolds:function()
    {
        for(var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); ++i){
            var seatData = cc.vv.gameNetMgr.seats[i];
            seatData.holds=[];
            seatData.isting = false
        }
    },

    chiOperation: function (data) {
        this.hideChiOptions();
        this.hideChupai();

        var seatData = data.detail.seatData;
        var pai = data.detail.pai;
        if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
            this.initMahjongs();
        }
        else {
            this.initOtherMahjongs(seatData);
        }

        var localIndex = this.getLocalIndex(seatData.seatindex);

        this.setplayEfxAndAudio(localIndex, "play_chi", cc.CGameConfigDataModel.getAudioURLByOther("chi"));

        this.showOps(false);
    },

    pengOperation: function (data) {
        this.hideChupai();
        this.hideChiOptions(); 

        var seatData = data.detail;
        var userId=seatData.userid;
        var holds=seatData.holds;
        if(this._hasTuidao==true)
        {
            this.showTingHoldsSomeone(userId,holds);
        }
        else if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
            this.initMahjongs();
        }
        else{
            this.initOtherMahjongs(seatData);
        }
        var localIndex = this.getLocalIndex(seatData.seatindex);
        this.setplayEfxAndAudio(localIndex, "play_peng",cc.CGameConfigDataModel.getAudioURLByOther("peng"));
        
        this.showOps(false);
    },

    setplayEfxAndAudio: function (localIndex, animationName, audioPath) {
        this.playEfx(localIndex,animationName);
        if (cc.vv.gameNetMgr.projectState != 'hideState' && audioPath != "") {
            cc.vv.gameNetMgr.setAudioSFX(-1, localIndex, "Mahjong", audioPath, "");
            // cc.vv.audioMgr.playMJGameSFX(audioPath);
        }
    },

    //胡牌

    showGameHuType: function (data) {

        var seatIndex = data.seatindex;
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);

        var hupai = this._hupaiTips[localIndex];
        hupai.active = true;

        var iszimo = data.iszimo;
        if(!(iszimo && localIndex==0))
        {
            this.initMopai(seatIndex,data.hupai);
        }

        if(cc.vv.replayMgr.isReplay() == true && cc.vv.gameNetMgr.conf.type != "xlch"){
            hupai.active = false;
            var opt = this._opts[localIndex];
            opt.node.active = true;
            
            opt.sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_",data.hupai);
        }

        cc.vv.gameNetMgr._gameOverDelayTime = 2000;

        var gameType = cc.vv.gameNetMgr.conf.opType;
        switch (gameType) {
            case 1:
                var hu_type = data.cgType;
                this.showLYPlayHu(localIndex, hu_type);
                break;
            case 2:
                var hu_type = data.GameType;
                this.showKDJPlayHu(localIndex, hu_type);
                break;

            case 4:
                var hu_type = data.GameType;
                this.showKDJPlayHu(localIndex, hu_type);
                break;

        }
        
    },

    setHupaiSpr: function (localIndex, huType) {
        var hupai = this._hupaiTips[localIndex];

        //显示胡牌类型文字
        var conf = cc.vv.gameNetMgr.conf;
        if (conf == null) {
            return;
        }

        if(typeof(conf.opType) === 'string' ){
            conf.opType = parseInt(conf.opType)
        }

        if (conf.opType == 1) {
            hupai.getChildByName("sprZimo").active = false;
            hupai.getChildByName("sprHu").active = false;
            hupai.getChildByName("sprKan").active = (huType == 1)?true:false;
            hupai.getChildByName("sprLouzi").active = (huType == 2)?true:false;
            
        }else if (conf.opType == 2) {
            hupai.getChildByName("sprZimo").active = (huType == 1)?true:false;
            hupai.getChildByName("sprHu").active = (huType == 2)?true:false;
            hupai.getChildByName("sprKan").active = false;
            hupai.getChildByName("sprLouzi").active = false;
        }
       if(conf.opType===1){
        hupai.getChildByName("sprLaolaolong").active = (huType > 10)?true:false;
        hupai.getChildByName("sprLaolong").active = (huType == 10)?true:false;
        hupai.getChildByName("sprShaolong").active = (huType == 5)?true:false;
       }

    },

    showLYPlayHu: function (localIndex, huType) {

        this.setHupaiSpr(localIndex, huType);

        switch (huType) {
            case 1:
                this.setplayEfxAndAudio(localIndex, "play_kan", "kan.mp3");
                break;
            case 2:
                this.setplayEfxAndAudio(localIndex, "play_louzi", "lou.mp3");
                break;
            case 5:
                this.setplayEfxAndAudio(localIndex, "play_shaolong", "shaolong.mp3");
                break;
            case 10:
                this.setplayEfxAndAudio(localIndex, "play_laolong", "laolong.mp3");
                break;
            default:
                this.setplayEfxAndAudio(localIndex, "play_laolaolong", "laolaolong.mp3");
                break;

        }
        
    },

    showKDJPlayHu: function (localIndex, huType) {

        this.setHupaiSpr(localIndex, huType);

        if(huType == 1){
            var getLName = cc.vv.audioMgr.getLanguageName();
            if (getLName == "Dialect") {
                this.setplayEfxAndAudio(localIndex, "play_zimo", "zimo.mp3");
            }else {
                this.setplayEfxAndAudio(localIndex, "play_zimo", "hu.mp3");
            }
        }else if (huType == 2) {
            this.setplayEfxAndAudio(localIndex, "play_hu", "hu.mp3");
        }else if(huType == 4){
            var getLName = cc.vv.audioMgr.getLanguageName();
           // console.log('3358',getLName);
            if (getLName == "Dialect") {
                this.setplayEfxAndAudio(localIndex, "play_zimo", "zimo.mp3");
            }else {
                this.setplayEfxAndAudio(localIndex, "play_zimo", "hu.mp3");
            }
        }
    },



    showChuPaiOn: function (data) {
        this.showTingOpt(false)
        var seatData = data.detail.seatData;

        //如果是自己，则刷新手牌
        if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex)
        {
            this._mahjongShooted = true;

            this.clearTingTip();
            if(this._hasTuidao==true)
            {
                cc.log("隐藏摸到的手牌")
                this.refreshMopai();
            }
            else
            {
                this.initMahjongs();
            }

        }
        else
        {
            this.initOtherMahjongs(seatData);
        }
        // this.showChupai();
        // this.initMahjongsPos();
        var timeAudio = 0.0001;
        if (cc.vv.replayMgr.isReplay()) {
            timeAudio = 1000;
        }
        setTimeout(function () {
            var audioUrl = cc.vv.controlMgr.getAudioURLByMJID(data.detail.pai);
            cc.vv.gameNetMgr.setAudioSFX(seatData.seatindex, -1, "Mahjong", audioUrl, "");
        }, timeAudio);
        
    },

    /*******************************************
    *** MODEL BEGIN (注释状态) ***
    *** 回放对碰杠等操作的弃状态或者散状态显示 ***
    *******************************************/

    initReplyQi: function () {

        if (this.replayQiArray != null) {
            this.replayQiArray.splice(0, this.replayQiArray.length);
        }
        this.replayQiArray = [];

        var gameChild = this.node.getChildByName("game");

        var replyActionQiNode = gameChild.getChildByName("replyActionQi");
        for (var i = 0; i < replyActionQiNode.childrenCount; i++) {
            replyActionQiNode.children[i].active = false;
            this.replayQiArray.push(replyActionQiNode.children[i]);
        };
    },

    showReplySeatQi: function (seatIndex, actionType) {
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        if (this.replayQiArray[localIndex]) {
            this.replayQiArray[localIndex].active = true;

            var actionSprite = this.replayQiArray[localIndex].getComponent("cc.Sprite");
            if (actionType == 0) {
                actionSprite.spriteFrame = this.replyActionFrames[0];
                setTimeout(function () {
                    this.replayQiArray[localIndex].active = false;
                }.bind(this), 800);

            }else if (actionType == 10) {
                actionSprite.spriteFrame = this.replyActionFrames[1];
            }

            
        }
    },

    /**************** MODEL END ****************/

    /*******************************************
    *** MODEL BEGIN (注释状态) ***
    *** 重写吃碰杠听等操作 ***
    *******************************************/

    initOps: function () {
        var gameChild = this.node.getChildByName("game");
        var opts = gameChild.getChildByName("ops");
        this._options = opts;

        this.showOps(false);
    },

    showOps: function (isShow) {
        
        if (isShow == false) {
            this.removeAllOption();
        }

        var options = this._options.getChildByName("options");
        options.active = isShow;

        var btnGuo = this._options.getChildByName("btnGuo");
        btnGuo.active = isShow;

        this._options.active = isShow;
    },

    addOptions: function (actionData) {
        this.removeAllOption();

        var option_length = actionData.playArray.length;
        if (option_length <= 0) {
            this.showOps(false);
            return;
        }

        cc.vv.gameNetMgr.showErrorTip(actionData.gangIdArray, "actionData.gangIdArray");
        var gang_length = actionData.gangIdArray.length;
        var gang_show_index = 0;

        cc.vv.gameNetMgr.showErrorTip(this._options, "this._options");
        var options = this._options.getChildByName("options");
        cc.vv.gameNetMgr.showErrorTip(options, "options");

        cc.vv.gameNetMgr.showErrorTip(cc.vv.prefabMgr, "cc.vv.prefabMgr");
        var playOptionPrefab = cc.vv.prefabMgr.getPrefab("prefabs/Games/MJGame/ChuPai/Common/PlayOption");
        cc.vv.gameNetMgr.showErrorTip(playOptionPrefab, "playOptionPrefab");

        for (var i = 0; i < option_length; i++) {

            var playKey = actionData.playArray[i];

            var playOption = cc.instantiate(playOptionPrefab);
            cc.vv.gameNetMgr.showErrorTip(playOption, "playOption");

            var poScript = playOption.getComponent('PlayOption');
            cc.vv.gameNetMgr.showErrorTip(poScript, "poScript");
            if (poScript) {
                var mjid = actionData.mjId;
                if (playKey == "gang") {
                    if (gang_length > 0 && actionData.gangIdArray[gang_show_index] >= 0) {
                        mjid = actionData.gangIdArray[gang_show_index];
                    }else {
                       mjid = -1; 
                    }
                    
                    gang_show_index++;
                }

                poScript.init(playKey, mjid, this);
            }

            cc.vv.gameNetMgr.showErrorTip(options, "for options");
            options.addChild(playOption);
        };

        this.showOps(true);
    },

    getPlayArray: function (playData) {
        var keyArray = [];
        if (playData.chi) {
            keyArray.push("chi");
        }

        if (playData.peng) {
            keyArray.push("peng");
        }

        if (playData.gang) {
            keyArray.push("gang");
        }

        if (playData.ting) {
            keyArray.push("ting");
        }

        if (playData.hu) {
            keyArray.push("hu");
        }

        if (playData.pengTing) {
            keyArray.push("pengTing");
        }

        if (playData.chiTing) {
            keyArray.push("chiTing");
        }

        if (playData.ming) {
            keyArray.push("ming");
        }

        if (playData.tui) {
            keyArray.push("tui");
        }

        if (playData.san) {
            keyArray.push("san");
        }

        return keyArray;
    },

    removeAllOption: function () {
        var options = this._options.getChildByName("options");
        options.removeAllChildren();
    },

    onPlayGuoClicked: function () {

        if (cc.vv.replayMgr.isReplay()) {
            return;
        }

        // cc.log("wujun onPlayGuoClicked guo");
        this.clickedOptionGuo();
    },

    onPlayOptionClicked:function(key, mjid){

        // console.log("wujun onPlayOptionClicked", "key = ", key, "mjid = ", mjid);

        switch(key) {
            case "chi":
                this.clickedOptionChi();
                break;
            case "peng":
                cc.vv.net.send("peng");
                break;
            case "gang":
                this.clearTingTip();
                cc.vv.net.send("gang", mjid);
                break;
            case "hu":
                cc.vv.net.send("hu");
                break;
            case "ting":
                this.showTingOpt(true)
                this.isTing = true;
                this.isShowBtnTing = false;
                this.showOps(false);
                this.showTingTriangle(this.tingObj);
                // this.showAction("showMing");
                break;
            case "pengTing":
                break;
            case "chiTing":
                break;
            case "ming":
                this._isMing = true;
                this.showOps(false);
                break;
            case "tui":
                break;
            case "san":
                cc.vv.net.send("san");
                break; 
            default:
                break;
        }
    },

    clickedOptionChi: function () {
        if (cc.vv.gameNetMgr.curaction == null) {
            return;
        }
        var chiData = cc.vv.gameNetMgr.curaction.chi_data;
        cc.log("chiData = ", chiData);

        var types = chiData.chitypes;
        
        var pai = chiData.pai;
        if (types.length > 1) {
            this.showChiOptions(pai, types);
        }else {
            var type = types[0];
            // cc.vv.net.send("chi", { type: type, pai: pai });

            pai = type * 100 + chiData.pai;
            cc.log("pai = ", pai);
           
            cc.vv.net.send("chi", pai);
        } 
    },

    clickedOptionGuo: function () {
        if (this.isShowBtnTing == true)
        {
            this.showOps(false);
            this.isShowBtnTing = false
            this.isTing = false

        }else if (this.isShowBtnTing == false && this.isTing == true) {
            this._isMing = false;
            this.showOps(false);
        }
        else {
            if (this._haveHuGuoTip == true) {
                var self = this;
                var sureFn = function () {
                    cc.vv.net.send("guo", self.send_action_tags);
                    self._haveHuGuoTip = false;
                };

                var cancelFn = function () {
                    self._haveHuGuoTip = false;
                };

                cc.vv.alert.show("您确定要放弃胡牌吗？", sureFn, true, null, false, cancelFn);
            }else {
                cc.vv.net.send("guo", this.send_action_tags);
            }
            
        }
    },

    replyHideOption: function () {
        setTimeout(function () {
            this.showOps(false);
        }.bind(this), 800);
    },

    /**************** MODEL END ****************/

      /*******************************************
    *** MODEL BEGIN (注释状态) ***
    *** 重写亲友圈 ***
    *******************************************/

   initClubFriend: function () {

    var btnClubFriend = this.btnNodes.getChildByName("btnClubFriend");
    var isIdle = (cc.vv.gameNetMgr.numOfGames == 0) ? true : false;
    if (cc.vv.gameNetMgr.conf.clubid && cc.vv.gameNetMgr.conf.clubid > 0 && isIdle == true) {
        btnClubFriend.active = true;
    }else{
        btnClubFriend.active = false;
    }
    if(cc.vv.replayMgr.isReplay()){
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
        var offestScaleUINames = ["typeTitle", "infobar", "btnNodes", "prepare", "game", "replay", "layerRoot", "huansanzhang", "tip_notice"];
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

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },
    
    onDestroy:function(){
        console.log("onDestroy");
        if(cc.vv){
            cc.vv.http.needHttpReconnect = true;
            cc.vv.gameNetMgr.clear();   
        }
    }
});
