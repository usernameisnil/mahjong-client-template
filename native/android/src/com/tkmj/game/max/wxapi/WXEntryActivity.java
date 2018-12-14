package com.tkmj.game.max.wxapi;


import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.cocos2dx.lib.Cocos2dxHelper;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.tencent.mm.sdk.openapi.BaseReq;
import com.tencent.mm.sdk.openapi.BaseResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.SendAuth;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tkmj.game.max.Constants;
import com.tkmj.game.max.WXAPI;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
	
    private IWXAPI _api;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.plugin_entry);
    	_api = WXAPIFactory.createWXAPI(this, Constants.APP_ID, false);
        _api.handleIntent(getIntent(), this);
		Log.d("cocos", "onCreate WXEntryActivity");
    }

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		
		setIntent(intent);
        _api.handleIntent(intent, this);
	}

	@Override
	public void onReq(BaseReq req) {
		/*
		switch (req.getType()) {
		case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
			//goToGetMsg();		
			break;
		case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
			//goToShowMsg((ShowMessageFromWX.Req) req);
			break;
		default:
			break;
		}
		*/
	}

	@Override
	public void onResp(BaseResp resp) {
		System.out.println("luobin onResp:" + resp.errCode);
		final int code = resp.errCode;
		if (WXAPI.isLogin) {
			final SendAuth.Resp authResp = (SendAuth.Resp) resp;
			if (authResp != null && authResp.token != null) {
				Cocos2dxHelper.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onLoginResp('" + authResp.token + "')");
					}
				});
			} else {
				Cocos2dxHelper.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onLoginResp()");
					}
				});
			}
		} else {
			Cocos2dxHelper.runOnGLThread(new Runnable() {
				@Override
				public void run() {
					Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onShareResp(" + code + ")");
				}
			});
		}
		this.finish();
	}
}