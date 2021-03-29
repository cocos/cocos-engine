export enum AudioEvent {
    PLAYED = 'play',
    PAUSED = 'pause',
    STOPPED = 'stop',
    SEEKED = 'seeked',
    ENDED = 'ended',
    INTERRUPTION_BEGIN = 'interruptionBegin',
    INTERRUPTION_END = 'interruptionEnd',
    USER_GESTURE = 'on_gesture',  // only web needed
}

export enum AudioType {
    DOM_AUDIO,
    WEB_AUDIO,
    MINIGAME_AUDIO,
    NATIVE_AUDIO,
    UNKNOWN_AUDIO,
}

export interface AudioLoadOptions {
    audioLoadMode?: AudioType,
}

export enum AudioState {
    INIT,
    PLAYING,
    PAUSED,
    STOPPED,
    INTERRUPTED,
}
