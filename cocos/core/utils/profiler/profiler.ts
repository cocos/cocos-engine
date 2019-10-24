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

import { CameraComponent, ModelComponent } from '../../3d';
import { createMesh } from '../../3d/misc/utils';
import { Material } from '../../assets/material';
import { director, Director } from '../../director';
import { GFXBufferTextureCopy, GFXClearFlag, GFXFormat, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXTexture } from '../../gfx/texture';
import { GFXTextureView } from '../../gfx/texture-view';
import { Vec4 } from '../../math';
import { IBlock } from '../../renderer/core/pass';
import { Layers } from '../../scene-graph';
import { Node } from '../../scene-graph/node';
import { ICounterOption } from './counter';
import { PerfCounter } from './perf-counter';

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

const characters = '0123456789. ';

export class Profiler {

    public _stats: IProfilerState | null = null;

    private _showFPS = false;
    private readonly _fontSize = 24;
    private readonly _lineHeight = this._fontSize + 2;
    private _wordHeight = 0;

    private _rootNode: Node | null = null;
    private _device: GFXDevice | null = null;
    private readonly _canvas: HTMLCanvasElement | null = null;
    private readonly _ctx: CanvasRenderingContext2D | null = null;
    private _texture: GFXTexture | null = null;
    private _textureView: GFXTextureView | null = null;
    private readonly _region: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private readonly _canvasArr: HTMLCanvasElement[] = [];
    private readonly _regionArr = [this._region];
    private digitsData: IBlock = null!;

    private _canvasDone = false;
    private _statsDone = false;
    private _inited = false;

    private _rowNumber = 9;
    private _columnNumber = 8;

    private _posWordWidth = 0.18;   // profiler left side width
    private _posBaseHeight = 0.18;  // profiler left side height
    private _posNumWidth = 0.09;    // profiler right side width
    private _eachNumWidth = 0;      // profiler each number width

