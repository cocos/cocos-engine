import AudioNode from "./AudioNode";

class MediaElementAudioSourceNode extends AudioNode {
    /**
     * @param context {AudioContext}
     * @param options mediaElement: An HTMLMediaElement that will be used as the source for the audio.
     * @example
     var ac = new AudioContext();
     var mediaElement = document.createElement('audio');

     var options = {
        mediaElement : mediaElement
     };

     var myAudioSource = new MediaElementAudioSourceNode(ac, options);
     */
    constructor(context, options) {
        super(context);


    }

}

export default MediaElementAudioSourceNode;