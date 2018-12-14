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
        _folds: null,
        _buchu: [],
        _bujiao: [],
        _focusNode: null,
        _focusDt: 0,
        _focusID: 0,
        _peng_gang_chi: false,
        _holdspai: [],
        _foldspai: [],
        _fen: [],
        _ti: [],
        _buti: []
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv == null) {
            return;
        }
        cc.vv.PDKFolds = this;
        this.initView();
        this.initEventHandler();
    },

    start: function () {
        this.initAllFolds();
        if (cc.vv.gameNetMgr.isSync && cc.vv.gameNetMgr.gamestate === "jiaodizhu") {
            this.setJiaoFen();
        }
    },


    initView: function () {
        this._folds = {};

        var peoples = cc.vv.SelectRoom.getRoomPeople();
        switch (peoples) {
            case 3:
                var peopleName = "triple";
                break;
            case 4:
                var peopleName = "quadra";
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

        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(peopleName);

        console.log(sideRoot);

        for (var i = 0; i < sideRoot.children.length; ++i) {
            var folds = [];
            var tmpbuchu = 0;
            var tmpbujiao = 0;
            var tmpfen = 0;
            var tmpti = 0;
            var tmpbuti = 0;
            var fens = [];
            if (i === 0) {
                var paiRoot = game.getChildByName("pai");
                var n = paiRoot.getChildByName("Folds");
                for (let j = 0; j < n.childrenCount; ++j) {
                    var nn = n.children[j];
                    nn.active = false;
                    var sprite = nn.getComponent(cc.Sprite);
                    sprite.spriteFrame = null;
                    folds.push(sprite);
                }
                tmpbuchu = game.getChildByName('buchu');
                tmpbujiao = game.getChildByName('bujiao');
                tmpfen = game.getChildByName('fen');
                tmpti = game.getChildByName('ti');
                tmpbuti = game.getChildByName('buti');
                for (let i = 0; i < tmpfen.childrenCount; ++i) {
                    let nn = tmpfen.children[i];
                    nn.active = false;
                    fens.push(nn);
                }
            } else {
                this._holdspai.push(sideRoot.children[i].children[0].getChildByName('Folds'));
                this._foldspai.push(sideRoot.children[i].children[0].getChildByName('folds'));
            }
            var n = sideRoot.children[i];
            n = n.children[0];
            var tmpfolds = n.getChildByName("Folds");
            var ti = n.getChildByName('ti');
            var buti = n.getChildByName('buti');
            var buchu = n.getChildByName('buchu');
            var bujiao = n.getChildByName('bujiao');
            var fen = n.getChildByName('fen');
            for (let i = 0; i < fen.childrenCount; ++i) {
                let nn = fen.children[i];
                nn.active = false;
                fens.push(nn);
            }
            for (let j = 0; j < tmpfolds.childrenCount; ++j) {
                var nn = tmpfolds.children[j];
                nn.active = false;
                var sprite = nn.getComponent(cc.Sprite);
                sprite.spriteFrame = null;
                folds.push(sprite);
            }


            if (tmpbuchu !== 0) {
                buchu = tmpbuchu;
            }
            if (tmpbujiao !== 0) {
                bujiao = tmpbujiao;
            }
            if (tmpti !== 0) {
                ti = tmpti;
            }
            if (tmpbuti !== 0) {
                buti = tmpbuti;
            }
            this._folds[i] = folds;
            this._buchu[i] = buchu;
            this._bujiao[i] = bujiao;
            this._fen[i] = fens;
            this._ti[i] = ti;
            this._buti[i] = buti;
        }

        console.log(this._buchu);

        this.hideAllFolds();

    },
    hideAllFolds: function () {
        for (let k in this._folds) {
            var fold = this._folds[k];
            for (var i in fold) {
                fold[i].node.active = false;
            }
            this._buchu[k].active = false;
            this._bujiao[k].active = false;
        }

    },
    setTi: function (index, ishow) {
        this._ti[index].active = ishow;
        this._buti[index].active = !ishow;
    },
    hideTi: function (ishow) {
        for (let i = 0; i < this._ti.length; ++i) {
            this._ti[i].active = ishow;
            this._buti[i].active = ishow;
        }
    },
    hideONE_Folds: function (index) {
        var fold = this._folds[index];
        for (var i in fold) {
            fold[i].node.active = false;
        }
        this._buchu[index].active = false;
        this._bujiao[index].active = false;
        // fdd
    },


    hideFoldsByLocalID: function (index) {
        var fold = this._folds[index];
        for (var i in fold) {
            fold[i].node.active = false;
        }

    },

    initEventHandler: function () {
        var self = this;
        this.node.on('game_begin', function (data) {
            self.initAllFolds();
        });

        this.node.on('game_chupai', function (data) {
            var data = data.detail.gamedata;
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.userid);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            if (localIndex === 0 && data.follow === false) {
                self.hideAllFolds();
            } else {
                self.hideONE_Folds(localIndex)
            }
            //self.hideTi(false);

        });

        this.node.on('game_sync', function (data) {

            self.initAllFolds();
        });
        this.node.on('game_ti_notify', function (data) {
            self.hideFen();
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail.userId);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            self.setTi(localindex, true);
            self.hideONE_Folds(localindex)
            var timeAudio = 0.0001;
            // if (cc.vv.PDKReplayMgr.isReplay()) {
            //     timeAudio = 1000;
            // }
            setTimeout(function () {
                // var audioUrl = 'dm_ti.mp3';
                // cc.vv.gameNetMgr.setAudioSFX(seatindex, -1, "poker", audioUrl, "");
                var audioUrl = cc.CGameConfigDataModel.getPKAudioURLByOther('dm_ti', data.userId);
                cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            }, timeAudio)
        });
        this.node.on('game_fanti_notify', function (data) {
            self.hideFen();
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail.userId);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            self.setTi(localindex, true);
            self.hideONE_Folds(localindex)
            var timeAudio = 0.0001;
            // if (cc.vv.PDKReplayMgr.isReplay()) {
            //     timeAudio = 1000;
            // }
            setTimeout(function () {
                // var audioUrl = 'dm_ti.mp3';
                // cc.vv.gameNetMgr.setAudioSFX(seatindex, -1, "poker", audioUrl, "");
                var audioUrl = cc.CGameConfigDataModel.getPKAudioURLByOther('dm_ti', data.userId);
                cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            }, timeAudio)
        });
        this.node.on('game_buti_notify', function (data) {
            self.hideFen();
            console.log('225 game_buti_notify', data.detail);
            var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail.userId);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
            self.setTi(localindex, false);
            self.hideONE_Folds(localindex)
            var timeAudio = 0.0001;
            // if (cc.vv.PDKReplayMgr.isReplay()) {
            //     timeAudio = 1000;
            // }
            setTimeout(function () {
                // var audioUrl = 'dm_buti.mp3';
                // cc.vv.gameNetMgr.setAudioSFX(seatindex, -1, "poker", audioUrl, "");
                var audioUrl = cc.CGameConfigDataModel.getPKAudioURLByOther('dm_ti', data.userId);
                cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            }, timeAudio)
        });
        this.node.on('game_chupai_notify', function (data) {
            if (cc.vv.PDKReplayMgr.isReplay()) {
                console.log("meng replaymgr", data.detail);
                self.hideONE_Folds(cc.vv.gameNetMgr.getLocalIndex(data.detail.index));
                // cc
                self.initFolds(data.detail);
            } else {
                self.initFolds(data.detail.seatData);
            }
        });
        this.node.on('game_bujiao_notify', function (data) {
            var localindex = cc.vv.gameNetMgr.getLocalIndex(data.detail.turn);
            self._bujiao[localindex].active = true;
            self.hideONE_Folds(localindex)
            var timeAudio = 0.0001;
            // if (cc.vv.PDKReplayMgr.isReplay()) {
            //     timeAudio = 1000;
            // }
            setTimeout(function () {
                // var audioUrl = 'bujiabei.mp3';
                // cc.vv.gameNetMgr.setAudioSFX(data.detail.turn, -1, "poker", audioUrl, "");
                var audioUrl = cc.CGameConfigDataModel.getPKAudioURLByOther('bujiabei', data.userId);
                cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            }, timeAudio)
        });
        this.node.on('game_jiaofen_notify', function (data) {
            console.log('254', data.detail);
            var localindex = cc.vv.gameNetMgr.getLocalIndex(data.detail.turn);
            console.log('meng game_jiaofen_notify', self._fen);
            self._fen[localindex][data.detail.fen - 1].active = true;
            self.hideONE_Folds(localindex)
            var timeAudio = 0.0001;
            // if (cc.vv.PDKReplayMgr.isReplay()) {
            //     timeAudio = 1000;
            // }
            setTimeout(function (turn) {
                // var audioUrl = 'jiabei.mp3';
                // cc.vv.gameNetMgr.setAudioSFX(turn, -1, "poker", audioUrl, "");
                var audioUrl = cc.CGameConfigDataModel.getPKAudioURLByOther('jiabei', data.userId);
                cc.vv.audioMgr.playMJGameSFX(audioUrl, true);
            }, timeAudio, data.detail.turn)
        });
        this.node.on('game_dipai', function () {
            self.hideFen();
            setTimeout(function () {
                self.hideTi(false);
            }, 1);
        });
        this.node.on('game_over', function () {
            for (let i = 0; i < self._buchu.length; i++) {
                self._buchu[i].active = false;
            }
            self.initOtherFolds(0);
            self.initOtherFolds(1);
        });
        this.node.on('guo_notify', function (data) {
            console.log('meng guo_notify data=', data);
            if (cc.vv.PDKReplayMgr.isReplay()) {
                self.initFolds(data.detail);
            }
        });
        this.node.on('PKguo_result', function (data) {
            var data = data.detail;
            var userid = data.userId;
            if (cc.vv.PDKReplayMgr.isReplay()) {
                var localIndex = cc.vv.gameNetMgr.getLocalIndex(data.seatIndex);
                self.hideONE_Folds(localIndex);
            } else {
                var seatindex = cc.vv.gameNetMgr.getSeatIndexByID(userid);
                var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
                if (localIndex !== 0) {
                    self.initOtherFolds(localIndex - 1);
                }
            }

            self._buchu[localIndex].active = true;
        });
        this.node.on('chi_notify', function (data) {
            if (!cc.vv.PDKReplayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });

        this.node.on('peng_notify', function (data) {
            if (!cc.vv.PDKReplayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });

        this.node.on('gang_notify', function (data) {
            if (!cc.vv.PDKReplayMgr.isReplay()) {
                var info = data.detail;

                if (info.gangtype == 'diangang') {
                    self._peng_gang_chi = true;
                    self.initAllFolds();
                }
            }

        });

        this.node.on('hupai', function (data) {
            if (!cc.vv.PDKReplayMgr.isReplay()) {
                self.initAllFolds();
            }


        });

        this.node.on('chiting_notify', function (data) {
            if (!cc.vv.PDKReplayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });

        this.node.on('pengting_notify', function (data) {
            if (!cc.vv.PDKReplayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });
    },

    initAllFolds: function () {
        this.hideAllFolds();
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null) {
            return;
        }
        for (var i in seats) {
            if (seats[i].lastAction === 'guo') {
                var localIndex = cc.vv.gameNetMgr.getLocalIndex(i)
                if (!cc.vv.gameNetMgr.isSync) {
                    this._buchu[localIndex].active = true;
                } else {
                    if (parseInt(i) !== cc.vv.gameNetMgr.turn) {
                        this._buchu[localIndex].active = true;
                    }
                }
            } else {
                if (!cc.vv.gameNetMgr.isSync) {
                    this.initFolds(seats[i]);
                } else {
                    if (parseInt(i) !== cc.vv.gameNetMgr.turn) {
                        this.initFolds(seats[i])
                    }
                }
            }

        }

    },

    initFolds: function (seatData) {
        console.log('meng initfolds seatdata', seatData);
        if (cc.vv.PDKReplayMgr.isReplay()) {
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.index);
            var folds = seatData.pai;
        } else {
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
            var folds = seatData.folds;
            if (localIndex !== 0) {
                this._foldspai[localIndex - 1].removeAllChildren();
            }
        }

        this.hideFoldsByLocalID(localIndex);
        if (folds == undefined) {
            return;
        }

        if (folds.length == 0) {
            return;
        }
        if (cc.vv.PDKReplayMgr.isReplay()) {
            folds = folds;
        } else {
            folds = folds[folds.length - 1];

        }


        var folds_length = folds.length;
        for (var i = 0; i < folds_length; ++i) {
            var mjid = folds[i];
            var index = i;
            if (index > 20 && cc.vv.alert) {
                cc.vv.alert.show("数据错误:出牌下标越界，请解散房间！");
                return;
            }
            ;
            if (cc.vv.PDKReplayMgr.isReplay()) {
                var sprite = this._folds[localIndex][i];
                sprite.node.active = true;
                sprite.node.mjId = mjid;
                sprite.node.scaleX = 1;
                sprite.node.scaleY = 1;
                if (localIndex !== 0) {
                    this.centerVertical(sprite, folds_length, this._holdspai[localIndex - 1], i, sprite.node.height * 0.5 * 0.03 * (i + 1));
                }
                this.setSpriteFrameByMJID("default-", sprite, mjid, false);
            } else {
                if (localIndex !== 0) {
                    let holdspk = cc.vv.prefabMgr.getPrefab('prefabs/Games/PKGame/Common/Poker/MyPK');
                    let card = cc.instantiate(holdspk);
                    let sprite = card.getComponent(cc.Sprite);
                    sprite.node.active = true;
                    sprite.node.mjId = mjid;
                    cc.vv.controlMgr.setSpriteFrameByMJID('default-', sprite, mjid, false);
                    card.setScale(0.5, 0.5);
                    card.parent = this._foldspai[localIndex - 1];
                    let cardY = card.y * 0.5;
                    let height = card.width * 0.5;
                    if (this._foldspai[localIndex - 1].childrenCount < 7) {
                        var gap = 2.5;
                    } else {
                        var gap = 4;
                    }
                    var half = (folds_length - this._foldspai[localIndex - 1].childrenCount) * 0.5;
                    if (localIndex === 1) {
                        // card.x= (folds_length - 1) * 0.5 * height*0.3  - height*0.5 * (folds_length - i) + half;
                        card.x = folds_length * 0.5 * height - height * 0.5 * (folds_length - i) - 150;

                    } else {
                        // card.x = (folds_length - 1) * 0.5 * height*0.3  - height *0.5 * (folds_length - i) +half;
                        card.x = folds_length * 0.5 * height - height * 0.5 * (folds_length - i) + half;
                    }
                    if (i >= 6) {
                        if (localIndex === 1) {
                            // card.x=(folds_length - 1) * 0.5 * height*0.3  - height * 0.5 * (folds_length - (i-6)) +  height*0.5*0.6  ;
                            card.x = folds_length * 0.5 * height - height * 0.5 * (folds_length - (i - 6)) - 150;
                        } else {
                            // card.x = (folds_length - 1) * 0.5 * height*0.3 - height * 0.5 * (folds_length - (i-6)) +height*gap;
                            card.x = folds_length * 0.5 * height - height * 0.5 * (folds_length - (i - 6)) + half;
                        }
                        card.y = cardY - card.height * 0.5;
                    }


                }
            }
            if (localIndex === 0) {
                var sprite = this._folds[localIndex][i];
                sprite.node.active = true;
                sprite.node.mjId = mjid;
                sprite.node.scaleX = 1;
                sprite.node.scaleY = 1;
                this.setSpriteFrameByMJID("default-", sprite, mjid, false);
            }

        }
        if (localIndex === 0)
            this.centerFolds(folds_length);
    },
    initOtherFolds: function (index) {
        for (let i = 0; i < this._foldspai[index].childrenCount; i++) {
            this._foldspai[index].children[i].active = false;
        }
    },
    centerVertical: function (sprite, len, holds, index, gap) {
        var height = sprite.node.height * 0.5;
        var starth = (this.node.height - (len - 1) * height * 0.3 - height) * 0.5;
        var posy = holds.convertToNodeSpaceAR(cc.p(0, starth + gap + height * 3 + (index + 1) * height * 0.3));
        // ggg
        sprite.node.y = -posy.y;
    },
    centerFolds: function (hold_len) {
        var pkwidth = cc.find('Canvas/game/pai/Folds').children[0].width * 0.6;
        var startx = (this.node.width - (hold_len - 1) * pkwidth * 0.5 - pkwidth) * 0.5;
        var folds = cc.find('Canvas/game/pai/Folds');
        for (let i = 0; i < hold_len; ++i) {
            var posx = folds.convertToNodeSpaceAR(cc.p(startx + (i + 1) * pkwidth * 0.5, 0));
            folds.children[i].x = posx.x;
        }
    },

    setSpriteFrameByMJID: function (pre, sprite, mjid) {
        cc.vv.controlMgr.setSpriteFrameByMJID(pre, sprite, mjid);
    },

    isTurn: function (seatindex) {
        if (cc.vv.gameNetMgr.turn == seatindex) {
            return true;
        } else {
            return false;
        }
    },
    hideFen: function () {
        for (let i = 0; i < this._fen.length; ++i) {
            this._bujiao[i].active = false;
            for (let j = 0; j < this._fen[i].length; ++j) {
                this._fen[i][j].active = false;
            }
        }
    },
    setJiaoFen: function () {
        var localindex = cc.vv.gameNetMgr.getLocalIndex(cc.vv.gameNetMgr.turn - 1);
        if (cc.vv.gameNetMgr.jiaofen !== 0)
            this._fen[localindex][cc.vv.gameNetMgr.jiaofen - 1].active = true;
    },
    getFoldMJParent: function (folds, lenFold) {
        var parent = folds;
        var gameSeatCount = cc.vv.SelectRoom.getRoomPeople();
        if (gameSeatCount == 3) {
            var tmpSetLen = 12;
            var tmpName = this.getTmpName(lenFold, tmpSetLen);
            parent = folds.getChildByName(tmpName);
        } else if (gameSeatCount == 2) {
            var tmpSetLen = 20;
            var tmpName = this.getTmpName(lenFold, tmpSetLen);
            parent = folds.getChildByName(tmpName);
        }

        return parent;
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
