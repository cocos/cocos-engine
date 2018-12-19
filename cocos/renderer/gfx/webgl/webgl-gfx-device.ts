import { GFXDeviceInfo, GFXDevice } from '../gfx-device';
import { GFXBuffer, GFXBufferInfo } from '../gfx-buffer';
import { WebGLGFXBuffer } from './webgl-gfx-buffer';
import { WebGLGFXQueue } from './webgl-gfx-queue';
import { WebGLStateCache } from './webgl-state-cache';
import { WebGLGPUBuffer, WebGLGPUObjectType, WebGLGPUTexture, WebGLGPURenderPass, WebGLGPUFramebuffer, WebGLGPUTextureView, WebGLGPUShader, WebGLGPUShaderStage } from './webgl-gpu-objects';
import { WebGLCmdFuncUpdateBuffer, WebGLCmdFuncDestroyBuffer, WebGLCmdFuncCreateBuffer, WebGLCmdFuncDestroyTexture, WebGLCmdFuncCreateTexture, WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer, WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader } from './webgl-commands';
import { GFXTextureInfo, GFXTextureType, GFXTextureFlagBit } from '../gfx-texture';
import { GFXTextureViewType, GFXTextureViewInfo } from '../gfx-texture-view';
import { GFXRenderPassInfo } from '../gfx-render-pass';
import { GFXFramebufferInfo } from '../gfx-framebuffer';
import { WebGLGFXRenderPass } from './webgl-gfx-render-pass';
import { WebGLGFXTextureView } from './webgl-gfx-texture-view';
import { WebGLGFXTexture } from './webgl-gfx-texture';
import { GFXShaderInfo } from '../gfx-shader';

export class WebGLGFXDevice extends GFXDevice {
    
