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
    },

    addClickEvent: function (node, target, component, handler, data) {
        console.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        eventHandler.customEventData = data;
        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    addSlideEvent: function (node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    showDialog: function (dialog, path, enable, parent) {
        var body = cc.find(path, dialog);
        if (enable) {
            body.scaleX = 0.7;
            body.opacity = 120;
            body.scaleY = 0.7;
            dialog.active = true;
            body.stopAllActions();
            var action = cc.sequence(cc.spawn(cc.scaleTo(0.2, 1.1), cc.fadeTo(0.2, 200)),
                cc.spawn(cc.scaleTo(0.1, 1.0), cc.fadeTo(0.1, 255)));
            body.runAction(action);
        } else {
            var data = {
                dialog: dialog,
                parent: parent,
            };

            var finished = cc.callFunc(function (target, node) {
                node.dialog.active = false;
                if (node.parent) {
                    node.parent.active = false;
                }
            }, this, data);
            var action = cc.sequence(cc.spawn(cc.scaleTo(0.1, 0.7), cc.fadeTo(0.1, 120)),
                finished);
            body.stopAllActions();
            body.runAction(action);
        }
    },

    showFrame: function (frame, headPath, bodyPath, enable, parent) {
        var head = cc.find(headPath, frame);
        var body = cc.find(bodyPath, frame);
        if (enable) {
            head.opacity = 0;
            body.opacity = 0;
            frame.active = true;

            var nodes = {
                head: head,
                body: body,
            };

            var showHead = cc.callFunc(function (target, data) {
                data.head.opacity = 255;
            }, this, nodes);

            var showBody = cc.callFunc(function (target, data) {
                data.body.opacity = 255;
            }, this, nodes);

            var actionHead = cc.sequence(cc.hide(),
                cc.place(head.x, head.y + head.height),
                cc.show(),
                showHead,
                cc.moveBy(0.3, 0, 0 - head.height));
            head.stopAllActions();
            head.runAction(actionHead);

            var actionBody = cc.sequence(cc.hide(),
                cc.place(body.x, body.y - body.height),
                cc.show(),
                showBody,
                cc.moveBy(0.3, 0, body.height));
            body.stopAllActions();
            body.runAction(actionBody);
        } else {
            var data = {
                headX: head.x,
                headY: head.y,
                bodyX: body.x,
                bodyY: body.y,
                head: head,
                body: body,
                node: frame,
                parent: parent,
            };

            var finished = cc.callFunc(function (target, data) {
                data.node.active = false;
                data.head.y = data.headY;
                data.body.y = data.bodyY;
                if (data.parent) {
                    data.parent.active = false;
                }
            }, this, data);

            var actionHead = cc.moveBy(0.3, 0, head.height);
            head.stopAllActions();
            head.runAction(actionHead);

            var actionBody = cc.sequence(cc.moveBy(0.31, 0, 0 - body.height), finished);
            body.stopAllActions();
            body.runAction(actionBody);
        }
    },

    getNameStr: function (str, maxLength) {
        var nameStr = "";
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len++;
            }
            if (len > maxLength) {
                nameStr = str.substring(0, i) + ".."
                return nameStr
            }
        }
        return str;
    },

    createNode: function (type) {
        var node = new cc.Node()
        if (type && (typeof(param) === "function")) {
            return node.addComponent(type)
        }
        return node
    },

    createTexture: function (filepath, cb) {
        var bTrue = filepath[0] == "#"
        if (!bTrue) {
            filepath = "resources/" + filepath + ".png"
            filepath = cc.url.raw(filepath)
        } else {
            filepath = filepath.replace("#", "")
            if (!cc.sys.isNative) {
                filepath = "resources/textures/HistoryScore/47_hs_btn_back.png";
                filepath = cc.url.raw(filepath)
            }
        }
        return cc.textureCache.addImage(filepath, cb)
    },

    createSpriteFrame: function (params, cb) {
        if (typeof (params) === "string") {
            params = {path: params}
        }
        params.name = params.name || params.path
        params.name = params.name.replace(".png", "")
        params.name = params.name.replace(".jpg", "")
        // if(params.name)//先检查缓存是否纯在这个东西
        // {
        //     var sf = cc.spriteFrameCache.getSpriteFrame(params.name)
        //     if(sf)
        //     {
        //         cb(sf)
        //         return
        //     }
        // }
        if (params.texture)//是否有texture
        {
            if (params.rect) {
                sf = new cc.SpriteFrame(params.texture, params.rect)
            }
            else {
                sf = new cc.SpriteFrame(params.texture)
            }
            // cc.spriteFrameCache.addSpriteFrame(sf,params.name)
            if (cb) {
                cb(sf)
            }

            return
        }
        else if (params.path)//最常见的路径加载
        {
            //如果名字和路径不同，则先加载为texture之后再加载，以免同一个图又不同的spriteframe对象
            if (params.path !== params.name) {
                cc.vv.utils.createTexture(params.path, function (tex) {
                    params.texture = tex
                    cc.vv.utils.createSpriteFrame(params, cb)
                })
                return
            }
            cc.loader.loadRes(params.path, cc.SpriteFrame, function (err, sf) {
                if (err) {
                    cc.error(err)
                    cb()
                    return
                }
                // cc.spriteFrameCache.addSpriteFrame(sf,params.name)
                if (params.rect) {
                    sf.setRect(params.rect)
                }
                if (cb) {
                    cb(sf)
                }
            })
        }
    },

    getFileName: function (fileUrl) {
        if (fileUrl == null) {
            return;
        }

        var nameArray = fileUrl.split("/");
        var fileName = nameArray[nameArray.length-1];
        cc.log("wujun nameArray = ", nameArray);
        return fileName;
    },

    isArray: function (data) {
        return (typeof data == "object" && data.constructor == Array);
    },
    
    isObject: function (data) {
        return (typeof data == "object" && data.constructor == Object);
    },

    isString: function (data) {
        return (typeof data == "string" && data.constructor == String);
    },

    isNumber: function (data) {
        return (typeof data == "number" && data.constructor == Number);
    },

    isDate: function (data) {
        return (typeof data == "object" && data.constructor == Date);
    },

    isFunction: function (data) {
        return (typeof data == "function" && data.constructor == Function);
    },

    isUndefined: function (data) {
        return (typeof(data) == "undefined");
    },

    isNull: function (data) {
        return (!data && typeof(data) != "undefined" && data != 0)
    },

    isNaNType: function (data) {
        return isNaN(data);
    },

    isNullOrUndefined: function (data) {
        if (this.isUndefined(data) || this.isNull(data)) {
            return true;
        }else {
            return false;
        }
    },
});

