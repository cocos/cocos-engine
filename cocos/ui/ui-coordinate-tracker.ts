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

import { ccclass, help, menu, executionOrder, tooltip, type, serializable } from 'cc.decorator';
import { Component } from '../scene-graph/component';
import { EventHandler } from '../scene-graph/component-event-handler';
import { Node } from '../scene-graph/node';
import { Camera } from '../misc/camera-component';
import { Vec3 } from '../core/math';

/**
 * @en The component that converts 3D node coordinates to UI node coordinates.
 * It mainly provides the converted world coordinates after mapping and the perspective ratio of the simulated perspective camera.
 * @zh 3D 节点坐标转换到 UI 节点坐标组件
 * 主要提供映射后的转换世界坐标以及模拟透视相机远近比。
 */
@ccclass('cc.UICoordinateTracker')
@help('i18n:cc.UICoordinateTracker')
@menu('UI/UICoordinateTracker')
@executionOrder(110)
export class UICoordinateTracker extends Component {
    /**
     * @en
     * Target node.
     *
     * @zh
     * 目标对象。
     */
    @type(Node)
    @tooltip('i18n:UICoordinateTracker.target')
    get target (): Node | null {
        return this._target;
    }

    set target (value) {
        if (this._target === value) {
            return;
        }

        this._target = value;
        this._checkCanMove();
    }

    /**
     * @en
     * The 3D camera representing the original coordinate system.
     *
     * @zh
     * 照射相机。
     */
    @type(Camera)
    @tooltip('i18n:UICoordinateTracker.camera')
    get camera (): Camera | null {
        return this._camera;
    }

    set camera (value) {
        if (this._camera === value) {
            return;
        }

        this._camera = value;
        this._checkCanMove();
    }

    /**
     * @en
     * Whether to scale the converted 2d node's size according to the distance between the camera and the 3d node.
     *
     * @zh
     * 是否是缩放映射。
     */
    @tooltip('i18n:UICoordinateTracker.use_scale')
    get useScale (): boolean {
        return this._useScale;
    }

    set useScale (value) {
        if (this._useScale === value) {
            return;
        }

        this._useScale = value;
    }

    /**
     * @en
     * The distance from the camera for displaying the 2d node in normal size.
     *
     * @zh
     * 距相机多少距离为正常显示计算大小。
     */
    @tooltip('i18n:UICoordinateTracker.distance')
    get distance (): number {
        return this._distance;
    }

    set distance (value) {
        if (this._distance === value) {
            return;
        }

        this._distance = value;
    }

    /**
     * @en
     * Event callback after coordinates synchronization.
     * The first parameter of the callback is the mapped local coordinate in UI camera.
     * The second parameter is the distance scale of the 3d node from the 3d camera viewport.
     *
     * @zh
     * 映射数据事件。回调的第一个参数是映射后的本地坐标，第二个是距相机距离比。
     */
    @type([EventHandler])
    @serializable
    @tooltip('i18n:UICoordinateTracker.sync_events')
    public syncEvents: EventHandler[] = [];

    @serializable
    protected _target: Node | null = null;
    @serializable
    protected _camera: Camera | null = null;
    @serializable
    protected _useScale = true;
    @serializable
    protected _distance = 1;

    protected _transformPos = new Vec3();
    protected _viewPos = new Vec3();
    protected _canMove = true;
    protected _lastWPos = new Vec3();
    protected _lastCameraPos = new Vec3();

    public onEnable (): void {
        this._checkCanMove();
    }

    public update (): void {
        const wPos = this.node.worldPosition;
        const camera = this._camera;
        if (!this._canMove || !camera || !camera.camera || (this._lastWPos.equals(wPos) && this._lastCameraPos.equals(camera.node.worldPosition))) {
            return;
        }

        this._lastWPos.set(wPos);
        this._lastCameraPos.set(camera.node.worldPosition);
        // [HACK]
        camera.camera.update();
        camera.convertToUINode(wPos, this._target!, this._transformPos);
        if (this._useScale) {
            Vec3.transformMat4(this._viewPos, this.node.worldPosition, camera.camera.matView);
        }

        if (this.syncEvents.length > 0) {
            const data = this._distance / Math.abs(this._viewPos.z);
            EventHandler.emitEvents(this.syncEvents, this._transformPos, data);
        }
    }

    protected _checkCanMove (): void {
        this._canMove = !!(this._camera && this._target);
    }
}
