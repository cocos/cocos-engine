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

import { CameraComponent } from '../../../3d/framework/camera-component';
import { Component } from '../../../components/component';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../../core/data/class-decorator';
import Rect from '../../../core/value-types/rect';
import Size from '../../../core/value-types/size';
import { GFXClearFlag } from '../../../gfx/define';
import { Camera, ICameraInfo } from '../../../renderer/scene/camera';

/**
 * !#zh: 作为 UI 根节点，为所有子节点提供视窗四边的位置信息以供对齐，另外提供屏幕适配策略接口，方便从编辑器设置。
 * 注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。
 *
 * @class Canvas
 * @extends Component
 */
@ccclass('cc.CanvasComponent')
@executionOrder(100)
@menu('UI/Canvas')
@executeInEditMode
// @disallowMultiple
export class CanvasComponent extends Component {

    @property({
        type: Size,
    })
    get designResolution () {
        return cc.size(this._designResolution);
    }
    set designResolution (value: Size) {
        this._designResolution.width = value.width;
        this._designResolution.height = value.height;
        this.applySettings();
        this.alignWithScreen();
    }

    /**
     * !#en TODO
     * !#zh: 是否优先将设计分辨率高度撑满视图高度。
     * @property {Boolean} fitHeight
     * @default false
     */
    @property()
    get fitHeight () {
        return this._fitHeight;
    }
    set fitHeight (value: boolean) {
        if (this._fitHeight !== value) {
            this._fitHeight = value;
            this.applySettings();
            this.alignWithScreen();
        }
    }

    /**
     * !#en TODO
     * !#zh: 是否优先将设计分辨率宽度撑满视图宽度。
     * @property {Boolean} fitWidth
     * @default false
     */
    @property()
    get fitWidth () {
        return this._fitWidth;
    }
    set fitWidth (value: boolean) {
        if (this._fitWidth !== value) {
            this._fitWidth = value;
            this.applySettings();
            this.alignWithScreen();
        }
    }

    // /**
    //  * !#en priority in render
    //  * !#zh 显示优先级
    //  */
    // @property
    // get priority () {
    //     return this._priority;
    // }

    // set priority (value: number) {
    //     this._priority = value;
    // }

    get visibility () {
        if (this._camera) {
            return this._camera.view.visibility;
        }

        return -1;
    }

    get camera () {
        return this._camera;
    }

    public static views = [];
    /**
     * !#en The desigin resolution for current scene.
     * !#zh 当前场景设计分辨率。
     * @property {Size} designResolution
     * @default new cc.Size(960, 640)
     */
    @property
    private _designResolution = cc.size(960, 640);
    @property
    private _fitWidth = false;
    @property
    private _fitHeight = true;
    // @property
    // private _priority = 0;

    private _thisOnResized: ()=>void;

    private _camera: Camera | null = null;
    private _cameraInfo: ICameraInfo | null = null;

    // /**
    // * !#en Current active canvas, the scene should only have one active canvas at the same time.
    // * !#zh 当前激活的画布组件，场景同一时间只能有一个激活的画布。
    // * @property {CanvasComponent} instance
    // * @static
    // */
    // static instance = null;

    constructor () {
        super();
        this._thisOnResized = this.alignWithScreen.bind(this);
    }

    // public onLoad () {}

    public resetInEditor () {
        // _Scene._applyCanvasPreferences(this);
    }

    public __preload () {
        this._cameraInfo = {
            name: 'ui',
            node: this.node,
            projection: CameraComponent.ProjectionType.ORTHO,
            fov: 45,
            stencil: 0,
            orthoHeight: 10,
            far: 4096,
            near: -0.1,
            color: cc.color(0, 0, 0, 255),
            clearFlags: GFXClearFlag.DEPTH | GFXClearFlag.STENCIL,
            rect: new Rect(0, 0, 1, 1),
            depth: 1,
            isUI: true,
        } as ICameraInfo;
        this._camera = this._getRenderScene().createCamera(this._cameraInfo);
        cc.director.root.ui.addScreen(this);

        // if (CC_DEV) {
        //     var Flags = cc.Object.Flags;
        //     this._objFlags |= (Flags.IsPositionLocked | Flags.IsAnchorLocked | Flags.IsSizeLocked);
        // }

        // if (CanvasComponent.instance) {
        //     return cc.errorID(6700,
        //         this.node.name, CanvasComponent.instance.node.name);
        // }
        // CanvasComponent.instance = this;

        if (CC_EDITOR) {
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.alignWithScreen, this);
            cc.engine.on('design-resolution-changed', this._thisOnResized);
        }
        else {
            if (cc.sys.isMobile) {
                window.addEventListener('resize', this._thisOnResized);
            }
            else {
                cc.view.on('canvas-resize', this._thisOnResized);
            }
        }

        this.applySettings();
        this.alignWithScreen();
    }

    public onDisable () {
        if (this._camera) {
            this._getRenderScene().destroyCamera(this._camera);
            cc.director.root.ui.removeScreen(this);
        }
    }

    public onDestroy () {
        if (CC_EDITOR) {
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.alignWithScreen, this);
            cc.engine.off('design-resolution-changed', this._thisOnResized);
        }
        else {
            if (cc.sys.isMobile) {
                window.removeEventListener('resize', this._thisOnResized);
            } else {
                cc.view.off('canvas-resize', this._thisOnResized);
            }
        }

        cc.view.off('design-resolution-changed', this._thisOnResized);

        // if (CanvasComponent.instance === this) {
        //     CanvasComponent.instance = null;
        // }
    }

    //

    public alignWithScreen() {
        let nodeSize, designSize;
        if (CC_EDITOR) {
            // nodeSize = designSize = cc.engine.getDesignResolutionSize();
            nodeSize = designSize = this._designResolution;
            this.node.setPosition(designSize.width * 0.5, designSize.height * 0.5, 1);
        }
        else {
            const canvasSize = cc.visibleRect;
            nodeSize = canvasSize;
            const designSize = cc.view.getDesignResolutionSize();
            const clipTopRight = !this.fitHeight && !this.fitWidth;
            let offsetX = 0;
            let offsetY = 0;
            if (clipTopRight) {
                // offset the canvas to make it in the center of screen
                offsetX = (designSize.width - canvasSize.width) * 0.5;
                offsetY = (designSize.height - canvasSize.height) * 0.5;
            }
            this.node.setPosition(canvasSize.width * 0.5 + offsetX, canvasSize.height * 0.5 + offsetY, 1);
        }
        this.node.width = nodeSize.width;
        this.node.height = nodeSize.height;
    }

    public applySettings () {
        const ResolutionPolicy = cc.ResolutionPolicy;
        let policy;

        if (this.fitHeight && this.fitWidth) {
            policy = ResolutionPolicy.SHOW_ALL;
        } else if (!this.fitHeight && !this.fitWidth) {
            policy = ResolutionPolicy.NO_BORDER;
        } else if (this.fitWidth) {
            policy = ResolutionPolicy.FIXED_WIDTH;
        } else {      // fitHeight
            policy = ResolutionPolicy.FIXED_HEIGHT;
        }

        const designRes = this._designResolution;
        if (CC_EDITOR) {
            // cc.engine.setDesignResolutionSize(designRes.width, designRes.height);
        }
        else {
            cc.view.setDesignResolutionSize(designRes.width, designRes.height, policy);
        }
    }
}
