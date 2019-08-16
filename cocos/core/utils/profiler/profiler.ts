/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Material, ModelComponent, CameraComponent } from '../../../3d';
import { GFXDevice } from '../../../gfx/device';
import { Node } from '../../../scene-graph/node';
import { ICounterOption } from './counter';
import { PerfCounter } from './perf-counter';
import { GFXTexture } from '../../../gfx/texture';
import { GFXTextureType, GFXTextureUsageBit, GFXFormat, GFXTextureViewType, GFXBufferTextureCopy, GFXClearFlag } from '../../../gfx/define';
import { GFXTextureView } from '../../../gfx/texture-view';
import { createMesh } from '../../../3d/misc/utils';
import director from '../../director';
import { Vec4 } from '../../math';

interface IProfilerState {
    frame: ICounterOption;
    fps: ICounterOption;
    draws: ICounterOption;
    tricount: ICounterOption;
    logic: ICounterOption;
    render: ICounterOption;
    // mode: ICounterOption;
    physics: ICounterOption;
    textureMemory: ICounterOption;
    bufferMemory: ICounterOption;
}

export class Profiler {

    public _stats: IProfilerState | null = null;

    private _showFPS = false;
    private readonly _fontSize = 22;
    private readonly _lineHeight = this._fontSize + 2;
    private readonly _left = 10;
    private readonly _right = 10;
    private readonly _top = 10;
    private readonly _buttom = 10;

    private _rootNode: Node | null = null;
    private _device: GFXDevice | null = null;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private _texture: GFXTexture | null = null;
    private _textureView: GFXTextureView | null = null;
    private readonly _region: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private readonly _canvasArr = [this._canvas];
    private readonly _regionArr = [this._region];

    private _canvasDone = false;
    private _statsDone = false;

    constructor () {
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d')!;
        this._region = new GFXBufferTextureCopy();
    }

    public isShowingStats () {
        return this._showFPS;
    }

