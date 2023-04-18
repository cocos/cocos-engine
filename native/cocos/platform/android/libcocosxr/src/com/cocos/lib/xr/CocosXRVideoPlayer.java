/****************************************************************************
 * Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.
 *
 * http://www.cocos.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ****************************************************************************/

package com.cocos.lib.xr;

import android.app.Activity;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;
import android.view.Surface;

import java.io.IOException;
import java.lang.ref.WeakReference;

public class CocosXRVideoPlayer {
    enum MediaPlayerState {
        IDLE,
        INITIALIZED,
        READY_PREPARE,
        PREPARING,
        PREPARED,
        STARTED,
        STOPPED,
        PAUSED,
        END,
        ERROR,
        COMPLETED
    }

    private static final String TAG = "CocosXRVideoPlayer";
    private String uniqueKey;
    private String eventName;
    private CocosXRVideoTexture videoTexture;
    private String videoSourceUrl;
    private int videoSourceType;
    private int videoTextureId = 0;
    private boolean isGLInitialized = false;
    private int videoSourceSizeWidth = 0;
    private int videoSourceSizeHeight = 0;
    private int videoTextureWidth = 0;
    private int videoTextureHeight = 0;
    private MediaPlayerState mediaPlayerState = MediaPlayerState.IDLE;

    CocosXRGLHelper.GLQuadScreen quadScreen;
    MediaPlayer mediaPlayer;
    WeakReference<Activity> atyWeakReference;

