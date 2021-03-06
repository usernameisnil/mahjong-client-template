package com.szmj.game.max;

import java.io.File;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.view.WindowManager;
import android.util.Log;

import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.SendAuth;
import com.tencent.mm.sdk.openapi.SendMessageToWX;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tencent.mm.sdk.openapi.WXImageObject;
import com.tencent.mm.sdk.openapi.WXMediaMessage;
import com.tencent.mm.sdk.openapi.WXWebpageObject;

import com.szmj.game.max.Constants;

public class WXAPI {
	public static IWXAPI api;
	public static Activity instance;
	public static boolean isLogin = false;
	public static void Init(Activity context){
		System.out.println("luobin-wx WXAPI Init");
		WXAPI.instance = context;
		api = WXAPIFactory.createWXAPI(context, Constants.APP_ID, true);
        api.registerApp(Constants.APP_ID);
        context.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
	}
	
	private static String buildTransaction(final String type) {
		System.out.println("luobin-wx WXAPI buildTransaction");
	    return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
	}
	
	public static void Login(){
		System.out.println("luobin-wx WXAPI Login");
		isLogin = true;
		final SendAuth.Req req = new SendAuth.Req();
		req.scope = "snsapi_userinfo";
		req.state = "carjob_wx_login";

		final IWXAPI _api = api;

		instance.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				_api.sendReq(req);
			}
		});
	}
	
	public static void Share(String url,String title,String desc, boolean timeline) {
		System.out.println("luobin-wx WXAPI Share");
		try {
			isLogin = false;
			WXWebpageObject webpage = new WXWebpageObject();
			webpage.webpageUrl = url;
			WXMediaMessage msg = new WXMediaMessage(webpage);
			msg.title = title;
			msg.description = desc;

			final SendMessageToWX.Req req = new SendMessageToWX.Req();
			req.transaction = buildTransaction("webpage");
			req.message = msg;
			req.scene = timeline ? SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession;

			final IWXAPI _api = api;

			instance.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					_api.sendReq(req);
				}
			});
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public static void ShareIMG(String path,int width,int height, boolean timeline) {
		System.out.println("luobin-wx WXAPI ShareIMG");
		try {
			isLogin = false;
			File file = new File(path);
			if (!file.exists()) {
				return;
			}
			Bitmap bmp = BitmapFactory.decodeFile(path);
			
			WXImageObject imgObj = new WXImageObject(bmp);

			WXMediaMessage msg = new WXMediaMessage();
			msg.mediaObject = imgObj;
			
			
			Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, width, height, true);
			bmp.recycle();
			msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
			
			final SendMessageToWX.Req req = new SendMessageToWX.Req();
			req.transaction = buildTransaction("img");
			req.message = msg;
			req.scene = timeline ? SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession;

			final IWXAPI _api = api;

			instance.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					_api.sendReq(req);
				}
			});
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
}
