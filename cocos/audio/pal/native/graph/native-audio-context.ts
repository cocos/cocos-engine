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
export type CCSourceNode = jsb.SourceNode;
export type CCAudioContext = jsb.AudioContext;
export type CCAudioNode = jsb.AudioNode;
export type CCAudioBuffer = jsb.AudioBuffer;
export type CCDestinationNode = jsb.AudioDestinationNode;
export type CCGainNode = jsb.GainNode;
export type CCStereoPannerNode = jsb.StereoPannerNode;
