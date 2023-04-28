/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, help, disallowMultiple, executeInEditMode,
    executionOrder, menu, tooltip, type, serializable, visible } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Camera } from '../../misc/camera-component';
import { Widget } from '../../ui/widget';
import { Vec3, screen, visibleRect, ccenum, cclegacy } from '../../core';
import { view } from '../../ui/view';
import { RenderRoot2D } from './render-root-2d';
import { NodeEventType } from '../../scene-graph/node-event';
import { CanvasRenderer } from './canvas-renderer';

const _worldPos = new Vec3();

export enum CanvasRenderMode {
    LEGACY      = 0,
    OVERLAY     = 1,
    FIT_CAMERA  = 2,
    WORLD_SPACE = 3,
}
ccenum(CanvasRenderMode);

/**
 * @en
 * The root node of UI.
 * Provide an aligned window for all child nodes, also provides ease of setting screen adaptation policy interfaces from the editor.
 * Line-of-sight range is -999 to 1000.
 *
 * @zh
 * 作为 UI 根节点，为所有子节点提供对齐视窗，另外提供屏幕适配策略接口，方便从编辑器设置。
 * 注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。
 * UI 的视距范围是 -999 ～ 1000.
 */
@ccclass('cc.Canvas')
@help('i18n:cc.Canvas')
@executionOrder(100)
@menu('UI/Canvas')
@executeInEditMode
@disallowMultiple
export class Canvas extends RenderRoot2D {
    /**
     * @en
     * The render mode of Canvas. // TODO
     *
     * @zh
     * Canvas 渲染模式。// TODO
     */
    @type(CanvasRenderMode)
    get renderMode () {
        return this._renderMode;
    }
    set renderMode (val) {
        if (val === this._renderMode) return;
        this._resetRenderMode(this._renderMode);

        this._renderMode = val;

        this._switchRenderMode(val);
    }

    /**
     * @en The camera component that will be aligned with this canvas
     * @zh 将与此 canvas 对齐的相机组件
     */
    @visible(function (this: Canvas) {
        return this._renderMode !== CanvasRenderMode.OVERLAY;
    })
    @type(Camera)
    @tooltip('i18n:canvas.camera')
    get cameraComponent (): Camera | null {
        return this._cameraComponent;
    }

    set cameraComponent (value) {
        if (this._cameraComponent === value) { return; }

        this._cameraComponent = value;

        this._onResizeCamera();
    }

    /**
     * @en Align canvas with screen
     * @zh 是否使用屏幕对齐画布
     */
    @visible(function (this: Canvas) {
        return this._renderMode === CanvasRenderMode.LEGACY;
    })
    @tooltip('i18n:canvas.align')
    get alignCanvasWithScreen (): boolean {
        return this._alignCanvasWithScreen;
    }

    set alignCanvasWithScreen (value) {
        this._alignCanvasWithScreen = value;

        this._onResizeCamera();
    }

    // 会有区别，比如 world 为 event camera
    @type(Camera)
    protected _cameraComponent: Camera | null = null;
    @serializable
    protected _alignCanvasWithScreen = true;
    @serializable
    private _renderMode = CanvasRenderMode.LEGACY;

    protected _thisOnCameraResized: () => void;
    // fit canvas node to design resolution
    protected _fitDesignResolution: (() => void) | undefined;

    private _pos = new Vec3();

    constructor () {
        super();
        this._thisOnCameraResized = this._onResizeCamera.bind(this);

        if (EDITOR) {
            this._fitDesignResolution = (): void => {
                // TODO: support paddings of locked widget
                this.node.getPosition(this._pos);
                const nodeSize = view.getDesignResolutionSize();
                Vec3.set(_worldPos, nodeSize.width * 0.5, nodeSize.height * 0.5, 0);

                if (!this._pos.equals(_worldPos)) {
                    this.node.setPosition(_worldPos);
                }
                const trans = this.node._uiProps.uiTransformComp!;
                if (trans.width !== nodeSize.width) {
                    trans.width = nodeSize.width;
                }
                if (trans.height !== nodeSize.height) {
                    trans.height = nodeSize.height;
                }
            };
        }
    }

    public __preload () {
        this._switchRenderMode(this._renderMode);
    }

    public onEnable (): void {
        super.onEnable();
        if (!EDITOR && this._cameraComponent) {
            this._cameraComponent.node.on(Camera.TARGET_TEXTURE_CHANGE, this._thisOnCameraResized);
        }
    }

    public onDisable (): void {
        super.onDisable();
        if (this._cameraComponent) {
            this._cameraComponent.node.off(Camera.TARGET_TEXTURE_CHANGE, this._thisOnCameraResized);
        }
    }

