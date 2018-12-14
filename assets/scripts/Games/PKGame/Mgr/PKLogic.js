//      红，  方 ,   暗方3 ,  亮方3 ,  对3    ,对红3    小王,   大王  ,双王炸
//     103 ， 203 ，  303 ，  403      3      503       52,    53   1003

cc.PaiModul={ 
    three: [[0],[5], [6], [7], [8], [9], [10], [11], [12], [13], [1], [2], [3], [203], [4], [103, 503], [52], [53], [10003]],   //3人局
    four: [[0],[5], [6], [7], [8], [9], [10], [11], [12], [13], [1], [2], [3], [103, 203, 503], [4], [52], [53], [10003]], //4人局
    five: [[0],[5], [6], [7], [8], [9], [10], [11], [12], [13], [1], [2], [3], [4], [103, 203, 503], [52], [53], [10003]], //5人局
    six: [[0],[5], [6], [7], [8], [9], [10], [11], [12], [13], [1], [2], [3], [4], [303, 503], [52], [103, 403], [53], [10003]],   //6人局
}  

var map_max = 15;

cc.Class({
    extends: cc.Component,
 
     
    properties:{
        nseat: null,
        isLiangFangkuai3: false,
    },

    isDuizi : function (array) {
        if (array[0]>51 || array[1]>51)
        {
            return false;
        }
        
        var paiReal1 = this.getPKrealNum(array[0])
        var paiReal2 = this.getPKrealNum(array[1])
        var blReturn = paiReal1 === paiReal2;
        return blReturn;
    },

    isXiangTong3 :  function (array) {
        var paiReal1 = this.getPKrealNum(array[0])
        var paiReal2 = this.getPKrealNum(array[1])
        var paiReal3 = this.getPKrealNum(array[2])
        var blReturn = paiReal1 === paiReal2 && paiReal2 === paiReal3;
        return blReturn
    },

    isXiangTong4 : function (array) {
        var paiReal1 = this.getPKrealNum(array[0])
        var paiReal2 = this.getPKrealNum(array[1])
        var paiReal3 = this.getPKrealNum(array[2])
        var paiReal4 = this.getPKrealNum(array[3])
        var blReturn = paiReal1 === paiReal2 && paiReal2 === paiReal3 && paiReal3 === paiReal4;
        return blReturn
    },

    isShuangWang : function (array) {

        var  blReturn = (array[0] === 52 || array[0] === 53) && (array[1] === 52 || array[1] === 53)
         return blReturn
     },

    isLegality : function (array) {
        var blReturn =false;
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
    getPKrealNum :  function (n) {
        var nn = parseInt(n / 4) + 3;
        if (nn > 13) { nn = nn - 13 };
        if (n === 52) {
            nn = 52
        }
        if (n === 53) {
            nn = 53
        }
        if(n===54){
            nn = 0
        }

        return nn
    },

    //黑桃 0 红桃 1 梅花 2 方块 3 小王 4 大王 5
     getHuase : function(n){

        var nn = 0
        if (n === 52) { nn = 4 }
        else if (n === 53) { nn = 5 } else { nn = n % 4 }
    
        return nn
    
    },

    isAllEqual : function (array){
        if(array.length>0){
           return !array.some(function(value,index){
             return value !== array[0];
           });   
        }else{
            return false;
        }
    },

    getPaiModuldata : function(PaiArr){
        
              
        var nret = 0;
        var nPaiArr = PaiArr.length;
        if(nPaiArr === 1){
            var pai = PaiArr[0];
            var realpai = this.getPKrealNum(pai)
            if (realpai === 3){
               var paitype = this.getHuase(pai);
               if (paitype === 3){//方块3
                    nret = 203
                    if (this.nseat === 6) {
                       if (this.isLiangFangkuai3) {
                           nret = 403;
                       } else nret = 303;
                   }
               }
               
               if (paitype === 1){//红桃3
                nret = 103
                }
    
                if (paitype === 0 || paitype === 2 ){
                    nret = realpai
                }           
              
            }else{
                nret = realpai
            }
    
        }else if(nPaiArr === 2){
            if (this.isShuangWang(PaiArr)) {
                nret = 10003
            } else {
                var pai = PaiArr[0];
                var realpai = this.getPKrealNum(pai)
                if (realpai === 3) {
                    var isDoubleRed3 = true;
                    for (var k in PaiArr) {
                        var paitype = this.getHuase(PaiArr[k])
                        if (paitype === 0 || paitype === 2) {
                            isDoubleRed3 = false;
                            break;
                        }
                    }

                    if (isDoubleRed3) {
                        nret = 503
                    } else nret = realpai

                } else {
                    nret = realpai
                }
            }
                     
        }else {
            var pai = PaiArr[0];
            var realpai = this.getPKrealNum(pai)
            nret = realpai;
        }
        return nret
    },

    //得到牌的权重用于判断大小

    getPaiWeight: function (PaiArr) {


        var tmpRealpai = []

        for(let k in PaiArr){
            var realpai = this.getPKrealNum(PaiArr[k])
            tmpRealpai.push(realpai);
        }
        
        if ( !this.isShuangWang(tmpRealpai) ){
            if (this.isAllEqual(tmpRealpai)===false){
                return -1
            }      
        }
           
        var paiModuldata = this.getPaiModuldata(PaiArr);
        var retWeight = -1;
        var tmpWeightArr = [];
        switch (this.nseat) {
            case 3:
                tmpWeightArr = cc.PaiModul.three;
                break;
            case 4:
                tmpWeightArr = cc.PaiModul.four;
                break;
            case 5:
                tmpWeightArr = cc.PaiModul.five;
                break;
            case 6:
                tmpWeightArr = cc.PaiModul.six;
                break;

            default:

                break;
        }


        for (let k = 0; k < tmpWeightArr.length; k++) {
            var nArr = tmpWeightArr[k];
            for (let kk = 0; kk < nArr.length; kk++) {
                if (nArr[kk] === paiModuldata) {
                    retWeight = k;
                    break;
                }
            }
            if (retWeight !== -1) {
                break;
            }

        }
        console.log(retWeight)


        var ntmpNUM = 0;
        if(PaiArr.length ===1 || PaiArr.length === 2){
            ntmpNUM = 1;
        } else ntmpNUM = PaiArr.length;

       if(this.isShuangWang(PaiArr)){
        ntmpNUM = 10
       }

        retWeight = retWeight + ntmpNUM * 100;

        return retWeight;
    },


    getPaiCompare(data){
        var lastPai = data.lastPai;
        var selectPai = data.selectPai;

        if(this.isShuangWang(lastPai)){
            return false;
        } else if(this.isShuangWang(selectPai)){
            return true;
        }

        if(lastPai[0] !==54){
            if (lastPai.length < 3 && selectPai.length < 3) {
                if (lastPai.length !== selectPai.length) {
                    return false;
                }
            }
        }
       

        return !(this.getPaiWeight(lastPai) >= this.getPaiWeight(selectPai))
       
        

    },


    getArrayMap: function (array) {
        var map = [];
        for (var i = 0; i < map_max; i++) {
            map[i] = 0;
        }
        for (var i = 0; i < array.length; i++) {
            var c = this.getPKrealNum(array[i]);
            if (c == 53) {
                map[14]++;
            }
            else if (c == 52) {
                map[13]++;
            }
            else if (c < 5) {
                map[c + 8]++;
            }
            else {
                map[c - 5]++;
            }

        }
        return map;
    },

    del_my_Array: function (my_Array, pai) {

        // console.log('pai = ' + pai);
        if (pai == 14) {

            var index = my_Array.indexOf(53);
            my_Array.splice(index, 1);
            return 53;
        }
        else if (pai == 13) {
            var index = my_Array.indexOf(52);
            my_Array.splice(index, 1);
            return 52;
        }
        else if (pai >= 0 && pai <= 10) {
            var st = (pai + 2) * 4;
            for (var i = st; i < st + 4; i++) {
                var index = my_Array.indexOf(i);
                if (index >= 0) {
                    my_Array.splice(index, 1);
                    return i;
                }

            }


        }
        else if (pai == 12) {
            var st = 4;
            for (var i = st; i < st + 4; i++) {
                var index = my_Array.indexOf(i);
                if (index >= 0) {
                    my_Array.splice(index, 1);
                    return i;
                }

            }
        }
        else if (pai == 11) {
            var index = my_Array.indexOf(0);
            if (index >= 0) {
                my_Array.splice(index, 1);
                return 0;
            }

            var index = my_Array.indexOf(2);
            if (index >= 0) {
                my_Array.splice(index, 1);
                return 2;
            }

            var index = my_Array.indexOf(3);
            if (index >= 0) {
                my_Array.splice(index, 1);
                return 3;
            }

            var index = my_Array.indexOf(1);
            if (index >= 0) {
                my_Array.splice(index, 1);
                return 1;
            }
        }
    },

    getArrayColor : function (my_Array, map) {

        var tmp_my_Array = my_Array.concat();
        var arr = [];
        for (var i = 0; i < map.length; i++) {
            arr.push(this.del_my_Array(tmp_my_Array, map[i]));
        } 
        return arr;
    },

    getPutList_Z: function (my_Array) {

        var map = this.getArrayMap(my_Array);
        var PutList = [];

        for (var i = 0; i < map_max; i++) {

            if (map[i] == 0 || map[i] > 2) {
                continue;
            }
            var tmpPut = [];
            for (var j = 0; j < map[i]; j++) {
                tmpPut.push(i);
            }
            PutList.push(this.getArrayColor(my_Array, tmpPut));
        }

        for (var i = 0; i < map_max; i++) {
            if (map[i] == 0 || map[i] != 3) {
                continue;
            }
            var tmpPut = [];
            for (var j = 0; j < map[i]; j++) {
                tmpPut.push(i);
            }
            PutList.push(this.getArrayColor(my_Array, tmpPut));
        }

        for (var i = 0; i < map_max; i++) {
            if (map[i] == 0 || map[i] != 4) {
                continue;
            }
            var tmpPut = [];
            for (var j = 0; j < map[i]; j++) {
                tmpPut.push(i);
            }
            PutList.push(this.getArrayColor(my_Array, tmpPut));
        }

        if (map[14] == 1 && map[13] == 1) {
            PutList.push([52, 53]);
        }


        return PutList;
    },


    getPutList_B : function (pre_Cards, my_Array) {

        var map = this.getArrayMap(my_Array);
        var PutList = [];
        var map_val = this.getPKrealNum(pre_Cards[0]);
        if (map_val  == 53) {
            map_val = 14;
        }
        else if (map_val == 52) {
            map_val = 13;
        }
        else if (map_val < 5) {
            map_val += 8;
        }
        else {
            map_val -= 5;
        }
    
    
        console.log('val ' + map_val);
        if (pre_Cards.length == 2 && pre_Cards[0] + pre_Cards[1] == 105) {
            return PutList;
        }
    
        if (pre_Cards.length == 1) {
    
            if (this.nseat == 3) {
                if (pre_Cards.indexOf(1) >= 0) {
                    map_val = 12;
                }
            }
            else if (this.nseat == 5) {
                if (pre_Cards.indexOf(1) >= 0) {
                    map_val = 12;
                }
                if (pre_Cards.indexOf(3) >= 0) {
                    map_val = 12;
                }
            }
            else if (this.nseat == 6) {
                if (pre_Cards.indexOf(3) >= 0) {
                    if (this.isLiangFangkuai3) {
                        map_val = 13;
                    }
                    else {
                        map_val = 12;
                    }
                }
                if (pre_Cards.indexOf(1) >= 0) {
                    map_val = 13;
                }
            }
    
            for (var i = map_val+1; i < map_max; i++) {
                if (map[i] !=1) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 1; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 2) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 1; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = 0; i < map_max; i++) {
                if (map[i] != 3) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 3; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 3) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 1; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = 0; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 4; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 1; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = 0; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 3; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            if (this.nseat==3) {
                if (my_Array.indexOf(1) >= 0 && map_val < 13 ) {
                    PutList.push([1]);
                }
            }
            else if (this.nseat == 5) {
                if (my_Array.indexOf(1) >= 0 && map_val < 13 && pre_Cards[0] != 3) {
                    PutList.push([1]);
                }
                if (my_Array.indexOf(3) >= 0 && map_val < 13 && pre_Cards[0] != 1) {
                    PutList.push([3]);
                }
            }
            else if (this.nseat == 6) {
                if (my_Array.indexOf(3) >= 0) {
    
                    if (map_val < 13) {
                        PutList.push([3]);
                    }
                    else if (map_val == 13 && IsLiangF3 && pre_Cards[0] == 52) {
                        PutList.push([3]);
                    }
    
                }
                if (my_Array.indexOf(1) >= 0) {
    
                    if (map_val < 13) {
                        PutList.push([1]);
                    }
                    else if (map_val == 13 && pre_Cards[0] == 52) {
                        PutList.push([1]);
                    }                
                }                                       
            }
        }
        else if (pre_Cards.length == 2) {
    
            if (pre_Cards.indexOf(1) >= 0 && pre_Cards.indexOf(3) >= 0 && this.nseat >= 4) {
                map_val = 15;
            }
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 2) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 2; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            if (my_Array.indexOf(1) >= 0 && my_Array.indexOf(3) >= 0 && this.nseat >= 4) {
                PutList.push([1,3]);
            }
    
            for (var i = 0; i < map_max; i++) {
                if (map[i] != 3) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 3; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 3) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 2; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = 0; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 4; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 2; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = 0; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 3; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
        }
    
        else if (pre_Cards.length == 3) {
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 3) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 3; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = 0; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 4; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
    
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 3; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
        }
    
        else if (pre_Cards.length == 4) {
            for (var i = map_val + 1; i < map_max; i++) {
                if (map[i] != 4) {
                    continue;
                }
                var tmpPut = [];
                for (var j = 0; j < 4; j++) {
                    tmpPut.push(i);
                }
                PutList.push(this.getArrayColor(my_Array, tmpPut));
            }
        }
    
        if (map[14] == 1 && map[13] == 1) {
            PutList.push([52, 53]);
        }
    
        return PutList;
    
    },

    getPutList : function (pre_Cards, my_Array ) {

        if (pre_Cards[0] == 54) {
            return this.getPutList_Z(my_Array);
        }
        else {
            return this.getPutList_B(pre_Cards, my_Array);
        }
    },


    // var this.isLiangFangkuai3 = false;
    // var nseat = 6;
    // var holds = [0, 2, 1, 4, 8, 9, 10, 11, 12, 13, 14, 25, 52, 53];

    // console.log('getArrayMap ', getArrayMap(holds));
    // var PutList = getPutList([3], holds);








    ////////////////////////智能出牌//////////////////////////


    //////////牌型比较////////////
    /*@ my_Cards, 本家出牌,
     *@ pre_Cards,上家出牌,
     *@ ret true/false
     */
    isOvercomePrev: function (my_Cards, pre_Cards) {
        if (my_Cards == undefined || pre_Cards == undefined)
            return false
        var my_cardsInfo = this.getCardType(my_Cards)
        var pre_cardsInfo = this.getCardType(pre_Cards)

        var myCards = this.convertCardsNumToPoint(my_Cards)
        var myCardType = my_cardsInfo.cardType
        var preCards = this.convertCardsNumToPoint(pre_Cards)
        var preCardType = pre_cardsInfo.cardType

        myCards.sort(this.compByPointAscending)
        preCards.sort(this.compByPointAscending)

        var preSize = preCards.length
        var mySize = myCards.length
        if (preSize == 0 && mySize != 0)  //我是第一家出牌;
            return true
        if (preCards.length == 0 && preCardType == window.ECardType.UNDEFINE)
            return true

        if (preCardType == window.ECardType.WANG_ZHA)
            return false;
        else if (myCardType == window.ECardType.WANG_ZHA)
            return true;
        else if (myCardType == window.ECardType.ZHA_DAN && preCardType != window.ECardType.ZHA_DAN)
            return true;

        if (myCardType != preCardType)
            return false
        else if (myCardType == window.ECardType.DAN ||           //单牌;
            myCardType == window.ECardType.DUI_ZI ||          //对子;
            myCardType == window.ECardType.SAN_BU_DAI ||      //三不带;
            myCardType == window.ECardType.SAN_DAI_YI ||      //三带一;
            myCardType == window.ECardType.SAN_DAI_DUI ||     //三带二;
            myCardType == window.ECardType.SI_DAI_DAN ||      //四带两个单牌;
            myCardType == window.ECardType.SI_DAI_DUI ||      //四带两个对子;
            myCardType == window.ECardType.ZHA_DAN)          //砸蛋; 
        {
            return my_cardsInfo.beg > pre_cardsInfo.beg
        }

        else if (myCardType == window.ECardType.SHUN_ZI ||           //顺子;
            myCardType == window.ECardType.LIAN_DUI ||            //连对;
            myCardType == window.ECardType.FEI_JI_BU_DAI ||       //三顺;
            myCardType == window.ECardType.FEI_JI_DAI_DAN ||      //飞机带单,几个三连就带几个单;
            myCardType == window.ECardType.FEI_JI_DAI_DUI)        //飞机带对,几个三连就带几个对;
        {
            if (my_cardsInfo.len == pre_cardsInfo.len) {
                return my_cardsInfo.beg > pre_cardsInfo.beg
            }
        }
        return false
    },




