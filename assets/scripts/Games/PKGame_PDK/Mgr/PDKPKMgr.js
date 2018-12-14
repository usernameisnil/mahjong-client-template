const CardValue = {
    "A": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13
};
// 黑桃：spade
// 红桃：heart
// 梅花：club
// 方片：diamond
const CardShape = {
    "S": 1,
    "H": 2,
    "C": 3,
    "D": 4
};
const Kings = {
    "k": 14,
    "K": 15
};
const CardsValue = {
    'one': {
        name: 'One',
        value: 1
    },
    'double': {
        name: 'Double',
        value: 1
    },
    'three': {
        name: 'Three',
        value: 1
    },
    'boom': {
        name: 'Boom',
        value: 2
    },
    'threeWithOne': {
        name: 'ThreeWithOne',
        value: 1
    },
    'threeWithTwo': {
        name: 'ThreeWithTwo',
        value: 1
    },
    'plane': {
        name: 'Plane',
        value: 1
    },
    'planeWithOne': {
        name: 'PlaneWithOne',
        value: 1
    },
    'planeWithTwo': {
        name: 'PlaneWithTwo',
        value: 1
    },
    'scroll': {
        name: 'Scroll',
        value: 1
    },
    'doubleScroll': {
        name: 'DoubleScroll',
        value: 1
    },
    'fourwithdstwo': {
        name: 'FourWithDSTwo',
        value: 1
    },
    'fourwithsdtwo': {
        name: 'FourWithSDTwo',
        value: 1
    },
    'fourwithsddtwo': {
        name: 'FourWithSDDTwo',
        value: 1
    },
    'fourwithsdthree':{
        name:'FourWithSDThree',
        value: 1
    },
    'fourwithsddthree':{
        name:'FourWithSDDThree',
        value:1
    }


};

