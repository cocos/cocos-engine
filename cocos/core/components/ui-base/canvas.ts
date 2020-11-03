/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module ui
 */

import { Camera } from '../../3d/framework/camera-component';
import { Widget } from '../../../ui/components/widget';
import { RenderTexture } from '../../assets/render-texture';
import { ccclass, help, disallowMultiple, executeInEditMode, executionOrder, menu, requireComponent, tooltip, type, serializable } from 'cc.decorator';
import { game } from '../../game';
import { ClearFlag } from '../../gfx/define';
import { Color, Vec3, Rect, Size } from '../../math';
import { view } from '../../platform/view';
import visibleRect from '../../platform/visible-rect';
import { scene } from '../../renderer';
import { Node } from '../../scene-graph/node';
import { Enum } from '../../value-types';
import { Component } from '../component';
import { UITransform } from './ui-transform';
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../global-exports';
import { RenderWindow } from '../../renderer/core/render-window';
import { SystemEventType } from '../../platform/event-manager';

const _worldPos = new Vec3();

const CanvasClearFlag = Enum({
    SOLID_COLOR: ClearFlag.ALL,
    DEPTH_ONLY: ClearFlag.DEPTH_STENCIL,
    DONT_CLEAR: ClearFlag.NONE,
});

const RenderMode = Enum({
    OVERLAY: 0,
    INTERSPERSE: 1,
});

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
@requireComponent(UITransform)
@menu('UI/Canvas')
@executeInEditMode
@disallowMultiple
export class Canvas extends Component {
    /**
     * @en
     * The flags to clear the built in camera.
     *
     * @zh
     * 清理屏幕缓冲标记。
     */
    @type(CanvasClearFlag)
    @tooltip('清理屏幕缓冲标记')
    get clearFlag () {
        return this._clearFlag;
    }

    set clearFlag (val) {
        this._clearFlag = val;
        if (this._camera) {
            this._camera.clearFlag = this._clearFlag;
        }
    }

    /**
     * @en
     * The color clearing value of the builtin camera.
     *
     * @zh
     * 内置相机的颜色缓冲默认值。
     */
    @tooltip('清理颜色缓冲区后的颜色')
    get color () {
        return this._color;
    }

    set color (val) {
        Color.copy(this._color, val);
        if (this._camera) {
            this._camera.clearColor = val;
        }
    }

    /**
     * @en
     * The render mode of Canvas.
     * When you choose the mode of INTERSPERSE, You can specify the rendering order of the Canvas with the camera in the scene.
     * When you choose the mode of OVERLAY, the builtin camera of Canvas will render after all scene cameras are rendered.
     * NOTE: The cameras in the scene (including the Canvas built-in camera) must have a ClearFlag selection of SOLID_COLOR,
     * otherwise a splash screen may appear on the mobile device.
     *
     * @zh
     * Canvas 渲染模式。
     * intersperse 下可以指定 Canvas 与场景中的相机的渲染顺序，overlay 下 Canvas 会在所有场景相机渲染完成后渲染。
     * 注意：场景里的相机（包括 Canvas 内置的相机）必须有一个的 ClearFlag 选择 SOLID_COLOR，否则在移动端可能会出现闪屏。
     */
    @type(RenderMode)
    @tooltip('Canvas 渲染模式，intersperse 下可以指定 Canvas 与场景中的相机的渲染顺序，overlay 下 Canvas 会在所有场景相机渲染完成后渲染。\n注意：注意：场景里的相机（包括 Canvas 内置的相机）必须有一个的 ClearFlag 选择 SOLID_COLOR，否则在移动端可能会出现闪屏')
    get renderMode () {
        return this._renderMode;
    }

    set renderMode (val) {
        this._renderMode = val;
        if (this._camera) {
            this._camera.priority = this._getViewPriority();
        }
    }

    /**
     * @en
     * Camera render priority.
     * When you choose the RenderModel of INTERSPERSE, specifies the render order with other cameras.
     * When you choose the RenderModel of OVERLAY, specifies sorting with the rest of the Canvas.
     *
     * @zh
     * 相机渲染优先级。当 RenderMode 为 intersperse 时，指定与其它相机的渲染顺序，当 RenderMode 为 overlay 时，指定跟其余 Canvas 做排序使用。需要对多 Canvas 设定 priority 以免出现不同平台下的闪屏问题。
     *
     * @param value - 渲染优先级。
     */
    @tooltip('相机排序优先级。当 RenderMode 为 intersperse 时，指定与其它相机的渲染顺序，当 RenderMode 为 overlay 时，指定跟其余 Canvas 做排序使用。需要对多 Canvas 设定 priority 以免出现不同平台下的闪屏问题。')
    get priority () {
        return this._priority;
    }

    set priority (val: number) {
        this._priority = val;
        if (this._camera) {
            this._camera.priority = this._getViewPriority();
        }

        if (legacyCC.director.root && legacyCC.director.root.ui){
            legacyCC.director.root.ui.sortScreens();
        }
    }

    /**
     * @en
     * Set the target render texture.
     *
     * @zh
     * 设置目标渲染纹理。
     */
    @type(RenderTexture)
    @tooltip('目标渲染纹理')
    get targetTexture (){
        return this._targetTexture;
    }