//数组去重;
unique : function(arr)
{
    var result = [], hash = {}
    for (var i=0, elem; (elem = arr[i])!=null; i++)
    {
        if ( !hash[elem] )
        {
            result.push(arr[i])
            hash[elem] = true
        }
    }
    return result
},
//是否数组;
isArray : function(o){
    if ( o && typeof o === 'object' && Array == o.constructor)
        return true
    return false
},

//提取牌组中所有的非重复的单牌/对子/三条/四条,升序;
extract : function(cards)
{
    var count = 0
    var container = 
    {
        danpai:[],
        duizi:[],
        santiao:[],
        sitiao:[],
    }
    for(var i=cards.length-1; i>=0; i--)
    {
        for(var j=cards.length-1; j>=0; j--)
        {
            if (cards[i] == cards[j])
                count++
        }
        if (count == 1)
        {
            container.danpai.push(cards[i])
        }
        else if (count == 2)
        {
            container.duizi.push(cards[i])
        }
        else if(count == 3)
        {
            container.santiao.push(cards[i])
        }
        else if(count == 4)
        {
            container.sitiao.push(cards[i])
        }
        count = 0
    }
    container.danpai = this.unique(container.danpai)
    container.duizi = this.unique(container.duizi)
    container.santiao = this.unique(container.santiao)
    container.sitiao = this.unique(container.sitiao)

    container.danpai.sort( this.compByPointAscending )
    container.duizi.sort( this.compByPointAscending )
    container.santiao.sort( this.compByPointAscending )
    container.sitiao.sort( this.compByPointAscending )
    return container
},


