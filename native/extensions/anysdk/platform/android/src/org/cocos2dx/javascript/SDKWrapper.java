/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

package org.cocos2dx.javascript;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.util.Log;

public class SDKWrapper {
	private final static boolean PACKAGE_AS = true;
	private final static String TAG = "SDKWrapper";
	private final static String CLASS_PATH = "com.anysdk.framework.PluginWrapper";
	private static Class<?> mClass = null;
	private static Context mCtx = null;

	private static SDKWrapper mInstace = null;
	public static SDKWrapper getInstance() {
		if (null == mInstace){
			mInstace = new SDKWrapper();
			if (PACKAGE_AS) {
				try {
					mClass = Class.forName(CLASS_PATH);
				} catch (Exception e) {
					Log.e(TAG, "Can not find class: " + CLASS_PATH);
				}
			}
		}
		return mInstace;	
	}

	public void init(Context context) {
	    mCtx = context;
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("init", Context.class).invoke(mClass, context);
			} catch (Exception e) {
				e.printStackTrace();
			}
			SDKWrapper.nativeLoadAllPlugins();
		}
		
	}

	public Context getContext(){
	    return mCtx;
	}

	public void setGLSurfaceView(GLSurfaceView view) {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("setGLSurfaceView", GLSurfaceView.class).invoke(mClass, view);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	public void onResume() {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onResume").invoke(mClass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onPause() {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onPause").invoke(mClass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onDestroy() {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onDestroy").invoke(mClass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onActivityResult", int.class, int.class, Intent.class).invoke(mClass, requestCode, resultCode, data);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onNewIntent(Intent intent) {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onNewIntent", Intent.class).invoke(mClass, intent);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onRestart() {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onRestart").invoke(mClass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}	
	}

	public void onStop() {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onStop").invoke(mClass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onBackPressed() {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onBackPressed").invoke(mClass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onConfigurationChanged(Configuration newConfig) {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onConfigurationChanged", Configuration.class).invoke(mClass, newConfig);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onRestoreInstanceState(Bundle savedInstanceState) {
			if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onRestoreInstanceState", Bundle.class).invoke(mClass, savedInstanceState);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onSaveInstanceState(Bundle outState) {
			if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onSaveInstanceState", Bundle.class).invoke(mClass, outState);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public void onStart() {
		if (PACKAGE_AS) {
			try {
				if (null != mClass)
				    mClass.getMethod("onStart").invoke(mClass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	private static native void nativeLoadAllPlugins();
}
