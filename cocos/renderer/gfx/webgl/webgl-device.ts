import { GFXDeviceInfo, GFXDevice } from '../gfx-device';
import { GFXBuffer } from '../gfx-buffer';
import { WebGLBuffer } from './webgl-buffer';

export class WebGLDevice extends GFXDevice {
    
    constructor(canvasEL : HTMLElement) {
        
        super();

        try {
            this._webGLRC = (<HTMLCanvasElement>canvasEL).getContext('webgl');
        } catch (err) {
            console.error(err);
            return;
        }
      
        // No errors are thrown using try catch
        // Tested through ios baidu browser 4.14.1
        if (!this._webGLRC) {
            console.error('This device does not support WebGL.');
        }
    }

    public initialize(info : GFXDeviceInfo) : boolean {

        return true;
    }

    public destroy() : void {

    }

    public createBuffer() : GFXBuffer {
        return new WebGLBuffer(this);
    }

    public getDeviceName() : string {
        return "WebGLDevice";
    }

    public get gl(): WebGLRenderingContext | null {
        return this._webGLRC;
    }

    private _webGLRC : WebGLRenderingContext | null = null;
};
