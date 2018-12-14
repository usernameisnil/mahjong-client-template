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
        
        memberItem: {
            default: null,
            type:cc.Prefab
        },
        memberScroll: {
            default: null,
            type: cc.ScrollView
        },

        isASK:false,
        oldLastId:0,

    },

    // use this for initialization
    onLoad: function () {

        this.init();
    },

    init: function () {

        cc.vv.clubCardFriendView = this;
        this.memberData = null;

        this.listItems = [];

        this.requestMemberList();

        this.isASK = false;
        this.lastid = 0;
    },

    initScroll: function () {
        var content = this.memberScroll.content;
        content.removeAllChildren();
        this.listItems.splice(0, this.listItems.length);
        this.listItems = [];
    },

    initListScroll_Add: function () {
     
        var listData = this.memberData;
      
        if (listData == null) {
            return;
        }

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }
  
        var content = this.memberScroll.content;

        for (var i = 0; i < list_num; i++) {
            var itemData = listData[i];
            itemData.itemIndex = i+1;
            var item = cc.instantiate(this.memberItem);

            var IScript = item.getComponent('MemberItem');
            itemData.isOwner = false;
            itemData.isMyself = (cc.vv.userMgr.userId === itemData.userId) ? true : false;

            if (IScript) {
                IScript.init(itemData);
            }

            var content_height = content.height;
            var itemLength = item.height;
            item.y = -(content_height + itemLength*0.5);
            content_height = content_height + itemLength;
            content.height = content_height;
            content.addChild(item);

            this.listItems.push(item);
        }
    },

    initListScroll: function () {
        this.initScroll();

        var listData = this.memberData;
        if (listData == null) {
            return;
        }

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }

        var content_height = 0;

        var content = this.memberScroll.content;

        for (var i = 0; i < list_num; i++) {
            var itemData = listData[i];
            itemData.itemIndex = i+1;
            var item = cc.instantiate(this.memberItem);

            var IScript = item.getComponent('MemberItem');
            itemData.isOwner = false;
            itemData.isMyself = (cc.vv.userMgr.userId === itemData.userId) ? true : false;
            
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

    requestMemberList: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0;
        this.oldLastId = lastid;

        var tmpIsAddMe = true;

        cc.vv.userMgr.getMemberList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                //数组转换
                this.memberData = [];
                for (let i = 0; i < ret.list.length; i++) {
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name, 'base64').toString();
                    tmpobj.time = ret.list[i].login_time;
                    tmpobj.state = ret.list[i].online;
                    tmpobj.isClubOwner = (ret.list[i].lv === 10) ? true : false;

                    if(tmpobj.userId == cc.vv.userMgr.userId){
                        tmpIsAddMe = false;
                    }

                    this.memberData.push(tmpobj);
                }

                if(ret.list.length < 10){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                }


                if(tmpIsAddMe){
                    var tmpobj = {};
                    tmpobj.userId = cc.vv.userMgr.userId;
                    tmpobj.name = cc.vv.userMgr.userName
                    tmpobj.time = null;
                    tmpobj.state = 1;
                    tmpobj.isClubOwner = (cc.vv.userMgr.lv === 10) ? true : false;
                    this.memberData.push(tmpobj);
                }              

                this.isASK = false;
                this.setMemberDataSort(this.memberData);
                this.initListScroll();

            }else {
                var content = "获取成员列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    requestMemberList_Add: function () {

        if(this.lastid == -1){
            return;
        }

        if(this.lastid == this.oldLastId){
            return;
        }


        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = this.lastid;
        this.oldLastId = lastid;

        cc.vv.userMgr.getMemberList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                //数组转换
                this.memberData = [];
                for (let i = 0; i < ret.list.length; i++) {
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name, 'base64').toString();
                    tmpobj.time = ret.list[i].login_time;
                    tmpobj.state = ret.list[i].online;
                    tmpobj.isClubOwner = (ret.list[i].lv === 10) ? true : false;
                    
                    if(tmpobj.userId != cc.vv.userMgr.userId){
                        this.memberData.push(tmpobj);
                    }                   
                    
                }              

                if(ret.list.length < 10){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                    
                }
                this.isASK = false;          

                this.setMemberDataSort(this.memberData);
                this.initListScroll_Add();

            }else {
                var content = "获取成员列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    setMemberDataSort: function (data) {
        //排序规则：亲友圈主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

        var dataLength = data.length;
        for (var i = 0; i < dataLength; i++) {
            if (data[i].isClubOwner != null && data[i].isClubOwner == true && i > 0) {
                var dataTest1 = this.getBeReplacedData(data[0]);
                data[0] = this.getBeReplacedData(data[i]);
                data[i] = this.getBeReplacedData(dataTest1);
                break;
            }
        };


        for (var j = 1; j < dataLength-1; j++) {

            for (var k = j+1; k < dataLength; k++) {

                if (data[k].state > data[j].state || (data[k].state == data[j].state && data[k].time > data[j].time)) {
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

    getLoginTime: function (Time) {
        var createTime = new Date(Time * 1000)
        var year = createTime.getFullYear()
        var month =(createTime.getMonth() + 1).toString()  
        var day = (createTime.getDate()).toString()
        // var hour = (createTime.getHours()).toString()
        // var minute = (createTime.getMinutes()).toString()
        // var seconds = (createTime.getSeconds()).toString()
        if (month.length == 1) {  
            month = "0" + month
        }  
        if (day.length == 1) {  
            day = "0" + day
        }  
        // if (hour.length == 1) {  
        //     hour = "0" + hour  
        // }  
        // if (minute.length == 1) {  
        //     minute = "0" + minute  
        // }  
        // if (seconds.length == 1) {
        //     seconds = "0" + seconds
        // }
        var timeString = year + "/" + month + "/" + day;
        return timeString;
        
    },


    AddListScroll: function () {
        //开始请求数据
        console.log('开始请求数据 AddListScroll');
        this.requestMemberList_Add();

    },

    clubCardsScrollBack:function(event){
        var item = event.content.children;
        var item_len = item.length;

        var last_item = item[item_len - 1];
        var targetWordPoint = last_item.convertToWorldSpace(last_item.x, last_item.y);
        
        //在0到-100请求一次后面数据

        if(targetWordPoint.y >-100 && targetWordPoint.y < 0){
            this.isASK = true;
            this.AddListScroll()            
        }
        //console.log( targetWordPoint);
    },

    onDestroy: function () {
        
    }

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
