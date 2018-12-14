package com.yzqp.game.max.AdaptationScheme;

/**
 * Created by zhihuaxin on 2018/9/27.
 */

import android.util.Log;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

class StaticContext {
    public static String get(String key) {
        String value = "";
        Class<?> cls = null;
        try {
            cls = Class.forName("android.os.SystemProperties");
            Method hideMethod = cls.getMethod("get",

                    String.class);
            Object object = cls.newInstance();
            value = (String) hideMethod.invoke(object, key);
        } catch (ClassNotFoundException e) {
            Log.e("error", "get error() ", e);
        } catch (NoSuchMethodException e) {
            Log.e("error", "get error() ", e);
        } catch (InstantiationException e) {
            Log.e("error", "get error() ", e);
        } catch (IllegalAccessException e) {
            Log.e("error", "get error() ", e);
        } catch (IllegalArgumentException e) {
            Log.e("error", "get error() ", e);
        } catch (InvocationTargetException e) {
            Log.e("error", "get error() ", e);
        }
        return value;
    }
}
