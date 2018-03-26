const HTMLElement = require('./HTMLElement');
const ImageData = require('./ImageData');

class CanvasGradient {
    constructor() {
        console.log("==> CanvasGradient constructor");
    }

    addColorStop(offset, color) {
        console.log("==> CanvasGradient addColorStop");
    }
}

class TextMetrics {
    constructor(width) {
        this._width = width;
    }

    get width() {
        return this._width;
    }
}

// class CanvasRenderingContext2D {
//     constructor() {
//         console.log("==> CanvasRenderingContext2D constructor");

//         // Line styles
//         this.lineWidth = 1;
//         this.lineCap = 'butt';
//         this.lineJoin = 'miter';
//         this.miterLimit = 10;
//         this.lineDashOffset = 0;

//         // Text styles
//         this.font = '10px sans-serif';
//         this.textAlign = 'start';
//         this.textBaseline = 'alphabetic';

//         // Fill and stroke styles
//         this.fillStyle = '#000';
//         this.strokeStyle = '#000';

//         // Shadows
//         this.shadowBlur = 0;
//         this.shadowColor = 'black';
//         this.shadowOffsetX = 0;
//         this.shadowOffsetY = 0;

//         // Compositing
//         this.globalAlpha = 1;
//         this.globalCompositeOperation = 'source-over';

//     }

//     clearRect(x, y, width, height) {
//         console.log(`==> CanvasRenderingContext2D clearRect: [${x}, ${y}, ${width}, ${height}]`);
//     }

//     fillRect(x, y, width, height) {
//         console.log(`==> CanvasRenderingContext2D fillRect: [${x}, ${y}, ${width}, ${height}]`);
//     }

//     strokeRect(x, y, width, height) {
//         console.log(`==> CanvasRenderingContext2D strokeRect: [${x}, ${y}, ${width}, ${height}]`);
//     }

//     getLineDash() {
//         return [];
//     }

//     setLineDash(segments) {

//     }

//     drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
//         console.log("==> CanvasRenderingContext2D drawImage");
//     }

//     getImageData(sx, sy, sw, sh) {
//         console.log(`==> CanvasRenderingContext2D getImageData(${sx}, ${sy}, ${sw}, ${sh})`);
//         let data = new Uint8ClampedArray(sw * sh * 4);
//         for (let i = 0; i < data.length; ++i) {
//             data[i] = Math.floor(Math.random() * 255);
//         }
//         return {
//             width: sw,
//             height: sh,
//             data: data
//         };
//     }

//     fillText(text, x, y, maxWidth) {
//         console.log("==> CanvasRenderingContext2D fillText: " + text 
//             + ', font: ' + this.font + ', textAlign: ' + this.textAlign
//             + ', textBaseline: ' + this.textBaseline);
//     }

//     strokeText(text, x, y, maxWidth) {
//         console.log("==> CanvasRenderingContext2D strokeText" + text 
//             + ', font: ' + this.font + ', textAlign: ' + this.textAlign
//             + ', textBaseline: ' + this.textBaseline);
//     }

//     measureText(text) {
//         console.log("==> CanvasRenderingContext2D measureText: " + text 
//             + ', font: ' + this.font + ', textAlign: ' + this.textAlign
//             + ', textBaseline: ' + this.textBaseline);
//         if (text === '') {
//             new Error("measureText empty");
//         }
//         return new TextMetrics(100);
//     }

//     // Gradients and patterns
//     createLinearGradient(x0, y0, x1, y1) {
//         console.log("==> CanvasRenderingContext2D createLinearGradient");
//         return new CanvasGradient();
//     }

//     createRadialGradient(x0, y0, r0, x1, y1, r1) {
//         return null;
//     }

//     createPattern(image, repetition) {
//         return null;
//     }

//     save() {
//         console.log("==> CanvasRenderingContext2D save");
//     }

//     // Paths
//     beginPath() {
//         console.log("==> CanvasRenderingContext2D beginPath");
//     }

//     closePath() {

//     }

//     moveTo() {
//         console.log("==> CanvasRenderingContext2D moveTo");
//     }

//     lineTo() {
//         console.log("==> CanvasRenderingContext2D lineTo");
//     }

