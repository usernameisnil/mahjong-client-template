//cc.redPackShareImgUrl='http://123.207.40.180:8801/zhuolumj/public/';
cc.redPackShareImgUrl = 'http://update.ydjoy.com/yanzhao/public/';
cc.guest_url = "http://123.207.40.180:7960";//7700测试服
cc.formal_url = "http://yanzhaomj.ydjoy.com:7960";//正式服


var URL = cc.guest_url;
//var URL = cc.formal_url;


//cc.client_version = 1.0;//(测试)
cc.client_version = 1.3;//(正式)
cc.VERSION = 20161227;
var HTTP = cc.Class({
    extends: cc.Component,

    statics:{
        sessionId : 0,
        userId : 0,
        master_url:URL,
        url:URL,
        flag:0,
        needHttpReconnect:true,
        sendRequest : function(path,data,handler,extraUrl){

            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for(var k in data){
                if(str != "?"){
                    str += "&";
                }
                str += k + "=" + data[k];
            }
         
            if(extraUrl == null){
                extraUrl = HTTP.url;
            }
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);
            xhr.open("GET",requestURL, true);
            if (cc.sys.isNative){
                xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
            }
            
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                 
                    console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if(handler !== null){
                            handler(ret);
                        }                        /* code */
                    } catch (e) {

                        
                        console.log("err:" + e);
                    }
                    finally{
                        if(cc.vv && cc.vv.wc){
                            cc.vv.wc.hide();    
                        }
                    }
                }else {
                    console.log("readyState=" + xhr.readyState, "    status = ", xhr.status);
                    if(cc.vv && cc.vv.wc){
                        cc.vv.wc.hide();
                    }

                    if (xhr.readyState == 4 && xhr.status != 200 && xhr.status != 0) {
                      
                        if(cc.vv.global._space === 'game'){
                            if (cc.vv.reconnect) {
                                var reconnectSio = function () {
                                    cc.vv.reconnect.reconnectFn();
                                }
    
                                cc.vv.reconnect.node.on('disconnect', reconnectSio);
                                cc.vv.gameNetMgr.dispatchEvent('disconnect');
                            }
                        }
                      
                        if(cc.vv.global._space === 'hall' ||cc.vv.global._space === 'hallClub' ||cc.vv.global._space === 'hallDaiKai'){
                            if (cc.vv.hallreconnect) {
                                var reconnectSio = function () {
                                    cc.vv.hallreconnect.reconnectFn();
                                }    
                                cc.vv.hallreconnect.node.on('disconnect', reconnectSio);
                                cc.vv.gameNetMgr.dispatchEvent('disconnect');
                            }
                        }              
                    }
                    
                    // if (xhr.readyState == 4 && xhr.status != 200 && xhr.status != 0) {
                    //     if (cc.vv.reconnect) {
                    //         var reconnectSio = function () {
                    //             cc.vv.reconnect.reconnectFn();
                    //         }

                    //         cc.vv.reconnect.node.on('disconnect', reconnectSio);
                    //         cc.vv.gameNetMgr.dispatchEvent('disconnect');
                    //     }
                    // }
                }
            };

            var reConnect = function () {
                console.log("luobin",'xhr timeout');
                if (cc.vv && cc.vv.wc) {
                    cc.vv.wc.show(1);
                }
                
                var fn = function(){
                    cc.vv.http.sendRequest(path,data,handler,extraUrl);
                }
                if(cc.vv.http.flag < 3){
                    fn()
                }
                if(cc.vv.http.flag >= 3) {
                    cc.vv.http.flag = 0;
                    
                    xhr.abort();
                    if (cc.vv.alert.getActive() == false) {
                        cc.vv.alert.show("网络不给力，重连失败！是否继续？", fn, false, null, true);
                    }
                }
                cc.vv.http.flag ++;
            }

            xhr.ontimeout = xhr.onerror = function(event){
                if (cc.vv.http.needHttpReconnect)
                {
                    //xhr.abort();
                    //cc.vv.alert.show("网络不给力，此次请求失败！");
                    reConnect();
                }
            }
            
           
            xhr.send();
            return xhr;
        },
    },
});