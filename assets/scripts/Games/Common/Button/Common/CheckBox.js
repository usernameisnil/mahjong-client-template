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

        notify: {
            default: null,
            type: cc.Node,
        },
        index: -1,
    },

    // use this for initialization
    onLoad: function () {
        this.refresh();
    },
    
    onClicked:function(){
        this.checked = !this.checked;
        this.refresh();
        if (this.notify) {
            this.notify.emit("cb-updated", { id: this.index, checked: this.checked});
        }
    },
    
    refresh:function(){
        var targetSprite = this.target.getComponent(cc.Sprite);
        if(this.checked){
            targetSprite.spriteFrame = this.checkedSprite;
        }
        else{
            targetSprite.spriteFrame = this.sprite;
        }
    },

    setChecked: function (checked) {
        this.checked = checked;
    },
    
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
