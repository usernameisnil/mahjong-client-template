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
        lblName: {
            default: null,
            type: cc.Label
        },

        lableTime:{
            default:null,
            type:cc.Node,
        },

        btnInvate:{
            default:null,
            type:cc.Button,
        },

        ntime:null,

        IntervalID:null,
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (data) {
        this.invateItemData = data;
        this.lableTime.active = false;
        this.ntime = data.nTime;
        this.IntervalID = 0;
        // this.initBg();
        this.initPlayerInfo();

        if(data.nTime > 0){
            this.changItemLable(this.ntime);
            this.lableTime.active = true;
            this.btnInvate.interactable = false;

            this.ntime = data.nTime;
            this.IntervalID = setInterval(function () {
                this.ntime = this.ntime -1;
                this.changItemLable(this.ntime);
                if (this.ntime < 1){
                    this.lableTime.active = false;
                    this.btnInvate.interactable = true;
                    clearInterval(this.IntervalID)
                }

            }.bind(this), 1000);
            
        }

    },

    initBg: function () {
        var frameIndex = this.invateItemData.itemIndex % 2;
        this.bgItem.spriteFrame = this.bgFrames[frameIndex];
    },

    initPlayerInfo: function () {
        var headLoader = this.headNode.getComponent("ImageLoader");
        if(headLoader && this.invateItemData.userId && this.invateItemData.userId > 0){
            headLoader.setUserID(this.invateItemData.userId);
        }

        this.lblName.string = this.invateItemData.name;
    },

    changItemLable:function(number){
        
        this.lableTime.getChildByName('lable').getComponent(cc.Label).string = number;
    },
    
    setTimeDown:function(){

    },

    onInvateMemberClicked: function () {
        //console.log(cc.vv.gameNetMgr)
        var self = this;
        var playid = this.invateItemData.userId;

        if(cc.vv.global._space == 'hallClub'){
            var roomid = cc.vv.clubview.ClubInvateRoomId
        }else if (cc.vv.global._space == 'game') {
            var roomid = cc.vv.gameNetMgr.roomId;
        }

        cc.log("邀请亲友圈空闲成员");
        cc.vv.userMgr.SendPlayGame(playid,roomid,function(ret){
            if(ret.errcode===0){

                if (ret.result == false) {
                    cc.vv.alert.show('对方已离线！请邀请别的玩家');
                    self.node.destroy();
                    return;
                }

                
                self.lableTime.active = true;
                self.btnInvate.interactable = false;
                cc.vv.alert.show('邀请成功，请等候回应！')

                self.ntime = 30;
                self.IntervalID = setInterval(function () {
                    this.ntime = this.ntime -1;
                    this.changItemLable(this.ntime);
                    if (this.ntime < 1){
                        this.lableTime.active = false;
                        this.btnInvate.interactable = true;
                        clearInterval(this.IntervalID)
                    }

                }.bind(self), 1000);
                
            }else{
                cc.vv.alert.show('邀请失败！')
            }

        })
    },

    setNtime:function(){
        var objtmp = {};

        objtmp.userId = this.invateItemData.userId;
        objtmp.nTime = this.ntime;

        var clubFriendData = cc.vv.global.clubFriendData;

        
        var isAdd = true;

        for (let i = 0; i < clubFriendData.length; i++) {

            if (clubFriendData[i].userId === this.invateItemData.userId) {
                clubFriendData[i].nTime = this.ntime;
                isAdd = false;
                break;
            }
        }

        if (isAdd) {
            clubFriendData.push(objtmp)
        }

        console.log(cc.vv.global.clubFriendData);

    },

    onDestroy:function(){
        console.log('invateitem')
        if (this.IntervalID !== 0 ){
            clearInterval(this.IntervalID)
        };
        if(this.ntime>2){
            this.setNtime();
        }
        
        
        
    }

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