    public CocosXRVideoPlayer(WeakReference<Activity> activityWeakReference, String key, String eventName) {
        this.atyWeakReference = activityWeakReference;
        this.uniqueKey = key;
        this.eventName = eventName;
        this.quadScreen = new CocosXRGLHelper.GLQuadScreen();
        this.mediaPlayer = new MediaPlayer();
        this.mediaPlayer.setOnErrorListener((mp, what, extra) -> {
            mediaPlayerState = MediaPlayerState.ERROR;
            Log.e(TAG, "onError " + what + "," + extra + "." + mp.toString());
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_MEDIA_PLAYER_ERROR, eventName, uniqueKey);
            return false;
        });
        this.mediaPlayer.setOnInfoListener((mp, what, extra) -> {
            // Log.d(TAG, "onInfo " + what + "," + extra + "." + mp.toString());
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_MEDIA_PLAYER_ON_INFO, eventName, uniqueKey, String.valueOf(what));
            return false;
        });
        this.mediaPlayer.setOnPreparedListener(mp -> {
            mediaPlayerState = MediaPlayerState.PREPARED;
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_MEDIA_PLAYER_PREPARED, eventName, uniqueKey);
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_GET_DURATION, eventName, uniqueKey, String.valueOf(mp.getDuration()));
            Log.d(TAG, "onPrepared." + mp+ ", getDuration." + mp.getDuration() + "," + mp.getVideoWidth() + "X" + mp.getVideoHeight() + "," + mp.isPlaying());
        });
        this.mediaPlayer.setOnCompletionListener(mp -> {
            Log.d(TAG, "onCompletion." + mp.toString());
            mediaPlayerState = MediaPlayerState.COMPLETED;
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_MEDIA_PLAYER_PLAY_COMPLETE, eventName, uniqueKey);
        });
        this.mediaPlayer.setOnSeekCompleteListener(mp -> {
            // Log.d(TAG, "onSeekComplete." + mp.toString());
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_MEDIA_PLAYER_SEEK_COMPLETE, eventName, uniqueKey);
        });
        this.mediaPlayer.setOnVideoSizeChangedListener((mp, width, height) -> {
            Log.d(TAG, "onVideoSizeChanged " + width + "x" + height + "." + mp.toString() + ", isPlaying." + mp.isPlaying());
            if(videoSourceSizeWidth != width || videoSourceSizeHeight != height) {
                videoSourceSizeWidth = width;
                videoSourceSizeHeight = height;
                CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_GET_IS_PALYING, eventName, uniqueKey, String.valueOf(mp.isPlaying() ? 1 : 0));
                CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_MEDIA_PLAYER_VIDEO_SIZE, eventName, uniqueKey, width + "&" + height);
            }
        });
        this.mediaPlayer.setAudioAttributes(new AudioAttributes.Builder().setLegacyStreamType(AudioManager.STREAM_MUSIC).build());
        mediaPlayerState = MediaPlayerState.INITIALIZED;
        Log.d(TAG, "constructor() " + key + "|" + eventName + "|" + quadScreen.toString());
    }

    public void runOnUIThread(Runnable runnable) {
        if (atyWeakReference != null && atyWeakReference.get() != null) {
            atyWeakReference.get().runOnUiThread(runnable);
        } else {
            Log.e(TAG, "runOnUIThread failed, activity not exist !!!");
        }
    }

    public void setTextureInfo(int textureWidth, int textureHeight, int videoTextureId) {
        this.videoTextureId = videoTextureId;
        this.videoTextureWidth = textureWidth;
        this.videoTextureHeight = textureHeight;
        Log.d(TAG, "setTextureInfo." + textureWidth + "x" + textureHeight + ":" + videoTextureId);
    }

    public void prepare(CocosXRVideoManager.VideoEventData data) {
        if (this.videoTexture == null) {
            this.videoTexture = new CocosXRVideoTexture();
        }
        this.videoSourceType = data.videoSourceType;
        this.videoSourceUrl = data.videoSourceUrl;
        if(TextUtils.isEmpty(this.videoSourceUrl)) {
            Log.w(TAG, "prepare failed, because video source is empty !!!");
            return;
        }

        try {
            if (data.videoSourceType == CocosXRVideoManager.VIDEO_SOURCE_TYPE_LOCAL) {
                AssetFileDescriptor afd = atyWeakReference.get().getResources().getAssets().openFd(data.videoSourceUrl);
                mediaPlayer.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            } else {
                mediaPlayer.setDataSource(data.videoSourceUrl);
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.e(TAG, e.getLocalizedMessage());
        }

        mediaPlayer.setLooping(data.isLoop);
        mediaPlayer.setVolume(data.volume, data.volume);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                mediaPlayer.setPlaybackParams(mediaPlayer.getPlaybackParams().setSpeed(data.playbackSpeed));
            } catch (Exception e) {
                e.printStackTrace();
                Log.e(TAG, "prepare:" + e.getLocalizedMessage());
            }
        }
        mediaPlayerState = MediaPlayerState.READY_PREPARE;
        if (isGLInitialized) {
            runOnUIThread(() -> {
                if(mediaPlayerState == MediaPlayerState.READY_PREPARE) {
                    mediaPlayerState = MediaPlayerState.PREPARING;
                    mediaPlayer.prepareAsync();
                }
            });
        }
        Log.d(TAG, "prepare");
    }

    public int getTargetTextureId() {
        return videoTextureId;
    }

    public int getVideoTextureWidth() {
        return videoTextureWidth;
    }

    public int getVideoTextureHeight() {
        return videoTextureHeight;
    }

    public int getVideoSourceWidth() {
        return videoSourceSizeWidth;
    }

    public int getVideoSourceHeight() {
        return videoSourceSizeHeight;
    }

    public String getVideoSourceUrl() {
        return videoSourceUrl;
    }

    public int getVideoSourceType() {
        return videoSourceType;
    }

    public void onGLReady() {
        Log.d(TAG, "onGLReady." + this.hashCode());
        videoTexture.createSurfaceTexture();
        quadScreen.initShader();
        Surface surface = new Surface(videoTexture.getSurfaceTexture());
        mediaPlayer.setSurface(surface);
        surface.release();
        isGLInitialized = true;
        if(mediaPlayerState == MediaPlayerState.READY_PREPARE) {
            runOnUIThread(() -> {
                if(mediaPlayerState == MediaPlayerState.READY_PREPARE) {
                    mediaPlayerState = MediaPlayerState.PREPARING;
                    mediaPlayer.prepareAsync();
                }
            });
        }
    }

    public void onBeforeGLDrawFrame() {
        if (!isGLInitialized) {
            onGLReady();
        }
    }

    public void onGLDrawFrame() {
        if (videoTextureId == 0 || videoTextureWidth == 0 || videoTextureHeight == 0) {
            return;
        }
        videoTexture.updateTexture();
        quadScreen.draw(videoTexture.getOESTextureId(), videoTexture.getVideoMatrix());
    }

    public void onGLDestroy() {
        if (videoTexture != null) {
            videoTexture.release();
            videoTexture = null;
        }

        if (quadScreen != null) {
            quadScreen.release();
            quadScreen = null;
        }
    }

    public void play() {
        runOnUIThread(() -> {
            Log.d(TAG, "- start");
            mediaPlayer.start();
            mediaPlayerState = MediaPlayerState.STARTED;
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_GET_IS_PALYING, eventName, uniqueKey, String.valueOf(mediaPlayer.isPlaying() ? 1 : 0));
        });
    }

    public void pause() {
        if(!mediaPlayer.isPlaying()) return;
        runOnUIThread(() -> {
            Log.d(TAG, "- pause");
            mediaPlayer.pause();
            mediaPlayerState = MediaPlayerState.PAUSED;
            CocosXRVideoManager.getInstance().sendVideoEvent(CocosXRVideoManager.VIDEO_EVENT_GET_IS_PALYING, eventName, uniqueKey, String.valueOf(mediaPlayer.isPlaying() ? 1 : 0));
        });
    }

    public void stop() {
        runOnUIThread(() -> {
            Log.d(TAG, "- stop");
            mediaPlayer.stop();
            mediaPlayerState = MediaPlayerState.STOPPED;
        });
    }

    public void reset() {
        runOnUIThread(() -> {
            Log.d(TAG, "- reset");
            mediaPlayer.reset();
            mediaPlayerState = MediaPlayerState.IDLE;
        });
    }

    public void release() {
        runOnUIThread(() -> {
            if (mediaPlayer != null) {
                try {
                    if (mediaPlayer.isPlaying()) {
                        mediaPlayer.pause();
                    }
                    mediaPlayer.stop();
                    mediaPlayer.release();
                    mediaPlayer = null;
                    mediaPlayerState = MediaPlayerState.END;
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.e(TAG, e.getLocalizedMessage());
                }
                Log.d(TAG, "- release");
            }
        });
    }

    public boolean isPlaying() {
        return mediaPlayer != null && mediaPlayer.isPlaying();
    }

    public boolean isStopped() {
        return mediaPlayerState == MediaPlayerState.STOPPED;
    }

    public boolean isLooping() {
        return mediaPlayer.isLooping();
    }

    public void setLooping(boolean looping) {
        runOnUIThread(() -> {
            Log.d(TAG, "- setLooping." + looping);
            mediaPlayer.setLooping(looping);
        });
    }

    public void setVolume(float volume) {
        runOnUIThread(() -> mediaPlayer.setVolume(volume, volume));
    }

    public int getDuration() {
        return mediaPlayer.getDuration();
    }

    public int getCurrentPosition() {
        return mediaPlayer.getCurrentPosition();
    }

    public void seekTo(int mSec) {
        runOnUIThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                mediaPlayer.seekTo(mSec, MediaPlayer.SEEK_CLOSEST);
            } else {
                mediaPlayer.seekTo(mSec);
            }
        });
    }

    public float getPlaybackSpeed() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return mediaPlayer.getPlaybackParams().getSpeed();
        } else {
            return 1;
        }
    }

    public void setPlaybackSpeed(float speed) {
        runOnUIThread(() -> {
            Log.d(TAG, "- setPlaybackSpeed." + speed);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                try {
                    mediaPlayer.setPlaybackParams(mediaPlayer.getPlaybackParams().setSpeed(Math.max(speed, 0.1f)));
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.e(TAG, e.getLocalizedMessage());
                }
            }
        });
    }
}
