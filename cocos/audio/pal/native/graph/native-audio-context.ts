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
export const CCSourceNode = jsb.SourceNode;
export const CCAudioContext = jsb.AudioContext;
export const CCAudioNode = jsb.AudioNode;
export const CCAudioBuffer = jsb.AudioBuffer;
export const CCAudioDestinationNode = jsb.AudioDestinationNode;
export const CCGainNode = jsb.GainNode;
export const CCStereoPannerNode = jsb.StereoPannerNode;
export const nativeDefaultContext = new CCAudioContext();
