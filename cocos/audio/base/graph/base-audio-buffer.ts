export interface CCAudioBuffer {
    readonly sampleRate: number;
    readonly length: number;
    readonly duration: number;
    readonly numberOfChannels: number;
    copyFromChannel(destination: Float32Array, channelNumber: number, bufferOffset?: number): void;
    copyToChannel(source: Float32Array, channelNumber: number, bufferOffset?: number): void;
    getChannelData(channel: number): Float32Array;
}
