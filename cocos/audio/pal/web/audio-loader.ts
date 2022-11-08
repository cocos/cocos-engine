import { audioBufferManager } from '../../impl/graph-based/audio-buffer-manager';
import { AudioFormat, AudioInfo } from '../../type';
import { domAudioPool } from '../../impl/dom/audio-pool-dom';

class AudioLoader {
    load (url: string): Promise<AudioInfo> {
        return new Promise((resolve, reject) => {
            audioBufferManager.loadBuffer(url).then((buffer) => {
                resolve({
                    duration: buffer.duration,
                    pcmHeader: {
                        totalFrames: buffer.length,
                        sampleRate: buffer.sampleRate,
                        bytesPerFrame: buffer.numberOfChannels * 4/*Float32*/,
                        audioFormat: AudioFormat.FLOAT_32,
                        channelCount: buffer.numberOfChannels,
                    },
                });
            }).catch(() => {
                console.error(`small audio buffer load failed.`);
                reject();
            });
        });
    }
}
export const audioLoader: AudioLoader = new AudioLoader();
