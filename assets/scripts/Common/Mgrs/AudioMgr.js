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
        bgmVolume:1.0,
        sfxVolume:1.0,
        
        bgmAudioID:-1,

        dialectID: 0,
        speakerID: 3,
    },

    // use this for initialization
    init: function () {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null){
            this.bgmVolume = parseFloat(t);    
        }
        
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null){
            this.sfxVolume = parseFloat(t);    
        }

        var t = cc.sys.localStorage.getItem("dialectID");
        if (t != null) {
            this.dialectID = parseInt(t);
        }

        var t = cc.sys.localStorage.getItem("speakerID");
        if (t != null) {
            this.speakerID = parseInt(t);
        }
        
        // cc.game.on(cc.game.EVENT_HIDE, function () {
        //     console.log("cc.audioEngine.pauseAll");
        //     cc.audioEngine.pauseAll();
        // });
        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     console.log("cc.audioEngine.resumeAll");
        //     cc.audioEngine.resumeAll();
        // });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    getUrl:function(url){
        return cc.url.raw("resources/sounds/" + url);
    },

    getMJGameUrl: function (url,isLanguage) {

        if (isLanguage == true) {
            var getLName = this.getLanguageName();
            var getSName = this.getSexName();
            var gameUrl = "resources/sounds/PKGame/" + getLName + "/" + getSName + "/";
        }else{
            var gameUrl = "resources/sounds/MJGame/";
        }

        var audioPath = cc.url.raw(gameUrl + url);
        console.log('76',audioPath);
        return audioPath;
    },
    
    playBGM: function (url){
        var audioUrl = this.getUrl(url);
        
        if (this.bgmVolume > 0) {
            if (this.bgmAudioID >= 0) {
                cc.audioEngine.stop(this.bgmAudioID);
            }
            this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
        }else {
            this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
            cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }

        // if(this.bgmAudioID >= 0){
        //     cc.audioEngine.stop(this.bgmAudioID);
        // }
        // this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
    },

    playMJGameBGM: function (url){
        var audioUrl = this.getMJGameUrl(url);
        console.log(audioUrl);

        if (this.bgmVolume > 0) {
            if (this.bgmAudioID >= 0) {
                cc.audioEngine.stop(this.bgmAudioID);
            }
            this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
        }else {
            this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
            cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);

        }
        
        // if(this.bgmAudioID >= 0){
        //     cc.audioEngine.stop(this.bgmAudioID);
        //     this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
        // }
        // this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
    },

    playButtonClicked: function() {
        this.playSFX('Sound/Button_Click.mp3');
    },
    
    playSFX: function (url){
        var audioUrl = this.getUrl(url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
        }
    },

    playMJGameSFX: function (url,isFullPath){
        
        if (isFullPath) {
            var audioUrl = cc.url.raw(url);
        }else{
            var audioUrl = this.getMJGameUrl(url, false);
        }
       
       
      
        if(this.sfxVolume > 0){
           
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);
          
        }
    },

    playMusician: function() {
        var path = 'Sound_Musician/{0}/{1}/CeShi/yuyan_{2}.mp3';
        path = path.format(this.dialectID, this.speakerID + 1, this.getRandom(1, 2));
        this.playSFX(path);
    },

    setDialect: function(id) {
        if (this.dialectID != id) {
            cc.sys.localStorage.setItem("dialectID", id);
            this.dialectID = id;
        }
    },
    
    setSpeaker: function(id) {
        if (this.speakerID != id) {
            cc.sys.localStorage.setItem("speakerID", id);
            this.speakerID = id;
        }
    },

    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    },
    
    setBGMVolume:function(voice,force){
        if(this.bgmAudioID >= 0){
            if(voice > 0){
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != voice || force){
            cc.sys.localStorage.setItem("bgmVolume",voice);
            this.bgmVolume = voice;
            cc.audioEngine.setVolume(this.bgmAudioID,voice);
        }
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    },

    getRandom: function(n, m) {
        var w = m - n;

        if (w == 0) {
            return n;
        }

        return Math.round(Math.random() * w + n);
    },
    //游戏中的语言、性别的文件夹名的初始化、获取

    initRouteData: function () {
        this.languageFolderName = "";
        this.sexFolderName = "";
    },

    setLanguageName: function (name) {
        this.languageFolderName = name;
    },

    getLanguageName: function () {
        return this.languageFolderName;
    },

    setSexName: function (name) {
        this.sexFolderName = name;
    },

    getSexName: function () {
        return this.sexFolderName;
    },

    stopAll:function(){
        cc.audioEngine.stopAll();

    },
});
