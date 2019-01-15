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
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import org.cocos2dx.javascript.service.SDKClass;
import org.json.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class SDKWrapper {
    private Context mainActive = null;
    private static SDKWrapper mInstace = null;
    private List<SDKClass> sdkClasses;

    public static SDKWrapper getInstance() {
        if (null == mInstace) {
            mInstace = new SDKWrapper();
        }
        return mInstace;
    }

    public void init(Context context) {
        this.mainActive = context;
        for (SDKClass sdk : this.sdkClasses) {
            sdk.init(context);
        }
    }

    public Context getContext() {
        return this.mainActive;
    }

    public void loadSDKClass() {
        ArrayList<SDKClass> classes = new ArrayList<SDKClass>();
        try {
            String json = this.getJson(this.mainActive, "project.json");
            JSONObject jsonObject = new JSONObject(json);
            JSONArray serviceClassPath = jsonObject.getJSONArray("serviceClassPath");
            if (serviceClassPath == null) return;
            int length = serviceClassPath.length();
            for (int i = 0; i < length; i++) {
                String classPath = serviceClassPath.getString(i);
                SDKClass sdk = (SDKClass) Class.forName(classPath).newInstance();
                classes.add(sdk);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        this.sdkClasses = classes;
    }

    private String getJson(Context mContext, String fileName) {
        StringBuilder sb = new StringBuilder();
        AssetManager am = mContext.getAssets();
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(am.open(fileName)));
            String next = "";
            while (null != (next = br.readLine())) {
                sb.append(next);
            }
        } catch (IOException e) {
            e.printStackTrace();
            sb.delete(0, sb.length());
        }
        return sb.toString().trim();
    }

    public void setGLSurfaceView(GLSurfaceView view, Context context) {
        this.mainActive = context;
        this.loadSDKClass();
        for (SDKClass sdk : this.sdkClasses) {
            sdk.setGLSurfaceView(view);
        }
    }

    public void onResume() {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onResume();
        }
    }

    public void onPause() {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onPause();
        }
    }

    public void onDestroy() {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onDestroy();
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onActivityResult(requestCode, resultCode, data);
        }
    }

    public void onNewIntent(Intent intent) {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onNewIntent(intent);
        }
    }

    public void onRestart() {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onRestart();
        }
    }

    public void onStop() {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onStop();
        }
    }

    public void onBackPressed() {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onBackPressed();
        }
    }

    public void onConfigurationChanged(Configuration newConfig) {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onConfigurationChanged(newConfig);
        }
    }

    public void onRestoreInstanceState(Bundle savedInstanceState) {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onRestoreInstanceState(savedInstanceState);
        }
    }

    public void onSaveInstanceState(Bundle outState) {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onSaveInstanceState(outState);
        }
    }

    public void onStart() {
        for (SDKClass sdk : this.sdkClasses) {
            sdk.onStart();
        }
    }
}
