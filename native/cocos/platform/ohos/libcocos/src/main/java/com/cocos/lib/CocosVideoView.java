/*
 * Copyright (C) 2006 The Android Open Source Project
 * Copyright (c) 2014-2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.cocos.lib;

import ohos.aafwk.ability.AbilitySlice;
import ohos.aafwk.ability.Lifecycle;
import ohos.aafwk.ability.LifecycleStateObserver;
import ohos.aafwk.content.Intent;
import ohos.agp.components.Component;
import ohos.agp.components.StackLayout;
import ohos.agp.components.surfaceprovider.SurfaceProvider;
import ohos.agp.graphics.SurfaceOps;
import ohos.agp.utils.Rect;
import ohos.agp.window.dialog.BaseDialog;
import ohos.agp.window.dialog.PopupDialog;
import ohos.agp.window.dialog.ToastDialog;
import ohos.global.resource.RawFileDescriptor;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.media.audio.AudioManager;
import ohos.media.common.Source;
import ohos.media.player.Player;
import ohos.multimodalinput.event.TouchEvent;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CocosVideoView extends SurfaceProvider implements Component.TouchEventListener, LifecycleStateObserver {

    // ===========================================================
    // Internal classes and interfaces.
    // ===========================================================

    public interface OnVideoEventListener {
        void onVideoEvent(int tag, int event);
    }

    private enum State {
        IDLE,
        ERROR,
        INITIALIZED,
        PREPARING,
        PREPARED,
        STARTED,
        PAUSED,
        STOPPED,
        PLAYBACK_COMPLETED,
    }

    // ===========================================================
    // Constants
    // ===========================================================
    private static final String AssetResourceRoot = "@assets/";
    private static final String OHOSResourceRoot = "entry/resources/rawfile/";

    // ===========================================================
    // Fields
    // ===========================================================

    private HiLogLabel TAG = new HiLogLabel(HiLog.LOG_APP, 0, "CocosVideoView");

    private Source mVideoUri;
    private int mDuration;
    private int mPosition;

    private State mCurrentState = State.IDLE;

    // All the stuff we need for playing and showing a video
    private Player mMediaPlayer = null;
    private int mVideoWidth = 0;
    private int mVideoHeight = 0;

    private OnVideoEventListener mOnVideoEventListener;

    // recording the seek position while preparing
    private int mSeekWhenPrepared = 0;

    protected AbilitySlice mAbility = null;

    protected int mViewLeft = 0;
    protected int mViewTop = 0;
    protected int mViewWidth = 0;
    protected int mViewHeight = 0;

    protected int mVisibleLeft = 0;
    protected int mVisibleTop = 0;
    protected int mVisibleWidth = 0;
    protected int mVisibleHeight = 0;

    protected boolean mFullScreenEnabled = false;

    private boolean mIsAssetRouse = false;
    private String mVideoFilePath = null;

    private int mViewTag = 0;
    private boolean mKeepRatio = false;
    private boolean mMetaUpdated = false;

    // MediaPlayer will be released when surface view is destroyed, so should record the position,
    // and use it to play after MedialPlayer is created again.
    private int mPositionBeforeRelease = 0;

    // ===========================================================
    // Constructors
    // ===========================================================

    public CocosVideoView(AbilitySlice activity, int tag) {
        super(activity);

        mViewTag = tag;
        mAbility = activity;
        mMediaPlayer = new Player(getContext());
        mMediaPlayer.setPlayerCallback(mPlayerCallback);
        initVideoView();

        pinToZTop(true);
    }

    // ===========================================================
    // Getter & Setter
    // ===========================================================

    public void setVideoRect(int left, int top, int maxWidth, int maxHeight) {
        if (mViewLeft == left && mViewTop == top && mViewWidth == maxWidth && mViewHeight == maxHeight)
            return;

        mViewLeft = left;
        mViewTop = top;
        mViewWidth = maxWidth;
        mViewHeight = maxHeight;

        fixSize(mViewLeft, mViewTop, mViewWidth, mViewHeight);
    }

    public void setFullScreenEnabled(boolean enabled) {
        if (mFullScreenEnabled != enabled) {
            mFullScreenEnabled = enabled;
            fixSizeAsync();
        }
    }

    public void setVolume(float volume) {
        if (mMediaPlayer != null) {
            mMediaPlayer.setVolume(volume);
        }
    }

    public void setKeepRatio(boolean enabled) {
        mKeepRatio = enabled;
        fixSizeAsync();
    }

    public void setVideoURL(String url) {
        mIsAssetRouse = false;
        setVideoURI(new Source(url), null);
    }

    public void setVideoFileName(String path) {
        if (path.startsWith(AssetResourceRoot)) {
            path = path.replaceFirst(AssetResourceRoot, OHOSResourceRoot);
        }

        if (path.startsWith("/")) {
            mIsAssetRouse = false;
            setVideoURI(new Source(path), null);
        } else {

            mVideoFilePath = path;
            mIsAssetRouse = true;
            setVideoURI(new Source(path), null);
        }
    }

    public int getCurrentPosition() {
        if (!(mCurrentState == State.IDLE ||
                mCurrentState == State.ERROR ||
                mCurrentState == State.INITIALIZED ||
                mCurrentState == State.STOPPED ||
                mMediaPlayer == null)) {
            mPosition = mMediaPlayer.getCurrentTime();
        }
        return mPosition;
    }

    public int getDuration() {
        if (!(mCurrentState == State.IDLE ||
                mCurrentState == State.ERROR ||
                mCurrentState == State.INITIALIZED ||
                mCurrentState == State.STOPPED ||
                mMediaPlayer == null)) {
            mDuration = mMediaPlayer.getDuration();
        }

        return mDuration;
    }

    /**
     * Register a callback to be invoked when some video event triggered.
     *
     * @param l The callback that will be run
     */
    public void setVideoViewEventListener(OnVideoEventListener l) {
        mOnVideoEventListener = l;
    }

    // ===========================================================
    // Overrides
    // ===========================================================

    @Override
    public void setVisibility(int visibility) {
        super.setVisibility(visibility);
    }

    @Override
    public boolean onTouchEvent(Component component, TouchEvent touchEvent) {
        if ((touchEvent.getAction() & TouchEvent.PRIMARY_POINT_UP) == TouchEvent.PRIMARY_POINT_UP) {
            this.sendEvent(EVENT_CLICKED);
        }
        return true;
    }

    // ===========================================================
    // Public functions
    // ===========================================================

    public void stop() {
        if (!(mCurrentState == State.IDLE || mCurrentState == State.INITIALIZED || mCurrentState == State.ERROR || mCurrentState == State.STOPPED)
                && mMediaPlayer != null) {
            mCurrentState = State.STOPPED;
            mMediaPlayer.stop();
            this.sendEvent(EVENT_STOPPED);

            // after the video is stop, it shall prepare to be playable again
            try {
                mMediaPlayer.prepare();
                this.showFirstFrame();
            } catch (Exception ex) {
            }
        }
    }

    public void stopPlayback() {
        this.removeFromWindow();
        this.release();
    }

    public void start() {
        if ((mCurrentState == State.PREPARED ||
                mCurrentState == State.PAUSED ||
                mCurrentState == State.PLAYBACK_COMPLETED) &&
                mMediaPlayer != null) {

            mCurrentState = State.STARTED;
            mMediaPlayer.play();
            this.sendEvent(EVENT_PLAYING);
        }
    }

    public void pause() {
        if ((mCurrentState == State.STARTED || mCurrentState == State.PLAYBACK_COMPLETED) &&
                mMediaPlayer != null) {
            mCurrentState = State.PAUSED;
            mMediaPlayer.pause();
            this.sendEvent(EVENT_PAUSED);
        }
    }

    public void seekTo(int ms) {
        if (mCurrentState == State.IDLE || mCurrentState == State.INITIALIZED ||
                mCurrentState == State.STOPPED || mCurrentState == State.ERROR ||
                mMediaPlayer == null) {
            return;
        }

        boolean rewindResult = mMediaPlayer.rewindTo(ms * 1000);
        System.out.println("Player seek to " + ms + "ms, " + getCurrentPosition() + "ms/"+getDuration() + "ms, rewind result "+ rewindResult);
    }

    public void fixSizeAsync() {
        CocosHelper.ruOnUIThreadSync(this::fixSizeUIThread);
    }

    private void fixSizeUIThread() {
        if (mFullScreenEnabled) {
            Rect rect = mAbility.getWindow().getBoundRect();
            fixSize(rect.left, rect.top, rect.getWidth(), rect.getHeight());
        } else {
            if(mViewWidth == 0 || mViewHeight == 0) {
                CocosHelper.runOnUIThread(this::fixSizeUIThread, true);
                return;
            }
            fixSize(mViewLeft, mViewTop, mViewWidth, mViewHeight);
        }
    }

    public void fixSize(int left, int top, int width, int height) {
        if (mVideoWidth == 0 || mVideoHeight == 0) {
            mVisibleLeft = left;
            mVisibleTop = top;
            mVisibleWidth = width;
            mVisibleHeight = height;
        } else if (width != 0 && height != 0) {
            if (mKeepRatio && !mFullScreenEnabled) {
                if (mVideoWidth * height > width * mVideoHeight) {
                    mVisibleWidth = width;
                    mVisibleHeight = width * mVideoHeight / mVideoWidth;
                } else if (mVideoWidth * height < width * mVideoHeight) {
                    mVisibleWidth = height * mVideoWidth / mVideoHeight;
                    mVisibleHeight = height;
                }
                mVisibleLeft = left + (width - mVisibleWidth) / 2;
                mVisibleTop = top + (height - mVisibleHeight) / 2;
            } else {
                mVisibleLeft = left;
                mVisibleTop = top;
                mVisibleWidth = width;
                mVisibleHeight = height;
            }
        } else {
            mVisibleLeft = left;
            mVisibleTop = top;
            mVisibleWidth = mVideoWidth;
            mVisibleHeight = mVideoHeight;
        }

        setComponentSize(mVideoWidth, mVideoHeight);

        StackLayout.LayoutConfig lParams = new StackLayout.LayoutConfig(StackLayout.LayoutConfig.MATCH_CONTENT,
                StackLayout.LayoutConfig.MATCH_CONTENT);
        lParams.setMarginLeft(mVisibleLeft);
        lParams.setMarginTop(mVisibleTop);
        lParams.width = mVisibleWidth;
        lParams.height = mVisibleHeight;
        setLayoutConfig(lParams);
    }

    public int resolveAdjustedSize(int desiredSize, int measureSpec) {
        int result = desiredSize;
        int specMode = EstimateSpec.getMode(measureSpec);
        int specSize = EstimateSpec.getSize(measureSpec);

        switch (specMode) {
            case EstimateSpec.UNCONSTRAINT:
                /* Parent says we can be as big as we want. Just don't be larger
                 * than max size imposed on ourselves.
                 */
                result = desiredSize;
                break;

            case EstimateSpec.NOT_EXCEED:
                /* Parent says we can be as big as we want, up to specSize.
                 * Don't be larger than specSize, and don't be larger than
                 * the max size imposed on ourselves.
                 */
                result = Math.min(desiredSize, specSize);
                break;

            case EstimateSpec.PRECISE:
                // No choice. Do what we are told.
                result = specSize;
                break;
        }

        return result;
    }

    // ===========================================================
    // Private functions
    // ===========================================================

    private void initVideoView() {
        mVideoWidth = 0;
        mVideoHeight = 0;
        if(this.getSurfaceOps().isPresent()) {
            getSurfaceOps().get().addCallback(new SurfaceOps.Callback() {
                @Override
                public void surfaceCreated(SurfaceOps surfaceOps) {
                    CocosVideoView.this.mMediaPlayer.setVideoSurface(surfaceOps.getSurface());
                    openVideo();
                }

                @Override
                public void surfaceChanged(SurfaceOps surfaceOps, int i, int i1, int i2) {
                    CocosVideoView.this.mMediaPlayer.setVideoSurface(surfaceOps.getSurface());
                }

                @Override
                public void surfaceDestroyed(SurfaceOps surfaceOps) {
                    // after we return from this we can't use the surface any more
                    mPositionBeforeRelease = getCurrentPosition();
                    CocosVideoView.this.doRelease();
                }
            });
        }
        mCurrentState = State.IDLE;
        setTouchEventListener(this);
        setFocusable(FOCUS_ADAPTABLE);
        setTouchFocusable(true);
    }

    /**
     * @hide
     */
    private void setVideoURI(Source uri, Map<String, String> headers) {
        mVideoUri = uri;
        mVideoWidth = 0;
        mVideoHeight = 0;
    }

    private void openVideo() {
        if (!getSurfaceOps().isPresent() || getSurfaceOps().get().getSurface() == null) {
            // not ready for playback just yet, will try again later
            return;
        }
        if (mIsAssetRouse) {
            if (mVideoFilePath == null)
                return;
        } else if (mVideoUri == null) {
            return;
        }

//        this.pausePlaybackService();

        try {
            mMediaPlayer.setSurfaceOps(getSurfaceOps().get());
//            mMediaPlayer.setAudioStreamType(AudioManager.AudioVolumeType.STREAM_MUSIC.getValue());
            getSurfaceOps().get().setKeepScreenOn(true);

            if (mIsAssetRouse) {
                RawFileDescriptor afd = mAbility.getResourceManager().getRawFileEntry(mVideoFilePath).openRawFileDescriptor();
                mMediaPlayer.setSource(afd);
            } else {
                mMediaPlayer.setSource(mVideoUri);
            }
            mCurrentState = State.INITIALIZED;


            // Use Prepare() instead of PrepareAsync to make things easy.
//            CompletableFuture.runAsync(()->{
                mMediaPlayer.prepare();
                CocosHelper.ruOnUIThreadSync(this::showFirstFrame);
//            });
//            mMediaPlayer.prepareAsync();
        } catch (IOException ex) {
            HiLog.error(TAG, "Unable to open content: " + mVideoUri + ex);
            mCurrentState = State.ERROR;
            mPlayerCallback.onError(Player.PLAYER_ERROR_UNKNOWN, 0);
        } catch (IllegalArgumentException ex) {
            HiLog.error(TAG, "Unable to open content: " + mVideoUri + ex);
            mCurrentState = State.ERROR;
            mPlayerCallback.onError(Player.PLAYER_ERROR_UNKNOWN, 0);
        }
    }

    private final Player.IPlayerCallback mPlayerCallback = new Player.IPlayerCallback() {
        @Override
        public void onPrepared() {
            mVideoWidth = mMediaPlayer.getVideoWidth();
            mVideoHeight = mMediaPlayer.getVideoHeight();

            if (mVideoWidth != 0 && mVideoHeight != 0) {
                fixSizeAsync();
            }

            if (!mMetaUpdated) {
                CocosVideoView.this.sendEvent(EVENT_META_LOADED);
                CocosVideoView.this.sendEvent(EVENT_READY_TO_PLAY);
                mMetaUpdated = true;
            }

            mCurrentState = State.PREPARED;

            if (mPositionBeforeRelease > 0) {
                CocosVideoView.this.start();
                CocosVideoView.this.seekTo(mPositionBeforeRelease);
                mPositionBeforeRelease = 0;
            }
        }

        @Override
        public void onMessage(int i, int i1) {
            HiLog.debug(TAG, "Message "+ i + ", "+ i1);
        }

        String translateErrorMessage(int errorType, int errorCode) {
            String msg = "";
            switch (errorType) {
                case Player.PLAYER_ERROR_UNKNOWN:
                    msg += "type: PLAYER_ERROR_UNKNOWN, ";
                    break;
                case Player.PLAYER_ERROR_SERVER_DIED:
                    msg += "type: PLAYER_ERROR_SERVER_DIED, ";
                    break;
                default:
                    msg += "type: " + errorType+ ", ";
                    break;
            }
            switch (errorCode) {
                case Player.PLAYER_ERROR_IO:
                    msg += "code: PLAYER_ERROR_IO";
                    break;
                case Player.PLAYER_ERROR_MALFORMED:
                    msg += "code: PLAYER_ERROR_MALFORMED";
                    break;
                case Player.PLAYER_ERROR_UNSUPPORTED:
                    msg += "code: PLAYER_ERROR_UNSUPPORTED";
                    break;
                case Player.PLAYER_ERROR_TIMED_OUT:
                    msg += "code: PLAYER_ERROR_TIMED_OUT";
                    break;
                case Player.PLAYER_ERROR_SYSTEM:
                    msg += "code: PLAYER_ERROR_SYSTEM";
                default:
                    msg += "code: " + errorCode+ ", ";
                    break;
            }
            return msg;
        }

        @Override
        public void onError(int errorType, int errorCode) {
            mCurrentState = State.ERROR;

            //TODO: i18n
            CocosHelper.runOnUIThread(()->{
                ToastDialog dialog = new ToastDialog(getContext());
                dialog.setText("Video:" + translateErrorMessage(errorType, errorCode));
                dialog.setDuration(5000);
                dialog.show();
            });
        }

        @Override
        public void onResolutionChanged(int i, int i1) {

        }

        @Override
        public void onPlayBackComplete() {
            mCurrentState = State.PLAYBACK_COMPLETED;
            CocosVideoView.this.sendEvent(EVENT_COMPLETED);
        }

        @Override
        public void onRewindToComplete() {
            System.out.println("rewind complete");
        }

        @Override
        public void onBufferingChange(int i) {

        }

        @Override
        public void onNewTimedMetaData(Player.MediaTimedMetaData mediaTimedMetaData) {

        }

        @Override
        public void onMediaTimeIncontinuity(Player.MediaTimeInfo mediaTimeInfo) {

        }
    };

    @Override
    public void onStateChanged(Lifecycle.Event event, Intent intent) {
        switch (event) {
            case ON_START:
                break;
            case ON_ACTIVE:
                mMediaPlayer.play();
                break;
            case ON_INACTIVE:
                mMediaPlayer.pause();
                break;
            case ON_BACKGROUND:
                mMediaPlayer.stop();
                break;
            case ON_STOP:
                mMediaPlayer.release();
                break;
        }
    }

    private static final int EVENT_PLAYING = 0;
    private static final int EVENT_PAUSED = 1;
    private static final int EVENT_STOPPED = 2;
    private static final int EVENT_COMPLETED = 3;
    private static final int EVENT_META_LOADED = 4;
    private static final int EVENT_CLICKED = 5;
    private static final int EVENT_READY_TO_PLAY = 6;

    /*
     * release the media player in any state
     */
    private void doRelease() {
        if (mMediaPlayer != null) {
            mMediaPlayer.release();
            mMediaPlayer = null;
            mCurrentState = State.IDLE;
        }
    }

    private void showFirstFrame() {
        mMediaPlayer.rewindTo(1);
    }

    private void sendEvent(int event) {
        if (this.mOnVideoEventListener != null) {
            this.mOnVideoEventListener.onVideoEvent(this.mViewTag, event);
        }
    }

}