cc.Class({
    extends: cc.Component,

    Card(value, shape, king) {
        let card = {};
        if (value) {
            card.value = value;
        }
        if (shape) {
            card.shape = shape;
        }
        if (!!king) {
            card.king = king;
        }
        return card;
    },
    createCards() {
        let cardList = [];
        for (let i in CardValue) {
            for (let j in CardShape) {
                let card = this.Card(CardValue[i], CardShape[j], 0);
                card.id = cardList.length;
                cardList.push(card);
            }
        }
        for (let i in Kings) {
            let card = this.Card(undefined, undefined, Kings[i]);
            card.id = cardList.length;
            cardList.push(card);
        }
        cardList.sort((a, b) => {
            return (Math.random() > 0.5) ? -1 : 1;
        });
        // for (let i = 0; i < cardList.length; i++) {
        //     console.log('card id = ' + cardList[i].id);
        // }
        return cardList;
    },


    getThreeCards() {
        this._cardList = this.createCards();
        let threeCardsMap = {};
        for (let i = 0; i < 17; i++) {
            for (let j = 0; j < 3; j++) {
                if (threeCardsMap.hasOwnProperty(j)) {
                    threeCardsMap[j].push(this._cardList.pop());
                } else {
                    threeCardsMap[j] = [this._cardList.pop()];
                }
            }
        }
        //测试代码
        //         let cardList = [
        //             Card(CardValue['3'], CardShape.C),
        //             Card(CardValue['3'], CardShape.C),
        //             Card(CardValue['4'], CardShape.C),
        //             Card(CardValue['4'], CardShape.C),
        //             Card(CardValue['5'], CardShape.C),
        //             Card(CardValue['5'], CardShape.C),
        //             Card(CardValue['6'], CardShape.C),
        //             Card(CardValue['6'], CardShape.C),
        //             Card(CardValue['7'], CardShape.C),
        //             Card(CardValue['7'], CardShape.C),
        //             Card(CardValue['8'], CardShape.C),
        //             Card(CardValue['8'], CardShape.C),
        //             Card(CardValue['9'], CardShape.C),
        //             Card(CardValue['9'], CardShape.C),
        //             Card(CardValue['10'], CardShape.C),
        //             Card(undefined, undefined, Kings.k),
        //             Card(undefined, undefined, Kings.K),
        //
        //         ];
        //
        //         for (let i = 0; i < threeCardsMap[0].length; i++) {
        //             let id = threeCardsMap[0][i].id;
        //             cardList[i].id = id;
        //             threeCardsMap[0][i] = cardList[i]
        //         }
        //         for (let i = 0; i < threeCardsMap[1].length; i++) {
        //             let id = threeCardsMap[1][i].id;
        //             cardList[i].id = id;
        //             threeCardsMap[1][i] = cardList[i]
        //         }
        return [threeCardsMap[0], threeCardsMap[1], threeCardsMap[2], this._cardList];
    },

    isOneCard(cardList) {
        if (cardList.length === 1) {
            return true;
        }
        return false;
    },
    isDouble(cardList) {
        if (cardList.length === 2) {
            if (cardList[0] !== undefined && cardList[0] === cardList[1]) {
                return true;
            }
        }
        return false;
    },

    isThree(cardList) {
        if (cardList.length === 3) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                if (map.hasOwnProperty(cardList[i])) {
                    map[cardList[i]]++;
                } else {
                    map[cardList[i]] = 1;
                }
            }
            if (map[cardList[0]] === 3) {
                return true;
            }


        }

        return false;
    },
    isKingBoom(cardList) {
        if (cardList.length !== 2) {
            return false;
        }
        if ((cardList[0] === 53 || cardList[0] == 52) && (cardList[1] === 52 || cardList[1] === 53)) {
            return true;
        }
        return false;
    },
    isFourBoom(cardList) {
        if (cardList.length === 4) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                if (map.hasOwnProperty(cardList[i])) {
                    map[cardList[i]]++;
                } else {
                    map[cardList[i]] = 1;
                }
            }
            if (map[cardList[0]] === 4) {
                return true;
            }
        }
        return false;
    },

    isBoom(cardList) {
        if (this.isKingBoom(cardList)) {
            return true;
        }
        if (this.isFourBoom(cardList)) {
            return true;
        }
        return false;
    },
    isThreeWithOne(cardList) {
        console.log('card list =' + JSON.stringify(cardList));
        if (cardList.length === 4) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                console.log('key = ' + key);
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            let count = 0;
            let maxNum = -1;
            for (let i in map) {
                count++;
                if (maxNum < map[i]) {
                    maxNum = map[i];
                }
            }
            if (count === 2 && maxNum === 3) {
                return true;
            }

        }
        return false;
    },

    isThreeWithTwo(cardList) {
        if (cardList.length === 5) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            // map = {
            //     '4': 4,
            //     '1': 1
            // }
            let count = 0;
            let maxNum = -1;
            for (let i in map) {
                count++;
                if (maxNum < map[i]) {
                    maxNum = map[i];
                }
            }
            if (count === 2 && maxNum === 3) {
                return true;
            }
            if (count === 3 && maxNum === 3){
                return true;
            }

        }
        return false;
    },

    isFourWithDSTwo(cardList) {
        if (cardList.length === 6) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            // map = {
            //     '4': 4,
            //     '1': 1
            // }
            let count = 0;
            let maxNum = -1;
            for (let i in map) {
                count++;
                if (maxNum < map[i]) {
                    maxNum = map[i];
                }
            }
            if (count === 3 && maxNum === 4) {
                return true;
            }

        }
        return false;
    },
    isFourWithDSThree(cardList) {
        if (cardList.length === 7) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            // map = {
            //     '4': 4,
            //     '1': 1
            // }
            let count1 = 0;
            let count2 = 0;
            let maxNum = -1;
            for (let i in map) {
                if(map[i] == 4){
                    count1 ++;
                }else{
                    count2 += map[i] ;
                }
                // if(map[i] == 1){
                //     count2 += map[i] ;
                // }

            }
            if (count1 === 1 && count2 === 3 ) {
                return true;
            }

        }
        return false;
    },
    //四带三对
    isFourWithSDDThree(cardList) {
        if (cardList.length == 10) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            let count1 = 0;
            let count2 = 0;
            for (let i in map) {
                if(map[i] == 4){
                    count1 ++;
                }
                if(map[i] == 2|| map[i] == 4){
                    count2 += map[i]/2;
                }
            }
            if (count1 === 1 && count2 === 5) {
                return true;
            }

        }
        return false;
    },
    //四带三连
    isFourWithDDDSThree(cardList) {
        if (cardList.length >= 7) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            let count1 = 0;
            let count2 = 0;
            //判断是不是四带对连
            for (let i in map) {
                if(map[i] == 4){
                    count1 ++;
                }
                if(map[i] == 2|| map[i] == 4){
                    count2 += map[i]/2;
                }
            }
            if (count1 > 1 && (5*count1 == count2)) {
                return true;
            }
            //判断是不是四带三连
            count1 = 0;
            count2 = 0;
            for (let i in map) {
                if(map[i] == 4){
                    count1 ++;
                }
                if(map[i]){
                    count2 += map[i];
                }
            }
            if(count1 > 1 && (3*count1 == count2)){
                return true;
            }

        }
        return false;
    },
    isFourWithSDTwo(cardList) { //四带一对
        if (cardList.length === 6) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            // map = {
            //     '4': 4,
            //     '1': 1
            // }
            let count = 0;
            let maxNum = -1;
            for (let i in map) {
                count++;
                if (maxNum < map[i]) {
                    maxNum = map[i];
                }
            }
            if (count === 2 && maxNum === 4) {
                return true;
            }

        }
        return false;
    },
    isFourWithSDDTwo(cardList) {  //四带两对
        if (cardList.length === 8) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }
            // map = {
            //     '4': 4,
            //     '1': 1
            // }
            let count = 0;
            let maxNum = -1;
            for (let i in map) {
                count++;
                if (maxNum < map[i]) {
                    maxNum = map[i];
                }
            }
            if (count === 3 && maxNum === 4) {
                return true;
            }

        }
        return false;
    },
    isPlane(cardList) {
        console.log('card list length = ' + cardList.length);
        if (cardList.length % 3 === 0 && cardList.length >= 6) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                if (map.hasOwnProperty(cardList[i])) {
                    map[cardList[i]]++;
                } else {
                    map[cardList[i]] = 1;
                }
            }
            // let keys = Object.keys(map);
            // console.log('map =' + JSON.stringify(map));
            // if (keys.length) {
            //     for (let i in map) {
            //         if (map[i] !== 3) {
            //             return false;
            //         }
            //     }
            //     for (let i = 0; i < keys.length - 1; ++i) {
            //         if (Math.abs(Number(keys[i]) - Number(keys[i + 1])) === 1) {
            //             return true;
            //         }
            //     }

            // } else {
            //     return false;
            // }
            let threeCount = 0;
            let index = 0;
            for ( let i = 3; i < 15; i++) {
                if (map[i] == 3) {
                    threeCount++;
                }
                else {
                    index = i;
                    if (threeCount != 0) {
                        break;
                    }
                }
            }
            if(threeCount < 2){
                threeCount = 0;
                for ( let i = index; i < 15; i++) {
                    if (map[i] == 3) {
                        threeCount++;
                    }
                    else {
                        index = i;
                        if (threeCount != 0) {
                            break;
                        }
                    }
                }
            }
            if(threeCount*3 == cardList.length){
                return true;
            }
        }

        // {
        //     '3': 3,
        //     '5': 3
        // }

        return false;
    },

    isPlaneWithOne(cardList) {
        if (cardList.length >= 8 && cardList.length % 4 == 0) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }

            console.log('map = ' + JSON.stringify(map));
            // let keys = Object.keys(map);
            // if (keys.length < 4) {
            //     // let threeCount = 0;
            //     console.log('key 的长度不为4');
            //     return false;
            // }

            let oneCount = 0;
            let threeList = [];
            let threeCount = 0;
            // for (let i in map) {
            //     if (map[i] === 3) {
            //         threeList.push(i);
            //         // threeCount ++;
            //     }
            //     if (map[i] === 1) {
            //         oneCount++;
            //     }
            // }
            let index = 0;
            for ( let i = 3; i < 15; i++) {
                if (map[i] == 3) {
                    threeCount++;
                }
                else {
                    index = i;
                    if (threeCount != 0) {
                        break;
                    }
                }
            }
            if(threeCount < 2){
                threeCount = 0;
                for ( let i = index; i < 15; i++) {
                    if (map[i] == 3) {
                        threeCount++;
                    }
                    else {
                        index = i;
                        if (threeCount != 0) {
                            break;
                        }
                    }
                }
            }
            for(let k = 0; k < threeCount; k++){
                if ((threeCount - k) * 4 == cardList.length){
                    return true;
                }
            }
            // console.log('one count = ' + oneCount);
            // console.log('three list = ' + JSON.stringify(threeList));
            // if (threeList.length < 2 || oneCount < 2) {
            //     return false;
            // }
            // for (let i = 0; i < threeList.length; ++i) {
            //     if (Math.abs(Number(threeList[i]) - Number(threeList[i + 1])) === 1) {
            //         return true;
            //     }
            // }
        }
        console.log('length not 8');
        return false;
    },
    isPlaneWithTwo(cardList) {
        if (cardList.length >= 10 && cardList.length % 5 === 0) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                key = cardList[i];
                if (map.hasOwnProperty(key)) {
                    map[key]++;
                } else {
                    map[key] = 1;
                }
            }

            // {
            //     '3': 3,
            //     '4': 3,
            //     '5': 2,
            //     '6': 2
            // }
            // let keys = Object.keys(map);
            // if (keys.length < 4) {
            //     return false;
            // }
            let twoCount = 0;
            let threeCount = 0;
            let threeList = [];
            let index = 0;
            for ( let i = 3; i < 15; i++) {
                if (map[i] == 3) {
                    threeCount++;
                }
                else {
                    index = i;
                    if (threeCount != 0) {
                        break;
                    }
                }
            }
            if(threeCount < 2){
                threeCount = 0;
                for ( let i = index; i < 15; i++) {
                    if (map[i] == 3) {
                        threeCount++;
                    }
                    else {
                        index = i;
                        if (threeCount != 0) {
                            break;
                        }
                    }
                }
            }
            // for (let i = 0; i < threeList.length - 1; ++i) {
            //     if (Math.abs(Number(threeList[i]) - Number(threeList[i + 1])) === 1) {
            //         return true;
            //     }
            // }

            for(let k = 0; k < threeCount; k++){
                if ((threeCount - k) * 5 == cardList.length){
                    return true;
                }
            }
            // if (threeList.length < 2 || twoCount < 2 || threeList.length*2 != twoCount) {
            //     return false;
            // }

            // for (let i = 0; i < threeList.length - 1; ++i) {
            //     if (Math.abs(Number(threeList[i]) - Number(threeList[i + 1])) === 1) {
            //         return true;
            //     }
            // }
        }
        return false;
    },
    isScroll(cardList) {
        if (cardList.length >= 5) {
            cardList.sort((a, b) => {
                return a - b;
            });
            for (let i = 0; i < (cardList.length - 1); i++) {
                if (Math.abs(cardList[i] - cardList[i + 1]) !== 1) {
                    return false;
                }
            }
            return true;
        }
        console.log('439 length not 5');
        return false;
    },
    isDoubleScroll(cardList) {
        if (cardList.length >= 4) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                if (map.hasOwnProperty(cardList[i])) {
                    map[cardList[i]]++;
                } else {
                    map[cardList[i]] = 1;
                }
            }
            // {
            //     '3': 2,
            //     '4': 2,
            //     '5': 2
            // }
            for (let i in map) {
                if (map[i] !== 2) {
                    return false;
                }
            }
            let keys = Object.keys(map);

            keys.sort((a, b) => {
                return Number(a) - Number(b);
            });
            for (let i = 0; i < (keys.length - 1); i++) {
                if (Math.abs(Number(keys[i]) - Number(keys[i + 1])) !== 1) {
                    return false;
                }
            }
            return true;

        }
        return false;
    },


    //得到牌值
    getCardsValue(cardList) {
        // return true;
        var seat = cc.vv.gameNetMgr.getSeatByID(cc.vv.userMgr.userId);
        var holds = seat.holds;
        if (this.isOneCard(cardList)) {
            console.log('单张牌');
            return CardsValue.one;
        }
        if (this.isDouble(cardList)) {
            console.log('一对牌');
            return CardsValue.double;
        }
        if (this.isThree(cardList)) {
            console.log('三张牌');
            return CardsValue.three;
        }
        if (this.isBoom(cardList)) {
            console.log('是否是炸弹');
            return CardsValue.boom;
        }
        if ((cc.vv.gameNetMgr.conf.sdy || (cc.vv.gameNetMgr.conf.zhkysdy && holds.length == 4)) && this.isThreeWithOne(cardList)) {
            console.log('三带一');
            return CardsValue.threeWithOne;
        }
        if (cc.vv.gameNetMgr.conf.sde && this.isThreeWithTwo(cardList)) {
            console.log('三带二');
            return CardsValue.threeWithTwo;
        }
        if (this.isPlane(cardList)) {
            console.log('飞机');
            return CardsValue.plane;
        }
        if (cc.vv.gameNetMgr.conf.sdy&&this.isPlaneWithOne(cardList)) {
            console.log('飞机带翅膀');
            return CardsValue.planeWithOne;
        }
        if (cc.vv.gameNetMgr.conf.sde&&this.isPlaneWithTwo(cardList)) {
            console.log('飞机带双翅膀');
            return CardsValue.planeWithTwo;
        }
        if (this.isScroll(cardList)) {
            console.log('顺子');
            return CardsValue.scroll;
        }
        if (this.isDoubleScroll(cardList)) {
            console.log('连对');
            return CardsValue.doubleScroll;
        }
        //没有四带二
        // if (this.isFourWithDSTwo(cardList)) {
        //     console.log('四带不同两个');
        //     return CardsValue.fourwithdstwo;
        // }
        if(cc.vv.gameNetMgr.conf.sids  && this.isFourWithDSThree(cardList)){
            console.log('四带不同三个');
            return CardsValue.fourwithsdthree;
        }
        //四带三对
        // if(cc.vv.gameNetMgr.conf.sids && this.isFourWithSDDThree(cardList)){
        //     console.log('四带三对');
        //     return CardsValue.fourwithsddthree;
        // }
        // if (this.isFourWithSDTwo(cardList)) {
        //     console.log('四带一对');
        //     return CardsValue.fourwithsdtwo;
        // }
        // if (this.isFourWithSDDTwo(cardList)) {
        //     console.log('四带两对');
        //     return CardsValue.fourwithsddtwo;
        // }
        return false;
    },
    // that.isCanPushCards = getCardsValue;


    getOneCardValue(card) {
        let value = 0;
        value = card;
        return value;
    },
    //比较各种牌型的大小
    compareOne(a, b, self) {
        console.log('对比单张牌型的大小');
        let valueA = self.getOneCardValue(a[0]);
        let valueB = self.getOneCardValue(b[0]);
        console.log('value a= ' + valueA);
        console.log('value b = ' + valueB);

        if (valueA < valueB || valueA === undefined) {
            return true;
        }
        return false;
    },
    compareDouble(a, b, self) {

        return self.compareOne(a, b, self);
    },

    compareThree(a, b, self) {
        return self.compareOne(a, b, self);
    },
    compareFour(a, b, self) {
        return self.compareOne(a, b, self);
    },
    compareBoom(a, b, self) {
        if (a.length === 4 && b.length === 4) {
            return self.compareOne(a, b, self);
        } else {
            if (a.length > b.length) {
                return true;
            }
        }
        return false;
    },

    compareThreeWithOne(a, b, self) {
        let listA = [];
        let listB = [];
        let mapA = {};
        // 3,3,3,4,4
        for (let i = 0; i < a.length; i++) {
            if (mapA.hasOwnProperty(a[i])) {
                listA.push(a[i]);
            } else {
                mapA[a[i]] = 1;
            }
        }
        mapA = {};
        for (let i = 0; i < b.length; i++) {
            if (mapA.hasOwnProperty(b[i])) {
                listB.push(b[i]);
            } else {
                mapA[b[i]] = 1;
            }
        }
        return self.compareThree(listA, listB, self);

    },
    compareThreeWithTwo(a, b, self) {
        let mapA = {};
        let mapB = {};
        // 3,3,3,4,4
        for (let i = 0; i < a.length; i++) {
            if (mapA.hasOwnProperty(a[i])) {
                mapA[a[i]].push(a[i]);
            } else {
                mapA[a[i]] = [a[i]];
            }
        }
        for (let i = 0; i < b.length; i++) {
            if (mapB.hasOwnProperty(b[i])) {
                mapB[b[i]].push(b[i]);
            } else {
                mapB[b[i]] = [b[i]];
            }
        }


        let listA = [];
        for (let i in mapA) {
            if (mapA[i].length === 3) {
                listA = mapA[i];
            }
        }

        let listB = [];
        for (let i in mapB) {
            if (mapB[i].length === 3) {
                listB = mapB[i];
            }
        }

        return self.compareThree(listA, listB, self);
    },
    compareFourWithDSTwo(a, b, self) {
        let mapA = {};
        let mapB = {};
        // 3,3,3,4,4
        for (let i = 0; i < a.length; i++) {
            if (mapA.hasOwnProperty(a[i])) {
                mapA[a[i]].push(a[i]);
            } else {
                mapA[a[i]] = [a[i]];
            }
        }
        for (let i = 0; i < b.length; i++) {
            if (mapB.hasOwnProperty(b[i])) {
                mapB[b[i]].push(b[i]);
            } else {
                mapB[b[i]] = [b[i]];
            }
        }


        let listA = [];
        for (let i in mapA) {
            if (mapA[i].length === 4) {
                listA = mapA[i];
            }
        }

        let listB = [];
        for (let i in mapB) {
            if (mapB[i].length === 4) {
                listB = mapB[i];
            }
        }

        return self.compareFour(listA, listB, self);
    },
    //四带三比较
    compareFourWithDSThree(a, b, self) {
        let mapA = {};
        let mapB = {};
        // 3,3,3,4,4
        for (let i = 0; i < a.length; i++) {
            if (mapA.hasOwnProperty(a[i])) {
                mapA[a[i]].push(a[i]);
            } else {
                mapA[a[i]] = [a[i]];
            }
        }
        for (let i = 0; i < b.length; i++) {
            if (mapB.hasOwnProperty(b[i])) {
                mapB[b[i]].push(b[i]);
            } else {
                mapB[b[i]] = [b[i]];
            }
        }


        let listA = [];
        for (let i in mapA) {
            if (mapA[i].length === 4) {
                listA = mapA[i];
            }
        }

        let listB = [];
        for (let i in mapB) {
            if (mapB[i].length === 4) {
                listB = mapB[i];
            }
        }

        return self.compareFour(listA, listB, self);
    },
    comparePlane(a, b, self) {
        //33,44 5,6  44,55,7,8
        if(a.length===b.length) {
            let mapA = {};
            for (let i = 0; i < a.length; i++) {
                if (mapA.hasOwnProperty(a[i])) {
                    mapA[a[i]].push(a[i]);
                } else {
                    mapA[a[i]] = [a[i]];
                }
            }
            // {
            //     '3': [card, card],
            //     '4': [card, card]
            // }
            let listA = [];
            let maxNum = 1;
            for (let i in mapA) {
                if (Number(i) > maxNum) {
                    maxNum = Number(i);
                    listA = mapA[i];
                }
            }
            if(maxNum == 14){
                return false;
            }
            // {
            //     '3': 1,
            //     '4': 1,
            //     '5': 3,
            //     '6': 3
            // }

            let mapB = {};
            for (let i = 0; i < b.length; i++) {
                if (mapB.hasOwnProperty(b[i])) {
                    mapB[b[i]].push(b[i]);
                } else {
                    mapB[b[i]] = [b[i]];
                }
            }
            maxNum = 1;
            let listB = [];
            for (let i in mapB) {
                if (Number(i) > maxNum) {
                    maxNum = Number(i);
                    listB = mapB[i];
                }
            }
            if(maxNum == 14)
            {
                return true;
            }
            return self.compareThree(listA, listB, self);
        }else{
            return false;
        }
    },
    comparePlaneWithOne(a, b, self) {
        console.log("三带一三带一");
        if(a.length===b.length) {
            let mapA = {};
            //3,3,3,4,4,4,5,6
            let listA = [];
            for (let i = 0; i < a.length; i++) {
                if (mapA.hasOwnProperty(a[i])) {
                    // listA.push(a[i]);
                    mapA[a[i]]++;
                } else {
                    mapA[a[i]] = [a[i]];
                }
            }
            let mapB = {};
            let listB = [];
            for (let i = 0; i < b.length; i++) {
                if (mapB.hasOwnProperty(b[i])) {
                    // listB.push(b[i]);
                    mapA[b[i]]++;
                } else {
                    mapB[b[i]] = [b[i]];
                }
            }

            mapA = self.threequchong(mapA);
            for (let i in mapA) {
                if (mapA[i].length === 3) {
                    for (let j = 0; j < mapA[i].length; j++) {
                        listA.push(mapA[i][j]);
                    }
                }
            }


            mapB = self.threequchong(mapB);
            for (let i in mapB) {
                if (mapB[i].length === 3) {
                    for (let j = 0; j < mapB[i].length; j++) {
                        listB.push(mapB[i][j]);
                    }
                }
            }



            return self.comparePlane(listA, listB, self);
        }else{
            return false;
        }

    },
    threequchong:function(map){
        let tempp = [];
        let index = 0;
        let threeCount= 0
        let threenum = [];
        for ( let i = 3; i < 15; i++) {
            if (map[i] == 3) {
                threeCount++;
                tempp.push(i);
            }
            else {
                index = i;
                if (threeCount != 0) {
                    break;
                }
            }
        }
        if(threeCount < 2){
            tempp = [];
            threeCount = 0;
            for ( let i = index; i < 15; i++) {
                if (map[i] == 3) {
                    threeCount++;
                    tempp.push(i);
                }
                else {
                    index = i;
                    if (threeCount != 0) {
                        break;
                    }
                }
            }
        }
        for(let i = 0;i < tempp.length;i++){
            for(let j = 0;j < 3;j++){
                threenum.push(tempp[i]);
            }
        }
        return threenum;
    },
    comparePlaneWithTwo(a, b, self) {
        //3,3,3,4,4,4,5,5,6,6
        if(a.length===b.length) {
            let mapA = {};
            for (let i = 0; i < a.length; i++) {
                if (mapA.hasOwnProperty(a[i])) {
                    mapA[a[i]].push(a[i]);
                } else {
                    mapA[a[i]] = [a[i]];
                }
            }
            let mapB = {};
            for (let i = 0; i < b.length; i++) {
                if (mapB.hasOwnProperty(b[i])) {
                    mapB[b[i]].push(b[i]);
                } else {
                    mapB[b[i]] = [b[i]];
                }
            }

            // {
            //     '3': [card, card, card],
            //     '4': [card, card, card],
            //     '5': [card, card],
            //     '6': [card, card]
            // }

            console.log('map a' + JSON.stringify(mapA));
            console.log('map b' + JSON.stringify(mapB));

            let listA = [];
            mapA = self.threequchong(mapA);
            for (let i in mapA) {
                if (mapA[i].length === 3) {
                    for (let j = 0; j < mapA[i].length; j++) {
                        listA.push(mapA[i][j]);
                    }
                }
            }
            console.log('list a = ' + JSON.stringify(listA));

            let listB = [];
            mapB = self.threequchong(mapB);
            for (let i in mapB) {
                if (mapB[i].length === 3) {
                    for (let j = 0; j < mapB[i].length; j++) {
                        listB.push(mapB[i][j]);
                    }
                }
            }
            console.log('list b = ' + JSON.stringify(listB));

            return self.comparePlane(listA, listB, self);
        }else{
            return false;
        }

    },
    compareScroll(a, b, self) {
        console.log('a length = ' + a.length);
        console.log('b length =' + b.length);
        if (a.length === b.length) {

            let minNumA = 1000;
            for (let i = 0; i < a.length; i++) {
                if (a[i] < minNumA) {
                    minNumA = a[i]
                }
            }
            let minNumB = 1000;
            for (let i = 0; i < b.length; i++) {
                if (b[i] < minNumB) {
                    minNumB = b[i];
                }
            }

            console.log('min a = ' + minNumA);
            console.log('min b = ' + minNumB);
            if (minNumA >= minNumB) {
                return false;
            }


        } else {
            return '不合适的牌形';
        }
        return true;
    },
    compareDoubleScroll(a, b, self) {
        let mapA = {};
        let listA = [];
        for (let i = 0; i < a.length; i++) {
            if (mapA.hasOwnProperty(a[i])) {

            } else {
                mapA[a[i]] = true;
                listA.push(a[i]);
            }
        }

        let mapB = {};
        let listB = [];
        for (let i = 0; i < b.length; i++) {
            if (mapB.hasOwnProperty(b[i])) {

            } else {
                mapB[b[i]] = true;
                listB.push(b[i]);
            }
        }
        console.log('list a = ' + JSON.stringify(listA));
        console.log('list b = ' + JSON.stringify(listB));

        return self.compareScroll(listA, listB, self);
    },
    //比较牌的大小
    compare(a, b) {
        // return false;
        console.log("meng compare", a, b);
        let cardsValueA = this.getCardsValue(a);
        let cardsValueB = this.getCardsValue(b);
        if (cardsValueA.value < cardsValueB.value) {
            return true;
        } else if (cardsValueA.value === cardsValueB.value) {

            if (cardsValueA.name === cardsValueB.name) {
                if (cardsValueA.name === 'FourWithSDTwo' || cardsValueA.name === 'FourWithSDDTwo') {
                    cardsValueA.name = 'FourWithDSTwo';
                }
                if(cardsValueA.name === 'FourWithSDThree' || cardsValueA.name === 'FourWithSDDThree'){
                    cardsValueA.name = 'FourWithDSThree';
                }
                let str = 'compare' + cardsValueA.name;
                console.log('str = ' + str);
                let method = this[str];
                let result = method(a, b, this);
                console.log("result=", result);
                if (result === true) {
                    return true;
                } else {
                    return false;
                }
                // return method(a,b);
                // let result = method(a, b)
                // if (result === true) {
                //     return result;
                // }else {
                //     return ''
                // }
            }
            if (a[0] === 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },

    getCardListWithStart(start, cards) {
        //单牌提示方法，从某个值开始 获取剩下的牌的列表的组合
        var oneList = this.getRepeatCardsList(1, cards);//[[1]]
        var twoList = this.getRepeatCardsList(2, cards);
        var threeList = this.getRepeatCardsList(3, cards);
        console.log('onelist 1133', oneList);
        console.log('twoList 1133', twoList);
        console.log('threeList 1133', threeList);
        console.log('start = ' + start);
        // cards.sort((a, b) => {
        //     return a - b;
        // });
        // twoList.sort((a, b) => {
        //     return a[0] - b[0];
        // });
        // threeList.sort((a, b) => {
        //     return a[0] - b[0];
        // });
        console.log('cards')
        let list = [];
        for (let i = 0; i < oneList.length; i++) {
            let key = -1;
            key = oneList[i][0];
            if (key > start) {
                let temptable = [];
                temptable.push(oneList[i][0]);
                list.push(temptable);
            }
        }
        for (let i = 0; i < twoList.length; i++) {
            let key = -1;
            key = twoList[i][0];
            if (key > start) {
                let temptable = [];
                for(let index= 0; index < twoList[i].length; index++ ){
                    temptable.push(twoList[i][index]);
                }
                list.push(temptable);
            }
        }
        for (let i = 0; i < threeList.length; i++) {
            let key = -1;
            key = threeList[i][0];
            if (key > start) {
                let temptable = [];
                for(let index= 0; index < threeList[i].length; index++ ){
                    temptable.push(threeList[i][index]);
                }
                list.push(temptable);
            }
        }
        // let map = {};
        // let obj={};
        // console.log('1133',list);
        // for (let i = 0; i < list.length; i++) {
        //     let key = -1;
        //     key = list[i];
        //     if (map.hasOwnProperty(key)) {
        //         map[key]++;
        //     } else {
        //         map[key]=1;
        //         // map[key] = [list[i]];
        //     }
        // }
        // console.log('1133',map);
        // for(let key in map){
        //     if(map[key]===1){
        //         var num=parseInt(key);
        //         obj[key]=[num];
        //     }
        // }

        // var newlist = [];
        // for (let i = 0; i < list.length; ++i) {
        //     newlist[i] = [];
        //     newlist[i].push(list[i]);
        // }
        // return newlist;
        
        return list;

    },


    getOneCardListWithStart(start, cards) {
        //单牌提示方法，从某个值开始 获取剩下的牌的列表的组合
        var oneList = this.getRepeatCardsList(1, cards);//[[1]]
        var twoList = this.getRepeatCardsList(2, cards);
        var threeList = this.getRepeatCardsList(3, cards);
        console.log('onelist 1133', oneList);
        console.log('twoList 1133', twoList);
        console.log('threeList 1133', threeList);
        console.log('start = ' + start);
        // cards.sort((a, b) => {
        //     return a - b;
        // });
        // twoList.sort((a, b) => {
        //     return a[0] - b[0];
        // });
        // threeList.sort((a, b) => {
        //     return a[0] - b[0];
        // });
        console.log('cards')
        let list = [];
        for (let i = 0; i < oneList.length; i++) {
            let key = -1;
            key = oneList[i][0];
            if (key > start) {
                list.push(oneList[i][0]); 
            }
        }
        for (let i = 0; i < twoList.length; i++) {
            let key = -1;
            key = twoList[i][0];
            if (key > start) {
                list.push(twoList[i][0]);
            }
        }
        for (let i = 0; i < threeList.length; i++) {
            let key = -1;
            key = threeList[i][0];
            if (key > start) {
                list.push(threeList[i][0]);
            }
        }
        // let map = {};
        // let obj={};
        // console.log('1133',list);
        // for (let i = 0; i < list.length; i++) {
        //     let key = -1;
        //     key = list[i];
        //     if (map.hasOwnProperty(key)) {
        //         map[key]++;
        //     } else {
        //         map[key]=1;
        //         // map[key] = [list[i]];
        //     }
        // }
        // console.log('1133',map);
        // for(let key in map){
        //     if(map[key]===1){
        //         var num=parseInt(key);
        //         obj[key]=[num];
        //     }
        // }

        var newlist = [];
        for (let i = 0; i < list.length; ++i) {
            newlist[i] = [];
            newlist[i].push(list[i]);
        }
        return newlist;
        
        

    },
    //
    getKingBoom(cardList) {
        let list = [];
        for (let i = 0; i < cardList.length; i++) {
            let card = cardList[i];
            if (card === 53 || card === 52)
                list.push(card);
        }
        if (list.length === 2) {
            return list;
        } else {
            return false;
        }
    },

    getRepeatCardsList(num, cardsB) {
        //获取重复次数为num 的牌的列表的组合
        let map = {};
        for (let i = 0; i < cardsB.length; i++) {
            let key = -1;
            key = cardsB[i];
            if (map.hasOwnProperty(key)) {
                map[key].push(cardsB[i]);
            } else {
                map[key] = [cardsB[i]];
            }
        }
        var list = [];
        for (let i in map) {
            if (map[i].length === num) {
                // list.push(map[i].substring(0, 2));
                let l = [];
                for (let j = 0; j < num; j++) {
                    l.push(map[i][j]);
                }
                list.push(l);
            }
        }
        // [[2,2],[1,1]]
        console.log('list = ' + JSON.stringify(list));

        return list;

    },
    getFourBoom(cardList) {
        let list = this.getRepeatCardsList(4, cardList);
        console.log('get four boom  = ' + JSON.stringify(list));
        if (list.length === 0) {
            return false;
        }
        return list;
    },
    tipsOne(cardsA, cardsB, self) {
        let map = self.getOneCardListWithStart(cardsA[0], cardsB);//得到比cardsA大的列表
        let list = [];
        //单牌
        for (let i in map) {
            list.push(map[i]);
        }
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            list.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // list.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                list.push(fourBoomList[i]);
            }
        }
        console.log('tips one list = ' + JSON.stringify(list));
        return list;
    },
    tipsDouble(cardsA, cardsB, self) {
        let list = self.getRepeatCardsList(2, cardsB);
        let threeList = self.getRepeatCardsList(3, cardsB);
        let cardsList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] > cardsA[0]) {
                cardsList.push(list[i]);
            }
        }
        for (let i = 0; i < threeList.length; ++i) {
            if (threeList[i][0] > cardsA[0]) {
                threeList[i].splice(2, 1);
                cardsList.push(threeList[i]);
            }
        }
        console.log('cards list = ' + JSON.stringify(cardsList));
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardsList.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardsList.push(fourBoomList[i]);
            }
        }
        for (let i = 0; i < cardsList.length; ++i) {
            if (cardsList[i].length === 0) {
                cardsList.splice(i, 1);
            }
        }
        return cardsList;
    },
    tipsThree(cardsA, cardsB, self) {
        let list = self.getRepeatCardsList(3, cardsB);
        console.log('list = ' + JSON.stringify(list));
        let cardsList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] > cardsA[0]) {
                cardsList.push(list[i]);
            }
        }
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardsList.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardsList.push(fourBoomList[i]);
            }
        }
        for (let i = 0; i < cardsList.length; ++i) {
            if (cardsList[i].length === 0) {
                cardsList.splice(i, 1);
            }
        }
        console.log('tips three cards list = ' + JSON.stringify(cardsList));
        return cardsList;
    },

    tipsBoom(cardsA, cardsB, self) {
        let cardsList = [];
        if (cardsA.length === 2) {
            //王炸
            return cardsList;
        } else {
            let list = self.getRepeatCardsList(4, cardsB);
            for (let i = 0; i < list.length; i++) {
                if (list[i][0] > cardsA[0]) {
                    cardsList.push(list[i]);
                }
            }
        }

        let result = self.getKingBoom(cardsB);
        if (result !== false) {
            cardsList.push(result);
        }

        return cardsList;
    },
    //得到重复的牌的数值
    getRepeatValue(num, cardList) {
        let map = {};
        for (let i = 0; i < cardList.length; i++) {
            if (map.hasOwnProperty(cardList[i])) {
                map[cardList[i]].push(cardList[i]);
            } else {
                map[cardList[i]] = [cardList[i]];
            }
        }
        for (let i in map) {
            if (map[i].length === num) {
                return Number(i);
            }
        }
    },
    getNumcard: function (num,cardslist,cardlist) {
        var oneList=[],twoList=[],threeList=[],cardList=[];
        if(num===1){
            oneList = this.getRepeatCardsList(1, cardslist);
            twoList = this.getRepeatCardsList(2, cardslist);
            threeList = this.getRepeatCardsList(3, cardslist);
        }else{
            oneList = this.getRepeatCardsList(1, cardslist);
            twoList = this.getRepeatCardsList(2, cardslist);
            threeList = this.getRepeatCardsList(3, cardslist);
        }
        // if(num===1){
        //     oneList = this.getRepeatCardsList(1, cardslist);
        //     twoList = this.getRepeatCardsList(2, cardslist);
        //     threeList = this.getRepeatCardsList(3, cardslist);
        // }else if(num === 2){
        //     twoList = this.getRepeatCardsList(2, cardslist);
        //     threeList = this.getRepeatCardsList(3, cardslist);
        // }else if(num === 3){
        //     //与之前三带2不同 现在可以三带两张单牌
        //     oneList = this.getRepeatCardsList(1, cardslist);
        //     threeList = this.getRepeatCardsList(3, cardslist);
        // }
        var oneLists=[];
        if(num ===1){
            for(let i=0;i<cardlist.length;++i){
                for(let j=0;j<oneList.length;++j){
                    let card=cardlist[i].concat();
                    for(let k=0;k<num;++k){
                        card.push(oneList[j][k]);
                    }
                    cardList.push(card);
                }
            }
            for(let i=0;i<cardlist.length;++i){
                for(let j=0;j<twoList.length;++j){
                    let card=cardlist[i].concat();
                    for(let k=0;k<num;++k){
                        card.push(twoList[j][k]);
                    }
                    cardList.push(card);
                }
            }
            for(let i=0;i<cardlist.length;++i){
                for(let j=0;j<threeList.length;++j){
                    let card=cardlist[i].concat();
                    for(let k=0;k<num;++k){
                        card.push(threeList[j][k]);
                    }
                    cardList.push(card);
                }
            }
        }else{
            //单
            if(oneList.length>=2){
                for(let i=0;i<oneList.length;++i){
                    var one=oneList[i];
                    for(let j=i+1;j<oneList.length;++j){
                        var oneCopy=one.concat();
                        oneCopy.push(oneList[j][0]);
                        oneLists.push(oneCopy);
                    }
                }
            }
            for(let i=0;i<cardlist.length;++i){
                for(let j=0;j<oneLists.length;++j){
                    let card=cardlist[i].concat();
                    for(let k=0;k<num;++k){
                        card.push(oneLists[j][k]);
                    }
                    cardList.push(card);
                }
            }
            //对子
            for(let i=0;i<cardlist.length;++i){
                for(let j=0;j<twoList.length;++j){
                    let card=cardlist[i].concat();
                    for(let k=0;k<num;++k){
                        card.push(twoList[j][k]);
                    }
                    cardList.push(card);
                }
            }
            //对子和单
            for(let i=0;i<cardlist.length;++i){
                for(let j=0;j<twoList.length;++j){
                    for(let k=0;k<oneList.length;++k){
                        let card=cardlist[i].concat();
                        card.push(twoList[j][k]);
                        card.push(oneList[k]);
                        cardList.push(card);
                    }
                }
            }
            //三个的拆成两个
            for(let i=0;i<cardlist.length;++i){
                for(let j=0;j<threeList.length;++j){
                    let card=cardlist[i].concat();
                    if(cardlist[i][0] == threeList[j][0])
                    continue;
                    for(let k=0;k<num;++k){
                        card.push(threeList[j][k]);
                    }
                    cardList.push(card);
                }
            }
        }
        // for(let i=0;i<cardlist.length;++i){
        //     for(let j=0;j<oneList.length;++j){
        //         let card=cardlist[i].concat();
        //         for(let k=0;k<num;++k){
        //             card.push(oneList[j][k]);
        //         }
        //         cardList.push(card);
        //     }
        // }
        // for(let i=0;i<cardlist.length;++i){
        //     for(let j=0;j<twoList.length;++j){
        //         let card=cardlist[i].concat();
        //         for(let k=0;k<num;++k){
        //             card.push(twoList[j][k]);
        //         }
        //         cardList.push(card);
        //     }
        // }
        // for(let i=0;i<cardlist.length;++i){
        //     for(let j=0;j<threeList.length;++j){
        //         let card=cardlist[i].concat();
        //         for(let k=0;k<num;++k){
        //             card.push(threeList[j][k]);
        //         }
        //         cardList.push(card);
        //     }
        // }
        return cardList;
    },
    //三带几
    getThreeWithNumCardsList(num, cardsA, cardsB) {
        let valueA = this.getRepeatValue(3, cardsA);
        console.log('value a = ' + valueA);
        let list = this.getRepeatCardsList(3, cardsB);
        let fourlist = this.getRepeatCardsList(4, cardsB);
        let cardList = [];
        for (let i = 0; i < fourlist.length; ++i) {
            fourlist[i].splice(fourlist[i].length - 1, 1);
            list.push(fourlist[i]);
        }
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] > valueA) {
                cardList.push(list[i]);
            }
        }
        // if (num === 1) {
        //     let oneList = this.getRepeatCardsList(1, cardsB);
        //     let twoList = this.getRepeatCardsList(2, cardsB);
        //     let threeList = this.getRepeatCardsList(3, cardsB);
        // }
        // let oneList = this.getRepeatCardsList(num, cardsB);
        // let minNum = 100;
        // let oneCard = undefined;
        // for (let i = 0; i < oneList.length; i++) {
        //     if (oneList[i][0] < minNum) {
        //         minNum = oneList[i][0];
        //         oneCard = oneList[i];
        //     }
        // }
        // for (let i = 0; i < cardList.length; i++) {
        //     let l = cardList[i];
        //     if (oneCard !== undefined) {
        //         for (let j = 0; j < oneCard.length; j++) {
        //             l.push(oneCard[j]);
        //         }
        //     }
        // }
        var cardsList=[];
        cardsList=this.getNumcard(num,cardsB,cardList);
        let kingBoom = this.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardsList.push(kingBoom);
        }
        let fourBoomList = this.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardsList.push(fourBoomList[i]);
            }
        }

        return cardsList;
    },
    getFourWithNumCardsList(num, cardsA, cardsB, istwo) {
        let valueA = this.getRepeatValue(4, cardsA);
        console.log('value a = ' + valueA);
        let list = this.getRepeatCardsList(4, cardsB);
        let cardList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] > valueA) {
                cardList.push(list[i]);
            }
        }
        var oneList=[];
        var twoList=[];
        var threeList=[];
        var oneLists=[];
        var twoLists=[];
        var threeLists=[];
        var cardsList=[];
        var twolinkone = [];
        if(num===1) {

             oneList = this.getRepeatCardsList(1,cardsB);
             twoList = this.getRepeatCardsList(2,cardsB);
             threeList = this.getRepeatCardsList(3, cardsB);
        }else{
            //现在是可以四带三个单 
            // twoList = this.getRepeatCardsList(2,cardsB);
            // threeList = this.getRepeatCardsList(3, cardsB);
            oneList = this.getRepeatCardsList(1,cardsB);
            twoList = this.getRepeatCardsList(2,cardsB);
            threeList = this.getRepeatCardsList(3, cardsB);
        }
        // 四带三提示
        //拼成三个的
        if(oneList.length>=3 ){
            for(let i=0;i<oneList.length;++i){
                var one=oneList[i];
                for(let j=i+1;j<oneList.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(oneList[j][0]);
                    for(let k=j+1;k<oneList.length;++k){
                        var oneCopy1 = oneCopy.concat();
                        oneCopy1.push(oneList[k][0]);
                    }
                    oneLists.push(oneCopy1);
                }
            }
        }
        for(let i=0;i<cardList.length;++i){
            for(let j=0;j<oneLists.length;++j){
                let card=cardList[i].concat();
                for(let k=0;k<num;++k){
                    card.push(oneLists[j][k]);
                }
                cardsList.push(card);
            }
        }
        
        //拼接拆对
        for(let i=0;i<twoList.length;++i){
            var one=twoList[i];
            for(let j=0;j<oneList.length;++j){
                var oneCopy=one.concat();
                oneCopy.push(oneList[j][0]);
                twolinkone.push(oneCopy);
            }
        }
        for(let i=0;i<cardList.length;++i){
            for(let j=0;j<twolinkone.length;++j){
                let card=cardList[i].concat();
                for(let k=0;k<num;++k){
                    card.push(twolinkone[j][k]);
                }
                cardsList.push(card);
            }
        }
        //拼接拆三个的
            for(let i=0;i<threeList.length;++i){
                var one=threeList[i];
                var oneCopy=one.concat();
                threeLists.push(oneCopy)
            }
            for(let i=0;i<cardList.length;++i){
                for(let j=0;j<threeLists.length;++j){
                    let card=cardList[i].concat();
                    for(let k=0;k<num;++k){
                        card.push(threeLists[j][k]);
                    }
                    cardsList.push(card);
                }
            }
        // //拼成三个对   
        // if(twoList.length>=3 && cardsA.length == 10){
        //     for(let i=0;i<twoList.length;++i){
        //         var one=twoList[i];
        //         for(let j=i+1;j<twoList.length;++j){
        //             var oneCopy=one.concat();
        //             oneCopy.push(twoList[j][0]);
        //             oneCopy.push(twoList[j][1]);
        //            for(let k=j+1;k<twoList.length;++k){
        //                var oneCopy1 = oneCopy.concat();
        //                oneCopy1.push(twoList[k][0]);
        //                oneCopy1.push(twoList[k][1]);
        //            }
        //            twoLists.push(oneCopy1);
        //         }
        //     }
        // }
        // for(let i=0;i<cardList.length;++i){
        //     for(let j=0;j<twoLists.length;++j){
        //         let card=cardList[i].concat();
        //         for(let k=0;k<num;++k){
        //             card.push(twoLists[j][k]);
        //         }
        //         cardsList.push(card);
        //     }
        // }
        /*
        if(num===1){
            if(oneList.length>=2){
                for(let i=0;i<oneList.length;++i){
                    var one=oneList[i];
                    for(let j=i+1;j<oneList.length;++j){
                        var oneCopy=one.concat();
                        oneCopy.push(oneList[j][0]);
                        oneLists.push(oneCopy);
                    }
                }
            }
            for(let i=0;i<oneList.length;++i){
                var one=oneList[i];
                for(let j=0;j<twoList.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(twoList[j][0]);
                    oneLists.push(oneCopy);
                }
            }
            for(let i=0;i<oneList.length;++i){
                var ones=oneList[i];
                for(let j=0;j<threeList.length;++j){
                    if(threeList[j].length===3)
                    threeList[j].splice(0,2);
                    var oneCopy=ones.concat();
                    oneCopy.push(threeList[j][0]);
                    oneLists.push(oneCopy);
                }
            }
            if(twoList.length>=2){
                for(let i=0;i<twoList.length;++i){
                    twoList[i].splice(0,1);
                    var one=twoList[i];
                    for(let j=i+1;j<twoList.length;++j){
                        var oneCopy=one.concat();
                        oneCopy.push(twoList[j][0]);
                        twoLists.push(oneCopy);
                    }
                }
            }
            for(let i=0;i<twoList.length;++i){
                twoList[i].splice(0,1);
                var one=twoList[i];
                for(let j=0;j<threeList.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(threeList[j][0]);
                    twoLists.push(oneCopy);
                }
            }
            if(threeList.length>=2){
                for(let i=0;i<threeList.length;++i){
                    threeList[i].splice(0,2);
                    var one=threeList[i];
                    for(let j=i+1;j<threeList.length;++j){
                        var oneCopy=one.concat();
                        oneCopy.push(threeList[j][0]);
                        threeLists.push(oneCopy);
                    }
                }
            }

        }else if(num===2&&istwo){
            if(twoList.length>=2){
                for(let i=0;i<twoList.length;++i){
                    var one=twoList[i];
                    for(let j=i+1;j<twoList.length;++j){
                        var oneCopy=one.concat();
                       for(let k=0;k<twoList[j].length;++k){
                           oneCopy.push(twoList[j][k]);
                       }
                       twoLists.push(oneCopy);
                    }
                }
            }
            for(let i=0;i<twoList.length;++i){
                var one=twoList[i];
                for(let j=0;j<threeList.length;++j){
                    var oneCopy=one.concat();
                    if(threeList[j].length===3)
                    threeList[j].splice(0,1);
                    for(let k=0;k<threeList[j].length;++k){
                        oneCopy.push(threeList[j][k]);
                    }
                    twoLists.push(oneCopy);
                }
            }
            if(threeList.length>=2){
                for(let i=0;i<threeList.length;++i){
                    if(threeList[i].length===3)
                    threeList[i].splice(0,1);
                    var one=threeList[i];
                    for(let j=i+1;j<threeList.length;++j){
                        if(threeList[j].length===3)
                            threeList[j].splice(0,1);
                        var oneCopy=one.concat();
                        for(let k=0;k<threeList[j].length;++k){
                            oneCopy.push(threeList[j][k]);
                        }
                        threeLists.push(oneCopy);
                    }
                }
            }
        }else{
            for(let i=0;i<twoList.length;++i){
                twoLists.push(twoList[i]);
            }
            for(let i=0;i<threeList.length;++i){
                threeList[i].splice(0,1);
                threeLists.push(threeList[i]);
            }
        }
        for(let i=0;i<cardList.length;++i){
            for(let j=0;j<oneLists.length;++j){
                var one=cardList[i].concat();
                for(let k=0;k<oneLists[j].length;++k){

                    one.push(oneLists[j][k]);
                }
                cardsList.push(one);
            }

        }
        for(let i=0;i<cardList.length;++i){
            for(let j=0;j<twoLists.length;++j){
                var one=cardList[i].concat();
                for(let k=0;k<twoLists[j].length;++k){

                    one.push(twoLists[j][k]);
                }
                cardsList.push(one);
            }

        }
        for(let i=0;i<cardList.length;++i){
            for(let j=0;j<threeLists.length;++j){
                var one=cardList[i].concat();
                for(let k=0;k<threeLists[j].length;++k){

                    one.push(threeLists[j][k]);
                }
                cardsList.push(one);
            }

        }
        */
        // let minNum = 100;
        // let oneCard = undefined;
        // let twoCard = undefined;
        // for (let i = 0; i < oneList.length; i++) {
        //     if (oneList[i][0] < minNum) {
        //         if (minNum !== 100) {
        //             twoCard = minNum;
        //         }
        //         minNum = oneList[i][0];
        //         oneCard = oneList[i];
        //     }
        // }
        // for (let i = 0; i < oneList.length; ++i) {
        //     if (twoCard === oneList[i][0]) {
        //         twoCard = oneList[i];
        //         break;
        //     }
        // }
        // for (let i = 0; i < cardList.length; i++) {
        //     let l = cardList[i];
        //     if (oneCard !== undefined) {
        //         for (let j = 0; j < oneCard.length; j++) {
        //             l.push(oneCard[j]);
        //         }
        //         if (istwo) {
        //             for (let k = 0; k < twoCard.length; ++k) {
        //                 l.push(twoCard[k]);
        //             }
        //         }
        //     }
        // }

        let kingBoom = this.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardsList.push(kingBoom);
        }
        let fourBoomList = this.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardsList.push(fourBoomList[i]);
            }
        }
