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
        
        invateItem: {
            default: null,
            type:cc.Prefab
        },
        invateScroll: {
            default: null,
            type: cc.ScrollView
        },

    },

    // use this for initialization
    onLoad: function () {

        this.init();
    },

    init: function () {

        this.invateData = null;

        this.listItems = [];

        this.requestInvateList();
    },

    initScroll: function () {
        var content = this.invateScroll.content;
        content.removeAllChildren();
        this.listItems.splice(0, this.listItems.length);
        this.listItems = [];
    },

    initListScroll: function () {
        this.initScroll();

        var listData = this.invateData;
        if (listData == null) {
            return;
        }

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }

        var content_height = 0;

        var content = this.invateScroll.content;

        for (var i = 0; i < list_num; i++) {
            var itemData = listData[i];
            var item = cc.instantiate(this.invateItem);

            var IScript = item.getComponent('InvateItem');
            itemData.isOwner = false;
            
            if (IScript) {
                IScript.init(itemData);
            }

            var itemLength = item.height;
            item.y = -(content_height + itemLength*0.5);
            content_height = content_height + itemLength;
            content.height = content_height;
            content.addChild(item);

            this.listItems.push(item);
        }
    },

    getUserNtime:function(userId){
       var clubFriendData = cc.vv.global.clubFriendData;
        var nRet = 0;

        for(let i = 0 ;i<clubFriendData.length;i++){

            if (clubFriendData[i].userId === userId){
                nRet = clubFriendData[i].nTime;
                break;
            }
       }

       return nRet;
    },

    requestInvateList: function () {
        //cc.vv.gameNetMgr有麻将、扑克的区别的话，自己修改

        console.log(cc.vv.global._space) ;
      
        if(cc.vv.global._space == 'hallClub'){
            var tmpClubId = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        }else if (cc.vv.global._space == 'game') {
            var tmpClubId = cc.vv.gameNetMgr.conf.clubid;
        }

        cc.vv.userMgr.getClubIdleMember(tmpClubId, function(ret) {

            if (ret.errcode == 0) {
                this.invateData = []
                
                for (var i = 0; i < ret.list.length; i++) {
                    var tmpObj = {};
                    tmpObj.userId = ret.list[i].userid
                    tmpObj.nTime = this.getUserNtime(ret.list[i].userid);
                    tmpObj.name = new Buffer(ret.list[i].name, 'base64').toString();
                    tmpObj.headimg = ret.list[i].headimg;

                    if (cc.vv.userMgr.userId != tmpObj.userId) {//排除自己
                        this.invateData.push(tmpObj);
                    }                    
                    
                }
                
                // this.invateData = [
                //     {userId: 100002, name: "小谁说的子"},
                //     {userId: 100003, name: "说的"},
                //     {userId: 100001, name: "小袍子"},
                //     {userId: 100004, name: "发的人人个子"},
                //     {userId: 100005, name: "哦提供给"},
                //     {userId: 100006, name: "阿诗丹顿"},
                //     {userId: 100007, name: "哦提供给"},
                //     {userId: 100008, name: "阿诗丹顿"},
                // ];
                this.setInvateDataSort(this.invateData);
                this.initListScroll();

            }else {
                var content = "获取邀请空闲成员列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    setInvateDataSort: function (data) {
        //排序规则：亲友圈主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

        var dataLength = data.length;
        for (var j = 0; j < dataLength-1; j++) {

            for (var k = j+1; k < dataLength; k++) {

                if (data[k].name < data[j].name) {
                    var dataTest2 = this.getBeReplacedData(data[j]);
                    data[j] = this.getBeReplacedData(data[k]);
                    data[k] = this.getBeReplacedData(dataTest2);
                }
            };
        };
    },

    getBeReplacedData: function (dataJ) {
        var dataReplace = [];
        for (var key in dataJ) {
            dataReplace[key] = dataJ[key];
        }

        return dataReplace;
    },

    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        this.node.destroy();
    },

    onDestroy: function () {
        
    }

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
