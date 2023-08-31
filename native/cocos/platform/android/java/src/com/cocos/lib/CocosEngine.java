package com.cocos.lib;

import android.app.Activity;
import android.view.SurfaceView;


public class CocosEngine {

    private GamePlayer mGamePlayer;

    void init(Activity activity, String libName) {
        mGamePlayer = new GamePlayer();
    }

    void destroy() {
        mGamePlayer.destroy();
        mGamePlayer = null;
    }

    IGamePlayer getGamePlayer() {
        return mGamePlayer;
    }

    private void createSurface(int x, int y, int width, int height, int windowId) {
        //
    }

    class GamePlayer implements IGamePlayer {

        GamePlayer() {
            //
        }

        @Override
        public void start() {

        }

        @Override
        public void stop() {

        }

        @Override
        public void pause() {

        }

        @Override
        public void resume() {

        }

        @Override
        public SurfaceView getRenderView() {
            return null;
        }

        @Override
        public void setFocus(boolean focus) {

        }

        private void destroy() {
            //
        }
    }
}







