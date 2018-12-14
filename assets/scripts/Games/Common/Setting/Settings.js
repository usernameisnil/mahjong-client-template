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
        _btnYXOpen: null,
        _btnYXClose: null,
        _btnYYOpen: null,
        _btnYYClose: null,
        _bgIndex: 0,
        _bgStyle: [],
        radioItemModel:cc.Node,
        CardAudioData:null,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv == null) {
            return;
        }
      
       


        this._btnYXOpen = this.node.getChildByName("yinxiao").getChildByName("btn_yx_open");
        this._btnYXClose = this.node.getChildByName("yinxiao").getChildByName("btn_yx_close");

        this._btnYYOpen = this.node.getChildByName("yinyue").getChildByName("btn_yy_open");
        this._btnYYClose = this.node.getChildByName("yinyue").getChildByName("btn_yy_close");

        //this.initButtonHandler(cc.find("Canvas/popups/btn_close"));
        //this.initButtonHandler(this.node.getChildByName("btn_exit"));


        this.initButtonHandler(this._btnYXOpen);
        this.initButtonHandler(this._btnYXClose);
        this.initButtonHandler(this._btnYYOpen);
        this.initButtonHandler(this._btnYYClose);


        var slider = this.node.getChildByName("yinxiao").getChildByName("progress");
        cc.vv.utils.addSlideEvent(slider, this.node, "Settings", "onSlided");

        var slider = this.node.getChildByName("yinyue").getChildByName("progress");
        cc.vv.utils.addSlideEvent(slider, this.node, "Settings", "onSlided");

        this.refreshVolume();

        
       
       
        // 如果不是setting3需要背景换肤
        if (this.node.name != 'settings3') {      

            this._bgIndex = cc.vv.controlMgr.getBGStyle();
            var bgStyle = cc.find('bgStyle/myPageView/view/content',this.node);
    
            for (var i = 0; i < bgStyle.childrenCount; i++) {
                var bg = bgStyle.children[i];
    
                cc.vv.utils.addClickEvent(bg, this.node, 'Settings', 'onBgBtnClicked', '' + i);
    
                var tag = bg.getChildByName('select');
                tag.active = (this._bgIndex == i);
    
                this._bgStyle.push(tag);
            }            
        }      


        //如果是settings2就需要加载语言的消息配置       

        if (this.node.name == 'settings2') {
            this.node.on("rb-updated", function (event) {

                var gameName = cc.vv.SelectRoom.getGameName();
                var CardAudioObj = cc.CGameConfigDataModel.getCardAudio();
                var languageKeys = CardAudioObj.languageKeys;
                var id = event.detail.id;
    
                cc.sys.localStorage.setItem('localLanguage/'+ gameName, languageKeys[id]);
                cc.vv.audioMgr.setLanguageName(languageKeys[id]);
            });

            var content = cc.find('languageGroup/myPageView/view/content',this.node);
            
            var cnLanguageKeys = this.CardAudioData.cnLanguageKeys

            for (let index = 0; index < cnLanguageKeys.length; index++) {
                const element = cnLanguageKeys[index];
                var item = cc.instantiate(this.radioItemModel);
                item.getChildByName("title").getComponent(cc.Label).string = element;
                item.getComponent("RadioButton").index = index;
                item.getComponent("RadioButton").notify = this.node;
                item.active = true;
                content.addChild(item);
            }

            var localLanguage = cc.vv.audioMgr.getLanguageName();
            var languageKeys = this.CardAudioData.languageKeys;

            var tmpIndex = languageKeys.indexOf(localLanguage);
            content.children[tmpIndex].getComponent("RadioButton").onClicked();
        };
       
    },
    

    init:function (Obj) {
        this.CardAudioData = Obj;
        console.log(this.CardAudioData);
    },

    onSlided: function (slider) {
        if (slider.node.parent.name == "yinxiao") {
            cc.vv.audioMgr.setSFXVolume(slider.progress);
        }
        else if (slider.node.parent.name == "yinyue") {
            cc.vv.audioMgr.setBGMVolume(slider.progress);
        }
        this.refreshVolume();
    },

    initButtonHandler: function (btn) {
        cc.vv.utils.addClickEvent(btn, this.node, "Settings", "onBtnClicked");
    },

    refreshVolume: function () {

        this._btnYXClose.active = cc.vv.audioMgr.sfxVolume > 0;
        this._btnYXOpen.active = !this._btnYXClose.active;

        var yx = this.node.getChildByName("yinxiao");
        var width = 430 * cc.vv.audioMgr.sfxVolume;
        var progress = yx.getChildByName("progress")
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.sfxVolume;
        progress.getChildByName("progress").width = width;
        //yx.getChildByName("btn_progress").x = progress.x + width;


        this._btnYYClose.active = cc.vv.audioMgr.bgmVolume > 0;
        this._btnYYOpen.active = !this._btnYYClose.active;
        var yy = this.node.getChildByName("yinyue");
        var width = 430 * cc.vv.audioMgr.bgmVolume;
        var progress = yy.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.bgmVolume;

        progress.getChildByName("progress").width = width;
        //yy.getChildByName("btn_progress").x = progress.x + width;
    },

    onBtnClicked: function (event) {
        if (event.target.name == "btn_close") {
            this.node.active = false;
        }
        else if (event.target.name == "btn_exit") {
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
            cc.director.loadScene("login");
        }
        else if (event.target.name == "btn_yx_open") {
            cc.vv.audioMgr.setSFXVolume(1.0);
            this.refreshVolume();
        }
        else if (event.target.name == "btn_yx_close") {
            cc.vv.audioMgr.setSFXVolume(0);
            this.refreshVolume();
        }
        else if (event.target.name == "btn_yy_open") {
            cc.vv.audioMgr.setBGMVolume(1);
            this.refreshVolume();
        }
        else if (event.target.name == "btn_yy_close") {
            cc.vv.audioMgr.setBGMVolume(0);
            this.refreshVolume();
        }
    },

    onBgBtnClicked: function (event, data) {
        var id = parseInt(data);
        if (cc.vv.SelectRoom.getRoomType() === 10) {
            var mgr = cc.vv.controlMgr;
        } else {

            var mgr = cc.vv.controlMgr;
        }
        var old = this._bgIndex;

        cc.vv.audioMgr.playButtonClicked();

        if (id != old) {
            this._bgStyle[old].active = false;
            this._bgStyle[id].active = true;

            mgr.setBGStyle(id);

            this._bgIndex = id;
        }
    },

  
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
