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
import android.media.AudioManager;
import android.media.SoundPool;
import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

public class Cocos2dxSound {
    // ===========================================================
    // Constants
    // ===========================================================

    private static final String TAG = "Cocos2dxSound";

    // ===========================================================
    // Fields
    // ===========================================================

    private final Context mContext;
    private SoundPool mSoundPool;
    private float mLeftVolume;
    private float mRightVolume;

    // sound path and stream ids map
    // a file may be played many times at the same time
    // so there is an array map to a file path
    private final HashMap<String, ArrayList<Integer>> mPathStreamIDsMap = new HashMap<String, ArrayList<Integer>>();

    private final HashMap<String, Integer> mPathSoundIDMap = new HashMap<String, Integer>();

    private ConcurrentHashMap<Integer, SoundInfoForLoadedCompleted>  mPlayWhenLoadedEffects =
            new ConcurrentHashMap<Integer, SoundInfoForLoadedCompleted>();

    private static final int MAX_SIMULTANEOUS_STREAMS_DEFAULT = 5;
    private static final int MAX_SIMULTANEOUS_STREAMS_I9100 = 3;
    private static final float SOUND_RATE = 1.0f;
    private static final int SOUND_PRIORITY = 1;
    private static final int SOUND_QUALITY = 5;

    private final static int INVALID_SOUND_ID = -1;
    // ===========================================================
    // Constructors
    // ===========================================================

    public Cocos2dxSound(final Context context) {
        mContext = context;

        initData();
    }

    private void initData() {
        if (Cocos2dxHelper.getDeviceModel().contains("GT-I9100")) {
            mSoundPool = new SoundPool(Cocos2dxSound.MAX_SIMULTANEOUS_STREAMS_I9100, AudioManager.STREAM_MUSIC, Cocos2dxSound.SOUND_QUALITY);
        }
        else {
            mSoundPool = new SoundPool(Cocos2dxSound.MAX_SIMULTANEOUS_STREAMS_DEFAULT, AudioManager.STREAM_MUSIC, Cocos2dxSound.SOUND_QUALITY);
        }

        mSoundPool.setOnLoadCompleteListener(new OnLoadCompletedListener());

        mLeftVolume = 0.5f;
        mRightVolume = 0.5f;
    }

    public int preloadEffect(final String path) {
        Integer soundID = mPathSoundIDMap.get(path);

        if (soundID == null) {
            soundID = createSoundIDFromAsset(path);
            // save value just in case if file is really loaded
            if (soundID != Cocos2dxSound.INVALID_SOUND_ID) {
                mPathSoundIDMap.put(path, soundID);
            }
        }

        return soundID;
    }

    public void unloadEffect(final String path) {
        // stop effects
        final ArrayList<Integer> streamIDs = mPathStreamIDsMap.get(path);
        if (streamIDs != null) {
            for (final Integer steamID : streamIDs) {
                mSoundPool.stop(steamID);
            }
        }
        mPathStreamIDsMap.remove(path);

        // unload effect
        final Integer soundID = mPathSoundIDMap.get(path);
        if(soundID != null){
            mSoundPool.unload(soundID);
            mPathSoundIDMap.remove(path);
        }
    }

    private static final int LOAD_TIME_OUT = 500;

