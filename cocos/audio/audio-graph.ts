import { CCAudioContext, AudioContextOptions, audioBufferManager } from 'pal/audio';

import { AudioFormat, AudioInfo } from './type';

enum AudioBackend {
    INNERCTX,
    DOM,
    WEBAUDIO,
    NATIVE
}
class AudioContextManager {
    public defaultContext: CCAudioContext;
    public createAudioContext (backend: AudioBackend, options?: AudioContextOptions): CCAudioContext {
        return new CCAudioContext(options);
    }
    public load (url: string, ctx?: CCAudioContext):Promise<AudioInfo> {
        return new Promise<AudioInfo>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            audioBufferManager.loadBuffer(url, ctx || this.defaultContext).then((buffer) => {
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
        this.defaultContext = new CCAudioContext();
    }
}
export const audioContextManager = new AudioContextManager();
