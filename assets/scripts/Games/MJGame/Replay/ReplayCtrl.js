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
        _nextPlayTime:1,
        _replay:null,
        _isPlaying:true,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._replay = cc.find("Canvas/replay");
        this._replay.active = cc.vv.replayMgr.isReplay();

        var btn_pause = cc.find("Canvas/replay/btn_pause");
        if(btn_pause){
            cc.vv.utils.addClickEvent(btn_pause,this.node,"ReplayCtrl","onBtnPauseClicked");
        }
        var btn_play = cc.find("Canvas/replay/btn_play");
        if(btn_play){
            cc.vv.utils.addClickEvent(btn_play,this.node,"ReplayCtrl","onBtnPlayClicked");
        }
        var btn_back = cc.find("Canvas/replay/btn_back");
        if(btn_back){
            cc.vv.utils.addClickEvent(btn_back,this.node,"ReplayCtrl","onBtnBackClicked");
        }


    },
    
    onBtnPauseClicked:function(){
        this._isPlaying = false;
    },
    
    onBtnPlayClicked:function(){
        this._isPlaying = true;
    },
    
    onBtnBackClicked:function(){
        cc.vv.replayMgr.clear();
        cc.vv.gameNetMgr.reset();
        cc.vv.gameNetMgr.roomId = null;
        cc.director.loadScene("hall");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(cc.vv){
            if(this._isPlaying && cc.vv.replayMgr.isReplay() == true && this._nextPlayTime > 0){
                this._nextPlayTime -= dt;
                if(this._nextPlayTime < 0){
                    this._nextPlayTime = cc.vv.replayMgr.takeAction();
                }
            }
        }
    },
});
