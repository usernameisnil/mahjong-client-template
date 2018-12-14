package com.szmj.game.max.wxapi;


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
import com.szmj.game.max.Constants;
import com.szmj.game.max.WXAPI;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
	
    private IWXAPI _api;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
		System.out.println("luobin-wx WXEntryActivity onCreate");
        super.onCreate(savedInstanceState);
    	_api = WXAPIFactory.createWXAPI(this, Constants.APP_ID, false);
        _api.handleIntent(getIntent(), this);
    }

	@Override
	protected void onNewIntent(Intent intent) {
		System.out.println("luobin-wx WXEntryActivity onNewIntent");
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
		System.out.println("luobin-wx WXEntryActivity  onResp");
		int result = 0;
		switch (resp.errCode) {
		case BaseResp.ErrCode.ERR_OK:
			if(WXAPI.isLogin){
				final SendAuth.Resp authResp = (SendAuth.Resp)resp;
				if(authResp != null && authResp.token != null){
					Cocos2dxHelper.runOnGLThread(new Runnable() {
						@Override
						public void run() {
							System.out.println("luobin-wx WXEntryActivity  authResp != null");
							Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onLoginResp('"+ authResp.token +"')");
						}
					});
				} else {
					Cocos2dxHelper.runOnGLThread(new Runnable() {
						@Override
						public void run() {
							System.out.println("luobin-wx WXEntryActivity  authResp == null");
							Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onLoginResp()");
						}
					});
				}
			} else {
				Cocos2dxHelper.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						System.out.println("luobin-wx WXEntryActivity  WXAPI.isLogin == false");
						Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onShareResp()");
					}
				});
			}

			break;
		case BaseResp.ErrCode.ERR_USER_CANCEL:
			System.out.println("luobin-wx WXEntryActivity  ERR_USER_CANCEL");
			result = 2;//R.string.errcode_cancel;
			//break;
		case BaseResp.ErrCode.ERR_AUTH_DENIED:
			System.out.println("luobin-wx WXEntryActivity  ERR_AUTH_DENIED");
			result = 3;//R.string.errcode_deny;
			//break;
		default:
			System.out.println("luobin-wx WXEntryActivity  default");
			result = 4;//R.string.errcode_unknown;
			//break;
			if (WXAPI.isLogin) {
				Cocos2dxHelper.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						System.out.println("luobin-wx WXEntryActivity  default WXAPI.isLogin");
						Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onLoginResp()");
					}
				});
			} else {
				Cocos2dxHelper.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						System.out.println("luobin-wx WXEntryActivity  default !WXAPI.isLogin");
						Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onShareResp()");
					}
				});
			}
		}

		this.finish();
		
		//Toast.makeText(this, result, Toast.LENGTH_LONG).show();
	}
}