console.log('1545 cardsLists',cardsList);
        return cardsList;
    },

    tipsThreeWithOne(cardsA, cardsB, self) {
        //3,3,3,4
        return self.getThreeWithNumCardsList(1, cardsA, cardsB);

    },
    tipsThreeWithTwo(cardsA, cardsB, self) {
        console.log('三带二的提示');
        return self.getThreeWithNumCardsList(2, cardsA, cardsB);
    },
    // tipsFourWithDSTwo(cardsA, cardsB, self) {
    //     return self.getFourWithNumCardsList(1, cardsA, cardsB, true);
    // },
    // tipsFourWithSDTwo(cardsA, cardsB, self) {
    //     return self.getFourWithNumCardsList(2, cardsA, cardsB, false);
    // },
    // tipsFourWithSDDTwo(cardsA, cardsB, self) {
    //     return self.getFourWithNumCardsList(2, cardsA, cardsB, true);
    // },
    //现在是提示四带三
    tipsFourWithSDThree(cardsA, cardsB, self) {
        return self.getFourWithNumCardsList(3, cardsA, cardsB, true);
    },
    getPlaneMinValue(cardsA) {
        let map = {}; //，3，3，3，4，4，4
        for (let i = 0; i < cardsA.length; i++) {
            if (map.hasOwnProperty(cardsA[i])) {
                map[cardsA[i]].push(cardsA[i]);
            } else {
                map[cardsA[i]] = [cardsA[i]];
            }
        }
        // {
        //     '3': [card, card, card],
        //     '4': [card, card ,card]
        // }
        let minNum = 100;
        for (let i in map) {
            if (Number(i) < minNum) {
                minNum = Number(i);
            }
        }
        return minNum;
    },

    getPlaneWithStart(num, cardsB,lenA) {
        let list = this.getRepeatCardsList(3, cardsB);
        let list1= this.getRepeatCardsList(4, cardsB);
        let map = {};
        for (let i = 0; i < list.length; i++) {
            if (map.hasOwnProperty(list[i][0])) {
                // map[list[i][0].value].push(list[i]);
            } else {
                map[list[i][0]] = list[i];
            }
        }
        for(let i=0;i<list1.length;++i){
            if (map.hasOwnProperty(list1[i][0])) {
                // map[list[i][0].value].push(list[i]);
            } else {
                map[list1[i][0]] = list1[i];
            }
        }
        let keys = Object.keys(map);
        keys.sort((a, b) => {
            return Number(a) - Number(b);
        });
        let tempCardsList = [];
        if(lenA == 2){
            for (let i = 0; i < (keys.length - 1); i++) {
                if (Math.abs(Number(keys[i]) - Number(keys[i + 1])) === 1) {
                    let l = [];
                    for (let j = 0; j < map[keys[i]].length; j++) {
                        l.push(map[keys[i]][j]);
                        l.push(map[keys[i + 1]][j]);
                    }
                    tempCardsList.push(l);
                }
            }
        }
        if(lenA == 3){
            for (let i = 0; i < (keys.length - lenA + 1); i++ ) {
                if ((Math.abs(Number(keys[i]) - Number(keys[i + 1]))) === 1 && (Math.abs(Number(keys[i+1]) - Number(keys[i + 2]))) === 1){
                    let l = [];
                        for (let j = 0; j < map[keys[i]].length; j++) {
                            l.push(map[keys[i]][j]);
                            l.push(map[keys[i + 1]][j]);
                            l.push(map[keys[i + 2]][j]);
                        }
                    tempCardsList.push(l);
                }
            }
        }
        if(lenA == 4){
            for (let i = 0; i < (keys.length - lenA + 1); i++) {
                if ((Math.abs(Number(keys[i]) - Number(keys[i + 1]))) === 1 && (Math.abs(Number(keys[i+1]) - Number(keys[i + 2])) === 1) && (Math.abs(Number(keys[i+2]) - Number(keys[i + 3])) === 1)) {
                    let l = [];
                        for (let j = 0; j < map[keys[i]].length; j++) {
                            l.push(map[keys[i]][j]);
                            l.push(map[keys[i + 1]][j]);
                            l.push(map[keys[i + 2]][j]);
                            l.push(map[keys[i + 3]][j]);
                        }
                    tempCardsList.push(l);
                }
            }
        }
        if(lenA == 5){
            for (let i = 0; i < (keys.length - lenA + 1); i++) {
                if ((Math.abs(Number(keys[i]) - Number(keys[i + 1]))) === 1 && (Math.abs(Number(keys[i+1]) - Number(keys[i + 2])) === 1) && (Math.abs(Number(keys[i+2]) - Number(keys[i + 3]))) === 1 && (Math.abs(Number(keys[i+3]) - Number(keys[i + 4])) === 1)) {
                    let l = [];
                        for (let j = 0; j < map[keys[i]].length; j++) {
                            l.push(map[keys[i]][j]);
                            l.push(map[keys[i + 1]][j]);
                            l.push(map[keys[i + 2]][j]);
                            l.push(map[keys[i + 3]][j]);
                            l.push(map[keys[i + 4]][j]);
                        }
                    tempCardsList.push(l);
                }
            }
        }
        let cardsList = [];
        for (let i = 0; i < tempCardsList.length; i++) {
            let valueB = this.getPlaneMinValue(tempCardsList[i]);
            if (valueB > num) {
                cardsList.push(tempCardsList[i]);
            }
        }
        return cardsList;
    },
    tipsPlane(cardsA, cardsB, self) {
        console.log('提示飞机');
        let valueA = self.getPlaneMinValue(cardsA);
        let cardsList = self.getPlaneWithStart(valueA, cardsB,cardsA.length/3);
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardsList.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardsList.push(fourBoomList[i]);
            }
        }


        return cardsList;
    },

    tipsPlaneWithOne(cardsA, cardsB, self) {
        //求得三个的个数 
        var threenumA = self.getRepeatCardsList(3,cardsA);
        let threenum = [];
        let map = {};
        for (let i = 0; i < cardsA.length; i++) {
            let key = -1;
            key = cardsA[i];
            if (map.hasOwnProperty(key)) {
                map[key]++;
            } else {
                map[key] = 1;
            }
        }
        let tempp = [];
        let index = 0;
        let threeCount= 0
        for ( let i = 3; i < 15; i++) {
            if (map[i] == 3) {
                threeCount++;
                tempp.push(i);
            }
            else {
                index = i;
                if (threeCount != 0) {
                    break;
                }
            }
        }
        if(threeCount < 2){
            tempp = [];
            threeCount = 0;
            for ( let i = index; i < 15; i++) {
                if (map[i] == 3) {
                    threeCount++;
                    tempp.push(i);
                }
                else {
                    index = i;
                    if (threeCount != 0) {
                        break;
                    }
                }
            }
        }
        for(let i = 0;i < tempp.length;i++){
            for(let j = 0;j < 3;j++){
                threenum.push(tempp[i]);
            }
        }
        let valueA = self.getPlaneMinValue(threenum);
        //放三个的进行比较
        console.log('value a = ' + valueA);
        let cardsList = self.getPlaneWithStart(valueA, cardsB,threenum.length/3);
        console.log('cards list = ' + JSON.stringify(cardsList));
        let oneCard = self.getRepeatCardsList(1, cardsB);
        let twoCard = self.getRepeatCardsList(2, cardsB);
        let threeCard = self.getRepeatCardsList(3, cardsB);
        console.log('one card = ' + JSON.stringify(oneCard));
        // oneCard.sort((a, b) => {
        //     return a[0] - b[0];
        // });
        // twoCard.sort((a, b) => {
        //     if(a[0]===3){
        //         a[0]=20;
        //     }
        //     if(b[0]===3){
        //         b[0]=20;
        //     }
        //     return a[0] - b[0];
        // });
        let cardList=[];
        let cards=null;
        let card=null;
        var oneList=[];
        var twoList=[];
        var threeList=[];
        var endthreelist=[];
        var issame=false;
        var oneLists = [];
        var twoLists = [];
        if(cardsA.length/4 == 2){
            //三带一单 取两张单牌
            var length = oneCard.length;
            if(length >= 2){
                for(let i=0;i<length;++i){
                    let one=oneCard[i];
                    for(let j=i+1;j<length;++j){
                        let oneCopy=one.concat();
                        oneCopy.push(oneCard[j][0]);
                        oneLists.push(oneCopy);
                    }
                }
            }
            for(let i=0;i<cardsList.length;++i){
                for(let j=0;j<oneLists.length;++j){
                    let card=cardsList[i].concat();
                    for(let k=0;k<oneLists[j].length;++k){
                        card.push(oneLists[j][k]);
                    }
                    cardList.push(card);
                }
            }
            // 三带一对 
            if(twoCard.length){
                for(let i=0;i<cardsList.length;++i){
                    for(let j=0;j<twoCard.length;++j){
                        let card=cardsList[i].concat();
                        for(let k=0;k<twoCard[j].length;++k){
                            card.push(twoCard[j][k]);
                        }
                        cardList.push(card);
                    }
                }
            }
            //一个对子拆一 一个单
            if(twoCard.length && oneCard.length){
                oneList = [];
                for(let i=0;i<oneCard.length;++i){
                    let one=oneCard[i];
                    for(let j=0;j<twoCard.length;++j){
                        let oneCopy=one.concat();
                        oneCopy.push(twoCard[j][0]);
                        oneList.push(oneCopy);
                    }
                }
                for(let i=0;i<cardsList.length;++i){
                    for(let j=0;j<oneList.length;++j){
                        let card=cardsList[i].concat();
                        for(let k=0;k<oneList[j].length;++k){
                            card.push(oneList[j][k]);
                        }
                        cardList.push(card);
                    }
                }
            }
            //取出不一样的三个的
            threeList = [];
            var threeDelOne = []; //三个的拆成两个
            var threeDelTwo = []; //三个的拆成一个
            if(threeCard.length>=1){
                for(let i=0;i<threeCard.length;++i){
                    for(let j=0;j<cardsList.length;++j){
                        issame=true;
                        var three = cardsList[j];
                        for(let k=0;k<cardsList[j].length;++k){
                            if(threeCard[i][0]!=cardsList[j][k]){
                        
                            }else{
                                issame=false;
                            }
                        }
                        if(!issame){
                            continue;
                        }
                        if(issame){
                            threeList.push(threeCard[i]);
                            var threeCopy1 = three.concat();
                            var threeCopy2 = three.concat();
                            //三个拆成一个
                            threeCopy1.push(threeCard[i][0]);
                            threeDelTwo.push(threeCopy1);
                            //三个拆成两个
                            threeCopy2.push(threeCard[i][0]);
                            threeCopy2.push(threeCard[i][0]);
                            threeDelOne.push(threeCopy2);
                        }
                    }
                }
            }
            if(threeList.length){
                //拼接一个单 
                if(oneCard.length >= 2){
                    for(let i=0;i<threeDelOne.length;++i){
                        let one = threeDelOne[i];
                        for(let j=0;j<oneCard.length;++j){
                            let oneCopy=one.concat();
                            oneCopy.push(oneCard[j][0]);
                            cardList.push(oneCopy);
                        }
                    }
                }
                //拼接一个对中的一个
                if(twoCard.length){
                    for(let i=0;i<threeDelOne.length;++i){
                        let one = threeDelOne[i];
                        for(let j=0;j<twoCard.length;++j){
                            let card=one.concat();
                            card.push(twoCard[j][0]);
                            cardList.push(card);
                        }
                    }
                }
                //拆成一个的 拼接一个对子
                if(twoCard.length && oneCard.length){
                    for(let i=0;i<threeDelTwo.length;++i){
                        let one = threeDelTwo[i];
                        for(let j=0;j<twoCard.length;++j){
                            let card=one.concat();
                            for(let k=0;k<twoCard[j].length;k++){
                                card.push(twoCard[j][k]);
                            }
                            cardList.push(card);
                        }
                    }
                }
                //拆成一个  拼接两个单
                if(oneCard.length >= 3){
                    for(let i=0;i<threeDelTwo.length;++i){
                        let one = threeDelTwo[i];
                            for(let j=0;j<oneCard.length;++j){
                                let oneCopy=one.concat();
                                oneCopy.push(oneCard[j][0]);
                                for(let k=j+1;k<oneCard.length;++k){
                                    let oneCopy1 = oneCopy.concat();
                                    oneCopy1.push(oneCard[k][0]);
                                    cardList.push(oneCopy1);            
                                }
                            }
                    }
                }
            }
        }else if(cardsA.length/4 == 3){
            //三带一单 取三单牌
            var length = oneCard.length;
            if(length >= 3){
                for(let i=0;i<length;++i){
                    let one=oneCard[i];
                    for(let j=i+1;j<length;++j){
                        let oneCopy=one.concat();
                        oneCopy.push(oneCard[j][0]);
                        for(let k=j+1;k<length;++k){
                            let oneCopy1 = oneCopy.concat();
                            oneCopy1.push(oneCard[k][0]);
                            oneLists.push(oneCopy1);
                        }
                    }
                }
                for(let i=0;i<cardsList.length;++i){
                    for(let j=0;j<oneLists.length;++j){
                        let card=cardsList[i].concat();
                        for(let k=0;k<oneLists[j].length;++k){
                            card.push(oneLists[j][k]);
                        }
                        cardList.push(card);
                    }
                }
            }
            // 三带一对一张单牌
            if(twoCard.length && oneCard.length){
                for(let i=0;i<twoCard.length;++i){
                    let one=twoCard[i];
                    let oneCopy=one.concat();
                    for(let j = 0;j<oneCard.length;++j){
                        oneCopy.push(oneCard[j][0]);
                        twoLists.push(oneCopy);
                    }
                }
                for(let i=0;i<cardsList.length;++i){
                    for(let j=0;j<twoLists.length;++j){
                        let card=cardsList[i].concat();
                        for(let k=0;k<twoLists[j].length;++k){
                            card.push(twoLists[j][k]);
                        }
                        cardList.push(card);
                    }
                }
            }
            //一个对子再拆一个对子
            if(twoCard.length >= 2){
                var temp = [];
                for(let i=0;i<twoCard.length;++i){
                    let one=twoCard[i];
                    for(let j = i+1;j<twoCard.length;++j){
                        let twoCopy=one.concat();
                        twoCopy.push(twoCard[j][0]);
                        temp.push(twoCopy);
                    }
                }
                for(let i=0;i<cardsList.length;++i){
                    for(let j=0;j<temp.length;++j){
                        let card=cardsList[i].concat();
                        for(let k=0;k<temp[j].length;++k){
                            card.push(temp[j][k]);
                        }
                        cardList.push(card);
                    }
                }
            }
            //取出不一样的三个的
            threeList = [];
            var threeDelOne = []; //三个的拆成两个
            var threeDelTwo = []; //三个的拆成一个
            if(threeCard.length>=1){
                for(let i=0;i<threeCard.length;++i){
                    for(let j=0;j<cardsList.length;++j){
                        issame=true;
                        var three = cardsList[j];
                        for(let k=0;k<cardsList[j].length;++k){
                            if(threeCard[i][0]!=cardsList[j][k]){
                        
                            }else{
                                issame=false;
                            }
                        }
                        if(!issame){
                            continue;
                        }
                        if(issame){
                            threeList.push(threeCard[i]);
                            var threeCopy1 = three.concat();
                            var threeCopy2 = three.concat();
                            //三个拆成一个
                            threeCopy1.push(threeCard[i][0]);
                            threeDelTwo.push(threeCopy1);
                            //三个拆成两个
                            threeCopy2.push(threeCard[i][0]);
                            threeCopy2.push(threeCard[i][0]);
                            threeDelOne.push(threeCopy2);
                        }
                    }
                }
            }

            //去两个三个的拆分
            let threepai = [];
            for(let i = 0;i < threeCard.length;i++){
                threepai.push(threeCard[i][0]);
            }
            if(threeCard.length>=1){
                for(let i=0;i<cardsList.length;++i){
                    let three2 = cardsList[i];
                    for(let j=0;j<threepai.length;++j){
                        issame=true;
                        let threeCopy3 = three2.concat();
                        for(let m = 0;m < three2.length;m++){
                            if(threepai[j]!=three2[m]){
                            
                            }else{
                                issame=false;
                            }
                            if(Math.abs(threepai[j] - three2[m]) == 1){
                                issame=false;
                            }
                            if(!issame){
                                continue;
                            }
                        }
                        if(issame){
                            threeCopy3.push(threepai[j]);
                            threeCopy3.push(threepai[j]);
                            threeCopy3.push(threepai[j]);
                            cardList.push(threeCopy3);
                        }
                    }
                    // threelink3.push(threeCopy3);
                }
            }

            if(threeList.length){
                //拆三个的
                //拆成一个 拼接一个对
                if(twoCard.length){
                    for(let i=0;i<threeDelTwo.length;++i){
                        let one=threeDelTwo[i];
                        for(let j = 0;j<twoCard.length;++j){
                            let oneCopy=one.concat();
                            for(let k = 0; k <twoCard[j].length;k++){
                                oneCopy.push(twoCard[j][k]);
                            }
                            cardList.push(oneCopy);
                        }
                    }
                }
                //拆成一个 拼接两个单
                if(oneCard.length >=2){
                    for(let i=0;i<threeDelTwo.length;++i){
                        let one=threeDelTwo[i];
                        for(let j = 0;j<oneCard.length;++j){
                            let oneCopy=one.concat();
                            oneCopy.push(oneCard[j][0]);
                            for(let k = j+1;k <oneCard.length;k++){
                                let oneCopy1 = oneCopy.concat();
                                oneCopy1.push(oneCard[k][0]);
                                cardList.push(oneCopy1);
                            }
                        }
                    }
                }
                //拆成两个 
                //拼接一个单
                if(oneCard.length){
                    for(let i=0;i<threeDelOne.length;++i){
                        let one=threeDelOne[i];
                        for(let j = 0;j<oneCard.length;++j){
                            let oneCopy=one.concat();
                            oneCopy.push(oneCard[j][0]);
                            cardList.push(oneCopy);
                        }
                    }
                }
                //拆成两个 拼接一个对子中的一个
                if(twoCard.length){
                    for(let i=0;i<threeDelOne.length;++i){
                        let one=threeDelOne[i];
                        for(let j = 0;j<twoCard.length;++j){
                            let oneCopy=one.concat();
                            for(let k = 0;k < twoCard[j].length; k++){
                                oneCopy.push(twoCard[j][k]);
                            }
                            cardList.push(oneCopy);
                        }
                    }
                }
            }

        }
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardList.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardList.push(fourBoomList[i]);
            }
        }


        for(let i=0;i<cardsList.length;++i){
            if(cardsList[i].length===0){
                cardList.splice(i,1);
            }
        }
        return cardList;
    },

    tipsPlaneWithTwo(cardsA,cardsB, self) {
        //求得三个的个数 
        let threenumA = self.getRepeatCardsList(3,cardsA);
        //将其合成一个数组传过去
        let threenum = [];
        let map = {};
        for (let i = 0; i < cardsA.length; i++) {
            let key = -1;
            key = cardsA[i];
            if (map.hasOwnProperty(key)) {
                map[key]++;
            } else {
                map[key] = 1;
            }
        }
        let tempp = [];
        let index = 0;
        let threeCount= 0
        for ( let i = 3; i < 15; i++) {
            if (map[i] == 3) {
                threeCount++;
                tempp.push(i);
            }
            else {
                index = i;
                if (threeCount != 0) {
                    break;
                }
            }
        }
        if(threeCount < 2){
            tempp = [];
            threeCount = 0;
            for ( let i = index; i < 15; i++) {
                if (map[i] == 3) {
                    threeCount++;
                    tempp.push(i);
                }
                else {
                    index = i;
                    if (threeCount != 0) {
                        break;
                    }
                }
            }
        }
        for(let i = 0;i < tempp.length;i++){
            for(let j = 0;j < 3;j++){
                threenum.push(tempp[i]);
            }
        }
        // for(let i = 0;i < threenumA.length-1;i++){
        //     if((threenumA[i][0]+1 == threenumA[i+1][0])){
        //         for(let j = 0;j < threenumA[i].length;j++){
        //             threenum.push(threenumA[i][j]);
        //         }
        //     }
        //     // for(let j = 0;j < threenumA[i].length;j++){
        //     //     threenum.push(threenumA[i][j]);
        //     // }
        // }
        let valueA = self.getPlaneMinValue(threenum);
        let threenumone = [];
        console.log('value a = ' + valueA);
        let cardsAlength = 0;
        if(cardsA.length == 15){
            cardsAlength = 3;
        }else if(cardsA.length == 10){
            cardsAlength = 2;
        }
        let cardsList = self.getPlaneWithStart(valueA, cardsB,cardsAlength);
        // let cardsList = self.getPlaneWithStart(valueA, cardsB,threenum.length/3);
        console.log('cards list = ' + JSON.stringify(cardsList));
        let oneCard = self.getRepeatCardsList(1, cardsB);
        let twoCard = self.getRepeatCardsList(2, cardsB);
        let threeCard=self.getRepeatCardsList(3, cardsB);
        for(let i = 0;i < threeCard.length; i++){
            threenumone.push(threeCard[i]);
        }
        console.log('one card = ' + JSON.stringify(twoCard));
        var oneLists = [];
        var twoList=[];
        var cardsLists=[];
        var threeList=[];
        var onelinktwo = [];
        var threelinkTwoLinkone = [];
        var issame=false;
        var length = oneCard.length;
        var length1 = 2*cardsA.length/5;
        var length2 = cardsA.length/5;
            if(length2 == 2){
                //三带二单 取四张单牌
                var length = oneCard.length;
                if(length >= 4){
                    for(let i=0;i<length;++i){
                        let one=oneCard[i];
                        for(let j=i+1;j<length;++j){
                            let oneCopy=one.concat();
                            oneCopy.push(oneCard[j][0]);
                            for(let k=j+1;k<length;++k){
                                let oneCopy1 = oneCopy.concat();
                                oneCopy1.push(oneCard[k][0]);
                                for(let z=k+1;z<length;++z){
                                    let oneCopy2 = oneCopy1.concat();
                                    oneCopy2.push(oneCard[z][0]);
                                    oneLists.push(oneCopy2);
                                }
                            }
                        }
                    }
                }
                for(let i=0;i<cardsList.length;++i){
                    for(let j=0;j<oneLists.length;++j){
                        let card=cardsList[i].concat();
                        for(let k=0;k<oneLists[j].length;++k){
                            card.push(oneLists[j][k]);
                        }
                        cardsLists.push(card);
                    }
                }
                // 三带一对
                if(twoCard.length >=2){
                    for(let i=0;i<twoCard.length;++i){
                        let one=twoCard[i];
                        let oneCopy=one.concat();
                        for(let j=i+1;j<twoCard.length;++j){
                            for(let k=0;k < twoCard[j].length;k++){
                                oneCopy.push(twoCard[j][k]);
                            }
                            twoList.push(oneCopy);
                        }
                    }
                    for(let i=0;i<cardsList.length;++i){
                        for(let j=0;j<twoList.length;++j){
                            let card=cardsList[i].concat();
                            for(let k=0;k<twoList[j].length;++k){
                                card.push(twoList[j][k]);
                            }
                            cardsLists.push(card);
                        }
                    }
                }
                //一个对子两个单
                if(twoCard.length && oneCard.length >= 2){
                    for(let i=0;i<twoCard.length;++i){
                        let one=twoCard[i];
                        for(let j=0;j<oneCard.length;++j){
                            let oneCopy=one.concat();
                            oneCopy.push(oneCard[j][0]);
                            for(let k = j+1;k < oneCard.length;k++){
                                let oneCopy1 = oneCopy.concat();
                                oneCopy1.push(oneCard[k][0]);
                                onelinktwo.push(oneCopy1);
                            }
                        }
                    }
                    for(let i=0;i<cardsList.length;++i){
                        for(let j=0;j<onelinktwo.length;++j){
                            let card=cardsList[i].concat();
                            for(let k=0;k<onelinktwo[j].length;++k){
                                card.push(onelinktwo[j][k]);
                            }
                            cardsLists.push(card);
                        }
                    }
                }
                //取出不一样的三个的
                threeList = [];
                var threeDelOne = []; //三个的拆成两个
                var threeDelTwo = []; //三个的拆成一个
                let threelink3 = []; //三个的拆3 拆2
                if(threeCard.length>=1){
                    for(let i=0;i<threeCard.length;++i){
                        for(let j=0;j<cardsList.length;++j){
                            issame=true;
                            var three = cardsList[j];
                            for(let k=0;k<cardsList[j].length;++k){
                                if(threeCard[i][0]!=cardsList[j][k]){
                            
                                }else{
                                    issame=false;
                                }
                            }
                            if(!issame){
                                continue;
                            }
                            if(issame){
                                threeList.push(threeCard[i]);
                                var threeCopy1 = three.concat();
                                var threeCopy2 = three.concat();
                                //三个拆成一个
                                threeCopy1.push(threeCard[i][0]);
                                threeDelTwo.push(threeCopy1);
                                //三个拆成两个
                                threeCopy2.push(threeCard[i][0]);
                                threeCopy2.push(threeCard[i][0]);
                                threeDelOne.push(threeCopy2);
                            }
                        }
                    }
                }


                //去两个三个的拆分
                let threepai = [];
                for(let i = 0;i < threeCard.length;i++){
                    threepai.push(threeCard[i][0]);
                }
                if(threeCard.length>=1){
                    for(let i=0;i<cardsList.length;++i){
                        let three2 = cardsList[i];
                        for(let j=0;j<threepai.length;++j){
                            issame=true;
                            let threeCopy3 = three2.concat();
                            for(let m = 0;m < three2.length;m++){
                                if(threepai[j]!=three2[m]){
                                
                                }else{
                                    issame=false;
                                }
                                if(!issame){
                                    continue;
                                }
                            }
                            if(issame){
                                threeCopy3.push(threepai[j]);
                                threeCopy3.push(threepai[j]);
                                threeCopy3.push(threepai[j]);
                                threelink3.push(threeCopy3);
                            }
                        }
                        // threelink3.push(threeCopy3);
                    }
                }



                if(threeList.length){
                    var temp = [];
                    //拼接两个单
                    if(oneCard.length >= 2){
                        for(let i=0;i<threeDelOne.length;++i){
                            let one = threeDelOne[i];
                            for(let j=0;j<oneCard.length;++j){
                                let oneCopy=one.concat();
                                oneCopy.push(oneCard[j][0]);
                                for(let k=j+1;k<oneCard.length;k++){
                                    let card = oneCopy.concat();
                                    card.push(oneCard[k][0]);
                                    cardsLists.push(card);
                                }
                            }
                        }
                    }
                    //拼接一个对
                    if(twoCard.length){
                        for(let i=0;i<threeDelOne.length;++i){
                            let one = threeDelOne[i];
                            for(let j=0;j<twoCard.length;++j){
                                let card=one.concat();
                                for(let k=0;k<twoCard[j].length;k++){
                                    card.push(twoCard[j][k]);
                                }
                                cardsLists.push(card);
                            }
                        }
                    }
                    //拆成一个的 拼接一单一对子
                    if(twoCard.length && oneCard.length){
                        for(let i=0;i<threeDelTwo.length;++i){
                            let one = threeDelTwo[i];
                            for(let j=0;j<twoCard.length;++j){
                                let card=one.concat();
                                for(let k=0;k<twoCard[j].length;k++){
                                    card.push(twoCard[j][k]);
                                }
                                threelinkTwoLinkone.push(card);
                            }
                        }
                        //最后跟一个单进行拼接
                        for(let i=0;i<threelinkTwoLinkone.length;i++){
                            let one = threelinkTwoLinkone[i];
                            for(let j = 0;j<oneCard.length;j++){
                                let card=one.concat();
                                card.push(oneCard[j][0]);
                                cardsLists.push(card);
                            }
                        }
                    }
                    //拆成一个  拼接三个单
                    if(oneCard.length >= 3){
                        for(let i=0;i<threeDelTwo.length;++i){
                            let one = threeDelTwo[i];
                                for(let j=0;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=j+1;k<oneCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        oneCopy1.push(oneCard[k][0]);
                                        for(let z = k+1;z <oneCard.length;z++){
                                            let oneCopy2 = oneCopy1.concat();
                                            oneCopy2.push(oneCard[z][0]);
                                            cardsLists.push(oneCopy2);
                                        }             
                                    }
                                }
                        }
                    }
                    //拼接三个的 threelink3
                    //1拼接一个单牌
                    if(oneCard.length){
                        for(let i=0;i<threelink3.length;i++){
                            let one = threelink3[i];
                            for(let j = 0;j<oneCard.length;j++){
                                let card=one.concat();
                                card.push(oneCard[j][0]);
                                cardsLists.push(card);
                            }
                        }
                    }
                    //拼接1个对子中的拆一个
                    for(let i=0;i<threelink3.length;++i){
                        let one = threelink3[i];
                        for(let j=0;j<twoCard.length;++j){
                            let card=one.concat();
                            card.push(twoCard[j][0]);
                            cardsLists.push(card);
                        }
                    }
                }
            }else if(length2 == 3){
                //三带二单 取六张单牌
                var length = oneCard.length;
                if(length >= 6){
                    for(let i=0;i<length;++i){
                        let one=oneCard[i];
                        for(let j=i+1;j<length;++j){
                            let oneCopy=one.concat();
                            oneCopy.push(oneCard[j][0]);
                            for(let k=j+1;k<length;++k){
                                let oneCopy1 = oneCopy.concat();
                                oneCopy1.push(oneCard[k][0]);
                                for(let z=k+1;z<length;++z){
                                    let oneCopy2 = oneCopy1.concat();
                                    oneCopy2.push(oneCard[z][0]);
                                    for(let m=z+1;m<length;++m){
                                        let oneCopy3 = oneCopy2.concat();
                                        oneCopy3.push(oneCard[m][0]);
                                        for(let n=m+1;n<length;++n){
                                            let oneCopy4 = oneCopy3.concat();
                                            oneCopy4.push(oneCard[n][0]);
                                            oneLists.push(oneCopy4);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for(let i=0;i<cardsList.length;++i){
                        for(let j=0;j<oneLists.length;++j){
                            let card=cardsList[i].concat();
                            for(let k=0;k<oneLists[j].length;++k){
                                card.push(oneLists[j][k]);
                            }
                            cardsLists.push(card);
                        }
                    }
                }
                // 三带一对
                if(twoCard.length >=3){
                    for(let i=0;i<twoCard.length;++i){
                        let one=twoCard[i];
                        let oneCopy=one.concat();
                        for(let j=i+1;j<twoCard.length;++j){
                            for(let k=0;k < twoCard[j].length;k++){
                                oneCopy.push(twoCard[j][k]);
                            }
                            for(let z = j+1;z<twoCard.length;z++){
                                let oneCopy1 = oneCopy.concat();
                                for(let m = 0;m < twoCard[z].length;m++){
                                    oneCopy1.push(twoCard[z][m]);
                                }
                                twoList.push(oneCopy1);
                            }
                        }
                    }
                    for(let i=0;i<cardsList.length;++i){
                        for(let j=0;j<twoList.length;++j){
                            let card=cardsList[i].concat();
                            for(let k=0;k<twoList[j].length;++k){
                                card.push(twoList[j][k]);
                            }
                            cardsLists.push(card);
                        }
                    }
                }
                //一个对子四个单
                if(twoCard.length && oneCard.length >= 4){
                    twoList = [];
                    for(let i=0;i<twoCard.length;++i){
                        let one=twoCard[i];
                        for(let j=0;j<oneCard.length;++j){
                            let oneCopy=one.concat();
                            oneCopy.push(oneCard[j][0]);
                            for(let k = j+1;k < oneCard.length;k++){
                                let oneCopy1 = oneCopy.concat();
                                oneCopy1.push(oneCard[k][0]);
                                for(let m = k+1;m < oneCard.length;m++){
                                    let oneCopy2 = oneCopy1.concat();
                                    oneCopy2.push(oneCard[m][0]);
                                    for(let n = m+1;n < oneCard.length;n++){
                                        let oneCopy3 = oneCopy2.concat();
                                        oneCopy3.push(oneCard[n][0]);
                                        twoList.push(oneCopy3);
                                    }
                                }
                            }
                        }
                    }
                    for(let i=0;i<cardsList.length;++i){
                        for(let j=0;j<twoList.length;++j){
                            let card=cardsList[i].concat();
                            for(let k=0;k<twoList[j].length;++k){
                                card.push(twoList[j][k]);
                            }
                            cardsLists.push(card);
                        }
                    }
                }
                //两个对子 两个单
                if(twoCard.length >= 2 && oneCard.length >= 2){
                    twoList = [];
                    for(let i=0;i<twoCard.length;++i){
                        let one=twoCard[i];
                        let oneCopy=one.concat();
                        for(let j=i+1;j<twoCard.length;++j){
                            for(let k=0;k < twoCard[j].length;k++){
                                oneCopy.push(twoCard[j][k]);
                            }
                            for(let m =0;m <oneCard.length;m++){
                                let oneCopy1 = oneCopy.concat();
                                oneCopy1.push(oneCard[m][0]);
                                for(let n = m+1;n < oneCard.length;n++){
                                    let oneCopy2 = oneCopy1.concat();
                                    oneCopy2.push(oneCard[n][0]);
                                    twoList.push(oneCopy2);
                                }
                            }
                        }
                    }
                    for(let i=0;i<cardsList.length;++i){
                        for(let j=0;j<twoList.length;++j){
                            let card=cardsList[i].concat();
                            for(let k=0;k<twoList[j].length;++k){
                                card.push(twoList[j][k]);
                            }
                            cardsLists.push(card);
                        }
                    }
                }
                //取出不一样的三个的
                threeList = [];
                var threeDelOne = []; //三个的拆成两个
                var threeDelTwo = []; //三个的拆成一个
                var threechai32 = []; //三个的拆3 拆2
                var threechai23 = []; //三个的拆2 拆3
                //取一个三个的拆分
                if(threeCard.length>=1){
                    for(let i=0;i<threeCard.length;++i){
                        for(let j=0;j<cardsList.length;++j){
                            issame=true;
                            let three1 = cardsList[j];
                            for(let k=0;k<cardsList[j].length;++k){
                                if(threeCard[i][0]!=cardsList[j][k]){
                            
                                }else{
                                    issame=false;
                                }
                            }
                            if(!issame){
                                continue;
                            }
                            if(issame){
                                threeList.push(threeCard[i]);
                                var threeCopy1 = three1.concat();
                                var threeCopy2 = three1.concat();
                                //三个拆成一个
                                threeCopy1.push(threeCard[i][0]);
                                threeDelTwo.push(threeCopy1);
                                //三个拆成两个
                                threeCopy2.push(threeCard[i][0]);
                                threeCopy2.push(threeCard[i][0]);
                                threeDelOne.push(threeCopy2);
                            }
                        }
                    }
                }
                let ppp = threeList;
                //去两个三个的拆分
                let threepai = [];
                for(let i = 0;i < threeCard.length;i++){
                    threepai.push(threeCard[i][0]);
                }
                if(threeCard.length>=1){
                    for(let i=0;i<cardsList.length;++i){
                        let three2 = cardsList[i];
                        let temp23 = [];
                        let temp321 = [];
                        let threeCopy32 = three2.concat();
                        let threeCopy23 = three2.concat();
                        let onlypushThree = true;
                        for(let j=0;j<threepai.length;++j){
                            issame=true;
                            for(let m = 0;m < three2.length;m++){
                                if(threepai[j]!=three2[m]){
                                
                                }else{
                                    issame=false;
                                }
                                if(!issame){
                                    continue;
                                }
                            }
                            if(issame){
                                // let threeCopy32 = three2.concat();
                                // let threeCopy23 = three2.concat();
                                //拼成三个的
                                if(onlypushThree){
                                    threeCopy32.push(threepai[j]);
                                    threeCopy32.push(threepai[j]);
                                    threeCopy32.push(threepai[j]);
    
                                    threeCopy23.push(threepai[j]);
                                    threeCopy23.push(threepai[j]);
                                    onlypushThree = false;
                                }else{
                                    threeCopy32.push(threepai[j]);
                                    threeCopy32.push(threepai[j]);
    
                                    threeCopy23.push(threepai[j]);
                                    threeCopy23.push(threepai[j]);
                                    threeCopy23.push(threepai[j]);
                                }
                                // for(let u = 0;u < threeCopy32.length;u++){
                                //     temp321.push(threeCopy32[u]);
                                // }
                                // for(let h = 0;h < threeCopy23.length;h++){
                                //     temp23.push(threeCopy23[h]);
                                // }
                            }
                        }
                        // for(let u = 0;u < threeCopy32.length;u++){
                        //     threechai32.push(threeCopy32[u]);
                        // }
                        // for(let h = 0;h < threeCopy23.length;h++){
                        //     threechai23.push(threeCopy23[h]);
                        // }
                        threechai32.push(threeCopy32);
                        threechai23.push(threeCopy23);
                        // for(let u = 0;u < threeCopy32.length;u++){
                        //     threechai32.push(threeCopy32[u]);
                        // }
                        // for(let h = 0;h < threeCopy23.length;h++){
                        //     threechai23.push(threeCopy23[h]);
                        // }
                    }
                }
                if(threeList.length){
                    var temp = [];
                    //  三个的拆成一对
                    //拼接四个单
                    if(oneCard.length >= 4){
                        for(let p=0;p<threeDelOne.length;++p){
                            let three = threeDelOne[p];
                            for(let i=0;i<oneCard.length;++i){
                                let one= three.concat();
                                one.push(oneCard[i][0]);
                                for(let j=i+1;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=j+1;k<oneCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        oneCopy1.push(oneCard[k][0]);
                                        for(let z=k+1;z<oneCard.length;++z){
                                            let oneCopy2 = oneCopy1.concat();
                                            oneCopy2.push(oneCard[z][0]);
                                            cardsLists.push(oneCopy2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //拼接两个对
                    if(twoCard.length >= 2){
                        for(let i=0;i<threeDelOne.length;++i){
                            let one = threeDelOne[i];
                            for(let j=0;j<twoCard.length;++j){
                                let oneCopy=one.concat();
                                for(let k=0;k<twoCard[j].length;k++){
                                    oneCopy.push(twoCard[j][k]);
                                }
                                for(let z = j+1;z<twoCard.length;z++){
                                    let oneCopy1 = oneCopy.concat();
                                    for(let m = 0;m < twoCard[z].length;m++){
                                        oneCopy1.push(twoCard[z][m]);
                                    }
                                    cardsLists.push(oneCopy1);
                                }
                            }
                        }
                    }
                    //拼接一对两单
                    if(twoCard.length&&oneCard.length >= 2){
                        for(let i=0;i<threeDelOne.length;++i){
                            let one = threeDelOne[i];
                            for(let j=0;j<twoCard.length;++j){
                                let oneCopy=one.concat();
                                for(let k=0;k<twoCard[j].length;k++){
                                    oneCopy.push(twoCard[j][k]);
                                }
                                for(let z = 0;z<oneCard.length;z++){
                                    let oneCopy1 = oneCopy.concat();
                                    oneCopy1.push(oneCard[z][0]);
                                    for(let m = z+1;m < oneCard.length;m++){
                                        let oneCopy2 = oneCopy1.concat();
                                        oneCopy2.push(oneCard[m][0]);
                                    }
                                    cardsLists.push(oneCopy2);
                                }
                            }
                        }
                    }
                    //TODO
                    //拆成一个的 拼接五个单
                    if(oneCard.length >= 5){
                        for(let i=0;i<threeDelTwo.length;++i){
                            let one = threeDelTwo[i];
                                for(let j=0;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=j+1;k<oneCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        oneCopy1.push(oneCard[k][0]);
                                        for(let z = k+1;z <oneCard.length;z++){
                                            let oneCopy2 = oneCopy1.concat();
                                            oneCopy2.push(oneCard[z][0]);
                                            for(let m = z+1;m <oneCard.length;m++){
                                                let oneCopy3 = oneCopy2.concat();
                                                oneCopy3.push(oneCard[m][0]);
                                                for(let n = m+1;n <oneCard.length;n++){
                                                    let oneCopy4 = oneCopy3.concat();
                                                    oneCopy4.push(oneCard[n][0]);
                                                    cardsLists.push(oneCopy4);
                                                }
                                            }
                                        }             
                                    }
                                }
                        }
                    }
                    //三单 一个对子
                    if(oneCard.length >= 3 && twoCard.length){
                        for(let i=0;i<threeDelTwo.length;++i){
                            let one = threeDelTwo[i];
                                for(let j=0;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=j+1;k<oneCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        oneCopy1.push(oneCard[k][0]);
                                        for(let z = k+1;z <oneCard.length;z++){
                                            let oneCopy2 = oneCopy1.concat();
                                            oneCopy2.push(oneCard[z][0]);
                                            for(let m = 0;m <twoCard.length;m++){
                                                let oneCopy3 = oneCopy2.concat();
                                                for(let n = 0;n <twoCard[m].length;n++){
                                                    oneCopy3.push(twoCard[m][n]);
                                                }
                                                cardsLists.push(oneCopy3);
                                            }
                                        }             
                                    }
                                }
                        }
                    }
                    //一单 两个对子
                    if(oneCard.length && twoCard.length >= 2){
                        for(let i=0;i<threeDelTwo.length;++i){
                            let one = threeDelTwo[i];
                                for(let j=0;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=0;k<twoCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        for(let z = 0;z <twoCard[k].length;z++){
                                            oneCopy1.push(oneCard[k][z]);
                                        }
                                        for(let m = k+1;m <twoCard.length;m++){
                                            let oneCopy2 = oneCopy1.concat();
                                            for(let n = 0;n <twoCard[m].length;n++){
                                                oneCopy2.push(twoCard[m][k]);
                                            }
                                            cardsLists.push(oneCopy2);
                                        }             
                                    }
                                }
                            }
                    }
                    //拼接三个的和飞机
                    //threeList
                    //1 一单一对
                    if(oneCard.length && twoCard.length){
                        for(let i=0;i<threeList.length;++i){
                            let one = threeList[i];
                                for(let j=0;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=0;k<twoCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        for(let z = 0;z <twoCard[k].length;z++){
                                            oneCopy1.push(oneCard[k][z]);
                                        }
                                        cardsLists.push(oneCopy1);             
                                    }
                                }
                            }
                    }
                    //2 三个单
                    if(oneCard.length >= 3){
                        for(let i=0;i<threeList.length;++i){
                            let one = threeList[i];
                                for(let j=0;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=j+1;k<oneCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        oneCopy1.push(oneCard[k][0]);
                                        for(let z = k+1;z <oneCard.length;z++){
                                            let oneCopy2 = oneCopy1.concat();
                                            oneCopy2.push(oneCard[z][0]);
                                            cardsLists.push(oneCopy2);
                                        }             
                                    }
                                }
                        }
                    }
                    //3 一个对 加拆一个对子
                    if(twoCard.length >= 2){
                        for(let i=0;i<threeList.length;++i){
                            let one = threeList[i];
                                for(let j=0;j<oneCard.length;++j){
                                    let oneCopy=one.concat();
                                    oneCopy.push(oneCard[j][0]);
                                    for(let k=0;k<twoCard.length;++k){
                                        let oneCopy1 = oneCopy.concat();
                                        for(let z = 0;z <twoCard[k].length;z++){
                                            oneCopy1.push(oneCard[k][z]);
                                        }
                                        for(let m = k+1;m <twoCard.length;m++){
                                            let oneCopy2 = oneCopy1.concat();
                                            oneCopy2.push(twoCard[m][0]);
                                            cardsLists.push(oneCopy2);
                                        }             
                                    }
                                }
                            }
                    }
                    //拆两个三个的
                    if(oneCard.length){
                        for(let j=0;j<threechai32.length;++j){
                            let one=threechai32[j];
                            for(let z = 0;z <oneCard.length;z++){
                                let oneCopy=one.concat();
                                oneCopy.push(oneCard[z][0]);
                                cardsLists.push(oneCopy);
                            }
                        } 
                    }
                    if(oneCard.length){
                        for(let j=0;j<threechai23.length;++j){
                            let one=threechai23[j];
                            for(let z = 0;z <oneCard.length;z++){
                                let oneCopy=one.concat();
                                oneCopy.push(oneCard[z][0]);
                                cardsLists.push(oneCopy);
                            }
                        } 
                    }
                }
                 
            } 
        //根据length2 来判断飞机的长度
        //card1*x + card2*y = length2;
        //拼接飞机 对子和单
        // twoCard.sort((a, b) => {
        //     return a[0] - b[0];
        // });
        // if (twoCard.length >= 2) {
        //     for (let i = 0; i < cardsList.length; i++) {
        //         let cards = cardsList[i];
        //         for (let j = 0; j < 2; j++) {
        //             // cards.push(twoCard[j][0]);
        //             for (let h = 0; h < twoCard[j].length; h++) {
        //                 cards.push(twoCard[j][h]);
        //             }
        //
        //         }
        //     }
        // }
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardList.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardsLists.push(fourBoomList[i]);
            }
        }
        return cardsLists;
    },

    getScrollMinNum(cardList) {
        let minNum = 100;
        for (let i = 0; i < cardList.length; i++) {
            if (cardList[i] < minNum) {
                minNum = cardList[i];
            }
        }
        return minNum;
    },
    getScrollCardsList(length, cards) {
        console.log(length, cards);
        let cardList = [];
        let map = {};
        for (let i = 0; i < cards.length; i++) {
            if (!map.hasOwnProperty(cards[i])) {
                cardList.push(cards[i]);
                map[cards[i]] = true;
            }
        }

        cardList.sort((a, b) => {
            return a - b;
        });
        let cardsList = [];
        for (let i = 0; i < (cardList.length - length+1); i++) {
            let list = [];
            for (let j = i; j < i + length; j++) {
                list.push(cardList[j]);
            }
            cardsList.push(list);
        }
        console.log('cars list =  ' + JSON.stringify(cardsList));
        let endList = [];
        for (let i = 0; i < cardsList.length; i++) {
            let flag = true;
            for (let j = 0; j < (cardsList[i].length - 1); j++) {
                if (Math.abs(cardsList[i][j] - cardsList[i][j + 1]) !== 1) {
                    flag = false;
                }
            }

            if (flag === true) {
                endList.push(cardsList[i]);
            }
        }
        return endList;
    },
    tipsScroll(cardsA, cardsB, self) {
        console.log(cardsA, cardsB);
        let valueA = self.getScrollMinNum(cardsA);
        let list = self.getScrollCardsList(cardsA.length, cardsB);
        console.log('tips scroll list = ' + JSON.stringify(list));
        let cardsList = [];
        for (let i = 0; i < list.length; i++) {
            let valueB = self.getScrollMinNum(list[i]);
            if (valueB > valueA) {
                cardsList.push(list[i]);
            }
        }
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardsList.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardsList.push(fourBoomList[i]);
            }
        }

        return cardsList;
    },
    getDoubleScorllMinValue(cardList) {
        //3,3,4,4,5,5
        //[[3,3], [4,4], [5,5]]
        cardList.sort((a, b) => {
            return a - b;
        });
        return cardList[0];
    },
    tipsDoubleScroll(cardsA, cardsB, self) {
        //[[3,3],[4,4],[5,5]]
        //[3,3,4,4,5,5];
        //3,3,3,4,4,4,5,5,5
        console.log('cards a = ' + JSON.stringify(cardsA));
        let valueA = self.getDoubleScorllMinValue(cardsA);
        console.log('tips double scroll = ' + valueA);
        // let list = getRepeatCardsList(2, cardsB);
        let map = {};
        for (let i = 0; i < cardsB.length; i++) {
            let key = -1;
            if (cardsB[i] !== 53 || cardsB[i] !== 52) {
                key = cardsB[i];
            } else {
                key = cardsB[i];
            }
            if (map.hasOwnProperty(key)) {
                map[key].push(cardsB[i]);
            } else {
                map[key] = [cardsB[i]];
            }
        }
        console.log('map  = ' + JSON.stringify(map));
        // {
        //     '3': [card, card,card],
        //     '4': [card, card, card],
        //     '5': [card, card, card]
        // }
        var list = [];
        for (let i in map) {
            if (map[i].length >= 2) {
                // list.push(map[i].substring(0, 2));
                let l = [];
                for (let j = 0; j < 2; j++) {
                    l.push(map[i][j]);
                }
                list.push(l);
            }
        }
        // [[2,2],[1,1]]
        // console.log('list = ' + JSON.stringify(list));
        list.sort((a, b) => {
            return a[0] - b[0];
        });
        console.log('list = ' + JSON.stringify(list));
        let groupList = [];
        let length = Math.round(cardsA.length * 0.5);
        console.log('length  = ' + length);
        for (let i = 0; i < (list.length - length + 1); i++) {
            let l = [];
            for (let j = i; j < (i + length); j++) {
                l.push(list[j]);
            }
            groupList.push(l);
        }
        console.log('group list = ' + JSON.stringify(groupList));
        let doubleScrollList = [];
        for (let i = 0; i < groupList.length; i++) {
            let group = groupList[i];
            console.log('group = ' + JSON.stringify(group));
            let flag = true;
            for (let j = 0; j < (group.length - 1); j++) {
                let cards = group[j];
                console.log('cards = ' + JSON.stringify(cards));
                if (Math.abs(group[j][0] - group[j + 1][0]) !== 1) {
                    flag = false;
                }
            }
            console.log('flag  = ' + flag);
            if (flag === true) {
                let endList = [];
                for (let j = 0; j < group.length; j++) {
                    endList.push(group[j][0]);
                    endList.push(group[j][1]);

                }
                let valueB = self.getDoubleScorllMinValue(endList);
                if (valueB > valueA) {
                    doubleScrollList.push(endList);
                }
            }
        }
        let kingBoom = self.getKingBoom(cardsB);
        if (kingBoom !== false) {
            doubleScrollList.push(kingBoom);
        }
        let fourBoomList = self.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                doubleScrollList.push(fourBoomList[i]);
            }
        }
        return doubleScrollList;
    },

    //得到提示牌的方法
    getTipsCardsList(cardsA, cardsB) {
        console.log("上家出牌为：",cardsA);
        if ((cardsA.length === 1 && cardsA[0] === 0) ||cardsA.length === 0 || typeof cardsA === "undefined" ) {
            let list = [];
            let map = this.getCardListWithStart(0, cardsB);
            for (let i in map) {
                list.push(map[i]);
            }
            let list1 = this.getRepeatCardsList(4, cardsB);
            console.log('get four boom  = ' + JSON.stringify(list));
            if (list1.length != 0) {
                // cardsList.push(fourBoom);
                for (let i = 0; i < list1.length; i++) {
                    list.push(list1[i]);
                }
            }
            return list;
        }else {

            // if (cc.vv.pdkNetMgr.turn == cc.vv.pdkNetMgr.seatIndex) {
            //     let cardsValueB = this.getCardsValue(cardsB);
            //     if (cardsValueB != false) {
            //         var tmpList = [];
            //         tmpList.push(cardsB);
            //         return tmpList;
            //     }
            // }

            let cardsValue = this.getCardsValue(cardsA);
            let name = cardsValue.name;
            let str = 'tips' + name;
            let method = this[str];
            console.log("meng method=", method);
            return method(cardsA, cardsB, this);
        }
    },

    isContinue: function (cardList) {
        var iscontinue = true;
        for (let i = 0; i < cardList.length - 1; ++i) {
            if (Math.abs(cardList[i] - cardList[i + 1]) !== 1) {
                iscontinue = false;
            }
        }
        if (iscontinue === false) {
            iscontinue = true;
            for (let i = 0; i < cardList.length - 2; ++i) {
                if (Math.abs(cardList[i] - cardList[i + 2]) !== 1) {
                    iscontinue = false;
                }
            }
        }
        if (iscontinue === false) {
            if (cardList.length >= 4) {
                iscontinue = true;
            }

        }
        return iscontinue;
    },
    isLegality: function (cardList) {
        // var rlreturn = false;
        // switch (cardList.length) {
        //     case 1:
        //         rlreturn = this.isOneCard(cardList)
        //         break;
        //     case 2:
        //         rlreturn = this.isDouble(cardList) || this.isKingBoom(cardList)
        //         break;
        //     case 3:
        //         rlreturn = this.isThree(cardList)
        //         break;
        //     case 4:
        //         rlreturn = this.isFourBoom(cardList) || this.isThreeWithOne(cardList)
        //         break;
        //     case 5:
        //         rlreturn = this.isScroll(cardList) || this.isThreeWithTwo(cardList)
        //         break;
        //     case 6:
        //         rlreturn = this.isScroll(cardList) || this.isDoubleScroll(cardList) || this.isPlane(cardList)
        //         break;
        // }
        // if (cardList.length !== 1 && cardList.length !== 2 && cardList.length !== 3 && cardList.length !== 4 && cardList.length !== 5 && cardList.length !== 6) {
        //
        //     rlreturn = this.isPlane(cardList) || this.isScroll(cardList) || this.isDoubleScroll(cardList) || this.isPlaneWithTwo(cardList)
        //         || this.isPlaneWithOne(cardList);
        //
        // }
        // return rlreturn;
        return (this.isOneCard(cardList) || this.isDouble(cardList)
            || this.isThree(cardList) || this.isPlane(cardList)
            || this.isScroll(cardList) || this.isDoubleScroll(cardList)
            || this.isBoom(cardList) || this.isThreeWithTwo(cardList)
            || this.isThreeWithOne(cardList) || this.isPlaneWithOne(cardList)
            || this.isPlaneWithTwo(cardList) || this.isContinue(cardList)
            || this.isFourWithDSTwo(cardList)) || this.isFourWithDSThree(cardList);
    },
    getActivetips: function (cardList) {
        var triplewidthone = this.getActiveThreeWithNumCardsList(1, cardList);
        var triplewidthtwo = this.getActiveThreeWithNumCardsList(2, cardList);
        var quardewidthone = this.getActiveFourWithNumCardsList(1, cardList, true);
        var quardewidthtwo = this.getActiveFourWithNumCardsList(2, cardList, false);
        if (triplewidthone) {
            return triplewidthone;
        }
        if (triplewidthtwo) {
            return triplewidthtwo;
        }
        if (quardewidthone) {
            return quardewidthone;
        }
        if (quardewidthtwo) {
            return quardewidthtwo;
        }
    },
    getActiveThreeWithNumCardsList(num, cardsB) {
        let list = this.getRepeatCardsList(3, cardsB);
        let cardList = [];
        for (let i = 0; i < list.length; i++) {

            cardList.push(list[i]);

        }
        let oneList = this.getRepeatCardsList(num, cardsB);
        let minNum = 100;
        let oneCard = undefined;
        for (let i = 0; i < oneList.length; i++) {
            if (oneList[i][0] < minNum) {
                minNum = oneList[i][0];
                oneCard = oneList[i];
            }
        }
        for (let i = 0; i < cardList.length; i++) {
            let l = cardList[i];
            if (oneCard !== undefined) {
                for (let j = 0; j < oneCard.length; j++) {
                    l.push(oneCard[j]);
                }
            }
        }

        let kingBoom = this.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardList.push(kingBoom);
        }
        let fourBoomList = this.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardList.push(fourBoomList[i]);
            }
        }
        return cardList;
    },
    getActiveFourWithNumCardsList(num, cardsB, istwo) {
        let list = this.getRepeatCardsList(4, cardsB);
        let cardList = [];
        for (let i = 0; i < list.length; i++) {
            cardList.push(list[i]);
        }
        let oneList = this.getRepeatCardsList(num, cardsB);
        let minNum = 100;
        let oneCard = undefined;
        let twoCard = undefined;
        for (let i = 0; i < oneList.length; i++) {
            if (oneList[i][0] < minNum) {
                if (minNum !== 100) {
                    twoCard = minNum;
                }
                minNum = oneList[i][0];
                oneCard = oneList[i];
            }
        }
        for (let i = 0; i < oneList.length; ++i) {
            if (twoCard === oneList[i][0]) {
                twoCard = oneList[i];
                break;
            }
        }
        for (let i = 0; i < cardList.length; i++) {
            let l = cardList[i];
            if (oneCard !== undefined) {
                for (let j = 0; j < oneCard.length; j++) {
                    l.push(oneCard[j]);
                }
                if (istwo) {
                    for (let k = 0; k < twoCard.length; ++k) {
                        l.push(twoCard[k]);
                    }
                }
            }
        }

        let kingBoom = this.getKingBoom(cardsB);
        if (kingBoom !== false) {
            cardList.push(kingBoom);
        }
        let fourBoomList = this.getFourBoom(cardsB);
        if (fourBoomList !== false) {
            // cardsList.push(fourBoom);
            for (let i = 0; i < fourBoomList.length; i++) {
                cardList.push(fourBoomList[i]);
            }
        }

        return cardList;
    },
    // const CardsValue = {
    //     'one': {
    //         name: 'One',
    //         value: 1
    //     },
    //     'double': {
    //         name: 'Double',
    //         value: 1
    //     },
    //     'three': {
    //         name: 'Three',
    //         value: 1
    //     },
    //     'boom': {
    //         name: 'Boom',
    //         value: 2
    //     },
    //     'threeWithOne': {
    //         name: 'ThreeWithOne',
    //         value: 1
    //     },
    //     'threeWithTwo': {
    //         name: 'ThreeWithTwo',
    //         value: 1
    //     },
    //     'plane': {
    //         name: 'Plane',
    //         value: 1
    //     },
    //     'planeWithOne': {
    //         name: 'PlaneWithOne',
    //         value: 1
    //     },
    //     'planeWithTwo': {
    //         name: 'PlaneWithTwo',
    //         value: 1
    //     },
    //     'scroll': {
    //         name: 'Scroll',
    //         value: 1
    //     },
    //     'doubleScroll': {
    //         name: 'DoubleScroll',
    //         value: 1
    //     }
    //
    //
    // };


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

});



