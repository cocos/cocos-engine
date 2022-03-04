package com.cocos.lib;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.util.Log;

class CocosAudioFocusManager {

    private static final String _TAG = "CocosAudioFocusManager";
    private static boolean bLossAudioFocus = true;

    private final static AudioManager.OnAudioFocusChangeListener sAfChangeListener = focusChange -> {
        Log.d(_TAG, "onAudioFocusChange: " + focusChange + ", thread: " + Thread.currentThread().getName());

        if (focusChange == AudioManager.AUDIOFOCUS_LOSS) {
            // Permanent loss of audio focus
            // Pause playback immediately
            Log.d(_TAG, "Pause music by AUDIOFOCUS_LOSS");
            bLossAudioFocus = true;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(0));
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
            // Pause playback
            Log.d(_TAG, "Pause music by AUDIOFOCUS_LOSS_TRANSILENT");
            bLossAudioFocus = true;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(0));
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK) {
            // Lower the volume, keep playing
            Log.d(_TAG, "Lower the volume, keep playing by AUDIOFOCUS_LOSS_TRANSILENT_CAN_DUCK");
            bLossAudioFocus = false;
            CocosHelper.runOnGameThreadAtForeground(() -> nativeSetAudioVolumeFactor(0.1f));
        } else if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {
            // Your app has been granted audio focus again
            // Raise volume to normal, restart playback if necessary
            Log.d(_TAG, "Resume music by AUDIOFOCUS_GAIN");
            bLossAudioFocus = false;
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
            bLossAudioFocus = false;
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
        return bLossAudioFocus;
    }

    private static native void nativeSetAudioVolumeFactor(float focus);
}
