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

import static android.opengl.EGL14.EGL_CONTEXT_CLIENT_VERSION;

import android.app.Activity;
import android.opengl.EGL14;
import android.opengl.EGLConfig;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLSurface;
import android.opengl.GLES30;
import android.util.Log;
import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.lib.xr.permission.CocosXRPermissionHelper;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class CocosXRVideoManager {
    private static final String TAG = "CocosXRVideoManager";
    private final static CocosXRVideoManager instance = new CocosXRVideoManager();

    class VideoEventData {
        public String headTag;
        public int eventId;
        public String videoPlayerHandleKey;
        public int videoSourceType;
        public String videoSourceUrl;
        public int videoWidth;
        public int videoHeight;
        public int videoTextureId;
        public boolean isLoop;
        public int seekToMsec;
        public String eventName;
        public float volume;
        public float playbackSpeed = 1.0f;

        public VideoEventData(String data) {
            String[] dataArray = data.split("&");
            if (dataArray[0].equals(XR_VIDEO_EVENT_TAG)) {
                this.eventId = Integer.parseInt(dataArray[1]);
                this.eventName = dataArray[2];
                this.videoPlayerHandleKey = dataArray[3];
                switch (this.eventId) {
                    case VIDEO_EVENT_PREPARE: {
                        this.videoSourceType = Integer.parseInt(dataArray[4]);
                        this.videoSourceUrl = dataArray[5];
                        this.isLoop = Integer.parseInt(dataArray[6]) == 1;
                        this.volume = Float.parseFloat(dataArray[7]);
                        this.playbackSpeed = Float.parseFloat(dataArray[8]);
                        break;
                    }

                    case VIDEO_EVENT_SEEK_TO: {
                        this.seekToMsec = Integer.parseInt(dataArray[4]);
                        break;
                    }

                    case VIDEO_EVENT_SET_LOOP: {
                        this.isLoop = Integer.parseInt(dataArray[4]) == 1;
                        break;
                    }

                    case VIDEO_EVENT_SET_VOLUME: {
                        this.volume = Float.parseFloat(dataArray[4]);
                        break;
                    }

                    case VIDEO_EVENT_SET_TEXTURE_INFO: {
                        this.videoWidth = Integer.parseInt(dataArray[4]);
                        this.videoHeight = Integer.parseInt(dataArray[5]);
                        this.videoTextureId = Integer.parseInt(dataArray[6]);
                        break;
                    }

                    case VIDEO_EVENT_SET_SPEED: {
                        this.playbackSpeed = Float.parseFloat(dataArray[4]);
                        break;
                    }
                }
            }
        }
    }

    private CocosXRVideoManager() {
    }

    public static CocosXRVideoManager getInstance() {
        return instance;
    }

    final int MAX_COUNT = 3;
    public static final int VIDEO_SOURCE_TYPE_LOCAL = 1;
    public static final int VIDEO_SOURCE_TYPE_REMOTE = 2;

    public static final int VIDEO_EVENT_INVALID = 1;
    //xr-event&id&handle&
    public static final int VIDEO_EVENT_PREPARE = 2;
    public static final int VIDEO_EVENT_PLAY = 3;
    public static final int VIDEO_EVENT_PAUSE = 4;
    public static final int VIDEO_EVENT_STOP = 5;
    public static final int VIDEO_EVENT_RESET = 6;
    public static final int VIDEO_EVENT_DESTROY = 7;

    public static final int VIDEO_EVENT_GET_POSITION = 30;
    public static final int VIDEO_EVENT_GET_DURATION = 31;
    public static final int VIDEO_EVENT_GET_IS_PALYING = 32;
    public static final int VIDEO_EVENT_GET_IS_LOOPING = 33;

    public static final int VIDEO_EVENT_SET_LOOP = 50;
    public static final int VIDEO_EVENT_SEEK_TO = 51;
    public static final int VIDEO_EVENT_SET_VOLUME = 52;
    public static final int VIDEO_EVENT_SET_TEXTURE_INFO = 53;
    public static final int VIDEO_EVENT_SET_SPEED = 54;

    public static final int VIDEO_EVENT_MEDIA_PLAYER_PREPARED = 100;
    public static final int VIDEO_EVENT_MEDIA_PLAYER_PLAY_COMPLETE = 101;
    public static final int VIDEO_EVENT_MEDIA_PLAYER_SEEK_COMPLETE = 102;
    public static final int VIDEO_EVENT_MEDIA_PLAYER_ERROR = 103;
    public static final int VIDEO_EVENT_MEDIA_PLAYER_VIDEO_SIZE = 104;
    public static final int VIDEO_EVENT_MEDIA_PLAYER_ON_INFO = 105;

    private WeakReference<Activity> activityWeakReference;
    final String XR_VIDEO_PLAYER_EVENT_NAME = "xr-video-player:";
    //xr-event&handle&id&url&512&512&1
    final String XR_VIDEO_EVENT_TAG = "xr-event";

    HashMap<String, CocosXRVideoPlayer> xrVideoPlayerHashMap = new HashMap<>();
    HashMap<String, ArrayList<String>> cachedScriptEventHashMap = new HashMap<>();
    CocosXRVideoGLThread videoGLThread = null;
    boolean isPaused = false;
    public void onCreate(Activity activity) {
        activityWeakReference = new WeakReference<>(activity);
        for (int i = 0; i < MAX_COUNT; i++) {
            JsbBridgeWrapper.getInstance().addScriptEventListener(XR_VIDEO_PLAYER_EVENT_NAME + i, eventData -> {
                if(isPaused) {
                    return;
                }
                processVideoEvent(eventData);
            });
        }
        JsbBridgeWrapper.getInstance().addScriptEventListener(CocosXRPermissionHelper.XR_PERMISSION_EVENT_NAME, CocosXRPermissionHelper::onScriptEvent);

        CocosXRApi.getInstance().onCreate(activity);
    }

    public void onResume() {
        Log.d(TAG, "onResume");
        isPaused = false;
        if(videoGLThread != null) {
            videoGLThread.onResume();
        }
        Set<Map.Entry<String, ArrayList<String>>> entrySets = cachedScriptEventHashMap.entrySet();
        for (Map.Entry<String, ArrayList<String>> entrySet : entrySets) {
            if (entrySet.getKey() != null && entrySet.getValue() != null) {
                for (String data : entrySet.getValue()) {
                    Log.d(TAG, "onResume.dispatchEventToScript:" + entrySet.getKey() + ":" + data);
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(entrySet.getKey(), data);
                }
            }
        }
        cachedScriptEventHashMap.clear();
    }

    public void onPause() {
        Log.d(TAG, "onPause");
        isPaused = true;
        if(videoGLThread != null) {
            videoGLThread.onPause();
        }

        Set<Map.Entry<String, CocosXRVideoPlayer>> entrySets = xrVideoPlayerHashMap.entrySet();
        for (Map.Entry<String, CocosXRVideoPlayer> entrySet : entrySets) {
            if(entrySet.getValue() != null) {
                entrySet.getValue().pause();
            }
        }
    }

    public void sendVideoEvent(VideoEventData videoEventData, String... eventData) {
        sendVideoEvent(videoEventData.eventId, videoEventData.eventName, videoEventData.videoPlayerHandleKey, eventData);
    }

    public void sendVideoEvent(int eventId, String eventName, String videoPlayerHandleKey, String... eventData) {
        StringBuilder data = new StringBuilder("xr-event&" + eventId + "&" + eventName + '&' + videoPlayerHandleKey);
        if (eventData.length > 0) {
            for (String evtData : eventData) {
                data.append("&").append(evtData);
            }
        }

        if(videoGLThread == null) return;
        if(isPaused) {
            Log.e(TAG, "sendVideoEvent failed, because is paused !!! [" + data + "]");
            if (!cachedScriptEventHashMap.containsKey(eventName)) {
                cachedScriptEventHashMap.put(eventName, new ArrayList<>());
            }
            Objects.requireNonNull(cachedScriptEventHashMap.get(eventName)).add(data.toString());
            return;
        }
        JsbBridgeWrapper.getInstance().dispatchEventToScript(eventName, data.toString());
    }

    private void processVideoEvent(String eventData) {
        VideoEventData videoEventData = new VideoEventData(eventData);
        if (videoEventData.eventId == VIDEO_EVENT_PREPARE) {
            CocosXRVideoPlayer videoPlayer = xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey);
            if (videoPlayer == null) {
                videoPlayer = new CocosXRVideoPlayer(activityWeakReference, videoEventData.videoPlayerHandleKey, videoEventData.eventName);
                videoPlayer.prepare(videoEventData);
                xrVideoPlayerHashMap.put(videoEventData.videoPlayerHandleKey, videoPlayer);
            } else {
                videoPlayer.prepare(videoEventData);
            }

            if (videoGLThread == null) {
                videoGLThread = new CocosXRVideoGLThread();
                videoGLThread.start();
            }
        } else if (videoEventData.eventId == VIDEO_EVENT_PLAY) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).play();
        } else if (videoEventData.eventId == VIDEO_EVENT_PAUSE) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).pause();
        } else if (videoEventData.eventId == VIDEO_EVENT_STOP) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).stop();
        } else if (videoEventData.eventId == VIDEO_EVENT_RESET) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).reset();
        } else if (videoEventData.eventId == VIDEO_EVENT_DESTROY) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).release();
            videoGLThread.queueEvent(() -> {
                Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).onGLDestroy();
                xrVideoPlayerHashMap.remove(videoEventData.videoPlayerHandleKey);
            });
        } else if (videoEventData.eventId == VIDEO_EVENT_GET_POSITION) {
            int position = Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).getCurrentPosition();
            sendVideoEvent(videoEventData, String.valueOf(position));
        } else if (videoEventData.eventId == VIDEO_EVENT_GET_DURATION) {
            int duration = Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).getDuration();
            sendVideoEvent(videoEventData, String.valueOf(duration));
        } else if (videoEventData.eventId == VIDEO_EVENT_GET_IS_PALYING) {
            boolean isPlaying = Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).isPlaying();
            sendVideoEvent(videoEventData, String.valueOf(isPlaying));
        } else if (videoEventData.eventId == VIDEO_EVENT_GET_IS_LOOPING) {
            boolean isLooping = Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).isLooping();
            sendVideoEvent(videoEventData, String.valueOf(isLooping));
        } else if (videoEventData.eventId == VIDEO_EVENT_SET_LOOP) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).setLooping(videoEventData.isLoop);
        } else if (videoEventData.eventId == VIDEO_EVENT_SEEK_TO) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).seekTo(videoEventData.seekToMsec);
        } else if(videoEventData.eventId == VIDEO_EVENT_SET_VOLUME) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).setVolume(videoEventData.volume);
        } else if(videoEventData.eventId == VIDEO_EVENT_SET_TEXTURE_INFO) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).setTextureInfo(videoEventData.videoWidth, videoEventData.videoHeight, videoEventData.videoTextureId);
        } else if(videoEventData.eventId == VIDEO_EVENT_SET_SPEED) {
            Objects.requireNonNull(xrVideoPlayerHashMap.get(videoEventData.videoPlayerHandleKey)).setPlaybackSpeed(videoEventData.playbackSpeed);
        }
    }

    public void onDestroy() {
        Log.d(TAG, "onDestroy:" + xrVideoPlayerHashMap.size());
        CocosXRApi.getInstance().onDestroy();
        if(videoGLThread != null) {
            videoGLThread.onDestroy();
            videoGLThread = null;
        }
        for (int i = 0; i < MAX_COUNT; i++) {
            JsbBridgeWrapper.getInstance().removeAllListenersForEvent(XR_VIDEO_PLAYER_EVENT_NAME + i);
        }
        JsbBridgeWrapper.getInstance().removeAllListenersForEvent(CocosXRPermissionHelper.XR_PERMISSION_EVENT_NAME);
        Set<Map.Entry<String, CocosXRVideoPlayer>> entrySets = xrVideoPlayerHashMap.entrySet();
        for (Map.Entry<String, CocosXRVideoPlayer> entrySet : entrySets) {
            entrySet.getValue().release();
        }
        xrVideoPlayerHashMap.clear();
        cachedScriptEventHashMap.clear();
    }

    class CocosXRVideoGLThread extends Thread {
        private final ReentrantLock lockObj = new ReentrantLock(true);
        private final Condition pauseCondition = lockObj.newCondition();
        private boolean requestPaused = false;
        private boolean requestExited = false;
        long lastTickTime = System.nanoTime();
        private final ArrayList<Runnable> mEventQueue = new ArrayList<>();

        EGLContext eglContext;
        EGLDisplay eglDisplay;
        EGLSurface pBufferSurface;
        EGLContext parentContext;
        int renderTargetFboId;

        CocosXRVideoGLThread() {
            parentContext = EGL14.eglGetCurrentContext();
        }

        @Override
        public void run() {
            init();
            while (true) {
                lockObj.lock();
                try {
                    if (requestExited) {
                        break;
                    }

                    if (requestPaused) {
                        pauseCondition.await();
                    }

                    if (requestExited) {
                        break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lockObj.unlock();
                }

                synchronized (this) {
                    if (!mEventQueue.isEmpty()) {
                        Runnable event = mEventQueue.remove(0);
                        if (event != null) {
                            event.run();
                            continue;
                        }
                    }
                }

                tick();
            }

            exit();
        }

        void init() {
            eglDisplay = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY);
            int[] attrib_list = {EGL_CONTEXT_CLIENT_VERSION, 3, EGL14.EGL_NONE};
            int[] attrList = new int[] {EGL14.EGL_SURFACE_TYPE, EGL14.EGL_PBUFFER_BIT,
                EGL14.EGL_RENDERABLE_TYPE, 0x00000040,
                EGL14.EGL_RED_SIZE, 8,
                EGL14.EGL_GREEN_SIZE, 8,
                EGL14.EGL_BLUE_SIZE, 8,
                EGL14.EGL_DEPTH_SIZE, 8,
                EGL14.EGL_SAMPLE_BUFFERS, 1,
                EGL14.EGL_SAMPLES, 1,
                EGL14.EGL_STENCIL_SIZE, 0,
                EGL14.EGL_NONE};
            EGLConfig[] configOut = new EGLConfig[1];
            int[] configNumOut = new int[1];
            EGL14.eglChooseConfig(eglDisplay, attrList, 0, configOut, 0, 1,
                configNumOut, 0);
            eglContext = EGL14.eglCreateContext(eglDisplay, configOut[0], parentContext, attrib_list, 0);

            int[] sur_attrib_list = {EGL14.EGL_WIDTH, 1, EGL14.EGL_HEIGHT, 1, EGL14.EGL_NONE};
            pBufferSurface = EGL14.eglCreatePbufferSurface(eglDisplay, configOut[0], sur_attrib_list, 0);

            EGL14.eglMakeCurrent(eglDisplay, pBufferSurface, pBufferSurface, eglContext);
            GLES30.glDisable(GLES30.GL_DEPTH_TEST);
            GLES30.glDisable(GLES30.GL_BLEND);
            GLES30.glDisable(GLES30.GL_CULL_FACE);

            int[] tmpFboId = new int[1];
            GLES30.glGenFramebuffers(1, tmpFboId, 0);
            renderTargetFboId = tmpFboId[0];
            CocosXRGLHelper.checkGLError("fbo");

            lastTickTime = System.nanoTime();

            Set<Map.Entry<String, CocosXRVideoPlayer>> entrySets = xrVideoPlayerHashMap.entrySet();
            for (Map.Entry<String, CocosXRVideoPlayer> entrySet : entrySets) {
                entrySet.getValue().onGLReady();
            }
            Log.d(TAG, "CocosXRVideoGLThread init");
        }

        void tick() {
            // draw
            lastTickTime = System.nanoTime();
            Set<Map.Entry<String, CocosXRVideoPlayer>> entrySets = xrVideoPlayerHashMap.entrySet();
            for (Map.Entry<String, CocosXRVideoPlayer> entrySet : entrySets) {
                entrySet.getValue().onBeforeGLDrawFrame();
                if(entrySet.getValue().isStopped() || entrySet.getValue().getVideoTextureWidth() == 0 || entrySet.getValue().getVideoTextureHeight() == 0) {
                    continue;
                }
                GLES30.glBindFramebuffer(GLES30.GL_FRAMEBUFFER, renderTargetFboId);
                GLES30.glFramebufferTexture2D(GLES30.GL_FRAMEBUFFER, GLES30.GL_COLOR_ATTACHMENT0, GLES30.GL_TEXTURE_2D, entrySet.getValue().getTargetTextureId(), 0);
                int offsetX = (entrySet.getValue().getVideoTextureWidth() - entrySet.getValue().getVideoSourceWidth()) / 2;
                int offsetY = (entrySet.getValue().getVideoTextureHeight() - entrySet.getValue().getVideoSourceHeight()) / 2;
                GLES30.glViewport(offsetX, offsetY, entrySet.getValue().getVideoSourceWidth(), entrySet.getValue().getVideoSourceHeight());
                GLES30.glScissor(0, 0, entrySet.getValue().getVideoTextureWidth(), entrySet.getValue().getVideoTextureHeight());
                entrySet.getValue().onGLDrawFrame();
            }
            EGL14.eglSwapBuffers(eglDisplay, pBufferSurface);

            if (System.nanoTime() - lastTickTime < 16666666) {
                try {
                    long sleepTimeNS = 16666666 - (System.nanoTime() - lastTickTime);
                    Thread.sleep(sleepTimeNS / 1000000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        void exit() {
            Set<Map.Entry<String, CocosXRVideoPlayer>> entrySets = xrVideoPlayerHashMap.entrySet();
            for (Map.Entry<String, CocosXRVideoPlayer> entrySet : entrySets) {
                entrySet.getValue().onGLDestroy();
            }
            GLES30.glDeleteFramebuffers(1, new int[] {renderTargetFboId}, 0);
            EGL14.eglMakeCurrent(eglDisplay, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_CONTEXT);
            EGL14.eglDestroySurface(eglDisplay, pBufferSurface);
            EGL14.eglDestroyContext(eglDisplay, eglContext);
            Log.d(TAG, "CocosXRVideoGLThread exit");
        }

        public void onPause() {
            lockObj.lock();
            requestPaused = true;
            lockObj.unlock();
            Log.d(TAG, "CocosXRVideoGLThread onPause");
        }

        public void onResume() {
            lockObj.lock();
            requestPaused = false;
            pauseCondition.signalAll();
            lockObj.unlock();
            Log.d(TAG, "CocosXRVideoGLThread onResume");
        }

        public void onDestroy() {
            lockObj.lock();
            requestExited = true;
            pauseCondition.signalAll();
            lockObj.unlock();

            try {
                videoGLThread.join();
            } catch (Exception e) {
                e.printStackTrace();
                Log.e(TAG, e.getLocalizedMessage());
            }
            Log.d(TAG, "CocosXRVideoGLThread onDestroy");
        }

        public void queueEvent(Runnable r) {
            synchronized (this) {
                mEventQueue.add(r);
            }
        }
    }
}
