export { default as navigator } from './navigator'
export { default as XMLHttpRequest } from './XMLHttpRequest'
export { default as WebSocket } from './WebSocket'
export { default as Image } from './Image'
export { default as ImageBitmap } from './ImageBitmap'
export { default as Audio } from './Audio'
export { default as FileReader } from './FileReader'
export { default as Element } from './Element'
export { default as HTMLElement } from './HTMLElement'
export { default as HTMLImageElement } from './HTMLImageElement'
export { default as HTMLCanvasElement } from './HTMLCanvasElement'
export { default as HTMLMediaElement } from './HTMLMediaElement'
export { default as HTMLAudioElement } from './HTMLAudioElement'
import Canvas from './Canvas'

export { default as HTMLVideoElement } from './HTMLVideoElement'
export { default as WebGLRenderingContext } from './WebGLRenderingContext'
export { TouchEvent, MouseEvent } from './EventIniter/index.js'
export { default as localStorage } from './localStorage'
export { btoa, atob } from './Base64'
export * from './WindowProperties'
import location_ from './location'
export const location = location_

// 暴露全局的 canvas
window.screencanvas = window.screencanvas || new Canvas();
window.self = window;
export const canvas = window.screencanvas;

export function alert(msg) {
    my.alert({
        content: msg
      });
}

export function focus() {}

export function blur() {}