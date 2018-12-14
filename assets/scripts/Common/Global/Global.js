var Global = cc.Class({
    extends: cc.Component,
    statics: {
        isstarted:false,
        netinited:false,
        userguid:0,
        nickname:"",
        money:0,
        lv:0,
        roomId:0,
        isFormGame:false,

        ishallSync: false,      

        _space:null,

        lastRecieveTime:0,

        clubTempData:{},

        clubFriendData:[],

        loadScencesed:[],//已经进行预加载的场景

        deepCopy:function (obj){
            if(typeof obj != 'object'){
                return obj;
            }
            var newobj = {};
            for ( var attr in obj) {
                newobj[attr] = this.deepCopy(obj[attr]);
            }
            return newobj;
        },

        diff:function (obj1,obj2){
            var o1 = obj1 instanceof Object;
            var o2 = obj2 instanceof Object;
            if(!o1 || !o2){/*  判断不是对象  */
                return obj1 === obj2;
            }
    
            if(Object.keys(obj1).length !== Object.keys(obj2).length){
                return false;
                //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
            }
    
            for(var attr in obj1){
                var t1 = obj1[attr] instanceof Object;
                var t2 = obj2[attr] instanceof Object;
                if(t1 && t2){
                    return this.diff(obj1[attr],obj2[attr]);
                }else if(obj1[attr] !== obj2[attr]){
                    return false;
                }
            }
            return true;
        },

        dateFormat_date:function(time){
            var date = new Date(time);
            var datetime = "{0}-{1}-{2}";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month >= 10? month : ("0"+month);
            var day = date.getDate();
            day = day >= 10? day : ("0"+day);
            datetime = datetime.format(year,month,day);
            return datetime;
        },

        dateFormat_time:function(time){
            var date = new Date(time);
            var datetime = "{0}:{1}:{2}";
            var h = date.getHours();
            h = h >= 10? h : ("0"+h);
            var m = date.getMinutes();
            m = m >= 10? m : ("0"+m);
            var s = date.getSeconds();
            s = s >= 10? s : ("0"+s);
            datetime = datetime.format(h,m,s);
            return datetime;
        },

        dateFormat:function(time){
            var date = new Date(time);
            var datetime = "{0}-{1}-{2} {3}:{4}:{5}";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month >= 10? month : ("0"+month);
            var day = date.getDate();
            day = day >= 10? day : ("0"+day);
            var h = date.getHours();
            h = h >= 10? h : ("0"+h);
            var m = date.getMinutes();
            m = m >= 10? m : ("0"+m);
            var s = date.getSeconds();
            s = s >= 10? s : ("0"+s);
            datetime = datetime.format(year,month,day,h,m,s);
            return datetime;
        },

        DelayOperation:function (microsecond) {

            if (Date.now() - this.lastRecieveTime > microsecond) {
                this.lastRecieveTime = Date.now();
               return true;
            }else return  false;
            
        },

        restartGame:function(){
            cc.vv.net.endInterval();
            cc.vv.net.endSocket();
            cc.vv.net_hall.endInterval();
            cc.vv.net_hall.endSocket();

            cc.vv.gameNetMgr.clearHandlers()
            if (cc.vv.http.master_url == cc.guest_url) { cc.vv.http.url = cc.guest_url; }
            else {
                cc.vv.http.url = cc.formal_url;
            }
            cc.vv.audioMgr.stopAll();
            cc.CGameoverActionDataModel._isInit = false;
            cc.CCreateConfigDataModel._isInit = false;
            cc.CGameConfigDataModel._isInit = false;
            cc.CIntegralShopConfigDataModel._isInit = false;
            cc.game.restart()
    
        },



        myPreloadScene: function (sceneName,callback) {
            var self = this;

            var isLoad = true;
            for (let index = 0; index < this.loadScencesed.length; index++) {
                const element = this.loadScencesed[index];
                if (element == sceneName) {
                    isLoad = false;
                    break;
                }                
            }
            
            if (isLoad) {
                cc.vv.wc.show(0);//正在加载中
                cc.director.preloadScene(sceneName, function () {
                    cc.log(sceneName + " scene preloaded");
                    self.loadScencesed.push(sceneName);
                    cc.vv.wc.hide();
                    callback()
                    
                });
            }else{
                callback()
                
            }

        },         

    },
});