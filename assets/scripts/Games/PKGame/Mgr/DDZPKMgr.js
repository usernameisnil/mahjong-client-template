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
    isFourWithSDTwo(cardList) {
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
    isFourWithSDDTwo(cardList) {
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
            let keys = Object.keys(map);
            console.log('map =' + JSON.stringify(map));
            if (keys.length) {
                for (let i in map) {
                    if (map[i] !== 3) {
                        return false;
                    }
                }
                for (let i = 0; i < keys.length - 1; ++i) {
                    if (Math.abs(Number(keys[i]) - Number(keys[i + 1])) === 1) {
                        return true;
                    }
                }

            } else {
                return false;
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
            let keys = Object.keys(map);
            if (keys.length < 4) {
                // let threeCount = 0;
                console.log('key 的长度不为4');
                return false;
            }

            let oneCount = 0;
            let threeList = [];
            for (let i in map) {
                if (map[i] === 3) {
                    threeList.push(i);
                    // threeCount ++;
                }
                if (map[i] === 1) {
                    oneCount++;
                }
            }
            console.log('one count = ' + oneCount);
            console.log('three list = ' + JSON.stringify(threeList));
            if (threeList.length < 2 || oneCount < 2) {
                return false;
            }
            if(threeList.length!==oneCount){
                return false;
            }
            for (let i = 0; i < threeList.length; ++i) {
                if (Math.abs(Number(threeList[i]) - Number(threeList[i + 1])) === 1) {
                    return true;
                }
            }
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
            let keys = Object.keys(map);
            if (keys.length < 4) {
                return false;
            }
            let twoCount = 0;
            let threeList = [];
            for (let i in map) {
                if (map[i] === 3) {
                    threeList.push(i);
                    // threeCount ++;
                }
                if (map[i] === 2) {
                    twoCount++;
                }
            }
            if (threeList.length < 2 || twoCount < 2) {
                return false;
            }
            if(threeList.length!==twoCount) {
                return false;
            }


            for (let i = 0; i < threeList.length - 1; ++i) {
                if (Math.abs(Number(threeList[i]) - Number(threeList[i + 1])) === 1) {
                    return true;
                }
            }
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
        if (cardList.length >= 6) {
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
        if (this.isThreeWithOne(cardList)) {
            console.log('三带一');
            return CardsValue.threeWithOne;
        }
        if (this.isThreeWithTwo(cardList)) {
            console.log('三带二');
            return CardsValue.threeWithTwo;
        }
        if (this.isPlane(cardList)) {
            console.log('飞机');
            return CardsValue.plane;
        }
        if (this.isPlaneWithOne(cardList)) {
            console.log('飞机带翅膀');
            return CardsValue.planeWithOne;
        }
        if (this.isPlaneWithTwo(cardList)) {
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
        if (this.isFourWithDSTwo(cardList)) {
            console.log('四带不同两个');
            return CardsValue.fourwithdstwo;
        }
        if (this.isFourWithSDTwo(cardList)) {
            console.log('四带一对');
            return CardsValue.fourwithsdtwo;
        }
        if (this.isFourWithSDDTwo(cardList)) {
            console.log('四带两对');
            return CardsValue.fourwithsddtwo;
        }
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
            let maxNum = 100;
            for (let i in mapA) {
                if (Number(i) < maxNum) {
                    maxNum = Number(i);
                    listA = mapA[i];
                }
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
            maxNum = 100;
            let listB = [];
            for (let i in mapB) {
                if (Number(i) < maxNum) {
                    maxNum = Number(i);
                    listB = mapB[i];
                }
            }
            return self.compareThree(listA, listB, self);
        }else{
            return false;
        }
    },
    comparePlaneWithOne(a, b, self) {
        if(a.length===b.length) {
            let mapA = {};
            //3,3,3,4,4,4,5,6
            let listA = [];
            for (let i = 0; i < a.length; i++) {
                if (mapA.hasOwnProperty(a[i])) {
                    listA.push(a[i]);
                } else {
                    mapA[a[i]] = [a[i]];
                }
            }
            let mapB = {};
            let listB = [];
            for (let i = 0; i < b.length; i++) {
                if (mapB.hasOwnProperty(b[i])) {
                    listB.push(b[i]);
                } else {
                    mapB[b[i]] = [b[i]];
                }
            }


            return self.comparePlane(listA, listB, self);
        }else{
            return false;
        }

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
            for (let i in mapA) {
                if (mapA[i].length === 3) {
                    for (let j = 0; j < mapA[i].length; j++) {
                        listA.push(mapA[i][j]);
                    }
                }
            }
            console.log('list a = ' + JSON.stringify(listA));

            let listB = [];
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
        console.log('onelist 1133', twoList);
        console.log('onelist 1133', threeList);
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
        let map = self.getCardListWithStart(cardsA[0], cardsB);//得到比cardsA大的列表
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
            twoList = this.getRepeatCardsList(2, cardslist);
            threeList = this.getRepeatCardsList(3, cardslist);
        }
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
        if(num===1) {

             oneList = this.getRepeatCardsList(1,cardsB);
             twoList = this.getRepeatCardsList(2,cardsB);
             threeList = this.getRepeatCardsList(3, cardsB);
        }else{
            twoList = this.getRepeatCardsList(2,cardsB);
            threeList = this.getRepeatCardsList(3, cardsB);
        }

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
        console.log('三道二的提示');
        return self.getThreeWithNumCardsList(2, cardsA, cardsB);
    },
    tipsFourWithDSTwo(cardsA, cardsB, self) {
        return self.getFourWithNumCardsList(1, cardsA, cardsB, true);
    },
    tipsFourWithSDTwo(cardsA, cardsB, self) {
        return self.getFourWithNumCardsList(2, cardsA, cardsB, false);
    },
    tipsFourWithSDDTwo(cardsA, cardsB, self) {
        return self.getFourWithNumCardsList(2, cardsA, cardsB, true);
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

    getPlaneWithStart(num, cardsB) {
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
        let cardsList = self.getPlaneWithStart(valueA, cardsB);
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
        // let list = that.tipsPlane(cardsA, cardsB);
        let valueA = self.getPlaneMinValue(cardsA);
        console.log('value a = ' + valueA);
        let cardsList = self.getPlaneWithStart(valueA, cardsB);
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
        if(oneCard.length>=2){
            for(let i=0;i<oneCard.length;++i){
                var one=oneCard[i];
                for(let j=i+1;j<oneCard.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(oneCard[j][0]);
                    oneList.push(oneCopy);
                }
            }
        }
            for(let i=0;i<oneCard.length;++i){
                var one=oneCard[i];
                for(let j=0;j<twoCard.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(twoCard[j][0]);
                    oneList.push(oneCopy);
                }
            }

        for(let i=0;i<oneCard.length;++i){
            var one=oneCard[i];
            for(let l=0;l<threeCard.length;++l){
                var oneCopy=one.concat();
                for(let j=0;j<cardsList.length;++j){
                    for(let k=0;k<cardsList[j].length;++k){
                        if(threeCard[l][0]!==cardsList[j][k]){
                            issame=true;
                        }else{
                            issame=false;
                        }
                    }
                }
                if(issame) {
                    oneCopy.push(threeCard[l][0]);
                }
                oneList.push(oneCopy);
            }
        }
        if(threeCard.length>=1){
            for(let i=0;i<threeCard.length;++i){
                threeCard[i].splice(0,2);
                for(let j=0;j<cardsList.length;++j){
                    for(let k=0;k<cardsList[j].length;++k){
                        if(threeCard[i][0]!==cardsList[j][k]){
                            issame=true;
                        }else{
                            issame=false;
                        }
                    }
                }
                if(issame){
                    threeList.push(threeCard[i]);
                }
            }
        }
        if(twoCard.length>=2){
            for(let i=0;i<twoCard.length;++i){
                twoCard[i].splice(twoCard[i].length,1);
                var one=twoCard[i];
                for(let j=i+1;j<twoCard.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(twoCard[j][0]);
                    twoList.push(oneCopy);
                }
            }
        }
        if(twoCard.length>=1){
            for(let i=0;i<twoCard.length;++i){
                twoCard[i].splice(twoCard[i].length,1);
                var one=twoCard[i];
                for(let j=0;j<threeList.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(threeList[j][0]);
                    twoList.push(oneCopy);
                }
            }
        }
        if(threeList.length>=2){
            for(let i=0;i<threeList.length;++i){
                var one=threeList[i];
                for(let j=i+1;j<threeList.length;++j){
                    var oneCopy=one.concat();
                    oneCopy.push(threeList[j][0]);
                    endthreelist.push(oneCopy);
                }
            }
        }
        if (oneCard.length >= 2) {
            for (let i = 0; i < cardsList.length; i++) {
                for (let j = 0; j < oneList.length; j++) {
                    cards = cardsList[i].concat();
                    for(let k=0;k<oneList[j].length;++k) {
                        cards.push(oneList[j][k]);
                    }
                    cardList.push(cards);
                }
            }
        }
        if (twoList.length >= 1) {
            for (let i = 0; i < cardsList.length; i++) {
                for (let j = 0; j < twoList.length; j++) {
                    card = cardsList[i].concat();
                    for(let k=0;k<twoList[j].length;++k){
                        card.push(twoList[j][k]);
                    }
                    cardList.push(card);
                }
            }
        }
        if(endthreelist.length>=1){
            for(let i=0;i<cardsList.length;++i){
                for(let j=0;j<endthreelist.length;++j){
                    var threecards=cardsList[i].concat();
                    for(let k=0;k<endthreelist[j].length;++k){
                        threecards.push(threeList[j][k]);
                    }
                    cardList.push(threecards);
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
        let valueA = self.getPlaneMinValue(cardsA);
        console.log('value a = ' + valueA);
        let cardsList = self.getPlaneWithStart(valueA, cardsB);
        console.log('cards list = ' + JSON.stringify(cardsList));
        let twoCard = self.getRepeatCardsList(2, cardsB);
        let threeCard=self.getRepeatCardsList(3, cardsB);
        console.log('one card = ' + JSON.stringify(twoCard));
        var twoList=[];
        var cardList=[];
        var threeList=[];
        var endthreeList=[];
        var issame=false;
        for(let i=0;i<twoCard.length;++i){
            var two=twoCard[i];
            for(let j=i+1;j<twoCard.length;++j){
                var twoCopy=two.concat();
                for(let k=0;k<twoCard[j].length;++k){
                    twoCopy.push(twoCard[j][k]);
                }
                twoList.push(twoCopy);
            }
        }
        for(let i=0;i<threeCard.length;++i){
            threeCard[i].splice(threeCard[i].length-1,1);
            for(let j=0;j<cardsList.length;++j){
                for(let k=0;k<cardsList.length;++k){
                    if(cardsList[j][k]!==threeCard[i][0]){
                        issame=true;
                    }else{
                        issame=false;
                    }
                }
            }
            if(issame){
                threeList.push(threeCard[i]);
            }
        }
        for(let i=0;i<twoCard.length;++i){
            var twos=twoCard[i];
            for(let j=0;j<threeList.length;++j){
                var twoCopy=twos.concat();
                for(let k=0;k<threeList[j].length;++k){
                    twoCopy.push(threeList[j][k]);
                }
                twoList.push(twoCopy);
            }
        }
        for(let i=0;i<threeList.length;++i){
            var three=threeList[i];
            for(let j=i+1;j<threeList.length;++j){
                var threeCopy=three.concat();
                for(let k=0;k<threeList[j].length;++k){
                    threeCopy.push(threeList[j][k]);
                }
                endthreeList.push(threeCopy);
            }
        }
        for(let i=0;i<cardsList.length;++i){
            for(let j=0;j<twoList.length;++j){
                var card=cardsList[i].concat();
                for(let k=0;k<twoList[j].length;++k){
                    card.push(twoList[j][k]);
                }
                cardList.push(card);
            }
        }
        for(let i=0;i<cardsList.length;++i){
            for(let j=0;j<endthreeList.length;++j){
                var card=cardsList[i].concat();
                for(let k=0;k<endthreeList[j].length;++k){
                    card.push(endthreeList[j][k]);
                }
                cardList.push(card);
            }
        }
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
                cardList.push(fourBoomList[i]);
            }
        }
        return cardList;
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

        if (cardsA === undefined || cardsA.length === 0) {
            let list = [];
            let map = this.getCardListWithStart(0, cardsB);
            for (let i in map) {
                list.push(map[i]);
            }
            return list;
        } else {

            if (cc.vv.ddzNetMgr.turn == cc.vv.ddzNetMgr.seatIndex&&cardsA[0]===0) {
                let cardsValueB = this.getCardsValue(cardsB);
                if (cardsValueB != false) {
                    var tmpList = [];
                    tmpList.push(cardsB);
                    return tmpList;
                }
            }

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
            || this.isPlaneWithTwo(cardList) || this.isContinue(cardList) || this.isFourWithSDDTwo(cardList)
            || this.isFourWithSDTwo(cardList) || this.isFourWithDSTwo(cardList));
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



