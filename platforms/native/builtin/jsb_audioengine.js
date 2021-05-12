(function (jsb) {

if (!jsb || !jsb.AudioEngine)
    return

jsb.AudioEngine.AudioState = {
    ERROR: -1,
    INITIALZING: 0,
    PLAYING: 1,
    PAUSED: 2,
    STOPPED: 3,
}

jsb.AudioEngine.INVALID_AUDIO_ID = -1
jsb.AudioEngine.TIME_UNKNOWN = -1

// Adapt to normal runtime based API
jsb.AudioEngine.play = jsb.AudioEngine.play2d;
jsb.AudioEngine.setErrorCallback = () => {};

})(jsb)
