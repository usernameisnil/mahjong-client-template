@interface GPSSDK:NSObject

+(void)locateAccurateCheck;
+(void)locateAccurateNotCheck;
+(void)locateAccurate:(bool) errorWillCheck;
+(void)toNetSetting;
+(void)toGPSSetting;
+(void)toGrantSetting;

@end
