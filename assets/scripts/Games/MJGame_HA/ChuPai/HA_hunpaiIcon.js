cc.Class({
    extends: cc.Component,

    properties: {
        hpIconPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.hunpaiIcon = this;
    },

    addIcon: function (node, args) {

        if (this.hpIconPrefab == null) {
            return;
        };

        var icon = cc.instantiate(this.hpIconPrefab);
        icon.setPosition(args.pos);
        icon.setScale(args.scaleX, args.scaleY);
        icon.setRotation(args.rotate);
        node.addChild(icon);
    },
});