/////////////牌型判断//////////////
//ret = {flag:false, beg: -1, len: -1}
//
// 单牌; ret:true + 主值;
isDan : function(cards)
{
    if (cards != undefined && cards.length == 1){
        return {flag:true, beg:cards[0], len:-1}
    }
        
    return {flag:false, beg:-1, len:-1}
},
//对子;
isDuiZi : function(cards)
{
    var arr = this.convertCardsNumToPoint(cards)
    if (arr.length == 2) 
    {
        if (arr[0] == arr[1]) 
            return {flag:true, beg: arr[0], len: -1}
    }
    return {flag:false, beg: -1, len: -1}
},
//3个不带;
isSanBuDai : function(cards)
{
    var arr = this.convertCardsNumToPoint(cards)
    if(arr.length == 3 && arr[0] == arr[1] && arr[0] == arr[2])
    {
        return {flag:true, beg: arr[0], len: -1}
    }
    return {flag:false, beg: -1, len: -1}
},

//炸弹;
isZhaDan : function(cards)
{
    var arr = this.convertCardsNumToPoint(cards)
    if (arr.length == 4 && arr[0] == arr[1] && arr[0] == arr[2] && arr[0] == arr[3])
    {
        return {flag:true, beg: arr[0], len: 1}
    }
    return {flag:false, beg: -1, len: -1}
},
//王炸,一对王;
isWangZha : function(cards)
{
    var arr = this.convertCardsNumToPoint(cards)
    if (arr.length == 2 && arr[0] >= window.EJoker.JokerA && arr[1] >= window.EJoker.JokerA)
        return {flag:true, beg: -1, len: -1}
    return {flag:false, beg: -1, len: -1}
},


