/****************************************************************************
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
 ****************************************************************************/

import { DebugCanvasComponent } from '../../../3d/ui/components/debug-canvas-component';
import { LabelComponent } from '../../../3d/ui/components/label-component';
import { UITransformComponent } from '../../../3d/ui/components/ui-transfrom-component';
import { WidgetComponent } from '../../../3d/ui/components/widget-component';
import { ImageAsset, SpriteFrame } from '../../../assets';
import { LabelAtlas } from '../../../assets/label-atlas';
import { GFXDevice } from '../../../gfx/device';
import { Node } from '../../../scene-graph/node';
import { ICounterOption } from './counter';
import { PerfCounter } from './perf-counter';

interface IProfilerState {
    frame: ICounterOption;
    fps: ICounterOption;
    draws: ICounterOption;
    tricount: ICounterOption;
    logic: ICounterOption;
    render: ICounterOption;
    mode: ICounterOption;
}

let _showFPS = false;
const _fontSize = 15;
const stringLeft = 'left';
const stringRight = 'right';

let _atlas: LabelAtlas | null = null;
let _stats: IProfilerState | null = null;
let _rootNode: Node | null = null;
const _label = new Map<string, LabelComponent | null>();
let device: GFXDevice | null = null;

function initDevice (){
    if (device){
        return;
    }

    device = cc.director.root.device;
}

function generateAtlas () {
    if (_atlas) { return; }

    const textureWidth = 256;
    const textureHeight = 256;

    const canvas = document.createElement('canvas');
    canvas.width = textureWidth;
    canvas.height = textureHeight;
    canvas.style.width = `${canvas.width}`;
    canvas.style.height = `${canvas.height}`;

    // comment out this to show atlas
    // document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d');
    if (!ctx){
       return;
    }

    ctx.font = `${_fontSize}px Arial`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';

    const space = 2;
    let x = space;
    let y = space;
    const lineHeight = _fontSize;

    _atlas = new LabelAtlas();
    _atlas.fntConfig = {
        atlasName: 'profiler-arial',
        commonHeight: lineHeight,
        fontSize: _fontSize,
        kerningDict: {},
        fontDefDictionary: {},
    };

    _atlas.name = 'profiler-arial';
    _atlas.fontSize = _fontSize;

    const dict = _atlas.fntConfig.fontDefDictionary;

    for (let i = 32; i <= 126; i++) {
        const char = String.fromCharCode(i);
        const width = ctx.measureText(char).width;

        if ((x + width) >= textureWidth) {
            x = space;
            y += lineHeight + space;
        }
        ctx.fillText(char, x, y);

        dict[i] = {
            xAdvance: width,
            xOffset: 0,
            yOffset: 0,
            rect: {
                x,
                y,
                width,
                height: lineHeight,
            },
        };

        x += width + space;
    }

    // const texture = new Texture2D();
    const image = new ImageAsset(canvas);

    const spriteFrame = new SpriteFrame();
    spriteFrame.mipmaps = [image];
    spriteFrame.onLoaded();

    _atlas.spriteFrame = spriteFrame;
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
        render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' },
        mode: { desc: cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? 'WebGL' : 'Canvas', min: 1 },
    };

    for (const id of Object.keys(opts)) {
        opts[id].counter = new PerfCounter(id, opts[id], now);
    }

    _stats = opts as IProfilerState;
}

function generateNode () {
    if (_rootNode && _rootNode.isValid) {
        return;
    }

    _rootNode = new Node('PROFILER-NODE');
    _rootNode.addComponent(UITransformComponent);
    const screen =  _rootNode.addComponent(DebugCanvasComponent);
    cc.director.root.ui.debugScreen = screen;
    cc.game.addPersistRootNode(_rootNode);
    // const camera = cc.director.root.

    const managerNode = new Node('ROOT');
    managerNode.addComponent(UITransformComponent);
    managerNode.parent = _rootNode;
    managerNode.anchorX = managerNode.anchorY = 0;
    const widgetComp = managerNode.addComponent(WidgetComponent);
    if (widgetComp) {
        widgetComp.isAlignBottom = true;
        widgetComp.isAlignLeft = true;
        widgetComp.left = 10;
        widgetComp.bottom = 10;
    }

    // _rootNode.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG;
    // cc.Camera._setupDebugCamera();

    // _rootNode.zIndex = macro.MAX_ZINDEX;

    const left = new Node('LEFT-PANEL');
    left.parent = managerNode;
    const leftLabel = left.addComponent(LabelComponent);
    left.anchorX = left.anchorY = 0;
    if (leftLabel){
        leftLabel.font = _atlas;
        leftLabel.fontSize = _fontSize;
        leftLabel.lineHeight = _fontSize + 1;
    }

    const right = new Node('RIGHT-PANEL');
    right.parent = managerNode;
    const rightLabel = right.addComponent(LabelComponent);
    right.anchorX = 1;
    right.anchorY = 0;
    const pos = right.getPosition();
    right.setPosition(200, pos.y, pos.z);
    if (rightLabel){
        rightLabel.horizontalAlign = cc.LabelComponent.HorizontalAlign.RIGHT;
        rightLabel.font = _atlas;
        rightLabel.fontSize = _fontSize;
        rightLabel.lineHeight = _fontSize + 1;
    }

    _label[stringLeft] = leftLabel;
    _label[stringRight] = rightLabel;
}

function beforeUpdate () {
    if (!_stats) {
        return;
    }

    generateNode();

    const now = cc.director._lastUpdate;
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
    getCounter('render').start(now);
}

// function updateLabel (stat: IProfilerStateOption) {
//     stat.label.string = stat.desc + '  ' + stat.counter.human();
// }

function afterDraw () {
    if (!_stats){
        return;
    }

    const now = performance.now();

    getCounter('frame').end(now);
    getCounter('fps').frame(now);
    getCounter('draws').value = device!.numDrawCalls;
    getCounter('tricount').value = device!.numTris;
    getCounter('render').end(now);
    getCounter('mode').value = device!.gfxAPI;

    let left = '';
    let right = '';
    for (const id of Object.keys(_stats)) {
        const stat = _stats[id];
        stat.counter.sample(now);

        left += stat.desc + '\n';
        right += stat.counter.human() + '\n';
    }

    _label[stringLeft].string = left;
    _label[stringRight].string = right;
}

function getCounter (s: string) {
    const stats = _stats!;
    return stats[s].counter as PerfCounter;
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
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, afterDraw);
            _showFPS = false;
        }
    },

    showStats () {
        if (!_showFPS) {
            initDevice();
            generateAtlas();
            generateStats();

            if (_rootNode) {
                _rootNode.active = true;
            }

            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, afterUpdate);
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, afterDraw);
            _showFPS = true;
        }
    },
};

cc.profiler = profiler;
