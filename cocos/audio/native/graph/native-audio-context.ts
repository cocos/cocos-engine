declare const jsb: any;

jsb.AudioContext.prototype.decodeAudioData = function (url: string): Promise<AudioBuffer> {
    return new Promise<AudioBuffer>((resolve, reject) => {
        this.decodeAudioDataFromUrl(url, (buffer: AudioBuffer) => {
            if (buffer) {
                resolve(buffer);
            } else {
                reject();
            }
        });
    });
};

jsb.SourceNode.prototype.onEnded = function (callback: ()=>void) {
    this.setOnEnded(callback);
};
export const SourceNode = jsb.SourceNode;
export const AudioContext = jsb.AudioContext;
export const AudioNode = jsb.AudioNode;
export const AudioBuffer = jsb.AudioBuffer;
export const AudioDestinationNode = jsb.AudioDestinationNode;
export const GainNode = jsb.GainNode;
export const StereoPannerNode = jsb.StereoPannerNode;
export const nativeDefaultContext = new jsb.AudioContext();
