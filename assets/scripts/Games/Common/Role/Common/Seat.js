cc.Class({
    extends: cc.Component,

    properties: {
        _sprIcon:null,
        _zhuang:null,
        _ready:null,
        _offline:null,
        _lblName:null,
        _lblScore:null,
        _scoreBg:null,
        _nddayingjia:null,
        _voicemsg:null,
        _folds:null,
        _arrow:null,

        _chatBubble:null,
        _emoji:null,
        _lastChatTime:-1,

        _end_you:[],
        _end_huase:[],
        _end_ZhaNum:null,

        _userName:"",
        _score:0,
        _dayingjia:false,
        _isOffline:false,
        _isReady:false,
        _isZhuang:false,
        _userId:null,
        _paoArr:[],
        localIndex: -1,
    },

    // use this for initialization
    onLoad: function () {



        if(cc.vv == null){
            return;
        }

        var tmpNode = this.node.getChildByName("icon");
        if(tmpNode.childrenCount>0){
            this._sprIcon = tmpNode.children[0].getComponent("ImageLoader");
        } else{
            this._sprIcon = tmpNode.getComponent("ImageLoader");
        }



        this._lblName = this.node.getChildByName('name').getComponent(cc.Label);
        this._lblScore = this.node.getChildByName("score").getComponent(cc.Label);
        this._voicemsg = this.node.getChildByName("voicemsg");
        this._folds = this.node.getChildByName("Folds");
        this._folds_other=this.node.getChildByName('folds');
        this._arrow = this.node.getChildByName("arrow");
        this._buchu = this.node.getChildByName('buchu');
        this._bujiao = this.node.getChildByName('bujiao');
        this._fen = this.node.getChildByName('fen');
        this._xuanpai = this.node.getChildByName("xuanpai");
        this._ti=this.node.getChildByName('ti');
        this._buti=this.node.getChildByName('buti');


        this.refreshXuanPaiState();

        var pao = this.node.getChildByName("que");
        if (pao) {
            for(var j = 0; j < pao.children.length; ++j){
                this._paoArr.push(pao.children[j]);
            }
        }

        if(this._voicemsg){
            this._voicemsg.active = false;
        }

        if(this._sprIcon && this._sprIcon.getComponent(cc.Button)){
            console.log(this.node);
            cc.vv.utils.addClickEvent(this._sprIcon,this.node,"Seat","onIconClicked");
        }


        this._offline = this.node.getChildByName("offline");

        this._ready = this.node.getChildByName("ready");

        this._zhuang = this.node.getChildByName("zhuang");

        this._scoreBg = this.node.getChildByName("Z_money_frame");
        this._nddayingjia = this.node.getChildByName("dayingjia");

        this._chatBubble = this.node.getChildByName("ChatBubble");
        if(this._chatBubble != null){
            this._chatBubble.active = false;
        }

        this._emoji = this.node.getChildByName("emoji");
        if(this._emoji != null){
            this._emoji.active = false;
        }

        this.refresh();

        if(this._sprIcon && this._userId){
            this._sprIcon.setUserID(this._userId);
        }
    },

    onIconClicked:function(){
        if (cc.vv.replayMgr.isReplay() || cc.vv.PKReplayMgr.isReplay() || cc.vv.PDKReplayMgr.isReplay()) {
            return;
        }

        var iconSprite = this._sprIcon.node.getComponent(cc.Sprite);
        console.log("onIconClicked"  + this._userId)

        if(this._userId != null && this._userId > 0){

            var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
            var getlocalIndex = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);

            if (this.localIndex != -1 && getlocalIndex != this.localIndex) {
                if (cc.vv.net) {
                    cc.vv.net.send("client_error_msg", cc.vv.gameNetMgr.seats);
                }

                seat = cc.vv.gameNetMgr.getSeatByLocalIndex(this.localIndex);
                if (seat == null) {
                    var string = "错误：玩家个人信息不存在，this._userId：" + this._userId + "，this.localIndex：" + this.localIndex;
                    cc.vv.alert.show(string);
                    return;
                }

                this._userId = seat.userid;
                this.refresh();


            }

            var sex = 0;
            if(cc.vv.baseInfoMap){
                var info = cc.vv.baseInfoMap[this._userId];
                if(info){
                    sex = info.sex;
                }
            }

            if (this._userId != seat.userid) {
                if (cc.vv.alert) {

                    var string = "错误：玩家ID有误，this._userId：" + this._userId + "，seat.userid：" + seat.userid;
                    cc.vv.alert.show(string);

                    if (cc.vv.net) {
                        cc.vv.net.send("client_error_msg", cc.vv.gameNetMgr.seats);
                    }
                    return;
                }
            }

            cc.vv.userinfoShow.show(seat.name,seat.userid,iconSprite,sex,seat.ip);
        }
    },

    initMyData:function(){
        this._end_huase = this.node.getChildByName('end_huase');
        this._end_you = this.node.getChildByName('end_you')


    },


    ChangChatBubble:function(){
        this._chatBubble.x = -46;
        this._chatBubble.anchorX = 1;
        this._chatBubble.children[0].scaleX = -1;
        this._chatBubble.children[1].anchorX = 1;
    },

    setChangChatBubbleY:function(n){
        this._chatBubble.y = n;
    },

    setFoldsPosX:function(n){
        // console.log(this._folds);
        this._folds.x = n;
        this._folds_other.x=n;
    },
    setHoldsPosX:function(n){
        this.node.getChildByName('Holds').x=n;
    },
    setHuaSe:function(arr){

        console.log(this._end_huase)
        if(this._end_huase !== null && this._end_huase.length !== 0){
            for(let k in arr){
                var nn = arr[k];

                this._end_huase.children[nn].active = true;
            }

        }

    },

    setYou:function(n){
        if(this._end_you !== null && this._end_you.length !== 0){

            this._end_you.children[n].active = true;
        }

    },

    hideAllYou:function(){
        if(this._end_you !== null && this._end_you.length !== 0){

            for(let i = 0 ; i<this._end_you.childrenCount;i++){
                this._end_you.children[i].active = false;
            }

        }
    },

    HideAllHuaSe:function(){
        if(this._end_huase !== null && this._end_huase.length !== 0){
            for (var i = 0; i < 4; i++) {
                this._end_huase.children[i].active = false;
            }


        }

    },
    setBuchuPosX:function(n){
        this._buchu.x = n;
        this._bujiao.x=n;
        this._fen.x=n;
        this._ti.x=n;
        this._buti.x=n;
    },

    setArrowPosX:function(n){
        // console.log(this._arrow);
        this._arrow.x = n;
    },
    setPaiCountPosX:function(n){
        this.node.getChildByName('paicount').x=n;
    },
    refresh:function(){

        if(this._lblName != null){
            this._lblName.string = this._userName;
        }

        if(this._lblScore != null && this._score != null){
            this._lblScore.string = this._score;
        }

        if(this._nddayingjia != null){
            this._nddayingjia.active = this._dayingjia == true;
        }

        if(this._offline){
            this._offline.active = this._isOffline && this._userName != "";
        }

        if(this._ready){
            this._ready.active = this._isReady && (cc.vv.gameNetMgr.numOfGames > 0);
        }

        if(this._zhuang){
            this._zhuang.active = this._isZhuang;
        }

        if (this.node == null) {
            return;
        }
        this.node.active = (this._userId != null && this._userId > 0);
        this.setNamePosX();
    },

    setInfo: function(id, name,score,dayingjia){
        this._userId = id;
        this._userName = name;
        this._score = score;
        if(this._score == null){
            this._score = 0;
        }
        this._dayingjia = dayingjia;

        if(this._scoreBg != null){
            this._scoreBg.active = this._score != null;
        }

        if(this._lblScore != null){
            this._lblScore.node.active = this._score != null;
        }

        this.refresh();
    },

    setZhuang:function(value){
        this._isZhuang = value;
        if(this._zhuang){
            this._zhuang.active = value;
        }
    },

    setReady:function(isReady){
        this._isReady = isReady;
        if(this._ready){
            this._ready.active = this._isReady && (cc.vv.gameNetMgr.numOfGames > 0);
        }
    },

    setID:function(id){
        if (this.node == null) {
            return;
        }
        var idNode = this.node.getChildByName("id");
        if(idNode){
            var lbl = idNode.getComponent(cc.Label);
            lbl.string = "ID:" + id;
        }

        this._userId = id;
        if(this._sprIcon){
            this._sprIcon.setUserID(id);
        }
    },

    setOffline:function(isOffline){
        this._isOffline = isOffline;
        if(this._offline){
            this._offline.active = this._isOffline && this._userName != "";
        }
    },

    chat:function(content){
        if(this._chatBubble == null || this._emoji == null){
            return;
        }
        if (this._chatBubble.active) {
            return;
        }
        this._emoji.active = false;
        this._chatBubble.active = true;
        this._chatBubble.getComponent(cc.Label).string = content;
        this._chatBubble.getChildByName("New Label").getComponent(cc.Label).string = content;
        this._lastChatTime = 3;
    },

    emoji:function(emoji){
        //emoji = JSON.parse(emoji);
        if(this._emoji == null || this._chatBubble == null){
            return;
        }
        if (this._emoji.active) {
            return;
        }
        console.log(emoji);
        this._chatBubble.active = false;
        this._emoji.active = true;
        this._emoji.getComponent(cc.Animation).play(emoji);
        this._lastChatTime = 3;
    },

    voiceMsg:function(show){
        if(this._voicemsg){
            this._voicemsg.active = show;
        }
    },

    refreshXuanPaiState:function(){
        if(this._xuanpai == null){
            return;
        }

        this._xuanpai.active = cc.vv.gameNetMgr.isHuanSanZhang;
        if(cc.vv.gameNetMgr.isHuanSanZhang == false){
            return;
        }

        this._xuanpai.getChildByName("xz").active = false;
        this._xuanpai.getChildByName("xd").active = false;

        var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
        if(seat){
            if(seat.huanpais == null){
                this._xuanpai.getChildByName("xz").active = true;
            }
            else{
                this._xuanpai.getChildByName("xd").active = true;
            }
        }
    },

    setPao: function (isZhuang) {
        if (isZhuang == false) {
            for(var j = 0; j < this._paoArr.length; ++j){
                this._paoArr[j].active = false;
            }
        }
    },
    getFolds:function(){
        var foldsArr=[];
        var folds=this.node.getChildByName("hands");
        for(var i=0;i<folds.childrenCount;++i){
            for(var j=0;j<folds.children[i].childrenCount;++j){
                foldsArr.push(folds.children[i].children[j]);
            }
        }
        return foldsArr;
    },

    setNamePosX: function () {
        if (this.node.active == false) {
            return;
        }

        if (this._lblName) {
            var showWidth = 100;
            if (this._lblName.node.anchorX == 0) {
                showWidth = 180;
            }
            var widthName = this._lblName.node.width;
            if (widthName > showWidth) {
                this._lblName.overflow = 1;
                this._lblName.horizontalAlign = 0;
                this._lblName.enableWrapText = false;
                this._lblName.node.width = showWidth;
            }

        }
    },
    setDZ:function(ishow){
        this.node.getChildByName('liang3').getChildByName('huaseYi').active=ishow;
    },
    setNM:function(ishow){
        this.node.getChildByName('liang3').getChildByName('huaseEr').active=ishow;
    },
    setDZorNM:function(ishow){
        // mm
        this.node.getChildByName('dizhu').active=ishow;

    },
    hideDZorNM:function(ishow){
        this.node.getChildByName('dizhu').active=ishow;

    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._lastChatTime > 0){
            this._lastChatTime -= dt;
            if(this._lastChatTime < 0){
                this._chatBubble.active = false;
                this._emoji.active = false;
                this._emoji.getComponent(cc.Animation).stop();
            }
        }
    },
});
