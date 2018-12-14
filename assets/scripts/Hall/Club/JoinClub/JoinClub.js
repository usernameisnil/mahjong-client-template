
cc.Class({
    extends: cc.Component,

    properties: {
        _idx: '',
        lblID: {
            default: null,
            type: cc.Label
        },
        placeholder: {
            default: null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function () {
    },

    onEnable: function () {
        this.reset();
    },

    showPlaceholder: function (isShow) {
        this.placeholder.active = isShow;
    },

    reset: function () {
        this._idx = '';
        this.lblID.string = this._idx;
        this.showPlaceholder(true);
    },

    onInput: function (num) {
        cc.vv.audioMgr.playButtonClicked();

        if (this._idx.length < 8) {
            this._idx += num;
            this.lblID.string = this._idx;
        }

        var idString = this.lblID.string;
        if (idString == "") {
            this.showPlaceholder(true);
        } else {
            this.showPlaceholder(false);
        }

        var idLength = idString.length;
        if (idLength == 7) {
            cc.vv.userMgr.joinClub(idString, function (ret) {
                
                
                if(ret.clientErrorCode == -120){
                    this.reset();
                    return;
                }

                
                var content = "";
                if (ret.errcode == 0) {

                    content = "已申请加入亲友圈[" + idString + "]，请等待亲友圈主回应!";

                } else {
                    // content = "亲友圈["+ idString +"]不存在，请重新输入!";
                    // if(ret.errcode == 4){
                    //     content = "亲友圈["+ idString + "]人数已满!";
                    // }
                    content = "亲友圈[" + idString + "] " + ret.errmsg;
                }
                this.reset();
                cc.vv.alert.show(content);

            }.bind(this));
        }
    },

    onN0Clicked: function () {
        this.onInput(0);
    },
    onN1Clicked: function () {
        this.onInput(1);
    },
    onN2Clicked: function () {
        this.onInput(2);
    },
    onN3Clicked: function () {
        this.onInput(3);
    },
    onN4Clicked: function () {
        this.onInput(4);
    },
    onN5Clicked: function () {
        this.onInput(5);
    },
    onN6Clicked: function () {
        this.onInput(6);
    },
    onN7Clicked: function () {
        this.onInput(7);
    },
    onN8Clicked: function () {
        this.onInput(8);
    },
    onN9Clicked: function () {
        this.onInput(9);
    },

    onDelClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        var id = this._idx;
        var len = id.length;

        if (len > 0) {
            this._idx = id.substring(0, len - 1);
            this.lblID.string = this._idx;
        }

        if (this.lblID.string == "") {
            this.showPlaceholder(true);
        } else {
            this.showPlaceholder(false);
        }
    },

    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        cc.vv.utils.showDialog(this.node, 'panel', false);
    },
});

