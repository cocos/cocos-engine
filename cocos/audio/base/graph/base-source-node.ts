import { CCAudioBuffer } from './base-audio-buffer';
import { CCAudioNode } from './base-audio-node';

export interface CCSourceNode extends CCAudioNode{
    readonly isReady: boolean;
    buffer: CCAudioBuffer

    // For most of time, we can set the volume directly from here.
    volume: number;
    loop: boolean;
    currentTime: number;
    playbackRate: number;

    // Offset is the number of second, should sync with absn
    start (time?: number);

    pause ();
    stop ()
    onEnded (callback: ()=>void);
    // Reset source node time when the audio is finish playing
    _onEnded ();
    _onExternalEnded: (() => void) | undefined;
}
