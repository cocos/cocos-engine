/****************************************************************************
Copyright (c) 2014-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import org.cocos2dx.lib.Cocos2dxVideoView.OnVideoEventListener;

import java.lang.ref.WeakReference;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class Cocos2dxVideoHelper {

    private RelativeLayout mLayout = null;
    private Cocos2dxActivity mActivity = null;  
    private static SparseArray<Cocos2dxVideoView> sVideoViews = null;
    static VideoHandler mVideoHandler = null;
    private static Handler sHandler = null;
    
    Cocos2dxVideoHelper(Cocos2dxActivity activity,RelativeLayout layout)
    {
        mActivity = activity;
        mLayout = layout;
        
        mVideoHandler = new VideoHandler(this);
        sVideoViews = new SparseArray<Cocos2dxVideoView>();
        sHandler = new Handler(Looper.myLooper());
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

    static class VideoHandler extends Handler{
        WeakReference<Cocos2dxVideoHelper> mReference;

        VideoHandler(Cocos2dxVideoHelper helper){
            mReference = new WeakReference<Cocos2dxVideoHelper>(helper);
        }

        @Override
        public void handleMessage(Message msg) {
            Cocos2dxVideoHelper helper = mReference.get();
            switch (msg.what) {
            case VideoTaskCreate: {
                helper._createVideoView(msg.arg1);
                break;
            }
            case VideoTaskRemove: {
                helper._removeVideoView(msg.arg1);
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
                helper._setVideoRect(msg.arg1, rect.left, rect.top, rect.right, rect.bottom);
                break;
            }
            case VideoTaskFullScreen:{
                if (msg.arg2 == 1) {
                    helper._setFullScreenEnabled(msg.arg1, true);
                } else {
                    helper._setFullScreenEnabled(msg.arg1, false);
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
                    helper._setVideoVisible(msg.arg1, true);
                } else {
                    helper._setVideoVisible(msg.arg1, false);
                }
                break;
            }
            case VideoTaskKeepRatio: {
                if (msg.arg2 == 1) {
                    helper._setVideoKeepRatio(msg.arg1, true);
                } else {
                    helper._setVideoKeepRatio(msg.arg1, false);
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

            super.handleMessage(msg);
        }
    }

    private class VideoEventRunnable implements Runnable
    {
        private int mVideoTag;
        private int mVideoEvent;

        public VideoEventRunnable(int tag,int event) {
            mVideoTag = tag;
            mVideoEvent = event;
        }
        @Override
        public void run() {
            nativeExecuteVideoCallback(mVideoTag, mVideoEvent);
        }

    }

    public static native void nativeExecuteVideoCallback(int index,int event);

    OnVideoEventListener videoEventListener = new OnVideoEventListener() {

        @Override
        public void onVideoEvent(int tag,int event) {
            mActivity.runOnGLThread(new VideoEventRunnable(tag, event));
        }
    };

    public static int createVideoWidget() {
        Message msg = new Message();
        msg.what = VideoTaskCreate;
        msg.arg1 = videoTag;
        mVideoHandler.sendMessage(msg);
        
        return videoTag++;
    }

    private void _createVideoView(int index) {
        Cocos2dxVideoView videoView = new Cocos2dxVideoView(mActivity,index);
        sVideoViews.put(index, videoView);
        FrameLayout.LayoutParams lParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT);
        mLayout.addView(videoView, lParams);
        videoView.setZOrderOnTop(true);
        videoView.setVideoViewEventListener(videoEventListener);
    }

    public static void removeVideoWidget(int index){
        Message msg = new Message();
        msg.what = VideoTaskRemove;
        msg.arg1 = index;
        mVideoHandler.sendMessage(msg);
    }

    private void _removeVideoView(int index) {
        Cocos2dxVideoView view = sVideoViews.get(index);
        if (view != null) {
            view.stopPlayback();
            sVideoViews.remove(index);
            mLayout.removeView(view);
        }
    }

    public static void setVideoUrl(int index, int videoSource, String videoUrl) {
        Message msg = new Message();
        msg.what = VideoTaskSetSource;
        msg.arg1 = index;
        msg.arg2 = videoSource;
        msg.obj = videoUrl;
        mVideoHandler.sendMessage(msg);
    }

    private void _setVideoURL(int index, int videoSource, String videoUrl) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
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
        mVideoHandler.sendMessage(msg);
    }

    private void _setVideoRect(int index, int left, int top, int maxWidth, int maxHeight) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setVideoRect(left,top,maxWidth,maxHeight);
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
        mVideoHandler.sendMessage(msg);
    }

    private void _setFullScreenEnabled(int index, boolean enabled) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setFullScreenEnabled(enabled);
        }
    }

    private void onBackKeyEvent() {
        int viewCount = sVideoViews.size();
        for (int i = 0; i < viewCount; i++) {
            int key = sVideoViews.keyAt(i);
            Cocos2dxVideoView videoView = sVideoViews.get(key);
            if (videoView != null) {
                videoView.setFullScreenEnabled(false);
                mActivity.runOnGLThread(new VideoEventRunnable(key, KeyEventBack));
            }
        }
    }

    public static void startVideo(int index) {
        Message msg = new Message();
        msg.what = VideoTaskStart;
        msg.arg1 = index;
        mVideoHandler.sendMessage(msg);
    }

    private void _startVideo(int index) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.start();
        }
    }

    public static void pauseVideo(int index) {
        Message msg = new Message();
        msg.what = VideoTaskPause;
        msg.arg1 = index;
        mVideoHandler.sendMessage(msg);
    }

    private void _pauseVideo(int index) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.pause();
        }
    }

    public static void stopVideo(int index) {
        Message msg = new Message();
        msg.what = VideoTaskStop;
        msg.arg1 = index;
        mVideoHandler.sendMessage(msg);
    }

    private void _stopVideo(int index) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.stop();
        }
    }

    public static void seekVideoTo(int index,int msec) {
        Message msg = new Message();
        msg.what = VideoTaskSeek;
        msg.arg1 = index;
        msg.arg2 = msec;
        mVideoHandler.sendMessage(msg);
    }

    private void _seekVideoTo(int index,int msec) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.seekTo(msec);
        }
    }


    public static <T> T callInMainThread(Callable<T> call) throws ExecutionException, InterruptedException {
        FutureTask<T> task = new FutureTask<T>(call);
        sHandler.post(task);
        return task.get();
    }

    public static float getCurrentTime(final int index) {
        Callable<Float> callable = new Callable<Float>() {
            @Override
            public Float call() throws Exception {
                Cocos2dxVideoView video = sVideoViews.get(index);
                float currentPosition = -1;
                if (video != null) {
                    currentPosition = video.getCurrentPosition() / 1000.0f;
                }
                return new Float(currentPosition);
            }
        };

        try {
            return callInMainThread(callable);
        } catch (ExecutionException e) {
            return -1;
        } catch (InterruptedException e) {
            return -1;
        }
    }

    public  static  float getDuration(final int index) {
        Callable<Float> callable = new Callable<Float>() {
            @Override
            public Float call() throws Exception {
                Cocos2dxVideoView video = sVideoViews.get(index);
                float duration = -1;
                if (video != null) {
                    duration = video.getDuration() / 1000.0f;
                }
                if (duration <= 0) {
                    Log.w("Cocos2dxVideoHelper", "Video player's duration is not ready to get now!");
                }
                return new Float(duration);
            }
        };

        try {
            return callInMainThread(callable);
        } catch (ExecutionException e) {
            return -1;
        } catch (InterruptedException e) {
            return -1;
        }
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
        
        mVideoHandler.sendMessage(msg);
    }

    private void _setVideoVisible(int index, boolean visible) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            if (visible) {
                videoView.fixSize();
                videoView.setVisibility(View.VISIBLE);
            } else {
                videoView.setVisibility(View.INVISIBLE);
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
        mVideoHandler.sendMessage(msg);
    }

    private void _setVideoKeepRatio(int index, boolean enable) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setKeepRatio(enable);
        }
    }

    private void _setVolume(final int index, final float volume) {
        Cocos2dxVideoView videoView = sVideoViews.get(index);
        if (videoView != null) {
            videoView.setVolume(volume);
        }
    }

    public static void setVolume(final int index, final float volume) {
        Message msg = new Message();
        msg.what = VideoTaskSetVolume;
        msg.arg1 = index;
        msg.arg2 = (int) (volume * 10);
        mVideoHandler.sendMessage(msg);
    }

}
