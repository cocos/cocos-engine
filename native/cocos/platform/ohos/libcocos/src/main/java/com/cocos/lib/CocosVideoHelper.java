/****************************************************************************
Copyright (c) 2014-2016 Chukong Technologies Inc.
Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

package com.cocos.lib;

import com.cocos.lib.CocosVideoView.OnVideoEventListener;
import ohos.aafwk.ability.AbilitySlice;
import ohos.agp.components.Component;
import ohos.agp.components.StackLayout;
import ohos.eventhandler.EventHandler;
import ohos.eventhandler.EventRunner;
import ohos.eventhandler.InnerEvent;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.media.image.common.Rect;

import java.lang.ref.WeakReference;
import java.util.WeakHashMap;

public class CocosVideoHelper {

    private StackLayout mRootLayout = null;
    private AbilitySlice mActivity = null;
    private static WeakHashMap<Integer, CocosVideoView> sVideoViews = null;
    static VideoHandler mVideoHandler = null;

    private static final HiLogLabel LABEL = new HiLogLabel(HiLog.LOG_APP, 0, "CocosVideoHelper");

    CocosVideoHelper(AbilitySlice activity, StackLayout layout)
    {
        mActivity = activity;
        mRootLayout = layout;

        mVideoHandler = new VideoHandler(this);
        sVideoViews = new WeakHashMap<>();
    }

    private static int videoTag = 0;
    private final static int VideoTaskCreate = 0;
    private final static int VideoTaskRemove = 1;
    private final static int VideoTaskSetSource = 2;
    private final static int VideoTaskSetRect = 3;
    private final static int VideoTaskStart = 4;
    private final static int VideoTaskPause = 5;
    private final static int VideoTaskResume = 6;
    private final static int VideoTaskStop = 7;
    private final static int VideoTaskSeek = 8;
    private final static int VideoTaskSetVisible = 9;
    private final static int VideoTaskRestart = 10;
    private final static int VideoTaskKeepRatio = 11;
    private final static int VideoTaskFullScreen = 12;
    private final static int VideoTaskSetVolume = 13;

    final static int KeyEventBack = 1000;

    static class VideoHandler extends EventHandler {
        WeakReference<CocosVideoHelper> mReference;

        VideoHandler(CocosVideoHelper helper){
            super(EventRunner.getMainEventRunner());
            mReference = new WeakReference<CocosVideoHelper>(helper);
        }

        @Override
        public void processEvent(InnerEvent event) {
            CocosVideoHelper helper = mReference.get();
            Message msg = (Message) event.object;
            switch (msg.what) {
            case VideoTaskCreate: {
                helper._createVideoView(msg.arg1);
                break;
            }
            case VideoTaskRemove: {
                CocosHelper.ruOnUIThreadSync(()->helper._removeVideoView(msg.arg1));
                break;
            }
            case VideoTaskSetSource: {
                helper._setVideoURL(msg.arg1, msg.arg2, (String)msg.obj);
                break;
            }
            case VideoTaskStart: {
                helper._startVideo(msg.arg1);
                break;
            }
            case VideoTaskSetRect: {
                Rect rect = (Rect)msg.obj;
                CocosHelper.ruOnUIThreadSync(
                        ()->helper._setVideoRect(msg.arg1, rect.minX, rect.minY, rect.width , rect.height)
                );
                break;
            }
            case VideoTaskFullScreen:{
                if (msg.arg2 == 1) {
                    CocosHelper.ruOnUIThreadSync(()->helper._setFullScreenEnabled(msg.arg1, true));
                } else {
                    CocosHelper.ruOnUIThreadSync(()->helper._setFullScreenEnabled(msg.arg1, false));
                }
                break;
            }
            case VideoTaskPause: {
                helper._pauseVideo(msg.arg1);
                break;
            }

            case VideoTaskStop: {
                helper._stopVideo(msg.arg1);
                break;
            }
            case VideoTaskSeek: {
                helper._seekVideoTo(msg.arg1, msg.arg2);
                break;
            }
            case VideoTaskSetVisible: {
                if (msg.arg2 == 1) {
                    CocosHelper.ruOnUIThreadSync(()->helper._setVideoVisible(msg.arg1, true));
                } else {
                    CocosHelper.ruOnUIThreadSync(()->helper._setVideoVisible(msg.arg1, false));
                }
                break;
            }
            case VideoTaskKeepRatio: {
                if (msg.arg2 == 1) {
                    CocosHelper.ruOnUIThreadSync(()->helper._setVideoKeepRatio(msg.arg1, true));
                } else {
                    CocosHelper.ruOnUIThreadSync(()->helper._setVideoKeepRatio(msg.arg1, false));
                }
                break;
            }
            case KeyEventBack: {
                helper.onBackKeyEvent();
                break;
            }
            case VideoTaskSetVolume: {
                float volume = (float) msg.arg2 / 10;
                helper._setVolume(msg.arg1, volume);
                break;
            }
            default:
                break;
            }

            super.processEvent(event);
        }
    }

    public static native void nativeExecuteVideoCallback(int index,int event);

    OnVideoEventListener videoEventListener = new OnVideoEventListener() {

        @Override
        public void onVideoEvent(int tag,int event) {
            CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                @Override
                public void run() {
                    nativeExecuteVideoCallback(tag, event);
                }
            });
        }
    };

    static class Message {
        public int what =0;
        public int arg1 = 0;
        public int arg2 = 0;
        public Object obj = null;
    }

    public static int createVideoWidget() {
        Message msg = new Message();
        msg.what = VideoTaskCreate;
        msg.arg1 = videoTag;
        dispatchMessage(msg);

        return videoTag++;
    }

    private static void dispatchMessage(Message msg) {
        InnerEvent event = InnerEvent.get(msg.what, msg.arg1, msg);
        mVideoHandler.distributeEvent(event);
    }


    private void _createVideoView(int index) {
        CocosVideoView videoView = new CocosVideoView(mActivity,index);
        sVideoViews.put(index, videoView);
        StackLayout.LayoutConfig lParams = new StackLayout.LayoutConfig(
                StackLayout.LayoutConfig.MATCH_CONTENT,
                StackLayout.LayoutConfig.MATCH_CONTENT);
        CocosHelper.runOnUIThread(()->{
            mRootLayout.addComponent(videoView, lParams);
        });
        videoView.setVideoViewEventListener(videoEventListener);
    }

    public static void removeVideoWidget(int index){
        Message msg = new Message();
        msg.what = VideoTaskRemove;
        msg.arg1 = index;
        dispatchMessage(msg);
    }

    private void _removeVideoView(int index) {
        CocosVideoView view = sVideoViews.get(index);
        if (view != null) {
            view.stopPlayback();
            sVideoViews.remove(index);
            mRootLayout.removeComponent(view);
        }
    }

    public static void setVideoUrl(int index, int videoSource, String videoUrl) {
        Message msg = new Message();
        msg.what = VideoTaskSetSource;
        msg.arg1 = index;
        msg.arg2 = videoSource;
        msg.obj = videoUrl;
        dispatchMessage(msg);
    }

    private void _setVideoURL(int index, int videoSource, String videoUrl) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            switch (videoSource) {
            case 0:
                videoView.setVideoFileName(videoUrl);
                break;
            case 1:
                videoView.setVideoURL(videoUrl);
                break;
            default:
                break;
            }
        }
    }

    public static void setVideoRect(int index, int left, int top, int maxWidth, int maxHeight) {
        Message msg = new Message();
        msg.what = VideoTaskSetRect;
        msg.arg1 = index;
        msg.obj = new Rect(left, top, maxWidth, maxHeight);
        dispatchMessage(msg);
    }

    private void _setVideoRect(int index, int left, int top, int maxWidth, int maxHeight) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setVideoRect(left, top, maxWidth, maxHeight);
        }
    }

    public static void setFullScreenEnabled(int index, boolean enabled) {
        Message msg = new Message();
        msg.what = VideoTaskFullScreen;
        msg.arg1 = index;
        if (enabled) {
            msg.arg2 = 1;
        } else {
            msg.arg2 = 0;
        }
        dispatchMessage(msg);
    }

    private void _setFullScreenEnabled(int index, boolean enabled) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setFullScreenEnabled(enabled);
        }
    }

    private void onBackKeyEvent() {
        for(Integer key : sVideoViews.keySet()) {
            CocosVideoView videoView = sVideoViews.get(key);
            if (videoView != null) {
                videoView.setFullScreenEnabled(false);
                CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                    @Override
                    public void run() {
                        nativeExecuteVideoCallback(key, KeyEventBack);
                    }
                });
            }
        }
    }

    public static void startVideo(int index) {
        Message msg = new Message();
        msg.what = VideoTaskStart;
        msg.arg1 = index;
        dispatchMessage(msg);
    }

    private void _startVideo(int index) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.start();
        }
    }

    public static void pauseVideo(int index) {
        Message msg = new Message();
        msg.what = VideoTaskPause;
        msg.arg1 = index;
        dispatchMessage(msg);
    }

    private void _pauseVideo(int index) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.pause();
        }
    }

    public static void stopVideo(int index) {
        Message msg = new Message();
        msg.what = VideoTaskStop;
        msg.arg1 = index;
        dispatchMessage(msg);
    }

    private void _stopVideo(int index) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.stop();
        }
    }

    public static void seekVideoTo(int index,int msec) {
        Message msg = new Message();
        msg.what = VideoTaskSeek;
        msg.arg1 = index;
        msg.arg2 = msec;
        dispatchMessage(msg);
    }

    private void _seekVideoTo(int index,int msec) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.seekTo(msec);
        }
    }

    public static float getCurrentTime(final int index) {
        CocosVideoView video = sVideoViews.get(index);
        float currentPosition = -1;
        if (video != null) {
            currentPosition = video.getCurrentPosition() / 1000.0f;
        }
        return currentPosition;
    }

    public  static  float getDuration(final int index) {
        CocosVideoView video = sVideoViews.get(index);
        float duration = -1;
        if (video != null) {
            duration = video.getDuration() / 1000.0f;
        }
        if (duration <= 0) {
            HiLog.error(LABEL, "Video player's duration is not ready to get now!");
        }
        return duration;
    }

    public static void setVideoVisible(int index, boolean visible) {
        Message msg = new Message();
        msg.what = VideoTaskSetVisible;
        msg.arg1 = index;
        if (visible) {
            msg.arg2 = 1;
        } else {
            msg.arg2 = 0;
        }
        dispatchMessage(msg);
    }

    private void _setVideoVisible(int index, boolean visible) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            if (visible) {
                videoView.fixSizeAsync();
                videoView.setVisibility(Component.VISIBLE);
            } else {
                videoView.setVisibility(Component.INVISIBLE);
            }
        }
    }

    public static void setVideoKeepRatioEnabled(int index, boolean enable) {
        Message msg = new Message();
        msg.what = VideoTaskKeepRatio;
        msg.arg1 = index;
        if (enable) {
            msg.arg2 = 1;
        } else {
            msg.arg2 = 0;
        }
        dispatchMessage(msg);
    }

    private void _setVideoKeepRatio(int index, boolean enable) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setKeepRatio(enable);
        }
    }

    private void _setVolume(final int index, final float volume) {
        CocosVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setVolume(volume);
        }
    }

    public static void setVolume(final int index, final float volume) {
        Message msg = new Message();
        msg.what = VideoTaskSetVolume;
        msg.arg1 = index;
        msg.arg2 = (int) (volume * 10);
        dispatchMessage(msg);
    }
}
