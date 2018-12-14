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
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (data) {
        this.setupClubData = data;

        this.initBg();
        this.initPlayerInfo();
    },

    initBg: function () {
        var frameIndex = this.setupClubData.itemIndex % 2;
        this.bgItem.spriteFrame = this.bgFrames[frameIndex];
    },

    initPlayerInfo: function () {
        var headLoader = this.headNode.getComponent("ImageLoader");
        if(headLoader && this.setupClubData.ownerUserId && this.setupClubData.ownerUserId > 0){
            headLoader.setUserID(this.setupClubData.ownerUserId);
        }

        this.lblName.string = this.setupClubData.clubName;
        
    },

    onInvateClicked: function () {

        var clubId = this.setupClubData.clubId;
        var clubName = this.setupClubData.clubName;
        cc.vv.userMgr.getClubShare(clubId, function (ret) {
            if (ret.errcode === 0) {

                var title = "<燕赵麻将>";
                title = "俱乐部ID:" + clubId + " " + title;
                var content = cc.vv.userMgr.userName + "俱乐部主邀请您加入" + clubName + "俱乐部。";
                cc.vv.anysdkMgr.share_club(title, content, false, ret.url);
            } else {
                cc.vv.alert.show('获取分享链接失败');
            }
        })
    },
   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
