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

import { DebugCanvasComponent, WidgetComponent, Material, ModelComponent } from '../../../3d';
import { ImageAsset, Texture2D } from '../../../assets';
import { GFXDevice } from '../../../gfx/device';
import { Node } from '../../../scene-graph/node';
import { ICounterOption } from './counter';
import { PerfCounter } from './perf-counter';
import { quad } from '../../../3d/primitive';
import { GFXTexture } from '../../../gfx/texture';

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

let _showFPS = false;
const _fontSize = 18;
const _lineHeight = _fontSize + 2;
const _left = 10;
const _right = 10;
const _top = 10;
const _buttom = 10;

let _stats: IProfilerState | null = null;
let _rootNode: Node | null = null;
let device: GFXDevice | null = null;
let _canvas: HTMLCanvasElement;
let _ctx: CanvasRenderingContext2D;
let _image: ImageAsset;
let _texture: Texture2D;

function initDevice (){
    if (device){
        return;
    }

    device = cc.director.root.device;
}

function generateCanvas () {

    if ( _canvas ) { return; }

    const textureWidth = 300;
    const textureHeight = 200;

    _canvas = document.createElement('canvas');
    _canvas.width = textureWidth;
    _canvas.height = textureHeight;
    _canvas.style.width = `${_canvas.width}`;
    _canvas.style.height = `${_canvas.height}`;

    _ctx = _canvas.getContext('2d');
    if (!_ctx){
        return;
    }

    _ctx.font = `${_fontSize}px Arial`;
    _ctx.textBaseline = 'top';
    _ctx.fillStyle = '#fff';

    _image = new ImageAsset(_canvas);
    _texture = new Texture2D();
    _texture.image = _image;
    _texture.onLoaded();
}

function generateStats () {
    _stats = null;
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
        // mode: { desc: cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? 'WebGL' : 'Canvas', min: 1 },
    };

    // 左侧静态
    _ctx.textAlign = 'left';
    let i = 0;
    for (const id of Object.keys(opts)) {
        _ctx.fillText(opts[id].desc,_left,_top + i * _lineHeight);
        opts[id].counter = new PerfCounter(id, opts[id], now);
        i++;
    }

    _ctx.textAlign="end";

    _stats = opts as IProfilerState;
}

function generateNode () {
    if (_rootNode && _rootNode.isValid) {
        return;
    }

    _rootNode = new Node('PROFILER-NODE');
    // const screen = _rootNode.addComponent('cc.DebugCanvasComponent') as DebugCanvasComponent;
    cc.game.addPersistRootNode(_rootNode);
    // const camera = cc.director.root.

    const managerNode = new Node('ROOT');
    managerNode.parent = _rootNode;
    // managerNode.anchorX = managerNode.anchorY = 0;

    const modelCom = managerNode.addComponent('cc.ModelComponent') as ModelComponent;
    const _quad = quad();
    modelCom.mesh = cc.utils.createMesh(_quad);

    const _material = new Material();
    _material.initialize({
        effectName:'builtin-standard',
    });

    modelCom.material = _material;
    // _rootNode.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG;
    // cc.Camera._setupDebugCamera();

}

function beforeUpdate () {
    if (!_stats) {
        return;
    }

    generateNode();

    const now = cc.director._lastUpdate;
    getCounter('frame').end(now);
    getCounter('frame').start(now);
    getCounter('logic').start(now);
}

function afterUpdate () {
    if (!_stats){
        return;
    }

    const now = performance.now();
    if (cc.director.isPaused()) {
        getCounter('frame').start(now);
    } else {
        getCounter('logic').end(now);
    }
}

// function updateLabel (stat: IProfilerStateOption) {
//     stat.label.string = stat.desc + '  ' + stat.counter.human();
// }

function beforePhysics (){
    if (!_stats){
        return;
    }

    const now = performance.now();
    getCounter('physics').start(now);
}

function afterPhysics (){
    if (!_stats){
        return;
    }

    const now = performance.now();
    getCounter('physics').end(now);
}

function beforeDraw (){
    if (!_stats){
        return;
    }

    const now = performance.now();
    getCounter('render').start(now);
}

function afterDraw () {
    if (!_stats){
        return;
    }

    const now = performance.now();

    getCounter('fps').frame(now);
    getCounter('draws').value = device!.numDrawCalls;
    getCounter('bufferMemory').value = device!.memoryStatus.bufferSize / (1024 * 1024);
    getCounter('textureMemory').value = device!.memoryStatus.textureSize / (1024 * 1024);
    getCounter('tricount').value = device!.numTris;
    getCounter('render').end(now);
    // getCounter('mode').value = device!.gfxAPI;

    const x = _left + _ctx.measureText('GFX Texture Mem(M)').width;
    _ctx.clearRect( x, 0, _canvas.width - x, _canvas.height);

    let i = 0;
    for (const id of Object.keys(_stats)) {
        const stat = _stats[id];
        stat.counter.sample(now);
        _ctx.fillText(stat.counter.human(!(stat.desc === 'Framerate (FPS)')), _canvas.width - _right, _top + i * _lineHeight);
        i++;
    }

    updateTexture();
}

function getCounter (s: string) {
    const stats = _stats!;
    return stats[s].counter as PerfCounter;
}

function updateTexture () {
    // 更新材质的贴图
    // device.copyTexImagesToTexture(_canvas,_texture.getGFXTexture(),)

}

export const profiler = {
    isShowingStats () {
        return _showFPS;
    },

    hideStats () {
        if (_showFPS) {
            if (_rootNode) {
                _rootNode.active = false;
            }

            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, afterUpdate);
            cc.director.off(cc.Director.EVENT_BEFORE_PHYSICS, beforePhysics);
            cc.director.off(cc.Director.EVENT_AFTER_PHYSICS, afterPhysics);
            cc.director.off(cc.Director.EVENT_BEFORE_DRAW, beforeDraw);
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, afterDraw);
            _showFPS = false;
        }
    },

    showStats () {
        if (!_showFPS) {
            initDevice();
            generateCanvas();
            generateStats();

            if (_rootNode) {
                _rootNode.active = true;
            }

            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, afterUpdate);
            cc.director.on(cc.Director.EVENT_BEFORE_PHYSICS, beforePhysics);
            cc.director.on(cc.Director.EVENT_AFTER_PHYSICS, afterPhysics);
            cc.director.on(cc.Director.EVENT_BEFORE_DRAW, beforeDraw);
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, afterDraw);

            // cc.game.canvas.parentNode.appendChild(_canvas);

            _showFPS = true;
        }
    },
};

cc.profiler = profiler;
