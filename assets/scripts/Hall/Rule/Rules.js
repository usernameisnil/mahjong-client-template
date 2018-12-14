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
        _viewlist:null,
        _scrollview: null,
        _content:null,
        _viewitemTemp:null,
        
        rulesZL: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rulesHZ: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rules159: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rules258: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rulesTDH: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rulesDDZ: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rulesErwuba: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rulesTK: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rulesPDK: {
            default:[],
            type:[cc.SpriteFrame]
        },
        rulesSXTDH: {
            default:[],
            type:[cc.SpriteFrame]
        },

    },

    // use this for initialization
    onLoad: function () {
        this._viewlist = cc.find("body/viewlist", this.node);
        this._scrollview = this._viewlist.getComponent(cc.ScrollView);
        this._content = cc.find("view/content",this._viewlist);
        
        this._viewitemTemp = this._content.children[0];
        this._content.removeChild(this._viewitemTemp);
        
        var self = this;
        
        self.initRulesList(self.rulesTDH);
        
        this.node.on("rb-updated", function(event) {
           

            var wanfa = [ self.rulesTDH, self.rules159, self.rules258,self.rulesErwuba, self.rulesZL, 
                        self.rulesHZ ,self.rulesDDZ,self.rulesTK,self.rulesPDK,self.rulesSXTDH];
           
            var id = event.detail.id;
            if (id == null || id < 0 || id >= wanfa.length) {
                return;
            }
            
            self.initRulesList(wanfa[id]);
        });
    },
    
    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    onBtnBackClicked:function() {
		cc.vv.audioMgr.playButtonClicked();
		cc.vv.wc.hide();

		cc.vv.utils.showFrame(this.node, 'head', 'body', false);
    },
    
    initRulesList:function(data) {
        for(var i = 0; i < data.length; ++i){
            var node = this.getViewItem(i);
            var sprite = node.getComponent(cc.Sprite);

            sprite.spriteFrame = data[i];
        }

        this.shrinkContent(data.length);
        this._scrollview.scrollToTop();
    },
    
    getViewItem:function(index){
        var content = this._content;
        if(content.childrenCount > index){
            return content.children[index];
        }
        var node = cc.instantiate(this._viewitemTemp);
        content.addChild(node);
        return node;
    },

    shrinkContent:function(num){
        while(this._content.childrenCount > num){
            var lastOne = this._content.children[this._content.childrenCount -1];
            this._content.removeChild(lastOne,true);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
