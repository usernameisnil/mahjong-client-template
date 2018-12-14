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
        checked:false
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.OpenedRoomView._cellGroup.push(this);
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            this.cell_click();
            cc.vv.OpenedRoomView.roomScroll.content.active=true;
            cc.vv.OpenedRoomView.node.getChildByName("body").getChildByName("roomView").getChildByName("topNode").active = true;
            cc.vv.OpenedRoomView.node.getChildByName("body").getChildByName("roomView").getChildByName("titleNode").active = true;
            cc.vv.OpenedRoomView.node.getChildByName("body").getChildByName("btn_create").active = true;
            var clubid = this.node.getChildByName("club_id").getComponent(cc.Label).string;
            var clubname = this.node.getChildByName("club_name").getComponent(cc.Label).string;
            if (parseInt(cc.vv.OpenedRoomView._lv[clubname]) == 10) {
                cc.vv.hall._isLv = true;
                cc.vv.OpenedRoomView.buttonGroup[0].x = -110;
                cc.vv.OpenedRoomView.buttonGroup[1].active = true;
            } else {
                cc.vv.OpenedRoomView.buttonGroup[0].x = 18;
                cc.vv.OpenedRoomView.buttonGroup[1].active = false;
                cc.vv.hall._isLv = false;
            }
            cc.vv.hall.isClubRoom = true;
            cc.vv.hall._clubid = clubid;
            cc.vv.hall.createRoomWin.getChildByName("body").getChildByName("btn_hasCreate").active = false;
            cc.vv.hall.createRoomWin.getChildByName("body").getChildByName("btn_proxyCreate").active = false;
            // if(cc.vv.hall._clubname){
            //     cc.vv.hall.club_dub.removeFromParent(cc.vv.hall.node);
            // } else {
            //     cc.vv.utils.showDialog(cc.vv.hall.createRoomWin, 'body', true);
            // }
            cc.vv.hall.createRoomWin.getChildByName("body").getChildByName("club_name").getComponent(cc.Label).string = clubname;
            this.on_btnOpened();
        }, this)
    },
    cell_click:function () {
        cc.vv.OpenedRoomView.check(this);
    },
    check:function (checked) {
        this.checked=checked;
        this.refresh_cell();
    },
    refresh_cell:function () {
        var clubid = this.node.getChildByName("club_id");
        var clubname = this.node.getChildByName("club_name");
        if(this.checked){
            clubid.color = new cc.Color(13,13,235);
            clubname.color = new cc.Color(13, 13, 235);
        }else{
            clubid.color = new cc.Color(219,21,21);
            clubname.color = new cc.Color(219,21,21);
         }
    },
    on_btnOpened: function () {
        var self = this;
        var clubid = this.node.getChildByName("club_id").getComponent(cc.Label).string;
        var viewRecord = function (ret) {
            cc.log("viewRecord ret = ", ret);
            cc.vv.wc.hide();
            if (ret.errcode !== 0) {
                cc.vv.alert.show("查看已开房间失败!");
            } else {
                cc.vv.roomCfg.setOpendedRoomsData(ret.data);
                cc.vv.hall.isClub = true;
                cc.vv.OpenedRoomView._clubid = clubid;
                cc.vv.OpenedRoomView.init();
            }
        }

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            clubid: clubid
        };
        cc.vv.http.sendRequest("/get_daikai_rooms", data, viewRecord);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

});