    public hideStats () {
        if (this._showFPS) {
            if (this._rootNode) {
                this._rootNode.active = false;
            }

            director.off(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            director.off(cc.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            director.off(cc.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            director.off(cc.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            director.off(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            director.off(cc.Director.EVENT_AFTER_DRAW, this.afterDraw, this);
            this._showFPS = false;
        }
    }

    public showStats () {
        if (!this._showFPS) {
            this.initDevice();
            this.generateCanvas();
            this.generateStats();

            if (this._rootNode) {
                this._rootNode.active = true;
            }

            director.on(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            director.on(cc.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            director.on(cc.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            director.on(cc.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            director.on(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            director.on(cc.Director.EVENT_AFTER_DRAW, this.afterDraw, this);

            this._showFPS = true;
            this._canvasDone = true;
            this._statsDone = true;
        }
    }

    public initDevice (){
        if (this._device){
            return;
        }
        this._device = director.root!.device;
    }

    public generateCanvas () {

        if( this._canvasDone ){
            return;
        }

        const textureWidth = 350;
        const textureHeight = 200;

        this._canvas.width = textureWidth;
        this._canvas.height = textureHeight;
        this._canvas.style.width = `${this._canvas.width}`;
        this._canvas.style.height = `${this._canvas.height}`;

        if (!this._ctx) {
            return;
        }

        this._ctx.font = `${this._fontSize}px Arial`;
        this._ctx.textBaseline = 'top';
        this._ctx.fillStyle = '#fff';

        this._texture = this._device!.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format:GFXFormat.RGBA8,
            width: textureWidth,
            height: textureHeight,
            mipLevel: 1,
        });

        this._textureView = this._device!.createTextureView({
            texture: this._texture,
            type: GFXTextureViewType.TV2D,
            format: GFXFormat.RGBA8,
        });

        this._region.texExtent.width = textureWidth;
        this._region.texExtent.height = textureHeight;
    }

    public generateStats () {
        if(this._statsDone){
            return;
        }

        this._stats = null;
        const now = director.getCurrentTime();

        const opts = {
            frame: { desc: 'Frame time (ms)', min: 0, max: 50, average: 500 },
            fps: { desc: 'Framerate (FPS)', below: 30, average: 500 },
            draws: { desc: 'Draw call' },
            tricount: { desc: 'Triangle' },
            logic: { desc: 'Game Logic (ms)', min: 0, max: 50, average: 500, color: '#080' },
            physics: { desc: 'Physics (ms)', min: 0, max: 50, average: 500 },
            render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' },
            textureMemory: { desc: 'GFX Texture Mem(M)' },
            bufferMemory: { desc: 'GFX Buffer Mem(M)'},
        };

        this._ctx.textAlign = 'left';
        let i = 0;
        for (const id of Object.keys(opts)) {
            this._ctx.fillText(opts[id].desc,this._left,this._top + i * this._lineHeight);
            opts[id].counter = new PerfCounter(id, opts[id], now);
            i++;
        }
        this._ctx.textAlign="end";

        this._stats = opts as IProfilerState;
    }

    public generateNode () {
        if (this._rootNode && this._rootNode.isValid) {
            return;
        }

        this._rootNode = new Node('PROFILER_NODE');
        cc.game.addPersistRootNode(this._rootNode);

        const cameraNode = new Node('Profiler_Camera');
        cameraNode.setPosition(0,0,1);
        cameraNode.parent = this._rootNode;
        const camera = cameraNode.addComponent('cc.CameraComponent') as CameraComponent;
        camera.projection = CameraComponent.ProjectionType.ORTHO;
        camera.near = 0;
        camera.far = 0;
        camera.orthoHeight = this._device!.height;
        camera.visibility = 0xDEADBEEF;
        camera.clearFlags = GFXClearFlag.DEPTH | GFXClearFlag.STENCIL;

        const managerNode = new Node('Profiler_Root');
        managerNode.parent = this._rootNode;

        const modelCom = managerNode.addComponent('cc.ModelComponent') as ModelComponent;
        modelCom.mesh = createMesh({
            // positions: [
            //     -0.25, -1/7, 0, // bottom-left
            //     -0.25,  1/7, 0, // top-left
            //      0.25,  1/7, 0, // top-right
            //      0.25, -1/7, 0, // bottom-right
            // ],
            positions: [
                -0.3, -0.2, 0, // bottom-left
                -0.3,  0.2, 0, // top-left
                 0.3,  0.2, 0, // top-right
                 0.3, -0.2, 0, // bottom-right
            ],
            indices: [
                0, 2, 1,
                0, 3, 2,
            ],
            uvs: [
                0, 1,
                0, 0,
                1, 0,
                1, 1,
            ],
        });

        const _material = new Material();
        _material.initialize({
            effectName:'builtin-screen-quad',
        });
        _material.setProperty('offset', new Vec4(-0.9, -0.9, 0, 0));
        const pass = _material.passes[0];
        const handle = pass.getBinding('mainTexture');
        pass.bindTextureView(handle!, this._textureView!);

        modelCom.material = _material;
        modelCom.visibility = 0xDEADBEEF;
    }

    public beforeUpdate () {
        if (!this._stats) {
            return;
        }

        this.generateNode();

        const now = cc.director._lastUpdate;
        this.getCounter('frame').end(now);
        this.getCounter('frame').start(now);
        this.getCounter('logic').start(now);
    }

    public afterUpdate () {
        if (!this._stats) {
            return;
        }

        const now = director.getCurrentTime();
        if (director.isPaused()) {
            this.getCounter('frame').start(now);
        } else {
            this.getCounter('logic').end(now);
        }
    }

    public beforePhysics () {
        if (!this._stats) {
            return;
        }

        const now = director.getCurrentTime();
        this.getCounter('physics').start(now);
    }

    public afterPhysics () {
        if (!this._stats) {
            return;
        }

        const now = director.getCurrentTime();
        this.getCounter('physics').end(now);
    }

    public beforeDraw () {
        if (!this._stats) {
            return;
        }

        const now = director.getCurrentTime();
        this.getCounter('render').start(now);
    }

    public afterDraw () {
        if (!this._stats) {
            return;
        }
        const now = director.getCurrentTime();

        this.getCounter('fps').frame(now);
        this.getCounter('draws').value = this._device!.numDrawCalls;
        this.getCounter('bufferMemory').value = this._device!.memoryStatus.bufferSize / (1024 * 1024);
        this.getCounter('textureMemory').value = this._device!.memoryStatus.textureSize / (1024 * 1024);
        this.getCounter('tricount').value = this._device!.numTris;
        this.getCounter('render').end(now);

        const x = this._left + this._ctx.measureText('GFX Texture Mem(M)').width;
        this._ctx.clearRect( x, 0, this._canvas.width - x, this._canvas.height);

        let i = 0;
        for (const id of Object.keys(this._stats)) {
            const stat = this._stats[id];
            stat.counter.sample(now);
            this._ctx.fillText(
                stat.counter.human(!(stat.desc === 'Framerate (FPS)')),
                this._canvas.width - this._right,
                this._top + i * this._lineHeight);
            i++;
        }

        this._canvasArr[0] = this._canvas;
        this.updateTexture();
    }

    public getCounter (s: string) {
        const stats = this._stats;
        return stats![s].counter as PerfCounter;
    }

    public updateTexture () {
        director.root!.device.copyTexImagesToTexture(this._canvasArr,this._texture!, this._regionArr);
    }

}

export const profiler = new Profiler();
cc.profiler = profiler;