///////////////确认牌型///////////////
//@ret:{cardType:0, beg:-1, len:-1} 牌型, 主值起值, 主值长度;
getCardType : function(in_cards)
{  
    var cards = this.convertCardsNumToPoint(in_cards)
    var card_type = window.ECardType.UNDEFINE;
    var ret = {}
    if (cards != undefined) 
    {
        console.log('luobin-game','GameTool','getCardType','cards:',JSON.stringify(cards));
        ret = this.isDan(cards)
        if ( ret.flag == true)
        {//单牌;                                  
            card_type = window.ECardType.DAN;
            return {cardType: card_type, beg:ret.beg, len:ret.len}
        }

        ret = this.isDuiZi(cards)
        if (ret.flag == true) 
        {//对子;
            card_type = window.ECardType.DUI_ZI;
            return {cardType: card_type, beg:ret.beg, len:ret.len}
        }

        ret = this.isSanBuDai(cards)
        if (ret.flag == true)
        {//三不带;
            card_type = window.ECardType.SAN_BU_DAI;
            return {cardType: card_type, beg:ret.beg, len:ret.len}
        }
        
        ret = this.isZhaDan(cards)
        if (ret.flag == true)
        {  //炸弹;
            card_type = window.ECardType.ZHA_DAN;
            return {cardType: card_type, beg:ret.beg, len:ret.len}
        }

        ret = this.isWangZha(cards)
        if (ret.flag == true)
        {  //王炸;
            card_type = window.ECardType.WANG_ZHA;
            return {cardType: card_type, beg:ret.beg, len:ret.len}
        }
    }
    return {cardType: card_type, beg: -1, len: -1}
},





/////////////简单AI的出牌判定,且选出一组可用牌////////////
/*@ 查询手牌中是否有比上家更大的牌，AI简单出牌
 *@ my_Cards, 本家所有的牌,
 *@ pre_Cards,  上家出牌,
 *@ preCardType,上家的牌型,
 *@ ret = { flag: false,
            cards: []       // 推荐可以出的第一组牌;
        }
 */
