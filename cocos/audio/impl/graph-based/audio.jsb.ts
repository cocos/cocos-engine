declare const jsb: any;
export const SourceNode = jsb.SourceNode;

export const AudioBuffer = jsb.AudioBuffer;
export const AudioParam = jsb.AudioParam;
export const GainNode = jsb.GainNode;
export const StereoPannerNode = jsb.StereoPannerNode;
export const AudioDestinationNode = jsb.AudioDestinationNode;

jsb.AudioContext.prototype.decodeAudioDataFromUrl = function(url: string): Promise<AudioBuffer> {
        return new Promise<AudioBuffer>((resolve, reject) => {
            this.decodeAudioData(url, (buffer: AudioBuffer) => {
                if (buffer) {
                    resolve(buffer);
                } else {
                    reject();
                }
            })
        });
}
export const AudioContext = jsb.AudioContext;
export const defaultContext = new AudioContext();

