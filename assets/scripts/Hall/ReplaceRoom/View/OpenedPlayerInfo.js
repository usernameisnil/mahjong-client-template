
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
        sp_head: {
            default: null,
            type: cc.Sprite
        },
        lbl_name:{
            default:null,
            type:cc.Label
        },
        lbl_ID:{
            default:null,
            type:cc.Label
        },
    },

    onLoad: function() {
    },

    init: function (playerData) {
        this.playerData = playerData;
        this.initUI();
    },
    initUI: function () {
        this.sp_head.node.active = false;
        this.lbl_name.string = this.playerData.username;
        this.lbl_ID.string = "";
        if (this.playerData.userid != undefined) {
            var idString = "ID: " + this.playerData.userid.toString();
            this.lbl_ID.string = idString;
        }else {
            this.lbl_name.node.x = -this.lbl_name.node.width*0.5;
        }
        this.lbl_name.node.y = 0;
        this.lbl_ID.node.y = 0;
    }
});