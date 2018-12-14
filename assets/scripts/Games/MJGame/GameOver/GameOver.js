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
        _gameover:null,
        _gameresult:null,
        _seats:[],
        _isGameEnd:false,
        _pingju:null,
        _win:null,
        _lose:null,
        readyBtn:null,
        overBtn:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        if(cc.vv.gameNetMgr.conf == null){
            return;
        }

        var layerRoot = this.node.getChildByName("layerRoot");
        if(cc.vv.gameNetMgr.conf.type == cc.vv.gameName){
            this._gameover = layerRoot.getChildByName("game_over");
        }
        else{
            this._gameover = layerRoot.getChildByName("game_over_xlch");
        }
        
        this._gameover.active = false;

        this._pingju = this._gameover.getChildByName("pingju");
        this._win = this._gameover.getChildByName("win");
        this._lose = this._gameover.getChildByName("lose");
        
        this._gameresult = layerRoot.getChildByName("game_result");
        
        var wanfa = this._gameover.getChildByName("wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
        
        var listRoot = this._gameover.getChildByName("result_list");
        var hide_num = 4- cc.vv.SelectRoom.getRoomPeople();
        for(var  i = 1 ;i<=hide_num;++i){
            var s_h = "s"+ (4-i+1);
            var sn_hide = listRoot.getChildByName(s_h);
            sn_hide.active = false;

        }
        for(var i = 1; i <= cc.vv.SelectRoom.getRoomPeople(); ++i){
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            var viewdata = {};
            viewdata.username = sn.getChildByName('username').getComponent(cc.Label);
            viewdata.reason = sn.getChildByName('reason').getComponent(cc.Label);
            
            var f = sn.getChildByName('fan');
            if(f != null){
                viewdata.fan = f.getComponent(cc.Label);    
            }
            
            viewdata.score = sn.getChildByName('score').getComponent(cc.Label);
            viewdata.hu = sn.getChildByName('hu');
            viewdata.mahjongs = sn.getChildByName('pai');
            viewdata.zhuang = sn.getChildByName('zhuang');
            viewdata.hupai = sn.getChildByName('hupai');
            viewdata._pengandgang = [];

            //flop
            viewdata.flop = sn.getChildByName('flop');
            if (viewdata.flop != undefined) {
                viewdata.flop.active = false;
            }
            
            this._seats.push(viewdata);
        }


        this.readyBtn = this._gameover.getChildByName("btnReady");
        this.overBtn = this._gameover.getChildByName("btnOver");

        this.onEventListener();

        //初始化网络事件监听器
        var self = this;
        this.node.on('game_over',function(data){
            self.onGameOver(data.detail);
            self.readyBtn.active = true;
            self.overBtn.active = false;
        });
        
        this.node.on('game_end',function(data){
            self._isGameEnd = true;
            self.readyBtn.active = false;
            self.overBtn.active = true;
        });

        this.node.on('robot_ready',function(data){
            console.log("robot_ready");
            
            self._gameover.active = false;
            cc.vv.net.send('ready');
        });


        // 结束
        cc.vv.utils.addClickEvent(self.overBtn, this.node, "GameOver", "onBtnOverClicked");
        //准备
        cc.vv.utils.addClickEvent(self.readyBtn, this.node, "GameOver", "onBtnReadyClicked");
    },
    
    onGameOver: function (data){
        if(cc.vv.gameNetMgr.conf.type == cc.vv.gameName){
            this.clearHunPaiIcon();
            this.onGameOver_XZDD(data);
        }
        else{
            this.onGameOver_XLCH(data);
        }
    },
    
    onGameOver_XZDD: function (overData){

        //结算牌局显示
        var data = overData.results;

        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }

        var seatFlopCount = 0;
            
        //显示玩家信息
        for(var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色 根xn的字样
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            // var numOfGen = userData.numofgen;
            
            var actionArr = [];
            for(var j = 0; j < userData.actions.length; ++j){
                var ac = userData.actions[j];

                var actionData = cc.CGameoverActionDataModel.getCNDataByKey(ac.type);
                var actionString = this.getShowActions(actionData, ac);
                if (actionString != "") {
                    actionArr.push(actionString);
                }
                var huData = cc.CGameoverActionDataModel.getHuByKey(ac.type);
                if (huData) {
                    hued = true;
                }
            }

            var huaNumber = parseInt(userData.hualength);
            if (huaNumber > 0) {
                var huaString = "补花x" + huaNumber.toString();
                actionArr.push(huaString);
            }
            
            //翻牌
            if (seatView.flop != undefined) {
                seatView.flop.active = false;
            }
            if (!(userData.fanpai_holds == undefined || userData.fanpai_holds.length == 0)) {
                seatFlopCount += 1;
                this.setFlop(userData.fanpai_holds, i);
            }
            
            for (var k = 0; k < 3; k++) {
                seatView.hu.children[k].active = false;    
            };
            if(userData.huorder >= 1){
                seatView.hu.children[userData.huorder-1].active = true;    
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("、");
            
            // 胡牌的玩家才有番
            // var fan = 0;
            // if(hued){
            //     fan = userData.fan;
            // }
            // seatView.fan.string = fan + "番";

            seatView.fan.string = "";
            var paoIndex = userData.xiapao;
            switch (paoIndex) {
                case 0:
                   seatView.fan.string = "不跑";
                   break;
                case 1:
                   seatView.fan.string = "跑一";
                   break;
                case 2:
                   seatView.fan.string = "跑二";
                   break;
                case 3:
                   seatView.fan.string = "跑三";
                   break;
                case 4:
                   seatView.fan.string = "跑四";
                   break;
                default:
                    seatView.fan.string = "";
                    break;
            }
            
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            
            var hupai = -1;
            var holds_length = userData.holds.length;
            var need_pop_hu_pai = (holds_length % 3 == 2)?true:false;
            if(need_pop_hu_pai){
                hupai = userData.holds.pop();
            }
            
            cc.vv.controlMgr.sortMJ(userData.holds, true);
            
            //胡牌不参与排序
            if(need_pop_hu_pai){
                userData.holds.push(hupai);
            }
            
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                if (n == null) {
                    continue;
                }
                n.active = false;
            }
           
            var lackingNum = (userData.pengs.length + numOfGangs + userData.chis.length)*3; 
            //显示相关的牌
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                if (n == null) {
                    continue;
                }
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_",pai);

                if (cc.vv.gameNetMgr.getHoldEqualHunValue(pai)) {
                    var args = {
                        pos:cc.v2(8, -10),
                        scaleX:1,
                        scaleY:1,
                        rotate:0
                    };

                    cc.vv.hunpaiIcon.addIcon(n,args);
                }        
            }
            
            this.removePengPrefabs(seatView);
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }

            //初始化吃牌
            var chis = userData.chis
            if(chis){
                for(var k = 0; k < chis.length; ++k){
                    var mjid = chis[k];
                    this.initPengAndGangs(seatView,index,mjid,"chi");
                    index++;    
                }    
            }
        }

        this.setSeatAttribute(seatFlopCount);
    },

    getShowActions: function (actionData, actionObj) {
        var actionString = "";
        if (typeof actionData == "object") {
            if (actionObj.value) {
                actionString = actionData[actionObj.value];
            } 
        }else if (typeof actionData == "string") {
            if (actionObj.value) {
                actionString = actionData + "x" + actionObj.value.toString();
            }else {
                actionString = actionData;
            }
        }

        return actionString;
    },

    setSeatAttribute: function (isFlop) {
        var listRoot = this._gameover.getChildByName("result_list");
        for(var i = 1; i <= 4; ++i){
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            var bg = sn.getChildByName("bg");
            var flop = sn.getChildByName("flop");
            var hu = sn.getChildByName("hu");
            var score = sn.getChildByName("score");

            if (isFlop == 0) {
                sn.x = bg.width*0.045;
                bg.scaleX = 0.76;
                // flop.active = false;
                hu.x = flop.x+10;
                score.x = hu.x;
            }else {
                sn.x = 0;
                bg.scaleX = 0.85;
                // flop.active = true;
                hu.x = flop.x+ flop.width*0.5 + hu.width*0.5;
                score.x = hu.x;
            }
        }
    },

    setFlop: function (flopList, index) {

        var seatView = this._seats[index];
        var flopMJCount = flopList.length;
        for (var i = 0; i < flopMJCount; i++) {
            var flopMJId = flopList[i];
            var mjNode = seatView.flop.children[i];
            if (mjNode == undefined) {
                return;
            }
            mjNode.active = true;
            var mjSprite = mjNode.getChildByName("mjSprite").getComponent(cc.Sprite);
            mjSprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_",flopMJId);

            this.setMask(mjNode, flopMJId);
        };

        var flopMJMaxCount = seatView.flop.childrenCount;
        var flopDvalue = flopMJMaxCount - flopMJCount;
        if (flopDvalue > 0) {
            for (var i = 0; i < flopDvalue; i++) {
                var mjNode = seatView.flop.children[flopMJMaxCount-1-i];
                mjNode.active = false;
            };
        }

        seatView.flop.active = true;
    },

    setMask: function (node, mjid) {
        var hun_mahjong_id = 29;
        var mask = node.getChildByName("mask");
        var remainder = mjid%9;//1(0,9,18),5(4,13,22),9(8,17,26)
        if (mjid == hun_mahjong_id) {
            mask.active = true;
        }else if (mjid < 0 || mjid >= 27) {
            mask.active = false;
        }else if (remainder == 0 || remainder == 4 || remainder == 8) {
            mask.active = true;
        }else {
            mask.active = false;
        }
    },

    getMenType: function (menCount) {
        var menType = "";
        switch (menCount) {
            case 1:
                menType = "平胡";
                break;
            case 2:
                menType = "小闷";
                break;
            case 4:
                menType = "大闷";
                break;
            case 8:
                menType = "俩闷";
                break;
            case 16:
                menType = "四闷";
                break;
            case 32:
                menType = "八闷";
                break;
            case 64:
                menType = "十六闷";
                break;
            case 128:
                menType = "三十二闷";
                break;
        }

        return menType;
    },

    onGameOver_XLCH:function(data){
        console.log(data);
        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
            
        //显示玩家信息
        for(var i = 0; i < 4; ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            var hupaiRoot = seatView.hupai;
            
            for(var j = 0; j < hupaiRoot.children.length; ++j){
                hupaiRoot.children[j].active = false;
            }
            
            var hi = 0;
            for(var j = 0; j < userData.huinfo.length; ++j){
                var info = userData.huinfo[j];
                hued = hued || info.ishupai;
                if(info.ishupai){
                    if(hi < hupaiRoot.children.length){
                        var hupaiView = hupaiRoot.children[hi]; 
                        hupaiView.active = true;
                        hupaiView.getComponent(cc.Sprite).spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("B_",info.pai);
                        hi++;   
                    }
                }
                
                var str = ""
                var sep = "";
                
                var dataseat = userData;
                if(!info.ishupai){
                    if(info.action == "fangpao"){
                        str = "放炮";
                    }
                    else if(info.action == "gangpao"){
                        str = "杠上炮";
                    }
                    else if(info.action == "beiqianggang"){
                        str = "被抢杠";
                    }
                    else{
                        str = "被查大叫";
                    }
                    
                    dataseat = data[info.target]; 
                    info = dataseat.huinfo[info.index];
                }
                else{
                    if(info.action == "hu"){
                        str = "接炮胡"
                    }
                    else if(info.action == "zimo"){
                        str = "自摸";
                    }
                    else if(info.action == "ganghua"){
                        str = "杠上花";
                    }
                    else if(info.action == "dianganghua"){
                        str = "点杠花";
                    }
                    else if(info.action == "gangpaohu"){
                        str = "杠炮胡";
                    }
                    else if(info.action == "qiangganghu"){
                        str = "抢杠胡";
                    }
                    else if(info.action == "chadajiao"){
                        str = "查大叫";
                    }   
                }
                
                str += "(";
                
                if(info.pattern == "7pairs"){
                    str += "七对";
                    sep = "、"
                }
                else if(info.pattern == "l7pairs"){
                    str += "龙七对";
                    sep = "、"
                }
                else if(info.pattern == "j7pairs"){
                    str += "将七对";
                    sep = "、"
                }
                else if(info.pattern == "duidui"){
                    str += "碰碰胡";
                    sep = "、"
                }
                else if(info.pattern == "jiangdui"){
                    str += "将对";
                    sep = "、"
                }
                    
                if(info.haidihu){
                    str += sep + "海底胡";
                    sep = "、";
                }
                
                if(info.tianhu){
                    str += sep + "天胡";
                    sep = "、";
                }
                
                if(info.dihu){
                    str += sep + "地胡";
                    sep = "、";
                }
                
                if(dataseat.qingyise){
                    str += sep + "清一色";
                    sep = "、";
                }
                
                if(dataseat.menqing){
                    str += sep + "门清";
                    sep = "、";
                }
                
                if(dataseat.jingouhu){
                    str += sep + "金钩胡";
                    sep = "、";
                }
                         
                if(dataseat.zhongzhang){
                    str += sep + "中张";
                    sep = "、";
                }
            
                if(info.numofgen > 0){
                    str += sep + "根x" + info.numofgen;
                    sep = "、"; 
                }
                
                if(sep == ""){
                    str += "平胡";
                }
                
                str += "、" + info.fan + "番";
                
                str += ")";
                actionArr.push(str);
            }
            
            seatView.hu.active = hued;
            
            if(userData.angangs.length){
                actionArr.push("暗杠x" + userData.angangs.length);
            }
            
            if(userData.diangangs.length){
                actionArr.push("明杠x" + userData.diangangs.length);
            }
            
            if(userData.wangangs.length){
                actionArr.push("巴杠x" + userData.wangangs.length);
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("、");
            
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                if (n == null) {
                    continue;
                }
                n.active = false;
            }
            
            cc.vv.controlMgr.sortMJ(userData.holds,userData.dingque);
            
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
           
            var lackingNum = (userData.pengs.length + numOfGangs)*3; 
            //显示相关的牌
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                if (n == null) {
                    continue;
                }
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_",pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }
        }
    },
    
    initPengAndGangs:function(seatView,index,mjid,flag){
        var pgroot = null;
        if(seatView._pengandgang.length <= index){
            pgroot = cc.instantiate(cc.vv.controlMgr.pengPrefabSelf);
            seatView._pengandgang.push(pgroot);
            seatView.mahjongs.addChild(pgroot);   
        }
        else{
            pgroot = seatView._pengandgang[index];
            pgroot.active = true;
        }

        var mjs = null;
        if (flag == "chi") {
            mjs = cc.vv.gameNetMgr.getChiArr(mjid);

            var actual_mahjong_id = cc.vv.gameNetMgr.getChiMahjongId(mjid);
            if (actual_mahjong_id == mjs[0]) {
                mjs[0] = mjs[1];
                mjs[1] = actual_mahjong_id;
            }else if (actual_mahjong_id == mjs[2]) {
                mjs[2] = mjs[1];
                mjs[1] = actual_mahjong_id;
            }
        }
      
        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        for(var s = 0; s < sprites.length; ++s){
            var sprite = sprites[s];
            if(sprite.node.name == "gang"){
                var isGang = (flag != "peng" && flag != "chi");
                sprite.node.active = isGang;
                sprite.node.scaleX = 1.0;
                sprite.node.scaleY = 1.0;
                // if(flag == "angang"){
                //     sprite.spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame("myself");
                //     sprite.node.scaleX = 1.4;
                //     sprite.node.scaleY = 1.4;                        
                // }   
                // else{
                //     sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("B_",mjid);    
                // }

                sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("B_",mjid);
            }
            else{
                // if (flag == "chi") {
                //     mjid = mjs[s];
                // }
                // sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("B_",mjid);
                
                if (flag == "angang") {
                    sprite.node.scaleX = 54/36;
                    sprite.node.scaleY = 80/57;                         
                    sprite.spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame("myself");
                }else {
                    if (flag == "chi") {
                        mjid = mjs[s];
                    }

                   if (sprite.node.name != "Arrow") {
                        sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("B_",mjid);
                    } 
                }
            }
        }
        pgroot.x = index * 55 * 3 + index * 10;
    },

    removePengPrefabs: function (seatView) {
        var prefabNum = seatView._pengandgang.length;
        for (var i = 0; i < prefabNum; i++) {
            var prefab = seatView._pengandgang[i];
            seatView.mahjongs.removeChild(prefab);
        };
        seatView._pengandgang.splice(0, prefabNum);
        seatView._pengandgang = [];
        
    },
    
    onBtnReadyClicked:function(){
        console.log("onBtnReadyClicked");
        if(this._isGameEnd){
            this._gameresult.active = true;
        }
        else{
            cc.vv.net.send('ready');   
        }
        this._gameover.active = false;
    },
    
    onBtnShareClicked:function(){
        console.log("onBtnShareClicked");
    },

    onBtnOverClicked:function(){
        console.log("-------GameOver 结束按钮点击------");
        this._gameresult.active = true;
        this._gameover.active = false;
    },

    clearHunPaiIcon: function () {
        for (var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); i++) {
            var seatView = this._seats[i];
            for (var j = 0; j < seatView.mahjongs.children.length; j++) {
                var mahjong = seatView.mahjongs.children[j];
                if (mahjong.children.length > 0) {
                    var icon = mahjong.children[0];
                    if (icon) {
                        icon.removeFromParent(true);
                        icon = null;
                    }
                }
            };
        };
    },

    onEventListener: function () {
        this._gameover.on(cc.Node.EventType.TOUCH_START,function(event){
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