hasOverComePre : function(my_Cards, pre_Cards, preCardType)
{
    if (my_Cards == undefined || pre_Cards == undefined)
        return false
    if (preCardType == undefined)
    {
        cc.log("上家手牌类型错误")
        return {flag:false, cards:[]}
    }
    var retCards = []

    var myCards = this.convertCardsNumToPoint(my_Cards)
    var mySize = myCards.length
    myCards.sort(this.compByPointDescending)
    //提取所有的单牌/对子/三条/四条;
    var container = {}
    container = this.extract(myCards)

    var pre_cardsInfo   = this.getCardType(pre_Cards)
    var preCards = this.convertCardsNumToPoint(pre_Cards)
    preCards.sort(this.compByPointDescending)     
    var preSize = pre_Cards.length

    if (preSize == 0 && mySize != 0)
    {//先出牌,暂时出一张最小的单牌;
        var ret = this.getBiggerCards(container, 0, 1)
        if (ret.flag == true)
            return {flag:true, cards: ret.cards}
    }

    if( preCardType == window.ECardType.WANG_ZHA)
        return {flag:false, cards:[]}
    
    /////////////////////优先匹配牌型///////////////////
    if (preCardType == window.ECardType.DAN)
    {//单牌;
        var ret = this.getBiggerCards(container, pre_cardsInfo.beg, 1, false)
        if (ret.flag == true)
            return {flag:true, cards: ret.cards}
    }
    else if (preCardType == window.ECardType.DUI_ZI)
    {//对子;
        if (mySize < 2)
            return {flag:false, cards:[]}
        var ret = this.getBiggerCards(container, pre_cardsInfo.beg, 2, false)
        if (ret.flag == true)
            return {flag:true, cards: ret.cards}
    }
    else if (preCardType == window.ECardType.SAN_BU_DAI)
    {//三不带;
        if (mySize < 3)
            return {flag:false, cards:[]}
        var ret = this.getBiggerCards(container, pre_cardsInfo.beg, 3, false)
        if (ret.flag == true)
            return {flag:true, cards: ret.cards}
    }
    else if (preCardType == window.ECardType.ZHA_DAN)
    {//炸弹;
        var main_ret = this.getBiggerCards(container, pre_cardsInfo.beg, 4)
        if (main_ret.flag == true)
            return {flag:true, cards:main_ret.cards}

        if (mySize >= 2 )
        {//我有王炸;
            var retCards = []
            retCards.push(myCards[0])
            retCards.push(myCards[1])
            var ret = this.isWangZha(retCards) 
            if (ret.flag == true)
                return {flag:true, cards: retCards}
        }
        return {flag:false, cards:[]}
    }
    //最后考虑炸弹和王炸;
    if(mySize >= 4)
    {
        var main_ret = this.getBiggerCards(container, -1, 4)   //取任意4条,
        if (main_ret.flag == true)
            return {flag:true, cards:main_ret.cards}
    }
    if (mySize >= 2 )
    {//王炸;
        var retCards = []
        retCards.push(myCards[0])
        retCards.push(myCards[1])
        var ret = this.isWangZha(retCards) 
        if (ret.flag == true)
            return {flag:true, cards: retCards}
    }  

    return {flag:false, cards:[]}
},



/* 从container中取比[beg/len]大的一种牌, 单牌/对子/三条/四条;
 * @ container = {danpai:[],duizi:[],santiao:[],sitiao:[]}
 * @ beg: 起值(关键值), target_len:取出值长度;
 * @ flag: 是否允许拆分四条,默认或不设置为允许;
 * @ ret = {flag:false, cards:[]}
 **/
getBiggerCards : function(container, beg, target_len, flag)
{
    var con = container
    var len = target_len
    var retCards = []
    if (len <= 1)
    {
        for (var i=0; i<con.danpai.length; i++)
        {
            if (con.danpai[i] > beg)
            {
                retCards.push(con.danpai[i])
                return {flag:true, cards:retCards}
            }
        }
    }
    if (len <= 2)
    {
        for (var i=0; i<con.duizi.length; i++)
        {
            if (con.duizi[i] > beg)
            {
                for(var j=0; j<len; j++)
                {
                    retCards.push(con.duizi[i])
                }
                return {flag:true, cards:retCards}
            }
        }

    }
    if (len <= 3)
    {
        for (var i=0; i<con.santiao.length; i++)
        {
            if (con.santiao[i] > beg)
            {
                for(var j=0; j<len; j++)
                {
                    retCards.push(con.santiao[i])
                }
                return {flag:true, cards:retCards}
            }
        }
    }
    if (flag == undefined || flag == true)
    {
        if (len <= 4)
        {
            for (var i=0; i<con.sitiao.length; i++)
            {
                if (con.sitiao[i] > beg)
                {
                    for(var j=0; j<len; j++)
                    {
                        retCards.push(con.sitiao[i])
                    }
                    return {flag:true, cards:retCards}
                }
            }
        }
    }
    return {flag:false, cards:[]}
},
// 从container中取一组辅牌, 单牌/对子/三条;
// @ container = {danpai:[],duizi:[],santiao:[],sitiao:[]}
// @ len:1/2/3, 单牌/对子/三条, 类型长度;
// @ excludes: 需要排除的数值,
// @ ret = {flag:false, cards:[]}
getSubCards : function(container, len, excludes)
{
    var con = container
    var len = len
    var retCards = []
    var hash = {}
    if (excludes != undefined)
    {
        for(var i=0, elem; (elem=excludes[i])!=null; i++)
        {
            hash[elem] = true
        }
    }

    if (len <= 1)
    {
        //双王同时存在则剔除双王;
        var danpai = this.splitShuangWang(con.danpai)
        for (var i=0; i<danpai.length; i++)
        {
            retCards.push(danpai[i])
            return {flag:true, cards:retCards}
        }
        /*for (var i=0; i<con.danpai.length; i++)
        {
            retCards.push(con.danpai[i])
            return {flag:true, cards:retCards}
        }*/
    }
    if (len <= 2)
    {
        for (var i=0; i<con.duizi.length; i++)
        {
            for(var j=0; j<len; j++)
            {
                retCards.push(con.duizi[i])
            }
            return {flag:true, cards:retCards}
        }

    }
    if (len <= 3)
    {
        for (var i=0; i<con.santiao.length; i++)
        {
            // 排除excludes中指定的牌值;
            if (hash[con.santiao[i]] == true)
                continue
            for(var j=0; j<len; j++)
            {
                retCards.push(con.santiao[i])
            }
            return {flag:true, cards:retCards}
        }
    }
    return {flag:false, cards:[]}
},