    public onDestroy (): void {
        super.onDestroy();

        if (EDITOR) {
            cclegacy.director.off(cclegacy.Director.EVENT_AFTER_UPDATE, this._fitDesignResolution!, this);
        } else {
            this.node.off(NodeEventType.TRANSFORM_CHANGED, this._thisOnCameraResized);
        }
    }

    protected _onResizeCamera (): void {
        if (this._cameraComponent && this._alignCanvasWithScreen) {
            if (this._cameraComponent.targetTexture) {
                this._cameraComponent.orthoHeight = visibleRect.height / 2;
            } else {
                const size = screen.windowSize;
                this._cameraComponent.orthoHeight = size.height / view.getScaleY() / 2;
            }

            this.node.getWorldPosition(_worldPos);
            this._cameraComponent.node.setWorldPosition(_worldPos.x, _worldPos.y, 1000);
        }
    }

    private _getViewPriority (): number {
        if (this._cameraComponent) {
            let priority = this.cameraComponent?.priority as number;
            priority = this._renderMode === CanvasRenderMode.OVERLAY ? priority | 1 << 30 : priority & ~(1 << 30);
            return priority;
        }

        return 0;
    }

    protected _resetRenderMode (val: CanvasRenderMode) {
        switch (val) {
        case CanvasRenderMode.LEGACY: {
            if (EDITOR) {
                // Constantly align canvas node in edit mode
                cclegacy.director.off(cclegacy.Director.EVENT_AFTER_UPDATE, this._fitDesignResolution!, this);

                // In Editor can not edit these attrs.
                // (Position in Node, contentSize in uiTransform)
                // (anchor in uiTransform, but it can edit, this is different from cocos creator)
                this._objFlags ^= (cclegacy.Object.Flags.IsPositionLocked
                     | cclegacy.Object.Flags.IsSizeLocked | cclegacy.Object.Flags.IsAnchorLocked);
            } else {
                if (this._cameraComponent) {
                    this._cameraComponent.node.off(Camera.TARGET_TEXTURE_CHANGE, this._thisOnCameraResized);
                }
                // In Editor dont need resized camera when scene window resize
                this.node.off(NodeEventType.TRANSFORM_CHANGED, this._thisOnCameraResized);
            }
            const widget = this.getComponent('cc.Widget') as unknown as Widget;
            if (widget) {
                this.node.removeComponent('cc.Widget');
            }
            break;
        }
        case CanvasRenderMode.WORLD_SPACE: {
            const model = this.getComponent(CanvasRenderer);
            if (model) {
                this.node.removeComponent(CanvasRenderer);
            }
            break;
        }
        default:
            break;
        }
    }

    protected _switchRenderMode (val: CanvasRenderMode) {
        switch (val) {
        case CanvasRenderMode.LEGACY: {
            // preLoad part
            // Stretch to matched size during the scene initialization
            const widget = this.getComponent('cc.Widget') as unknown as Widget;
            if (widget) {
                widget.updateAlignment();
            } else if (EDITOR) {
                this._fitDesignResolution!();
            }

            if (!EDITOR) {
                if (this._cameraComponent) {
                    this._cameraComponent._createCamera();
                    this._cameraComponent.node.on(Camera.TARGET_TEXTURE_CHANGE, this._thisOnCameraResized);
                }
            }

            this._onResizeCamera();

            if (EDITOR) {
                // Constantly align canvas node in edit mode
                cclegacy.director.on(cclegacy.Director.EVENT_AFTER_UPDATE, this._fitDesignResolution!, this);

                // In Editor can not edit these attrs.
                // (Position in Node, contentSize in uiTransform)
                // (anchor in uiTransform, but it can edit, this is different from cocos creator)
                this._objFlags |= cclegacy.Object.Flags.IsPositionLocked | cclegacy.Object.Flags.IsSizeLocked | cclegacy.Object.Flags.IsAnchorLocked;
            } else {
                // In Editor dont need resized camera when scene window resize
                this.node.on(NodeEventType.TRANSFORM_CHANGED, this._thisOnCameraResized);
            }

            if (this._cameraComponent) {
                this._cameraComponent.priority = this._getViewPriority();
            }
            break;
        }
        // todo
        // case RenderMode.OVERLAY:
        //     break;
        // case RenderMode.FIT_CAMERA:
        //     break;
        case CanvasRenderMode.WORLD_SPACE: {
            this._updateModels();

            break;
        }
        default:
            break;
        }
    }

    protected _updateModels () {
        let model = this.getComponent(CanvasRenderer);
        if (!model) {
            model = this.node.addComponent(CanvasRenderer);
        }
        model.updateModels();
    }
}

cclegacy.Canvas = Canvas;
