cc.Class({
    extends: cc.Component,

    properties: {
        inputName:cc.EditBox,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    
    onRandomBtnClicked:function(){
        var names = [
            "上官",
            "欧阳",
            "东方",
            "端木",
            "独孤",
            "司马",
            "南宫",
            "夏侯",
            "诸葛",
            "皇甫",
            "长孙",
            "宇文",
            "轩辕",
            "东郭",
            "子车",
            "东阳",
            "子言",
        ];
        
        var names2 = [
            "雀圣",
            "赌侠",
            "赌圣",
            "稳赢",
            "不输",
            "好运",
            "自摸",
            "有钱",
            "土豪",
        ];
        var idx = Math.floor(Math.random() * (names.length - 1));
        var idx2 = Math.floor(Math.random() * (names2.length - 1));
        this.inputName.string = names[idx] + names2[idx2];
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.createDesignSize();
        this.onRandomBtnClicked();
    },

    onBtnConfirmClicked:function(){
        var name = this.inputName.string;
        if(name == ""){
            console.log("invalid name.");
            return;
        }
        console.log(name);
        cc.vv.userMgr.create(name);
    },

    /********************************
    ***** 全面屏适配 *****
    ********************************/
     
    createDesignSize: function () {
        var cvs = this.node.getComponent(cc.Canvas);
        var isAllScreen = cc.AdaptationMgr.getAllScreenBool();
        if (isAllScreen == false) {
            cvs.fitHeight = true;
        }else {
            cvs.fitHeight = false;
        }
        cvs.fitWidth = true;

        this.body = this.node.getChildByName("center");
        this.layerRoot = this.node.getChildByName("layerRoot");

        if (isAllScreen == true) {
            var sceneScale = cc.AdaptationMgr.getNodeScale();
            // this.body.setScale(sceneScale);
            // this.layerRoot.setScale(sceneScale);

            var nodeArray = [this.body, this.layerRoot];
            cc.AdaptationMgr.setRootNodeScaleWidth(nodeArray, sceneScale);

            // this.setUIByLeftAndRightOffest();
            this.setSceneBottomOffest(sceneScale);
        }
    },

    setUIByLeftAndRightOffest: function () {
        var nodeNames = cc.AdaptationMgr.getNodeNamesByScene("createRole");
        cc.AdaptationMgr.setNodeOffestByName(nodeNames, this.node);
    },

    setSceneBottomOffest: function (sceneScale) {
        var homeHeight = cc.AdaptationMgr.getIOSHomeHeight();
        this.body.y = this.body.y + homeHeight * sceneScale * 0.5;
        this.layerRoot.y = this.layerRoot.y + homeHeight * sceneScale * 0.5;
    },

    /*******************************/

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