    private _string2offset = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '.': 10,
    };

    private _uvOffset: Vec4[] = [];

    constructor () {
        if (!CC_TEST) {
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d')!;
            this._region = new GFXBufferTextureCopy();
            this._canvasArr.push(this._canvas);
        }
    }

    public isShowingStats () {
        return this._showFPS;
    }

    public hideStats () {
        if (this._showFPS) {
            if (this._rootNode) {
                this._rootNode.active = false;
            }

            director.off(Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            director.off(Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            director.off(Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            director.off(Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            director.off(Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            director.off(Director.EVENT_AFTER_DRAW, this.afterDraw, this);
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

            director.on(Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            director.on(Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            director.on(Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            director.on(Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            director.on(Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            director.on(Director.EVENT_AFTER_DRAW, this.afterDraw, this);

            this._showFPS = true;
            this._canvasDone = true;
            this._statsDone = true;
        }
    }

    public initDevice (){
        if (this._device) {
            return;
        }
        this._device = director.root!.device;
    }

    public generateCanvas () {

        if (this._canvasDone) {
            return;
        }

        const textureWidth = 256;
        const textureHeight = 256;

        if (!this._ctx || !this._canvas) {
            return;
        }

        this._canvas.width = textureWidth;
        this._canvas.height = textureHeight;
        this._canvas.style.width = `${this._canvas.width}`;
        this._canvas.style.height = `${this._canvas.height}`;

        this._ctx.font = `${this._fontSize}px Arial`;
        this._ctx.textBaseline = 'top';
        this._ctx.fillStyle = '#fff';

        this._texture = this._device!.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
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
        if (this._statsDone || !this._ctx || !this._canvas ) {
            return;
        }

        this._stats = null;
        this._inited = false;
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

        this._ctx.textAlign = 'left';
        let i = 0;
        for (const id in opts) {
            if (opts.hasOwnProperty(id)) {
                const element = opts[id];
                this._ctx.fillText(element.desc, 0, i * this._lineHeight);
                element.counter = new PerfCounter(id, element, now);
                i++;
            }
        }
        this._ctx.fillText(characters, 0, i * this._lineHeight);
        this._wordHeight = i * this._lineHeight / this._canvas.height;

        const offsets = new Array();
        let offset = 0;
        offsets[0] = 0;
        for (let j = 0; j < characters.length; ++j) {
            offset += this._ctx.measureText(characters[j]).width / this._canvas.width;
            offsets[j + 1] = offset; // cause offsets[0] = 0
        }

        const len = Math.ceil(offsets.length / 4);
        for (let k = 0; k < len; k++) {
            this._uvOffset.push(new Vec4(offsets[k * 4], offsets[k * 4 + 1], offsets[k * 4 + 2], offsets[k * 4 + 3]));
        }

        this._eachNumWidth = this._ctx.measureText('0').width / this._canvas!.width;

        this._stats = opts as IProfilerState;
        this._canvasArr[0] = this._canvas;
        this.updateTexture();
        this._inited = true;
    }

    public generateNode () {
        if (this._rootNode && this._rootNode.isValid) {
            return;
        }

        this._rootNode = new Node('PROFILER_NODE');
        cc.game.addPersistRootNode(this._rootNode);

        const cameraNode = new Node('Profiler_Camera');
        cameraNode.setPosition(0, 0, 1);
        cameraNode.parent = this._rootNode;
        const camera = cameraNode.addComponent('cc.CameraComponent') as CameraComponent;
        camera.projection = CameraComponent.ProjectionType.ORTHO;
        camera.near = 0;
        camera.far = 0;
        camera.orthoHeight = this._device!.height;
        camera.visibility = Layers.BitMask.PROFILER;
        camera.clearFlags = GFXClearFlag.NONE;
        camera.priority = 0xffffffff; // after everything else

        const managerNode = new Node('Profiler_Root');
        managerNode.parent = this._rootNode;

        const columnWidth = this._posNumWidth / this._columnNumber;
        const rowHeight = this._posBaseHeight / this._rowNumber;
        const vertexPos: number[] = [
            0, this._posBaseHeight, 0, // top-left
            this._posBaseHeight, this._posBaseHeight, 0, // top-right
            this._posWordWidth,   0, 0, // bottom-right
            0,   0, 0, // bottom-left
        ];
        const vertexindices: number[] = [
            0, 2, 1,
            0, 3, 2,
        ];
        const vertexUV: number[] = [
            0, 0, -1, 0,
            1, 0, -1, 0,
            1, this._wordHeight, -1, 0,
            0, this._wordHeight, -1, 0,
        ];
        let offset;
        for (let i = 0; i < this._rowNumber; i++) {
            for (let j = 0; j < this._columnNumber; j++) {
                vertexPos.push(this._posWordWidth + j * columnWidth, this._posBaseHeight - i * rowHeight, 0 ); // 0xyz
                vertexPos.push(this._posWordWidth + (j + 1) * columnWidth, this._posBaseHeight - i * rowHeight, 0); // 1xyz
                vertexPos.push(this._posWordWidth + (j + 1) * columnWidth, this._posBaseHeight - (i + 1) * rowHeight, 0); // 2xyz
                vertexPos.push(this._posWordWidth + j * columnWidth, this._posBaseHeight - (i + 1) * rowHeight, 0); // 3xyz
                offset = (i * this._columnNumber + j + 1) * 4;
                vertexindices.push(0 + offset, 2 + offset, 1 + offset, 0 + offset, 3 + offset, 2 + offset);
                const idx = i * this._columnNumber + j;
                const z = Math.floor(idx / 4);
                const w = idx - z * 4;
                vertexUV.push(0, this._wordHeight, z, w ); // 0uvindex
                vertexUV.push(this._eachNumWidth, this._wordHeight, z, w ); // 1uvindex
                vertexUV.push(this._eachNumWidth, 1, z, w ); // 2uvindex
                vertexUV.push(0, 1, z, w ); // 3uvindex
            }
        }

        const modelCom = managerNode.addComponent('cc.ModelComponent') as ModelComponent;
        modelCom.mesh = createMesh({
            positions : vertexPos,
            indices: vertexindices,
            colors: vertexUV, //  use colors,actually x is u,y is v,z is index
        });

        const _material = new Material();
        _material.initialize({
            effectName: 'util/profiler',
        });
        _material.setProperty('offset', new Vec4(-0.9, -0.9, 0, 0));
        _material.setProperty('symbols', this._uvOffset);
        const pass = _material.passes[0];
        const handle = pass.getBinding('mainTexture');
        pass.bindTextureView(handle!, this._textureView!);

        const binding = pass.getBinding('digits')!;
        this.digitsData = pass.blocks[binding];

        modelCom.material = _material;
        modelCom.node.layer = Layers.Enum.PROFILER;
    }

    public beforeUpdate () {
        if (!this._stats) {
            return;
        }

        this.generateNode();

        const now = performance.now();
        this.getCounter('frame').end(now);
        this.getCounter('frame').start(now);
        this.getCounter('logic').start(now);
    }

    public afterUpdate () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
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

        const now = performance.now();
        this.getCounter('physics').start(now);
    }

    public afterPhysics () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
        this.getCounter('physics').end(now);
    }

    public beforeDraw () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
        this.getCounter('render').start(now);
    }

    public afterDraw () {
        if (!this._stats || !this._inited) {
            return;
        }
        const now = performance.now();

        this.getCounter('fps').frame(now);
        this.getCounter('draws').value = this._device!.numDrawCalls;
        this.getCounter('bufferMemory').value = this._device!.memoryStatus.bufferSize / (1024 * 1024);
        this.getCounter('textureMemory').value = this._device!.memoryStatus.textureSize / (1024 * 1024);
        this.getCounter('tricount').value = this._device!.numTris;
        this.getCounter('render').end(now);

        let i = 0;
        const view = this.digitsData.view;
        for (const id in this._stats) {
            if (this._stats.hasOwnProperty(id)) {
                const stat = this._stats[id];
                stat.counter.sample(now);
                const result = stat.counter.human(!(stat.desc === 'Framerate (FPS)')).toString();
                for (let j = this._columnNumber - 1; j >= 0; j--) {
                    const index = i * this._columnNumber + j;
                    const character = result[result.length - (this._columnNumber - j)];
                    let offset = this._string2offset[character];
                    if (offset === undefined) { offset = 11; }
                    view[index] = offset;
                }
                i++;
            }
        }
        this.digitsData.dirty = true;
    }

    public getCounter (s: string) {
        const stats = this._stats;
        return stats![s].counter as PerfCounter;
    }

    public updateTexture () {
        director.root!.device.copyTexImagesToTexture(this._canvasArr, this._texture!, this._regionArr);
    }
}

export const profiler = new Profiler();
cc.profiler = profiler;
