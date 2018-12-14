cc.Class({
    extends: cc.Component,

    properties: {
        _sptMusicBG: null,
        _sptMusicGame: null,
    },

    // use this for initialization
    onLoad: function () {
        // init music_bg
        var btnMusicBG = cc.find('body/music_bg', this.node);
        var sptMusicBG = btnMusicBG.getComponent('SpriteMgr');

        cc.vv.utils.addClickEvent(btnMusicBG, this.node, "AudioSet", "onMusicBGClicked");

        var music_bg = cc.vv.audioMgr.bgmVolume > 0 ? 1 : 0;
        sptMusicBG.setIndex(music_bg);
        this._sptMusicBG = sptMusicBG;

        // init music_game
        var btnMusicGame = cc.find('body/music_game', this.node);
        var sptMusicGame = btnMusicGame.getComponent('SpriteMgr');

        cc.vv.utils.addClickEvent(btnMusicGame, this.node, "AudioSet", "onMusicGameClicked");
        
        var music_game = cc.vv.audioMgr.sfxVolume > 0 ? 1 : 0;
        sptMusicGame.setIndex(music_game);
        this._sptMusicGame = sptMusicGame;
        

		var btnLogout = cc.find('body/btnLogout', this.node);

		if (cc.director.getScene().name == 'hall') {
			cc.vv.utils.addClickEvent(btnLogout, this.node, "AudioSet", "onLogoutClicked");
		} else {
			btnLogout.active = false;
		}

		var btnClose = cc.find('body/btnClose', this.node);
		cc.vv.utils.addClickEvent(btnClose, this.node, "AudioSet", "onCloseClicked");

    },


    getSpriteMgr: function(path) {
        var node = cc.find(path, this.node);
        if (!node) {
            return null;
        }
        
        return node.getComponent('SpriteMgr');
    },

    onMusicBGClicked: function() {
        var sptMusicBG = this._sptMusicBG;
        var volume = cc.vv.audioMgr.bgmVolume > 0 ? 0 : 1;

        cc.vv.audioMgr.playButtonClicked();

        cc.vv.audioMgr.setBGMVolume(volume);
        sptMusicBG.setIndex(volume);
    },

    onMusicGameClicked: function() {
        var sptMusicGame = this._sptMusicGame;
        var volume = cc.vv.audioMgr.sfxVolume > 0 ? 0 : 1;

        cc.vv.audioMgr.playButtonClicked();

        cc.vv.audioMgr.setSFXVolume(volume);
        sptMusicGame.setIndex(volume);
    },

    onLogoutClicked: function() {
        cc.vv.audioMgr.playButtonClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);

    	cc.vv.alert.show('确认重新登录吗?', function() {
			cc.sys.localStorage.removeItem("wx_account");
			cc.sys.localStorage.removeItem("wx_sign");
			cc.director.loadScene("login");
		}, true);
    },

	onCloseClicked: function() {
	    cc.vv.audioMgr.playButtonClicked();
		cc.vv.utils.showDialog(this.node, 'body', false);
    },
});

