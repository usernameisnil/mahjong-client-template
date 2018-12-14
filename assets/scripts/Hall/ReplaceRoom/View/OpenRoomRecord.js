cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        lbl_roomID:{
            default:null,
            type:cc.Label
        },
        lbl_roomStatus:{
            default:null,
            type:cc.Label
        },
        lbl_createTime:{
            default:null,
            type:cc.Label
        },
        lbl_roomPlay:{
            default:null,
            type:cc.Label
        },
        node_playerList: {
            default:[],
            type:cc.Node
        },   
    },

    onLoad: function() {
    },

    init: function (recordData) {
        this.recordData = recordData;

        this.initUI();
    },

    initUI: function () {
        this.lbl_roomID.string = this.recordData.roomid;
        this.lbl_roomStatus.string = "已结束";
        this.lbl_createTime.string = this.recordData.createTime;
        this.lbl_roomPlay.string = this.recordData.gamePlay;

        this.initPlayer();
    },

    initPlayer: function () {

        var playerNum = this.recordData.playerList.length;
        if (playerNum > 4) {
            return;
        }
        for (var i = 0; i < playerNum; i++) {
            var lbl_name = this.node_playerList[i].getChildByName("name").getComponent("cc.Label");
            var lbl_id = this.node_playerList[i].getChildByName("id").getComponent("cc.Label");
            var lbl_score = this.node_playerList[i].getChildByName("score").getComponent("cc.Label");
            lbl_name.string = this.recordData.playerList[i].name;//cc.vv.utils.getNameStr(this.recordData.playerList[i].name, 9);
            lbl_id.string = "";
            if (this.recordData.playerList[i].userid != undefined) {
                var idString = this.recordData.playerList[i].userid.toString();
                lbl_id.string = idString;
            }else {
                lbl_score.node.x = lbl_id.node.x;
            }
            lbl_score.string = this.recordData.playerList[i].score;
        }

        if (playerNum == 4) {
            return;
        }

        for (var i = playerNum; i < 4; i++) {
            this.node_playerList[i].active = false;
        };
    },

    initUIPosY: function () {

        if (this.playerCount <= 4) {
            this.node.height -= 74;
            var bgNode = this.node.getChildByName("bg");
            if (bgNode != null) {
                bgNode.height -= 74;
            }
            
            //亲友圈和代开的差异
            if (this.recordData.isClub == null || this.recordData.isClub == false) {
                this.lbl_roomID.node.y -= 10;
                this.lbl_createTime.node.y -= 10;
            }else {
                this.lbl_roomID.node.y -= 20;
                this.lbl_createTime.node.y -= 20;
            }

            for (var i = 0, len = this.node_playerList.length; i < len; i++) {
                this.node_playerList[i].y -= 37;
                if (i >= 4) {
                    this.node_playerList[i].active = false;
                }
            };

            this.lbl_roomPlay.node.y += 37;
            var lineNode = this.node.getChildByName("line");
            if (lineNode != null) {
                lineNode.y += 37;
            }
            
        }
    },
});