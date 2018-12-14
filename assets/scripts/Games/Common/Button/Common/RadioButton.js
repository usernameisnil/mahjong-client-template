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
        target:cc.Node,
        sprite:cc.SpriteFrame,
        checkedSprite:cc.SpriteFrame,
        checked:false,
        groupId:-1,
        
        notify: {
            default: null,
            type: cc.Node,
        },
        
        index: -1,
        
        type: 0,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv == null) {
            return;
        }

        if (cc.vv.radiogroupmgr == null) {
            var RadioGroupMgr = require("RadioGroupMgr");
            cc.vv.radiogroupmgr = new RadioGroupMgr();
            cc.vv.radiogroupmgr.init();
        }

		//console.log(typeof(cc.vv.radiogroupmgr.add));
        cc.vv.radiogroupmgr.add(this);

        this.refresh();
    },
    
    refresh: function() {
        var targetSprite = this.target.getComponent(cc.Sprite);
        var label = this.target.getChildByName("Label");
        if (this.checked) {
            targetSprite.spriteFrame = this.checkedSprite;
            if (label != null) {
                label.color = new cc.Color(146, 50, 50, 255);
            }
        } else {
            targetSprite.spriteFrame = this.sprite;
            if (label != null) {
                label.color = new cc.Color(5, 116, 102, 255);
            }
        }
    },
    
    check: function(value) {
        this.checked = value;
        this.refresh();
        
        if (value && this.notify) {
            this.notify.emit("rb-updated", { id: this.index  ,groupId: this.groupId});
        }
    },
    
    onClicked:function(event,customData) {
        if (event !== undefined && event != null) {
            cc.vv.audioMgr.playButtonClicked();
            //亲友圈设置中要进行设置立即提交
            if (event.target.name == 'clubButton') {
                var clubSetup = cc.vv.clubview.node.getChildByName('ClubSetup');
                var Tvscript = clubSetup.getComponent('ClubSetup');
                var self = this;
                Tvscript.setTableNum(customData, function (tmpIsOK) {
                    if (tmpIsOK != undefined && tmpIsOK != null && tmpIsOK == false) {

                    } else {
                        if (self.type > 0 && self.checked) {
                            self.check(false);
                        } else {
                            cc.vv.radiogroupmgr.check(self);
                        }
                    }

                });

                return;
            }
        }    

        if (this.type > 0 && this.checked) {
            this.check(false);
        } else {
            cc.vv.radiogroupmgr.check(this);
        }
    },

    delOldGroup: function () {
        if(cc.vv && cc.vv.radiogroupmgr){
            cc.vv.radiogroupmgr.del(this);            
        }
    },

    addNewGroup: function () {
        if(cc.vv && cc.vv.radiogroupmgr){
            cc.vv.radiogroupmgr.add(this);
        }
    },

    onJuShuClicked:function(){
        // cc.vv.radiogroupmgr.check(this);

        // if (cc.vv.createRoomOBJ != null) {
        //     var radioButtonIndex = 0;
        //     for (var i = 0; i < cc.vv.createRoomOBJ._jushuxuanze.length; i++) {
        //         if (cc.vv.createRoomOBJ._jushuxuanze[i] == this) {
        //             radioButtonIndex = i;
        //             break;
        //         }
        //     };

            // var labelString = "";
            // if (radioButtonIndex == 0) {
            //     labelString = " x 2";
            // }else if (radioButtonIndex == 1) {
            //     labelString = " x 3";
            // }else {
            //     labelString = " x 4";
            // }
            
            // cc.vv.createRoomOBJ._cearNumberLabel.string = labelString;
        // }
    },
    
    onDestroy:function(){
        if(cc.vv && cc.vv.radiogroupmgr){
            cc.vv.radiogroupmgr.del(this);            
        }
    }
});
