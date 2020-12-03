import HTMLMediaElement from './HTMLMediaElement';

export default class HTMLVideoElement extends HTMLMediaElement {
    constructor() {
        super('VIDEO')
    }

    canPlayType(type) {
        return type === 'video/mp4';
    }
}