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
        
        bgItem: {
            default: null,
            type: cc.Sprite
        },
        bgFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        headNode: {
            default: null,
            type: cc.Node
        },
        lblName: {
            default: null,
            type: cc.Label
        },
        lblID: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (data) {
        this.appLyData = data;

        this.initBg();
        this.initPlayerInfo();
    },

    initBg: function () {
        var frameIndex = this.appLyData.itemIndex % 2;
        this.bgItem.spriteFrame = this.bgFrames[frameIndex];
    },

    initPlayerInfo: function () {
        var headLoader = this.headNode.getComponent("ImageLoader");
        if(headLoader && this.appLyData.userId && this.appLyData.userId > 0){
            headLoader.setUserID(this.appLyData.userId);
        }

        this.lblName.string = this.appLyData.name;
        this.lblID.string = this.appLyData.userId.toString();
    },

    onCancalBlackListClicked: function () {
        //cc.log("取消黑名单");
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            clubid:cc.vv.clubview.viewData.clubsInfo.clubInfo.id,
            userid:cc.vv.userMgr.userid,
            users:this.appLyData.userId,
            status:3,
        }
        cc.vv.userMgr.operateClub(data,function(ret){
            if(ret.errcode === 0 ){
              this.node.destroy();
              cc.vv.clubmemberlistview.lastid = 0; //重新请求一次
              cc.vv.clubmemberlistview.requestBlackList();

            }else{
                cc.vv.alert.show("操作失败")
            }
        }.bind(this))
    },

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
