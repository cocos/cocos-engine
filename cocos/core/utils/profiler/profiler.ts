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

import { Material, ModelComponent } from '../../../3d';
import { GFXDevice } from '../../../gfx/device';
import { Node } from '../../../scene-graph/node';
import { ICounterOption } from './counter';
import { PerfCounter } from './perf-counter';
import { GFXTexture } from '../../../gfx/texture';
import { GFXTextureType, GFXTextureUsageBit, GFXFormat, GFXTextureViewType, GFXBufferTextureCopy } from '../../../gfx/define';
import { GFXTextureView } from '../../../gfx/texture-view';
import { createMesh } from '../../../3d/misc/utils';

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
    private _fontSize = 22;
    private _lineHeight = this._fontSize + 2;
    private _left = 10;
    private _right = 10;
    private _top = 10;
    private _buttom = 10;

    private _rootNode: Node | null = null;
    private device: GFXDevice | null = null;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _texture: GFXTexture;
    private _textureView: GFXTextureView;
    private _region: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private canvasArr = [this._canvas];
    private regionArr = [this._region];

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

            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate);
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.afterUpdate);
            cc.director.off(cc.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics);
            cc.director.off(cc.Director.EVENT_AFTER_PHYSICS, this.afterPhysics);
            cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw);
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.afterDraw);
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

            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate);
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.afterUpdate);
            cc.director.on(cc.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics);
            cc.director.on(cc.Director.EVENT_AFTER_PHYSICS, this.afterPhysics);
            cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw);
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.afterDraw);

            // cc.game.canvas.parentNode.appendChild(cc.profiler._canvas);

            this._showFPS = true;
        }
    }

    public initDevice (){
        if (this.device){
            return;
        }
        this.device = cc.director.root.device;
    }

    public generateCanvas () {

        const textureWidth = 300;
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

        this._texture = this.device!.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format:GFXFormat.RGBA8,
            width: textureWidth,
            height: textureHeight,
            mipLevel: 1,
        });

        this._textureView = this.device!.createTextureView({
            texture: this._texture,
            type: GFXTextureViewType.TV2D,
            format: GFXFormat.RGBA8,
        });

        this._region.texExtent.width = textureWidth;
        this._region.texExtent.height = textureHeight;
    }

    public generateStats () {
        this._stats = null;
        const now = performance.now();

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

        // 左侧静态
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
        if (cc.profiler._rootNode && cc.profiler._rootNode.isValid) {
            return;
        }

        cc.profiler._rootNode = new Node('PROFILER-NODE');
        cc.game.addPersistRootNode(cc.profiler._rootNode);

        const managerNode = new Node('ROOT');
        managerNode.parent = cc.profiler._rootNode;

        let w = 0.5;
        const h = 0.5;
        const x = cc.director.root.device.width;
        const y = cc.director.root.device.height;
        if(y>x) {
            w = 2 * w;
        }

        const modelCom = managerNode.addComponent('cc.ModelComponent') as ModelComponent;
        modelCom.mesh = createMesh({
            positions: [
                -0.9, -0.9, 0, // bottom-left
                -0.9, -0.9 + h , 0, // top-left
                -0.9 + w, -0.9 + h, 0, // top-right
                -0.9 + w, -0.9, 0, // bottom-right
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

        const pass = _material.passes[0];
        const handle = pass.getBinding('mainTexture');
        pass.bindTextureView(handle!, cc.profiler._textureView);

        modelCom.material = _material;
    }

    public beforeUpdate () {
        if (!cc.profiler._stats) {
            return;
        }

        cc.profiler.generateNode();

        const now = cc.director._lastUpdate;
        cc.profiler.getCounter('frame').end(now);
        cc.profiler.getCounter('frame').start(now);
        cc.profiler.getCounter('logic').start(now);
    }

    public afterUpdate () {
        if (!cc.profiler._stats) {
            return;
        }

        const now = performance.now();
        if (cc.director.isPaused()) {
            cc.profiler.getCounter('frame').start(now);
        } else {
            cc.profiler.getCounter('logic').end(now);
        }
    }

    public beforePhysics () {
        if (!cc.profiler._stats) {
            return;
        }

        const now = performance.now();
        cc.profiler.getCounter('physics').start(now);
    }

    public afterPhysics () {
        if (!cc.profiler._stats) {
            return;
        }

        const now = performance.now();
        cc.profiler.getCounter('physics').end(now);
    }

    public beforeDraw () {
        if (!cc.profiler._stats) {
            return;
        }

        const now = performance.now();
        cc.profiler.getCounter('render').start(now);
    }

    public afterDraw () {
        if (!cc.profiler._stats) {
            return;
        }
        const now = performance.now();

        cc.profiler.getCounter('fps').frame(now);
        cc.profiler.getCounter('draws').value = cc.profiler.device!.numDrawCalls;
        cc.profiler.getCounter('bufferMemory').value = cc.profiler.device!.memoryStatus.bufferSize / (1024 * 1024);
        cc.profiler.getCounter('textureMemory').value = cc.profiler.device!.memoryStatus.textureSize / (1024 * 1024);
        cc.profiler.getCounter('tricount').value = cc.profiler.device!.numTris;
        cc.profiler.getCounter('render').end(now);

        const x = cc.profiler._left + cc.profiler._ctx.measureText('GFX Texture Mem(M)').width;
        cc.profiler._ctx.clearRect( x, 0, cc.profiler._canvas.width - x, cc.profiler._canvas.height);

        let i = 0;
        for (const id of Object.keys(cc.profiler._stats)) {
            const stat = cc.profiler._stats[id];
            stat.counter.sample(now);
            cc.profiler._ctx.fillText(
                stat.counter.human(!(stat.desc === 'Framerate (FPS)')),
                cc.profiler._canvas.width - cc.profiler._right,
                cc.profiler._top + i * cc.profiler._lineHeight);
            i++;
        }

        cc.profiler.canvasArr[0] = cc.profiler._canvas;
        cc.profiler.updateTexture();
    }

    public getCounter (s: string) {
        const stats = cc.profiler._stats;
        return stats[s].counter as PerfCounter;
    }

    public updateTexture () {
        // 更新材质的贴图
        cc.director.root.device.copyTexImagesToTexture(cc.profiler.canvasArr,cc.profiler._texture, cc.profiler.regionArr);
    }

}

export const profiler = new Profiler();
cc.profiler = profiler;