    stateCache : WebGLStateCache = new WebGLStateCache;

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
        return new WebGLGFXBuffer(this);
    }

    public getDeviceName() : string {
        return "WebGLDevice";
    }

    public get gl() : WebGLRenderingContext {
        return <WebGLRenderingContext>this._webGLRC;
    }

    public get webGLQueue(): WebGLGFXQueue {
        return <WebGLGFXQueue>this._queue;
    }

    public emitCmdCreateGPUBuffer(info : GFXBufferInfo) : WebGLGPUBuffer {

        let gpuBuffer : WebGLGPUBuffer = { 
            objType : WebGLGPUObjectType.BUFFER, 
            usage : info.usage, 
            memUsage : info.memUsage, 
            size : info.size, 
            stride : info.stride,
            glTarget : 0,
            glBuffer : 0,
        };

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.CREATE_BUFFER, gpuObj : gpuBuffer, isFree : false };

        WebGLCmdFuncCreateBuffer(<WebGLGFXDevice>this, gpuBuffer);

        return gpuBuffer;
    }

    public emitCmdDestroyGPUBuffer(gpuBuffer : WebGLGPUBuffer) {

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.DESTROY_BUFFER, gpuObj : gpuBuffer, isFree : false };

        WebGLCmdFuncDestroyBuffer(<WebGLGFXDevice>this, gpuBuffer);
    }

    public emitCmdUpdateGPUBuffer(gpuBuffer : WebGLGPUBuffer, offset : number, data : ArrayBuffer) {
        // TODO: Async
        WebGLCmdFuncUpdateBuffer(<WebGLGFXDevice>this, gpuBuffer, offset, data);
    }

    public emitCmdCreateGPUTexture(info : GFXTextureInfo) : WebGLGPUTexture {

        let viewType : GFXTextureViewType;
        
        switch (info.type) {
            case GFXTextureType.TEX1D : {
                viewType = info.arrayLayer <= 1? GFXTextureViewType.TV1D : GFXTextureViewType.TV1D_ARRAY;
                break;
            }
            case GFXTextureType.TEX2D : {
    
                if(info.arrayLayer <= 1) {
                    viewType = GFXTextureViewType.TV2D;
                } else if(info.arrayLayer === 6 && (info.flags & GFXTextureFlagBit.CUBEMAP)) {
                    viewType = GFXTextureViewType.CUBE;
                } else {
                    viewType = GFXTextureViewType.TV2D_ARRAY;
                }

                break;
            }
            case GFXTextureType.TEX3D : {
                viewType = GFXTextureViewType.TV3D;
                break;
            }
            default: {
                viewType = GFXTextureViewType.TV2D;
            }
        }

        let gpuTexture : WebGLGPUTexture = { 
            objType : WebGLGPUObjectType.TEXTURE, 
            type : info.type,
            viewType : viewType,
            format : info.format,
            usage : info.usage,
            width : info.width,
            height : info.height,
            depth : info.depth,
            arrayLayer : info.arrayLayer,
            mipLevel : info.mipLevel,
            flags : info.flags,

            glTarget : 0,
            glInternelFmt : 0,
            glFormat : 0,
            glType : 0,
            glUsage : 0,
            glTexture : 0,
        };

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.CREATE_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncCreateTexture(<WebGLGFXDevice>this, gpuTexture);

        return gpuTexture;
    }

    public emitCmdDestroyGPUTexture(gpuTexture : WebGLGPUTexture) {

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.DESTROY_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncDestroyTexture(<WebGLGFXDevice>this, gpuTexture);
    }

    public emitCmdCreateGPUTextureView(info : GFXTextureViewInfo) : WebGLGPUTextureView {
        let webGLTexture = <WebGLGFXTexture>info.texture;

        let gpuTextureView : WebGLGPUTextureView = {
            objType : WebGLGPUObjectType.TEXTURE_VIEW,
            gpuTexture : webGLTexture.gpuTexture,
            type : info.type,
            format : info.format,
            baseLevel : info.baseLevel,
            levelCount : info.levelCount,
        };

        return gpuTextureView;
    }

    public emitCmdCreateGPURenderPass(info : GFXRenderPassInfo) : WebGLGPURenderPass {
        let gpuRenderPass : WebGLGPURenderPass = { 
            objType : WebGLGPUObjectType.RENDER_PASS, 
            colorInfos : info.colorInfos,
            depthStencilInfo : info.depthStencilInfo,
        }

        return gpuRenderPass;
    }

    public emitCmdCreateGPUFramebuffer(info : GFXFramebufferInfo) : WebGLGPUFramebuffer {
        
        let renderPass = <WebGLGFXRenderPass>info.renderPass;
        
        let gpuColorViews : (WebGLGPUTextureView | null)[] = new Array<WebGLGPUTextureView | null>();

        for (let i = 0; i < info.colorViews.length; ++i) {
            let webGLColorView = <WebGLGFXTextureView>info.colorViews[i];
            gpuColorViews[i] = webGLColorView.gpuTextureView;
        }

        let webGLDSView = <WebGLGFXTextureView>info.depthStencilView;

        let gpuFramebuffer : WebGLGPUFramebuffer = {
            objType : WebGLGPUObjectType.FRAMEBUFFER, 
            gpuRenderPass : renderPass.gpuRenderPass,
            gpuColorViews : gpuColorViews,
            gpuDepthStencilView : webGLDSView.gpuTextureView,
            isOffscreen : info.isOffscreen,
            glFramebuffer : 0,
        };

        // TODO: Async
        WebGLCmdFuncCreateFramebuffer(<WebGLGFXDevice>this, gpuFramebuffer);

        return gpuFramebuffer;
    }

    public emitCmdDestroyGPUFramebuffer(gpuFramebuffer : WebGLGPUFramebuffer) {

        // TODO: Async
        WebGLCmdFuncDestroyFramebuffer(<WebGLGFXDevice>this, gpuFramebuffer);
    }

    public emitCmdCreateGPUShader(info : GFXShaderInfo) : WebGLGPUShader {

        let gpuStages: WebGLGPUShaderStage[] = [];
        for(let i = 0; i < info.stages.length; ++i) {
            let stage = info.stages[i];

            gpuStages.push({
                type : stage.type,
                source : stage.source,
                macros : stage.macros,
                glShader : 0,
            });
        }

        let gpuShader : WebGLGPUShader = {
            objType : WebGLGPUObjectType.SHADER,
            name : info.name,
            bindings : info.bindings,

            gpuStages : gpuStages,
            glProgram : 0,
            glInputs : [],
            glUniforms : [],
            glBlocks : [],
            glSamplers : [],
        };

        // TODO: Async
        WebGLCmdFuncCreateShader(<WebGLGFXDevice>this, gpuShader);

        return gpuShader;
    }

    public emitCmdDestroyGPUShader(gpuShader : WebGLGPUShader) {

        // TODO: Async
        WebGLCmdFuncDestroyShader(<WebGLGFXDevice>this, gpuShader);
    }

    private _webGLRC : WebGLRenderingContext | null = null;
};
