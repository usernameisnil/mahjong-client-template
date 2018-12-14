
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
    },

    onLoad: function() {
    },

    init: function () {
       this.initData();

       this.loadPrefabs();
    },

    initData: function () {
        this._res = [
            "prefabs/Hall/ReplaceRoom/HasCreateRoom/OpenedPlayerInfo",
            "prefabs/Hall/ReplaceRoom/ReplaceRecord/OpenedRoomInfo",
            "prefabs/Hall/ReplaceRoom/Main/OpenedRoomView",
            "prefabs/Hall/ReplaceRoom/HasCreateRoom/OpenRoomRecord",
            //"prefabs/OpenedClubRoomInfo",
            //"prefabs/OpenClubRoomRecord",
            "prefabs/Games/MJGame/ChuPai/Common/FoldMJFocus",
            "prefabs/Games/MJGame/ChuPai/Common/PlayOption",
            "prefabs/Games/PKGame/Common/Role/RoleView",
            "prefabs/Games/PKGame/Common/seat",
            "prefabs/Games/PKGame/Ani/ChuPai/ani_bomb",
            "prefabs/Games/PKGame/Ani/JieSuan/ani_shibai",
            "prefabs/Games/PKGame/Ani/JieSuan/ani_shengli",
            "prefabs/Games/PKGame/Ani/JieSuan/ani_chuntian",
            "prefabs/Games/PKGame/Ani/ChuPai/ani_feiji",
            "prefabs/Games/PKGame/Ani/ChuPai/ani_liandui",
            "prefabs/Games/PKGame/Ani/ChuPai/ani_roket",
            // "prefabs/Games/PKGame/Ani/JieSuan/ani_shengli",
            // "prefabs/Games/PKGame/Ani/JieSuan/ani_shibai",
            "prefabs/Games/PKGame/Ani/ChuPai/ani_shunzi",
            "prefabs/Games/PKGame/Common/Poker/MyPK",
            "prefabs/Games/PKGame/GameOver/kuang",

            "prefabs/Hall/activityFace/turntable"

        ];

        this._prefabs = {};
    },

    loadPrefabs: function () {
        
        for (var i = 0; i < this._res.length; i++) {
            var path = this._res[i];

            this.preloadPrefab(path);
        };
    },

    preloadPrefab: function (path) {
        var self = this;
        cc.loader.loadRes(path, function (err, prefab) {
            if(prefab)
            {
                //console.log('loadErrorString',prefab);
                self._prefabs[path] = prefab;
            }
            else
            {
                console.log('loadErrorString');
                cc.error(err);

                var loadErrorString = "预制加载有误！";
                if (cc.vv.net) {
                    cc.vv.net.send("client_error_msg", loadErrorString);
                }
                if (cc.vv.alert) {
                    cc.vv.alert.show(loadErrorString);
                }
            }
        })
    },

    getPrefab:function(path)
    {
        return this._prefabs[path]
    }

});