cc.CGameConfigDataModel = {
	_isInit:false,
    _items:{},
    _noTip:"",
    
    //初始化加载文档数据
    init:function()
    {
        if(this._isInit)
        {
            cc.error("---------error----------CGameConfigDataModel has been inited!-----CGameConfigDataModel:init()");
            return;
        }
        var self = this;
        var filePath="data/GameConfig";
        cc.loader.loadRes(filePath,cc.Json, function (err,data)
        {
            if(err)
            {
                cc.error(err);
                return;
            }
            self._items=data;
            self._isInit = true;
            //需要工程加入几个游戏的GameNetMgr,由配置文件指定创建；
            self.LoadGameNetMgr();
            cc.log("wujun CGameConfigDataModel self._items = ", self._items);
        })

        return;
    },
    
    getDataByKey: function(key)
    {
        if(!key)
        {
            this._noTip ="the key is none!";
            return "";
        }
        if(!this._items[key])
        {
            this._noTip ="Key Not Found("+key+")";
            return "";
        }
        return this._items[key];
    },

    getTipStr: function()
    {
        return this._noTip;
    },

    getPKAudioURLByOther:function(other,seatUserId){
        var gameName = cc.vv.SelectRoom.getGameName();
        var mylanguage =  cc.vv.audioMgr.getLanguageName();
        //var mysex = cc.vv.userMgr.sex == 0 ? "WoMan" :"Man";

        cc.log("wujun ------- getPKAudioURLByOther ------");

        var sexName = "WoMan";
        if (cc.vv.baseInfoMap != null) {
            var info = cc.vv.baseInfoMap[seatUserId];
            if (info != null && info.sex != null && info.sex == 1) {
                sexName = "Man";
            }
        }

        return this.getPKItemData(gameName,mylanguage,sexName,other);
    },


    getPKItemData:function(game,language,sex,mjid){

        cc.log("wujun ------- getPKItemData ------");

        var gameData = this.getDataByKey(game);
        var tmpCardAudio = gameData.CardAudio;

        if (tmpCardAudio == null || tmpCardAudio == undefined) {
            
            tmpCardAudio = this._items["PKAudioPublicRes"].CardAudio;
            game = "PKAudioPublicRes";
            gameData = this.getDataByKey(game);
        } 

        var tmplanguageKeys = tmpCardAudio.languageKeys;
        var tmpsexKeys = tmpCardAudio.sexKeys;
        if(tmplanguageKeys[0] == "universal"){//没有方言之分
            language = "universal";
        }
        if(tmpsexKeys[0] == "public"){//没有男女之分
            sex = "public";
        }

        var PrefaxName = tmpCardAudio.PrefaxName; //获得前缀名，如果小选项里指定，则用，没有则用游戏里的指定的
        if (PrefaxName == null || PrefaxName == undefined) {
            PrefaxName = gameData.PrefaxName;
        }

        var path = tmpCardAudio.path + sex + "/"+PrefaxName+language+"_"+sex+"_"+mjid+".mp3";
        return path;

    },


    getAudioURLByOther:function(other,seatUserId){

        cc.log("wujun ------- getAudioURLByOther ------");

        var gameName = cc.vv.SelectRoom.getGameName();
        var mylanguage =  cc.vv.audioMgr.getLanguageName();
        //var mysex = cc.vv.userMgr.sex == 0 ? "WoMan" :"Man";

        var sexName = "WoMan";
        if (cc.vv.baseInfoMap != null) {
            var info = cc.vv.baseInfoMap[seatUserId];
            if (info != null && info.sex != null && info.sex == 1) {
                sexName = "Man";
            }
        }

        return this.getMJItemData(gameName,mylanguage,sexName,other);
    },

    getMJItemData:function(game,language,sex,mjid){

        cc.log("wujun ------- getMJItemData ------");

        var gameData = this.getDataByKey(game);
        var tmpCardAudio = gameData.CardAudio;

        if (tmpCardAudio == null || tmpCardAudio == undefined) {
            
            tmpCardAudio = this._items["MJAudioPublicRes"].CardAudio;
            game = "MJAudioPublicRes";
            gameData = this.getDataByKey(game);
        } 

        var tmplanguageKeys = tmpCardAudio.languageKeys;
        var tmpsexKeys = tmpCardAudio.sexKeys;
        if(tmplanguageKeys[0] == "universal"){//没有方言之分
            language = "universal";
        }
        if(tmpsexKeys[0] == "public"){//没有男女之分
            sex = "public";
        }

        var PrefaxName = tmpCardAudio.PrefaxName; //获得前缀名，如果小选项里指定，则用，没有则用游戏里的指定的
        if (PrefaxName == null || PrefaxName == undefined) {
            PrefaxName = gameData.PrefaxName;
        }

        var path = tmpCardAudio.path + sex + "/"+PrefaxName+language+"_"+sex+"_"+mjid+".mp3";
        return path;

    },



    getChatItemData:function(game,language,sex,item){

        cc.log("wujun ------- getChatItemData ------");

        var retObj = { }
        var gameData = this.getDataByKey(game);
        var tmpchat = gameData.chat;
        if (tmpchat.useOther != null || tmpchat.useOther != undefined) {
            game = tmpchat.useOther.name;
            gameData = this.getDataByKey(game);
            tmpchat = gameData.chat
        } 
        var tmplanguageKeys = tmpchat.languageKeys;
        var tmpsexKeys = tmpchat.sexKeys;
        if(tmplanguageKeys[0] == "universal"){//没有方言之分
            language = "universal";
        }
        if(tmpsexKeys[0] == "public"){//没有男女之分
            sex = "public";
        }

        var tmpValues = tmpchat[language][sex];
        var tmpKeys = Object.keys(tmpValues);
        var PrefaxName = gameData.PrefaxName;
      
        retObj.index = tmpValues[tmpKeys[item]].index;
        retObj.content = tmpValues[tmpKeys[item]].content;
        retObj.sound = tmpchat.path + PrefaxName + language + "_" + sex + "_" + tmpValues[tmpKeys[item]].sound;
      

        return retObj;
    },

    getChatData:function(game,language,sex){ //展示快捷语音面板用

        cc.log("wujun ------- getChatData ------");

        var retObj = { }
        var gameData = this.getDataByKey(game);
        var tmpchat = gameData.chat;
        if (tmpchat.useOther != null || tmpchat.useOther != undefined) {
            game = tmpchat.useOther.name;
            gameData = this.getDataByKey(game);
            tmpchat = gameData.chat
        } 
        var tmplanguageKeys = tmpchat.languageKeys;
        var tmpsexKeys = tmpchat.sexKeys;
        if(tmplanguageKeys[0] == "universal"){//没有方言之分
            language = "universal";
        }
        if(tmpsexKeys[0] == "public"){//没有男女之分
            sex = "public";
        }

        var tmpValues = tmpchat[language][sex];
        var tmpKeys = Object.keys(tmpValues);

        var PrefaxName = tmpchat.PrefaxName; //获得前缀名，如果小选项里指定，则用，没有则用游戏里的指定的
        if (PrefaxName == null || PrefaxName == undefined) {
            PrefaxName = gameData.PrefaxName;
        }

        for (let iii = 0; iii < tmpKeys.length; iii++) {
            retObj[tmpKeys[iii]] = {};
            retObj[tmpKeys[iii]].index = tmpValues[tmpKeys[iii]].index;
            retObj[tmpKeys[iii]].content = tmpValues[tmpKeys[iii]].content;
            retObj[tmpKeys[iii]].sound = tmpchat.path +  PrefaxName + language + "_" + sex + "_" + tmpValues[tmpKeys[iii]].sound;
        }

        return retObj;
    },        


    //获取创建房间参数

    // getCreatRoomIndex:function(game,opType){

    //     cc.log("wujun ------- getCreatRoomIndex ------");

    //     //console.log(Object.keys(tmp));
    //     //console.log(conf);
    //     //console.log(tmp[conf.game]["wanfa"+conf.opType])
    //     var gameData = this.getDataByKey(game);
    //     var confCfg = gameData["map"+opType];
    //     return confCfg.createRoomIndex
    // },

    getKeyFormValue:function(game,opType,item,value){

        cc.log("wujun ------- getKeyFormValue ------");

        var gameData = this.getDataByKey(game);
        var confCfg = gameData["map"+opType];

        var tmpVals = confCfg[item].value;

        for(let i = 0 ;i<tmpVals.length;i++){
            if(tmpVals[i] == value){
                return confCfg[item].key[i] 
            }
        }
    },

    getValueFormKey:function(game,opType,item,key){

        cc.log("wujun ------- getValueFormKey ------");

        var gameData = this.getDataByKey(game);
        var confCfg = gameData["map"+opType];
        var tmpKeys = confCfg[item].key;

        for(let i = 0 ;i<tmpKeys.length;i++){
            if(tmpKeys[i] == key){
                return confCfg[item].value[i] 
            }
        }
    },


    getChangeConf:function(conf){

        cc.log("wujun ------- getChangeConf ------");

        //console.log(Object.keys(tmp));
        //console.log(conf);
        //console.log(tmp[conf.game]["wanfa"+conf.opType])
        var gameData = this.getDataByKey(conf.game);
        var confCfg = gameData["map"+conf.opType];

        conf.nSeats = confCfg.nSeats.value[conf.nSeats];
        conf.maxGames = confCfg.maxGames.value[conf.jushuxuanze];
        return conf;
    },



    getWanfa:function(conf){

        cc.log("wujun ------- getWanfa ------");
        
        // var tmp = cc.vv.GameConfig;
        // console.log(tmp);

        var gameData = this.getDataByKey(conf.game);
        var tmpGameCfg = gameData["wanfa"+conf.opType];
        var tmpGameValue = gameData["map"+conf.opType];
        console.log(tmpGameCfg);

        var tmpKeys = Object.keys(tmpGameCfg);
        var strArr = [];
        strArr.push(tmpGameCfg.gameName);

        for (let index = 1; index < tmpKeys.length; index++) { //从1开始，0为游戏名称
            const keyname = tmpKeys[index];

            var tmpstr = ''
            
            if(tmpGameCfg[keyname]){ //true 以下标取值  false 确定值

                var tmpint = -1;
                if(typeof(conf[keyname]) == "boolean"){
                    tmpint = conf[keyname] == false ? 1 : 0;
                }else{
                    tmpint = conf[keyname] 
                }

                tmpstr = tmpGameValue[keyname].desc[tmpint];
            } else{ 
                for (let index = 0; index < tmpGameValue[keyname].value.length; index++) {
                    const element = tmpGameValue[keyname].value[index];
                    if(element == conf[keyname]){
                        tmpstr = tmpGameValue[keyname].desc[index];
                        break;
                    }
                }
            }
            strArr.push(tmpstr);               
        }

        return strArr.join(' ');
    }, 
    
    //动态加载GameNetMgr
    LoadGameNetMgr:function () {

        var allGameName = this.getDataByKey('allGameName');
        var GameNum = allGameName.length;
        for (let index = 0; index < GameNum; index++) {
            const element = allGameName[index];

            var gameData = this.getDataByKey(element);

            var NetMgrName = gameData.NetMgr;
            
            var EXEstring = 'cc.vv.' + NetMgrName +' = new (require("' + NetMgrName + '"))();' 

            console.log(EXEstring);
            eval(EXEstring);
        }        
    },

    //初始gameNetMgr消息监听
    initGameNetMgr:function (gameName) {
        var gameData = this.getDataByKey(gameName);

        var EXEstring = "cc.vv."+gameData.NetMgr+".init();" +
                        "cc.vv."+gameData.NetMgr+".initHandlers();"+
                        "cc.vv.gameNetMgr = cc.vv."+gameData.NetMgr;
        
        console.log(EXEstring);
        eval(EXEstring);
    },

    //清除所胡游戏的消息监听
    clearAllGameNetMgr:function () {
       
        var allGameName = this.getDataByKey('allGameName');
        var GameNum = allGameName.length;

        var EXEstring = '';
        for (let index = 0; index < GameNum; index++) {
            const element = allGameName[index];

            var gameData = this.getDataByKey(element);

            var NetMgrName = gameData.NetMgr;

            
            EXEstring = EXEstring + 'cc.vv.' + NetMgrName  +  '.clearHandlers(); ' 
            
                      
        } 
        console.log(EXEstring);
        eval(EXEstring); 
        
    },

    //根据游戏和人数加载不同的游戏场景
    LoadFireFromGame:function (gameName,Peoples) {
        var gameData = this.getDataByKey(gameName);
        var fires = gameData.Fire;
        var firename = fires[Peoples];

        var EXEstring = 'cc.director.loadScene("' + firename +  '");' ;
        console.log(EXEstring);
        eval(EXEstring);  
        
    },


    //得到语言配置
    getCardAudio:function () {
        
        var gameName = cc.vv.SelectRoom.getGameName();
        var gameData = this.getDataByKey(gameName);
        if (gameData.CardAudio == null || gameData.CardAudio == undefined) {
            gameData = this.getDataByKey("MJAudioPublicRes");
        } 

        return gameData.CardAudio;
    },

    //得到设置界面样式序号 0 音乐 音效 桌布    1 音乐 音效 桌布 语言  2 音乐  音效 
    getConfigFace:function () { 
        var gameName = cc.vv.SelectRoom.getGameName();
        var gameData = this.getDataByKey(gameName);
        return gameData.languageInterface;
    }
}