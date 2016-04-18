/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 ****************************************************************************/

package org.cocos2dx.lib;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.MediaPlayer;
import android.util.Log;

import java.io.FileInputStream;

public class Cocos2dxMusic {
    private static final String TAG = "Cocos2dxMusic";

    // ===========================================================
    // Fields
    // ===========================================================

    private final Context mContext;
    private MediaPlayer mBackgroundMediaPlayer;
    private float mLeftVolume;
    private float mRightVolume;
    private boolean mPaused; // whether music is paused state.
    private boolean mIsLoop = false;
    private boolean mManualPaused = false; // whether music is paused manually before the program is switched to the background.
    private String mCurrentPath;

    // ===========================================================
    // Constructors
    // ===========================================================

    public Cocos2dxMusic(final Context context) {
        mContext = context;
        initData();
    }

    public void preloadBackgroundMusic(final String path) {
        if ((this.mCurrentPath == null) || (!this.mCurrentPath.equals(path))) {
            // release old resource and create a new one
            if (mBackgroundMediaPlayer != null) {
                mBackgroundMediaPlayer.release();
            }

            mBackgroundMediaPlayer = createMediaPlayer(path);
            mCurrentPath = path;
        }
    }

    public void playBackgroundMusic(final String path, final boolean isLoop) {
        if (mCurrentPath == null) {
            // it is the first time to play background music or end() was called
            mBackgroundMediaPlayer = createMediaPlayer(path);
            mCurrentPath = path;
        } else {
            if (!mCurrentPath.equals(path)) {
                // play new background music

                // release old resource and create a new one
                if (mBackgroundMediaPlayer != null) {
                    mBackgroundMediaPlayer.release();
                }
                mBackgroundMediaPlayer = createMediaPlayer(path);

                // record the path
                mCurrentPath = path;
            }
        }

        if (mBackgroundMediaPlayer == null) {
            Log.e(Cocos2dxMusic.TAG, "playBackgroundMusic: background media player is null");
        } else {
            try {
                // if the music is playing or paused, stop it
                if (mPaused) {
                    mBackgroundMediaPlayer.seekTo(0);
                    mBackgroundMediaPlayer.start();
                } else if (mBackgroundMediaPlayer.isPlaying()) {
                    mBackgroundMediaPlayer.seekTo(0);
                } else {
                    mBackgroundMediaPlayer.start();
                }
                mBackgroundMediaPlayer.setLooping(isLoop);
                mPaused = false;
                mIsLoop = isLoop;
            } catch (final Exception e) {
                Log.e(Cocos2dxMusic.TAG, "playBackgroundMusic: error state");
            }
        }
    }

    public void stopBackgroundMusic() {
        if (mBackgroundMediaPlayer != null) {
            mBackgroundMediaPlayer.release();
            mBackgroundMediaPlayer = createMediaPlayer(mCurrentPath);

            /**
             * should set the state, if not, the following sequence will be error
             * play -> pause -> stop -> resume
             */
            this.mPaused = false;
        }
    }

    public void pauseBackgroundMusic() {
        if (mBackgroundMediaPlayer != null && mBackgroundMediaPlayer.isPlaying()) {
            mBackgroundMediaPlayer.pause();
            mPaused = true;
            mManualPaused = true;
        }
    }

    public void resumeBackgroundMusic() {
        if (mBackgroundMediaPlayer != null && this.mPaused) {
            mBackgroundMediaPlayer.start();
            mPaused = false;
            mManualPaused = false;
        }
    }

    public void rewindBackgroundMusic() {
        if (mBackgroundMediaPlayer != null) {
            playBackgroundMusic(mCurrentPath, mIsLoop);
        }
    }

    public boolean isBackgroundMusicPlaying() {
        boolean ret = false;

        if (mBackgroundMediaPlayer != null) {
            ret = mBackgroundMediaPlayer.isPlaying();
        }

        return ret;
    }

    public void end() {
        if (mBackgroundMediaPlayer != null) {
            mBackgroundMediaPlayer.release();
        }

        initData();
    }

    public float getBackgroundVolume() {
        if (mBackgroundMediaPlayer != null) {
            return (mLeftVolume + mRightVolume) / 2;
        } else {
            return 0.0f;
        }
    }

    public void setBackgroundVolume(float volume) {
        if (volume < 0.0f) {
            volume = 0.0f;
        }

        if (volume > 1.0f) {
            volume = 1.0f;
        }

        mLeftVolume = mRightVolume = volume;
        if (mBackgroundMediaPlayer != null) {
            mBackgroundMediaPlayer.setVolume(mLeftVolume, mRightVolume);
        }
    }

    public void onEnterBackground(){
        if (mBackgroundMediaPlayer != null && mBackgroundMediaPlayer.isPlaying()) {
            mBackgroundMediaPlayer.pause();
            mPaused = true;
        }
    }

    public void onEnterForeground(){
        if(!mManualPaused){
            if (mBackgroundMediaPlayer != null && mPaused) {
                mBackgroundMediaPlayer.start();
                mPaused = false;
            }
        }
    }

    private void initData() {
        mLeftVolume = 0.5f;
        mRightVolume = 0.5f;
        mBackgroundMediaPlayer = null;
        mPaused = false;
        mCurrentPath = null;
    }

    private MediaPlayer createMediaPlayer(final String path) {
        MediaPlayer mediaPlayer = new MediaPlayer();

        try {
            if (path.startsWith("/")) {
                final FileInputStream fis = new FileInputStream(path);
                mediaPlayer.setDataSource(fis.getFD());
                fis.close();
            } else {
                final AssetFileDescriptor assetFileDescritor = this.mContext.getAssets().openFd(path);
                mediaPlayer.setDataSource(assetFileDescritor.getFileDescriptor(), assetFileDescritor.getStartOffset(), assetFileDescritor.getLength());
            }

            mediaPlayer.prepare();

            mediaPlayer.setVolume(this.mLeftVolume, this.mRightVolume);
        } catch (final Exception e) {
            mediaPlayer = null;
            Log.e(Cocos2dxMusic.TAG, "error: " + e.getMessage(), e);
        }

        return mediaPlayer;
    }
}

