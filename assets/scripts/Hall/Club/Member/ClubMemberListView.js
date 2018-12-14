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
        buttonGroup: {
            default: [],
            type: cc.Node
        },
        titleGroup: {
            default: [],
            type: cc.Node
        },
        listItem: {
            default: [],
            type:cc.Prefab
        },
        listScroll: {
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

        cc.vv.clubmemberlistview = this;
        this.applyData = null;
        this.memberData = null;
        this.blackData = null;

        this.listItems = [];
        this.toggleIndex = 0;

        this.requestApplyList();

        this.isASK = false;
        this.lastid = 0;
        

        // this.initToggle();
        // this.initScroll();
    },

    initToggle: function () {

        var rbScript = this.buttonGroup[this.toggleIndex].getComponent("RadioButton");
        cc.vv.radiogroupmgr.check(rbScript);

        for (var i = 0, titleCount = this.titleGroup.length; i < titleCount; i++) {
            var isShowTitle = (i == this.toggleIndex)?true:false;
            this.titleGroup[i].active = isShowTitle;
        };

        var applyTop = this.node.getChildByName("applyTop");
        var memberTop = this.node.getChildByName("memberTop");
        if (this.toggleIndex == 0) {
            applyTop.active = true;
            memberTop.active = false;
        }else if (this.toggleIndex == 1) {
            applyTop.active = false;
            memberTop.active = true;
        }else if (this.toggleIndex == 2) {
            applyTop.active = false;
            memberTop.active = false;
        }
    },

    initScroll: function () {
        var content = this.listScroll.content;
        content.removeAllChildren();
        this.listItems.splice(0, this.listItems.length);
        this.listItems = [];
    },

    initListScroll: function (isSearch, searchData) {
        this.initToggle();
        this.initScroll();

        var listData = null;
        if (isSearch == true) {
            listData = searchData;
        }else if (this.toggleIndex == 0) {
            listData = this.applyData;
        }else if (this.toggleIndex == 1) {
            listData = this.memberData;
        }else if (this.toggleIndex == 2) {
            listData = this.blackData;
        }

        if (listData == null) {
            return;
        }

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }

        var content_height = 0;

        var content = this.listScroll.content;

        for (var i = 0; i < list_num; i++) {
            var itemData = listData[i];
            itemData.itemIndex = i+1;
            var item = cc.instantiate(this.listItem[this.toggleIndex]);

            var IScript = null;
            if (this.toggleIndex == 0) {
                IScript = item.getComponent('ApplyItem');
            }else if (this.toggleIndex == 1) {
                IScript = item.getComponent('MemberItem');
                itemData.isOwner = true;
            }else if (this.toggleIndex == 2) {
                IScript = item.getComponent('BlackListItem');
                itemData.isOwner = true;
            }

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

    initListScroll_Add: function () {
     
        var listData = null;
        if (this.toggleIndex == 0) {
            listData = this.applyData;
        }else if (this.toggleIndex == 1) {
            listData = this.memberData;
        }else if (this.toggleIndex == 2) {
            listData = this.blackData;
        }

        if (listData == null) {
            return;
        }

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }
  
        var content = this.listScroll.content;

        for (var i = 0; i < list_num; i++) {
            var itemData = listData[i];
            itemData.itemIndex = i+1;
            var item = cc.instantiate(this.listItem[this.toggleIndex]);

            var IScript = null;
            if (this.toggleIndex == 0) {
                IScript = item.getComponent('ApplyItem');
            }else if (this.toggleIndex == 1) {
                IScript = item.getComponent('MemberItem');
                itemData.isOwner = true;
            }else if (this.toggleIndex == 2) {
                IScript = item.getComponent('BlackListItem');
                itemData.isOwner = true;
            }

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

    requestApplyList: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0
        this.oldLastId = lastid;
        cc.vv.userMgr.getApplyList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                //数组转换
                this.applyData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name,'base64').toString();  
                    tmpobj.time = ret.list[i].login_time
                    tmpobj.state = ret.list[i].status;
                    //tmpobj.isClubOwner =  (ret.list[i].lv === 10 )?true:false;
                    this.applyData.push(tmpobj);
                }

                if(ret.list.length == 0){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                }
                this.isASK = false;
                this.setApplyDataSort(this.applyData);

                this.memberData = null;
                this.blackData = null;

                this.toggleIndex = 0;
                this.initListScroll(false, null);

            }else {
                var content = "获取申请列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    requestApplyList_Add: function () { //向列表加入数据用

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = this.lastid;

        if(this.lastid == -1){
            return;
        }
        if(this.lastid == this.oldLastId){
            return;
        }

        this.oldLastId = this.lastid;

        cc.vv.userMgr.getApplyList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                //数组转换
                this.applyData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name,'base64').toString();  
                    tmpobj.time = ret.list[i].login_time
                    tmpobj.state = ret.list[i].status;
                    //tmpobj.isClubOwner =  (ret.list[i].lv === 10 )?true:false;
                    this.applyData.push(tmpobj);
                }


                if(ret.list.length == 0){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                }
                
                this.isASK = false;

                this.setApplyDataSort(this.applyData);

                this.memberData = null;
                this.blackData = null;
               
                this.initListScroll_Add();

            }else {
                var content = "获取申请列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },





    requestMemberList: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0
        this.oldLastId = 0;
        cc.vv.userMgr.getMemberList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                // this.memberData = ret;
                //state：登录状态（0：离线状态；1：在线空闲中；2：在线游戏中）

                //数组转换
                this.memberData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    if(ret.list[i].name === undefined){
                        tmpobj.name = ''
                    }else{
                        tmpobj.name = new Buffer(ret.list[i].name,'base64').toString(); 
                    }
                    
                    tmpobj.time = ret.list[i].login_time;
                    tmpobj.state = ret.list[i].online;
                    tmpobj.isClubOwner =  (ret.list[i].lv === 10 )?true:false;
                    this.memberData.push(tmpobj);
                }

                if(ret.list.length == 0){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                }
                this.isASK = false;                
            
                this.setMemberDataSort(this.memberData);

                this.applyData = null;
                this.blackData = null;

                this.toggleIndex = 1;
                this.initListScroll(false, null);

            }else {
                var content = "获取成员列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },


    requestMemberList_Add: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = this.lastid;
        if(lastid == -1){
            return;
        }
        if(this.lastid == this.oldLastId){
            return;
        }
        this.oldLastId = this.lastid;
        cc.vv.userMgr.getMemberList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                // this.memberData = ret;
                //state：登录状态（0：离线状态；1：在线空闲中；2：在线游戏中）

                //数组转换
                this.memberData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    if(ret.list[i].name === undefined){
                        tmpobj.name = ''
                    }else{
                        tmpobj.name = new Buffer(ret.list[i].name,'base64').toString(); 
                    }
                    
                    
                    tmpobj.time = ret.list[i].login_time;
                    tmpobj.state = ret.list[i].online;
                    tmpobj.isClubOwner =  (ret.list[i].lv === 10 )?true:false;
                    this.memberData.push(tmpobj);
                }

                if(ret.list.length == 0){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                }
                this.isASK = false;                
            
                this.setMemberDataSort(this.memberData);

                this.applyData = null;
                this.blackData = null;
              
                this.initListScroll_Add();

            }else {
                var content = "获取成员列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    requestBlackList: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0;
        this.oldLastId = 0;
        cc.vv.userMgr.getBlackList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                this.blackData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name,'base64').toString(); 
                  
                    this.blackData.push(tmpobj);
                }
               
                if(ret.list.length == 0){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                }
                this.isASK = false;
              
                this.setBlackDataSort(this.blackData);

                this.applyData = null;
                this.memberData = null;

                this.toggleIndex = 2;
                this.initListScroll(false, null);

            }else {
                var content = "获取黑名单失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    requestBlackList_Add: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = this.lastid;
        if(lastid == -1){
            return;
        }
        if(this.oldLastId == this.lastid){
            return;
        }
        this.oldLastId = this.lastid;
        cc.vv.userMgr.getBlackList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                this.blackData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name,'base64').toString(); 
                  
                    this.blackData.push(tmpobj);
                }
               
                if(ret.list.length == 0){
                    this.lastid = -1 //代表已经请求完毕
                } else {
                    this.lastid = ret.list[ret.list.length - 1].id; //最后的lastid
                }
                this.isASK = false;
              
                this.setBlackDataSort(this.blackData);

                this.applyData = null;
                this.memberData = null;
              
                this.initListScroll_Add();

            }else {
                var content = "获取黑名单失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    setApplyDataSort: function (data) {
        //排序规则：俱乐部主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

        var dataLength = data.length;
        for (var j = 0; j < dataLength-1; j++) {

            for (var k = j+1; k < dataLength; k++) {

                if (data[k].state < data[j].state || (data[k].state == data[j].state && data[k].time > data[j].time)) {
                    var dataTest2 = this.getBeReplacedData(data[j]);
                    data[j] = this.getBeReplacedData(data[k]);
                    data[k] = this.getBeReplacedData(dataTest2);
                }
            };
        };
    },

    setMemberDataSort: function (data) {
        //排序规则：俱乐部主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

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

    setBlackDataSort: function (data) {
        //排序规则：俱乐部主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

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

    onApplyListClicked: function () { //申请列表
        if (this.toggleIndex == 0) {
            return;
        }

        this.lastid = 0;
        this.isASK = false;
        this.requestApplyList();
    },

    onMemberListClicked: function () {//成员列表
        if (this.toggleIndex == 1) {
            return;
        }
        this.lastid = 0;
        this.isASK = false;
        this.requestMemberList();
    },

    onBlackListClicked: function () {//黑名单列表
        if (this.toggleIndex == 2) {
            return;
        }
        this.lastid = 0;
        this.isASK = false;
        this.requestBlackList();
    },

    onInvateClicked: function () {
       
        var clubId = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var clubName = cc.vv.clubview.viewData.clubsInfo.clubInfo.username;
        cc.vv.userMgr.getClubShare(clubId,function(ret){
            if(ret.errcode===0){

                var title = "<燕赵麻将>";
                title = "俱乐部ID:" + clubId + " " + title;

                var content = cc.vv.userMgr.userName + "俱乐部主邀请您加入" + clubName + "俱乐部。";
                cc.vv.anysdkMgr.share_club(title, content, false, ret.url);
            }else{
                cc.vv.alert.show('获取分享链接失败')
            }
        })
       
       
       
    },

    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        this.node.destroy();
    },

    onEditBoxStartClicked: function (event) {

        if (this.memberData == null) {
            return;
        }

        var searchData = this.getSearchData(event.string);
        this.initListScroll(true, searchData);
    },

    onEditBoxChangeClicked: function (event) {

        if (this.memberData == null) {
            return;
        }

        var searchData = this.getSearchData(event);
        this.initListScroll(true, searchData);
    },

    onEditBoxEndClicked: function (event) {

        if (this.memberData == null) {
            return;
        }

        var searchData = this.getSearchData(event.string);
        this.initListScroll(true, searchData);
    },

    getSearchData: function (searchString) {

        var searchData = [];
        var searchLength = searchString.length;

        var memberCount = this.memberData.length;
        for (var i = 0; i < memberCount; i++) {

            var isMatchingSearch = true;
            var memberID = this.memberData[i].userId.toString();
            for (var j = 0; j < searchLength; j++) {
                if (searchString[j] != memberID[j]) {
                    isMatchingSearch = false;
                }
            };

            if (isMatchingSearch == true) {
                searchData.push(this.memberData[i]);
            }
        };

        return searchData;
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

        if (this.toggleIndex == 0) {
            this.requestApplyList_Add();
        } else if (this.toggleIndex == 1) {
            this.requestMemberList_Add();
        } else if (this.toggleIndex == 2) {
            this.requestBlackList_Add();
        }
    },


    clubMemberScrollBack:function(event){
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
