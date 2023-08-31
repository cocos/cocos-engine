package com.cocos.lib;

import android.view.SurfaceView;

public interface IGamePlayer {
    void start();
    void stop();
    void pause();
    void resume();

    SurfaceView getRenderView();
    void setFocus(boolean focus);
}
