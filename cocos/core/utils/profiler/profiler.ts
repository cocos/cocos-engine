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
    physics: ICounterOption;
    render: ICounterOption;
    textureMemory: ICounterOption;
    bufferMemory: ICounterOption;
}

const _characters = '0123456789. ';

const _string2offset = {
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

const _profileInfo = {
    frame: { desc: 'Frame time (ms)', min: 0, max: 50, average: 500 },
    fps: { desc: 'Framerate (FPS)', below: 30, average: 500, isInteger: true },
    draws: { desc: 'Draw call', isInteger: true },
    tricount: { desc: 'Triangle', isInteger: true },
    logic: { desc: 'Game Logic (ms)', min: 0, max: 50, average: 500, color: '#080' },
    physics: { desc: 'Physics (ms)', min: 0, max: 50, average: 500 },
    render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' },
    textureMemory: { desc: 'GFX Texture Mem(M)' },
    bufferMemory: { desc: 'GFX Buffer Mem(M)'},
};

const _constants = {
    fontSize: 24,
    quadHeight: 0.18,
    segmentsPerLine: 8,
    textureWidth: 256,
    textureHeight: 256,
};

export class Profiler {

    public _stats: IProfilerState | null = null;
    public id = '__Profiler__';

    private _showFPS = false;

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

    private readonly _lineHeight = _constants.fontSize + 2;
    private _wordHeight = 0;
    private _eachNumWidth = 0;      // profiler each number width
    private _totalLines = 0;        // total lines to display

    private lastTime = 0;   // update use time

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

            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            cc.director.off(cc.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            cc.director.off(cc.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.afterDraw, this);
            this._showFPS = false;
        }
    }

    public showStats () {
        if (!this._showFPS) {
            this.initDevice();
            this.generateCanvas();
            this.generateStats();
            cc.game.on(cc.Game.EVENT_ENGINE_INITED, this.generateNode, this);

            if (this._rootNode) {
                this._rootNode.active = true;
            }

            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            cc.director.on(cc.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            cc.director.on(cc.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.afterDraw, this);

            this._showFPS = true;
            this._canvasDone = true;
            this._statsDone = true;
        }
    }

    public initDevice (){
        if (this._device) {
            return;
        }
        this._device = cc.director.root!.device;
    }

    public generateCanvas () {

        if (this._canvasDone) {
            return;
        }

        const { textureWidth, textureHeight } = _constants;

        if (!this._ctx || !this._canvas) {
            return;
        }

        this._canvas.width = textureWidth;
        this._canvas.height = textureHeight;
        this._canvas.style.width = `${this._canvas.width}`;
        this._canvas.style.height = `${this._canvas.height}`;

        this._ctx.font = `${_constants.fontSize}px Arial`;
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

        this._ctx.textAlign = 'left';
        let i = 0;
        for (const id in _profileInfo) {
            const element = _profileInfo[id];
            this._ctx.fillText(element.desc, 0, i * this._lineHeight);
            element.counter = new PerfCounter(id, element, now);
            i++;
        }
        this._totalLines = i;
        this._wordHeight = this._totalLines * this._lineHeight / this._canvas.height;

        this._eachNumWidth = this._ctx.measureText('0').width / this._canvas.width; // each number uv width
        const canvasNumWidth = this._eachNumWidth * this._canvas.width; // each number width in canvas

        const offsets = new Array();
        let offset = 0;
        offsets[0] = 0;
        for (let j = 0; j < _characters.length; ++j) {
            this._ctx.fillText(_characters[j], j * canvasNumWidth, this._totalLines * this._lineHeight);
            offset += this._eachNumWidth;
            offsets[j + 1] = offset;
        }

        const len = Math.ceil(offsets.length / 4);
        for (let j = 0; j < len; j++) {
            this._uvOffset.push(new Vec4(offsets[j * 4], offsets[j * 4 + 1], offsets[j * 4 + 2], offsets[j * 4 + 3]));
        }

        this._stats = _profileInfo as IProfilerState;
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
        camera.flows = ['UIFlow'];

        const managerNode = new Node('Profiler_Root');
        managerNode.parent = this._rootNode;

        const height = _constants.quadHeight;
        const rowHeight = height / this._totalLines;
        const lWidth = height / this._wordHeight;
        const scale = rowHeight / _constants.fontSize;
        const columnWidth = this._eachNumWidth * this._canvas!.width * scale;
        const vertexPos: number[] = [
            0, height, 0, // top-left
            lWidth, height, 0, // top-right
            lWidth,   0, 0, // bottom-right
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
        let offset = 0;
        for (let i = 0; i < this._totalLines; i++) {
            for (let j = 0; j < _constants.segmentsPerLine; j++) {
                vertexPos.push(lWidth + j * columnWidth, height - i * rowHeight, 0 ); // tl
                vertexPos.push(lWidth + (j + 1) * columnWidth, height - i * rowHeight, 0); // tr
                vertexPos.push(lWidth + (j + 1) * columnWidth, height - (i + 1) * rowHeight, 0); // br
                vertexPos.push(lWidth + j * columnWidth, height - (i + 1) * rowHeight, 0); // bl
                offset = (i * _constants.segmentsPerLine + j + 1) * 4;
                vertexindices.push(0 + offset, 2 + offset, 1 + offset, 0 + offset, 3 + offset, 2 + offset);
                const idx = i * _constants.segmentsPerLine + j;
                const z = Math.floor(idx / 4);
                const w = idx - z * 4;
                vertexUV.push(0, this._wordHeight, z, w ); // tl
                vertexUV.push(this._eachNumWidth, this._wordHeight, z, w ); // tr
                vertexUV.push(this._eachNumWidth, 1, z, w ); // br
                vertexUV.push(0, 1, z, w ); // bl
            }
        }

        const modelCom = managerNode.addComponent('cc.ModelComponent') as ModelComponent;
        modelCom.mesh = createMesh({
            positions: vertexPos,
            indices: vertexindices,
            colors: vertexUV, // pack all the necessary info in a_color: { x: u, y: v, z: id.x, w: id.y }
        });

        const _material = new Material();
        _material.initialize({ effectName: 'util/profiler' });
        _material.setProperty('offset', new Vec4(-0.9, -0.9, 0, 0));
        _material.setProperty('symbols', this._uvOffset);
        const pass = _material.passes[0];
        const handle = pass.getBinding('mainTexture');
        pass.bindTextureView(handle!, this._textureView!);

        modelCom.material = _material;
        const passInstance = modelCom.material.passes[0];
        const binding = passInstance.getBinding('digits')!;
        this.digitsData = passInstance.blocks[binding];

        modelCom.node.layer = Layers.Enum.PROFILER;
    }

    public beforeUpdate () {
        if (!this._stats) {
            return;
        }

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
        if (cc.director.isPaused()) {
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
        this.getCounter('render').end(now);

        if (now - this.lastTime < 500) {
            return;
        }
        this.lastTime = now;

        const device = this._device!;
        this.getCounter('draws').value = device.numDrawCalls;
        this.getCounter('bufferMemory').value = device.memoryStatus.bufferSize / (1024 * 1024);
        this.getCounter('textureMemory').value = device.memoryStatus.textureSize / (1024 * 1024);
        this.getCounter('tricount').value = device.numTris;

        let i = 0;
        const view = this.digitsData.view;
        for (const id in this._stats) {
            const stat = this._stats[id] as ICounterOption;
            stat.counter.sample(now);
            const result = stat.counter.human().toString();
            for (let j = _constants.segmentsPerLine - 1; j >= 0; j--) {
                const index = i * _constants.segmentsPerLine + j;
                const character = result[result.length - (_constants.segmentsPerLine - j)];
                let offset = _string2offset[character];
                if (offset === undefined) { offset = 11; }
                view[index] = offset;
            }
            i++;
        }

        this.digitsData.dirty = true;
    }

    public getCounter (s: string) {
        const stats = this._stats;
        return stats![s].counter as PerfCounter;
    }

    public updateTexture () {
        cc.director.root!.device.copyTexImagesToTexture(this._canvasArr, this._texture!, this._regionArr);
    }
}

export const profiler = new Profiler();
cc.profiler = profiler;
