import Audio from "./Audio"
import AudioContext from "./audioContext/AudioContext"
import DeviceMotionEvent from "./DeviceMotionEvent"
import Document from "./Document"
import Event from "./Event"
import FontFace from "./FontFace"
import FontFaceSet from "./FontFaceSet"
import EventTarget from "./EventTarget"
import HTMLElement from './HTMLElement'
import HTMLAudioElement from "./HTMLAudioElement"
import HTMLCanvasElement from "./HTMLCanvasElement"
import HTMLImageElement from "./HTMLImageElement"
import Image from "./Image"
import Location from "./Location"
import Navigator from "./Navigator"
import Screen from "./Screen"
import TouchEvent from "./TouchEvent"
import XMLHttpRequest from "./XMLHttpRequest"

window.jsb = window.jsb || {};

// properties
window.clientTop = 0;
window.clientLeft = 0;
window.devicePixelRatio = jsb.pixelRatio;
window.document = new Document();
window.frameElement = null;
window.fullScreen = true;
window.innerHeight = jsb.height;
window.innerWidth = jsb.width;
window.length = 0;
window.location = new Location();
window.name = "runtime";
window.navigator = new Navigator(jsb.platform, jsb.language);
window.outerHeight = jsb.height;
window.outerWidth = jsb.width;
window.pageXOffset = 0;
window.pageYOffset = 0;
window.parent = window;
window.screen = new Screen();
window.screenLeft = 0;
window.screenTop = 0;
window.screenX = 0;
window.screenY = 0;
window.scrollX = 0;
window.scrollY = 0;
window.self = window;
window.top = window;
window.window = window;

// methods
window.alert = window.console.error;
const {btoa, atob} = require('./lib/base64.min.js');
window.atob = atob;
window.btoa = btoa;
window.close = function () {
    console.warn("window.close() is deprecated!");
};
window.print = window.console.log;
window.addEventListener = EventTarget.prototype.addEventListener;
window.removeEventListener = EventTarget.prototype.removeEventListener;
let _dispatchEvent = EventTarget.prototype.dispatchEvent;
window.dispatchEvent = function (event) {
    /*
        当该事件是可取消的(cancelable为true)并且至少一个该事件的 事件处理方法 调用了Event.preventDefault()，
        则返回值为false；否则返回true。
     */
    if (window.document.dispatchEvent(event)) {
        return _dispatchEvent.apply(this || window, arguments);
    }
    return false;
};

window.getComputedStyle = function () {
    return {
        position: 'absolute',
        left: '0px',
        top: '0px',
        height: '0px',
        paddingLeft: 0
    };
};

jsb.onWindowResize(function (width, height) {
    window.innerWidth = width;
    window.innerHeight = height;
    window.outerWidth = window.innerWidth;
    window.outerHeight = window.innerHeight;
    window.screen.availWidth = window.innerWidth;
    window.screen.availHeight = window.innerHeight;
    window.screen.width = window.innerWidth;
    window.screen.height = window.innerHeight;

    // 派发 resize 事件.
    let event = new Event("resize");
    window.dispatchEvent(event);
});
window.stop = function () {
    console.warn("window.stop() not implemented");
};

// class
window.Audio = Audio;
window.AudioContext = AudioContext;
window.DeviceMotionEvent = DeviceMotionEvent;
window.Event = Event;
window.FontFace = FontFace;
window.FontFaceSet = FontFaceSet;
window.HTMLElement = HTMLElement;
window.HTMLAudioElement = HTMLAudioElement;
window.HTMLCanvasElement = HTMLCanvasElement;
window.HTMLImageElement = HTMLImageElement;
window.Image = Image;
window.TouchEvent = TouchEvent;
window.XMLHttpRequest = XMLHttpRequest;
if (!window.Blob || !window.URL) {
    const {Blob, URL} = require('./Blob.js');
    window.Blob = Blob;
    window.URL = URL;
}
if (!window.DOMParser) {
    window.DOMParser = require('./xmldom/dom-parser.js').DOMParser;
}