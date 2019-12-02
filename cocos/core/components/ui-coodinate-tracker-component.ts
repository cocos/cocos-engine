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

import { ccclass, property, menu, executionOrder } from '../data/class-decorator';
import { Node } from '../scene-graph';
import { convertUtils } from '../utils';
import { CameraComponent } from '../3d';
import { Vec3 } from '../math';
import { Component } from '../components/component';
import { EventHandler } from './component-event-handler';

/**
 * @zh 3D 节点映射 UI 节点组件
 * 主要提供映射后的转换世界坐标以及模拟透视相机远近比。
 */
@ccclass('cc.UICoordinateTrackerComponent')
@menu('Components/UICoordinateTracker')
@executionOrder(110)
export class UICoordinateTrackerComponent extends Component {
    /**
     * @zh
     * 目标对象。
     */
    @property({
        type: Node,
        tooltip: '目标对象',
    })
    get target () {
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
     * @zh
     * 照射相机。
     */
    @property({
        type: CameraComponent,
        tooltip: '照射相机',
    })
    get camera () {
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
     * @zh
     * 是否是缩放映射。
     */
    @property({
        tooltip: '是否是缩放映射',
    })
    get useScale () {
        return this._useScale;
    }

    set useScale (value) {
        if (this._useScale === value) {
            return;
        }

        this._useScale = value;
    }

    /**
     * @zh
     * 距相机多少距离为正常显示计算大小。
     */
    @property({
        tooltip: '距相机多少距离为正常显示计算大小',
    })
    get distance () {
        return this._distance;
    }

    set distance (value) {
        if (this._distance === value) {
            return;
        }

        this._distance = value;
    }

    /**
     * @zh
     * 映射数据事件。回调的第一个参数是映射后的本地坐标，第二个是距相机距离比。
     */
    @property({
        type: [EventHandler],
        tooltip: '映射数据事件。回调的第一个参数是映射后的本地坐标，第二个是距相机距离比',
    })
    public syncEvents: EventHandler[] = [];

    @property
    protected _target: Node | null = null;
    @property
    protected _camera: CameraComponent | null = null;
    @property
    protected _useScale = true;
    @property
    protected _distance = 1;

    protected _transformPos = new Vec3();
    protected _viewPos = new Vec3();
    protected _canMove = true;
    protected _lastWpos = new Vec3();

    public onEnable () {
        this._checkCanMove();
    }

    public update () {
        const wpos = this.node.worldPosition;
        // @ts-ignore
        if (!this._canMove || !this._camera!._camera || this._lastWpos.equals(wpos)) {
            return;
        }

        this._lastWpos.set(wpos);
        const camera = this._camera!;
        // [HACK]
        // @ts-ignore
        camera._camera.update();
        convertUtils.WorldNode3DToLocalNodeUI(camera, wpos, this._target!, this._transformPos);
        if (this._useScale) {
            // @ts-ignore
            Vec3.transformMat4(this._viewPos, this.node.worldPosition, camera._camera!.matView);
        }

        if (this.syncEvents.length > 0) {
            const data = this._distance / Math.abs(this._viewPos.z);
            EventHandler.emitEvents(this.syncEvents, this._transformPos, data);
        }
    }

    protected _checkCanMove () {
        this._canMove = !!(this._camera && this._target);
    }
}
