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
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.vv){
            return;
        }
        
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName("myself");
        var pengangroot = myself.getChildByName("penggangs");
        var realwidth = cc.director.getVisibleSize().width;
        var scale = realwidth / 1280;
        pengangroot.scaleX *= scale;
        pengangroot.scaleY *= scale;
        
        var self = this;

        this.node.on('chi_notify',function(data){
            //刷新所有的牌
           // console.log('chi_notify', data.detail);
            var data = data.detail;
           
            self.onPengGangChanged(data.seatData);
        });

        this.node.on('peng_notify',function(data){
            //刷新所有的牌
           // console.log('peng_notify', data.detail);
          
            var data = data.detail;
            self.onPengGangChanged(data);
        });
        
        this.node.on('gang_notify',function(data){
            //刷新所有的牌
           
            var data = data.detail;
            self.onPengGangChanged(data.seatData);
        });
        
        this.node.on('game_begin',function(data){
            self.onGameBein();
        });
        
        this.node.on('game_over',function(data){
            self.onGameBein();
        });


        this.node.on('chiting_notify',function(data){
            //刷新所有的牌
           
            var data = data.detail;
            self.onPengGangChanged(data.seatData);
        });

        this.node.on('pengting_notify',function(data){
            //刷新所有的牌
           
            var data = data.detail;
            self.onPengGangChanged(data);
        });

       
    },

    start: function () {
        var seats = cc.vv.gameNetMgr.seats;
       
        for(var i in seats){
            this.onPengGangChanged(seats[i]);
        }
    },
    
    onGameBein:function(){
        this.hideSide("myself");
        this.hideSide("right");
        this.hideSide("up");
        this.hideSide("left");
    },
    
    hideSide:function(side){
        if (this.node == null) {
            return;
        }
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        if(pengangroot){
            pengangroot.removeAllChildren(true);

            // for(var i = 0; i < pengangroot.childrenCount; ++i){
            //     pengangroot.children[i].active = false;
                
            // }            
        }
    },

    showSide:function(side){
        if (this.node == null) {
            return;
        }
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        if(pengangroot){
            for(var i = 0; i < pengangroot.childrenCount; ++i){
                pengangroot.children[i].active = true;
            }
        }
    },

    // checkPengGang: function () {
       
    //     var seats = cc.vv.gameNetMgr.seats;
    //     var allPengGang = [];
    //     for (var i in seats) {
    //         var tmpSeatData = seats[i];
    //         allPengGang[i] = [];
    //         var a = [];
    //         allPengGang[i] = a.concat(tmpSeatData.angangs, tmpSeatData.diangangs, tmpSeatData.wangangs, tmpSeatData.pengs);

    //     }

    //     var oneArr = [].concat.apply([], allPengGang);//

    //     console.log('baihua2001cnn' , oneArr);
       
    //     var res = function (Arr) {
    //         var tmp = [];
    //         Arr.forEach(function (item) {
    //             (Arr.indexOf(item) !== Arr.lastIndexOf(item) && tmp.indexOf(item) === -1) && tmp.push(item)
    //         })
            
    //         return tmp;
    //     }
    //     var result = res(oneArr);

    //     if (result.length > 0) {

    //         if (result[0] !== null && result[0] !== undefined) {
    //             cc.vv.alert.show("网络波动异常，确定后重新连接！", function () {
    //                 cc.vv.net.endActiveSocket();
    //                 return;
    //             }, true);
    //         }
    //     }     

    // },
    
    onPengGangChanged:function(seatData){
              
        
        

        if(seatData.angangs == null || seatData.diangangs == null || seatData.wangangs == null || seatData.pengs == null || seatData.chis == null){
            return;
        }     

        var seatindex = seatData.seatindex;
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var side = cc.vv.controlMgr.getSide(localIndex);
        var pre = cc.vv.controlMgr.getFoldPre(localIndex);
       
        this.hideSide(side);

        //console.log("onPengGangChanged" + localIndex);
        
        if (this.node == null) {
            return;
        }
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        
        for(var i = 0; i < pengangroot.childrenCount; ++i){
            pengangroot.children[i].active = false;
        }
        //初始化杠牌
        var index = 0;
        var turnIndex = 0;
        
        var gangs = seatData.angangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"angang", turnIndex, seatindex);
            index++;
            turnIndex++;    
        }

        turnIndex = 0;
        var gangs = seatData.diangangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"diangang", turnIndex, seatindex);
            index++; 
            turnIndex++;   
        }
        
        turnIndex = 0;
        var gangs = seatData.wangangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"wangang", turnIndex, seatindex);
            index++; 
            turnIndex++;     
        }
        
        //初始化碰牌
        turnIndex = 0;
        var pengs = seatData.pengs
        if(pengs){
            for(var i = 0; i < pengs.length; ++i){
                var mjid = pengs[i];
                this.initPengAndGangs(pengangroot,side,pre,index,mjid,"peng", turnIndex, seatindex);
                index++; 
                turnIndex++;     
            }    
        }  

        //初始化吃牌
        var chis = seatData.chis;
        if (chis) {
            for (var i = 0; i < chis.length; i++) {
                var mjid = chis[i];
                this.initPengAndGangs(pengangroot,side,pre,index,mjid,"chi", -1, seatindex);
                index++;
            }
        }   
        
        this.showSide(side);
    },
    
    initPengAndGangs:function(pengangroot,side,pre,index,mjid,flag, turnIndex, seatindex){
        var pgroot = null;
        var isPgrootHave = false;
        if(pengangroot.childrenCount <= index){
            if(side == "left" || side == "right"){
                pgroot = cc.instantiate(cc.vv.controlMgr.pengPrefabLeft);
            }
            else{
                pgroot = cc.instantiate(cc.vv.controlMgr.pengPrefabSelf);
            }
            
            pengangroot.addChild(pgroot);    
        }
        else{
            pgroot = pengangroot.children[index];
            pgroot.active = true;
            isPgrootHave = true;
        }
        
        if(side == "left"){
            pgroot.y = -(index * 31 * 3) - (index * 5);                    
        }
        else if(side == "right"){
            pgroot.y = (index * 31 * 3) + (index * 5);
            pgroot.setLocalZOrder(-index);
        }
        else if(side == "myself"){
            pgroot.x = index * 55 * 3 + index * 10;                    
        }
        else{
            pgroot.x = -(index * 55*3) - (index * 5);
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
                //     sprite.spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame(side);
                //     if(side == "myself" || side == "up"){
                //         sprite.node.scaleX = 54/36;
                //         sprite.node.scaleY = 80/57;
                //     }
                // }else {
                //     sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,mjid);    
                // }
                
                sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,mjid);
            }
            else{ 
                if (flag == "angang") {
                    if(side == "myself" || side == "up"){
                        sprite.node.scaleX = 54/36;
                        sprite.node.scaleY = 80/57;
                    }
                    sprite.spriteFrame = cc.vv.controlMgr.getEmptySpriteFrame(side);
                }else {
                    if (flag == "chi") {
                        mjid = mjs[s];
                    }

                   if (sprite.node.name != "Arrow") {
                        sprite.node.scaleX = 1.0;
                        sprite.node.scaleY = 1.0;
                        sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,mjid);
                    } 
                }
                
            }
        }

        if ((flag == "chi" || flag == "angang") && isPgrootHave == true) {
            var arrow = pgroot.getChildByName("Arrow");
            if (arrow) {
                arrow.removeFromParent(true);
                arrow = null;
            }
        }

        if (flag != "angang" && flag != "chi") {
            var turnSeatIndex = this.getTurnIndex(seatindex, flag, turnIndex);
            if (turnSeatIndex == -1) {
                return;
            }

            var arrow = pgroot.getChildByName("Arrow");
            if (arrow) {
                arrow.removeFromParent(true);
                arrow = null;
            }
            this.addArrow(pgroot, seatindex, turnSeatIndex, side, flag); 
        }
    },

    getTurnIndex: function (seatindex, flag, index) {

        var isHave = this.isHaveTurns(seatindex, flag, index);
        if (isHave == false) {
            return -1;
        }

        var turnIndexList = 0;
        switch (flag) {
            case "angang":
                turnIndexList = cc.vv.gameNetMgr.turnIndexList[seatindex]["angang"][index].turnindex;
                break;
            case "diangang":
                turnIndexList = cc.vv.gameNetMgr.turnIndexList[seatindex]["diangang"][index].turnindex;
                break;
            case "wangang":
                turnIndexList = cc.vv.gameNetMgr.turnIndexList[seatindex]["wangang"][index].turnindex;
                break;
            case "peng":
                turnIndexList = cc.vv.gameNetMgr.turnIndexList[seatindex]["peng"][index].turnindex;
                break;
        }
        return turnIndexList;
    },

    isHaveTurns: function (seatindex, flag, index) {
        var isHave = false;
        switch (flag) {
            case "angang":
                isHave = ((cc.vv.gameNetMgr.turnIndexList[seatindex]["angang"].length-1) >= index)?true:false;
                break;
            case "diangang":
                isHave = ((cc.vv.gameNetMgr.turnIndexList[seatindex]["diangang"].length-1) >= index)?true:false;
                break;
            case "wangang":
                isHave = ((cc.vv.gameNetMgr.turnIndexList[seatindex]["wangang"].length-1) >= index)?true:false;
                break;
            case "peng":
                isHave = ((cc.vv.gameNetMgr.turnIndexList[seatindex]["peng"].length-1) >= index)?true:false;
                break;
        }

        return isHave;
    },

    addArrow: function (pgroot, seatindex, index, side, flag) {
        var arrow = cc.instantiate(cc.vv.controlMgr.Arrow);
        pgroot.addChild(arrow);
        
        var gangNode = pgroot.getChildByName("gang");
        arrow.x = gangNode.x;
        

        if (flag == "peng") {
            arrow.y = gangNode.y-5;
        }else {
            if (side == "left" || side == "right") {
                arrow.y = gangNode.y+8; 
            }else {
               arrow.y = gangNode.y+12; 
            }
            
        }


        var arrowScript = arrow.getComponent('Arrow');
        if (arrowScript) {
            arrowScript.setShowArrow(index, seatindex, side);
        }
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
