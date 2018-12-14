cc.Class({
    extends: cc.Component,

    properties: {
        title:{
            default:null,
            type:cc.Label
        },
        body:{
            default:null,
            type:cc.Node
        },
        score:{
            default:null,
            type:cc.Label
        },
        flopMJ:{
            default:null,
            type:cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.score.node.active = false;
    },

    init: function (mjIdArray, score) {
        if (this.node == null) {
            return;
        }
        
        this.scoreNumber = score;
        var mjCount = mjIdArray.length;

        this.mjArray = [];
        for (var i = 0; i < mjCount; i++) {
            this.mjArray.push(mjIdArray[i]);
        };

        this.showMJtime = (mjCount+1)*1000;

        this.setViewWidth(mjCount);

        for (var i = 0; i < mjCount-1; i++) {
            var mjNode = cc.instantiate(this.flopMJ);
            var mjSprite = mjNode.getComponent(cc.Sprite);
            mjSprite.spriteFrame = cc.vv.controlMgr.getHoldsEmptySpriteFrame("up");
            this.setMaskActive(mjNode, false);
            this.body.addChild(mjNode);

            
        };

        this.showViewAnimation();
    },

    setViewWidth: function (mjCount) {
        var viewWidth = 120*(mjCount+1);
        this.node.width = viewWidth
    },

    setScore: function (scoreInt) {
        this.score.node.active = true;
        this.score.string = "+ " + scoreInt.toString() + " 分";
    },

    showViewAnimation: function () {
        if (this.node == null) {
            return;
        }
        var animation = this.node.getComponent("cc.Animation");
        animation.on('finished', this.onShowFinished, this);
        animation.play("showFlop");
    },

    hideViewAnimation: function () {
        if (this.node == null) {
            return;
        }
        var animation = this.node.getComponent("cc.Animation");
        animation.off('finished', this.onShowFinished, this);
        animation.on('finished', this.onHideFinished, this);
        animation.play("hideFlop");
    },

    onShowFinished: function () {
        this.flopMJAnimation();

        var self = this;
        setTimeout(function () {
            self.setScore(self.scoreNumber);
        }, 1000)

        setTimeout(function () {
            self.hideViewAnimation();
        }, self.showMJtime)
    },

    onHideFinished: function () {
        if (this.node == null) {
            return;
        }
        this.body.removeAllChildren(true);
        this.node.destroy();
    },

    flopMJAnimation: function () {
        for (var i = 0; i < this.mjArray.length; i++) {
            var id = this.mjArray[i];
            var mjNode = this.body.children[i];
            if (mjNode) {
                var mjSprite = mjNode.getComponent(cc.Sprite);
                this.setFlopAnimation(mjNode, mjSprite, id);
            }else {
                break;
            }
        };
    },

    setFlopAnimation: function (mjNode, mjSprite, mjId) {
        mjNode.stopAllActions();
        var delay = cc.delayTime(0.8);
        var flopScaleTo = cc.scaleTo(0.1, 0, 1);
        var showScaleTo = cc.scaleTo(0.1, 1, 1);

        var flopCallFunc = cc.callFunc(function () {
            mjSprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_", mjId);
            this.setMJMask(mjNode, mjId);
        }, this);

        var seq = cc.sequence(delay, flopScaleTo, flopCallFunc, showScaleTo);
        mjNode.runAction(seq);

    },

    setMJMask: function (node, mjid) {
        var hun_mahjong_id = 29;
        var mask = node.getChildByName("mask");
        this.setMaskActive(node, false);
        // var remainder = mjid%9;//1(0,9,18),5(4,13,22),9(8,17,26)
        // if (mjid == hun_mahjong_id) {
        //     this.setMaskActive(node, true);
        // }else if (mjid < 0 || mjid >= 27) {
        //     this.setMaskActive(node, false);
        // }else if (remainder == 0 || remainder == 4 || remainder == 8) {
        //     this.setMaskActive(node, true);
        // }else {
        //     this.setMaskActive(node, false);
        // }
    },

    setMaskActive: function (node, isShow) {
        var mask = node.getChildByName("mask");
        mask.active = isShow;
    }
});