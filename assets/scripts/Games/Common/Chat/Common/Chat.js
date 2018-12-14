cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _chatRoot:null,
        _tabQuick:null,
        _tabEmoji:null,
        _iptChat:null,
        
        _quickChatInfo:null,
        _btnChat:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.chat = this;
        
        this._btnChat = this.node.getChildByName("btnNodes").getChildByName("btn_chat");
        this._btnChat.active = (cc.vv.replayMgr.isReplay() == false || cc.vv.PKReplayMgr.isReplay() == false || cc.vv.PDKReplayMgr.isReplay() == false);
    
        
        this._chatRoot = this.node.getChildByName("layerRoot").getChildByName("chat");
        this._chatRoot.active = false;
        
        this._tabQuick = this._chatRoot.getChildByName("quickchatlist");
        this._tabEmoji = this._chatRoot.getChildByName("emojis");
        
        this._iptChat = this._chatRoot.getChildByName("iptChat").getComponent(cc.EditBox);
          

        this.showQuickChatList();

        this.setChatInfoCount();
    },

    initMyQuickChatInfo: function () {
        // var getLName = cc.vv.audioMgr.getLanguageName();
        // var getMySName = cc.vv.gameNetMgr.getMySex();
        // this._quickChatInfo = this._allQuickChatInfo[cc.vv.gameType][getLName][getMySName];

        var gameName = cc.vv.SelectRoom.getGameName();
        var mylanguage =  cc.vv.audioMgr.getLanguageName();
        var mysex = cc.vv.userMgr.sex == 0 ? "WoMan" :"Man";
        this._quickChatInfo = {};
        this._quickChatInfo = cc.CGameConfigDataModel.getChatData(gameName,mylanguage,mysex);         
    },
    
    getOtherChatInfo: function (languageType, sexType, index) {
        var otherInfo = this._allQuickChatInfo[cc.vv.gameType][languageType][sexType];
        if (this._allQuickChatCount == null || index < 0 || index >= this._allQuickChatCount[languageType][sexType]) {
            return null;
        }
        var key = "item" + index;
        return otherInfo[key];
    },
    
    // getQuickChatInfo: function(index){ //add baihua2001cn cfg
 
    //     var key = "item" + index;
    //     var gameName = cc.vv.SelectRoom.getGameName();

    //     //'ddz'  10   'zhuolu'  1  2  'huaian' 1 2  'tuidaohu' 4
    //     if (gameName == 'ddz') {
    //         return this._dzquickChatInfo[key];
    //     } else if (gameName == 'zhuolu') {
    //         return this._quickChatInfo[key];
    //     } else if (gameName == 'huaian') {
    //         return this._quickChatInfo[key];
    //     } else if (gameName == 'tuidaohu') {
    //         return this._quickChatInfo[key];
    //     }else if (gameName == 'taikang') {
    //         return this._quickChatInfo[key];
    //     }
    // },
    
    onBtnChatClicked:function(){
        //this.showQuickChatList();
        this._chatRoot.active = true;
    },
    
    onBgClicked:function(){
        this._chatRoot.active = false;
    },
    
    onTabClicked:function(event){
        if(event.target.name == "tabQuick"){
            this._tabQuick.active = true;
            this._tabEmoji.active = false;
        }
        else if(event.target.name == "tabEmoji"){
            this._tabQuick.active = false;
            this._tabEmoji.active = true;
        }
    },
    
    onQuickChatItemClicked:function(event){
        this._chatRoot.active = false;
        var info = this._quickChatInfo[event.target.name];

        var getLName = cc.vv.audioMgr.getLanguageName();
        var getSName = cc.vv.gameNetMgr.getMySex();
        var chatData = {
            languageType: getLName,
            sexType: getSName,
            index: info.index
        };
        cc.vv.net.send("quick_chat",chatData); 
    },
    
    onEmojiItemClicked:function(event){
        console.log(event.target.name);
        this._chatRoot.active = false;
        cc.vv.net.send("emoji",event.target.name);
    },
    
    onBtnSendChatClicked:function(){
        this._chatRoot.active = false;
        if(this._iptChat.string == ""){
            return;
        }
        cc.vv.net.send("chat",this._iptChat.string);
        this._iptChat.string = "";
    },

    setChatInfoCount: function () {
        if (this._allQuickChatInfo == null) {
            this._allQuickChatCount = null;
            return;
        }
        this._allQuickChatCount = {};

        var gameChatInfo = this._allQuickChatInfo[cc.vv.gameType];
        for (var languageKey in gameChatInfo) {
           
            var languageInfo = gameChatInfo[languageKey];
            this._allQuickChatCount[languageKey] = {};

            for (var sexKey in languageInfo) {

                var itemInfo = languageInfo[sexKey];
                var itemCount = 0;
                for (var itemKey in itemInfo) {
                    if (typeof (itemInfo[itemKey]) === "object") {
                        itemCount++;
                    }
                }
                
                this._allQuickChatCount[languageKey][sexKey] = itemCount;
            }; 
        }
    },

    showQuickChatList: function () {
        this.initMyQuickChatInfo();

        if (this._tabQuick == null) {
            this._tabQuick = this._chatRoot.getChildByName("quickchatlist");
        }

        var content = this._tabQuick.getComponent("cc.ScrollView").content;
        var templateItem = content.children[0];
        var item_height = templateItem.height;
        var content_child_count = content.childrenCount;
        if (content_child_count > 1) {
            content.children.splice(1, (content_child_count-1));
            content.height = item_height;
        }

        var getLName = cc.vv.audioMgr.getLanguageName();
        var getMySName = cc.vv.gameNetMgr.getMySex();
        var args = Object.keys(this._quickChatInfo);
        var localListCount = args.length;

        if (localListCount <= 0) {
            templateItem.active = false;
            return;
        }else {
            templateItem.active = true;
        }

        for (var i = 0; i < localListCount; i++) {
            var key = "item" + i;
            if (i == 0) {
                templateItem.getChildByName("label").getComponent("cc.Label").string = this._quickChatInfo[key].content;
            }else {
                var addItem = cc.instantiate(templateItem);
                addItem.getChildByName("label").getComponent("cc.Label").string = this._quickChatInfo[key].content;
                addItem.name = key;
                content.addChild(addItem);
            }
        };

        content.height = item_height * localListCount;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