    set targetTexture (value) {
        if (this._targetTexture === value) {
            return;
        }

        const old = this._targetTexture;
        this._targetTexture = value;
        this._checkTargetTextureEvent(old);
        this._updateTargetTexture();
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
    // public static instance: Canvas | null = null;

    @serializable
    protected _priority = 0;
    @serializable
    protected _targetTexture: RenderTexture | null = null;
    @type(CanvasClearFlag)
    protected _clearFlag = CanvasClearFlag.DEPTH_ONLY;
    @serializable
    protected _color = new Color(0, 0, 0, 0);
    @type(RenderMode)
    protected _renderMode = RenderMode.OVERLAY;

    protected _thisOnCameraResized: () => void;
    // fit canvas node to design resolution
    protected _fitDesignResolution: (() => void) | undefined;

    protected _camera: scene.Camera | null = null;
    private _pos = new Vec3();

    constructor () {
        super();
        this._thisOnCameraResized = this._onResizeCamera.bind(this);

        if (EDITOR) {
            this._fitDesignResolution = () => {
                // TODO: support paddings of locked widget
                let nodeSize: Size; let designSize: Size;
                this.node.getPosition(this._pos);
                nodeSize = designSize = view.getDesignResolutionSize();
                Vec3.set(_worldPos, designSize.width * 0.5, designSize.height * 0.5, 1);

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
        // Stretch to matched size during the scene initialization
        let widget = this.getComponent(Widget);
        if (widget) {
            widget.updateAlignment();
        }
        else if (EDITOR) {
            this._fitDesignResolution!();
        }

        const cameraNode = new Node('UICamera_' + this.node.name);
        cameraNode.setPosition(0, 0, 1000);
        if (!EDITOR) {
            this._camera = legacyCC.director.root!.createCamera() as scene.Camera;
            this._camera.initialize({
                name: 'ui_' + this.node.name,
                node: cameraNode,
                projection: Camera.ProjectionType.ORTHO,
                priority: this._getViewPriority(),
                flows: ['UIFlow'],
            });

            this._camera.fov = 45;
            this._camera.clearFlag = this.clearFlag;
            this._camera.farClip = 2000;
            this._camera.viewport = new Rect(0, 0, 1, 1);
            this.color = this._color;

            this._checkTargetTextureEvent(null);
            this._updateTargetTexture();
        }

        if (EDITOR) {
            // Constantly align canvas node in edit mode
            legacyCC.director.on(legacyCC.Director.EVENT_AFTER_UPDATE, this._fitDesignResolution!, this);

            // In Editor can not edit these attrs.
            // (Position in Node, contentSize in uiTransform)
            // (anchor in uiTransform, but it can edit, this is different from cocos creator)
            this._objFlags |= legacyCC.Object.Flags.IsPositionLocked | legacyCC.Object.Flags.IsSizeLocked | legacyCC.Object.Flags.IsAnchorLocked;
        }

        this.node.on(SystemEventType.TRANSFORM_CHANGED, this._thisOnCameraResized);

        legacyCC.director.root!.ui.addScreen(this);
    }

    public onEnable () {
        if (this._camera) {
            legacyCC.director.root!.ui.renderScene.addCamera(this._camera);
        }
    }

    public onDisable () {
        if (this._camera) {
            legacyCC.director.root!.ui.renderScene.removeCamera(this._camera);
        }
    }

    public onDestroy () {
        legacyCC.director.root!.ui.removeScreen(this);
        if (this._camera) {
            legacyCC.director.root!.destroyCamera(this._camera);
        }

        if (EDITOR) {
            legacyCC.director.off(legacyCC.Director.EVENT_AFTER_UPDATE, this._fitDesignResolution!, this);
        }

        if (this._targetTexture) {
            this._targetTexture.off('resize');
        }

        this.node.off(SystemEventType.TRANSFORM_CHANGED, this._thisOnCameraResized);
    }

    protected _onResizeCamera () {
        const camera = this._camera;
        if (camera) {
            if (this._targetTexture) {
                const win = this._targetTexture.window;
                camera.setFixedSize(win!.width, win!.height);
                camera.orthoHeight = visibleRect.height / 2;
            } else {
                const size = game.canvas!;
                camera.resize(size.width, size.height);
                camera.orthoHeight = game.canvas!.height / view.getScaleY() / 2;
            }
            this.node.getWorldPosition(_worldPos);
            camera.node.setPosition(_worldPos.x, _worldPos.y, 1000);
            camera.update();
        }
    }

    protected _checkTargetTextureEvent (old: RenderTexture | null) {
        const resizeFunc = (win: RenderWindow) => {
            if (this._camera) {
                this._camera.setFixedSize(win.width, win.height);
            }
        };

        if (old) {
            old.off('resize');
        }

        if (this._targetTexture) {
            this._targetTexture.on('resize', resizeFunc, this);
        }
    }

    protected _updateTargetTexture () {
        if (!this._camera) {
            return;
        }

        const camera = this._camera;
        if (!this._targetTexture) {
            camera.changeTargetWindow();
            camera.orthoHeight = game.canvas!.height / view.getScaleY() / 2;
            camera.isWindowSize = true;
        } else {
            const win = this._targetTexture.window;
            camera.changeTargetWindow(win);
            camera.orthoHeight = visibleRect.height / 2;
            camera.isWindowSize = false;
        }
    }

    private _getViewPriority () {
        return this._renderMode === RenderMode.OVERLAY ? this._priority | 1 << 30 : this._priority;
    }
}

legacyCC.Canvas = Canvas;
