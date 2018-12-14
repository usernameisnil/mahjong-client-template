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
        
        recordItem: {
            default: null,
            type:cc.Prefab
        },
        recordScroll: {
            default: null,
            type: cc.ScrollView
        },
        
    },

    // use this for initialization
    onLoad: function () {
    },

    init: function (data) {

        this.recordData = data;
        this.listItems = [];

        this.initListScroll();
    },

    initScroll: function () {
        var content = this.recordScroll.content;
        content.removeAllChildren();
        this.listItems.splice(0, this.listItems.length);
        this.listItems = [];
    },

    initListScroll: function () {
        this.initScroll();

        var listData = this.recordData;
        if (listData == null) {
            return;
        }

        cc.log("wujun listData = ", listData);

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }

        var content_height = 0;

        var content = this.recordScroll.content;

        for (var i = 0; i < list_num; i++) {

            var itemData = this.getItemData(listData[i]);
            itemData.itemIndex = i+1;
            itemData.isClub = true;

            var item = cc.instantiate(this.recordItem);
            var IScript = item.getComponent('OpenRoomRecord');
            if (IScript) {
                IScript.init(itemData);
            }

            var itemLength = item.height;
            item.y = -(content_height + itemLength*0.5);
            content_height = content_height + itemLength;
            content.height = content_height;
            content.addChild(item);

            this.listItems.push(item);
        }
    },

    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        this.node.destroy();
    },

    getItemData: function (data) {
        var itemData = {};
        itemData.createTime = this.getCreateTime(data.create_time);
        itemData.roomid = data.roomid;
        itemData.gamePlay = this.getGamePlay(data.conf);
        itemData.playerList = data.player_list;

        return itemData;
    },

    getCreateTime: function (createTime) {
        var createTime = new Date(createTime * 1000)
        var year = createTime.getFullYear()
        var month =(createTime.getMonth() + 1).toString()  
        var day = (createTime.getDate()).toString()
        var hour = (createTime.getHours()).toString()
        var minute = (createTime.getMinutes()).toString()
        var seconds = (createTime.getSeconds()).toString()
        if (month.length == 1) {  
            month = "0" + month
        }  
        if (day.length == 1) {  
            day = "0" + day
        }  
        if (hour.length == 1) {  
            hour = "0" + hour  
        }  
        if (minute.length == 1) {  
            minute = "0" + minute  
        }  
        if (seconds.length == 1) {
            seconds = "0" + seconds
        }
        var timeString = year + "-" + month + "-" + day + "\n" + hour + ":" + minute + ":" + seconds;
        return timeString;
        
    },

    getGamePlay: function (conf) {

        if (conf && conf.maxGames != null) {

    

            return cc.CGameConfigDataModel.getWanfa(conf);

        }
        return "";

        // var strArr = [];
        // if (conf && conf.maxGames!=null) {
            
            

        //     if (conf.opType == 1) {
        //         strArr.push("燕赵玩法: ");
        //     } else if (conf.opType == 2) {
        //         strArr.push("红中玩法: ");
        //     } else if (conf.opType == 10) {
        //         strArr.push("斗地主玩法: ")
        //     } else if (conf.opType == 3) {
        //         strArr.push("159玩法");
        //     } else if (conf.opType == 4) {
        //         strArr.push("258玩法");
        //     }

        //     if (conf.nSeats && conf.nSeats > 0) {
        //         strArr.push(conf.nSeats + "人")
        //     }

        //     strArr.push(", " + conf.maxGames + "局");

        //     switch (conf.reset_count) {
        //         case 1:
        //             strArr.push(", 一局选漂");
        //             break;
        //         case 4:
        //             strArr.push(", 四局选漂");
        //             break;
        //     }

        //     if (conf.opType == 1) {

        //         if (conf.daifeng) {
        //             strArr.push(", 带风");
        //         }

        //         switch (conf.hunCount) {
        //             case 1:
        //                 strArr.push(", 单混(下)");
        //                 break;
        //             case 2:
        //                 strArr.push(", 2混(上下)");
        //                 break;
        //             case 3:
        //                 strArr.push(", 3混(上中下)");
        //                 break;
        //         }
                
        //     }else if (conf.opType == 2) {

        //         if (conf.dianpaopei) {
        //             strArr.push(", 大包");
        //         }

        //         switch (conf.hunCount) {
        //             case 1:
        //                 strArr.push(", 32封顶");
        //                 break;
        //             case 2:
        //                 strArr.push(", 64封顶");
        //                 break;
        //             case 3:
        //                 strArr.push(", 不限");
        //                 break;
        //         }
                
        //     } else if (conf.opType == 10) {
        //         if (conf.zha) {
        //             strArr.push(', 炸翻倍')
        //         }
        //     } else if (conf.opType == 3) {
        //         if (conf.fanpai == 2) {
        //             strArr.push("翻2张牌");
        //         } else if (conf.fanpai == 4) {
        //             strArr.push("翻4张牌");
        //         } else if (conf.fanpai == 6) {
        //             strArr.push("翻6张牌");
        //         }


        //     } else if (conf.opType == 4) {


        //     }


        //     if (conf.fangzuobi) {
        //         strArr.push(", 开启GPS");
        //     }

        //     strArr.push(".");

        //     return strArr.join("");
        // }

        // return "";
    },

    onDestroy: function () {
        
    }

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
