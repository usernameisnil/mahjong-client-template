cc.Class({
    extends: cc.Component,
    properties: {
        _location: null,
        _address: null,
        _errorCode:null,
        _errorMessage:null,
        gpsChkFlag:null

    },
    init: function () {
        var self=this;
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log('chkgps','on');
            if(self.gpsChkFlag){
                console.log('chkgps','onchk',self.gpsChkFlag);
                self.gpsChkFlag=null;
                cc.vv.alert.close();
                //cc.vv.wc.show(3);
                cc.vv.wc.hide();
                var errorWillCheck = true;
                cc.vv.GPSMgr.locateAccurate(errorWillCheck);
            }
        });
        if(!cc.sys.isNative){
            return;
        }
        var errorWillCheck = false;
        self.locateAccurate(errorWillCheck);
    },
    locateAccurate:function(errorWillCheck){
        console.log('luobin','GPSMgr','locateAccurate');
        if(cc.sys.os==cc.sys.OS_ANDROID){
            if(errorWillCheck == true){
                jsb.reflection.callStaticMethod('com/yzqp/game/max/gps/GPSSDK','locateAccurateCheck','()V');
            }else{
                jsb.reflection.callStaticMethod('com/yzqp/game/max/gps/GPSSDK','locateAccurateNotCheck','()V');
            }

        }else if(cc.sys.os==cc.sys.OS_IOS) {
            if (errorWillCheck == true) {
                jsb.reflection.callStaticMethod('GPSSDK', 'locateAccurateCheck');
            } else {
                jsb.reflection.callStaticMethod('GPSSDK', 'locateAccurateNotCheck');
            }
        }
    },

    getLocation: function () {
        console.log('luobin-gps','GPSMgr','getLocation');
        if(!cc.sys.isNative){
            return;
        }
        var location;
        var ver='2018';
        try {
            location=JSON.parse(this._location);
        } catch (error) {
            return JSON.stringify({ver:ver});
        }
        if(location!=null && location.latitude){
            location.ver=ver;
            return JSON.stringify(location);
        }
        return JSON.stringify({ver:ver});
    },
    getAddress: function () {
        console.log('luobin-gps','GPSMgr','getAddress');
        if(!cc.sys.isNative){
            return;
        }
        return this._address;
    },
    setLocation:function(location){
        console.log('luobin-gps','GPSMgr','setLocation:',location);
        if(!cc.sys.isNative){
            return;
        }
        this._location = location;
    },
    setAddress:function(address){
        console.log('luobin-gps','GPSMgr','setAddress:',address);
        if(!cc.sys.isNative){
            return;
        }
        this._address = address;
    },
    setErrorCode:function(errorCode){
        console.log('luobin-gps','GPSMgr','setErrorCode:',errorCode);
        this._errorCode = errorCode;
    },
    getErrorCode:function(){
        console.log('luobin-gps','GPSMgr','getErrorCode:',this._errorCode);
        return this._errorCode;
    },
    setErrorMessage:function(errorMessage){
        console.log('luobin-gps','GPSMgr','setErrorMessage:',errorMessage);
        this._errorMessage = errorMessage;
    },
    getErrorMessage:function(){
        console.log('luobin-gps','GPSMgr','getErrorMessage:',this._errorMessage);
        return this._errorMessage;
    },
    toNetSetting:function(){
        console.log('luobin','GPSMgr','toNetSetting');
        if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod('com/yzqp/game/max/gps/GPSSDK','toNetSetting','()V');
        }else if(cc.sys.os==cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod('GPSSDK','toNetSetting');
        }
    },
    toGPSSetting:function(){
        console.log('luobin','GPSMgr','toGPSSetting');
        if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod('com/yzqp/game/max/gps/GPSSDK','toGPSSetting','()V');
        }else if(cc.sys.os==cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod('GPSSDK','toGPSSetting');
        }
    },
    toGrantSetting:function(){
        console.log('luobin','GPSMgr','toGrantSetting');
        if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod('com/yzqp/game/max/gps/GPSSDK','toGrantSetting','()V');
        }else if(cc.sys.os==cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod('GPSSDK','toGrantSetting');
        }
    },

    chkGps:function(){
        console.log("luobin-gps",'GPSMgr',"chkGps");
        var self=this;
        var errorCode = self.getErrorCode();

        if(errorCode == 18 || errorCode == 19){
            var toNetSetting=function(){
                self.gpsChkFlag = 1
                self.toNetSetting();              
            };

            //show: function(content, onok, needcancel, changeBtnFrames, isShow, onCancel) {
            cc.vv.alert.show('定位失败!请检查网络设置', toNetSetting, true,null,null,);
            return false;
        }
        if(errorCode == -1 ||errorCode == 9||errorCode == 11){
            var toGPSSetting=function(){
                self.gpsChkFlag = 2
                self.toGPSSetting();
            };
            cc.vv.alert.show('定位失败!请检查GPS设置', toGPSSetting, true);
            return false;
        }
        if(errorCode == 12 ||errorCode == 13||errorCode == 2){
            var toGrantSetting=function(){
                self.gpsChkFlag = 3
                self.toGrantSetting();
            };
            cc.vv.alert.show('定位失败!请检查GPS权限设置', toGrantSetting, true);
            return false;
        }
        if(errorCode != null){
            var locateAccurate=function(){
                self.gpsChkFlag = 4
                cc.vv.alert.close();
                cc.vv.wc.show(3);
                var errorWillCheck = true;
                cc.vv.GPSMgr.locateAccurate(errorWillCheck);
            };
            cc.vv.alert.show('定位失败!错误码为:'+errorCode+",请重新定位", locateAccurate, true);
            return false;
        }
        return true;
    },
});
