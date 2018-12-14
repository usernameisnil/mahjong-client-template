package com.tkmj.game.max.AdaptationScheme;

/**
 * Created by zhihuaxin on 2018/9/27.
 */

import android.app.Activity;
import android.content.Context;
import android.graphics.Point;
import android.os.Build;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;

import org.cocos2dx.lib.Cocos2dxActivity;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.String;

public class adaptationScreen {

    /**
     * 判断是否是全面屏
     */
    private volatile static boolean mHasCheckAllScreen;
    private volatile static boolean mIsAllScreenDevice;
//    private static Context context;
//    private static float dipValue;

    public static boolean isAllScreenDevice() {

        Context context = Cocos2dxActivity.getContext();

        if (mHasCheckAllScreen) {
            return mIsAllScreenDevice;
        }
        mHasCheckAllScreen = true;
        mIsAllScreenDevice = false;
        // 低于 API 21的，都不会是全面屏。。。
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            return false;
        }
        WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        if (windowManager != null) {
            Display display = windowManager.getDefaultDisplay();
            Point point = new Point();
            display.getRealSize(point);
            float width, height;
            if (point.x < point.y) {
                width = point.x;
                height = point.y;
            } else {
                width = point.y;
                height = point.x;
            }
            if (height / width >= 1.97f) {
                mIsAllScreenDevice = true;
            }
        }
        return mIsAllScreenDevice;
    }


    /**
     * 判断是否是刘海屏
     *
     * @return
     */
    public static boolean isNotch = false;
    public static String phoneType = "normal";

    public static void hasNotchScreen(Activity activity) {
//        if (getInt("ro.miui.notch", activity) == 1 || hasNotchAtHuawei() || hasNotchAtOPPO()
//                || hasNotchAtVivo() || isAndroidP(activity) != null) { //TODO 各种品牌
//            return true;
//        }

        isPhoneType();
        Context context = Cocos2dxActivity.getContext();
        if (getInt("ro.miui.notch", activity) == 1 || hasNotchAtHuawei(context)
                || hasNotchAtOPPO(context) || hasNotchAtVivo(context)) {
            isNotch = true;
        }else {
            isNotch = false;
        }
    }

    /**
    * 得到刘海屏高度
     */
    public static int jsbNotchScreenHeight() {

        if (mIsAllScreenDevice == false) {
            return 0;
        }

        Context context = Cocos2dxActivity.getContext();

        int height = 0;
        if (isNotch == true) {
            if (phoneType == "xiaomi") {
                height = getXiaoMiNotchSize(context);
            }else if (phoneType == "huawei") {
                int[] hwSize = getNotchSizeAtHuawei(context);
                height = hwSize[1];
            }else if (phoneType == "vivo") {
                height = getNotchHeightAtVivo(context);
            }else if (phoneType == "oppo") {
                height = getNotchHeightAtOppo();
                System.out.println("wujun oppo height = " + height);
            }else if (phoneType == "normal") {
                height = getStatusBarHeight(context);
                System.out.println("wujun notch true Bar height = " + height);
            }
        }else {
            if (phoneType == "normal") {
                height = getStatusBarHeight(context);
                System.out.println("wujun notch false Bar height = " + height);
            }
        }

        return height;

    }


    /**
     * Android P 刘海屏判断
     * @param activity
     * @return
     */
    /*
    public static DisplayCutout isAndroidP(Activity activity){
        View decorView = activity.getWindow().getDecorView();
        if (decorView != null && android.os.Build.VERSION.SDK_INT >= 28){
            WindowInsets windowInsets = decorView.getRootWindowInsets();
            if (windowInsets != null) {
                DisplayCutout versionP = windowInsets.getDisplayCutout();
                return versionP;
            }
        }
        return null;
    }
    */


    /**
     * 是否是小米手机.
     */
    public static boolean isXiaomi() {
        return "Xiaomi".equals(Build.MANUFACTURER);
    }

    /**
     * 小米刘海屏判断.
     *
     * @return 0 if it is not notch ; return 1 means notch
     * @throws IllegalArgumentException if the key exceeds 32 characters
     */
    public static int getInt(String key, Activity activity) {
        int result = 0;
        if (isXiaomi()) {
            try {
                ClassLoader classLoader = activity.getClassLoader();
                @SuppressWarnings("rawtypes")
                Class SystemProperties = classLoader.loadClass("android.os.SystemProperties");
                //参数类型
                @SuppressWarnings("rawtypes")
                Class[] paramTypes = new Class[2];
                paramTypes[0] = String.class;
                paramTypes[1] = int.class;
                Method getInt = SystemProperties.getMethod("getInt", paramTypes);
                //参数
                Object[] params = new Object[2];
                params[0] = new String(key);
                params[1] = new Integer(0);
                result = (Integer) getInt.invoke(SystemProperties, params);

            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    public static int getXiaoMiNotchSize(Context context) {
        int result = 0;
        int resourceId = context.getResources().getIdentifier("notch_height", "dimen", "android");
        if (resourceId > 0) {
            result = context.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }



    /**
     * 华为刘海屏判断
     *
     * @return
     */
    public static boolean hasNotchAtHuawei(Context context) {
        boolean ret = false;
        try {
            ClassLoader classLoader = context.getClassLoader();
            Class HwNotchSizeUtil = classLoader.loadClass("com.huawei.android.util.HwNotchSizeUtil");
            Method get = HwNotchSizeUtil.getMethod("hasNotchInScreen");
            ret = (boolean) get.invoke(HwNotchSizeUtil);
        } catch (ClassNotFoundException e) {
            Log.e("Notch", "hasNotchAtHuawei ClassNotFoundException");
        } catch (NoSuchMethodException e) {
            Log.e("Notch", "hasNotchAtHuawei NoSuchMethodException");
        } catch (Exception e) {
            Log.e("Notch", "hasNotchAtHuawei Exception");
        } finally {
            return ret;
        }
    }

    //获取刘海尺寸：width、height
    //int[0]值为刘海宽度 int[1]值为刘海高度
    public static int[] getNotchSizeAtHuawei(Context context) {
        int[] ret = new int[]{0, 0};
        try {
            ClassLoader cl = context.getClassLoader();
            Class HwNotchSizeUtil = cl.loadClass("com.huawei.android.util.HwNotchSizeUtil");
            Method get = HwNotchSizeUtil.getMethod("getNotchSize");
            ret = (int[]) get.invoke(HwNotchSizeUtil);
        } catch (ClassNotFoundException e) {
            Log.e("Notch", "getNotchSizeAtHuawei ClassNotFoundException");
        } catch (NoSuchMethodException e) {
            Log.e("Notch", "getNotchSizeAtHuawei NoSuchMethodException");
        } catch (Exception e) {
            Log.e("Notch", "getNotchSizeAtHuawei Exception");
        } finally {
            return ret;
        }
    }

    /**
     * VIVO刘海屏判断
     *
     * @return
     */
    public static final int VIVO_NOTCH = 0x00000020;//是否有刘海
    public static final int VIVO_FILLET = 0x00000008;//是否有圆角

    public static boolean hasNotchAtVivo(Context context) {
        boolean ret = false;
        try {
            ClassLoader classLoader = context.getClassLoader();
            Class FtFeature = classLoader.loadClass("android.util.FtFeature");
            Method method = FtFeature.getMethod("isFeatureSupport", int.class);
            ret = (boolean) method.invoke(FtFeature, VIVO_NOTCH);
        } catch (ClassNotFoundException e) {
            Log.e("Notch", "hasNotchAtVivo ClassNotFoundException");
        } catch (NoSuchMethodException e) {
            Log.e("Notch", "hasNotchAtVivo NoSuchMethodException");
        } catch (Exception e) {
            Log.e("Notch", "hasNotchAtVivo Exception");
        } finally {
            return ret;
        }
    }

    /**
     * VIVO圆角判断
     *
     * @return
     */

    public static boolean hasFilletAtVivo(Context context) {
        boolean ret = false;
        try {
            ClassLoader classLoader = context.getClassLoader();
            Class FtFeature = classLoader.loadClass("android.util.FtFeature");
            Method method = FtFeature.getMethod("isFeatureSupport", int.class);
            ret = (boolean) method.invoke(FtFeature, VIVO_FILLET);
        } catch (ClassNotFoundException e) {
            Log.e("Notch", "hasNotchAtVivo ClassNotFoundException");
        } catch (NoSuchMethodException e) {
            Log.e("Notch", "hasNotchAtVivo NoSuchMethodException");
        } catch (Exception e) {
            Log.e("Notch", "hasNotchAtVivo Exception");
        } finally {
            return ret;
        }
    }

    /**
     * VIVO刘海高度获取
     *
     * @return
     */

    public static int getNotchHeightAtVivo(Context context) {
        int notchHeightDP = 27;
        int notchHeight = dip2px(context, notchHeightDP);
        return notchHeight;
    }


    /**
     * OPPO刘海屏判断
     *
     * @return
     */
    public static boolean hasNotchAtOPPO(Context context) {
        return context.getPackageManager().hasSystemFeature("com.oppo.feature.screen.heteromorphism");
    }

    /**
     * OPPO刘海高度获取
     *
     * @return
     */

    public static int getNotchHeightAtOppo() {

        String mProperty = "";
        int height = 0;

        mProperty = StaticContext.get("ro.oppo.screen.heteromorphism");
        String[] positions = mProperty.split(":");

        int[] yArray = new int[2];
        for (int i = 0; i < positions.length; i++) {
            String[] pos = positions[i].split(",");
            int posY = Integer.parseInt(pos[1]);
            yArray[i] = posY;
        }
        height = Math.abs(yArray[0] - yArray[1]);
        return height;
    }



    /**
     * 获取状态栏高度
     *
     * @return
     */
    public static int getStatusBarHeight(Context context) {
        int result = 0;
        int resourceId = context.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = context.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    /**
     * dp转成px
     *
     * @return
     */

    public static int dip2px(Context context, float dipValue) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dipValue * scale + 0.5f);
    }


    /**
     * 判断是那种类型的手机
     */

    private static final String KEY_VERSION_MIUI = "ro.miui.ui.version.name";
    private static final String KEY_VERSION_EMUI = "ro.build.version.emui";
    private static final String KEY_VERSION_OPPO = "ro.build.version.opporom";
    private static final String KEY_VERSION_VIVO = "ro.vivo.os.version";

    public static void isPhoneType() {

        if(!isEmptyString(getProp(KEY_VERSION_MIUI))) {
            phoneType = "xiaomi";
        }else if (!isEmptyString(getProp(KEY_VERSION_EMUI))) {
            phoneType = "huawei";
        }else if (!isEmptyString(getProp(KEY_VERSION_OPPO))) {
            phoneType = "oppo";
        }else if (!isEmptyString(getProp(KEY_VERSION_VIVO))) {
            phoneType = "vivo";
        }
    }

    /**
     * 得到手机系统号
     */
    public static String getProp(String type) {

        String line = null;
        BufferedReader input = null;

        try {

            Process p = Runtime.getRuntime().exec("getprop " + type);
            input = new BufferedReader(new InputStreamReader(p.getInputStream()), 1024);
            line = input.readLine();
            input.close();

        } catch (FileNotFoundException e) {
            return null;
        } catch (IOException e) {
            return null;
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return line;

    }

    /**
     * 判断字符串是不是空
     */

    public static boolean isEmptyString(String str) {
        boolean isEmpty = false;
        if (str == null || str.length() == 0 || str.trim().length() == 0) {
            isEmpty = true;
        }
        return isEmpty;
    }

}


