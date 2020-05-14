/*
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

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

/**
 * @category component
 */

import { Component } from '../components/component';
import { property, ccclass, help, menu, executionOrder, requireComponent } from '../data/class-decorator';
import { view } from './view';
import { SpriteComponent } from '../../ui/components/sprite-component';
import { Node } from '../scene-graph';
import { UITransformComponent } from '../components/ui-base/ui-transform-component';
import { SpriteFrame, ImageAsset } from '../assets';
import { Rect } from '../math';
import { legacyCC } from '../global-exports';

/**
 * @en SubContextView is a view component which controls open data context viewport in WeChat game platform.<br/>
 * The component's node size decide the viewport of the sub context content in main context,
 * the entire sub context texture will be scaled to the node's bounding box area.<br/>
 * This component provides multiple important features:<br/>
 * 1. Sub context could use its own resolution size and policy.<br/>
 * 2. Sub context could be minized to smallest size it needed.<br/>
 * 3. Resolution of sub context content could be increased.<br/>
 * 4. User touch input is transformed to the correct viewport.<br/>
 * 5. Texture update is handled by this component. User don't need to worry.<br/>
 * One important thing to be noted, whenever the node's bounding box change,
 * you need to manually reset the viewport of sub context using updateSubContextViewport.
 * @zh SubContextView 可以用来控制微信小游戏平台开放数据域在主域中的视窗的位置。<br/>
 * 这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
 * 在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
 * 1. 子域中可以使用独立的设计分辨率和适配模式<br/>
 * 2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
 * 3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
 * 4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
 * 5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
 * 唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。
 */
@ccclass('cc.SubContextView')
@help('i18n:cc.SubContextView')
@executionOrder(110)
@requireComponent(UITransformComponent)
@menu('Components/SubContextView')
export class SubContextView extends Component {
    @property({
        tooltip:'帧数',
    })
    get fps (){
        return this._fps;
    }
    set fps (value) {
        if (this._fps === value) {
            return;
        }
        this._fps = value;
        this._updateInterval = 1 / value;
        this._updateSubContextFrameRate();
    }

    @property
    private _fps = 60;
    private _sprite: SpriteComponent | null;
    private _imageAsset: ImageAsset;
    private _context: any;;
    private _updatedTime = 0;
    private _updateInterval = 0;

    constructor () {
        super();
        this._sprite = null;
        this._imageAsset = new ImageAsset();
        this._context = null;
        this._updatedTime = performance.now();
    }

    public onLoad () {
        // Setup subcontext canvas size
        if (wx && wx.getOpenDataContext) {
            this._updateInterval = 1000 / this._fps;
            this._context = wx.getOpenDataContext();
            // reset sharedCanvas width and height
            this.reset();

            const image = this._imageAsset;
            const sharedCanvas = this._context.canvas;
            image.reset(sharedCanvas);
            image._texture.create(sharedCanvas.width, sharedCanvas.height);

            this._sprite = this.node.getComponent(SpriteComponent);
            if (!this._sprite) {
                this._sprite = this.node.addComponent(SpriteComponent);
            }

            if (this._sprite!.spriteFrame) {
                this._sprite!.spriteFrame.texture = this._imageAsset._texture;
            } else {
                const sp = new SpriteFrame();
                sp.texture = this._imageAsset._texture;
                this._sprite!.spriteFrame = sp;
            }
        } else {
            this.enabled = false;
        }
    }

    public onEnable () {
        this._runSubContextMainLoop();
        this._registerNodeEvent();
        this._updateSubContextFrameRate();
        this.updateSubContextViewport();
    }

    public onDisable () {
        this._unregisterNodeEvent();
        this._stopSubContextMainLoop();
    }

    public update (dt: number) {
        let calledUpdateManually = (dt === undefined);
        if (calledUpdateManually) {
            this._context && this._context.postMessage({
                fromEngine: true,
                event: 'step',
            });
            this._updateSubContextTexture();
            return;
        }
        let now = performance.now();
        let deltaTime = (now - this._updatedTime);
        if (deltaTime >= this._updateInterval) {
            this._updatedTime += this._updateInterval;
            this._updateSubContextTexture();
        }
    }

    /**
     * @en Reset open data context size and viewport
     * @zh 重置开放数据域的尺寸和视窗
     */
    public reset () {
        if (this._context) {
            this.updateSubContextViewport();
            let sharedCanvas = this._context.canvas;
            const transformComp = this.node.getComponent(UITransformComponent)!;
            if (sharedCanvas) {
                sharedCanvas.width = transformComp.width;
                sharedCanvas.height = transformComp.height;
            }
        }
    }

    /**
     * @en Update the sub context viewport manually, it should be called whenever the node's bounding box changes.
     * @zh 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。
     */
    public updateSubContextViewport () {
        if (this._context) {
            let box = this.node.getComponent(UITransformComponent)!.getBoundingBoxToWorld() as Rect;
            let sx = view.getScaleX();
            let sy = view.getScaleY();
            const rect = view.getViewportRect();
            this._context.postMessage({
                fromEngine: true,
                event: 'viewport',
                x: box.x * sx + rect.x,
                y: box.y * sy + rect.y,
                width: box.width * sx,
                height: box.height * sy
            });
        }
    }

    private _updateSubContextTexture () {
        const img = this._imageAsset;
        if (!img || !this._context) {
            return;
        }

        if (img.width <= 0 || img.height <= 0) {
            return;
        }

        const canvas = this._context.canvas;
        img.reset(canvas);
        if (canvas.width > img.width || canvas.height > img.height ){
            this._imageAsset._texture.create(canvas.width, canvas.height);
        }

        this._imageAsset._texture.uploadData(canvas);
    }

    private _registerNodeEvent () {
        this.node.on(Node.EventType.TRANSFORM_CHANGED, this.updateSubContextViewport, this);
        this.node.on(Node.EventType.SIZE_CHANGED, this.updateSubContextViewport, this);
    }

    private _unregisterNodeEvent () {
        this.node.off(Node.EventType.TRANSFORM_CHANGED, this.updateSubContextViewport, this);
        this.node.off(Node.EventType.SIZE_CHANGED, this.updateSubContextViewport, this);
    }

    private _runSubContextMainLoop () {
        if (this._context) {
            this._context.postMessage({
                fromEngine: true,
                event: 'mainLoop',
                value: true,
            });
        }
    }

    private _stopSubContextMainLoop () {
        if (this._context) {
            this._context.postMessage({
                fromEngine: true,
                event: 'mainLoop',
                value: false,
            });
        }
    }

    private _updateSubContextFrameRate () {
        if (this._context) {
            this._context.postMessage({
                fromEngine: true,
                event: 'frameRate',
                value: this._fps,
            });
        }
    }
}
legacyCC.SubContextView = SubContextView;
