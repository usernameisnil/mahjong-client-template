var mahjongSprites = [];

cc.Class({
    extends: cc.Component,

    properties: {
        leftAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        rightAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomFoldAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        pengPrefabSelf:{
            default:null,
            type:cc.Prefab
        },
        
        pengPrefabLeft:{
            default:null,
            type:cc.Prefab
        },

        Arrow:{
            default:null,
            type:cc.Prefab
        },
        
        emptyAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        holdsEmpty:{
            default:[],
            type:[cc.SpriteFrame]
        },
        
        _sides:null,
        _pres:null,
        _foldPres:null,
    },
    
    onLoad:function(){
        if(cc.vv == null){
            return;
        }
        this._sides = ["myself","right","up","left"];
        this._pres = ["M_","R_","B_","L_"];
        this._foldPres = ["B_","R_","B_","L_"];
        cc.vv.controlMgr = this;
        //筒
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("dot_" + i);        
        }
        
        //条
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("bamboo_" + i);
        }
        
        //万
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("character_" + i);
        }
        
        //中、发、白
        mahjongSprites.push("red");
        mahjongSprites.push("green");
        mahjongSprites.push("white");
        
        //东南西北风
        mahjongSprites.push("wind_east");
        mahjongSprites.push("wind_south");
        mahjongSprites.push("wind_west");
        mahjongSprites.push("wind_north");

        //花牌（春夏秋冬、梅兰竹菊）
        mahjongSprites.push("spring");
        mahjongSprites.push("summer");
        mahjongSprites.push("autumn");
        mahjongSprites.push("winter");
        mahjongSprites.push("plum");
        mahjongSprites.push("orchid");
        mahjongSprites.push("bamboo");
        mahjongSprites.push("chrysanthemum");
    },
    
    getMahjongSpriteByID:function(id){
        return mahjongSprites[id];
    },
    
    getMahjongType:function(id){
        if(id >= 0 && id < 9){
            return 0;
        }else if(id >= 9 && id < 18){
            return 1;
        }else if(id >= 18 && id < 27){
            return 2;
        }else if (id >= 27 && id < 30) {
            return 3;
        }else if (id >= 30 && id < 34) {
            return 4;
        }else if (id >= 34 && id < 42) {
            return 5;
        }
    },
    
    getSpriteFrameByMJID:function(pre,mjid){
        var spriteFrameName = this.getMahjongSpriteByID(mjid);
        spriteFrameName = pre + spriteFrameName;
        if(pre == "M_"){
            return this.bottomAtlas.getSpriteFrame(spriteFrameName);            
        }
        else if(pre == "B_"){
            return this.bottomFoldAtlas.getSpriteFrame(spriteFrameName);
        }
        else if(pre == "L_"){
            return this.leftAtlas.getSpriteFrame(spriteFrameName);
        }
        else if(pre == "R_"){
            return this.rightAtlas.getSpriteFrame(spriteFrameName);
        }
    },
    
    getAudioURLByMJID:function(id){
        var realId = 0;
        if(id >= 0 && id < 9){
            realId = id + 21;
        }
        else if(id >= 9 && id < 18){
            realId = id - 8;
        }
        else if(id >= 18 && id < 27){
            realId = id - 7;
        }else if (id >= 27 && id < 30) {
            realId = id * 10 - 199;
        }else if (id >= 30 && id < 34) {
            realId = id * 10 - 269;
        }else if (id >= 34 && id < 42) {
            // realId = 0;
        }
        return realId + ".mp3";
    },
    
    getEmptySpriteFrame:function(side){
        if(side == "up"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_up");
        }   
        else if(side == "myself"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_bottom");
        }
        else if(side == "left"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_left");
        }
        else if(side == "right"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_right");
        }
    },
    
    getHoldsEmptySpriteFrame:function(side){
        if(side == "up"){
            return this.emptyAtlas.getSpriteFrame("e_mj_up");
        }   
        else if(side == "myself"){
            return null;
        }
        else if(side == "left"){
            return this.emptyAtlas.getSpriteFrame("e_mj_left");
        }
        else if(side == "right"){
            return this.emptyAtlas.getSpriteFrame("e_mj_right");
        }
    },

    getmyselfAndUpKouSpriteFrame: function () {
        return this.bottomFoldAtlas.getSpriteFrame("e_mj_b_up");
    },
    
    // sortMJ:function(mahjongs,dingque){
    //     var self = this;
    //     mahjongs.sort(function(a,b){
    //         if(dingque >= 0){
    //             var t1 = self.getMahjongType(a);
    //             var t2 = self.getMahjongType(b);
    //             if(t1 != t2){
    //                 if(dingque == t1){
    //                     return 1;
    //                 }
    //                 else if(dingque == t2){
    //                     return -1;
    //                 }
    //             }
    //         }
    //         return a - b;
    //     });
    // },

    sortMJ:function(mahjongs, isNeedHunSort){
        var self = this;
        mahjongs.sort(function(a,b){
            if (isNeedHunSort) {
                if (cc.vv.gameNetMgr.getHoldEqualHunValue(a) && cc.vv.gameNetMgr.getHoldEqualHunValue(b)) {
                    return a - b;
                }else if (cc.vv.gameNetMgr.getHoldEqualHunValue(a)) {
                    return -1;
                }else if (cc.vv.gameNetMgr.getHoldEqualHunValue(b)) {
                    return 1;
                }
            }
            
            return a - b;
        });
    },
    
    getSide:function(localIndex){
        return this._sides[localIndex];
    },
    
    getPre:function(localIndex){
        return this._pres[localIndex];
    },
    
    getFoldPre:function(localIndex){
        return this._foldPres[localIndex];
    },

    setBGStyle: function(style) {
        var old = this.getBGStyle();
        
        if (old != style) {
            cc.sys.localStorage.setItem('bg_style', style);

            cc.vv.gameNetMgr.refreshBG(style);
        }
    },
    
    getBGStyle: function() {
        var style = 0;
        var t = cc.sys.localStorage.getItem('bg_style');
        if (t != null && t >= 0 && t <= 3) {
            style = parseInt(t);
        }

        return style;
    },
});
