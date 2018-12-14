cc.CCreateConfigDataModel = {
	_isInit:false,
    _items:{},
    _noTip:"",
    //初始化加载文档数据
    init:function()
    {
        if(this._isInit)
        {
            cc.error("---------error----------CCreateConfigDataModel has been inited!-----CCreateConfigDataModel:init()");
            return;
        }
        var self = this;
        var filePath="data/CreateConfig";
        cc.loader.loadRes(filePath,cc.Json, function (err,data)
        {
            if(err)
            {
                cc.error(err);
                return;
            }
            self._items=data;
            self._isInit = true;
        })
        return;
    },

    getAllGameName: function () {
        var nameArray = [];
        var gameCount = 0;
        for (var initKey in this._items) {
            nameArray.push("");
            gameCount++;
        }

        for (var nameKey in this._items) {
            var nameIndex = this._items[nameKey]["gameIndex"];
            if (nameIndex >= gameCount) {
                break;
            }
            nameArray[nameIndex] = this._items[nameKey]["gameName"];
        };

        return nameArray;
    },

    getGameDataByGameIndex: function (gameIndex) {
        var gameData = null;
        for (var nameKey in this._items) {
            var nameIndex = this._items[nameKey]["gameIndex"]
            if (nameIndex == gameIndex) {
                gameData = this._items[nameKey];
                break;
            }            
        };
        return gameData;
    },

    getRoomDataByGameIndex: function (gameIndex) {

        var gameData = this.getGameDataByGameIndex(gameIndex);
        if (gameData == null) {
            return;
        }

        return gameData["roomData"];
    },

    getSureGamePlay: function (gameIndex, radioData, checkData) {
        var playData = {};

        for (var rbKey in radioData) {
            var valueData = this.getRBTransferValueData(gameIndex, radioData[rbKey].type);
            var isRealValue = this.getIsRealValue(gameIndex, radioData[rbKey].type);
            if (isRealValue) {
                playData[radioData[rbKey].type] = valueData[radioData[rbKey].index];
            } else {
                playData[radioData[rbKey].type] = radioData[rbKey].index;
            }
        }

        for (var cbKey in checkData) {
            var valueData = this.getCBTransferValueData(gameIndex, checkData[cbKey].type);
            playData[checkData[cbKey].type] = valueData[checkData[cbKey].index]
        }

        var otherData = this.getOtherValueData(gameIndex);
        for (var otherKey in otherData) {
            playData[otherKey] = otherData[otherKey];
        }

        return playData;
    },

    getIsRealValue:function (gameIndex, radioButtonType) {
        var isRealValue = false;
        var roomData = this.getRoomDataByGameIndex(gameIndex);
        var radioButtonArray = roomData["radioButton"];
        var radioNumber = radioButtonArray.length;
        for (var i = 0; i < radioNumber; i++) {
            if (radioButtonArray[i]["showDataType"] == radioButtonType) {
                isRealValue = radioButtonArray[i]["isRealValue"];
                break;
            }
        };

        if (isRealValue == undefined || isRealValue == null) {
            isRealValue = false;
        }

        return isRealValue;
    },

    getRBTransferValueData: function (gameIndex, radioButtonType) {
        var transferValueData = null;

        var roomData = this.getRoomDataByGameIndex(gameIndex);
        var radioButtonArray = roomData["radioButton"];
        var radioNumber = radioButtonArray.length;

        for (var i = 0; i < radioNumber; i++) {
            if (radioButtonArray[i]["showDataType"] == radioButtonType) {
                transferValueData = radioButtonArray[i]["transferValueData"];
                break;
            }
        };

        return transferValueData;
    },

    getRBTransferValue: function (gameIndex, radioButtonData) {
        var valueData = this.getRBTransferValueData(gameIndex, radioButtonData.type);
        return valueData[radioButtonData.index];
    },

    getCBTransferValueData: function (gameIndex, checkBoxType) {
        var transferValueData = null;

        var roomData = this.getRoomDataByGameIndex(gameIndex);
        var checkBoxArray = roomData["checkBox"]["checkData"];
        var checkNumber = checkBoxArray.length;

        for (var i = 0; i < checkNumber; i++) {
            if (checkBoxArray[i]["showDataType"] == checkBoxType) {
                transferValueData = checkBoxArray[i]["transferValueData"];
                break;
            }
        };

        return transferValueData;
    },

    getCBTransferValue: function (gameIndex, checkBoxData) {
        var valueData = this.getCBTransferValueData(gameIndex, checkBoxData.type);
        return valueData[checkBoxData.index];
    },

    getOtherValueData: function (gameIndex) {
        var roomData = this.getRoomDataByGameIndex(gameIndex);
        return roomData["other"];
    },

    getCroupIndex: function (gameType,opType) {
        var gameIndex = -1;
        for (var nameKey in this._items) {
            var gameOpType = this._items[nameKey]["opType"];
            var gameGameType = this._items[nameKey]["gameType"]
            
            if (opType == gameOpType && gameType == gameGameType) {
                gameIndex = this._items[nameKey]["gameIndex"];
                break;
            }            
        };

        if(gameIndex == -1){
            console.log('createConfig，未找到对应配置')
        }

        return gameIndex;
    },

    getRBPlayIndexByValue: function (gameIndex, rbType, rbValue) {

        var updateIndex = 0;

        var valueData = this.getRBTransferValueData(gameIndex, rbType);
        var valueNumber = valueData.length;
        for (var i = 0; i < valueNumber; i++) {
            if (valueData[i] == rbValue) {
                updateIndex = i;
                break;
            }
        };

        return updateIndex;
    },

    getRBServerPlayType: function (gameIndex, radioButtonType) {
        var roomData = this.getRoomDataByGameIndex(gameIndex);
        var radioButtonArray = roomData["radioButton"];
        var radioNumber = radioButtonArray.length;

        var serverType = "";
        for (var i = 0; i < radioNumber; i++) {
            if (radioButtonArray[i]["showDataType"] == radioButtonType) {
                serverType = radioButtonArray[i]["serverDataType"];
                break;
            }
        };

        return serverType;
    },

    getCBServerPlayType: function (gameIndex, checkBoxType) {

        var roomData = this.getRoomDataByGameIndex(gameIndex);
        var checkBoxArray = roomData["checkBox"]["checkData"];
        var checkNumber = checkBoxArray.length;

        var serverType = "";
        for (var i = 0; i < checkNumber; i++) {
            if (checkBoxArray[i]["showDataType"] == checkBoxType) {
                serverType = checkBoxArray[i]["serverDataType"];
                break;
            }
        };

        return serverType;
    },

    getServerPlayData: function (gameIndex) {

        var serverPlayData = [];

        var roomData = this.getRoomDataByGameIndex(gameIndex);

        var radioButtonArray = roomData["radioButton"];
        var radioNumber = radioButtonArray.length;
        for (var i = 0; i < radioNumber; i++) {
            var onePlayData = {};
            onePlayData.localType = radioButtonArray[i]["showDataType"];
            onePlayData.serverType = radioButtonArray[i]["serverDataType"];
            onePlayData.serverValueData = radioButtonArray[i]["transferValueData"];
            serverPlayData.push(onePlayData);
        };

        var checkBoxArray = roomData["checkBox"]["checkData"];
        var checkNumber = checkBoxArray.length;
        for (var j = 0; j < checkNumber; j++) {
            var onePlayData = {};
            onePlayData.localType = checkBoxArray[j]["showDataType"];
            onePlayData.serverType = checkBoxArray[j]["serverDataType"];
            onePlayData.serverValueData = checkBoxArray[j]["transferValueData"];
            serverPlayData.push(onePlayData);
        };

        return serverPlayData;
    },

    getServerDataByType: function (data, localType) {
        
        var serverData = null;
        var serverNumber = data.length;
        for (var i = 0; i < serverNumber; i++) {
            if (data[i].localType == localType) {
                serverData = data[i];
                break;
            }
        };

        return serverData;
    },

    clearHallAndInitGameMgr: function (ret) {

        if (ret.daikai === undefined || ret.daikai  !== 1) {
            cc.vv.net_hall.endSocket();
            cc.vv.net_hall.isPinging = false;
        }     

        if(typeof(cc.vv.gameNetMgr) == 'object' && cc.vv.gameNetMgr != ''){
                
            if (typeof(cc.vv.gameNetMgr.clearHandlers) == 'function') {
                cc.vv.gameNetMgr.clearHandlers();
            }
            cc.vv.gameNetMgr = {};
        }

       
        if (ret.daikai === undefined || ret.daikai  !== 1) {
            cc.CGameConfigDataModel.initGameNetMgr(ret.game);
        }

        
    },

    compareGamePlay: function (gameIndex, clubPlay, changePlay) {

        var isPlayEqual = true;
        var serverTypeData =  this.getServerPlayData(gameIndex);
        for (var changeKey in changePlay) {

            var isExitKey = false;
            var serverData = this.getServerDataByType(serverTypeData, changeKey);
            if (serverData == null) {
                continue;
            }
            var serverValue = serverData.serverValueData[changePlay[changeKey]];
            
            for (var clubKey in clubPlay) {
                if (clubKey == serverData.serverType && clubPlay[clubKey] == serverValue) {
                    isExitKey = true;
                    break;
                }
            };

            if (isExitKey == false) {
                isPlayEqual = false;
                break;
            }
        };

        return isPlayEqual;
    },

    getTipStr: function()
    {
        return this._noTip;
    },  

   
}