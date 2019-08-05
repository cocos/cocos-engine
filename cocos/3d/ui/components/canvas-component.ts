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

/**
 * @category ui
 */

import { Component } from '../../../components';
import { ccclass, disallowMultiple, executeInEditMode, executionOrder, menu, property, requireComponent } from '../../../core/data/class-decorator';
import { Vec3 } from '../../../core/math';
import { GFXClearFlag } from '../../../gfx/define';
import { Camera } from '../../../renderer';
import { UITransformComponent } from './ui-transfrom-component';
import { Node } from '../../../scene-graph';
import { RenderTexture } from '../../../assets';

const _worldPos = new Vec3();

/**
 * @zh
 * 作为 UI 根节点，为所有子节点提供视窗四边的位置信息以供对齐，另外提供屏幕适配策略接口，方便从编辑器设置。
 * 注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。
 * 同时 UI 相机默认 fov 是 1000，所以 UI 节点的事件坐标一定是大于或等于 0 的，不支持负数。
 * 可通过 cc.CanvasComponent 获得此组件
 */
@ccclass('cc.CanvasComponent')
@executionOrder(100)
@requireComponent(UITransformComponent)
@menu('UI/Canvas')
@executeInEditMode
@disallowMultiple
export class CanvasComponent extends Component {

    // /**
    //  * @zh
    //  * 设计分辨率
    //  *
    //  * @param value - 设计分辨率尺寸。
    //  */
    // @property({
    //     type: Size,
    //     displayOrder: 0,
    // })
    // get designResolution () {
    //     return this._designResolution;
    // }

    // set designResolution (value: Size) {
    //     this._designResolution.width = value.width;
    //     this._designResolution.height = value.height;
    //     this.node.emit('design-resolution-changed', this._designResolution);
    //     this.applySettings();
    //     this.alignWithScreen();
    // }

    // /**
    //  * @zh
    //  * 是否优先将设计分辨率高度撑满视图高度。
    //  *
    //  * @param value - 是否撑满高度。
    //  */
    // @property({
    //     displayOrder: 1,
    // })
    // get fitHeight () {
    //     return this._fitHeight;
    // }

    // set fitHeight (value: boolean) {
    //     if (this._fitHeight !== value) {
    //         this._fitHeight = value;
    //         this.applySettings();
    //         this.alignWithScreen();
    //     }
    // }

    // /**
    //  * @zh
    //  * 是否优先将设计分辨率宽度撑满视图宽度。
    //  *
    //  * @param value - 是否撑满宽度。
    //  */
    // @property({
    //     displayOrder: 2,
    // })
    // get fitWidth () {
    //     return this._fitWidth;
    // }

    // set fitWidth (value: boolean) {
    //     if (this._fitWidth !== value) {
    //         this._fitWidth = value;
    //         this.applySettings();
    //         this.alignWithScreen();
    //     }
    // }

    /**
     * @zh
     * 渲染优先级。
     *
     * @param value - 渲染优先级。
     */
    @property()
    get priority () {
        return this._priority;
    }

    set priority (val: number) {
        this._priority = val;
        if (this._camera) {
            this._camera.priority = val;
        }
    }

    /**
     * @zh Canvas 的 RenderTexture
     */
    @property({
        type: RenderTexture,
    })
    get targetTexture (){
        return this._targetTexture;
    }

    set targetTexture (value) {
        if (this._camera) {
            if (this._targetTexture) {
                this._targetTexture.removeCamera(this._camera);
            }

            if (value) {
                this._camera.changeTargetWindow(value.getGFXWindow());
                value.addCamera(this._camera);
            } else {
                this._camera.changeTargetWindow();
            }
        }

        this._targetTexture = value;
    }

    get visibility () {
        if (this._camera) {
            return this._camera.view.visibility;
        }

        return -1;
    }

    get camera () {
        return this._camera;
    }

    // /**
    //  * @zh
    //  * 当前激活的画布组件，场景同一时间只能有一个激活的画布。
    //  */
    // public static instance: CanvasComponent | null = null;

    @property
    protected _priority = 0;
    @property
    protected _targetTexture: RenderTexture | null = null;

    protected _thisOnResized: () => void;

    protected _camera: Camera | null = null;
    private _pos = new Vec3();

    constructor () {
        super();
        this._thisOnResized = this.alignWithScreen.bind(this);
        // // TODO:maybe remove when multiple scene
        // if (!CanvasComponent.instance){
        //     CanvasComponent.instance = this;
        // }
    }