//     bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {

//     }

//     quadraticCurveTo(cpx, cpy, x, y) {

//     }

//     arc(x, y, radius, startAngle, endAngle, anticlockwise) {

//     }

//     rect(x, y, width, height) {

//     }

//     // Drawing paths
//     stroke() {
//         console.log("==> CanvasRenderingContext2D stroke");
//     }

//     /*
//     void ctx.fill([fillRule]);
//     void ctx.fill(path[, fillRule]);
//     */
//     fill() {

//     }

//     restore() {

//     }
// }

const __listenTouchEventCanvasMap = {};

class HTMLCanvasElement extends HTMLElement {
    constructor(width, height) {
        super('canvas')

        this.id = 'glcanvas';
        this.type = 'canvas';

        this.top = 0;
        this.left = 0;
        this._width = width ? width : window.innerWidth;
        this._height = height ? height : window.innerHeight;
        this._context2D = null;
        this._data = null;
    }

    //TODO: implement opts.
    getContext(name, opts) {
        var self = this;
        console.log(`==> Canvas getContext(${name})`);
        if (name === 'webgl' || name === 'experimental-webgl') {
            return window.gl;
        } else if (name === '2d') {
            if (!this._context2D) {
                this._context2D = new CanvasRenderingContext2D(this._width, this._height);
                this._context2D._canvas = this;
                this._context2D.setCanvasBufferUpdatedCallback(function(data) {
                    console.log('setCanvasBufferUpdatedCallback: dataLen: ' + data.length);
                    self._data = new ImageData(data, self._width, self._height);
                });
            }
            return this._context2D;
        }

        return null;
    }

    toDataURL() {
        console.log("==> Canvas toDataURL");
        return "";
    }

    set width(width) {
        console.log(`==> HTMLCanvasElement.width = ${width}`);
        if (this._width !== width) {
            this._width = width;
            if (this._context2D) {
                this._context2D._width = width;
            }
        }
    }

    get width() {
        return this._width;
    }

    set height(height) {
        console.log(`==> HTMLCanvasElement.height = ${height}`);
        if (this._height !== height) {
            this._height = height;
            if (this._context2D) {
                this._context2D._height = height;
            }
        }
    }

    get height() {
        return this._height;
    }

    addEventListener(eventName, listener, options) {
        let ret = super.addEventListener(eventName, listener, options);
        if (ret) {
            if (eventName === 'touchstart') {
                __listenTouchEventCanvasMap[this._index] = this;
            }
        }

        return ret;
    }

    removeEventListener(eventName, listener, options) {
        let ret = super.removeEventListener(eventName, listener, options);
        if (ret) {
            if (eventName === 'touchstart') {
                delete __listenTouchEventCanvasMap[this._index];
            }
        }

        return ret;
    }
}

var ctx2DProto = CanvasRenderingContext2D.prototype;
ctx2DProto.createImageData = function(width, height) {
    return new ImageData(width, height);
}

ctx2DProto.putImageData = function(imagedata, dx, dy) {
    this._canvas._data = imagedata; //TODO: consider dx, dy?
}

ctx2DProto.getImageData = function(sx, sy, sw, sh) {
    //TODO:cjh
    return this._canvas._data;
}

ctx2DProto.drawImage = function(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    //TODO:cjh
}

function touchEventHandlerFactory(type) {
    return (touches) => {
        const touchEvent = new TouchEvent(type)

        touchEvent.touches = touches;
        // touchEvent.targetTouches = Array.prototype.slice.call(event.touches)
        touchEvent.changedTouches = touches;//event.changedTouches
        // touchEvent.timeStamp = event.timeStamp

        for (let key in __listenTouchEventCanvasMap) {
            __listenTouchEventCanvasMap[key].dispatchEvent(touchEvent);
        }
    }
}

jsb.onTouchStart = touchEventHandlerFactory('touchstart');
jsb.onTouchMove = touchEventHandlerFactory('touchmove');
jsb.onTouchEnd = touchEventHandlerFactory('touchend');
jsb.onTouchCancel = touchEventHandlerFactory('touchcancel');

module.exports = HTMLCanvasElement;

