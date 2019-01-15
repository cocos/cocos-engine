package org.cocos2dx.javascript.service;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.opengl.GLSurfaceView;
import android.os.Bundle;

public interface SDKInterface {
    void init(Context context);
    void setGLSurfaceView(GLSurfaceView view);
    void onResume();
    void onPause();
    void onDestroy();
    void onActivityResult(int requestCode, int resultCode, Intent data);
    void onNewIntent(Intent intent);
    void onRestart();
    void onStop();
    void onBackPressed();
    void onConfigurationChanged(Configuration newConfig);
    void onRestoreInstanceState(Bundle savedInstanceState);
    void onSaveInstanceState(Bundle outState);
    void onStart();
}