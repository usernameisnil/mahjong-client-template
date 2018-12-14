/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import <UIKit/UIKit.h>
#import "cocos2d.h"

#import "AppController.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "platform/ios/CCEAGLView-ios.h"
#import "VoiceSDK.h"

@implementation AppController

#pragma mark -
#pragma mark Application lifecycle

// cocos2d application instance
static AppDelegate s_sharedApplication;
static bool __isWxLogin = false;

//全面屏
static bool _isAllScreen = false;  //是否全面屏
static float _notchWidth = 0;  //刘海或者状态栏的高度

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    
    // Override point for customization after application launch.
    
    // Add the view controller's view to the window and display.
    window = [[UIWindow alloc] initWithFrame: [[UIScreen mainScreen] bounds]];
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [window bounds]
                                         pixelFormat: kEAGLColorFormatRGBA8
                                         depthFormat: GL_DEPTH24_STENCIL8_OES
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: NO
                                     numberOfSamples: 0 ];
    
    [eaglView setMultipleTouchEnabled:YES];
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    // Use RootViewController manage CCEAGLView
    viewController = [[RootViewController alloc] initWithNibName:nil bundle:nil];
    viewController.wantsFullScreenLayout = YES;
    viewController.view = eaglView;
    
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:viewController];
    }
    
    [window makeKeyAndVisible];
    
    [[UIApplication sharedApplication] setStatusBarHidden: YES];
    
    // IMPORTANT: Setting the GLView should be done after creating the RootViewController
    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView(eaglView);
    cocos2d::Director::getInstance()->setOpenGLView(glview);
    
    cocos2d::Application::getInstance()->run();
    
    //向微信注册
    [WXApi registerApp:@"wx2e60d280fa493492" withDescription:@"yzqp"];
    
    [self setAllScreenAtPhone];
    
    return YES;
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url{
    [WXApi handleOpenURL:url delegate:self];
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation{
    [WXApi handleOpenURL:url delegate:self];
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary*)options{
    [WXApi handleOpenURL:url delegate:self];
    return YES;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    cocos2d::Director::getInstance()->pause();
}

+(void) share:(NSString*)url shareTitle:(NSString*)title shareDesc:(NSString*)desc isTimeline:(BOOL)isTimeLine
{
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = desc;
    [message setThumbImage:[UIImage imageNamed:@"Icon-80.png"]];
    
    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = url;
    
    message.mediaObject = ext;
    
//    GetMessageFromWXResp* resp = [[[GetMessageFromWXResp alloc] init] autorelease];
    SendMessageToWXReq *resp = [[SendMessageToWXReq alloc]init];
    resp.message = message;
    resp.bText = NO;
    
    __isWxLogin = false;
    
    if (isTimeLine) {
        resp.scene = WXSceneTimeline;
    }else {
        resp.scene = WXSceneSession;
    }
//    [WXApi sendResp:resp];
    [WXApi sendReq:resp];
}

+(void) shareIMG:(NSString*)filePath width:(int)width height:(int)height
{
    WXMediaMessage *message = [WXMediaMessage message];
    [message setThumbImage:[UIImage imageNamed:@"Icon-80.png"]];
    
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [NSData dataWithContentsOfFile:filePath];
    message.mediaObject = ext;
    
    GetMessageFromWXResp* resp = [[[GetMessageFromWXResp alloc] init] autorelease];
    resp.message = message;
    resp.bText = NO;
    
    __isWxLogin = false;
    [WXApi sendResp:resp];
}
+(void) shareRedPackIMG:(NSString*)filePath width:(int)width height:(int)height
{
    WXMediaMessage *message = [WXMediaMessage message];
    [message setThumbImage:[UIImage imageNamed:@"Icon-80.png"]];
    
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [NSData dataWithContentsOfFile:filePath];
    message.mediaObject = ext;
    SendMessageToWXReq *resp = [[SendMessageToWXReq alloc]init];
    resp.message = message;
    resp.bText = NO;
    
    __isWxLogin = false;
    
    resp.scene = WXSceneTimeline;
    
    [WXApi sendReq:resp];

}
+(void)login
{
    __isWxLogin = true;
    //构造SendAuthReq结构体
    SendAuthReq* req =[[[SendAuthReq alloc ] init ] autorelease ];
    req.scope = @"snsapi_userinfo" ;
    req.state = @"123" ;
    //第三方向微信终端发送一个SendAuthReq消息结构
    [WXApi sendReq:req];
}

#include "ScriptingCore.h"
-(void) onResp:(BaseResp*)resp{
    NSLog(@"wx resp data code:%d  str:%@",resp.errCode,resp.errStr);
    if (__isWxLogin) {
        __isWxLogin = false;
        SendAuthResp *aresp = (SendAuthResp *)resp;
        if (aresp.errCode== 0) {
            NSString *code = aresp.code;
            char tmp[255]= {0};
            const char* tcode = [code UTF8String];
            sprintf(tmp, "cc.vv.anysdkMgr.onLoginResp('%s')",tcode);
            ScriptingCore::getInstance()->evalString(tmp);
        }else{
            //ScriptingCore::getInstance()->executeString("specialModule.nativelogincallback(null)");
        }
    }else{
        switch (resp.errCode) {
            case 0:{
                ScriptingCore::getInstance()->executeString("specialModule.wechatShareMsg(0)");
                break;
            }
            case -2:{
                ScriptingCore::getInstance()->executeString("specialModule.wechatShareMsg(2)");
                break;
            }
            default:
            ScriptingCore::getInstance()->executeString("specialModule.wechatShareMsg(3)");
            break;
        }
        char tmp[255]= {0};
        sprintf(tmp, "cc.vv.anysdkMgr.onShareResp(%d)",resp.errCode);
        ScriptingCore::getInstance()->evalString(tmp);
    }
    __isWxLogin = false;
}

//全面屏
- (void) setAllScreenAtPhone {
//    if (kStatusBarHeight - 20 > 0) {
//        _isAllScreen = true;
//    }else {
//        _isAllScreen = false;
//    }
    
    if (__IPHONE_OS_VERSION_MAX_ALLOWED < __IPHONE_11_0) {
        _isAllScreen = false;
    }
    
    CGFloat iPhoneNotchDirectionSafeAreaInsets = 0;
    
    if (@available(iOS 11.0, *)) {
        UIEdgeInsets kSafeAreaInsets = [UIApplication sharedApplication].windows[0].safeAreaInsets;
        
        switch ([UIApplication sharedApplication].statusBarOrientation) {
            case UIInterfaceOrientationPortrait:{
                iPhoneNotchDirectionSafeAreaInsets = kSafeAreaInsets.top;
            }
                break;
            case UIInterfaceOrientationLandscapeLeft:{
                iPhoneNotchDirectionSafeAreaInsets = kSafeAreaInsets.left;
            }
                break;
            case UIInterfaceOrientationLandscapeRight:{
                iPhoneNotchDirectionSafeAreaInsets = kSafeAreaInsets.right;
            }
                break;
            case UIInterfaceOrientationPortraitUpsideDown:{
                iPhoneNotchDirectionSafeAreaInsets = kSafeAreaInsets.bottom;
            }
                break;
            default:
                iPhoneNotchDirectionSafeAreaInsets = kSafeAreaInsets.top;
                break;
        }
    }
    _isAllScreen = iPhoneNotchDirectionSafeAreaInsets > 20;
    
    NSLog(@"wujun setAllScreenAtPhone iPhoneNotchDirectionSafeAreaInsets = %f",iPhoneNotchDirectionSafeAreaInsets);
}

+ (BOOL) isAllScreenAtPhone {
    NSLog(@"wujun isAllScreenAtPhone _isAllScreen = %i",_isAllScreen);
    
    if (@available(iOS 11.0, *)) {
        UIEdgeInsets kSafeAreaInsets = [UIApplication sharedApplication].windows[0].safeAreaInsets;
        NSLog(@"wujun setAllScreenAtPhone1 %f", kSafeAreaInsets.top);
        NSLog(@"wujun setAllScreenAtPhone2 %f", kSafeAreaInsets.bottom);
        NSLog(@"wujun setAllScreenAtPhone3 %f", kSafeAreaInsets.left);
        NSLog(@"wujun setAllScreenAtPhone4 %f", kSafeAreaInsets.right);
    } else {
        // Fallback on earlier versions
    }
    return _isAllScreen;
}

+ (int) getNotchHeightAtPhone {
    
    if(_isAllScreen == true) {
        if (@available(iOS 11.0, *)) {

            UIEdgeInsets kSafeAreaInsets = [UIApplication sharedApplication].windows[0].safeAreaInsets;
            
            
            if(kSafeAreaInsets.left > kSafeAreaInsets.right) {
                NSLog(@"wujun getNotchHeightAtPhone l %f", kSafeAreaInsets.left);
                _notchWidth = kSafeAreaInsets.left;
            }else {
                NSLog(@"wujun getNotchHeightAtPhone r %f", kSafeAreaInsets.right);
                _notchWidth = kSafeAreaInsets.right;
            }
        }
    }
    
//    NSLog(@"wujun getNotchHeightAtPhone _notchWidth = %d",_notchWidth);
    
    return _notchWidth*2;
}

+ (int)getHomeHeightAtPhone {
    CGFloat homeHeight = 0;
    if(_isAllScreen == true) {
        if (@available(iOS 11.0, *)) {
            
            UIEdgeInsets kSafeAreaInsets = [UIApplication sharedApplication].windows[0].safeAreaInsets;
            homeHeight = kSafeAreaInsets.bottom;
        }
    }
    return homeHeight*2;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    cocos2d::Director::getInstance()->resume();
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    cocos2d::Application::getInstance()->applicationDidEnterBackground();
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    cocos2d::Application::getInstance()->applicationWillEnterForeground();
}

- (void)applicationWillTerminate:(UIApplication *)application {
    /*
     Called when the application is about to terminate.
     See also applicationDidEnterBackground:.
     */
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
    cocos2d::Director::getInstance()->purgeCachedData();
}


- (void)dealloc {
    [super dealloc];
}


@end

