cc.Class({
    extends: cc.Component,

    properties: {
        runNode:null,
        tips:[],
        selected:[],
        paoArr:[],
        runArr:[],
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv === null) {
            return;
        }
        this.initView();
        // this.initXuanPao();
        this.initEventHandlers();
    },

    initView:function() {
        var gameChild = this.node.getChildByName("game");
        this.runNode = gameChild.getChildByName("run");

        this.runNode.active = cc.vv.gameNetMgr.isShowPao;

        // 头像上显示跑几
        // var arr = ["myself","right","up","left"];
        // for(var i = 0; i < arr.length; ++i){
        //     var side = gameChild.getChildByName(arr[i]);
        //     var seat = side.getChildByName("seat");
        //     var pao = seat.getChildByName("que");
        //     this.paoArr.push(pao);
        // }

        var seatsArr = gameChild.getChildByName("seats")
        for (var i = 0; i < seatsArr.childrenCount; i++) {
            var seat = seatsArr.children[i];
            var pao = seat.getChildByName("que");
            this.paoArr.push(pao);
        }

        this.reSet();

        var tips = this.runNode.getChildByName("tips");
        for(var i = 0; i < tips.childrenCount; ++i){
            var n = tips.children[i];
            if (n == null) {
                continue;
            }
            this.tips.push(n.getComponent(cc.Label));
        }

        if(cc.vv.gameNetMgr.gamestate == "xiapao" && cc.vv.gameNetMgr.isShowPao == true){
            this.showXiaPao();
            this.syncInit();
        }else {
            this.initXuanPao(); //重连
        }
    },
    
    reSet:function(){
        this.runNode.getChildByName("buPao").getComponent(cc.Button).interactable = true;
        this.runNode.getChildByName("paoYi").getComponent(cc.Button).interactable = true;
        this.runNode.getChildByName("paoEr").getComponent(cc.Button).interactable = true;
        this.runNode.getChildByName("paoSan").getComponent(cc.Button).interactable = true;
        this.runNode.getChildByName("paoSi").getComponent(cc.Button).interactable = true;

        this.runArr.splice(0, this.runArr.length);
        this.runArr = [];
        this.runArr.push(this.runNode.getChildByName("buPao"));
        this.runArr.push(this.runNode.getChildByName("paoYi"));
        this.runArr.push(this.runNode.getChildByName("paoEr"));
        this.runArr.push(this.runNode.getChildByName("paoSan"));
        this.runArr.push(this.runNode.getChildByName("paoSi"));

        for(var j = 0; j < this.runArr.length-1; ++j){
            this.runArr[j].active = true;
        }

        this.selected.splice(0, this.selected.length);
        this.selected = [];
        this.selected.push(this.runNode.getChildByName("buPao_Selected"));
        this.selected.push(this.runNode.getChildByName("paoYi_Selected"));
        this.selected.push(this.runNode.getChildByName("paoEr_Selected"));
        this.selected.push(this.runNode.getChildByName("paoSan_Selected"));
        this.selected.push(this.runNode.getChildByName("paoSi_Selected"));
        for(var i = 0; i < this.selected.length; ++i){
            this.selected[i].active = false;
        }

        for(var i = 0; i < this.tips.length; ++i){
            if (i == 0) {
                this.tips[i].node.active = true;
                this.tips[i].node.getComponent(cc.Label).string = "请选择下跑";
            }else {
                this.tips[i].node.active = false;
                this.tips[i].node.getComponent(cc.Label).string = "已下跑";
            }
            
        }

        for(var i = 0; i < this.paoArr.length; ++i){
            for(var j = 0; j < this.paoArr[i].children.length; ++j){
                this.paoArr[i].children[j].active = false;    
            }
        }     
    },

    showXiaPao:function(){
        this.runNode.active = true;
    },

    hideXiaPao: function () {
        cc.vv.gameNetMgr.isShowPao = false;
        this.runNode.active = false;
    },

    initXuanPao:function(){
        var arr = ["buPao","paoYi","paoEr","paoSan","paoSi"];
        var data = cc.vv.gameNetMgr.seats;
        for(var i = 0; i < data.length; ++i){
            var pao = data[i].xiapao;
            if(pao == null || pao < 0 || pao >= arr.length){
                pao = null;
            }
            else{
                pao = arr[pao]; 
            }
            
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            for (var j = 0; j < this.paoArr[localIndex].children.length; j++) {
                this.paoArr[localIndex].children[j].active = false; 
            };

            if(pao){
                this.paoArr[localIndex].getChildByName(pao).active = true;    
            }
        }
    },
    
    initEventHandlers:function() {
        var self = this;

        this.node.on('game_xiapao',function(data){
            if (cc.vv.gameNetMgr.gamestate == "xiapao" && cc.vv.gameNetMgr.isShowPao == true) {
                self.reSet();
                self.showXiaPao();
            }
        });
        
        this.node.on('game_xiapao_notify',function(data){
            var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
            console.log("------------");
            console.log("game_xiapao_notify:" + localIndex);
            console.log("------------");
            self.tips[localIndex].node.active = true;
            self.tips[localIndex].node.getComponent(cc.Label).string = "已下跑";
        });
        
        this.node.on('game_xiapao_finish',function(){
            self.hideXiaPao();
            self.initXuanPao();
        });

        this.node.on('game_xiapao_begin',function(){
            self.initXuanPao();
        });
    },

    syncInit: function () {
        var data = cc.vv.gameNetMgr.seats;
        cc.log("run data = ", data);
        if (data == null) {
            return;
        }
        for(var i = 0; i < this.paoArr.length; ++i){
            for(var j = 0; j < this.paoArr[i].children.length; ++j){
                this.paoArr[i].children[j].active = false;    
            }
        }  
        
        for(var i = 0; i < this.selected.length; ++i){
            this.selected[i].active = false;
        }  
        
        for(var i = 0; i < data.length; ++i){
            var pao = data[i].xiapao;
            if (pao != null && pao >= 0) {
                var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
                if (localIndex == 0) {
                    this.paoArr[localIndex].children[pao].active = true;
                    for(var j = 0; j < this.runArr.length; ++j){
                        this.runArr[j].active = false;
                    }
                }
                this.tips[localIndex].node.active = true;
                this.tips[localIndex].node.getComponent(cc.Label).string = "已下跑";
            }
        }
    },

    onXuanPaoClicked:function(event){
        var type = 0;
        if(event.target.name == "buPao"){
            type = 0;
        }
        else if(event.target.name == "paoYi"){
            type = 1;
        }
        else if(event.target.name == "paoEr"){
            type = 2;
        }
        else if(event.target.name == "paoSan"){
            type = 3;
        }else if (event.target.name == "paoSi") {
            //新增跑四
            type = 4;
        }
        for(var i = 0; i < this.selected.length; ++i){
            this.selected[i].active = false;
        }  
        this.selected[type].active = true;
        cc.vv.net.send("xiapao",type);
    },
});
