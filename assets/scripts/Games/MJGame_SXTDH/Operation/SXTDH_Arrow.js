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
        nd_arrow:{
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this._rotationAngle = 0;
        
    },

    setArrowMyselfRotation: function (side) {
        var scale = 1;
        var rotationAngle = 0;
        switch (side) {
            case "myself":
                rotationAngle = 0;
                scale = 1;
                break;
            case "left":
                rotationAngle = 90;
                scale = 0.5;
                break;
            case "right":
                rotationAngle = -90;
                scale = 0.5;
                break;
            case "up":
                rotationAngle = 180;
                scale = 1;
                break;
        }

        this.nd_arrow.active = true;
        this.nd_arrow.setScale(scale);
        this.nd_arrow.rotation = rotationAngle;
    },

    setTurnRotation: function (seatindex, turnIndex) {
        
        var tmp_turnindex = cc.vv.gameNetMgr.getLocalIndex(turnIndex);
        var tmp_seatIndex = cc.vv.gameNetMgr.getLocalIndex(seatindex);
        var disIndex = tmp_turnindex - tmp_seatIndex;

        if (seatindex == 3) {

        }
        if (disIndex == 0) {
            this._rotationAngle = 0;
        }else if (disIndex == 1 || disIndex == -3) {
            this._rotationAngle = -90;
        }else if (disIndex == -1 || disIndex == 3) {
            this._rotationAngle = 90;
        }else {
            this._rotationAngle = 180;
        }
    },

    setShowArrow: function (turnIndex, seatindex, side) {
        this.setArrowMyselfRotation(side);
        this.setTurnRotation(seatindex, turnIndex);
        
        var arrowRotationAngle = this.nd_arrow.rotation;
        this.nd_arrow.rotation = arrowRotationAngle + this._rotationAngle;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});