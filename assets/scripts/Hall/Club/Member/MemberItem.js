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
        },
        MaskDelNode:{
            default:null,
            type:cc.Node,
        }
        
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (data) {
        this.memberData = data;

        this.initBg();
        this.initPlayerInfo();
        this.initState();

        this.initOperate();

        this.showMaskDel(false);
    },

    initBg: function () {
        var frameIndex = this.memberData.itemIndex % 2;
        this.bgItem.spriteFrame = this.bgFrames[frameIndex];
    },

    showMaskDel:function (isshow,title) {
        this.MaskDelNode.active = isshow;
        if(title != null && title != undefined){
            var label = this.MaskDelNode.getChildByName("label");
            label.getComponent(cc.Label).string = title;
        }
    },

    initPlayerInfo: function () {
        var headLoader = this.headNode.getComponent("ImageLoader");
        if(headLoader && this.memberData.userId && this.memberData.userId > 0){
            headLoader.setUserID(this.memberData.userId);
        }

        this.lblName.string = this.memberData.name;
        this.lblID.string = this.memberData.userId.toString();
    },

    initState: function () {
        var lblOfflineState = this.node.getChildByName("lblOfflineState");
        var lblOfflineTime = this.node.getChildByName("lblOfflineTime");
        var lblPlayingState = this.node.getChildByName("lblPlayingState");
        var lblHall = this.node.getChildByName("lblHallState");

        if (this.memberData.state == 0) {
            lblOfflineState.active = true;
            lblOfflineTime.active = true;
            lblPlayingState.active = false;
            lblHall.active = false;

            if(this.memberData.time !== 0){
                var time_date = cc.vv.global.dateFormat_date(this.memberData.time * 1000);
                var time_time = cc.vv.global.dateFormat_time(this.memberData.time *1000);
        
                var showTime =  time_date + "\n" + time_time;
                lblOfflineState.getComponent("cc.Label").string = "上次登录时间：";
                lblOfflineTime.getComponent("cc.Label").string = showTime;
            }else
            {
                lblOfflineState.getComponent("cc.Label").string = "";
                lblOfflineTime.getComponent("cc.Label").string = "";
            }

        }else if (this.memberData.state == 1) {
            lblOfflineState.active = false;
            lblOfflineTime.active = false;
            lblHall.active = true;
            lblPlayingState.active = false;
        }else if (this.memberData.state == 2) {
            lblOfflineState.active = false;
            lblOfflineTime.active = false;
            lblHall.active = false;
            lblPlayingState.active = true;
        }else {
            lblOfflineState.active = false;
            lblOfflineTime.active = false;
            lblHall.active = false;
            lblPlayingState.active = false;
        }
    },

    hideOperate: function () {
        var btnKickOut = this.node.getChildByName("btnKickOut");
        var btnBlackList = this.node.getChildByName("btnBlackList");
        var btnSignOut = this.node.getChildByName("btnSignOut");

        btnKickOut.active = false;
        btnBlackList.active = false;
        btnSignOut.active = false;
    },

    initOperate: function () {

        var btnKickOut = this.node.getChildByName("btnKickOut");
        var btnBlackList = this.node.getChildByName("btnBlackList");
        var btnSignOut = this.node.getChildByName("btnSignOut");

        if (this.memberData.isClubOwner != null && this.memberData.isClubOwner == true) {
            btnKickOut.active = false;
            btnBlackList.active = false;
            btnSignOut.active = false;
            return;
        }

        btnKickOut.active = this.memberData.isOwner;
        btnBlackList.active = this.memberData.isOwner;
        if (this.memberData.isOwner === false) {
            btnSignOut.active = this.memberData.isMyself;
        } else {
            btnSignOut.active = false;
        }      

    },

    onDeleteClicked: function () {
        //cc.log("踢出");
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            clubid:cc.vv.clubview.viewData.clubsInfo.clubInfo.id,
            userid:cc.vv.userMgr.userid,
            users:this.memberData.userId,
            status:4,
        }
        cc.vv.userMgr.operateClub(data,function(ret){
            if(ret.errcode === 0 ){
                this.showMaskDel(true,"已被踢出");
                this.hideOperate();
              //this.node.destroy();
              //   cc.vv.clubmemberlistview.lastid = 0; //重新请求一次
              //   cc.vv.clubmemberlistview.requestMemberList();

            }else if (ret.errcode === 6) {
                cc.vv.alert.show("玩家正在游戏中，操作被中止！")
            }else{
                cc.vv.alert.show("操作失败")
            }
        }.bind(this))
    },

    onJoinBlackListClicked: function () {
        //cc.log("加入黑名单");

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            clubid:cc.vv.clubview.viewData.clubsInfo.clubInfo.id,
            userid:cc.vv.userMgr.userid,
            users:this.memberData.userId,
            status:2,
        }
        cc.vv.userMgr.operateClub(data,function(ret){
            if(ret.errcode === 0 ){
                this.showMaskDel(true,"已被加入黑名单");
                this.hideOperate();
            //   this.node.destroy();
            //   cc.vv.clubmemberlistview.lastid = 0; //重新请求一次
            //   cc.vv.clubmemberlistview.requestMemberList();

            }else if (ret.errcode === 6) {
                cc.vv.alert.show("玩家正在游戏中，操作被中止！")
            }else{
                cc.vv.alert.show("操作失败")
            }
        }.bind(this))
    },

    onSignOutClicked: function () {
        console.log("退出");
       
         var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            clubid:cc.vv.clubview.viewData.clubsInfo.clubInfo.id,
            userid:this.memberData.userId,
            users:this.memberData.userId,
            status:4,
        }
        cc.vv.userMgr.operateClub(data,function(ret){
            if(ret.errcode === 0 ){
                // var allClubName = cc.vv.clubview.viewData.clubsInfo.allClubName;
                // for (let i = 0; i < allClubName.length; i++) {
                //     if (cc.vv.clubview.viewData.clubsInfo.clubInfo.id === allClubName[i].id) {
                //         allClubName.splice(i,1);
                //         break;
                //     }
                // }
                     
                cc.vv.clubCardFriendView.node.destroy();
                cc.vv.hall.onBtnClubClicked();
                // cc.vv.clubview.showChildView()
                // cc.vv.clubview.showClubView(true);   

            }else if (ret.errcode === 6) {
                cc.vv.alert.show("正在游戏中，操作被中止！")
            }else{
                cc.vv.alert.show("操作失败")
            }
        }.bind(this))
    },

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
