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
import { GFXBufferTextureCopy, GFXClearFlag, GFXFormat, GFXTextureType, GFXTextureUsageBit } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXTexture } from '../../gfx/texture';
import { Vec4 } from '../../math';
import { IBlock } from '../../renderer/core/pass';
import { Layers } from '../../scene-graph';
import { Node } from '../../scene-graph/node';
import { ICounterOption } from './counter';
import { PerfCounter } from './perf-counter';
import { TEST } from 'internal:constants';
import { legacyCC } from '../../global-exports';

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

interface IProfilerState {
    frame: ICounterOption;
    fps: ICounterOption;
    draws: ICounterOption;
    instances: ICounterOption;
    tricount: ICounterOption;
    logic: ICounterOption;
    physics: ICounterOption;
    render: ICounterOption;
    textureMemory: ICounterOption;
    bufferMemory: ICounterOption;
}

const _profileInfo = {
    frame: { desc: 'Frame time (ms)', min: 0, max: 50, average: 500 },
    fps: { desc: 'Framerate (FPS)', below: 30, average: 500, isInteger: true },
    draws: { desc: 'Draw call', isInteger: true },
    instances: { desc: 'Instance Count', isInteger: true },
    tricount: { desc: 'Triangle', isInteger: true },
    logic: { desc: 'Game Logic (ms)', min: 0, max: 50, average: 500, color: '#080' },
    physics: { desc: 'Physics (ms)', min: 0, max: 50, average: 500 },
    render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' },
    textureMemory: { desc: 'GFX Texture Mem(M)' },
    bufferMemory: { desc: 'GFX Buffer Mem(M)'},
};

const _constants = {
    fontSize: 23,
    quadHeight: 0.4,
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
    private readonly _region: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private readonly _canvasArr: HTMLCanvasElement[] = [];
    private readonly _regionArr = [this._region];
    private digitsData: IBlock = null!;

    private _canvasDone = false;
    private _statsDone = false;
    private _inited = false;

    private readonly _lineHeight = _constants.textureHeight / (Object.keys(_profileInfo).length + 1);
    private _wordHeight = 0;
    private _eachNumWidth = 0;
    private _totalLines = 0; // total lines to display

    private lastTime = 0;   // update use time

    constructor () {
        if (!TEST) {
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d')!;
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

            legacyCC.director.off(legacyCC.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            legacyCC.director.off(legacyCC.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            legacyCC.director.off(legacyCC.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            legacyCC.director.off(legacyCC.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            legacyCC.director.off(legacyCC.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            legacyCC.director.off(legacyCC.Director.EVENT_AFTER_DRAW, this.afterDraw, this);
            this._showFPS = false;
        }
    }

    public showStats () {
        if (!this._showFPS) {
            if (!this._device) { this._device = legacyCC.director.root.device; }
            this.generateCanvas();
            this.generateStats();
            legacyCC.game.once(legacyCC.Game.EVENT_ENGINE_INITED, this.generateNode, this);

            if (this._rootNode) {
                this._rootNode.active = true;
            }

            legacyCC.director.on(legacyCC.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
            legacyCC.director.on(legacyCC.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
            legacyCC.director.on(legacyCC.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);
            legacyCC.director.on(legacyCC.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);
            legacyCC.director.on(legacyCC.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
            legacyCC.director.on(legacyCC.Director.EVENT_AFTER_DRAW, this.afterDraw, this);

            this._showFPS = true;
            this._canvasDone = true;
            this._statsDone = true;
        }
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

        this._region.texExtent.width = textureWidth;
        this._region.texExtent.height = textureHeight;
    }

    public generateStats () {
        if (this._statsDone || !this._ctx || !this._canvas) {
            return;
        }

        this._stats = null;
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

        for (let j = 0; j < _characters.length; ++j) {
            const offset = this._ctx.measureText(_characters[j]).width;
            this._eachNumWidth = Math.max(this._eachNumWidth, offset);
        }
        for (let j = 0; j < _characters.length; ++j) {
            this._ctx.fillText(_characters[j], j * this._eachNumWidth, this._totalLines * this._lineHeight);
        }
        this._eachNumWidth /= this._canvas.width;

        this._stats = _profileInfo as IProfilerState;
        this._canvasArr[0] = this._canvas;
        this._device!.copyTexImagesToTexture(this._canvasArr, this._texture!, this._regionArr);
    }

    public generateNode () {
        if (this._rootNode && this._rootNode.isValid) {
            return;
        }

        this._rootNode = new Node('PROFILER_NODE');
        legacyCC.game.addPersistRootNode(this._rootNode);

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

        // device NDC correction
        const ySign = this._device!.projectionSignY;
        for (let i = 1; i < vertexPos.length; i += 3) {
            vertexPos[i] *= ySign;
        }

        const modelCom = managerNode.addComponent('cc.ModelComponent') as ModelComponent;
        modelCom.mesh = createMesh({
            positions: vertexPos,
            indices: vertexindices,
            colors: vertexUV, // pack all the necessary info in a_color: { x: u, y: v, z: id.x, w: id.y }
        });

        const _material = new Material();
        _material.initialize({ effectName: 'util/profiler' });
        _material.setProperty('offset', new Vec4(-0.9, -0.9 * ySign, this._eachNumWidth, 0));
        const pass = _material.passes[0];
        const handle = pass.getBinding('mainTexture');
        const binding = pass.getBinding('digits')!;
        pass.bindTexture(handle!, this._texture!);
        this.digitsData = pass.blocks[binding];
        modelCom.material = _material;
        modelCom.node.layer = Layers.Enum.PROFILER;
        this._inited = true;
    }

    public beforeUpdate () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
        (this._stats.frame.counter as PerfCounter).end(now);
        (this._stats.frame.counter as PerfCounter).start(now);
        (this._stats.logic.counter as PerfCounter).start(now);
    }

    public afterUpdate () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
        if (legacyCC.director.isPaused()) {
            (this._stats.frame.counter as PerfCounter).start(now);
        } else {
            (this._stats.logic.counter as PerfCounter).end(now);
        }
    }

    public beforePhysics () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
        (this._stats.physics.counter as PerfCounter).start(now);
    }

    public afterPhysics () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
        (this._stats.physics.counter as PerfCounter).end(now);
    }

    public beforeDraw () {
        if (!this._stats) {
            return;
        }

        const now = performance.now();
        (this._stats.render.counter as PerfCounter).start(now);
    }

    public afterDraw () {
        if (!this._stats || !this._inited) {
            return;
        }
        const now = performance.now();

        (this._stats.fps.counter as PerfCounter).frame(now);
        (this._stats.render.counter as PerfCounter).end(now);

        if (now - this.lastTime < 500) {
            return;
        }
        this.lastTime = now;

        const device = this._device!;
        (this._stats.draws.counter as PerfCounter).value = device.numDrawCalls;
        (this._stats.instances.counter as PerfCounter).value = device.numInstances;
        (this._stats.bufferMemory.counter as PerfCounter).value = device.memoryStatus.bufferSize / (1024 * 1024);
        (this._stats.textureMemory.counter as PerfCounter).value = device.memoryStatus.textureSize / (1024 * 1024);
        (this._stats.tricount.counter as PerfCounter).value = device.numTris;

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
}

export const profiler = new Profiler();
legacyCC.profiler = profiler;
