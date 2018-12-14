#import "GPSSDK.h"
#import "GPSLocation.h"


@implementation GPSSDK

#include "ScriptingCore.h"

+(void)locateAccurateCheck{
    [GPSSDK locateAccurate:true];
}
+(void)locateAccurateNotCheck{
    [GPSSDK locateAccurate:false];
}

+(void)locateAccurate:(bool) errorWillCheck{
    NSLog(@"luobin-gps GPSSDK locateAccurate");
    //获取gps的打开状态
    BOOL opened = ([CLLocationManager locationServicesEnabled]);
    if(opened){
        NSLog(@"luobin-gps GPSSDK locateAccurate opened");
            [[GPSLocation shareManager] locateAccurate:^(CGFloat latitude,CGFloat longitude,NSString* location,NSString* address,NSError *error){
                char cbString[255]= {0};
                
                //关闭"定位中"转圈动画
                sprintf(cbString, "if(cc.vv.wc) cc.vv.wc.hide()");
                ScriptingCore::getInstance()->evalString(cbString);
                
                if(error){
                    NSLog(@"luobin-gps GPSSDK locateAccurate error");
                    //设置错误码和错误信息
                    sprintf(cbString, "cc.vv.GPSMgr.setErrorCode(%ld)",(long)error.code);
                    ScriptingCore::getInstance()->evalString(cbString);
                    
                    //sprintf(cbString, "cc.vv.GPSMgr.setErrorMessage('%@')",error.localizedDescription);
                    //ScriptingCore::getInstance()->evalString(cbString);
                    
                    //执行错误问题检查提示
                    if(errorWillCheck){
                        NSLog(@"luobin-gps GPSSDK locateAccurate cc.vv.GPSMgr.chkGps");
                        sprintf(cbString, "cc.vv.GPSMgr.chkGps()");
                        ScriptingCore::getInstance()->evalString(cbString);
                    }
                    
                }else{
                    NSLog(@"luobin-gps latitude:%f  longitude:%f  location:%@  address:%@",latitude,longitude,location,address);
                    const char* locationUTF8 = [location UTF8String];
                    sprintf(cbString, "cc.vv.GPSMgr.setLocation('%s')",locationUTF8);
                    ScriptingCore::getInstance()->evalString(cbString);
                    
                    const char* addressUTF8 = [address UTF8String];
                    sprintf(cbString, "cc.vv.GPSMgr.setAddress('%s')",addressUTF8);
                    ScriptingCore::getInstance()->evalString(cbString);
                    
                    //设置错误码和错误信息为空
                    sprintf(cbString, "cc.vv.GPSMgr.setErrorCode(null)");
                    ScriptingCore::getInstance()->evalString(cbString);
                    
                    sprintf(cbString, "cc.vv.GPSMgr.setErrorMessage(null)");
                    ScriptingCore::getInstance()->evalString(cbString);
                }
            }];

    }else{
        NSLog(@"luobin-gps GPSSDK locateAccurate not opened");
        
        //设置错误码和错误信息为空
        char cbString[255]= {0};
        //关闭"定位中"转圈动画
        sprintf(cbString, "if(cc.vv.wc) cc.vv.wc.hide()");
        ScriptingCore::getInstance()->evalString(cbString);
        
        sprintf(cbString, "cc.vv.GPSMgr.setErrorCode(%d)",-1);
        ScriptingCore::getInstance()->evalString(cbString);

        if(errorWillCheck){
           NSLog(@"luobin-gps GPSSDK locateAccurate cc.vv.GPSMgr.chkGps");
            sprintf(cbString, "cc.vv.GPSMgr.chkGps()");
            ScriptingCore::getInstance()->evalString(cbString);
        }
    }
}

+(void)toNetSetting{
    NSURL *url = [NSURL URLWithString:@"prefs:root=General&path=Network"];
    Class LSApplicationWorkspace = NSClassFromString(@"LSApplicationWorkspace");
    [[LSApplicationWorkspace performSelector:@selector(defaultWorkspace)] performSelector:@selector(openSensitiveURL:withOptions:) withObject:url withObject:nil];
}
+(void)toGPSSetting{
    NSURL*url=[NSURL URLWithString:@"Prefs:root=Privacy&path=LOCATION"];
    Class LSApplicationWorkspace = NSClassFromString(@"LSApplicationWorkspace");
    [[LSApplicationWorkspace performSelector:@selector(defaultWorkspace)] performSelector:@selector(openSensitiveURL:withOptions:) withObject:url withObject:nil];
}
+(void)toGrantSetting{
    NSLog(@"luobin-gps GPSSDK toGrantSetting");
    NSURL*url=[NSURL URLWithString:@"Prefs:root=Privacy&path=LOCATION"];
    Class LSApplicationWorkspace = NSClassFromString(@"LSApplicationWorkspace");
    [[LSApplicationWorkspace performSelector:@selector(defaultWorkspace)] performSelector:@selector(openSensitiveURL:withOptions:) withObject:url withObject:nil];
}
@end
