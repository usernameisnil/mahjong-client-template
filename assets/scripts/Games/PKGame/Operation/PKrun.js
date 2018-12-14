cc.Class({
    extends: cc.Component,

    properties: {
        runNode: null,
        _gu: null,
        _tips: null,
        _selected: [],
        _huaseArr: [],
        runArr: [],
        _you: [],
        _NodeBG: null,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv === null) {
            return;
        }
        this.initView();
        // this.initXuanPao();
        this.initEventHandlers();
    },

    start: function () {

        var seats = cc.vv.gameNetMgr.seats;
        var againLiangData = cc.vv.gameNetMgr.againLiangData;
        if(!cc.vv.gameNetMgr.isSync) {
            console.log('meng this.fen this.mast',cc.vv.gameNetMgr.fen,cc.vv.gameNetMgr.mast);
            if (cc.vv.gameNetMgr.fen || cc.vv.gameNetMgr.mast) {
                var data = {fen: this.fen, mast_dz: this.mast}
                this.setFenBtn(data);
            }
        }

        // for (let i = 0; i < seats.length; i++) {
        //     var seat = seats[i];
        //     var tmpagainLiangdata = againLiangData[i];
        //     if (seat.liangList) {
        //         if (seat.liangList.length !== 0) {
        //             tmpagainLiangdata = tmpagainLiangdata.concat(seat.liangList);
        //
        //
        //             // this.showHuase(seat.userid, tmpagainLiangdata)
        //         }
        //     }
        //
        // }
        //
        // console.log(cc.vv.gameNetMgr.againLiangData);

        // var againLiangData = cc.vv.gameNetMgr.againLiangData;
        // if(againLiangData.length !== 0){

        //     for (let k in againLiangData){
        //         var userid = againLiangData[k].userId;
        //         var pai = againLiangData[k].pai;
        //         if (pai.length !== 0){
        //             this.showHuase(userid,pai)
        //         }

        //     }

        // }

        var seats = cc.vv.gameNetMgr.seats;

        for (let k in seats) {
            var seat = seats[k];
            var huOrder = seat.huOrder;
            if (huOrder > -1) {
                var userid = seat.userid
                // this.oneshowYou(userid, huOrder);
            }

        }
    },
    initView: function () {
        var gameChild = this.node.getChildByName("game");
        this.runNode = gameChild.getChildByName("liang3");
        this._gu = this.runNode.getChildByName('sclect_gu');
        console.log("+++++baihua2001cn+++isLiang+++")
        console.log(cc.vv.gameNetMgr.isLiang)
        if (cc.vv.gameNetMgr.gamestate === 'jiaodizhu')
            this.runNode.active = cc.vv.gameNetMgr.isLiang;

        var isGuShow = false;
        var peoples = cc.vv.SelectRoom.getRoomPeople();
        switch (peoples) {
            case 3:
                var peopleName = "triple";
                // isGuShow = true;
                break;
            case 4:
                var peopleName = "quadra";
                // isGuShow = true;
                break;
            case 5:
                var peopleName = "penda";
                break;
            case 6:
                var peopleName = "hexa";
                break;
            default:
                break;
        }

        console.log(this._gu);
        // this._gu.active = isGuShow;

        var sideRoot = gameChild.getChildByName(peopleName);


        for (var i = 0; i < sideRoot.children.length; ++i) {
            var n = sideRoot.children[i];
            n = n.children[0];
            var paiRoot = n.getChildByName("liang3");
            var youRoot = n.getChildByName('you');

            var tmpYou = []
            for (let k in youRoot.children) {
                tmpYou.push(youRoot.children[k])
                youRoot.children[k].active = false;
            }

            var tmpHuase = [];
            for (var j = 0; j < paiRoot.children.length; j++) {
                var nn = paiRoot.children[j];
                nn.active = false;
                var sprite = nn.getComponent(cc.Sprite);
                tmpHuase.push(sprite)
            }

            this._huaseArr[i] = tmpHuase;
            this._you[i] = tmpYou;

        }


        console.log(this._huaseArr)
        // this.reSet();

        if (cc.vv.gameNetMgr.gamestate == "jiaodizhu" && cc.vv.gameNetMgr.isLiang == true) {
            var seats = cc.vv.gameNetMgr.seats;

            var seat = seats[cc.vv.gameNetMgr.turn];
            if (cc.vv.gameNetMgr.isSync) {
                this.showLiang3(cc.vv.gameNetMgr.jiaofen);
            } else {

                this.showLiang3(seat);
            }

        } else {
            //  this.initLiang3(); //重连
        }


    },

    reSet: function () {
        this.runNode.getChildByName("btn_liang3").getComponent(cc.Button).interactable = true;
        this.runNode.getChildByName("btn_liang3_guo").getComponent(cc.Button).interactable = true;
        this.runNode.getChildByName("btn_liang3_giveup").getComponent(cc.Button).interactable = true;
        this.runArr.splice(0, this.runArr.length);
        this.runArr = [];
        this.runArr.push(this.runNode.getChildByName("btn_liang3"));
        this.runArr.push(this.runNode.getChildByName("btn_liang3_guo"));
        this.runArr.push(this.runNode.getChildByName('btn_liang3_giveup'));
        this.runArr.push(this.runNode.getChildByName('bujiao'));

        for (var j = 0; j < this.runArr.length; ++j) {
            this.runArr[j].active = true;
        }
        console.log(this.runArr)
        this.runArr[0].x = -222
        // this._gu.x = -302;
        // this.runArr[1].x = 0
        // this.runArr[2].active = false;
        // this._NodeBG = this.runNode.getChildByName('fangkaxiaobeijing');
        // this._NodeBG.width = 700;
        // this._tips = this.runNode.getChildByName('info')
        // this._tips.active = true;

        this.hideAllyou();


    },

    showLiang3: function (data) {
        console.log("showLiang3");
        this.runNode.active = true;
        var holds = data.holds;
        var giveupArr = [];
        var isHave3 = 0;
        var peopleNUM = cc.vv.SelectRoom.getRoomPeople();
        this.reSet();
        this.setFenBtn(data);

        // this._gu.getComponent(cc.Toggle).isChecked = false;

        for (let k in holds) {
            var realPai = cc.vv.controlMgr.getPKrealNum(holds[k])
            if (realPai === 3) {
                var huase = cc.vv.controlMgr.getPKspritType(holds[k]) // 0,1,2,3,4,5 黑桃,红桃,草花,方片,小王，大王
                if ((huase === 1 || huase === 3) && peopleNUM !== 3) {

                    giveupArr.push(holds[k])
                }
                isHave3++;
            }
        }

        if (isHave3 === 0) {
            // this.runArr[0].active = false;
            // this._gu.x = this._gu.x + 80;
            // this._NodeBG.width = 500;
            // this._tips.active = false;
        }

        if (giveupArr.length === 2 && peopleNUM !== 3) {
            // this.runArr[2].active = true;
        }


        if (isHave3 !== 0 && giveupArr.length !== 2) {
            // this.runArr[0].x = this.runArr[0].x + 110
            // this.runArr[1].x = this.runArr[1].x + 110
            // this._gu.x = this._gu.x + 80;
            // this._NodeBG.width = 500;
        }


    },
    setFenBtn: function (data) {
        if(cc.vv.gameNetMgr.isSync){
            var fen=data;
        }else{
            var fen=data.fen;
            var mast=data.mast_dz;
        }
        cc.vv.gameNetMgr.fen=fen;
        cc.vv.gameNetMgr.mast=mast;
        if(mast){
            this.runArr[0].getComponent(cc.Button).interactable=false;
            this.runArr[1].getComponent(cc.Button).interactable=false;
            this.runArr[3].getComponent(cc.Button).interactable=false;
        }else {
            for (let i = 0; i < fen; ++i) {
                this.runArr[i].getComponent(cc.Button).interactable = false;
            }
        }
    },
    oneshowYou: function (userID, order) {
        var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(userID);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var OneYou = this._you[localIndex]
        OneYou[order].active = true;
    },

    showHuase: function (userID, pai) {
        var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(userID);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);

        this.hideOneHuase(localIndex);
        var OneHuaSe = this._huaseArr[localIndex];

        for (var i in pai) {
            var PKtype = cc.vv.controlMgr.getPKspritType(pai[i]);
            // OneHuaSe[PKtype].node.active = true;

        }

    },

    hideAllyou: function () {
        for (var k in this._you) {
            var you = this._you[k];
            for (var i in you) {
                you[i].active = false;
            }
        }
    },

    hideAllHuase: function () {
        for (var k in this._huaseArr) {
            var fold = this._huaseArr[k];
            for (var i in fold) {
                fold[i].node.active = false;
            }
        }
    },

    hideOneHuase: function (localIndex) {
        var fold = this._huaseArr[localIndex];
        for (var i in fold) {
            fold[i].node.active = false;
        }
    },

    hideLiang3: function () {

        cc.vv.gameNetMgr.isLiang = false;
        this.runNode.active = false;
    },

    initLiang3: function () {
        var arr = ["buPao", "paoYi", "paoEr", "paoSan", "paoSi"];
        var data = cc.vv.gameNetMgr.seats;
        for (var i = 0; i < data.length; ++i) {
            var pao = data[i].xiapao;
            if (pao == null || pao < 0 || pao >= arr.length) {
                pao = null;
            }
            else {
                pao = arr[pao];
            }

            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            for (var j = 0; j < this.paoArr[localIndex].children.length; j++) {
                this.paoArr[localIndex].children[j].active = false;
            }
            ;

            if (pao) {
                this.paoArr[localIndex].getChildByName(pao).active = true;
            }
        }
    },

    initEventHandlers: function () {
        var self = this;
        this.node.on('game_liang', function (data) {
            console.log('game-liang');
            if (cc.vv.gameNetMgr.gamestate == "jiaodizhu" && cc.vv.gameNetMgr.isLiang == true) {
                // vv
                // self.reSet();
                self.showLiang3(data.detail);
            }
        });

        this.node.on('game_over_reset', function (data) {
            self.hideAllHuase()
            self.hideAllyou();
        });


        this.node.on('game_liang_select', function (data) {

            console.log('game_liang_select');
            console.log(data.detail)
            self._selected = data.detail;
        })

        this.node.on('game_showYou', function (data) {
            var data = data.detail;
            var userId = data.userId;
            var huOrder = data.huOrder;

            // self.oneshowYou(userId, huOrder);
        })

        this.node.on('game_lastliang_notify', function (data) {
            console.log('meng game_lastliang_notify');
            var tmpdata = data.detail
            var userID = tmpdata.userId;
            var pai = tmpdata.pai;

            // self.showHuase(userID, pai)
        });

        this.node.on('game_liang_notify', function (data) {
            console.log('game_liang_notify');
            var tmpdata = data.detail;
            var userID = tmpdata.userId;
            var pai = tmpdata.pai;
            for (var i = 0; i < pai.length; ++i) {
                if (pai[i] === 3) {

                    // cc.vv.PKlogic.isLiangFangkuai3 = true;
                }
            }

            // self.showHuase(userID, pai)

            if (pai.length !== 0) {
                setTimeout(function () {
                    var audioUrl = 'nv/liang3.mp3';
                    cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
                }, 300)

            } else {
                setTimeout(function () {
                    var audioUrl = 'nv/b_pass4.mp3';
                    cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
                }, 0.003)

            }


        });


    },

    onGiveupBtnClicked: function (event) {
        cc.vv.net.send('giveup');
        this.hideLiang3();
    },
    onXuanPaoClicked: function (event) {
        var guZhi = 0;
        // if(this._gu.getComponent(cc.Toggle).isChecked){
        //     guZhi = 1;
        // }
        // if (event.target.name == "btn_liang3_guo") {
        //
        //     var tmp_obj={
        //       gu:guZhi,
        //       pai:null
        //     }
        //
        //     cc.vv.net.send("liang", tmp_obj);
        //
        // } else {
        //     var selected = this._selected;
        //     var tmpSelectedID = []
        //     for (var i in selected) {
        //         if (cc.vv.controlMgr.getPKrealNum(selected[i].mjId) !== 3) {
        //             cc.vv.alert.show("选择的扑克不为3，请重新选择！");
        //             cc.vv.gameNetMgr.dispatchEvent('game_liang_selectOver');
        //             return;
        //         }
        //         tmpSelectedID.push(selected[i].mjId)
        //     }
        //
        //      console.log(selected);
        //
        //     if (selected.length === 0) {
        //         cc.vv.alert.show("请选择要亮的牌！");
        //         cc.vv.gameNetMg.dispatchEvent('game_liang_selectOver');
        //         return;r
        //     }
        //     var tmp_obj={
        //         gu:guZhi,
        //         pai:tmpSelectedID
        //       }
        //     cc.vv.net.send("liang", tmp_obj);
        //
        //
        // }
        if (event.target.name === "bujiao") {
            cc.vv.net.send('bujiao');
        } else {
            if (event.target.name === "btn_liang3") {
                var tmp = 1;
            } else if (event.target.name === 'btn_liang3_guo') {
                var tmp = 2;
            } else if (event.target.name === 'btn_liang3_giveup') {
                var tmp = 3;
            }
            cc.vv.net.send("jiaofen", tmp);
        }
        //

        this.hideLiang3();
    },
});
