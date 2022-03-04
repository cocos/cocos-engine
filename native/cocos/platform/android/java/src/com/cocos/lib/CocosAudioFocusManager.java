/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

package com.cocos.lib;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.util.Log;

class CocosAudioFocusManager {

    private static final String _TAG = "CocosAudioFocusManager";
    private static boolean isAudioFocusLost = true;

    private final static AudioManager.OnAudioFocusChangeListener sAfChangeListener = focusChange -> {
        Log.d(_TAG, "onAudioFocusChange: " + focusChange + ", thread: " + Thread.currentThread().getName());

        if (focusChange == AudioManager.AUDIOFOCUS_LOSS) {
            // Permanent loss of audio focus
            // Pause playback immediately
            Log.d(_TAG, "Pause music by AUDIOFOCUS_LOSS");
            isAudioFocusLost = true;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(0));
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
            // Pause playback
            Log.d(_TAG, "Pause music by AUDIOFOCUS_LOSS_TRANSILENT");
            isAudioFocusLost = true;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(0));
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK) {
            // Lower the volume, keep playing
            Log.d(_TAG, "Lower the volume, keep playing by AUDIOFOCUS_LOSS_TRANSILENT_CAN_DUCK");
            isAudioFocusLost = false;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(0.1f));
        } else if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {
            // Your app has been granted audio focus again
            // Raise volume to normal, restart playback if necessary
            Log.d(_TAG, "Resume music by AUDIOFOCUS_GAIN");
            isAudioFocusLost = false;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(1.0f));
        }
    };

    static void registerAudioFocusListener(Context context) {
        AudioManager am = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        assert am != null;
        int result;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            AudioAttributes playbackAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_GAME)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build();

            // set the playback attributes for the focus requester
            AudioFocusRequest focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                .setAudioAttributes(playbackAttributes)
                .setWillPauseWhenDucked(true)
                .setOnAudioFocusChangeListener(sAfChangeListener)
                .build();

            result = am.requestAudioFocus(focusRequest);
        } else {
            // Request audio focus for playback
            result = am.requestAudioFocus(sAfChangeListener,
                // Use the music stream.
                AudioManager.STREAM_MUSIC,
                // Request permanent focus.
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK);
        }

        if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
            Log.d(_TAG, "requestAudioFocus succeed");
            isAudioFocusLost = false;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(1.0f));
            return;
        }

        Log.e(_TAG, "requestAudioFocus failed!");
    }

    static void unregisterAudioFocusListener(Context context) {
        AudioManager am = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        assert am != null;
        int result = am.abandonAudioFocus(sAfChangeListener);
        if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
            Log.d(_TAG, "abandonAudioFocus succeed!");
        } else {
            Log.e(_TAG, "abandonAudioFocus failed!");
        }
    }

    static boolean isAudioFocusLoss() {
        return isAudioFocusLost;
    }

    private static native void nativeSetAudioVolumeFactor(float focus);
}
