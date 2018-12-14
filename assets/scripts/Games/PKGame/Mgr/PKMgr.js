var PKSprites = [];
cc.Class({
    extends: cc.Component,

    properties: {
        myselftAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.controlMgr = this;

        if (cc.vv == null) {
            return;
        }

        //黑桃
        for (var i = 2; i < 10; ++i) {
            PKSprites.push("0" + i);
        }
        for (var i = 10; i < 15; ++i) {
            PKSprites.push("0" + i);
        }


        //红桃
        for (var i = 12; i < 20; ++i) {
            PKSprites.push(i);
        }
        for (var i = 110; i < 115; ++i) {
            PKSprites.push(i);
        }


        //梅花
        for (var i = 22; i < 30; ++i) {
            PKSprites.push(i);
        }
        for (var i = 210; i < 215; ++i) {
            PKSprites.push(i);
        }


        //方块
        for (var i = 32; i < 40; ++i) {
            PKSprites.push(i);
        }
        for (var i = 310; i < 315; ++i) {
            PKSprites.push(i);
        }


        //大小王
        for (var i = 40; i < 42; ++i) {
            PKSprites.push(i);
        }

    },

    isDuizi: function (array) {
        if (array[0] > 51 || array[1] > 51) {
            return false;
        }

        var paiReal1 = this.getPKrealNum(array[0])
        var paiReal2 = this.getPKrealNum(array[1])
        var blReturn = paiReal1 === paiReal2;
        return blReturn;
    },

    isXiangTong3: function (array) {
        var paiReal1 = this.getPKrealNum(array[0])
        var paiReal2 = this.getPKrealNum(array[1])
        var paiReal3 = this.getPKrealNum(array[2])
        var blReturn = paiReal1 === paiReal2 && paiReal2 === paiReal3;
        return blReturn

    },

    isXiangTong4: function (array) {
        var paiReal1 = this.getPKrealNum(array[0])
        var paiReal2 = this.getPKrealNum(array[1])
        var paiReal3 = this.getPKrealNum(array[2])
        var paiReal4 = this.getPKrealNum(array[3])
        var blReturn = paiReal1 === paiReal2 && paiReal2 === paiReal3 && paiReal3 === paiReal4;
        return blReturn
    },

    isShuangWang: function (array) {

        var blReturn = (array[0] === 52 || array[0] === 53) && (array[1] === 52 || array[1] === 53)
        return blReturn
    },

    isLegality: function (array) {
        var blReturn = false;
        switch (array.length) {
            case 1:
                blReturn = true;
                break
            case 2:
                if (this.isShuangWang(array)) {
                    blReturn = true
                } else if (this.isDuizi(array)) {
                    blReturn = true
                }
                break;

            case 3:
                blReturn = this.isXiangTong3(array)
                break;
            case 4:
                blReturn = this.isXiangTong4(array)
                break;
            default:
                blReturn = false;
        }
        return blReturn;
    },

    insertionSort: function (array) {
        for (var i = 1; i < array.length; i++) {
            var key = array[i];
            var j = i - 1;
            while (array[j] < key) {
                array[j + 1] = array[j];
                j--;
            }
            array[j + 1] = key;
        }

        return array;
    },


    sortPK: function (mahjongs) {
        return this.insertionSort(mahjongs)
    },

    setBGStyle: function (style) {
        var old = this.getBGStyle();

        if (old != style) {
            cc.sys.localStorage.setItem('bg_style', style);

            cc.vv.gameNetMgr.refreshBG(style);
        }
    },

    // 0,1,2,3,4,5 黑桃,红桃,草花,方片,小王，大王
    isSpeakDouble3: function (pai) {
        var huaseA = this.getPKspritType(pai[0]);
        var huaseB = this.getPKspritType(pai[1]);
        var roomPeople = cc.vv.SelectRoom.getRoomPeople();
        var blRet = false;
        if (huaseA === 1 || huaseA === 3 && huaseB === 1 || huaseB === 3) {
            if (roomPeople === 5 || roomPeople === 6) {
                blRet = true;
            }
        }

        return blRet;
    },


    getAudioURLByMJID: function (pai,seatUserId) {
      
        var chupai = [];
        for (let i = 0; i < pai.length; ++i) {
            chupai.push(this.getRealCardList(pai[i]));
        }
        if (cc.vv.ddzpkmgr.isOneCard(chupai)) {
            var realId = "b_" + chupai[0];
        } else if (cc.vv.ddzpkmgr.isDouble(chupai)) {

            var realId = "b_p" + chupai[0];

        } else if (cc.vv.ddzpkmgr.isThree(chupai)) {
            var realId = "three_one";
        } else if (cc.vv.ddzpkmgr.isThreeWithOne(chupai)) {
            var realId = 'three_with_one';
        } else if (cc.vv.ddzpkmgr.isThreeWithTwo(chupai)) {
            var realId = 'three_with_one_pair';
        } else if (cc.vv.ddzpkmgr.isScroll(chupai)) {
            var realId = 'shunzi';
        } else if (cc.vv.ddzpkmgr.isDoubleScroll(chupai)) {
            var realId = 'continuous_pair';
        } else if (cc.vv.ddzpkmgr.isPlane(chupai)) {
            var realId = 'airplane';
        } else if (cc.vv.ddzpkmgr.isPlaneWithOne(chupai) || cc.vv.ddzpkmgr.isPlaneWithTwo(chupai)) {
            var realId = 'airplane_with_wing';
        } else if(cc.vv.ddzpkmgr.isFourBoom(chupai)){
            var realId = 'bomb';
        } else if(cc.vv.ddzpkmgr.isKingBoom(chupai)){
            var realId='kingbomb';
        }else if(cc.vv.ddzpkmgr.isFourWithSDDTwo(chupai)){
            var realId='four_with_two_pair';
        }else if(cc.vv.ddzpkmgr.isFourWithDSTwo(chupai)||cc.vv.ddzpkmgr.isFourWithSDTwo(chupai)){
            var realId='four_with_two';
        }
       
        if(realId == null || realId == undefined){
            return ""
        }else{
            var gameName = cc.vv.SelectRoom.getGameName();
            var mylanguage = cc.vv.audioMgr.getLanguageName();

            var sexName = 'WoMan';
            if(cc.vv.baseInfoMap != null){
                var info = cc.vv.baseInfoMap[seatUserId];
                if(info != null && info.sex != null && info == 1){
                    sexName = 'Man';
                }
            }

            return cc.CGameConfigDataModel.getPKItemData(gameName,mylanguage,sexName,realId);
        }


    },
    setSpriteFrameByMJID: function (pre, sprite, mjid) {
        var tmp_obj = cc.vv.controlMgr.getSpriteFrameByMJID(pre, mjid);
        var tmpsprite1 = sprite.node.children[0].getComponent(cc.Sprite);
        (mjid || mjid === 0) && (tmpsprite1.spriteFrame = tmp_obj.tmpNUM);
        var tmpsprite2 = sprite.node.children[1].getComponent(cc.Sprite);
        if (mjid === 52 || mjid === 53) {
            tmpsprite2.node.y = 13
            tmpsprite2.node.height = 164
        } else {
            tmpsprite2.node.y = 20
            tmpsprite2.node.height = 40
        }
        // ll
        (mjid || mjid === 0) && (tmpsprite2.spriteFrame = tmp_obj.tmphuase);
        (mjid || mjid === 0) && (sprite.spriteFrame = tmp_obj.tmpBG);
        (mjid || mjid === 0) || (sprite.spriteFrame = tmp_obj.tmpBack);
        var tmpsprite3 = sprite.node.children[2].getComponent(cc.Sprite);
        (mjid || mjid === 0) && (tmpsprite3.spriteFrame = tmp_obj.tmphuase2);
        sprite.node.active = true;

    },

    // 0,1,2,3,4,5 黑桃,红桃,草花,方片,小王，大王
    //black_0  orange_0  red_0  //bigtag_0 方片  草花  红桃  黑桃
    getSpriteFrameByMJID: function (pre, mjid) {
        var huase = this.getPKspritType(mjid);
        var realNUM = this.getPKrealNum(mjid);
        var retFrame = {
            tmphuase: null,
            tmpNUM: null,
        }

        var tag = '';

        if (huase === 0) {
            var rethua = this.myselftAtlas.getSpriteFrame('bigtag_3')
            var rethua2 = rethua
            tag = "black_"

        } else if (huase === 1) {
            var rethua = this.myselftAtlas.getSpriteFrame('bigtag_2')
            var rethua2 = rethua
            tag = "red_"
        } else if (huase === 2) {
            var rethua = this.myselftAtlas.getSpriteFrame('bigtag_1')
            var rethua2 = rethua
            tag = "black_"
        } else if (huase === 3) {
            var rethua = this.myselftAtlas.getSpriteFrame('bigtag_0')
            var rethua2 = rethua
            tag = "orange_"
        } else if (huase === 4) {
            tag = "smalltag_4"
            var rethua = this.myselftAtlas.getSpriteFrame('smalltag_4')
            var rethua2 = this.myselftAtlas.getSpriteFrame('bigtag_4')
        } else if (huase === 5) {
            tag = "smalltag_5"
            var rethua = this.myselftAtlas.getSpriteFrame('smalltag_5');
            var rethua2 = this.myselftAtlas.getSpriteFrame('bigtag_5');
        }


        retFrame.tmphuase = rethua;
        retFrame.tmphuase2 = rethua2;
        retFrame.tmpNUM = this.myselftAtlas.getSpriteFrame(tag + (realNUM - 1));
        retFrame.tmpBG = this.myselftAtlas.getSpriteFrame('bg');
        retFrame.tmpBack = this.myselftAtlas.getSpriteFrame('poker_back');
        return retFrame;

    },


    // getSpriteFrameByMJID_bak: function (pre, mjid) {
    //     var spriteFrameName = this.getMahjongSpriteByID(mjid);
    //     spriteFrameName = 'default-' + spriteFrameName;
    //     if (pre == "default-") {
    //         return this.myselftAtlas.getSpriteFrame(spriteFrameName);
    //     }
    //     else if (pre == "B_") {
    //         return this.bottomFoldAtlas.getSpriteFrame(spriteFrameName);
    //     }
    //     else if (pre == "L_") {
    //         return this.leftAtlas.getSpriteFrame(spriteFrameName);
    //     }
    //     else if (pre == "R_") {
    //         return this.rightAtlas.getSpriteFrame(spriteFrameName);
    //     }
    // },

    // 0,1,2,3,4,5 黑桃,红桃,草花,方片,小王，大王
    getPKspritType: function (n) {
        var nn = 0
        if (n === 52) {
            nn = 4
        }
        else if (n === 53) {
            nn = 5
        } else {
            nn = n % 4
        }

        return nn
    },

    getPKrealNum: function (n) {

        var nn = parseInt(n / 4) + 3;
        if (nn > 13) {
            nn = nn - 13
        }
        if (n === 52) {
            nn = 52
        }
        if (n === 53) {
            nn = 53
        }
        if (n === 54) {
            nn = 0
        }
        return nn
    },
    getRealCardList: function (card) {
        let realnum = this.getPKrealNum(card);
        if (realnum === 1 || realnum === 2) {
            realnum = realnum * 10 + 4;
        }
        return realnum;
    },
    getMahjongSpriteByID: function (id) {
        var paiType = this.getPKspritType(id)
        var paiReal = this.getPKrealNum(id)

        if (paiType === 4) {
            var tmpID = 52;
        } else if (paiType === 5) {
            var tmpID = 53;
        } else {
            var tmpID = paiType * 13 + paiReal - 2
            if (tmpID < 0) {
                tmpID = 13 + tmpID
            }

        }

        return PKSprites[tmpID];
    },

    getBGStyle: function () {
        var style = 0;
        var t = cc.sys.localStorage.getItem('bg_style');
        if (t != null) {
            style = parseInt(t);
        }
        return style;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
