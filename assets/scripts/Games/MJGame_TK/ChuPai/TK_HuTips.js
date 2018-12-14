cc.Class({
    extends: cc.Component,

    properties: {
        body:{
            default:null,
            type:cc.Node
        },
        mjNodes: {
            default:[],
            type:cc.Node
        },
        tipMj:{
            default:null,
            type:cc.Prefab
        },
        lblWind: {
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
        this._isHide = false;
    },

    init: function (mjData, isWind) {
        
        this.initMJ(mjData, isWind);
        this.showAnimation();
    },

    initMJ: function (mjData, isWind) {
        var gap = 20;
        for (var i = 0; i < mjData.length; i++) {
            var mjs = mjData[i];

            var mjsLen = mjs.length;
            if (mjsLen == 0) {
                continue;
            }

            var mjNode = this.mjNodes[i];
            var nodeWidth = mjNode.width;

            for (var j = 0; j < mjsLen; j++) {
                var mjId = mjs[j];
                var tipMj = cc.instantiate(this.tipMj);
                var tipMjScript = tipMj.getComponent("HuPaiTip");
                var tipMjWidth = 0;
                if (tipMjScript) {
                    tipMjScript.init("B_" ,mjId);
                    tipMjWidth = tipMjScript.getMjWidth();
                }
                // tipMj.x = -nodeWidth*0.5 + gap * 0.5 + tipMjWidth * 0.5 + (tipMjWidth + gap) * j;
                tipMj.x = (gap + tipMjWidth) * (0.5 + j) - nodeWidth * 0.5;
                mjNode.addChild(tipMj);
            };
            
        };

        this.setWindString(isWind);
    },

    setWindString: function (isWind) {
        if (isWind) {
            this.lblWind.string = "字：";
        }else {
            this.lblWind.string = "混：";
        }
    },

    showAnimation: function () {
        var animation = this.body.getComponent("cc.Animation");
        animation.off('finished', this.onHideFinished, this);
        animation.on('finished', this.onShowFinished, this);
        animation.play("showHuTips");
    },

    hideAnimation: function () {
        var animation = this.body.getComponent("cc.Animation");
        animation.off('finished', this.onShowFinished, this);
        animation.on('finished', this.onHideFinished, this);
        animation.play("hideHuTips");
    },

    onShowFinished: function () {
        this._isHide = true;
    },

    onHideFinished: function () {
        if (this.node == null) {
            return;
        }
        this.node.removeFromParent(true);
    },

    onMaskClicked: function () {
        if (this._isHide == true) {
            this._isHide = false;
            this.hideAnimation();
        }
        
    }

});