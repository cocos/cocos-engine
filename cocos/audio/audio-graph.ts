import { HTML5, MINIGAME, NATIVE } from 'internal:constants';
import { CCAudioContext, AudioContextOptions } from './base';
import { DomAudioContext } from './dom';
import { defaultInnerContext, InnerctxAudioContext } from './innerctx';
import { AudioFormat, AudioInfo } from './type';
import { WAAudioContext, waDefaultContext } from './webaudio';
import { waAudioBufferManager } from './webaudio/graph/audio-buffer-manager';

export const audioBufferManager = waAudioBufferManager;
enum AudioBackend {
    INNERCTX,
    DOM,
    WEBAUDIO,
    NATIVE
}
class AudioContextManager {
    public defaultContext: CCAudioContext;
    public createAudioContext (backend: AudioBackend, options?: AudioContextOptions): CCAudioContext {
        if (MINIGAME) {
            return new InnerctxAudioContext(options);
        }
        switch (backend) {
        case AudioBackend.DOM:
            return new DomAudioContext(options);

        case AudioBackend.WEBAUDIO:
        default:
            return new WAAudioContext(options);// return new window.AudioContext()
        }
    }
    public load (url: string):Promise<AudioInfo> {
        return new Promise<AudioInfo>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            audioBufferManager.loadBuffer(url).then((buffer) => {
                resolve({
                    duration: buffer.duration,
                    pcmHeader: {
                        totalFrames: buffer.length,
                        sampleRate: buffer.sampleRate,
                        bytesPerFrame: buffer.numberOfChannels * 2,
                        audioFormat: AudioFormat.FLOAT_32,
                        channelCount: buffer.numberOfChannels,
                    } });
            }).catch(() => {
                reject();
            });
        });
    }
    constructor () {
        this.defaultContext = waDefaultContext;
    }
}
export const audioContextManager = new AudioContextManager();
