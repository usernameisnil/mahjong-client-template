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
        
        clubItem: {
            default: null,
            type:cc.Prefab
        },
        clubScroll: {
            default: null,
            type: cc.ScrollView
        },
        changePlayBg: {
            default: null,
            type: cc.Node
        },
        seeGemsBg: {
            default: null,
            type: cc.Node
        },
        toggleHandle: {
            default: [],
            type: cc.Node
        },

        showTableNum:{
            default: [],
            type: cc.Node
        },

        TableNumShowTotal:{
            default:null,
            type:cc.Node

        },

        _changePlay: null,
        _seeOwnerGems: null,
       
        
    },

    // use this for initialization
    onLoad: function () {
    },

    init: function (data) {

        this.setupData = data;
        this.listItems = [];

        this.initToggles();

        this.initListScroll();
    },



    initToggles: function () {

        var changeIndex = (this.setupData.changeTablePlay == true) ? 1 : 0;
        this._changePlay = this.changePlayBg.getComponent('SpriteMgr');
        this._changePlay.setIndex(changeIndex);
        this.setHandlePosX(0, this.setupData.changeTablePlay);
        

        var seeIndex = (this.setupData.seeOwnerGems == true) ? 1 : 0;
        this._seeOwnerGems = this.seeGemsBg.getComponent('SpriteMgr');
        this._seeOwnerGems.setIndex(seeIndex);
        this.setHandlePosX(1, this.setupData.seeOwnerGems);

        //初始化桌子数量显示
       this.setShowTableNum()

    },

    setShowTableNum: function () {
         
        console.log(this.setupData);
        var clublv = this.setupData.clublv;
     
        if (clublv == 0 || clublv == 1) {
            this.showTableNum[0].active = true;
            this.showTableNum[1].active = false;
            this.showTableNum[2].active = false;
            this.TableNumShowTotal.width = 365;

            this.clickTableNum();         
            

        } else if (clublv == 2) {
            this.showTableNum[0].active = true;
            this.showTableNum[1].active = true;
            this.showTableNum[2].active = false;
            this.TableNumShowTotal.width = 480;

            this.clickTableNum();

        } else if (clublv == 3) {
            this.showTableNum[0].active = true;
            this.showTableNum[1].active = true;
            this.showTableNum[2].active = true;
            this.TableNumShowTotal.width = 600;

            this.clickTableNum();
        }

    },

    clickTableNum:function(){
        if(this.setupData.tableNum == 6){
           console.log(this.showTableNum[0])           
           
           this.showTableNum[0].getComponent('RadioButton').checked = true;
           this.showTableNum[1].getComponent('RadioButton').checked = false;
           this.showTableNum[2].getComponent('RadioButton').checked = false;
         

        }else if(this.setupData.tableNum == 12){
            this.showTableNum[0].getComponent('RadioButton').checked = false;
            this.showTableNum[1].getComponent('RadioButton').checked = true;
            this.showTableNum[2].getComponent('RadioButton').checked = false;

        }else if(this.setupData.tableNum == 24){
            this.showTableNum[0].getComponent('RadioButton').checked = false;
            this.showTableNum[1].getComponent('RadioButton').checked = false;
            this.showTableNum[2].getComponent('RadioButton').checked = true;
        }       
    },


    setHandlePosX: function (index, chooseBool) {
        if (chooseBool == true) {
            this.toggleHandle[index].x = 44;
        }else {
            this.toggleHandle[index].x = -44;
        }
    },

    onChangePlayClicked: function () {
        
        var self = this;
        var changeBool = !this.setupData.changeTablePlay;
       
        var data = {}
        var conf = {}
        conf.changeTablePlay = changeBool;
        if(this.setupData.seeOwnerGems===undefined){
            conf.seeOwnerGems = false;
        }else{
            conf.seeOwnerGems = this.setupData.seeOwnerGems;
        }
        
        
        data.clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        data.type = 'clubCommon';
        data.optype = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        
        data.conf = JSON.stringify(conf)

        cc.vv.userMgr.setClubGamePlay(data,function(ret){
            if(ret.errcode === 0){
                console.log('设置成功')

                var changeIndex = (changeBool == true) ? 1 : 0;
                self._changePlay.setIndex(changeIndex);
                self.setHandlePosX(0, changeBool);        
                self.setupData.changeTablePlay = changeBool;

            }else{
                console.log('设置失败')
            }
        })

    },

    onSeeGemsClicked: function () {
                
        var self = this;
        var seeBool = !this.setupData.seeOwnerGems;
       
        var data = {}
        var conf = {}
        conf.seeOwnerGems = seeBool;
        if(this.setupData.changeTablePlay===undefined){
            conf.changeTablePlay = false;
        }else{
            conf.changeTablePlay = this.setupData.changeTablePlay;
        }        
        
        data.clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        data.type = 'clubCommon';
        data.optype = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        
        data.conf = JSON.stringify(conf)

        cc.vv.userMgr.setClubGamePlay(data,function(ret){
            if(ret.errcode === 0){
                console.log('设置成功')

                var seeIndex = (seeBool == true) ? 1 : 0;
                self._seeOwnerGems.setIndex(seeIndex);
                self.setHandlePosX(1, seeBool);
                self.setupData.seeOwnerGems = seeBool;

            }else{
                console.log('设置失败')
            }
        })     
      
    },

    setTableNum: function (num,callback) {
        
        var self = this;
        var data = {}
        var conf = {}

        conf.tableNum =  parseInt (num);
        
        data.clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        data.type = 'clubCommon';
        data.optype = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        
        data.conf = JSON.stringify(conf)

        cc.vv.userMgr.setClubGamePlay(data,function(ret){
           
            if (ret.clientErrorCode == -120) {
                      
                callback(false)
                return ;
            }

            if(ret.errcode === 0){
                console.log('设置成功')
                callback(true);
                cc.vv.clubview.viewData.clubsInfo.clubInfo.tableNum = conf.tableNum;
            }else{
                console.log('设置失败');
                callback(false);
            }
        })     
      
    },

    initScroll: function () {
        var content = this.clubScroll.content;
        content.removeAllChildren();
        this.listItems.splice(0, this.listItems.length);
        this.listItems = [];
    },

    initListScroll: function () {
        this.initScroll();

        var listData = null;
        if (this.setupData.ownerClubs != undefined) {
            listData = this.setupData.ownerClubs.allClubName;
        }
        if (listData == null) {
            return;
        }

       // cc.log("wujun listData = ", listData);

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }

        var content_height = 0;

        var content = this.clubScroll.content;

        for (var i = 0; i < list_num; i++) {

            var itemData = this.getItemData(listData[i]);
            itemData.itemIndex = i+1;

            var item = cc.instantiate(this.clubItem);
            var SCIScript = item.getComponent('SetupClubItem');
            if (SCIScript) {
                SCIScript.init(itemData);
            }

            var itemLength = item.height;
            item.y = -(content_height + itemLength*0.5);
            content_height = content_height + itemLength;
            content.height = content_height;
            content.addChild(item);

            this.listItems.push(item);
        }
    },

    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        this.node.destroy();
    },

    getItemData: function (clubData) {
        var itemData = {};
        itemData.clubName = clubData.name;
        itemData.clubId = clubData.id;
        itemData.ownerUserId = this.setupData.ownerClubs.ownerUserId;

        return itemData;
    },

    onDestroy: function () {
        
    }
   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
