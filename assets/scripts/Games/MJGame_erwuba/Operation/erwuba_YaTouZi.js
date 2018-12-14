cc.Class({
    extends: cc.Component,

    properties: {
        radioButtonArray: {
            default: [],
            type: cc.Node
        },
        scoreNode: {
            default: null,
            type: cc.Node
        },
        scoreButtonArray: {
            default: [],
            type: cc.Node
        },
        lblTip: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () { 

        this.initTZRadioButton();
        this.initScoreRadioButton();

        var self = this;
        this.node.on("rb-updated", function(event) {
            var id = event.detail.id;
            var groupid = event.detail.groupId;
            
            if (groupid == 2300) {
                if (id == 0) {
                    self.showScoreNode(false);
                }else {
                    self.showScoreNode(true);
                }
            }
        });
        
        // this.showView(false);
        
        // this.init(2);
    },

    showView: function (isShow) {
        this.node.active = isShow;
    },

    showScoreNode: function (isShow) {
        this.scoreNode.active = isShow;
    },

    init: function (gameType, number) {
        
        this.initData();
        this.typeTZData = this.getGameTypeData(gameType);
        if (this.typeTZData == null) {
            return;
        }
        this.initView();
        this.showScoreNode(false);
        this.setTip(number);
        // this.showView(true);
    },

    getGameTypeData: function (gameType) {
        var typeTZData = null;
        if (gameType == 1) {
            typeTZData = this.gameTZData["159"];
        }else if (gameType == 2) {
            typeTZData = this.gameTZData["258"];
        }

        return typeTZData;
    },

    initView: function () {

        var btnCount = this.radioButtonArray.length;
        var btnShowCount = this.typeTZData.length;
        
        for (var i = 0; i < btnShowCount; i++) {
            this.radioButtonArray[i].active = true;
            var lblTypeName = this.radioButtonArray[i].getChildByName("title").getComponent("cc.Label");
            lblTypeName.string = this.typeTZData[i].name;
        };

        var hideCount = btnCount - btnShowCount;
        for (var i = 0; i < hideCount; i++) {
            var hideIndex = btnShowCount + i;
            this.radioButtonArray[hideIndex].active = false;
        };
      
    },

    initTZRadioButton: function () {
        this.rbTZJSArray = [];

        for (var i = 0; i < this.radioButtonArray.length; i++) {
            var rbScript = this.radioButtonArray[i].getComponent("RadioButton");
            if (rbScript) {
                this.rbTZJSArray.push(rbScript);
            }
        };
    },

    initScoreRadioButton: function () {
        this.rbScoreJSArray = [];

        for (var i = 0; i < this.scoreButtonArray.length; i++) {
            var rbScript = this.scoreButtonArray[i].getComponent("RadioButton");
            if (rbScript) {
                this.rbScoreJSArray.push(rbScript);
            }
        };
    },

    getRadioChoice: function (rbJSArray) {
        var radioFields = -1;
        
        for (var j = 0; j < rbJSArray.length; j++) {
            if(rbJSArray[j].checked){
                radioFields = j;
            }  
        };
        
        return radioFields;
    },

    setTip: function (number) {
        if (number <= 0) {
            this.lblTip.string = "";
        }else {
            this.lblTip.string = number.toString() + "个玩家已压头子";
        }
    },

    onBtnSureClicked: function () {
        var rbTZIndex = this.getRadioChoice(this.rbTZJSArray);
        var rbScoreIndex = this.getRadioChoice(this.rbScoreJSArray);

        cc.log("wujun", "this.typeTZData = ", this.typeTZData);

        var sendNumber = 0;
        if (rbTZIndex != 0) {
            var typeNumber = this.typeTZData[rbTZIndex].type;

            sendNumber = typeNumber*10 + (rbScoreIndex+1);
        }
        cc.log("wujun", "sendNumber = ", sendNumber);
        cc.vv.net.send("xiapao",sendNumber);

        // cc.vv.gameNetMgr.setTouZiData(this.typeTZData[rbTZIndex].type, this.typeTZData[rbTZIndex].name);
        // this.showView(false);
    },


    initData: function () {
        this.gameTZData = {
            "159" : [
                {
                    type : 0,
                    name : "不压头子"
                },
                {
                    type : 1,
                    name : "烂头子"
                },
                {
                    type : 7,
                    name : "纯硬头子"
                },
                {
                    type : 8,
                    name : "素胡头子"
                }
            ],
            "258" : [
                {
                    type : 0,
                    name : "不压头子"
                },
                {
                    type : 1,
                    name : "烂头子"
                },
                {
                    type : 2,
                    name : "自摸头子"
                },
                {
                    type : 3,
                    name : "门清/吃碰听头子"
                },
                {
                    type : 4,
                    name : "147头子"
                },
                {
                    type : 5,
                    name : "258头子"
                },
                {
                    type : 6,
                    name : "369头子"
                },
                {
                    type : 7,
                    name : "纯硬头子"
                }
            ]
        }
    },
});