import Canvas from './Canvas'

$global.screencanvas = $global.screencanvas || new Canvas();
const canvas = $global.screencanvas;

const canvasConstructor = canvas.constructor;

// canvasConstructor.__proto__.__proto__ = new HTMLElement();

export default canvasConstructor;
