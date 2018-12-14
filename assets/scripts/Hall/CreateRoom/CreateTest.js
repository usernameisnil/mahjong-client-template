cc.Class({
    extends: cc.Component,

    properties: {
    	// groupBgFrames: {
    	// 	default: [],
    	// 	type: cc.SpriteFrame
    	// },
    	groupScroll: {
    		default: null,
    		type: cc.ScrollView
		},
		groupGamePlay: {
    		default: null,
    		type: cc.ScrollView
    	},
    },

    onLoad: function () {
    	this.gameNameArray = cc.CCreateConfigDataModel.getAllGameName();
    	this._groupIndex = 0;
    	this.initRBGroupId = 200;
    	this.gameGroupArray = [];
    	this.gameRBIdData = {};  //radioButton
    	this.gameCBIdData = {};  //checkBox
    	this.gameRBScript = {};  //radioButton
    	this.gameCBScript = {};  //checkBox

    	this.isLoadFrameSuccess = false;
    	this.isRunClubEnable = false;
    	this.addRBAndCBModel();
    	this.initRoomCardFrames();

    	var self = this;
    	this.node.on("rb-updated", function (event) {
    		var id = event.detail.id;
    		var groupId = event.detail.groupId;
	        if (groupId == self.initRBGroupId) {
	            self.updateGame(id);
	        }else {
	        	var IDKey = groupId.toString();
	        	self.gameRBIdData[IDKey].index = id;
	        }     

		});

		this.node.on("cb-updated", function (event) {
    		var id = event.detail.id;
    		var checked = event.detail.checked; 

    		var index = 1;
    		if (checked == true) {
    			index = 0;
    		}
    		var IDKey = id.toString();
    		self.gameCBIdData[IDKey].index = index;

		});

		this.addClickEvent();
    },

    /*******************
	* 游戏名称生成
	*******************/

    showGroupGame: function () {
    	var content = this.groupScroll.content;

    	var itemModel = content.getChildByName("btnGame1");
    	itemModel.active = true;
    	var gameNumber = this.gameNameArray.length;
    	for (var i = 0; i < gameNumber; i++) {
    		var gameName = this.gameNameArray[i];

    		if (i == 0) {
    			this.gameGroupArray.push(itemModel);
    		}else {
    			var item = cc.instantiate(itemModel);
    			content.addChild(item);

    			this.gameGroupArray.push(item);
    		}
    	};

    	for (var j = 0; j < content.childrenCount; j++) {
    		var gameName = this.gameNameArray[j];
    		this.setGroupItem(j, content.children[j], gameName);
    	};
    },

    setGroupItem: function (index, item, gameName) {
    	item.name = "btnGame" + (index+1).toString();
    	var rbScript = item.getComponent("RadioButton");
    	if (rbScript) {
    		if (rbScript.groupId != this.initRBGroupId) {
    			rbScript.delOldGroup();
    			rbScript.groupId = this.initRBGroupId;
    			rbScript.addNewGroup();
			}
			rbScript.index = index;

			if (rbScript.index == this._groupIndex) {
				rbScript.onClicked();
			}
    	
    	}

    	this.setGameName(item, index, gameName, true);
	},

	setGameName: function (item, index, gameName, initGame) {
		var nameNode = item.getChildByName("lblGameName");
    	var lblName = nameNode.getComponent("cc.Label");

    	if (gameName != null && gameName != "") {
    		lblName.string = gameName;
    	}
    	
    	if (index == this._groupIndex) {
    		nameNode.setPosition(cc.v2(-9, 4));
    	}else {
    		nameNode.setPosition(cc.v2(-2, 4));
    	}

    	if (initGame == null || initGame != true) {
			this.setGameNameColor(item, index);
    	}
    	
	},

	setGameNameColor: function (item, index) {
		var nameNode = item.getChildByName("lblGameName");
		if (index == this._groupIndex) {
			nameNode.color = new cc.Color(102, 0, 255);
		}else {
			nameNode.color = new cc.Color(190, 29, 80);
		}
	},

	/*******************
	* 游戏玩法界面生成
	*******************/

	initScriptArray: function () {
		
		for (var rbKey in this.gameRBIdData) {
			delete this.gameRBIdData[rbKey];
		};
		this.gameRBIdData = {};

		for (var cbKey in this.gameCBIdData) {
			delete this.gameCBIdData[cbKey];
		};
		this.gameCBIdData = {};

		for (var rbTypeKey in this.gameRBScript) {
			delete this.gameRBScript[rbTypeKey];
		};
		this.gameRBScript = {};

		for (var cbTypeKey in this.gameCBScript) {
			delete this.gameCBScript[cbTypeKey];
		};
		this.gameCBScript = {};
		
	},

	addRBAndCBModel: function () {
		var content = this.groupGamePlay.content;
		var radioItemModel = content.getChildByName("radioButtonModel");
		this.radioItemModel = cc.instantiate(radioItemModel);

		var checkItemModel = content.getChildByName("checkBoxModel");
		this.checkItemModel = cc.instantiate(checkItemModel);
	},

	showGamePlay: function (gameData) {
			
		var content = this.groupGamePlay.content;
		content.removeAllChildren(true);

		this.initScriptArray();

		this.addCheckBoxs(gameData);
		this.addRadioButtons(gameData);
    },

    addCheckBoxs: function (gameData) {
    	var content = this.groupGamePlay.content;

    	var checkItem = cc.instantiate(this.checkItemModel);
    	content.addChild(checkItem);

    	checkItem.active = true;

    	var checkPlayData = gameData["checkBox"];
    	var checkBoxData = checkPlayData["checkData"];

    	var cbTitleNode = checkItem.getChildByName('checkTitle');
		var cbTitleLabel = cbTitleNode.getComponent("cc.Label");
		cbTitleLabel.string = checkPlayData["title"];

		var cBChoice = checkItem.getChildByName('cBChoice');
		var line = cBChoice.getChildByName('line');
		var cbModel = line.children[0];

    	//checkBox
    	var cbCurrentPosIndex = 0, cbCurrentLineNumber = 1;
		var checkCount = checkBoxData.length;
		for (var i = 0; i < checkCount; i++) {
			var oneData = checkBoxData[i];

			var showLineNumber = 0;
			if (i == 0) {
				var rbData = this.showPlayCB(cbModel, oneData, cbCurrentPosIndex, cbCurrentLineNumber);
				cbCurrentPosIndex = rbData.posIndex;
				cbCurrentLineNumber = rbData.lineNumber;
				showLineNumber = rbData.showLineNumber;
			}else {
				var cbNode = cc.instantiate(cbModel);
				line.addChild(cbNode);

				var rbData = this.showPlayCB(cbNode, oneData, cbCurrentPosIndex, cbCurrentLineNumber);
				cbCurrentPosIndex = rbData.posIndex;
				cbCurrentLineNumber = rbData.lineNumber;
				showLineNumber = rbData.showLineNumber;
			}

			line.height = cbModel.height * showLineNumber;

		};

		var lineChildCount = line.childrenCount;
		for (var j = 0; j < lineChildCount; j++) {
			var cbScript = line.children[j].getComponent("CheckBox");
			if (cbScript) {

				var defaultIndex = checkBoxData[j]["defaultIndex"];

				var typeKey = checkBoxData[j]["showDataType"];
				this.gameCBScript[typeKey] = cbScript;

				var IDKey = j.toString();
				this.gameCBIdData[IDKey] = {};
				this.gameCBIdData[IDKey].type = typeKey;
				this.gameCBIdData[IDKey].index = defaultIndex;

				cbScript.index = j;
				var checked = checkBoxData[j]["transferValueData"][defaultIndex];
				if (checked == true) {
					cbScript.onClicked();
				}
			}
		};

		cBChoice.height = line.height;
		checkItem.height = cBChoice.height;
    },

    showPlayCB: function (node, data, posIndex, lineNumber) {
    	var btnNode = node.getChildByName("button");
		var contentNode = node.getChildByName("title");
		var contentLabel = contentNode.getComponent("cc.Label");

		contentLabel.string = data["content"];

		var allWidth = btnNode.width + contentNode.width;

		var widthMultiple = Math.ceil(allWidth / node.width);

		var showLineNumber = lineNumber;
		if (posIndex + widthMultiple > 3) {
			node.x = -207.5;
			lineNumber++;
			posIndex = 0;
			node.y = -25 - (lineNumber-1) * node.height;
			showLineNumber = lineNumber;
		}else {
			showLineNumber = lineNumber;
			node.y = -25 - (lineNumber-1) * node.height;
			if (posIndex + widthMultiple == 3) {
				lineNumber++;
			}
			node.x = 207.5 * (posIndex - 1);
			posIndex = (posIndex + widthMultiple) % 3;
		}

		var returnData = {
			lineNumber: lineNumber,
			posIndex: posIndex,
			showLineNumber: showLineNumber
		};

		return returnData;
    },

    addRadioButtons: function (gameData) {
    	var content = this.groupGamePlay.content;

    	//radioButton
		var radioButtonDataArr = this.sortRBData(gameData["radioButton"]);

		var contentOtherChildCount = content.childrenCount;
		//确定要显示的RadioButon组数并显示
		var rbNodeCount = radioButtonDataArr.length;
		for (let index = 0; index < rbNodeCount; index++) {
			var item = cc.instantiate(this.radioItemModel);
			item.active = true;
			content.addChild(item);
		}
		
		for (let index = 0; index < rbNodeCount; index++) {
			
			var rbNodeIndex = index + contentOtherChildCount;
			var radioButtonModel = content.children[rbNodeIndex];

			var rbTitleNode = radioButtonModel.getChildByName('radioTitle');
			var rbTitleLabel = rbTitleNode.getComponent("cc.Label");
			rbTitleLabel.string = radioButtonDataArr[index]["title"];

			var tmpnode = radioButtonModel.getChildByName('rBChoice');
			var line = tmpnode.getChildByName('line');
			var rbModel = line.children[0];

			var initRBGroupId = this.initRBGroupId + 200 + index;

			var typeKey = radioButtonDataArr[index]["showDataType"];
			this.gameRBScript[typeKey] = [];

			var IDKey = initRBGroupId.toString();
			this.gameRBIdData[IDKey] = {};
			this.gameRBIdData[IDKey].type = typeKey;
			this.gameRBIdData[IDKey].index = radioButtonDataArr[index]["defaultIndex"];

			

			var showData = radioButtonDataArr[index]["showData"];
			var rbCount = showData.length;
			var rbCurrentPosIndex = 0, rbCurrentLineNumber = 1;
			for (var i = 0; i < rbCount; i++) {

				var showLineNumber = 0;
				if (i == 0) {
					var rbData = this.showPlayRB(rbModel, showData[i], rbCurrentPosIndex, rbCurrentLineNumber);
					rbCurrentPosIndex = rbData.posIndex;
					rbCurrentLineNumber = rbData.lineNumber;
					showLineNumber = rbData.showLineNumber;
				}else {
					var rbNode = cc.instantiate(rbModel);
					line.addChild(rbNode);

					var rbData = this.showPlayRB(rbNode, showData[i], rbCurrentPosIndex, rbCurrentLineNumber);
					rbCurrentPosIndex = rbData.posIndex;
					rbCurrentLineNumber = rbData.lineNumber;
					showLineNumber = rbData.showLineNumber;
				}

				line.height = rbModel.height * showLineNumber;
			};

			for (var k = 0; k < line.childrenCount; k++) {
				this.setGamePlayRadioSubItem(k,initRBGroupId,line.children[k], radioButtonDataArr[index]["defaultIndex"], typeKey); //分配相同的GroupID
			};

			tmpnode.height = line.height;
			radioButtonModel.height = tmpnode.height;
		}
    },

    showPlayRB: function (node, data, posIndex, lineNumber) {

    	var btnNode = node.getChildByName("button");
		var contentNode = node.getChildByName("title");
		var contentLabel = contentNode.getComponent("cc.Label");
		var pngNode = node.getChildByName("card");
		var pngSprite = pngNode.getComponent("cc.Sprite");

		if (typeof data == "string") {
			contentNode.active = true;
			pngNode.active = false;
			contentLabel.string = data;
		}else if (typeof data == "object") {
			contentNode.active = true;
			pngNode.active = true;
			contentLabel.string = data["content"];
			pngSprite.spriteFrame = this.roomCardFrames[data["number"]];
		}else {
			contentNode.active = false;
			pngNode.active = false;
		}

		var pngWidth = 0;
		if (pngNode.active) {
			pngNode.x = contentNode.x + contentNode.width + 5;
			pngWidth = pngNode.width + 5;
		}
		var allWidth = btnNode.width + contentNode.width + pngWidth + 5;

		var widthMultiple = Math.ceil(allWidth / node.width);

		var showLineNumber = lineNumber;
		if (posIndex + widthMultiple > 3) {
			node.x = -207.5;
			lineNumber++;
			posIndex = 0;
			node.y = -25 - (lineNumber-1) * node.height;
			showLineNumber = lineNumber;
		}else {
			showLineNumber = lineNumber;
			node.y = -25 - (lineNumber-1) * node.height;
			if (posIndex + widthMultiple == 3) {
				lineNumber++;
			}
			node.x = 207.5 * (posIndex - 1);
			posIndex = (posIndex + widthMultiple) % 3;
		}

		var returnData = {
			lineNumber: lineNumber,
			posIndex: posIndex,
			showLineNumber: showLineNumber
		};

		return returnData;
    },

    setGamePlayRadioSubItem:function (index,groupID,item, defaultIndex, typeKey) {
		
    	var rbScript = item.getComponent("RadioButton");
    	if (rbScript) {
    		if (rbScript.groupId != groupID) {
    			rbScript.delOldGroup();
				rbScript.groupId = groupID;
				rbScript.addNewGroup();
    		}
			rbScript.index = index;

			if (rbScript.index == defaultIndex) {
				rbScript.onClicked();
			}

			this.gameRBScript[typeKey].push(rbScript);
    	}		
	},

	sortRBData: function (data) {
		var rbData = [];
		var dataNumber = data.length;
		for (var i = dataNumber-1; i >= 0; i--) {
			rbData.push(data[i]);
		};

		return rbData;
	},

	initCreateConfig: function () {
		if (this.createConfig != null && typeof this.createConfig == "object") {
			for (var key in this.createConfig) {
				delete this.createConfig[key];
			};
		}
	},
	
	updateGame: function (id) {
		
		var currentIndex = this._groupIndex;
        this._groupIndex = id;
        this.setGameName(this.gameGroupArray[currentIndex], currentIndex, "");
        this.setGameName(this.gameGroupArray[id], id, "");

        //得到显示数据
		var gameData = cc.CCreateConfigDataModel.getGameDataByGameIndex(id);

		this.initCreateConfig();
		this.createConfig = {
    		type: cc.vv.gameName,
    		opType: gameData["opType"],
    		game: gameData["gameType"]
    	};

		//玩法显示	
		this.showGamePlay(gameData["roomData"]);             
    },

    /***********************
    * 界面初始化完毕 *
    * 1、按钮点击事件监听 *
    * 2、俱乐部默认房间玩法 *
    ********************88*/
    
    // 1
    
    addClickEvent: function () {

    	var bodyNode = this.node.getChildByName("body");
    	var backButton = bodyNode.getChildByName("btn_back");
    	cc.vv.utils.addClickEvent(backButton,this.node,"CreateTest","onCloseLayerClicked");

    	var bottomNode = bodyNode.getChildByName("bottom");
    	var yikaiButton = bottomNode.getChildByName("btnYiKai");
    	cc.vv.utils.addClickEvent(yikaiButton,this.node,"CreateTest","onYiKaiClicked");

    	var daikaiButton = bottomNode.getChildByName("btnDaiKai");
    	cc.vv.utils.addClickEvent(daikaiButton,this.node,"CreateTest","onDaiKaiClicked", "DaiKai");

    	var chuangjianButton = bottomNode.getChildByName("btnChuangjian");
    	cc.vv.utils.addClickEvent(chuangjianButton,this.node,"CreateTest","onCreateRoomClicked", "ChuangJian");

    	var quedingButton = bottomNode.getChildByName("btnQueDing");
    	cc.vv.utils.addClickEvent(quedingButton,this.node,"CreateTest","onSureClubPlayClicked", "Club");
    },

    showButton: function (isClub) {
    	var bodyNode = this.node.getChildByName("body");
    	var bottomNode = bodyNode.getChildByName("bottom");

    	var yikaiButton = bottomNode.getChildByName("btnYiKai");
    	var daikaiButton = bottomNode.getChildByName("btnDaiKai");
    	var chuangjianButton = bottomNode.getChildByName("btnChuangjian");
    	var quedingButton = bottomNode.getChildByName("btnQueDing");

    	yikaiButton.active = !isClub;
    	daikaiButton.active = !isClub;
    	chuangjianButton.active = !isClub;
    	quedingButton.active = isClub;
    },

    onCloseLayerClicked: function () {
    	cc.vv.utils.showDialog(this.node, 'body', false);
    },

    onDaiKaiClicked: function (event, customEventData) {
    	var self = this;
        cc.vv.audioMgr.playButtonClicked();
        this._customEventData = customEventData;
        var replaceCreateRoom = function () {
            cc.vv.hall.isClubRoom = false;
            self.createRoom();
        }

        cc.vv.alert.show("代开房间将预扣元宝，房间在第一局结算时扣除。提前解散不扣元宝，确定要代开房间么？", replaceCreateRoom, true);
    },

    onYiKaiClicked: function () {
		cc.vv.utils.showDialog(this.node, 'body', false);
		cc.vv.hall.onYiKaiClicked();    	
    },

    onCreateRoomClicked: function (event, customEventData) {
    	cc.vv.audioMgr.playButtonClicked();

        this._customEventData = customEventData;
        this.createRoom();
    },

    onSureClubPlayClicked: function (event, customEventData) {
    	cc.vv.audioMgr.playButtonClicked();

    	this._customEventData = customEventData;
    	this.createRoom();
    },

    createRoom: function () {
 	
    	this.setGamePlayData();
    	this.sendCreateRequest();
    },

    setGamePlayData: function () {
    	var addPlayData = cc.CCreateConfigDataModel.getSureGamePlay(this._groupIndex, this.gameRBIdData, this.gameCBIdData);
    	for (var key in addPlayData) {
    		this.createConfig[key] = addPlayData[key];
    	}
    },

    sendCreateRequest: function () {

    	var eventData = this._customEventData;

    	if (eventData == "DaiKai") {
            this.createConfig.daikai = 1;
        }

        var data = {
            client_version:cc.client_version,
            location: cc.vv.GPSMgr.getLocation(),
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(this.createConfig)
        };

        if (this.createConfig.daikai != 1 && this.createConfig.fangzuobi) {

            var chk = cc.vv.GPSMgr.chkGps();
            if (!chk) {
                return;
            }

            if (data.location) {

                var p = JSON.parse(data.location);
                if (p.latitude == null || p.longitude == null) {

                    var locateAccurate = function () {
                        self.gpsChkFlag = 5;
                        cc.vv.alert.close();
                        cc.vv.wc.show(3);
                        var errorWillCheck = true;
                        cc.vv.GPSMgr.locateAccurate(errorWillCheck);
                    };
                    cc.vv.alert.show("没有GPS定位数据!请定位", locateAccurate, true);
                    return;
                }
            }
        }

        if (eventData == "Club") {
        	data.clubid = this.clubPlayData.clubId;
            data.type = 'clubAuto';
            data.optype = this.createConfig.opType;
            this.sureClubChangeGamePlay(data);

        }else {
        	if(cc.vv.hallreconnect != undefined && cc.vv.hallreconnect != null){
	            cc.vv.hallreconnect.cleanTimeout();//停止大厅重连测试
	            cc.vv.net_hall.endInterval();
	        }

	        cc.vv.http.sendRequest("/create_private_room",data,this.onCreateRoomResult.bind(this),null,true);
        }

        
    },

    onCreateRoomResult: function (ret) {
    	cc.vv.wc.hide();
        if(ret.errcode === 0){
    		this.showView(false);

            cc.CCreateConfigDataModel.clearHallAndInitGameMgr(ret);
            this.requestCreateSuccess(ret);
            
        }else {
        	this.requestCreateFail(ret);
        }
            
    },

    requestCreateFail: function (ret) {

    	var eventData = this._customEventData;

    	var self = this;
    	if (ret.clientErrorCode == -120) {
            cc.vv.alert.show('网络请求失败，请检查网络后再试！');

        }else if (ret.errcode == -102) {
            var content = '当前客户端版本过旧，请退出后重新登录!';
            cc.vv.alert.show(content);

        }else if (ret.errcode == 2222) {
            if (eventData == "DaiKai") {
                setTimeout(function () {
                    cc.vv.alert.show("元宝数不够，不能代开房间！");
                }, 500);
            } else if (eventData == "ChuangJian") {
                cc.vv.alert.show("元宝不足，创建房间失败!");
            }

        } else if (ret.errcode == -1) {
            var tipRoom = function () {
               self.joinCurrentRoom(ret.roomid);
            }
            var content = "您还有正在进行的牌局，现在进入" + ret.roomid + "房间？";
            cc.vv.alert.show(content, tipRoom, true);

        } else if (ret.errcode == 104) {
            cc.vv.alert.show("创建房间失败:俱乐部元宝数少于300");

        } else {
            cc.vv.alert.show("创建房间失败,错误码:" + ret.errcode);

        }
    },

    joinCurrentRoom: function (roomId) {
        cc.vv.userMgr.enterRoom(roomId, function (ret) {
         
            if(ret.clientErrorCode == -120){
                return;
            }
         
            if (ret.errcode == 0) {
                this.showView(false);
            }
            else {
                var content = "房间[" + roomId + "]不存在，请重新输入!";
                if (ret.errcode == 4) {
                    content = "房间[" + roomId + "]已满!";
                } else if (ret.errcode == 5) {
                    content = "房主不能进入自己代开的房间！";
                }
                cc.vv.alert.show(content);
            }
        }.bind(this));
    },

    requestCreateSuccess: function (ret) {

    	var eventData = this._customEventData;

    	if (eventData == "ChuangJian") {
                cc.vv.gameNetMgr.connectGameServer(ret);
               
        } else if (eventData == "DaiKai") {
            
            if (ret.own_card_num == null) {
                cc.log("ret.own_card_num is null");
                return;
            }
            cc.vv.hall.setGems(ret.own_card_num.gems);
            cc.vv.userMgr.gems = ret.own_card_num.gems;

            var self = this;
            var replaceSuccess = function () {
                self.onYiKaiClicked();
            }

            var tipString = "为好友代开房间成功！\n" + "房间号：" + ret.roomid + "\n" + "预扣除：" + ret.cost + "个元宝";
            setTimeout(function () {
                cc.vv.alert.show(tipString, replaceSuccess, true, "replaceCreateRoom");
            }, 500);

        }
    },

    sureClubChangeGamePlay: function (createData) {

    	var isEqual = cc.CCreateConfigDataModel.compareGamePlay( this._groupIndex ,this.clubPlayData, this.createConfig);
    	if (isEqual == true) {
    		this.showView(false);
    	}else {
    		if (this.clubPlayData.playKey != null && this.clubPlayData.playKey == "change") {

    			var changeData = {
                    roomid:this.clubPlayData.roomId,
                    NewConf:createData.conf,
                    clubid:this.clubPlayData.clubId,
                };

				var clubDefaultConf = cc.vv.clubview.viewData.clubsInfo.clubInfo.defaultConf;
				var modefiyConf = JSON.parse(createData.conf);
				
				if (modefiyConf.game != clubDefaultConf.game || modefiyConf.opType != clubDefaultConf.opType) {

					var closeCreateFace = function () {
						cc.vv.utils.showDialog(self.node, 'body', false);
					};

					cc.vv.alert.show("默认玩法已经修改，请重新选择桌子修改!", closeCreateFace, false);
					return;
				} 

                //牌桌的修改玩法
                cc.vv.userMgr.setTableGamePlay(changeData, this.requestChangeClubRoomPlay.bind(this));

    		}else {

    			cc.vv.clubview.isModifyDefaultWanfa = true;//通知正在修改默认玩法，不进行界面刷新
    			cc.vv.userMgr.setClubGamePlay(createData, this.requestChangeClubGamePlay.bind(this));
    		}
    	}
    },

    requestChangeClubRoomPlay: function (ret) {

    	if (ret.clientErrorCode == -120) {
    		return;
        }else if (ret.errcode == 0) {

            this.showView(false);

            //直接进入房间
            cc.vv.userMgr.enterRoom(this.clubPlayData.roomId)
            
        }else {
            var content = "";
            if (ret.errmsg == "ok") {
               content = "设置牌桌失败!";
            }else {
                content = ret.errmsg;//"设置牌桌默认玩法失败!";
            }
            cc.vv.alert.show(content);
        }
    },

    requestChangeClubGamePlay: function (ret) {
    	if (ret.clientErrorCode == -120) {
            return;
        }else if (ret.errcode == 0) {

            setTimeout(() => {
                var content = "设置默认玩法成功!";
                cc.vv.alert.show(content,function(){
                    console.log('已经点击');
                    cc.vv.clubview.isModifyDefaultWanfa = false;
                    //刷新界面
                    cc.vv.clubview.TableSort();
                    cc.vv.clubview.setCenter();
                });                      
                          
                this.showView(false);
               
            }, 2000);
      
            cc.vv.clubview.setCleatTimeObj()
                                                                         
        }else {
            var content = "设置默认玩法失败!";
            cc.vv.alert.show(content);
        }
    },

    // 2
    
    initClubData: function (clubPlayData) {
    	this.clubPlayData = clubPlayData;
    },

    onEnable: function () {

	 	if (this.isLoadFrameSuccess == true) {
		
    		this.runClubCreate();
    	}
    },

    start: function () {
    	
    },

    runClubCreate: function () {

    	this.highlightAllGamePlay();
    	this.setZOrder(10);

		



    	if (this.isClubCreate() == false) {
			
			//创建房间界面打开后，需要默认打开第一个选项
			var clubPlayScript = this.gameGroupArray[0].getComponent("RadioButton");
    		if (clubPlayScript) {
    			clubPlayScript.onClicked();
			}
			this.groupScroll.scrollToTop();
    		this.showButton(false);
    		return;
    	}
    	
    	this.showButton(true);
    	this.showClubPlay();
		this.isRunClubEnable = true;

		if (this._groupIndex > 5) {		

			let  tmpY = this._groupIndex * 117 - 595;
			console.log(tmpY);
			this.groupScroll.scrollToOffset(cc.v2(0,tmpY) , 1)
			//this.groupScroll.content.y  = 297.5 + (this._groupIndex - 6 ) * 150
		} else {
			//this.groupScroll.content.y = 297.5;
			this.groupScroll.scrollToTop();
		}

		


    },

    setZOrder: function (ZOrderValue) {
    	this.node.zIndex = ZOrderValue;
    },

    showClubPlay: function () {

		var KeysNum = Object.keys(this.clubPlayData).length;
    	if (KeysNum == 0 || KeysNum == 2) {
    		return;
    	}

    	var clubGroupIndex = cc.CCreateConfigDataModel.getCroupIndex(this.clubPlayData.game,this.clubPlayData.opType);
    	if (clubGroupIndex == this._groupIndex) {
    		this.initCreateConfig();
			this.createConfig = {
	    		type: cc.vv.gameName,
	    		opType: this.clubPlayData.opType,
	    		game: this.clubPlayData.game
	    	};

    	}else {
    		var clubPlayScript = this.gameGroupArray[clubGroupIndex].getComponent("RadioButton");
    		if (clubPlayScript) {
    			clubPlayScript.onClicked();
    		}
    		
    	}

    	this.sureShowClubPlay();

    	//桌子修改玩法
        if (this.clubPlayData.playKey != null) {
            this.grayOtherGamePlay(clubGroupIndex);
        }

    },

    sureShowClubPlay: function () {

    	for (var rbKey in this.gameRBIdData) {

    		var rbPlayType = this.gameRBIdData[rbKey].type;
    		var rbServerType = cc.CCreateConfigDataModel.getRBServerPlayType(this._groupIndex, rbPlayType);
    		var currentPlayValue = cc.CCreateConfigDataModel.getRBTransferValue(this._groupIndex, this.gameRBIdData[rbKey]);

    		for (var clubKey in this.clubPlayData) {
    			if (rbServerType == clubKey) {
    				if (currentPlayValue != this.clubPlayData[clubKey]) {
    					var index = cc.CCreateConfigDataModel.getRBPlayIndexByValue(this._groupIndex, rbPlayType, this.clubPlayData[clubKey]);
    					this.gameRBScript[rbPlayType][index].onClicked();
    					break;
    				}
    			}
    		}
    	}

    	for (var cbKey in this.gameCBIdData) {

    		var cbPlayType = this.gameCBIdData[cbKey].type;
    		var cbServerType = cc.CCreateConfigDataModel.getCBServerPlayType(this._groupIndex, cbPlayType);
    		var currentPlayValue = cc.CCreateConfigDataModel.getCBTransferValue(this._groupIndex, this.gameCBIdData[cbKey]);

    		for (var clubKey in this.clubPlayData) {
    			if (cbServerType == clubKey) {
    				if (currentPlayValue != this.clubPlayData[clubKey]) {
    					this.gameCBScript[cbPlayType].onClicked();
    					break;
    				}
    			}
    		}
    	}
    },

    grayOtherGamePlay: function (currentGameIndex) {
    	
    	var gameNumber = this.gameGroupArray.length;
    	for (var i = 0; i < gameNumber; i++) {

    		var nameNode = this.gameGroupArray[i].getChildByName("lblGameName");
    		if (i == currentGameIndex) {
    			this.gameGroupArray[currentGameIndex].getComponent("cc.Button").interactable = true;
    		}else {
    			this.gameGroupArray[i].getComponent("cc.Button").interactable = false;
    			nameNode.color = new cc.Color(105, 105, 105);
    		}
    	};

    	var bodyNode = this.node.getChildByName("body");
    	var bottomNode = bodyNode.getChildByName("bottom");
    	var quedingButton = bottomNode.getChildByName("btnQueDing");

    	if (this.clubPlayData.playKey == "see") {
    		quedingButton.active = false;
    	}else if (this.clubPlayData.playKey == "change") {
    		quedingButton.active = true;
    	}
    },

    highlightAllGamePlay: function () {
    	var gameNumber = this.gameGroupArray.length;
    	for (var i = 0; i < gameNumber; i++) {
    		this.gameGroupArray[i].getComponent("cc.Button").enableAutoGrayEffect = true;
    		this.gameGroupArray[i].getComponent("cc.Button").interactable = true;

    		this.setGameNameColor(this.gameGroupArray[i], i);
    	};
    },

    isClubCreate: function () {
    	if (this.clubPlayData == null || this.clubPlayData == undefined) {
    		return false;
    	}
    	return true;
    },

    //加载页面所需房卡资源
    
    initRoomCardFrames: function () {
    	var cardFrameUrls = ["1","2","3","4","5","6","8","12","16"];
    	var commonFrameUrl = "textures/Hall/CreateRoom/652_WeChatKWX_Create_Label_8_";
    	this.roomCardFrames = [];

    	var self = this;
    	var frameNum = cardFrameUrls.length;
    	for (var i = 0; i < frameNum; i++) {
    		var resUrl = commonFrameUrl + cardFrameUrls[i];
    		cc.loader.loadRes(resUrl, cc.SpriteFrame,function(index){
                return  function (err, spriteFrame) {
				  	self.roomCardFrames[index] = spriteFrame;
                    if (index == frameNum-1) {
                    	self.showGroupGame();
                    	self.isLoadFrameSuccess	= true;

                    	if (self.isRunClubEnable == false) {
				    		self.runClubCreate();
				    	}
                    }
                }
            }(i));
    	};
    },

    showView: function (isShow) {
    	this.node.active = isShow;
    },

    update: function () {
    	
    },

    onDestroy: function () {
    	
    },

    
});