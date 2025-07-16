// import HTMLElement from './HTMLElement';

// export default class HTMLCanvasElement extends HTMLElement
// {
//     constructor(){
//         super('canvas')
//     }
// };

import Canvas from './Canvas'
import HTMLElement from './HTMLElement'

GameGlobal.screencanvas = GameGlobal.screencanvas || new Canvas();
const canvas = GameGlobal.screencanvas;

const canvasConstructor = canvas.constructor;

// canvasConstructor.__proto__.__proto__ = new HTMLElement();

export default canvasConstructor;