/*从container中取比[beg/len]大的一组牌, 单牌/对子/三条/四条;
 *@ container = {danpai:[],duizi:[],santiao:[],sitiao:[]}
 *@ beg: 起值(关键值), target_len:取出值长度;
 *@ flag: 是否允许拆分四条, 默认或未设置为允许;
 *@ ret = {flag:false, cards:[]}
 */
getBiggerCardsArr : function(container, beg, target_len, flag)
{
    var con = container
    var len = target_len
    var retCards = []
    if (len <= 1)
    {
        for (var i=0; i<con.danpai.length; i++)
        {
            var temp = []
            if (con.danpai[i] > beg)
                temp.push(con.danpai[i])
            if (temp.length > 0)
                retCards.push(temp)
        }
    }
    if (len <= 2)
    {
        for (var i=0; i<con.duizi.length; i++)
        {
            if (con.duizi[i] > beg)
            {
                var temp = []
                for(var j=0; j<len; j++)
                    temp.push(con.duizi[i])
                if (temp.length > 0)
                    retCards.push(temp)
            }
        }

    }
    if (len <= 3)
    {
        for (var i=0; i<con.santiao.length; i++)
        {
            if (con.santiao[i] > beg)
            {
                var temp = []
                for(var j=0; j<len; j++)
                    temp.push(con.santiao[i])
                if (temp.length > 0)
                    retCards.push(temp)
            }
        }
    }
    if (flag == undefined || flag == true)
    {
        if (len <= 4)
        {
            for (var i=0; i<con.sitiao.length; i++)
            {
                if (con.sitiao[i] > beg)
                {
                    var temp = []
                    for(var j=0; j<len; j++)
                        temp.push(con.sitiao[i])
                    if (temp.length > 0)
                        retCards.push(temp)
                }
            }
        }
    }
    return retCards
},


//四条和王炸的集;
//@parm:
getSitiao_Wangzha : function(container)
{
    var special_arr = []
    special_arr = this.getBiggerCardsArr(container, -1, 4, true)
    var cards = []
    var len = container.danpai.length
    if (len >= 2)
    {
        container.danpai.sort( this.compByPointAscending)
        cards.push(container.danpai[len-1])
        cards.push(container.danpai[len-2])
        var ret = this.isWangZha(cards)
        if (ret.flag == true)
            special_arr.push(cards)
    }    
    return special_arr
},
getWangzha : function(container)
{
    var wangzha = []
    var len = container.danpai.length
    if (len >= 2)
    {
        container.danpai.sort( this.compByPointAscending)
        wangzha.push(container.danpai[len-1])
        wangzha.push(container.danpai[len-2])
        var ret = this.isWangZha(wangzha)
        if (ret.flag == true)
            return {flag:true, cards:wangzha}
    }
    return {flag:false, cards:[]}
},


