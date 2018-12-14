package com.yzqp.game.max.gps;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.location.LocationManager;
import android.content.Context;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationListener;
import org.cocos2dx.lib.Cocos2dxHelper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.cocos2dx.lib.Cocos2dxActivity;
import android.provider.Settings;
import android.os.Build;
import android.content.ComponentName;

public class GPSSDK extends Activity {
    public static void toNetSetting(){
        System.out.println("luobin-gps  toNetSetting");
        Intent settingIntent=null;
        settingIntent = new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS);
        settingIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Cocos2dxActivity.getContext().startActivity(settingIntent);
    }
    public static void toGPSSetting(){
        System.out.println("luobin-gps  toGPSSetting");
        Intent settingIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        settingIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Cocos2dxActivity.getContext().startActivity(settingIntent);
    }
    public static void toGrantSetting(){
        System.out.println("luobin-gps  toGrantSetting");
        Context context = Cocos2dxActivity.getContext();

        if(Build.VERSION.SDK_INT>=11){
            Intent appSettingIntent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Uri uri = Uri.fromParts("package", context.getPackageName(), null);
            appSettingIntent.setData(uri);
            context.startActivity(appSettingIntent);
        }else if(Build.VERSION.SDK_INT>=9 && Build.VERSION.SDK_INT<11 ){
            Intent appSettingIntent=new Intent();
            appSettingIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            appSettingIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            appSettingIntent.setData(Uri.fromParts("package",context.getPackageName(),null));
            context.startActivity(appSettingIntent);
        }else if(Build.VERSION.SDK_INT<=8){
            Intent appSettingIntent=new Intent();
            appSettingIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            appSettingIntent.setAction(Intent.ACTION_VIEW);
            appSettingIntent.setClassName("com.android.settings","com.android.setting.InstalledAppDetails");
            appSettingIntent.putExtra("com.android.settings.ApplicationPkgName",context.getPackageName());
            context.startActivity(appSettingIntent);
        }

    }
    public static void locateAccurateCheck(){
        System.out.println("luobin-gps GPSSDK locateAccurateCheck");
        locateAccurate(true);
    }
    public static void locateAccurateNotCheck(){
        System.out.println("luobin-gps GPSSDK locateAccurateNotCheck");
        locateAccurate(false);
    }
    public static void locateAccurate(final boolean errorWillCheck) {
        System.out.println("luobin-gps locateAccurate");
        LocationManager locationManager
                = (LocationManager) Cocos2dxActivity.getContext().getSystemService(Context.LOCATION_SERVICE);
        boolean opened = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        if(opened)
        {
            System.out.println("luobin-gps locateAccurate opened");
            AMapLocationListener amapLocationListener = new AMapLocationListener()
            {
                @Override
                public void onLocationChanged(AMapLocation amapLocation)
                {
                    System.out.println("luobin-gps onLocationChanged");
                    Cocos2dxHelper.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {//定位结束,关闭定位中转圈
                            System.out.println("luobin-gps: run if(cc.vv.wc) cc.vv.wc.hide()");
                            Cocos2dxJavascriptJavaBridge.evalString("if(cc.vv.wc) cc.vv.wc.hide()");
                        }
                    });
                    if(amapLocation.getErrorCode() != 0)
                    {
                        System.out.println("luobin-gps error code:"+amapLocation.getErrorCode()+" error info:"+amapLocation.getErrorInfo());
                        final Integer errorCode= amapLocation.getErrorCode();
                        final String errorMessage = amapLocation.getErrorInfo();

                        Cocos2dxHelper.runOnGLThread(new Runnable() {
                            @Override
                            public void run() {
                            System.out.println("luobin-gps: run cc.vv.GPSMgr.setErrorCode"+errorCode);
                            Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.setErrorCode("+ errorCode +")");

                            System.out.println("luobin-gps: run cc.vv.GPSMgr.setErrorMessage"+errorMessage);
                            Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.setErrorMessage('"+ errorMessage +"')");
                            }
                        });
                        if(errorWillCheck == true) {
                            Cocos2dxHelper.runOnGLThread(new Runnable() {
                                @Override
                                public void run() {//如有错误,则做检查
                                    System.out.println("luobin-gps: run cc.vv.GPSMgr.chkGps()");
                                    Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.chkGps()");
                                }
                            });
                        }
                        return;
                    }
                    System.out.println("luobin-gps:"+amapLocation.getLatitude()+" "+amapLocation.getLongitude()+" "+amapLocation.getAddress());

                    final String location = "{\"longitude\":"+amapLocation.getLongitude()+",\"latitude\":"+ amapLocation.getLatitude() +"}";
                    final String address = amapLocation.getAddress();
                    Cocos2dxHelper.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            System.out.println("luobin-gps: run cc.vv.GPSMgr.setLocation");
                            Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.setLocation('"+ location +"')");
                        }
                    });
                    Cocos2dxHelper.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            System.out.println("luobin-gps: run cc.vv.GPSMgr.setAddress");
                            Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.setAddress('"+ address +"')");
                        }
                    });
                    //定位成功,把错误码和错误信息置空
                    Cocos2dxHelper.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            System.out.println("luobin-gps: run cc.vv.GPSMgr.setErrorCode null");
                            Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.setErrorCode( null )");

                            System.out.println("luobin-gps: run cc.vv.GPSMgr.setErrorMessage null");
                            Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.setErrorMessage(null)");
                        }
                    });

                }
            };

            GPSLocation.getInstance().getLocationClient().setLocationListener(amapLocationListener);
            GPSLocation.getInstance().getLocationClient().startLocation();
        }else{
            System.out.println("luobin-gps locateAccurate not opened");
            Cocos2dxHelper.runOnGLThread(new Runnable() {
                @Override
                public void run() {//GPS未开
                    System.out.println("luobin-gps: run cc.vv.GPSMgr.setErrorCode"+"-1");
                    Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.setErrorCode(-1)");
                }
            });
            if(errorWillCheck == true) {
                Cocos2dxHelper.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {//如有错误,则做检查
                        System.out.println("luobin-gps: run cc.vv.GPSMgr.chkGps()");
                        Cocos2dxJavascriptJavaBridge.evalString("cc.vv.GPSMgr.chkGps()");
                    }
                });
            }
        }

    }
}