    public int playEffect(final String path, final boolean loop, float pitch, float pan, float gain)
    {
        int streamID;

        Integer soundID = mPathSoundIDMap.get(path);
        if (soundID != null) {
            // parameters; pan = -1 for left channel, 1 for right channel, 0 for both channels

            // play sound
            streamID = doPlayEffect(path, soundID, loop, pitch, pan, gain);
        } else {
            // the effect is not prepared
            soundID = preloadEffect(path);
            if (soundID == Cocos2dxSound.INVALID_SOUND_ID) {
                // can not preload effect
                return Cocos2dxSound.INVALID_SOUND_ID;
            }

            SoundInfoForLoadedCompleted info = new SoundInfoForLoadedCompleted(path, loop, pitch, pan, gain);
            mPlayWhenLoadedEffects.putIfAbsent(soundID, info);

            synchronized(info) {
                try {
                    info.wait(LOAD_TIME_OUT);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
            streamID = info.effectID;
            mPlayWhenLoadedEffects.remove(soundID);
        }

        return streamID;
    }

    public void stopEffect(final int steamID) {
        mSoundPool.stop(steamID);

        // remove record
        for (final String path : mPathStreamIDsMap.keySet()) {
            if (mPathStreamIDsMap.get(path).contains(steamID)) {
                mPathStreamIDsMap.get(path).remove(mPathStreamIDsMap.get(path).indexOf(steamID));
                break;
            }
        }
    }

    public void pauseEffect(final int steamID) {
        mSoundPool.pause(steamID);
    }

    public void resumeEffect(final int steamID) {
        mSoundPool.resume(steamID);
    }

    public void pauseAllEffects() {
        if (!mPathStreamIDsMap.isEmpty()) {
            final Iterator<Entry<String, ArrayList<Integer>>> iter = mPathStreamIDsMap.entrySet().iterator();
            while (iter.hasNext()) {
                final Entry<String, ArrayList<Integer>> entry = iter.next();
                for (final int steamID : entry.getValue()) {
                    mSoundPool.pause(steamID);
                }
            }
        }
    }

    public void resumeAllEffects() {
        // can not only invoke SoundPool.autoResume() here, because
        // it only resumes all effects paused by pauseAllEffects()
        if (!mPathStreamIDsMap.isEmpty()) {
            final Iterator<Entry<String, ArrayList<Integer>>> iter = mPathStreamIDsMap.entrySet().iterator();
            while (iter.hasNext()) {
                final Entry<String, ArrayList<Integer>> entry = iter.next();
                for (final int steamID : entry.getValue()) {
                    mSoundPool.resume(steamID);
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    public void stopAllEffects() {
        // stop effects
        if (!mPathStreamIDsMap.isEmpty()) {
            final Iterator<?> iter = mPathStreamIDsMap.entrySet().iterator();
            while (iter.hasNext()) {
                final Map.Entry<String, ArrayList<Integer>> entry = (Map.Entry<String, ArrayList<Integer>>) iter.next();
                for (final int steamID : entry.getValue()) {
                    mSoundPool.stop(steamID);
                }
            }
        }

        // remove records
        mPathStreamIDsMap.clear();
    }

    public float getEffectsVolume() {
        return (mLeftVolume + mRightVolume) / 2;
    }

    public void setEffectsVolume(float volume) {
        // volume should be in [0, 1.0]
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 1) {
            volume = 1;
        }

        mLeftVolume = mRightVolume = volume;

        // change the volume of playing sounds
        if (!mPathStreamIDsMap.isEmpty()) {
            final Iterator<Entry<String, ArrayList<Integer>>> iter = mPathStreamIDsMap.entrySet().iterator();
            while (iter.hasNext()) {
                final Entry<String, ArrayList<Integer>> entry = iter.next();
                for (final int steamID : entry.getValue()) {
                    mSoundPool.setVolume(steamID, mLeftVolume, mRightVolume);
                }
            }
        }
    }

    public void end() {
        mSoundPool.release();
        mPathStreamIDsMap.clear();
        mPathSoundIDMap.clear();
        mPlayWhenLoadedEffects.clear();

        mLeftVolume = 0.5f;
        mRightVolume = 0.5f;

        initData();
    }

    public int createSoundIDFromAsset(final String path) {
        int soundID;

        try {
            if (path.startsWith("/")) {
                soundID = mSoundPool.load(path, 0);
            } else {
                soundID = mSoundPool.load(mContext.getAssets().openFd(path), 0);
            }
        } catch (final Exception e) {
            soundID = Cocos2dxSound.INVALID_SOUND_ID;
            Log.e(Cocos2dxSound.TAG, "error: " + e.getMessage(), e);
        }

        // mSoundPool.load returns 0 if something goes wrong, for example a file does not exist
        if (soundID == 0) {
            soundID = Cocos2dxSound.INVALID_SOUND_ID;
        }

        return soundID;
    }

        private float clamp(float value, float min, float max) {
            return Math.max(min, (Math.min(value, max)));
        }

    private int doPlayEffect(final String path, final int soundId, final boolean loop, float pitch, float pan, float gain) {
        float leftVolume = mLeftVolume * gain * (1.0f - clamp(pan, 0.0f, 1.0f));
        float rightVolume = mRightVolume * gain * (1.0f - clamp(-pan, 0.0f, 1.0f));
        float soundRate = clamp(SOUND_RATE * pitch, 0.5f, 2.0f);

        // play sound
        int streamID = mSoundPool.play(soundId, clamp(leftVolume, 0.0f, 1.0f), clamp(rightVolume, 0.0f, 1.0f), Cocos2dxSound.SOUND_PRIORITY, loop ? -1 : 0, soundRate);

        // record stream id
        ArrayList<Integer> streamIDs = mPathStreamIDsMap.get(path);
        if (streamIDs == null) {
            streamIDs = new ArrayList<Integer>();
            mPathStreamIDsMap.put(path, streamIDs);
        }
        streamIDs.add(streamID);

        return streamID;
    }

    public void onEnterBackground(){
        mSoundPool.autoPause();
    }

    public void onEnterForeground(){
        mSoundPool.autoResume();
    }

    // ===========================================================
    // Inner and Anonymous Classes
    // ===========================================================

    public class SoundInfoForLoadedCompleted {
        public boolean isLoop;
        public float pitch;
        public float pan;
        public float gain;
        public String path;
        public int effectID;

        public SoundInfoForLoadedCompleted(String path, boolean isLoop, float pitch, float pan, float gain) {
            this.path = path;
            this.isLoop = isLoop;
            this.pitch = pitch;
            this.pan = pan;
            this.gain = gain;
            effectID = Cocos2dxSound.INVALID_SOUND_ID;
        }
    }

    public class OnLoadCompletedListener implements SoundPool.OnLoadCompleteListener {

        @Override
        public void onLoadComplete(SoundPool soundPool, int sampleId, int status) {
            if (status == 0)
            {
                SoundInfoForLoadedCompleted info =  mPlayWhenLoadedEffects.get(sampleId);
                if (info != null) {
                    info.effectID = doPlayEffect(info.path, sampleId, info.isLoop, info.pitch, info.pan, info.gain);
                    synchronized (info) {
                        info.notifyAll();
                    }
                }
            }
        }
    }
}