//////////////////////////////////////////////////////////
/////////////提示,获取克制上家牌型的所有牌组序列/////////////
getTips : function(my_Cards, pre_Cards, preCardType)
{
    if (preCardType == undefined)
    {
        cc.log("上家出牌类型错误")
        return []
    }

    var pre_cardsInfo = this.getCardType(pre_Cards)
    var preCards = this.convertCardsNumToPoint(pre_Cards)
    preCards.sort(this.compByPointDescending)
    var preSize = pre_Cards.length
    if (pre_cardsInfo.cardType != preCardType)
    {
        cc.log("传入的上家出牌类型和本地计算的出牌类型不匹配")
        return []
    }

    var myCards = this.convertCardsNumToPoint(my_Cards)
    var mySize = myCards.length
    myCards.sort(this.compByPointDescending)
    //提取所有的单牌/对子/三条/四条;
    var container = {}
    container = this.extract(myCards)

    if (preSize == 0 && mySize != 0)
    {//获取玩家先出牌的提示序列组;
        var retCardsArr = this.getFirstTips(myCards)
        return retCardsArr
    }

    if( preCardType == window.ECardType.WANG_ZHA)
        return []

    if (preCardType == window.ECardType.DAN)
    {//单牌;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 1, false)
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.DUI_ZI)
    {//对子;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 2, false)
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.SAN_BU_DAI)
    {//三不带;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 3, false)
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.SAN_DAI_YI)
    {//三带一
        //主值;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 3, false)
        var exceptArr = []
        for (var i=0; i<retCardsArr.length; i++)
        {
            var sub_ret = this.getSubCards(container, 1, retCardsArr[i] )
            if (sub_ret.flag == true)
                retCardsArr[i] = retCardsArr[i].concat( sub_ret.cards )
            else
            {//没有可匹配的辅值,标记为排除;
                exceptArr.push(retCardsArr[i])
            }
        }
        for(var i=0; i<exceptArr.length; i++)
        {
            for(var j=0; j<retCardsArr.length; j++)
            {
                if (exceptArr[i].toString() == retCardsArr[j].toString())
                {
                    retCardsArr.splice(j, 1)
                    break
                }
            }
        }

        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.SAN_DAI_DUI)
    {//三带对;
        //主值;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 3, false)
        var exceptArr = []
        for (var i=0; i<retCardsArr.length; i++)
        {
            var sub_ret = this.getSubCards(container, 2, retCardsArr[i] )
            if (sub_ret.flag == true)
                retCardsArr[i] = retCardsArr[i].concat( sub_ret.cards )
            else
            {//没有可匹配的辅值,标记为排除;
                exceptArr.push(retCardsArr[i])
            }
        }
        for(var i=0; i<exceptArr.length; i++)
        {
            for(var j=0; j<retCardsArr.length; j++)
            {
                if (exceptArr[i].toString() == retCardsArr[j].toString())
                {
                    retCardsArr.splice(j, 1)
                    break
                }
            }
        }
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.SI_DAI_DAN)
    {//四带两个单牌;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 4, true)
        if (retCardsArr.length > 0)
        {
            var exceptArr = []
            for (var i=0; i<retCardsArr.length; i++)
            {//两单;
                var len = 2
                var temp = []
                for(var j=0; j< container.danpai.length; j++)
                {
                    if (len==0)
                    {
                        break
                    }
                    temp.push(container.danpai[j])
                    len--
                }
                for( var j=0; j< container.duizi.length; j++ )
                {
                    if (len==0)
                    {
                        break
                    }
                    for(var k=0; k<2; k++)
                    {
                        if (len==0)
                        {
                            break
                        }
                        temp.push(container.duizi[j])
                        len--
                    }
                }
                for( var j=0; j< container.santiao.length; j++)
                {//拆三条;
                    if (len==0)
                    {
                        break
                    }
                    for(var k=0; k<3; k++)
                    {
                        if (len==0)
                        {
                            break
                        }
                        temp.push(container.santiao[j])
                        len--
                    }
                }
                for (var j=0; j< container.sitiao.length; j++)
                {//拆四条;
                    if (len==0)
                    {
                        break
                    }
                    var flag = this.isContainInCards(container.sitiao[j], retCardsArr[i])
                    if (flag == false)
                    {
                        for(var k=0; k<4; k++)
                        {
                            if (len==0)
                            {
                                break
                            }
                            temp.push(container.sitiao[j])
                            len--
                        }
                    }
                }
                if (len == 0)
                {
                    retCardsArr[i] = retCardsArr[i].concat(temp)
                }
                else
                {//没有可匹配的辅值,标记为排除;
                    exceptArr.push(retCardsArr[i])
                }
            }
            for(var i=0; i<exceptArr.length; i++)
            {
                for(var j=0; j<retCardsArr.length; j++)
                {
                    if (exceptArr[i].toString() == retCardsArr[j].toString())
                    {
                        retCardsArr.splice(j, 1)
                        break
                    }
                }
            }
        }
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.SI_DAI_DUI)
    {//四带两个对子;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 4, true)
        if (retCardsArr.length > 0)
        {
            var exceptArr = []
            for (var i=0; i<retCardsArr.length; i++)
            {//2对子;
                var len = 2
                var temp = []
                for( var j=0; j< container.duizi.length; j++ )
                {
                    if (len==0)
                    {
                        break
                    }
                    temp.push(container.duizi[j])
                    temp.push(container.duizi[j])
                    len--
                }
                for( var j=0; j< container.santiao.length; j++)
                {//拆三条;
                    if (len==0)
                    {
                        break
                    }
                    temp.push(container.santiao[j])
                    temp.push(container.santiao[j])
                    len--
                }
                /*四带对子不拆四条补齐辅牌;和服务器保持一致;
                for (var j=0; j< container.sitiao.length; j++)
                {//拆四条;
                    if (len==0)
                    {
                        break
                    }
                    var flag = this.isContainInCards(container.sitiao[j], retCardsArr[i])
                    if (flag == false)
                    {
                        for(var k=0; k<2; k++)
                        {
                            if (len==0)
                                break
                            temp.push(container.sitiao[j])
                            temp.push(container.sitiao[j])
                            len --
                        }
                    }
                }*/
                if (len == 0)
                {
                    retCardsArr[i] = retCardsArr[i].concat(temp)
                }
                else
                {
                    exceptArr.push(retCardsArr[i])
                }
            }
            for(var i=0; i<exceptArr.length; i++)
            {
                for(var j=0; j<retCardsArr.length; j++)
                {
                    if (exceptArr[i].toString() == retCardsArr[j].toString())
                    {
                        retCardsArr.splice(j, 1)
                        break
                    }
                }
            }
        }
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.SHUN_ZI)
    {//顺子;
        var retCardsArr = this.getBiggerShunZiArr(myCards, pre_cardsInfo.beg, pre_cardsInfo.len, window.ECardType.SHUN_ZI)
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.LIAN_DUI)
    {//连对;
        var des = []
        des = container.duizi.concat( container.santiao )
        des = des.concat( container.sitiao )
        des.sort( this.compByPointAscending )
        var retCardsArr = this.getBiggerShunZiArr(des, pre_cardsInfo.beg, pre_cardsInfo.len, window.ECardType.LIAN_DUI)
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.FEI_JI_BU_DAI)
    {//三顺
        var des = []
        des = container.santiao.concat( container.sitiao )
        des.sort( this.compByPointAscending )
        var retCardsArr = this.getBiggerShunZiArr(des, pre_cardsInfo.beg, pre_cardsInfo.len, window.ECardType.FEI_JI_BU_DAI)
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }

    else if (preCardType == window.ECardType.FEI_JI_DAI_DAN)
    {//飞机带单;
        var des = []
        des = container.santiao.concat( container.sitiao )
        des.sort( this.compByPointAscending )
        var retCardsArr = this.getBiggerShunZiArr(des, pre_cardsInfo.beg, pre_cardsInfo.len, window.ECardType.FEI_JI_BU_DAI)
        if (retCardsArr.length > 0)
        {
            var exceptArr = []
            for (var i=0; i<retCardsArr.length; i++)
            {
                var len = pre_cardsInfo.len     //飞机单排数目和主体数目相同;
                var temp = []
                for(var j=0; j< container.danpai.length; j++)
                {
                    if (len==0)
                    {
                        break
                    }
                    temp.push(container.danpai[j])
                    len--
                }
                for( var j=0; j< container.duizi.length; j++ )
                {
                    if (len==0)
                    {
                        break
                    }
                    for(var k=0; k<2; k++)
                    {
                        if (len==0)
                        {
                            break
                        }
                        temp.push(container.duizi[j])
                        len--
                    }
                }
                for( var j=0; j< container.santiao.length; j++)
                {//拆三条;
                    if (len==0)
                    {
                        break
                    }
                    var flag = this.isContainInCards( container.santiao[j], retCardsArr[i] )
                    if (flag == false)
                    {
                        for(var k=0; k<3; k++)
                        {
                            if (len==0)
                            {
                                break
                            }
                            temp.push(container.santiao[j])
                            len--
                        }
                    }
                }
                for (var j=0; j< container.sitiao.length; j++)
                {//拆四条;
                    if (len==0)
                    {
                        break
                    }
                    var flag = this.isContainInCards(container.sitiao[j], retCardsArr[i])
                    if (flag == false)
                    {
                        for(var k=0; k<4; k++)
                        {
                            if (len==0)
                            {
                                break
                            }
                            temp.push(container.sitiao[j])
                            len--
                        }
                    }
                }
                if (len == 0)
                {
                    retCardsArr[i] = retCardsArr[i].concat(temp)
                }
                else
                {//没有可匹配的辅值,标记为排除;
                    exceptArr.push(retCardsArr[i])
                }
            }
            for(var i=0; i<exceptArr.length; i++)
            {
                for(var j=0; j<retCardsArr.length; j++)
                {
                    if (exceptArr[i].toString() == retCardsArr[j].toString())
                    {
                        retCardsArr.splice(j, 1)
                        break
                    }
                }
            }
        }
        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.FEI_JI_DAI_DUI)
    {//飞机带对子;
        var des = []
        des = container.santiao.concat( container.sitiao )
        des.sort( this.compByPointAscending )
        var retCardsArr = this.getBiggerShunZiArr(des, pre_cardsInfo.beg, pre_cardsInfo.len, window.ECardType.FEI_JI_BU_DAI)
        if (retCardsArr.length > 0)
        {
            var exceptArr = []  //需要排除的主值项目;
            for (var i=0; i<retCardsArr.length; i++)
            {//匹配辅值;
                var len = pre_cardsInfo.len
                var temp = []
                for( var j=0; j< container.duizi.length; j++ )
                {
                    if (len==0)
                    {
                        break
                    }
                    temp.push(container.duizi[j])
                    temp.push(container.duizi[j])
                    len--
                }
                for( var j=0; j< container.santiao.length; j++)
                {//拆三条;
                    if (len==0)
                    {
                        break
                    }
                    var flag = this.isContainInCards(container.santiao[j], retCardsArr[i])
                    if (flag == false)
                    {
                        temp.push(container.santiao[j])
                        temp.push(container.santiao[j])
                        len--
                    }
                }
                for (var j=0; j< container.sitiao.length; j++)
                {//拆四条;
                    if (len==0)
                    {
                        break
                    }
                    var flag = this.isContainInCards(container.sitiao[j], retCardsArr[i])
                    if (flag == false)
                    {
                        for(var k=0; k<2; k++)
                        {
                            if (len==0)
                                break
                            temp.push(container.sitiao[j])
                            temp.push(container.sitiao[j])
                            len --
                        }
                    }
                }
                if (len == 0)
                {
                    retCardsArr[i] = retCardsArr[i].concat(temp)
                }
                else
                {//匹配失败备案;
                    exceptArr.push(retCardsArr[i])
                }
            }
            for(var i=0; i<exceptArr.length; i++)
            {
                for(var j=0; j<retCardsArr.length; j++)
                {
                    if (exceptArr[i].toString() == retCardsArr[j].toString())
                    {
                        retCardsArr.splice(j, 1)
                        break
                    }
                }
            }
        }

        var special_arr = this.getSitiao_Wangzha(container)
        retCardsArr = retCardsArr.concat( special_arr )
        if (retCardsArr.length > 0)
            return retCardsArr
    }
    else if (preCardType == window.ECardType.ZHA_DAN)
    {//炸弹;
        var retCardsArr = this.getBiggerCardsArr(container, pre_cardsInfo.beg, 4, true)
        var ret = this.getWangzha(container)
        if (ret.flag == true)
            retCardsArr.push(ret.cards)
        if (retCardsArr.length > 0)
            return retCardsArr
    }

    return []
},

//剔除单牌组里同时存在的双王;
splitShuangWang : function(danpai)
{
    var cards = []
    var len = danpai.length
    danpai.sort(this.compByPointAscending)
    cards = danpai.concat()
    if (len>=2 && cards[len-1] >= window.EJoker.JokerA && cards[len-2] >= window.EJoker.JokerA)
    {
        cards.splice( len-2, 2 )
    }
    return cards
},

//判断手牌中是否有王炸或四条二
checkWangZhaOrSiTiaoEr : function (cards) {

    if (cards == null) {
        return null;
    }

    var er_count = 0, wang_count = 0, is_force_call = false;
    for (var i in cards)
    {
        var crad_number = cards[i];
        var Suit = Math.floor(crad_number / 13);
        var Point = Math.floor(crad_number % 13);

        if (Suit < 4 && Point == 1) {
            er_count++;
        }else if (Suit == 4) {
            wang_count++;
        }
    };

    if (er_count == 4 || wang_count == 2) {
        is_force_call = true;
    }

    return is_force_call;
},

});
