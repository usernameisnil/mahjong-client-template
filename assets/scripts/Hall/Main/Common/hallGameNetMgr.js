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
       
             
        _bright_secret_round: 1,
      


    },

    init: function () {
            

    },
   


    
    dispatchEvent:function(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    
 
    // getLocalIndex:function(index){
    //     var ret = cc.vv.SelectRoom.getLocalIndex(index);
    //     return ret;
    // }, 

  

    clearHandlers:function(){
        
        cc.vv.net_hall.deleteHandlers('club_room_update');
        cc.vv.net_hall.deleteHandlers('login_result');
        cc.vv.net_hall.deleteHandlers('monitor_club_result');
        cc.vv.net_hall.deleteHandlers('invite_play_game');
        cc.vv.net_hall.deleteHandlers('club_update_cfg');
        cc.vv.net_hall.deleteHandlers('unmonitor_club_result');
        cc.vv.net_hall.deleteHandlers('club_online_num');
        cc.vv.net_hall.deleteHandlers('club_total_num');
        cc.vv.net_hall.deleteHandlers('operate_club_notify');
        cc.vv.net_hall.deleteHandlers('login_finished');
        cc.vv.net_hall.deleteHandlers('Halldisconnect');
        cc.vv.net_hall.deleteHandlers('test_msg');
    },

    initHandlers:function(){
        var self = this;
        //cc.vv.global._space = 'hall';

        cc.vv.net_hall.addHandler("login_result",function(data){
            console.log("login_result");
            console.log(data);
          
            if(data.errcode === 1){//需要http来进行登陆得到新的token 再来进行net login
                cc.vv.net_hall.endSocket();
                self.reConnectGameServer();
                return;
            }

            if (data.errcode === 0) {
                cc.vv.wc.hide();
            }


            if (cc.vv.global._space == "hallClub") {

                if (cc.vv.global.ishallSync) {
                    cc.vv.clubview.hallClubSync();
                }

            }

        });

        cc.vv.net_hall.addHandler("club_room_update",function(data){
            console.log("club_room_update");
            console.log(data);

            cc.vv.clubview.updataClubViewData(data)                  
        });

        cc.vv.net_hall.addHandler("monitor_club_result",function(data){
            console.log("monitor_club_result");
            console.log(data);
         
          
        });

        cc.vv.net_hall.addHandler("invite_play_game",function(data){
            console.log("invite_play_game");
            console.log(data);
            cc.vv.clubview.showClubPrompt(data);
          
        });

        cc.vv.net_hall.addHandler("club_update_cfg",function(data){
            console.log("club_update_cfg");
            console.log(data);
            
            if(data.type === 'clubAuto'){
                cc.vv.clubview.changeDefaultConf(data.conf)
                
            }
            if(data.type === 'clubCommon'){
                cc.vv.clubview.changeCfg(data);

            }
          
        });

        cc.vv.net_hall.addHandler("unmonitor_club_result",function(data){
            console.log("unmonitor_club_result");
            console.log(data);
            if(data.errcode === 0){
                cc.vv.clubview.monitorClub()
            }
          
        });

        cc.vv.net_hall.addHandler("club_online_num", function (data) {
            console.log("club_online_num");
            console.log(data);
            
            if(cc.vv.clubview !== undefined){
                if (cc.vv.clubview.viewData !== undefined ){
                    cc.vv.clubview.upDataOnlineNum(data)
                }        
            }               

        });

        cc.vv.net_hall.addHandler("club_total_num", function (data) {
            console.log("club_total_num");
            console.log(data);
            if(cc.vv.clubview !== undefined){
                if (cc.vv.clubview.viewData !== undefined ){
                    cc.vv.clubview.upDataTotalNum(data)
                }        
            }               

        });

        cc.vv.net_hall.addHandler("club_gems", function (data) {
            console.log("club_gems");
            console.log(data);
            if(cc.vv.clubview !== undefined){
                if (cc.vv.clubview.viewData !== undefined ){
                    cc.vv.clubview.upDataGems(data)
                }        
            }               

        });

        cc.vv.net_hall.addHandler('operate_club_notify',function(data){
            console.log('operate_club_notify');
            console.log(data)
            cc.vv.global.clubTempData.clubNotify = data;

            if(cc.vv.hall !== undefined){
                cc.vv.hall.showRedPoint(true);
                cc.vv.clubview.updateHaveApply()
            }

                       
        })

        cc.vv.net_hall.addHandler('test_msg',function(data){
            console.log('test_msg');
            console.log(data)
            if(cc.vv.hall !== undefined){
                cc.vv.hall._testedit.string = data.errmsg
            }
           
        })

        cc.vv.net_hall.addHandler("Halldisconnect", function (data) {

            self.dispatchEvent("Halldisconnect");

        });
                
        cc.vv.net_hall.addHandler("login_finished",function(data){
            console.log("login_finished");
            console.log(data);
            cc.vv.SelectRoom.setScence();
        });

        
    },

    reConnectGameServer:function(){
        // cc.vv.userMgr.login();
        // this.connectGameServer();
        cc.vv.userMgr.reconnectLogin(this.connectGameServer)//回调重新连接，防止无限重连
    }, 
    
     
    createHallSocket: function () {
        cc.vv.net.endSocket();

        // cc.vv.mjgameNetMgr.clearHandlers();  //add baihua2001cn cfg
        // cc.vv.hagameNetMgr.clearHandlers();
        // cc.vv.tkgameNetMgr.clearHandlers();
        // cc.vv.EWBgameNetMgr.clearHandlers();
        // cc.vv.tdhgameNetMgr.clearHandlers();
        // cc.vv.SXTDHgameNetMgr.clearHandlers();            
        // cc.vv.ddzNetMgr.clearHandlers();
        // cc.vv.pdkNetMgr.clearHandlers();

        cc.vv.hallgameNetMgr.clearHandlers();
        cc.CGameConfigDataModel.clearAllGameNetMgr();


        cc.vv.hallgameNetMgr.init();
        cc.vv.hallgameNetMgr.initHandlers();

        cc.vv.net_hall.isPinging = false;
        cc.vv.http.needHttpReconnect = false;//建立soket的时候，这个控制是否出Http重连的对话
        //cc.vv.gameNetMgr = cc.vv.hallgameNetMgr;

        cc.vv.hallgameNetMgr.connectGameServer();

    },

    connectGameServer:function(ipStr){
       
        cc.vv.hallgameNetMgr.dissoveData = null;
        //cc.vv.net.ip = data.ip + ":" + data.port;
        cc.vv.net_hall.ip = cc.vv.SI.hall;
        console.log(cc.vv.net_hall.ip);
  

        var onConnectOK = function () {
            console.log("onConnectOK");

            var sd = {
                token: cc.vv.userMgr.token,
                userId: cc.vv.userMgr.userId
            };
            cc.vv.net_hall.send("login", sd);
        };
        
        var onConnectFailed = function(){
            console.log("failed.");
            cc.vv.wc.hide();
        };
        //cc.vv.wc.show(0);
        cc.vv.net_hall.connect(onConnectOK,onConnectFailed);
    },
    
 

    refreshBG: function(data) {
        console.log('refreshBG');
        this.dispatchEvent("refresh_bg", data);
    },

 
  
  
    setAudioSFX: function (seatIndex, localIndex, audioFolderName, audioName, otherLName) {
        console.log('hallgamentmgr 1403');
        var getLName = cc.vv.audioMgr.getLanguageName();
        var seatSex = this.getSeatSex(seatIndex, localIndex);
        if (seatSex != null) {
            var isEqualLanguage = true;
            cc.vv.audioMgr.setSexName(seatSex);
            var otherSName = seatSex;
            if (otherLName == undefined || otherLName == "") {
                otherSName = "";
            } else if (otherLName != getLName) {
                isEqualLanguage = false;
                cc.vv.audioMgr.setLanguageName(otherLName);
            }
            var prefix = this.getNamePrefix(otherLName, otherSName);
            var surePath = audioFolderName + "/" + prefix + audioName;
            cc.vv.audioMgr.playMJGameSFX(surePath,true);

            if (isEqualLanguage == false) {
                cc.vv.audioMgr.setLanguageName(getLName);
            }
        }
    },
    getMySex: function getMySex() {
        var sexName = "Woman";
        if (cc.vv.baseInfoMap != null) {
            var info = cc.vv.baseInfoMap[cc.vv.userMgr.userId];
            if (info != null && info.sex != null && info.sex == 1) {
                sexName = "Man";
            }
        }

        return sexName;
    },
    getSeatSex: function getSeatSex(seatIndex, localIndex) {
        if (this.seats == null) {
            return null;
        }

        var seat = null;
        if (seatIndex < 0) {
            seat = this.getSeatByLocalIndex(localIndex);
        } else {
            seat = this.seats[seatIndex];
        }

        if (seat == null) {
            return null;
        }
        var seatUserId = seat.userid;
        var sexName = "Woman";
        if (cc.vv.baseInfoMap != null) {
            var info = cc.vv.baseInfoMap[seatUserId];
            if (info != null && info.sex != null && info.sex == 1) {
                sexName = "Man";
            }
        }

        return sexName;
    },
    getNamePrefix: function getNamePrefix(otherLName, otherSName) {
        var localNamePrefix = "mw_";
        var getLName = cc.vv.audioMgr.getLanguageName();
        var getSName = cc.vv.audioMgr.getSexName();

        if (otherLName != undefined && otherLName != "") {
            getLName = otherLName;
        }

        if (otherSName != undefined && otherSName != "") {
            getSName = otherSName;
        }
        if (getLName == "Mandarin") {
            if (getSName == "Woman") {
                localNamePrefix = "mw_";
            } else if (getSName == "Man") {
                localNamePrefix = "mm_";
            }
        } else if (getLName == "Dialect") {
            if (getSName == "Woman") {
                localNamePrefix = "dw_";
            } else if (getSName == "Man") {
                localNamePrefix = "dm_";
            }
        }
        return localNamePrefix;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