    public __preload () {
        const cameraNode = new Node('UICamera_' + this.node.name);
        cameraNode.setPosition(0, 0, 999);
        if (!CC_EDITOR) {
            this._camera = cc.director.root.ui.renderScene.createCamera({
                name: 'ui_' + this.node.name,
                node: cameraNode,
                projection: cc.CameraComponent.ProjectionType.ORTHO,
                priority: this._priority,
                isUI: true,
                flows: ['UIFlow'],
            });

            this._camera!.fov = 45;
            this._camera!.clearFlag = GFXClearFlag.COLOR | GFXClearFlag.DEPTH | GFXClearFlag.STENCIL;

            const device = cc.director.root.device;
            this._camera!.resize(device.width, device.height);
            if (this._targetTexture) {
                this._camera!.changeTargetWindow(this._targetTexture.getGFXWindow());
                this._targetTexture.addCamera(this._camera!);
            }
        }

        if (CC_EDITOR) {
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.alignWithScreen, this);
        }

        cc.view.on('design-resolution-changed', this._thisOnResized);

        // this.applySettings();
        this.alignWithScreen();

        cc.director.root.ui.addScreen(this);
    }

    // public onEnable (){

    // }

    // public onDisable () {

    // }

    public onDestroy () {
        if (this._camera) {
            cc.director.root.ui.renderScene.destroyCamera(this._camera);
            if(this._targetTexture){
                this._targetTexture.removeCamera(this._camera);
            }
        }

        if (CC_EDITOR) {
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.alignWithScreen, this);
        }

        cc.view.off('design-resolution-changed', this._thisOnResized);
        cc.director.root.ui.removeScreen(this);
        // if (CanvasComponent.instance === this) {
        //     CanvasComponent.instance = null;
        // }
    }

    /**
     * @zh
     * 屏幕对齐。
     */
    public alignWithScreen () {
        let nodeSize;
        let designSize;
        this.node.getPosition(this._pos);
        if (CC_EDITOR) {
            // nodeSize = designSize = cc.engine.getDesignResolutionSize();
            nodeSize = designSize = cc.view.getDesignResolutionSize();
            Vec3.set(_worldPos, designSize.width * 0.5, designSize.height * 0.5, 1);
        }
        else {
            const canvasSize = cc.visibleRect;
            nodeSize = canvasSize;
            designSize = cc.view.getDesignResolutionSize();
            const policy = cc.view.getResolutionPolicy();
            // const clipTopRight = !this.fitHeight && !this.fitWidth;
            const clipTopRight = policy === cc.ResolutionPolicy.NO_BORDER;
            let offsetX = 0;
            let offsetY = 0;
            if (clipTopRight) {
                // offset the canvas to make it in the center of screen
                offsetX = (designSize.width - canvasSize.width) * 0.5;
                offsetY = (designSize.height - canvasSize.height) * 0.5;
            }

            Vec3.set(_worldPos, canvasSize.width * 0.5 + offsetX, canvasSize.height * 0.5 + offsetY, 0);
        }

        if (!this._pos.equals(_worldPos)) {
            this.node.setPosition(_worldPos);
        }

        if (this.node.width !== nodeSize.width) {
            this.node.width = nodeSize.width;
        }

        if (this.node.height !== nodeSize.height) {
            this.node.height = nodeSize.height;
        }

        this.node.getWorldPosition(_worldPos);
        if (this._camera) {
            const size = cc.view.getVisibleSize();
            this._camera.resize(size.width, size.height);
            this._camera.orthoHeight = this._camera.height / 2;
            this._camera.node.setPosition(_worldPos.x, _worldPos.y, 999);
            this._camera.update();
        }
    }

    // /**
    //  * @zh
    //  * 应用适配策略。
    //  */
    // public applySettings () {
    //     const ResolutionPolicy = cc.ResolutionPolicy;
    //     let policy;

    //     if (this.fitHeight && this.fitWidth) {
    //         policy = ResolutionPolicy.SHOW_ALL;
    //     } else if (!this.fitHeight && !this.fitWidth) {
    //         policy = ResolutionPolicy.NO_BORDER;
    //     } else if (this.fitWidth) {
    //         policy = ResolutionPolicy.FIXED_WIDTH;
    //     } else {      // fitHeight
    //         policy = ResolutionPolicy.FIXED_HEIGHT;
    //     }

    //     const designRes = this._designResolution;
    //     if (CC_EDITOR) {
    //         // cc.engine.setDesignResolutionSize(designRes.width, designRes.height);
    //     }
    //     else {
    //         const root = cc.director.root;
    //         if (root && root.ui && root.ui.debugScreen && root.ui.debugScreen === this ){
    //             return;
    //         }

    //         cc.view.setDesignResolutionSize(designRes.width, designRes.height, policy);
    //     }
    // }
}

cc.CanvasComponent = CanvasComponent;
