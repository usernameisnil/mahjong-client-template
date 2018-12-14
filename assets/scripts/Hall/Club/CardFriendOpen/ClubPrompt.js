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
        // ...
        
        headNode: {
            default: null,
            type: cc.Node
        },
        lblContent: {
            default: null,
            type: cc.RichText
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.clubPrompt = this;
        this.node.setLocalZOrder(10);
        this.showView(false);
    },

    showView: function (isShow) {
        this.node.active = isShow;
    },

    init: function (data) {

        this.promptData = data;

        this.showView(true);

        this.initPlayerInfo();
    },

    initPlayerInfo: function () {
        var headLoader = this.headNode.getComponent("ImageLoader");
        if(headLoader && this.promptData.userId && this.promptData.userId > 0){
            headLoader.setUserID(this.promptData.userId);
        }

        var playString = this.getGamePlay(this.promptData.conf);
        //+ this.promptData.tableId.toString() + "号桌。"
        var contentString = "<color=#ff7a00>" + this.promptData.invateName + "</c>" + "<color=#363636>" + "邀请您加入" + "</color>" + "<color=#d600ff>" + this.promptData.clubName + "</color>" + "<color=#363636>" + "亲友圈."  + playString + "</color>";
        this.lblContent.string = contentString;
    },



    getGamePlay: function (conf) {

        if (conf && conf.maxGames!=null) {

           return cc.CGameConfigDataModel.getWanfa(conf);
           
        }
        return "";
       
    },

    onJoinClicked: function () {
        //cc.log("加入");
        cc.vv.userMgr.enterRoom(this.promptData.roomid)
    },

    onCancalClicked: function () {
        //cc.log("取消");
        this.showView(false);
    },

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
