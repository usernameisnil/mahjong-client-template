package com.tkmj.game.max.gps;

import android.app.Application;

import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;

public class GPSLocation extends Application
{
    public static GPSLocation instance;
    private AMapLocationClient locationClient;

    @Override
    public void onCreate()
    {
        System.out.println("luobin-gps GPSLocation onCreate");
        super.onCreate();
        instance = this;
        initLocationClient();
    }

    public static GPSLocation getInstance()
    {
        System.out.println("luobin-gps GPSLocation getInstances");
        return instance;
    }

    public void initLocationClient()
    {
        System.out.println("luobin-gps GPSLocation initLocationClient");
        locationClient = new AMapLocationClient(this);
        AMapLocationClientOption locationOption = new AMapLocationClientOption();
        locationOption.setOnceLocation(true);
        locationOption.setOnceLocationLatest(true);
        locationClient.setLocationOption(locationOption);
    }

    public AMapLocationClient getLocationClient()
    {
        System.out.println("luobin-gps GPSLocation getLocationClient");
        return locationClient;
    }
}