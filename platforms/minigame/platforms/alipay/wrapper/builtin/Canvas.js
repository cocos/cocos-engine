import HTMLCanvasElement from "./HTMLCanvasElement"
import { isIDE } from "./utils/util";

export default function Canvas() {
    const canvas = my.createCanvas();

    if(!isIDE) {
        if (!('tagName' in canvas)) {
            canvas.tagName = 'canvas'
        }
    
        canvas.__proto__.__proto__ = new HTMLCanvasElement()
    }

    return canvas;

}
