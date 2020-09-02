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
 * @category component
 */

import { Component } from '../../core/components/component';
import { EventHandler } from '../../core/components/component-event-handler';
import { ccclass, help, menu, executionOrder, tooltip, type, serializable } from 'cc.decorator';
import { Node } from '../../core/scene-graph';
import { convertUtils } from '../../core/utils';
import { Camera } from '../../core/3d';
import { Vec3 } from '../../core/math';

/**
 * @zh 3D 节点映射 UI 节点组件
 * 主要提供映射后的转换世界坐标以及模拟透视相机远近比。
 */
@ccclass('cc.UICoordinateTracker')
@help('i18n:cc.UICoordinateTracker')
@menu('UI/UICoordinateTracker')
@executionOrder(110)
export class UICoordinateTracker extends Component {
    /**
     * @zh
     * 目标对象。
     */
    @type(Node)
    @tooltip('目标对象')
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
    @type(Camera)
    @tooltip('照射相机')
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
    @tooltip('是否是缩放映射')
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
    @tooltip('距相机多少距离为正常显示计算大小')
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
    @type([EventHandler])
    @serializable
    @tooltip('映射数据事件。回调的第一个参数是映射后的本地坐标，第二个是距相机距离比')
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
    protected _lastWpos = new Vec3();
    protected _lastCameraPos = new Vec3();

    public onEnable () {
        this._checkCanMove();
    }

    public update () {
        const wpos = this.node.worldPosition;
        const camera = this._camera;
        // @ts-ignore
        if (!this._canMove || !camera._camera || (this._lastWpos.equals(wpos) && this._lastCameraPos.equals(camera!.node.worldPosition))) {
            return;
        }

        this._lastWpos.set(wpos);
        this._lastCameraPos.set(camera!.node.worldPosition);
        // [HACK]
        // @ts-ignore
        camera._camera.update();
        convertUtils.WorldNode3DToLocalNodeUI(camera!, wpos, this._target!, this._transformPos);
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
