
cc.Class({
    extends: cc.Component,

    properties: {
        _roomPeople: null,
        _roomType: null,
        _gameName: null,

    },

    init: function () {
        this._roomPeople = 0;
        this._roomType = 0;
        console.log("SelectRoom.js+++++++++++++++++")


    },

    setRoomType: function (n) {
        var tmpn = n

        if (typeof (n) == 'string') {
            tmpn = parseInt(n)
        }

        this._roomType = tmpn;
    },

    getRoomType: function (n) {
        return this._roomType;
    },

    setRoomPeople: function (n) {
        this._roomPeople = n;

    },

    getRoomPeople: function () {
        return this._roomPeople;
    },

    setGameName: function (name) {
        this._gameName = name;
    },

    getGameName: function () {
        return this._gameName;
    },

    //设定选择的最初选择
    setSelectLanguage:function () {

        var gameName = this._gameName;

        var localLanguage = cc.sys.localStorage.getItem('localLanguage/'+ gameName);

        var CardAudioObj = cc.CGameConfigDataModel.getCardAudio();

        var languageKeys = CardAudioObj.languageKeys;

        if(  languageKeys.indexOf(localLanguage) > -1){
            cc.vv.audioMgr.setLanguageName(localLanguage);
        }else {

            var tmpDefault = CardAudioObj.languageKeys[CardAudioObj.defaultLanguageIndex]

            cc.sys.localStorage.setItem('localLanguage/'+ gameName, tmpDefault);
            cc.vv.audioMgr.setLanguageName(tmpDefault);
        }
        
    },

    setScence: function () { //add baihua2001cn cfg

        var self = this;

        if (cc.vv.replayMgr.isReplay() == true || cc.vv.PKReplayMgr.isReplay() == true || cc.vv.PDKReplayMgr.isReplay() == true) {
            console.log('baihua2001cn3 endSocket');


            cc.vv.gameNetMgr.clearHandlers();

            cc.vv.net_hall.endSocket();
            cc.vv.net.endSocket();
            cc.vv.net_hall.isPinging = false;
            cc.vv.net.isPinging = false;
        }

        var roomPeople = this._roomPeople;
        var roomType = this._roomType;
        var gameName = this._gameName;

        console.log('baihua2001cn3 setScence', roomPeople, roomType, gameName);




        if (roomPeople !== null) {
            if (gameName == 'ddz') {
                cc.vv.PKlogic.nseat = self._roomPeople;
            } else if (gameName == 'pdk') {
                cc.vv.PKlogic.nseat = self._roomPeople;
            }

            cc.CGameConfigDataModel.LoadFireFromGame(gameName, roomPeople);

            this.setSelectLanguage();
            // if (gameName == 'ddz') {

            //     console.log('baihua2001cn3 ddz');

            //     cc.director.loadScene("pkgame");
            //     cc.vv.PKlogic.nseat = self._roomPeople;


            // } else if (gameName == 'pdk') {

            //     console.log('baihua2001cn3 pdk');


            //     cc.director.loadScene("pdkgame");
            //     cc.vv.PKlogic.nseat = self._roomPeople;


            // } else if (gameName == 'zhuolu') {
            //     if (roomPeople === 2) {
            //         console.log('baihua2001cn3 zhuolu 2');


            //         cc.director.loadScene("mjgame_2ren");



            //     } else if (roomPeople === 3) {
            //         console.log('baihua2001cn3 zhuolu 3');


            //         cc.director.loadScene("mjgame_3ren");


            //     } else if (roomPeople === 4) {
            //         console.log('baihua2001cn3 zhuolu 4');


            //         cc.director.loadScene("mjgame");


            //     }

            // } else if (gameName == 'huaian') {
            //     if (roomPeople === 2) {
            //         console.log('baihua2001cn3 huaian 2');


            //         cc.director.loadScene("huaianmjgame_2ren");



            //     } else if (roomPeople === 3) {
            //         console.log('baihua2001cn3 huaian 3');


            //         cc.director.loadScene("huaianmjgame_3ren");


            //     } else if (roomPeople === 4) {
            //         console.log('baihua2001cn3 huaian 4');


            //         cc.director.loadScene("huaianmjgame");


            //     }
            // } else if (gameName == 'tuidaohu' || gameName == 'shanxi') {
            //     if (roomPeople === 2) {
            //         console.log('baihua2001cn3 tuidaohu 2');


            //         cc.director.loadScene("mjgame_2ren");



            //     } else if (roomPeople === 3) {
            //         console.log('baihua2001cn3 tuidaohu 3');


            //         cc.director.loadScene("mjgame_3ren");


            //     } else if (roomPeople === 4) {
            //         console.log('baihua2001cn3 tuidaohu 4');


            //         cc.director.loadScene("mjgame");


            //     }
            // } else if (gameName == 'taikang') {
            //     if (roomPeople === 2) {


            //         cc.director.loadScene("mjgame_2ren");



            //     } else if (roomPeople === 3) {


            //         cc.director.loadScene("mjgame_3ren");


            //     } else if (roomPeople === 4) {


            //         cc.director.loadScene("mjgame");


            //     }

            // } else if (gameName == 'erwuba') {
            //     if (roomPeople === 2) {
            //         console.log('baihua2001cn3 huaian 2');


            //         cc.director.loadScene("huaianmjgame_2ren");



            //     } else if (roomPeople === 3) {
            //         console.log('baihua2001cn3 huaian 3');


            //         cc.director.loadScene("huaianmjgame_3ren");


            //     } else if (roomPeople === 4) {
            //         console.log('baihua2001cn3 huaian 4');


            //         cc.director.loadScene("huaianmjgame");


            //     }
            // }

        }


    },

    getLocalIndex: function (index) {  //add baihua2001cn cfg


        var getNumOfPeople = function () {
            if (cc.vv.replayMgr.isReplay() == true || cc.vv.PKReplayMgr.isReplay() == true || cc.vv.PDKReplayMgr.isReplay() == true) {
                var count = cc.vv.gameNetMgr.seats.length;
            } else {
                var count = 4;
                if (cc.vv.gameNetMgr.conf.nSeats && cc.vv.gameNetMgr.conf.nSeats > 0) {
                    count = cc.vv.gameNetMgr.conf.nSeats;
                }

            }
            return count;
        };

        var PKgetLocalIndex = function (index) {
            var ret = 0;
            var count = getNumOfPeople();
            var ret = (index - cc.vv.gameNetMgr.seatIndex + count) % count;
            return ret;
        }

        if (this._gameName === 'ddz' || this._gameName === 'pdk') {
            ret = PKgetLocalIndex(index)
        } else {
            var count = getNumOfPeople();
            var ret = (index - cc.vv.gameNetMgr.seatIndex + count) % count;
            if (count == 2 && ret == 1) {
                ret++;
            } else if (count == 3 && ret == 2) {
                ret++;
            }
        }

        return ret;
    },


    initFolds: function (that) {
        console.log("+++++++++++++++++++initFolds+++++++++++++++");

        console.log(that);
        console.log(Folds)
        var roomPeople = this._roomPeople;
        if (roomPeople !== null) {
            if (roomPeople === 2) {
                Folds.initView_two();
            } else if (roomPeople === 3) {

            } else if (roomPeople === 4) {
                Folds.initView();
            }
        }

    },

    clearGameNet: function () {
        if (cc.vv.gameNetMgr != "" && (cc.vv.gameNetMgr.seats != null || cc.vv.gameNetMgr.seats != undefined)) {
            cc.vv.gameNetMgr.seats = null;
        }
        cc.vv.net.endInterval();
        cc.vv.net.endSocket();
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
