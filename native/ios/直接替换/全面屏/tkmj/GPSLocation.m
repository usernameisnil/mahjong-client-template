#import "GPSLocation.h"
#define KAppKey @"1284a9d0b982f595ccc2ff77727fab40"//高德地图罗宾创建的key
#define LocationTimeout 10  //   定位超时时间，可修改，最小2s
#define ReGeocodeTimeout 5 //    逆地理请求(具体地址)超时时间，可修改，最小2s

@interface GPSLocation ()<AMapLocationManagerDelegate>

@property (nonatomic,strong) AMapLocationManager *aMapLocationManager;

@end

@implementation GPSLocation

+ (instancetype)shareManager{
    static GPSLocation *share = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        share = [[GPSLocation alloc] init];
        [share configure];
    });
    
    return share;
}

- (void)configure
{
  
    [[AMapServices sharedServices] setApiKey:KAppKey];
    
    self.aMapLocationManager = [[AMapLocationManager alloc] init];
    self.aMapLocationManager.delegate = self;
    // 带逆地理信息的一次定位（返回坐标和地址信息）
    //[self.aMapLocationManager setDesiredAccuracy:kCLLocationAccuracyHundredMeters];
    
    //精准定位,30米内,定位耗时也许要10秒
    [self.aMapLocationManager setDesiredAccuracy:kCLLocationAccuracyBest];
    
    //   定位超时时间，可修改，最小2s
    self.aMapLocationManager.locationTimeout = LocationTimeout;
    //   逆地理请求超时时间，可修改，最小2s
    self.aMapLocationManager.reGeocodeTimeout = ReGeocodeTimeout;
    [self.aMapLocationManager setPausesLocationUpdatesAutomatically:NO];
    
    [self.aMapLocationManager setAllowsBackgroundLocationUpdates:YES];
    
}

- (void)cleanUpAction
{
    [self.aMapLocationManager stopUpdatingLocation];
    
    [self.aMapLocationManager setDelegate:nil];
}
- (void)locateAccurate:(locationgCompletionBlock)completionblock;
{
    [self.aMapLocationManager requestLocationWithReGeocode:YES completionBlock:^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error) {
        if (error)
        {
            NSLog(@"locError:{%ld - %@};", (long)error.code, error.localizedDescription);
            completionblock(-1,-1,@"",@"",error);
            if (error.code == AMapLocationErrorLocateFailed)
            {
                return;
            }
        }
        
        if (completionblock) {
            float longitude = location.coordinate.longitude;
            float latitude = location.coordinate.latitude;
            NSString* location = [NSString stringWithFormat:@"{\"longitude\":%f,\"latitude\":%f}",longitude,latitude];
            NSString* address = regeocode.formattedAddress;
            completionblock(longitude,latitude,location,address,nil);
        }

    }];
}

#pragma mark -------------------
#pragma mark - AMapLocationManagerDelegate
/**
 *  当定位发生错误时，会调用代理的此方法。
 *
 *  @param manager 定位 AMapLocationManager 类。
 *  @param error 返回的错误，参考 CLError 。
 */
- (void)amapLocationManager:(AMapLocationManager *)manager didFailWithError:(NSError *)error{
    
}
/**
 *  定位权限状态改变时回调函数
 *
 *  @param manager 定位 AMapLocationManager 类。
 *  @param status 定位权限状态。
 */
- (void)amapLocationManager:(AMapLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status{
    
}
@end
