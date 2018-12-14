cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        roomId:null,
        maxNumOfGames:0,
        numOfGames:0,
        numOfMJ:0,
        seatIndex:-1,
        seats:null,
        turn:-1,
        button:-1,
        dingque:-1,
        chupai:-1,
        isDingQueing:false,
        isHuanSanZhang:false,
        gamestate:"",
        isOver:false,
        dissoveData:null,
        curaction:null,
        isShowPao:false,
        isSync: false,
        projectState:"",
        _gameOverDelayTime: 1,
        _bright_secret_round: 1,

        chupai_PK:[],
        isLiang:false,
        liangIndex:-1,
        againLiangData:[],

      
    },

    init: function () {

        this.mahjongPlayArray = ["chi", "peng", "gang", "hu", "ting", "ming", "tui"];

        this.turnIndexList = [];
        //for(var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); ++i){
        for (var i = 0; i < 4; ++i) {
            this.turnIndexList[i] = {
                "angang": [],
                "diangang": [],
                "wangang": [],
                "peng": []
            }
        };
        this._gameOverDelayTime = 1;
        this.projectState = "showState";

        this.showHunMahjongArray = [];
    },
    
   

    reset:function(){
        this.chupai_PK = [],
        this.againLiangData = [];
        
        this.turn = -1;
        this.chupai = -1,
        this.dingque = -1;
        this.button = -1;
        this.gamestate = "";
        this.dingque = -1;
        this.isDingQueing = false;
        this.isHuanSanZhang = false;
        this.isShowPao = false;
        this.curaction = null;
        this.isSync = false;
        this.clearturnIndexList();
        this.dissoveData = null;
        this._gameOverDelayTime = 1;
        this._bright_secret_round = 1;

        this.removeHunArray();

        if (this.seats == null) {
            return;
        }
        if (this.seats instanceof Array) 
        {
            for(var i = 0; i < this.seats.length; ++i){
                this.seats[i].holds = [];//手牌
                this.seats[i].folds = [];//已出的牌
                this.seats[i].chis = [];//吃牌
                this.seats[i].pengs = [];//碰牌
                this.seats[i].angangs = [];//暗杠牌
                this.seats[i].diangangs = [];//点杠牌
                this.seats[i].wangangs = [];//弯杠牌
                this.seats[i].bright = [];//亮起的手牌
                this.seats[i].secret = [];//暗扣的牌
                this.seats[i].operation = [];//操作的手牌
                this.seats[i].dingque = -1;
                this.seats[i].ready = false;
                this.seats[i].hued = false;
                this.seats[i].huanpais = null;
                this.huanpaimethod = -1;

                this.seats[i].canting = (this.seats[i].canting == null)?null:false;
                this.seats[i].isting = (this.seats[i].isting == null)?null:false;
                this.seats[i].isming = (this.seats[i].isming == null)?null:false;
                this.seats[i].seatHuPaiTips = (this.seats[i].seatHuPaiTips == null)?null:[];
                this.seats[i].Tingobj = (this.seats[i].Tingobj == null)?null:[];

                this.seats[i].buhua = (this.seats[i].buhua == null)?null:[];
                this.seats[i].beardCardsList = (this.seats[i].beardCardsList == null)?null:[];

                this.seats[i].runSelectNum = -1;
                this.seats[i].tmp_runSelect_pai = (this.seats[i].tmp_runSelect_pai == null)?null:[];
            }
        }
    },

    clearturnIndexList: function () {
        
        if (this.turnIndexList != null && this.turnIndexList != undefined) {
            for (var i = 0; i < this.turnIndexList.length; i++) {
                var seatTurnIndexList = this.turnIndexList[i];
                for (var key in seatTurnIndexList) {
                    var peng_list_length = seatTurnIndexList[key].length;
                    seatTurnIndexList[key].splice(0, peng_list_length);
                    seatTurnIndexList[key] = [];
                }
            };
        }         
        
        // for (var i = 0; i < this.turnIndexList.length; i++) {
        //     var seatTurnIndexList = this.turnIndexList[i];
        //     for (var key in seatTurnIndexList) {
        //         var peng_list_length = seatTurnIndexList[key].length;
        //         seatTurnIndexList[key].splice(0, peng_list_length);
        //         seatTurnIndexList[key] = [];
        //     }
        // };
        
    },
    
    clear:function(){
        this.dataEventHandler = null;
        if(this.isOver == null){
            this.seats = null;
            this.roomId = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;       
        }
    },

    setSeatOnline: function (online) {
        // var seat = this.getSeatByID(cc.vv.userMgr.userId);
        var seat = this.getSeatByID(this.getMySeatUserId());
        if (seat == null) {
            return;
        }
        var index = this.getLocalIndex(seat.seatindex);
        seat.online = online;
    },
    
    dispatchEvent:function(event,data){
            
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    getSeatIndexByID:function(userId){
        if (this.seats == null) {
            return -1;
        }
        for(var i = 0; i < this.seats.length; ++i){
            var seat = this.seats[i];
            if(seat.userid == userId){
                return i;
            }
        }
        return -1;
    },
    
    isOwner:function(){
        return this.seatIndex == 0;   
    },
    
    getSeatByID:function(userId){
        var seatIndex = this.getSeatIndexByID(userId);
        if (this.seats == null || seatIndex == -1) {
            return null;
        }
        var seat = this.seats[seatIndex];
        return seat;
    },
    
    getSelfData:function(){
        return this.seats[this.seatIndex];
    },
    
    getLocalIndex:function(index){
        var ret = cc.vv.SelectRoom.getLocalIndex(index);
        return ret;
    },
    
    prepareReplay:function(roomInfo,detailOfGame){
        this.roomId = roomInfo.id;
        this.seats = roomInfo.seats;
        this.opType = detailOfGame.base_info.conf.opType;
        cc.vv.SelectRoom.setRoomType(this.opType);//设置房间类型，判断是否为扑克
        cc.vv.SelectRoom.setRoomPeople(this.seats.length);

        this.turn = detailOfGame.base_info.button;

        var baseInfo = detailOfGame.base_info;
        if (detailOfGame.base_info.conf == null) {
            cc.vv.SelectRoom.setRoomPeople(this.seats.length);

            this.conf = {
                type:baseInfo.type,
            }
        }else {
            this.conf = detailOfGame.base_info.conf;
        }

        this.addAllHunPai(detailOfGame.base_info.hunpai);

        
        for(var i = 0; i < this.seats.length; ++i){
            var seatData = this.seats[i];
            seatData.seatindex = i;
            seatData.score = null;
            seatData.holds = baseInfo.game_seats[i];
            seatData.chis = [];
            seatData.pengs = [];
            seatData.angangs = [];
            seatData.diangangs = [];
            seatData.wangangs = [];
            seatData.folds = [];
            seatData.bright = [];//亮起的手牌
            seatData.secret = [];//暗扣的牌
            seatData.operation = [];//操作的手牌
           // console.log(seatData);
            // if(cc.vv.userMgr.userId == seatData.userid){
            if(this.getMySeatUserId() == seatData.userid){
                this.seatIndex = i;
            }
        }
        // this.conf = {
        //     type:baseInfo.type,
        // }

        if(this.conf.type == null){
            this.conf.type == cc.vv.gameName;
        }

        var turnListString = detailOfGame.point;
        if (turnListString != "") {
            var turnListObj = JSON.parse(turnListString);
            this.setTurnIndexList(turnListObj);
        }
    },

    setTurnIndexList: function (data) {
        this.clearturnIndexList();
        for (var i = 0; i < data.gang_point.length; i++) {
            var index = data.gang_point[i].seatindex;

            var indexInfo = {
                pai: data.gang_point[i].pai,
                turnindex: data.gang_point[i].turnindex
            };
            var gangtype = data.gang_point[i].gangtype;
            if (gangtype == "angang") {
                this.turnIndexList[index]["angang"].push(indexInfo);
            }else if (gangtype == "diangang"){
                this.turnIndexList[index]["diangang"].push(indexInfo);
            }else if (gangtype == "wangang") {
                this.turnIndexList[index]["wangang"].push(indexInfo);
            }
        };
        for (var i = 0; i < data.peng_point.length; i++) {
            var index = data.peng_point[i].seatindex;

            var isWangang = false;
            var wangang_length = this.turnIndexList[index]["wangang"].length;
            for (var j = 0; j < wangang_length; j++) {
                if (this.turnIndexList[index]["wangang"][j].pai == data.peng_point[i].pai) {
                    this.turnIndexList[index]["wangang"][j].turnindex = data.peng_point[i].turnindex;
                    isWangang = true;
                    break;
                }
            };

            if (isWangang == false) {
                var indexInfo = {
                    pai: data.peng_point[i].pai,
                    turnindex: data.peng_point[i].turnindex
                };
                this.turnIndexList[index]["peng"].push(indexInfo);
            }
        };
    },

    syncFolds: function () {
        //出牌fold
        if (this.chupai >= 0 && this.turn >= 0) {
            var foldSeat = this.seats[this.turn];
            if (foldSeat && foldSeat.folds) {
                foldSeat.folds.push(this.chupai);
            }
        }
    },

   

    initSeatsinfo: function () {
        if (this.seats == null) {
            return;
        };
        for(var i = 0; i < this.seats.length; ++i){
            var seat = this.seats[i];

            if(seat.holds == null){
                seat.holds = [];
            }
            if(seat.folds == null){
                seat.folds = [];
            }
            if(seat.chis == null){
                seat.chis = [];
            }
            if(seat.pengs == null){
                seat.pengs = [];
            }
            if(seat.angangs == null){
                seat.angangs = [];
            }
            if(seat.diangangs == null){
                seat.diangangs = [];
            }
            if(seat.wangangs == null){
                seat.wangangs = [];
            }
            if(seat.bright == null){
                //亮起的牌
                seat.bright = [];
            }
            if(seat.secret == null){
                //暗扣的牌
                seat.secret = [];
            }
            if(seat.operation == null){
                //操作的牌
                seat.operation = [];
            }
            seat.ready = false;
        }
    },

    PKinitSeatsinfo: function () {
        if (this.seats == null) {
            return;
        };
        for(var i = 0; i < this.seats.length; ++i){
            var seat = this.seats[i];

            if(seat.holds == null){
                seat.holds = [];
            }
            if(seat.folds == null){
                seat.folds = [];
            }
            if(seat.chis == null){
                seat.chis = [];
            }
            if(seat.pengs == null){
                seat.pengs = [];
            }
            if(seat.angangs == null){
                seat.angangs = [];
            }
            if(seat.diangangs == null){
                seat.diangangs = [];
            }
            if(seat.wangangs == null){
                seat.wangangs = [];
            }
            if(seat.bright == null){
                //亮起的牌
                seat.bright = [];
            }
            if(seat.secret == null){
                //暗扣的牌
                seat.secret = [];
            }
            if(seat.operation == null){
                //操作的牌
                seat.operation = [];
            }
            //seat.ready = false;
        }
    },
    

    getWanfa:function name(passConf) {
        var conf = this.conf;
        if(passConf !=null && passConf.maxGames != null){
            
            if(passConf == undefined){
                return '';
            }
            
            conf = passConf;
        }
    
        cc.log("game wanfa = ", conf);
    
        if (conf && conf.maxGames!=null) {
    
           return cc.CGameConfigDataModel.getWanfa(conf);
           
        }
        return "";
        
    },
  

    
    // getWanfa:function(passConf){
    //     var conf = this.conf;
    //     if(passConf !=null && passConf.maxGames != null){
    //         conf = passConf;
    //     }

    //     if(typeof(conf.opType) === 'string' ){
    //         conf.opType = parseInt(conf.opType)
    //     }

    //     cc.log("game wanfa = ", conf);

    //     if (conf && conf.maxGames!=null) {
    //         var strArr = [];

    //         if (conf.nSeats && conf.nSeats > 0) {
    //             strArr.push(conf.nSeats + "人")
    //         }
                

    //         if (conf.opType == 1) {
    //             strArr.push("凉城玩法");
    //         }else if (conf.opType == 2) {
    //             strArr.push("保定玩法");
    //         }else if(conf.opType ==3){
    //             strArr.push("硬三嘴")
    //         }else if(conf.opType===4){
    //             if(conf.issj){
    //                 strArr.push('推到胡');
    //             }else{
    //                 strArr.push('国耀麻将');
    //             }
    //         }else if(conf.opType==10){
    //             strArr.push('斗地主');
    //         }

    //         strArr.push(conf.maxGames + "局");
    //         if(conf.opType!==4) {


    //             switch (conf.reset_count) {
    //                 case 1:
    //                     strArr.push("一局选漂");
    //                     break;
    //                 case 4:
    //                     strArr.push("四局选漂");
    //                     break;
    //             }
    //         }

    //         if (conf.opType == 1) {

    //             if (conf.daifeng) {
    //                 strArr.push("带风");
    //             }

    //             switch (conf.hunCount) {
    //                 case 1:
    //                     strArr.push("单混(下)");
    //                     break;
    //                 case 2:
    //                     strArr.push("2混(上下)");
    //                     break;
    //                 case 3:
    //                     strArr.push("3混(上中下)");
    //                     break;
    //             }
                
    //         }else if (conf.opType == 2) {

    //             if (conf.dianpaopei) {
    //                 strArr.push("大包");
    //             }

    //             switch (conf.fengding) {
    //                 case 1:
    //                     strArr.push("32封顶");
    //                     break;
    //                 case 2:
    //                     strArr.push("64封顶");
    //                     break;
    //                 case 3:
    //                     strArr.push("不限");
    //                     break;
    //             }

    //         }else if(conf.opType == 3){
    //             if(conf.zha){
    //                 strArr.push('炸翻倍')
    //             }
    //         }else if(conf.opType==4){
    //             if(conf.dpb3j){
    //                 strArr.push('点炮包三家');
    //             }
    //             if(conf.paoType){
    //                 strArr.push('带飘');
    //             }
    //             if(conf.daifeng){
    //                 strArr.push('带风');
    //             }
    //             if(conf.daihun){
    //                 strArr.push('带混');
    //             }
    //             if(!conf.pinghu && !conf.issj){
    //                 strArr.push('大胡');
    //             }
    //             if(conf.fanpai && conf.fanpai === 2){
    //                 strArr.push('抓二鸟');
    //             }else if(conf.fanpai && conf.fanpai === 4){
    //                 strArr.push('抓四鸟');
    //             }else if(conf.fanpai && conf.fanpai === 6){
    //                 strArr.push('抓六鸟');
    //             }else if(!conf.issj)
    //             strArr.push('不抓鸟');
    //         }else if(conf.opType == 10){
    //             if(conf.daiti){
    //                 strArr.push('带踢');
    //             }
    //         }


    //         if (conf.fangzuobi) {
    //             strArr.push("开启GPS");
    //         }

    //         return strArr.join(" ");
    //     }
    //     return "";
    // },

    getMahjongType:function(id){
        if(id >= 0 && id < 9){
            //筒牌
            return 0;
        }else if (id >= 9 && id < 18) {
            //条牌
            return 1;
        }else if (id >= 18 && id < 27) {
            //万牌
            return 2;
        }else if (id >= 27 && id < 34) {
            //字牌
            return 3;
        }else if (id >= 34 && id < 42) {
            //花牌
            return 4;
        }
    },

    addAllHunPai: function (passId) {
        if (passId < 0) {
            return;
        }

        this.removeHunArray();

        var up_hun = -1, middle_hun = -1, lower_hun = -1;
        var word_type_count = 7;
        var word_min_index = 27;
        var word_max_index = word_min_index + word_type_count - 1;

        up_hun = passId-1;
        middle_hun = passId;
        lower_hun = passId+1;

        var pass_mahjong_type = this.getMahjongType(passId);
        switch (pass_mahjong_type) {
            case 0:
            case 1:
            case 2:
                var min_index = 9 * pass_mahjong_type;
                var max_index = 9 * (pass_mahjong_type + 1) - 1;
                if (passId == min_index) {
                    up_hun = max_index;
                }else if (passId == max_index) {
                    lower_hun = min_index;
                }
                break;
            case 3:
                if (passId == word_min_index) {
                    up_hun = word_max_index;
                }else if (passId == word_max_index) {
                    lower_hun = word_min_index;
                }
                break;
        }

        if (this.conf.opType === 4) {
            var hun_rule = 1;
        } else {

            var hun_rule = this.conf.hunCount;
        }
        switch (hun_rule) {
            case 1:
            if (this.conf.opType === 4) {
                this.showHunMahjongArray.push(passId);
            } else {

                this.showHunMahjongArray.push(lower_hun);
            }
                break;
            case 2:
                this.showHunMahjongArray.push(up_hun);
                this.showHunMahjongArray.push(lower_hun);
                break;
            case 3:
                this.showHunMahjongArray.push(up_hun);
                this.showHunMahjongArray.push(middle_hun);
                this.showHunMahjongArray.push(lower_hun);
                break;
        }
    },

    removeHunArray: function () {
      
        if (this.showHunMahjongArray != null && this.showHunMahjongArray != undefined) {
            var hun_count = this.showHunMahjongArray.length;
            if (hun_count > 0) {
                this.showHunMahjongArray.splice(0, hun_count);
            }

        }    
        this.showHunMahjongArray = [];
    },

    getHoldEqualHunValue: function (nahjongId) {
        var isEqual = false;
        for (var i = 0; i < this.showHunMahjongArray.length; i++) {
            if (nahjongId == this.showHunMahjongArray[i]) {
                isEqual = true;
                break;
            }
        };

        return isEqual;
    },

  
    clearHandlers:function(){
        cc.vv.net.deleteHandlers('login_result');
        cc.vv.net.deleteHandlers('login_finished');
        cc.vv.net.deleteHandlers('exit_result');
        cc.vv.net.deleteHandlers('exit_notify_push');
        cc.vv.net.deleteHandlers('dispress_push');
        cc.vv.net.deleteHandlers('disconnect');
        cc.vv.net.deleteHandlers('new_user_comes_push');
        cc.vv.net.deleteHandlers('user_state_push');
        cc.vv.net.deleteHandlers('user_ready_push');
        cc.vv.net.deleteHandlers('get_xiapao_notify_push');
        cc.vv.net.deleteHandlers('game_holds_push');
        cc.vv.net.deleteHandlers('game_bright_push');
        cc.vv.net.deleteHandlers('game_begin_push');
        cc.vv.net.deleteHandlers('game_playing_push');
        cc.vv.net.deleteHandlers('game_sync_push');
        cc.vv.net.deleteHandlers('game_hunpai_push');
        cc.vv.net.deleteHandlers('game_dingque_push');
        cc.vv.net.deleteHandlers('game_xiapao_push');
        cc.vv.net.deleteHandlers('game_huanpai_push');
        cc.vv.net.deleteHandlers('hangang_notify_push');
        cc.vv.net.deleteHandlers('game_ting_push');
        cc.vv.net.deleteHandlers('ting_notify_push');
        cc.vv.net.deleteHandlers('ming_notify_push');
        cc.vv.net.deleteHandlers('tuidao_notify_push');
        cc.vv.net.deleteHandlers('game_action_push');
        cc.vv.net.deleteHandlers('action_wait_push');
        cc.vv.net.deleteHandlers('game_chupai_push');
        cc.vv.net.deleteHandlers('game_num_push');
        //cc.vv.net.deleteHandlers('game_ju_push');
        cc.vv.net.deleteHandlers('game_over_push');
        cc.vv.net.deleteHandlers('mj_count_push');
        cc.vv.net.deleteHandlers('hu_push');
        cc.vv.net.deleteHandlers('fanpai_push');
        cc.vv.net.deleteHandlers('game_chupai_notify_push');
        cc.vv.net.deleteHandlers('game_mopai_push');
        cc.vv.net.deleteHandlers('guo_notify_push');
        cc.vv.net.deleteHandlers('guo_result');
        cc.vv.net.deleteHandlers('guohu_push');
        cc.vv.net.deleteHandlers('huanpai_notify');
        cc.vv.net.deleteHandlers('game_huanpai_over_push');
        cc.vv.net.deleteHandlers('chi_notify_push');
        cc.vv.net.deleteHandlers('peng_notify_push');
        cc.vv.net.deleteHandlers('gang_notify_push');
        cc.vv.net.deleteHandlers('game_dingque_notify_push');
        cc.vv.net.deleteHandlers('game_xiapao_notify_push');
        cc.vv.net.deleteHandlers('game_dingque_finish_push');
        cc.vv.net.deleteHandlers('game_xiapao_finish_push');
        //cc.vv.net.deleteHandlers('huangzhuang_push');
        //cc.vv.net.deleteHandlers('game_hu_over_push');
        cc.vv.net.deleteHandlers('game_runSelect_notify_push');
        cc.vv.net.deleteHandlers('game_bright_secret_push');
        cc.vv.net.deleteHandlers('robot_ready_push');
        cc.vv.net.deleteHandlers('buhua_notify_push');
        cc.vv.net.deleteHandlers('voice_msg_push');
        cc.vv.net.deleteHandlers('dissolve_cancel_push');
        cc.vv.net.deleteHandlers('dissolve_notice_push');
        cc.vv.net.deleteHandlers('emoji_push');
        cc.vv.net.deleteHandlers('quick_chat_push');
        cc.vv.net.deleteHandlers('chat_push');
    },

    
    initHandlers:function(){
        var self = this;
        cc.vv.global._space = 'game';
        cc.vv.net.addHandler("login_result",function(data){
            console.log("login_result");
           // console.log(data);

            self.reset();
            if(data.errcode === 0){
                var data = data.data;
                self.roomId = data.roomid;
                self.conf = data.conf;
                if (data.conf != undefined) {
                    self.maxNumOfGames = data.conf.maxGames;
                }else {
                    var errorResultString = "login_result 传递的data.conf==null!";
                    cc.vv.net.send("client_error_msg", errorResultString);
                }
                
                self.numOfGames = data.numofgames;
                self.seats = data.seats;
                self.clearInitSeat();
                // self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
                self.seatIndex = self.getSeatIndexByID(self.getMySeatUserId());
                self.isOver = false;
            }
            else{
                console.log(data.errmsg);   
            }

            cc.vv.SelectRoom.setRoomType(data.conf.opType)
            cc.vv.SelectRoom.setGameName(data.conf.game);
            if (data.conf.nSeats && data.conf.nSeats > 0) {
                //console.log("mengdong seats",data.conf.nSeats);
                cc.vv.SelectRoom.setRoomPeople(data.conf.nSeats);//设置房间的人数
            }else {
                cc.vv.SelectRoom.setRoomPeople(4);//设置房间的人数
            }
            
        });
                
        cc.vv.net.addHandler("login_finished",function(data){
            console.log("login_finished");
           // console.log(data);

            //cc.director.loadScene("mjgame");
            cc.vv.SelectRoom.setScence();
        });

        cc.vv.net.addHandler("exit_result",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.isShowPao = false;
            self.removeHunArray();
            self._bright_secret_round = 1;
            self.seats = null;
            self.curaction = null;

            cc.vv.gameNetMgr.isOver = true;
            cc.vv.net.endInterval();
            cc.vv.global._space = 'hall';   
        });
        
        cc.vv.net.addHandler("exit_notify_push",function(data){
           var userId = data;
           var s = self.getSeatByID(userId);
           if(s != null){
               s.userid = 0;
               s.name = "";
               self.dispatchEvent("user_state_changed",s);
           }
        });
        
        cc.vv.net.addHandler("dispress_push",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.isShowPao = false;
            self.removeHunArray();
            self._bright_secret_round = 1;
            self.seats = null;
            self.curaction = null;

            cc.vv.gameNetMgr.isOver = true;
            cc.vv.net.endInterval();
            cc.vv.global._space = 'hall';     

        });
                
        // cc.vv.net.addHandler("disconnect",function(data){
        //     if(self.roomId == null){
        //         cc.vv.userMgr.oldRoomId = null;
        //         cc.director.loadScene("hall");
        //     }
        //     else{
        //         if(self.isOver == false){
        //             cc.vv.userMgr.oldRoomId = self.roomId;
        //             self.dispatchEvent("disconnect");                    
        //         }
        //         else{
        //             self.roomId = null;
        //             cc.vv.userMgr.oldRoomId = null;
        //         }
        //     }
        // });

        cc.vv.net.addHandler("disconnect", function (data) {

            cc.vv.gameNetMgr.clearHandlers();
            cc.vv.net.endSocket();
            cc.vv.net.endInterval();
            if (self.roomId == null) {
                cc.vv.userMgr.oldRoomId = null;

                // setTimeout(() => {
                //     cc.vv.net.isPinging = false;
                //     cc.vv.hallgameNetMgr.createHallSocket()
                //     cc.director.loadScene("hall")
                // }, 500);
                cc.director.loadScene("hall")

            }
            self.dispatchEvent("disconnect");
        })
        
        cc.vv.net.addHandler("new_user_comes_push",function(data){
            console.log("new_user_comes_push");
           // console.log(data);

            var seatIndex = data.seatindex;
            if(self.seats[seatIndex].userid > 0 && self.seats[seatIndex].ip != null){
                self.seats[seatIndex].online = true;
            }
            else{
                data.online = true;
                self.seats[seatIndex] = data;
            }
            self.dispatchEvent('new_user',self.seats[seatIndex]);
        });
        
        cc.vv.net.addHandler("user_state_push",function(data){
            console.log("user_state_push");
            //console.log(data);

            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.online = data.online;
            self.dispatchEvent('user_state_changed',seat);
        });
        
        cc.vv.net.addHandler("user_ready_push",function(data){
            console.log("user_ready_push");
           // console.log(data);

            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.ready = data.ready;
            self.dispatchEvent('user_state_changed',seat);
        });

        cc.vv.net.addHandler("get_xiapao_notify_push",function(data){
            cc.log("get_xiapao_notify_push");

            for (var i = 0; i < data.length; i++) {
                var seatIndex = self.getSeatIndexByID(data[i].userId);
                if (self.seats[seatIndex].xiapao == null || self.seats[seatIndex].xiapao < 0) {
                    self.seats[seatIndex].xiapao = data[i].xiapao;
                }
            };

            if (self.gamestate == "xiapao") {
                return;
            }

            var data = [];
            for(var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); ++i){
                var xiapao = cc.vv.gameNetMgr.seats[i].xiapao;
                data.push(xiapao);
            };
            cc.vv.gameNetMgr.dispatchEvent('game_xiapao_begin',data);
        });
        
        cc.vv.net.addHandler("game_holds_push",function(data){
            console.log("baihua2001cn         game_holds_push");
            //console.log(data);

            self.initSeatsinfo();
            var seat = self.seats[self.seatIndex]; 
            seat.holds = data;
            self.dispatchEvent('game_holds');
        });

        cc.vv.net.addHandler("game_bright_push",function(data){
            console.log("game_bright_push");
            //console.log(data);

            self.initSeatsinfo();
            for (var i = 0; i < data.length; i++) {
                var get_seat_data = data[i];
                var seatindex =  self.getSeatIndexByID(get_seat_data.userId);
                if (self.seats[seatindex] == null) {
                    break;
                }

                self.seats[seatindex].bright = get_seat_data.bright;
                if (seatindex == self.seatIndex) {
                    self.seats[seatindex].operation = get_seat_data.operation;
                }else {
                    self.seats[seatindex].operation = [];
                    // var other_seat_operation_count = get_seat_data.operation.length;
                    // for (var j = 0; j < other_seat_operation_count; j++) {
                    //     self.seats[seatindex].operation.push(-1);
                    // };
                }
            };

            self.dispatchEvent('game_bright');
        });
         
        cc.vv.net.addHandler("game_begin_push",function(data){
            console.log("game_begin_push");
           // console.log(data);

            self.judgeSeatsIDEqual();

            self.button = data;
            self.turn = self.button;
            self.initSeatsinfo();
            self.gamestate = "begin";
            // cc.vv.net.send("get_xiapao_push");
            self.dispatchEvent('game_begin');
        });
        
        cc.vv.net.addHandler("game_playing_push",function(data){
            console.log('game_playing_push'); 

            self.gamestate = "playing"; 
            self.dispatchEvent('game_playing');
        });


        cc.vv.net.addHandler("game_sync_push",function(data){
            console.log("game_sync_push");
           // console.log(data);
           
            self.numOfMJ = data.numofmj;
            self.gamestate = data.state;
            if(self.gamestate == "dingque"){
                self.isDingQueing = true;
            }
            else if(self.gamestate == "huanpai"){
                self.isHuanSanZhang = true;
            }
            else if (self.gamestate == "xiapao") {
                self.isShowPao = true;
            }

            self.addAllHunPai(data.hunpai);

            self.turn = data.turn;
            self.button = data.button;
            self.chupai = data.chuPai;
            self.huanpaimethod = data.huanpaimethod;

            self._bright_secret_round = data.runSelectCount;

            for (var i = 0; i < self.seats.length; ++i) {
                var seat = self.seats[i];
                var sd = data.seats[i];
                seat.userid = sd.userid;
                seat.holds = sd.holds;
                seat.folds = sd.folds;
                seat.chis = sd.chis;
                seat.angangs = sd.angangs;
                seat.diangangs = sd.diangangs;
                seat.wangangs = sd.wangangs;
                seat.pengs = sd.pengs;
                seat.bright = sd.bright || [];//亮起的牌
                seat.secret = sd.secret || [];//暗扣的牌
                seat.operation = sd.operation || [];//操作的牌
                seat.dingque = sd.que;
                seat.xiapao = sd.xiapao;
                seat.hued = sd.hued;
                seat.iszimo = sd.iszimo;
                seat.GameType = sd.GameType;
                seat.huinfo = sd.huinfo;
                seat.huanpais = sd.huanpais;

                seat.canting = sd.canting || false;
                seat.isting = sd.isting || false;
                seat.isming = sd.isming || false;
                seat.seatHuPaiTips = sd.seatHuPaiTips || [];
                seat.Tingobj = sd.Tingobj || [];

                seat.buhua = sd.hua || [];
                seat.beardCardsList = sd.beardCardList || [];

                seat.tmp_runSelect_pai = sd.tmp_runSelect_pai || [];
                seat.runSelectNum = sd.runSelectNum;

                if (i == self.seatIndex) {
                    self.dingque = sd.que;
                }
            }
            

            self.isSync = true;

            var RoomType = cc.vv.SelectRoom.getRoomType();
          
            self.setTurnIndexList(data);

            self.syncFolds();

            //发牌重连数据同步
            self.syncSeatsData();


        });

        cc.vv.net.addHandler("game_hunpai_push",function(data){
            console.log("game_hunpai_push");
           // console.log(data);

            var isPlaying = false;
            self.addAllHunPai(data);
            self.dispatchEvent('game_hunpai', isPlaying);
        });
        
        cc.vv.net.addHandler("game_dingque_push",function(data){
            console.log("game_dingque_push");
           // console.log(data);

            self.isDingQueing = true;
            self.isHuanSanZhang = false;
            self.dispatchEvent('game_dingque');
        });
        
        cc.vv.net.addHandler("game_xiapao_push",function(data){
            console.log("game_xiapao_push");
           // console.log(data);

            self.gamestate = "xiapao";
            self.isShowPao = true;
            self.dispatchEvent('game_xiapao');
        });

        cc.vv.net.addHandler("game_huanpai_push",function(data){
            self.isHuanSanZhang = true;
            self.dispatchEvent('game_huanpai');
        });
        
        cc.vv.net.addHandler("hangang_notify_push",function(data){
            cc.log("hangang_notify_push");

            self.dispatchEvent('hangang_notify',data);
        });

        cc.vv.net.addHandler("game_ting_push",function(data){
            cc.log("game_ting_push");
           // console.log(data);
            self.dispatchEvent('game_ting',data);
        });

        cc.vv.net.addHandler("ting_notify_push",function(data){
            self.dispatchEvent('ting_notify',data);
        });

        cc.vv.net.addHandler("ming_notify_push",function(data){
            self.dispatchEvent('ming_notify',data);
        });

        cc.vv.net.addHandler("tuidao_notify_push",function(data){
            self.dispatchEvent('tuidao_notify',data);
        });

        cc.vv.net.addHandler("game_action_push",function(data){
            console.log("game_action_push");
          //  console.log(data);

            self.curaction = data;
            self.dispatchEvent('game_action',data);
        });

        cc.vv.net.addHandler("action_wait_push",function(data){
            console.log("action_wait_push");
           // console.log(data);

            self.dispatchEvent('game_wait',data);
        });
        
        cc.vv.net.addHandler("game_chupai_push",function(data){
            console.log('game_chupai_push');
          //  console.log(data);

            var turnUserID = data.userid;
            var si = self.getSeatIndexByID(turnUserID);
            self.doTurnChange(si, data);
        });
        
        cc.vv.net.addHandler("game_num_push",function(data){
            console.log("game_num_push");
          //  console.log(data);

            self.numOfGames = data;
            self.dispatchEvent('game_num',data);
        });

        cc.vv.net.addHandler("game_over_push",function(data){
            console.log("game_over_push");
           // console.log(data);
            
            self.dispatchEvent('game_over_timePointer');

            if(data.endinfo){
                cc.vv.global._space = 'balance';
                self.isOver = true;
                cc.vv.userMgr.playingRoomId = self.roomId;
            }
            self.curaction = null;

            setTimeout(function () {
                self._gameOverDelayTime = 1;
                self.gameOver(data);
            }, self._gameOverDelayTime);
        });
        
        cc.vv.net.addHandler("mj_count_push",function(data){
            console.log("mj_count_push");
          //  console.log(data);

            self.numOfMJ = data;
            self.dispatchEvent('mj_count',data);
        });
        
        cc.vv.net.addHandler("hu_push",function(data){
            console.log('hu_push');
          //  console.log(data);

            self.doHu(data);
        });

        cc.vv.net.addHandler("fanpai_push",function(data){
            console.log('fanpai_push');
          //  console.log(data);

            self.dispatchEvent('game_fanpai',data);
        });
        
        cc.vv.net.addHandler("game_chupai_notify_push",function(data){
            console.log('game_chupai_notify_push');
          //  console.log(data);

            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doChupai(si,pai, data.baoting);
        });
        
        cc.vv.net.addHandler("game_mopai_push",function(data){
            console.log('game_mopai_push');
          //  console.log(data);

            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doMopai(si, pai);
        });
        
        cc.vv.net.addHandler("guo_notify_push",function(data){
            console.log('guo_notify_push');
         //   console.log(data);

            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doGuo(si,pai);
        });
        
        cc.vv.net.addHandler("guo_result",function(data){
            console.log('guo_result');

           
            self.dispatchEvent('guo_result');
        });
        
        cc.vv.net.addHandler("guohu_push",function(data){
            console.log('guohu_push');

            self.dispatchEvent("push_notice",{info:"过胡",time:1.5});
        });
        
        cc.vv.net.addHandler("huanpai_notify",function(data){
            var seat = self.getSeatByID(data.si);
            seat.huanpais = data.huanpais;
            self.dispatchEvent('huanpai_notify',seat);
        });
        
        cc.vv.net.addHandler("game_huanpai_over_push",function(data){
            console.log('game_huanpai_over_push');
            var info = "";
            var method = data.method;
            if(method == 0){
                info = "换对家牌";
            }
            else if(method == 1){
                info = "换下家牌";
            }
            else{
                info = "换上家牌";
            }
            self.huanpaimethod = method;
            cc.vv.gameNetMgr.isHuanSanZhang = false;
            self.dispatchEvent("game_huanpai_over");
            self.dispatchEvent("push_notice",{info:info,time:2});
        });

        cc.vv.net.addHandler("chi_notify_push", function(data) {
            console.log('chi_notify_push');
         //   console.log(data);

            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doChi(si, data.pai, data.turnindex);
        });
        
        cc.vv.net.addHandler("peng_notify_push",function(data){
            console.log('peng_notify_push');
          //  console.log(data);

            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);

            var indexInfo = {
                pai: data.pai,
                turnindex: data.turnindex
            };
            self.turnIndexList[si]["peng"].push(indexInfo);

            self.doPeng(si,data.pai, data.turnindex);
        });
        
        cc.vv.net.addHandler("gang_notify_push",function(data){
            console.log('gang_notify_push');
          //  console.log(data);

            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);

            self.setGangTurnIndex(si, data);
            
            self.doGang(si,pai,data.gangtype, data.turnindex);
        });
        
        cc.vv.net.addHandler("game_dingque_notify_push",function(data){
            console.log("game_dingque_notify_push");
          //  console.log(data);

            self.dispatchEvent('game_dingque_notify',data);
        });

        cc.vv.net.addHandler("game_xiapao_notify_push",function(data){
            console.log("game_xiapao_notify_push");
          //  console.log(data);

            self.dispatchEvent('game_xiapao_notify',data);
        });
        
        cc.vv.net.addHandler("game_dingque_finish_push",function(data){
            for(var i = 0; i < data.length; ++i){
                self.seats[i].dingque = data[i];
            }
            self.dispatchEvent('game_dingque_finish',data);
        });

        cc.vv.net.addHandler("game_xiapao_finish_push",function(data){
            console.log("game_xiapao_finish_push");
          //  console.log(data);
            
            for(var i = 0; i < data.length; ++i){
                self.seats[i].xiapao = data[i];
            }
            self.dispatchEvent('game_xiapao_finish',data);
        });
        
        
        cc.vv.net.addHandler("chat_push",function(data){
            self.dispatchEvent("chat_push",data);    
        });
        
        cc.vv.net.addHandler("quick_chat_push",function(data){
            self.dispatchEvent("quick_chat_push",data);
        });
        
        cc.vv.net.addHandler("emoji_push",function(data){
            self.dispatchEvent("emoji_push",data);
        });
        
        cc.vv.net.addHandler("dissolve_notice_push",function(data){
            console.log("dissolve_notice_push"); 
         //   console.log(data);
            self.dissoveData = data;
            self.dispatchEvent("dissolve_notice",data);
        });
        
        cc.vv.net.addHandler("dissolve_cancel_push",function(data){
            self.dissoveData = null;
            self.dispatchEvent("dissolve_cancel",data);
        });
        
        cc.vv.net.addHandler("voice_msg_push",function(data){
            self.dispatchEvent("voice_msg",data);
        });

        cc.vv.net.addHandler("buhua_notify_push",function(data){
            console.log("buhua_notify_push"); 
         //   console.log(data);
            
            self.addBuHuaData(data);
            self.dispatchEvent("buhua_notify",data);
        });

        cc.vv.net.addHandler("robot_ready_push",function(data){
            console.log("robot_ready_push"); 
          //  console.log(data);

            self.dispatchEvent("robot_ready",data);
        });

        cc.vv.net.addHandler("game_bright_secret_push",function(data){

            console.log("game_bright_secret_push"); 
          //  console.log(data);

            //发牌阶段

            self.initSeatsinfo();

            self.gamestate = "runSelect";

            var holds_len = data.holds.length;
            if (holds_len == 0) {
                return;
            }
            var mySeat = self.seats[self.seatIndex];
            for (var i = 0; i < holds_len; i++) {
                mySeat.operation.push(data.holds[i]);
            };

            data.bsRound = self._bright_secret_round;
            self._bright_secret_round++;

            self.dispatchEvent("game_bright_secret",data);
        });

        cc.vv.net.addHandler("game_runSelect_notify_push",function(data){

            console.log("game_runSelect_notify_push"); 
          //  console.log(data);

            //发牌阶段，确定牌面
            
            self.gamestate = "runSelect";

            var local_bright_secret_round = self._bright_secret_round - 1;

            var seat = self.seats[data.seatIndex];
            var holds_len = data.holds.length;
            var del_init_index = seat.operation.length - holds_len;
            if (local_bright_secret_round == 4) {
                del_init_index = seat.operation.length - holds_len;
            };

            if (data.type == 0 && data.seatIndex != self.seatIndex) {
                for (var i = 0; i < holds_len; i++) {
                    seat.operation.push(data.holds[i]);
                };
            }else if (data.type == 1) {
                if (self.conf.type == cc.vv.brightGameName) {
                    for (var i = 0; i < holds_len; i++) {
                        seat.secret.push(data.holds[i]);
                    };
                }
                if (data.seatIndex == self.seatIndex && del_init_index >= 0) {
                    seat.operation.splice(del_init_index, holds_len);
                }
            }

            self.dispatchEvent('game_runSelect_notify',data);

        });


        //+++++++++++++++++++++++++++++++++PUKE++++++++++++++++++++++++++++++++++++++++++++++++



    },




   //+++++++++++++++++++++++++++++++++puker+++++++++++++++++++++++++++++

    againLiang3: function () {
        var seats = this.seats;
        var tmpagainLiangData = [];
        for (let i = 0; i < seats.length; i++) {
            var seat = seats[i];
            var lianglist = seat.liangList;
            var folds = seat.folds;
            var tmpagainfolds = [];
            if (lianglist != undefined) {
                for (let j = 0; j < folds.length; j++) {
                    var oneFolds = folds[j];
                    for (let k = 0; k < oneFolds.length; k++) {
                        if (oneFolds[k] < 4) {
                            tmpagainfolds.push(oneFolds[k])
                        }
                    }
                }
            }
            // 并集
            let unionSet = new Set([...tmpagainfolds, ...lianglist]);
            tmpagainLiangData[i] = Array.from(unionSet);
        }
        this.againLiangData = tmpagainLiangData;
    },
    

    //++++++++++++++++++++++++++++++++++MaHjong++++++++++++++++++++++++++++++++++++++++++++++++++++
    setGangTurnIndex: function (seatIndex, data) {
        var indexInfo = {
            pai: data.pai,
            turnindex: data.turnindex
        };
        switch (data.gangtype) {
            case "angang":
                this.turnIndexList[seatIndex]["angang"].push(indexInfo);
                break;
            case "diangang":
                this.turnIndexList[seatIndex]["diangang"].push(indexInfo);
                break;
            case "wangang":
                var peng_length = this.turnIndexList[seatIndex]["peng"].length;
                for (var i = 0; i < peng_length; i++) {
                    if (this.turnIndexList[seatIndex]["peng"][i].pai == data.pai) {
                        indexInfo.turnindex = this.turnIndexList[seatIndex]["peng"][i].turnindex;
                        this.turnIndexList[seatIndex]["peng"].splice(i, 1);
                        break;
                    }
                };
                this.turnIndexList[seatIndex]["wangang"].push(indexInfo);
                break;
        }
    },
    
    doGuo:function(seatIndex,pai){
        var seatData = this.seats[seatIndex];
        if (cc.vv.replayMgr.isReplay() && seatData.folds && pai >= 0) {
            seatData.folds.push(pai);
        }
        this.dispatchEvent('guo_notify',seatData);    
    },
    
    doMopai:function(seatIndex,pai){
        var seatData = this.seats[seatIndex];
        cc.log("seatIndex=================="+seatIndex)
        var holds = seatData.holds;
        if (holds != null && holds.length > 0 && pai >= 0) {
            holds.push(pai);
        }

        //操作的牌
        if (seatData.operation) {
            seatData.operation.push(pai);
        }

        this.dispatchEvent('game_mopai',{seatIndex:seatIndex,pai:pai});
    },

    doBSOChuPai: function (bOrSOrO, pai) {
        var bool_bright_secret_remove = false;
        if (bOrSOrO != null && bOrSOrO.length > 0) {
            var idx = bOrSOrO.indexOf(pai);
            if (idx != -1) {
                bool_bright_secret_remove = true;
                bOrSOrO.splice(idx, 1);
            }
        }

        return bool_bright_secret_remove;
    },

    doPKChupai:function(seatIndex,pai, holdsNum){
        this.chupai_PK = pai;
        var seatData = this.seats[seatIndex];

        if(seatData.holds){
            
            var pai_len = pai.length;
            for (let i=0;i<pai_len;i++){
                var idx = seatData.holds.indexOf(pai[i]);
                seatData.holds.splice(idx,1);
            }
          
        }


        if (!cc.vv.PKReplayMgr.isReplay() && seatData.folds && pai !== null) {
            var tmpfolds = [];
            var pai_len = pai.length;
            for(let i=0;i<pai_len;i++){
                tmpfolds.push(pai[i]);
            }
            seatData.folds.push(tmpfolds)
           
        }

        var tmp_obj = {
            seatData:seatData,
            pai:pai,
            index:seatIndex,
            num:holdsNum,
        }

        
        this.dispatchEvent('game_chupai_notify',tmp_obj);    
    },
    
    doChupai:function(seatIndex,pai, isTing){
        this.chupai = pai;
        var seatData = this.seats[seatIndex];

        if(seatData.holds){
            var idx = seatData.holds.indexOf(pai);
            seatData.holds.splice(idx,1);
        }

        //操作的牌
        var bool_bright_secret_remove = false;
        if (isTing == true) {
            bool_bright_secret_remove = this.doBSOChuPai(seatData.bright, pai);
            bool_bright_secret_remove = this.doBSOChuPai(seatData.secret, pai);
        }

        if (bool_bright_secret_remove == false) {
            this.doBSOChuPai(seatData.operation, pai);
        }

        if (!cc.vv.replayMgr.isReplay() && seatData.folds && pai >= 0) {
            seatData.folds.push(pai);
        }
        
        this.dispatchEvent('game_chupai_notify',{seatData:seatData,pai:pai});    
    },

    getChiMahjongId: function (pai) {
        var type = parseInt(pai / 100);
        var mjId = pai - type * 100;

        return mjId;
    },

    getChiArr: function(pai, ign) {
        var type = parseInt(pai / 100);
        var c = pai % 100;
        var begin = c - type;
        var arr = [];
        for (var i = 0; i < 3; i++) {
            var k = begin + i;
            if (ign && k == c) {
                continue;
            }

            arr.push(k);
        }
        return arr;
    },

    doChi: function(seatIndex, pai, turnindex) {
        var seatData = this.seats[seatIndex];
        var holds = seatData.holds;

        var mjs = this.getChiArr(pai, true);
        if (holds != null && holds.length > 0) {
            for (var i = 0; i < mjs.length; i++) {
                var c = mjs[i];
                var idx = holds.indexOf(c);
                if (idx == -1) {
                    break;
                }

                holds.splice(idx, 1);
            }
        }

        this.setBrightEatAction(mjs, seatData.bright);
        this.setBrightEatAction(mjs, seatData.secret);
        this.setBrightEatAction(mjs, seatData.operation);

        if (!cc.vv.replayMgr.isReplay() && pai >= 0 && turnindex >= 0 && turnindex < 4) {
            var foldSeatData = this.seats[turnindex];
            if (foldSeatData && foldSeatData.folds) {
                foldSeatData.folds.pop(pai);
            }
        }

        //更新吃牌数据
        var chis = seatData.chis;
        chis.push(pai);

        this.dispatchEvent('chi_notify', { seatData: seatData, pai: pai });
    },

    setBrightEatAction: function (mahjong_eat_array, mahjong_change_array) {
        var mjs_len = mahjong_eat_array.length;
        if (mjs_len > 0 && mahjong_change_array != null && mahjong_change_array.length > 0) {
            for (var i = mjs_len-1; i >= 0; i--) {
                var mahjong_eat_id = mahjong_eat_array[i];
                var idx = mahjong_change_array.indexOf(mahjong_eat_id);
                if (idx == -1) {
                    continue;
                }

                mahjong_change_array.splice(idx, 1);
                mahjong_eat_array.splice(mahjong_eat_id, 1);
            }
        }
    },
    
    doPeng:function(seatIndex, pai, turnindex){
        var seatData = this.seats[seatIndex];
        //移除手牌
        if(seatData.holds){
            for(var i = 0; i < 2; ++i){
                var idx = seatData.holds.indexOf(pai);
                seatData.holds.splice(idx,1);
            }                
        }

        //Bright
        var mahjong_remove_count = 0;
        var mahjong_peng_max_count = 2;
        mahjong_remove_count = this.setBrightPengGangAction(mahjong_remove_count, mahjong_peng_max_count, seatData.bright, pai);
        mahjong_remove_count = this.setBrightPengGangAction(mahjong_remove_count, mahjong_peng_max_count, seatData.secret, pai);
        mahjong_remove_count = this.setBrightPengGangAction(mahjong_remove_count, mahjong_peng_max_count, seatData.operation, pai);

        if (!cc.vv.replayMgr.isReplay() && pai >= 0 && turnindex >= 0 && turnindex < 4) {
            var foldSeatData = this.seats[turnindex];
            if (foldSeatData && foldSeatData.folds) {
                foldSeatData.folds.pop(pai);
            }
            
        }
            
        //更新碰牌数据
        var pengs = seatData.pengs;
        pengs.push(pai);
        
        this.dispatchEvent('peng_notify',seatData);
        

    },

    setBrightPengGangAction: function (mahjong_remove_count, mahjong_max_count, mahjong_change_array, mahjong_operation_id) {
        var remove_count = mahjong_remove_count;

        if (remove_count < mahjong_max_count && mahjong_change_array != null && mahjong_change_array.length > 0) {
            var restMJCount = mahjong_max_count-remove_count;
            for (var i = 0; i < restMJCount; i++) {
                var idx = mahjong_change_array.indexOf(mahjong_operation_id);
                if (idx == -1) {
                    break;
                }

                mahjong_change_array.splice(idx, 1);
                remove_count++;
            }
        }

        return remove_count;
    },
    
    getGangType:function(seatData,pai){
        if(seatData.pengs.indexOf(pai) != -1){
            return "wangang";
        }
        else{
            var cnt = 0;
            for(var i = 0; i < seatData.holds.length; ++i){
                if(seatData.holds[i] == pai){
                    cnt++;
                }
            }
            if(cnt == 3){
                return "diangang";
            }
            else{
                return "angang";
            }
        }
    },
    
    doGang:function(seatIndex,pai,gangtype, turnindex){
        var seatData = this.seats[seatIndex];
        
        if(!gangtype){
            gangtype = this.getGangType(seatData,pai);
        }
        
        if(gangtype == "wangang"){
            if(seatData.pengs.indexOf(pai) != -1){
                var idx = seatData.pengs.indexOf(pai);
                if(idx != -1){
                    seatData.pengs.splice(idx,1);
                }
            }
            seatData.wangangs.push(pai);      
        }
        if(seatData.holds){
            for(var i = 0; i <= 4; ++i){
                var idx = seatData.holds.indexOf(pai);
                if(idx == -1){
                    //如果没有找到，表示移完了，直接跳出循环
                    break;
                }
                seatData.holds.splice(idx,1);
            }
        }

        //Bright
        var mahjong_remove_count = 0;
        var mahjong_gang_max_count = 4;
        mahjong_remove_count = this.setBrightPengGangAction(mahjong_remove_count, mahjong_gang_max_count, seatData.bright, pai);
        mahjong_remove_count = this.setBrightPengGangAction(mahjong_remove_count, mahjong_gang_max_count, seatData.secret, pai);
        mahjong_remove_count = this.setBrightPengGangAction(mahjong_remove_count, mahjong_gang_max_count, seatData.operation, pai);

        if(gangtype == "angang"){
            seatData.angangs.push(pai);
        }
        else if(gangtype == "diangang"){
            if (!cc.vv.replayMgr.isReplay() && pai >= 0 && turnindex >= 0 && turnindex < 4) {
                var foldSeatData = this.seats[turnindex];
                if (foldSeatData && foldSeatData.folds) {
                    foldSeatData.folds.pop(pai);
                }
                
            }
            seatData.diangangs.push(pai);
        }

        this.dispatchEvent('gang_notify',{seatData:seatData,gangtype:gangtype});
        
    },
    
    doHu:function(data){
        var pai = data.hupai;
        var turnindex = data.turnindex;
        if (!cc.vv.replayMgr.isReplay() && pai >= 0 && turnindex >= 0 && turnindex < 4) {
            var foldSeatData = this.seats[turnindex];
            if (foldSeatData && foldSeatData.folds) {
                foldSeatData.folds.pop(pai);
            }
        }

        if (this.seats[data.seatindex].beardCardsList == null) {
            this.seats[data.seatindex].beardCardsList = []; 
        }
        this.seats[data.seatindex].beardCardsList.push(pai);
        

        this.dispatchEvent('hupai',data);
    },
    
    doTurnChange:function(si, gamedata){
        var data = {
            last:this.turn,
            turn:si,
            gamedata:gamedata
        }
        this.turn = si;
        this.dispatchEvent('game_chupai',data);
    },

    addBuHuaData: function (data) {
        var seatindex = this.getSeatIndexByID(data.userid);
        if (this.seats[seatindex] == null) {
            return;
        }

        if (data.buhua && data.buhua.length > 0) {
            for (var i = 0; i < data.buhua.length; i++) {
                if (this.seats[seatindex].buhua == null) {
                    this.seats[seatindex].buhua = [];
                }
                this.seats[seatindex].buhua.push(data.buhua[i]);
            };
        }
    },

    addHuaHolds: function (seatindex, addHolds) {
        if (this.seats[seatindex] == null) {
            return;
        }
        for (var i = 0; i < addHolds.length; i++) {
            this.seats[seatindex].holds.push(addHolds[i]);
        };
    },

    doBuHua: function (data) {
        if (this.seats == null) {
            return;
        }
        var seatData = this.seats[data.si];
        var userid = seatData.userid;

        var data = {
            userid: userid,
            pai: data.pai
        }
        this.dispatchEvent('buhua_replay',data);
    },

    gameOver: function (data) {
        var results = data.results;
      
        for(var i = 0; i <  this.seats.length; ++i){
            this.seats[i].score = results.length == 0? 0:results[i].totalscore;
        }
     
        // this.dispatchEvent('game_over',results);
        this.dispatchEvent('game_over',data);
      
        if(data.endinfo){
            this.isOver = true;
            for(var i = 0; i <  this.seats.length; ++i){
                this.seats[i].score = data.endinfo[i].totalscore;
            }
            // this.dispatchEvent('game_end',data.endinfo); 
            this.dispatchEvent('game_end',data);    
        }

        this.reset();

        for(var i = 0; i <  this.seats.length; ++i){
            this.dispatchEvent('user_state_changed',this.seats[i]);    
        }
    },
    
    connectGameServer:function(data){
        this.dissoveData = null;

        //var is_guest = cc.vv.userMgr.getLocalServerType();
       // if (is_guest) {
            cc.vv.net.ip = data.ip + ":" + data.port;
       // }else {
        //    cc.vv.net.ip = cc.formal_ip + ":" + data.port;
        //}
        

        // cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            var sd = {
                token:data.token,
                roomid:data.roomid,
                time:data.time,
                sign:data.sign,
            };
          //  console.log(sd)
            cc.vv.net.send("login",sd);
        };
        
        var onConnectFailed = function(){
            console.log("failed.");
            cc.vv.wc.hide();
        };
        cc.vv.wc.show(2);
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    },

    refreshBG: function(data) {
        console.log('refreshBG');
        this.dispatchEvent("refresh_bg", data);
    },
    syncSeatsData: function () {
        var game_seat_count = 4;
        for(var i = 0; i < game_seat_count; ++i){
            if(i != this.seatIndex){
                this.sureOtherDealSeat(i);
            }
        }
    },

    sureOtherDealSeat: function (index) {
        var seat = this.seats[index];

        var other_hold_number = this.getHoldNumberOfRound();
        if (other_hold_number == -1) {
            return;
        }
        var other_secret_length = seat.secret.length;

        //确定准备麻将数量
        var runSelectNum = seat.runSelectNum;
        var sure_select_count = -1, ten_digit = -1, single_digit = -1;
        if (runSelectNum >= 10) {
            single_digit = runSelectNum%10;
            ten_digit = (runSelectNum-single_digit)/10;
        }else {
            single_digit = runSelectNum;
            ten_digit = 0;
        }
        sure_select_count = single_digit + ten_digit;
        var ready_count = this.getOtherDealReadyCount(sure_select_count);
        if (ready_count == -1) {
            cc.log("----------------------- setOtherDealHold Error ready_count == -1");
            return;
        }

        if (seat.operation == null) {
            seat.operation = [];
        }

        var operation_length = other_hold_number - other_secret_length - ready_count;
        if (operation_length <= 0) {
            cc.log("----------------------- setOtherDealHold operation_length = ", operation_length);
            return;
        }

        for (var j = 0; j < operation_length; j++) {
            seat.operation.push(-1);
        };
    },

    getOtherDealReadyCount: function (selectCount) {
        var other_select_round = 0;
        switch (selectCount) {
            case 0:
                other_select_round = 0;
                break;
            case 1:
                other_select_round = 1;
                break;
            case 2:
                other_select_round = 2;
                break;
            case 3:
                other_select_round = 3;
                break;
            case 4:
                other_select_round = 4;
                break;
        }

        var distance_round = this._bright_secret_round - other_select_round;

        var ready_count = -1;
        if (distance_round == 0) {
            ready_count = 0;
        }else if (distance_round == 1) {
            ready_count = 4;
            if (this._bright_secret_round == 4) {
                ready_count = 1;
            }
        }
        return ready_count;
    },

    setMyDealHold: function () {
        var my_hold_number = this.getHoldNumberOfRound();
        if (my_hold_number == -1) {
            return;
        }

        var mySeat = this.seats[this.seatIndex];
        if (mySeat.tmp_runSelect_pai != null && mySeat.tmp_runSelect_pai.length > 0) {

            var ready_hold_number = mySeat.tmp_runSelect_pai.length;
            for (var i = 0; i < ready_hold_number; i++) {
                mySeat.operation.push(mySeat.tmp_runSelect_pai[i]);
            };

            var isbs = true;
            var runSelectNum = mySeat.runSelectNum;
            if (runSelectNum >= 10) {
                isbs = false;
            }

            var data = {
                holds: mySeat.tmp_runSelect_pai,
                bsRound: this._bright_secret_round,
                isBS: isbs,
                isSyncMy:true
            }

            this._bright_secret_round++;

            this.dispatchEvent("game_bright_secret",data);

        }else {
            this._bright_secret_round++;

            var data = {
                seatIndex: this.seatIndex
            }
            this.dispatchEvent('game_runSelect_notify',data);
        }
    },

    getHoldNumberOfRound: function () {
        var holdNumber = -1;
        switch (this._bright_secret_round) {
            case 1:
                holdNumber = 4;
                break;
            case 2:
                holdNumber = 8;
                break;
            case 3:
                holdNumber = 12;
                break;
            case 4:
                holdNumber = 13;
                break;
            case 5:
                break;
        }
        return holdNumber;
    },

    judgeSeatsIDEqual: function () {

        if (this.seats == null) {

            if (cc.vv.alert) {
                var string = "玩家信息不存在！";
                cc.vv.alert.show(string); 
            }
            return;
        }

        var seatsLength = this.seats.length;
        for (var i = 0; i < seatsLength-1; i++) {
            var seatA = this.seats[i];

            for (var j = i+1; j < seatsLength; j++) {
                var seatB = this.seats[j];

                if (seatA.userid == seatB.userid) {
                    if (cc.vv.alert) {
                        var string = "错误：玩家ID相同，ID：" + seatB.userid + "，玩家名字：" + seatA.name + "、" + seatB.name;
                        cc.vv.alert.show(string); 
                        return;
                    }
                }
            };
        };
    },

    clearInitSeat: function () {
        if (this.seats == null) {
            return;
        }

        for (var i = 0; i < this.seats.length; i++) {
            var seat = this.seats[i];

            if (seat.userid <= 0) {
                if (seat.ip != null) {
                    seat.ip = null;
                }
            }
        };
    },

    getSeatByLocalIndex: function (localIndex) {

        if (this.seats == null) {
            return null;
        }

        var index = -1;
        for(var i = 0; i < this.seats.length; ++i){
            var seat = this.seats[i];
            var getSeatLocalIndex = this.getLocalIndex(seat.seatindex);

            if(getSeatLocalIndex == localIndex){
                index = i;
                break;
            }
        }

        if (index == -1) {
            return null;
        }else {
            var seat = this.seats[index];
            return seat;
        }
    },

    doQiAndSan: function (seatIndex, type) {
        var data = {
            seatIndex: seatIndex,
            actionType: type
        };
        this.dispatchEvent('game_replyQi',data);
    },

    getMySeatUserId: function () {
        if (cc.vv.userMgr.boolOtherReply == true) {
            return cc.vv.userMgr.otherReplyUserId;
        }else {
            return cc.vv.userMgr.userId;
        }
    },

    doReplyPlayOption: function (seatIndex, type, mjid) {
        

        var isMySelf = true;
        if (seatIndex != cc.vv.gameNetMgr.seatIndex) {
            isMySelf = false;
        }

        var optionData = cc.vv.replayMgr.getReplyPlayOption(seatIndex, type, mjid);

        if (isMySelf == false) {
            return 0.01;
        }

        var showReplyOptionData = this.sureReplyOptionData(optionData);

        this.dispatchEvent('game_replyPlayOption',optionData);

        return 1.0;
    },

    sureReplyOptionData: function (optionData) {

        var keyCountData = this.getOptionKeyCountData();
        var sureOptionData = {
            mjId: -1,
            playArray:[],
            gangIdArray:[]
        };
        sureOptionData.mjId = optionData.mjId;
        for (var i = 0, len = optionData.playArray.length; i < len; i++) {
            var key = optionData.playArray[i];
            keyCountData[key] += 1;
        };

        for (var i = 0, len = this.mahjongPlayArray.length; i < len; i++) {
            var key = this.mahjongPlayArray[i]
            if (key != "gang" && keyCountData[key] > 0) {
                sureOptionData.playArray.push(key);
            }
        };

        for (var i = 0, len = optionData.gangIdArray.length; i < len; i++) {
            var gangId = optionData.gangIdArray[i];

            var isEqual = false;
            var sureGangIdLen = sureOptionData.gangIdArray.length;
            for (var j = 0; j < sureGangIdLen; j++) {
                if (gangId == sureOptionData.gangIdArray[j]) {
                    isEqual = true;
                    break;
                }
            };

            if (isEqual == false) {
               sureOptionData.gangIdArray.push(gangId);
               sureOptionData.playArray.push("gang");
            }
        };

        return sureOptionData;
    },

    getOptionKeyCountData: function () {
        var keyCountData = {};
        for (var i = 0, len = this.mahjongPlayArray.length; i < len; i++) {
            var key = this.mahjongPlayArray[i]
            keyCountData[key] = 0;
        };

        return keyCountData;
    },

    /**************************
    * 获取游戏中的音效路径
    **************************/

    //男女声音性别区分
    getSeatSex: function (seatIndex, localIndex) {
        if (this.seats == null) {
            return null;
        }

        var seat = null
        if (seatIndex < 0) {
            seat = this.getSeatByLocalIndex(localIndex);
        }else {
            seat = this.seats[seatIndex];
        }

        if (seat == null) {
            return null;
        }

        var seatUserId = seat.userid;
        var sexName = "Woman";
        if(cc.vv.baseInfoMap != null){
            var info = cc.vv.baseInfoMap[seatUserId];
            if(info != null && info.sex != null && info.sex == 1){
                sexName = "Man";
            }                
        }

        return sexName;
    },

    //获取音效文件名的前缀
    getNamePrefix: function (otherLName, otherSName) {
        var localNamePrefix = "mw_";
        var getLName = cc.vv.audioMgr.getLanguageName();
        var getSName = cc.vv.audioMgr.getSexName();

        if (otherLName != undefined && otherLName != "") {
            getLName = otherLName;
        }

        if (otherSName != undefined && otherSName != "") {
            getSName = otherSName
        }
        if (getLName == "Mandarin") {
            if (getSName == "Woman") {
                localNamePrefix = "mw_";
            }else if (getSName == "Man") {
                localNamePrefix = "mm_";
            }

        }else if (getLName == "Dialect") {
            if (getSName == "Woman") {
                localNamePrefix = "dw_";
            }else if (getSName == "Man") {
                localNamePrefix = "dm_";
            }
        }
        return localNamePrefix;
    },

    //播放音效
    setAudioSFX: function (seatIndex, localIndex, audioFolderName, audioName, otherLName) {
        var getLName = cc.vv.audioMgr.getLanguageName();
        var seatSex = this.getSeatSex(seatIndex, localIndex);
        if (seatSex != null) {
            var isEqualLanguage = true;
            cc.vv.audioMgr.setSexName(seatSex);
            var otherSName = seatSex;
            if (otherLName == undefined || otherLName == "") {
                otherSName = "";
            }else if (otherLName != getLName) {
                isEqualLanguage = false;
                cc.vv.audioMgr.setLanguageName(otherLName);
            }
            var prefix = this.getNamePrefix(otherLName, otherSName);
            var surePath = audioFolderName + "/" + prefix + audioName;
            cc.vv.audioMgr.playMJGameSFX(surePath);

            if (isEqualLanguage == false) {
                cc.vv.audioMgr.setLanguageName(getLName);
            }
        }
    },

    getMySex: function () {
        var sexName = "Woman";
        if(cc.vv.baseInfoMap != null){
            var info = cc.vv.baseInfoMap[cc.vv.userMgr.userId];
            if(info != null && info.sex != null && info.sex == 1){
                sexName = "Man";
            }                
        }

        return sexName;
    },

    showErrorTip: function (errorObj, objName) {
        var content = "显示有误，请重连！";
        if (errorObj == null) {
            content = objName + content;
        }else {
            return;
        }
        if (cc.vv.net) {
            cc.vv.net.send("client_error_msg", content);
        }
        if (cc.vv.alert) {
            cc.vv.alert.show(content);  
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
