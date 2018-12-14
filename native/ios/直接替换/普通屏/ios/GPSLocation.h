#import <Foundation/Foundation.h>
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapLocationKit/AMapLocationKit.h>

typedef void(^locationgCompletionBlock)(CGFloat latitude, CGFloat longitude,NSString* location,NSString* address,NSError *error);

@interface GPSLocation : NSObject

+(instancetype)shareManager;

- (void)locateAccurate:(locationgCompletionBlock)completionblock;

@end
