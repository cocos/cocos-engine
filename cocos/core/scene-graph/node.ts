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
 * @category scene-graph
 */

import { UIComponent, UITransformComponent } from '../components/ui-base';
import { ccclass, property } from '../data/class-decorator';
import { Mat3, Mat4, Quat, Size, Vec2, Vec3 } from '../math';
import { SystemEventType } from '../platform/event-manager/event-enum';
import { eventManager } from '../platform/event-manager/event-manager';
import { BaseNode, TRANSFORM_ON } from './base-node';
import { Layers } from './layers';
import { NodeSpace, TransformBit } from './node-enum';
import { NodeUIProperties } from './node-ui-properties';
import { legacyCC } from '../global-exports';

const v3_a = new Vec3();
const q_a = new Quat();
const q_b = new Quat();
const array_a = new Array(10);
const qt_1 = new Quat();
const m3_1 = new Mat3();
const m3_scaling = new Mat3();
const m4_1 = new Mat4();
const bookOfChange = new Map<string, number>();

/**
 * @zh
 * 场景树中的基本节点，基本特性有：
 * * 具有层级关系
 * * 持有各类组件
 * * 维护空间变换（坐标、旋转、缩放）信息
 */
@ccclass('cc.Node')
export class Node extends BaseNode {
    public static bookOfChange = bookOfChange;

    /**
     * @zh
     * 节点可能发出的事件类型
     */
    public static EventType = SystemEventType;
    /**
     * @zh
     * 空间变换操作的坐标系
     */
    public static NodeSpace = NodeSpace;
    /**
     * @zh
     * 节点变换更新的具体部分
     * @deprecated 请使用 [Node.TransformBit]
     */
    public static TransformDirtyBit = TransformBit;
    /**
     * @zh
     * 节点变换更新的具体部分,可用于判断 TRANSFORM_CHANGED 事件的具体类型
     */
    public static TransformBit = TransformBit;

    /**
     * @zh
     * 指定对象是否是普通的场景节点？
     * @param obj 待测试的节点
     */
    public static isNode (obj: object | null): obj is Node {
        return obj instanceof Node && (obj.constructor === Node || !(obj instanceof legacyCC.Scene));
    }

    // UI 部分的脏数据
    public _uiProps = new NodeUIProperties(this);
    public _static = false;

    // world transform, don't access this directly
    protected _pos = new Vec3();
    protected _rot = new Quat();
    protected _scale = new Vec3(1, 1, 1);
    protected _mat = new Mat4();

    // local transform
    @property
    protected _lpos = new Vec3();
    @property
    protected _lrot = new Quat();
    @property
    protected _lscale = new Vec3(1, 1, 1);
    @property
    protected _layer = Layers.Enum.DEFAULT; // the layer this node belongs to

    // local rotation in euler angles, maintained here so that rotation angles could be greater than 360 degree.
    @property
    protected _euler = new Vec3();

    protected _dirtyFlags = TransformBit.NONE; // does the world transform need to update?
    protected _eulerDirty = false;

    /**
     * @zh
     * 本地坐标
     */
    // @constget
    public get position (): Readonly<Vec3> {
        return this._lpos;
    }
    public set position (val: Readonly<Vec3>) {
        this.setPosition(val);
    }

    /**
     * @zh
     * 世界坐标
     */
    // @constget
    public get worldPosition (): Readonly<Vec3> {
        this.updateWorldTransform();
        return this._pos;
    }
    public set worldPosition (val: Readonly<Vec3>) {
        this.setWorldPosition(val);
    }

    /**
     * @zh
     * 本地旋转
     */
    // @constget
    public get rotation (): Readonly<Quat> {
        return this._lrot;
    }
    public set rotation (val: Readonly<Quat>) {
        this.setRotation(val);
    }

    /**
     * @zh
     * 以欧拉角表示的本地旋转值
     */
    @property({ type: Vec3 })
    set eulerAngles (val: Readonly<Vec3>) {
        this.setRotationFromEuler(val.x, val.y, val.z);
    }
    get eulerAngles () {
        if (this._eulerDirty) {
            Quat.toEuler(this._euler, this._lrot);
            this._eulerDirty = false;
        }
        return this._euler;
    }

    /**
     * @zh
     * 世界旋转
     */
    // @constget
    public get worldRotation (): Readonly<Quat> {
        this.updateWorldTransform();
        return this._rot;
    }
    public set worldRotation (val: Readonly<Quat>) {
        this.setWorldRotation(val);
    }

    /**
     * @zh
     * 本地缩放
     */
    // @constget
    public get scale (): Readonly<Vec3> {
        return this._lscale;
    }
    public set scale (val: Readonly<Vec3>) {
        this.setScale(val);
    }

    /**
     * @zh
     * 世界缩放
     */
    // @constget
    public get worldScale (): Readonly<Vec3> {
        this.updateWorldTransform();
        return this._scale;
    }
    public set worldScale (val: Readonly<Vec3>) {
        this.setWorldScale(val);
    }

    /**
     * @zh
     * 本地变换矩阵
     */
    public set matrix (val: Readonly<Mat4>) {
        Mat4.toRTS(val, this._lrot, this._lpos, this._lscale);
        this.invalidateChildren(TransformBit.TRS);
        this._eulerDirty = true;
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.TRS);
        }
    }

    /**
     * @zh
     * 世界变换矩阵
     */
    // @constget
    public get worldMatrix (): Readonly<Mat4> {
        this.updateWorldTransform();
        return this._mat;
    }

    /**
     * @zh
     * 当前节点面向的前方方向，默认前方为 -z 方向
     */
    get forward (): Vec3 {
        return Vec3.transformQuat(new Vec3(), Vec3.FORWARD, this.worldRotation);
    }
    set forward (dir: Vec3) {
        const len = dir.length();
        Vec3.multiplyScalar(v3_a, dir, -1 / len);
        Quat.fromViewUp(q_a, v3_a);
        this.setWorldRotation(q_a);
    }

    /**
     * @zh
     * 节点所属层，主要影响射线检测、物理碰撞等，参考 [[Layers]]
     */
    @property
    set layer (l) {
        this._layer = l;
    }
    get layer () {
        return this._layer;
    }

    /**
     * @zh
     * 这个节点的空间变换信息在当前帧内是否有变过？
     */
    get hasChangedFlags () {
        return bookOfChange.get(this._id) || 0;
    }
    set hasChangedFlags (val: number) {
        bookOfChange.set(this._id, val);
    }

    // ===============================
    // for backward-compatibility
    // ===============================

    get width () {
        return this._uiProps.uiTransformComp!.width;
    }
    set width (value: number) {
        this._uiProps.uiTransformComp!.width = value;
    }

    get height () {
        return this._uiProps.uiTransformComp!.height;
    }
    set height (value: number) {
        this._uiProps.uiTransformComp!.height = value;
    }

    get anchorX () {
        return this._uiProps.uiTransformComp!.anchorX;
    }
    set anchorX (value) {
        this._uiProps.uiTransformComp!.anchorX = value;
    }

    get anchorY () {
        return this._uiProps.uiTransformComp!.anchorY;
    }
    set anchorY (value: number) {
        this._uiProps.uiTransformComp!.anchorY = value;
    }

    // ===============================
    // hierarchy
    // ===============================

    /**
     * @zh
     * 设置父节点
     * @param value 父节点
     * @param keepWorldTransform 是否保留当前世界变换
     */
    public setParent (value: this | null, keepWorldTransform: boolean = false) {
        if (keepWorldTransform) { this.updateWorldTransform(); }
        super.setParent(value, keepWorldTransform);
    }

    public _onSetParent (oldParent: this | null, keepWorldTransform: boolean) {
        super._onSetParent(oldParent, keepWorldTransform);
        if (keepWorldTransform) {
            const parent = this._parent;
            if (parent) {
                parent.updateWorldTransform();
                Mat4.multiply(m4_1, Mat4.invert(m4_1, parent._mat), this._mat);
                Mat4.toRTS(m4_1, this._lrot, this._lpos, this._lscale);
            } else {
                Vec3.copy(this._lpos, this._pos);
                Quat.copy(this._lrot, this._rot);
                Vec3.copy(this._lscale, this._scale);
            }
            this._eulerDirty = true;
        }

        this.invalidateChildren(TransformBit.TRS);
    }

    public _onBatchCreated () {
        super._onBatchCreated();
        bookOfChange.set(this._id, TransformBit.TRS);
        this._dirtyFlags = TransformBit.TRS;
        const len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this._children[i]._onBatchCreated();
        }
    }

    public _onBatchRestored () {
        this._onBatchCreated();
    }

    public _onBeforeSerialize () {
        // tslint:disable-next-line: no-unused-expression
        this.eulerAngles; // make sure we save the correct eulerAngles
    }

    // ===============================
    // transform helper, convenient but not the most efficient
    // ===============================

    /**
     * @zh
     * 移动节点
     * @param trans 位置增量
     * @param ns 操作空间
     */
    public translate (trans: Vec3, ns?: NodeSpace): void {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            Vec3.transformQuat(v3_a, trans, this._lrot);
            this._lpos.x += v3_a.x;
            this._lpos.y += v3_a.y;
            this._lpos.z += v3_a.z;
        } else if (space === NodeSpace.WORLD) {
            if (this._parent) {
                Quat.invert(q_a, this._parent.worldRotation);
                Vec3.transformQuat(v3_a, trans, q_a);
                const scale = this.worldScale;
                this._lpos.x += v3_a.x / scale.x;
                this._lpos.y += v3_a.y / scale.y;
                this._lpos.z += v3_a.z / scale.z;
            } else {
                this._lpos.x += trans.x;
                this._lpos.y += trans.y;
                this._lpos.z += trans.z;
            }
        }

        this.invalidateChildren(TransformBit.POSITION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.POSITION);
        }
    }

    /**
     * @zh
     * 旋转节点
     * @param trans 旋转增量
     * @param ns 操作空间
     */
    public rotate (rot: Quat, ns?: NodeSpace): void {
        const space = ns || NodeSpace.LOCAL;
        Quat.normalize(q_a, rot);

        if (space === NodeSpace.LOCAL) {
            Quat.multiply(this._lrot, this._lrot, q_a);
        } else if (space === NodeSpace.WORLD) {
            const worldRot = this.worldRotation;
            Quat.multiply(q_b, q_a, worldRot);
            Quat.invert(q_a, worldRot);
            Quat.multiply(q_b, q_a, q_b);
            Quat.multiply(this._lrot, this._lrot, q_b);
        }
        this._eulerDirty = true;

        this.invalidateChildren(TransformBit.ROTATION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.ROTATION);
        }
    }

    /**
     * @zh
     * 设置当前节点旋转为面向目标位置，默认前方为 -z 方向
     * @param pos 目标位置
     * @param up 坐标系的上方向
     */
    public lookAt (pos: Vec3, up?: Vec3): void {
        this.getWorldPosition(v3_a);
        Vec3.subtract(v3_a, v3_a, pos);
        Vec3.normalize(v3_a, v3_a);
        Quat.fromViewUp(q_a, v3_a, up);
        this.setWorldRotation(q_a);
    }

    // ===============================
    // transform maintainer
    // ===============================

    /**
     * @en
     * invalidate the world transform information
     * for this node and all its children recursively
     * @zh
     * 递归标记节点世界变换为 dirty
     */
    public invalidateChildren (dirtyBit: TransformBit) {
        if ((this._dirtyFlags & this.hasChangedFlags & dirtyBit) === dirtyBit) { return; }
        this._dirtyFlags |= dirtyBit;
        bookOfChange.set(this._id, this.hasChangedFlags | dirtyBit);
        dirtyBit |= TransformBit.POSITION;
        const len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this._children[i].invalidateChildren(dirtyBit);
        }
    }

    /**
     * @en
     * update the world transform information if outdated
     * @zh
     * 更新节点的世界变换信息
     */
    public updateWorldTransform () {
        if (!this._dirtyFlags) { return; }
        let cur: this | null = this;
        let i = 0;
        while (cur && cur._dirtyFlags) {
            // top level node
            array_a[i++] = cur;
            cur = cur._parent;
        }
        let child: this; let dirtyBits = 0;
        while (i) {
            child = array_a[--i];
            dirtyBits |= child._dirtyFlags;
            if (cur) {
                if (dirtyBits & TransformBit.POSITION) {
                    Vec3.transformMat4(child._pos, child._lpos, cur._mat);
                    child._mat.m12 = child._pos.x;
                    child._mat.m13 = child._pos.y;
                    child._mat.m14 = child._pos.z;
                }
                if (dirtyBits & TransformBit.RS) {
                    Mat4.fromRTS(child._mat, child._lrot, child._lpos, child._lscale);
                    Mat4.multiply(child._mat, cur._mat, child._mat);
                    if (dirtyBits & TransformBit.ROTATION) {
                        Quat.multiply(child._rot, cur._rot, child._lrot);
                    }
                    Mat3.fromQuat(m3_1, Quat.conjugate(qt_1, child._rot));
                    Mat3.multiplyMat4(m3_1, m3_1, child._mat);
                    child._scale.x = m3_1.m00;
                    child._scale.y = m3_1.m04;
                    child._scale.z = m3_1.m08;
                }
            } else {
                if (dirtyBits & TransformBit.POSITION) {
                    Vec3.copy(child._pos, child._lpos);
                    child._mat.m12 = child._pos.x;
                    child._mat.m13 = child._pos.y;
                    child._mat.m14 = child._pos.z;
                }
                if (dirtyBits & TransformBit.RS) {
                    if (dirtyBits & TransformBit.ROTATION) {
                        Quat.copy(child._rot, child._lrot);
                    } else {
                        Vec3.copy(child._scale, child._lscale);
                    }
                    Mat4.fromRTS(child._mat, child._rot, child._pos, child._scale);
                }
            }
            child._dirtyFlags = TransformBit.NONE;
            cur = child;
        }
    }

    // ===============================
    // transform
    // ===============================

    /**
     * @zh
     * 设置本地坐标
     * @param position 目标本地坐标
     */
    public setPosition (position: Vec3): void;

    /**
     * @zh
     * 设置本地坐标
     * @param x 目标本地坐标的 X 分量
     * @param y 目标本地坐标的 Y 分量
     * @param z 目标本地坐标的 Z 分量
     * @param w 目标本地坐标的 W 分量
     */
    public setPosition (x: number, y: number, z: number): void;

    public setPosition (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            Vec3.copy(this._lpos, val as Vec3);
        } else {
            Vec3.set(this._lpos, val as number, y, z);
        }

        this.invalidateChildren(TransformBit.POSITION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.POSITION);
        }
    }

    /**
     * @zh
     * 获取本地坐标
     * @param out 输出到此目标 vector
     */
    public getPosition (out?: Vec3): Vec3 {
        if (out) {
            return Vec3.set(out, this._lpos.x, this._lpos.y, this._lpos.z);
        } else {
            return Vec3.copy(new Vec3(), this._lpos);
        }
    }

    /**
     * @zh
     * 设置本地旋转
     * @param rotation 目标本地旋转
     */
    public setRotation (rotation: Quat): void;

    /**
     * @zh
     * 设置本地旋转
     * @param x 目标本地旋转的 X 分量
     * @param y 目标本地旋转的 Y 分量
     * @param z 目标本地旋转的 Z 分量
     * @param w 目标本地旋转的 W 分量
     */
    public setRotation (x: number, y: number, z: number, w: number): void;

    public setRotation (val: Quat | number, y?: number, z?: number, w?: number) {
        if (y === undefined || z === undefined || w === undefined) {
            Quat.copy(this._lrot, val as Quat);
        } else {
            Quat.set(this._lrot, val as number, y, z, w);
        }
        this._eulerDirty = true;

        this.invalidateChildren(TransformBit.ROTATION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.ROTATION);
        }
    }

    /**
     * @zh
     * 通过欧拉角设置本地旋转
     * @param x - 目标欧拉角的 X 分量
     * @param y - 目标欧拉角的 Y 分量
     * @param z - 目标欧拉角的 Z 分量
     */
    public setRotationFromEuler (x: number, y: number, z: number): void {
        Vec3.set(this._euler, x, y, z);
        Quat.fromEuler(this._lrot, x, y, z);
        this._eulerDirty = false;

        this.invalidateChildren(TransformBit.ROTATION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.ROTATION);
        }
    }

    /**
     * @zh
     * 获取本地旋转
     * @param out 输出到此目标 quaternion
     */
    public getRotation (out?: Quat): Quat {
        if (out) {
            return Quat.set(out, this._lrot.x, this._lrot.y, this._lrot.z, this._lrot.w);
        } else {
            return Quat.copy(new Quat(), this._lrot);
        }
    }

    /**
     * @zh
     * 设置本地缩放
     * @param scale 目标本地缩放
     */
    public setScale (scale: Vec3): void;

    /**
     * @zh
     * 设置本地缩放
     * @param x 目标本地缩放的 X 分量
     * @param y 目标本地缩放的 Y 分量
     * @param z 目标本地缩放的 Z 分量
     */
    public setScale (x: number, y: number, z: number): void;

    public setScale (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            Vec3.copy(this._lscale, val as Vec3);
        } else {
            Vec3.set(this._lscale, val as number, y, z);
        }

        this.invalidateChildren(TransformBit.SCALE);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.SCALE);
        }
    }

    /**
     * @zh
     * 获取本地缩放
     * @param out 输出到此目标 vector
     */
    public getScale (out?: Vec3): Vec3 {
        if (out) {
            return Vec3.set(out, this._lscale.x, this._lscale.y, this._lscale.z);
        } else {
            return Vec3.copy(new Vec3(), this._lscale);
        }
    }

    public inverseTransformPoint (out: Vec3, p: Vec3) {
        Vec3.copy(out, p);
        let cur = this; let i = 0;
        while (cur._parent) {
            array_a[i++] = cur;
            cur = cur._parent;
        }
        while (i >= 0) {
            Vec3.transformInverseRTS(out, out, cur._lrot, cur._lpos, cur._lscale);
            cur = array_a[--i];
        }
        return out;
    }

    /**
     * @zh
     * 设置世界坐标
     * @param position 目标世界坐标
     */
    public setWorldPosition (position: Vec3): void;

    /**
     * @zh
     * 设置世界坐标
     * @param x 目标世界坐标的 X 分量
     * @param y 目标世界坐标的 Y 分量
     * @param z 目标世界坐标的 Z 分量
     * @param w 目标世界坐标的 W 分量
     */
    public setWorldPosition (x: number, y: number, z: number): void;

    public setWorldPosition (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            Vec3.copy(this._pos, val as Vec3);
        } else {
            Vec3.set(this._pos, val as number, y, z);
        }
        const parent = this._parent;
        const local = this._lpos;
        if (parent) {
            // TODO: benchmark these approaches
            /* */
            parent.updateWorldTransform();
            Vec3.transformMat4(local, this._pos, Mat4.invert(m4_1, parent._mat));
            /* *
            parent.inverseTransformPoint(local, this._pos);
            /* */
        } else {
            Vec3.copy(local, this._pos);
        }

        this.invalidateChildren(TransformBit.POSITION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.POSITION);
        }
    }

    /**
     * @zh
     * 获取世界坐标
     * @param out 输出到此目标 vector
     */
    public getWorldPosition (out?: Vec3): Vec3 {
        this.updateWorldTransform();
        if (out) {
            return Vec3.copy(out, this._pos);
        } else {
            return Vec3.copy(new Vec3(), this._pos);
        }
    }

    /**
     * @zh
     * 设置世界旋转
     * @param rotation 目标世界旋转
     */
    public setWorldRotation (rotation: Quat): void;

    /**
     * @zh
     * 设置世界旋转
     * @param x 目标世界旋转的 X 分量
     * @param y 目标世界旋转的 Y 分量
     * @param z 目标世界旋转的 Z 分量
     * @param w 目标世界旋转的 W 分量
     */
    public setWorldRotation (x: number, y: number, z: number, w: number): void;

    public setWorldRotation (val: Quat | number, y?: number, z?: number, w?: number) {
        if (y === undefined || z === undefined || w === undefined) {
            Quat.copy(this._rot, val as Quat);
        } else {
            Quat.set(this._rot, val as number, y, z, w);
        }
        if (this._parent) {
            this._parent.updateWorldTransform();
            Quat.multiply(this._lrot, Quat.conjugate(this._lrot, this._parent._rot), this._rot);
        } else {
            Quat.copy(this._lrot, this._rot);
        }
        this._eulerDirty = true;

        this.invalidateChildren(TransformBit.ROTATION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.ROTATION);
        }
    }

    /**
     * @zh
     * 通过欧拉角设置世界旋转
     * @param x - 目标欧拉角的 X 分量
     * @param y - 目标欧拉角的 Y 分量
     * @param z - 目标欧拉角的 Z 分量
     */
    public setWorldRotationFromEuler (x: number, y: number, z: number): void {
        Quat.fromEuler(this._rot, x, y, z);
        if (this._parent) {
            this._parent.updateWorldTransform();
            Quat.multiply(this._lrot, Quat.conjugate(this._lrot, this._parent._rot), this._rot);
        } else {
            Quat.copy(this._lrot, this._rot);
        }
        this._eulerDirty = true;

        this.invalidateChildren(TransformBit.ROTATION);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.ROTATION);
        }
    }

    /**
     * @zh
     * 获取世界旋转
     * @param out 输出到此目标 quaternion
     */
    public getWorldRotation (out?: Quat): Quat {
        this.updateWorldTransform();
        if (out) {
            return Quat.copy(out, this._rot);
        } else {
            return Quat.copy(new Quat(), this._rot);
        }
    }

    /**
     * @zh
     * 设置世界缩放
     * @param scale 目标世界缩放
     */
    public setWorldScale (scale: Vec3): void;

    /**
     * @zh
     * 设置世界缩放
     * @param x 目标世界缩放的 X 分量
     * @param y 目标世界缩放的 Y 分量
     * @param z 目标世界缩放的 Z 分量
     */
    public setWorldScale (x: number, y: number, z: number): void;

    public setWorldScale (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            Vec3.copy(this._scale, val as Vec3);
        } else {
            Vec3.set(this._scale, val as number, y, z);
        }
        const parent = this._parent;
        if (parent) {
            parent.updateWorldTransform();
            Mat3.fromQuat(m3_1, Quat.conjugate(qt_1, parent._rot));
            Mat3.multiplyMat4(m3_1, m3_1, parent._mat);
            m3_scaling.m00 = this._scale.x;
            m3_scaling.m04 = this._scale.y;
            m3_scaling.m08 = this._scale.z;
            Mat3.multiply(m3_1, m3_scaling, Mat3.invert(m3_1, m3_1));
            this._lscale.x = m3_1.m00;
            this._lscale.y = m3_1.m04;
            this._lscale.z = m3_1.m08;
        } else {
            Vec3.copy(this._lscale, this._scale);
        }

        this.invalidateChildren(TransformBit.SCALE);
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.SCALE);
        }
    }

    /**
     * @zh
     * 获取世界缩放
     * @param out 输出到此目标 vector
     */
    public getWorldScale (out?: Vec3): Vec3 {
        this.updateWorldTransform();
        if (out) {
            return Vec3.copy(out, this._scale);
        } else {
            return Vec3.copy(new Vec3(), this._scale);
        }
    }

    /**
     * @zh
     * 获取世界变换矩阵
     * @param out 输出到此目标矩阵
     */
    public getWorldMatrix (out?: Mat4): Mat4 {
        this.updateWorldTransform();
        if (!out) { out = new Mat4(); }
        return Mat4.copy(out, this._mat);
    }

    /**
     * @zh
     * 获取只包含旋转和缩放的世界变换矩阵
     * @param out 输出到此目标矩阵
     */
    public getWorldRS (out?: Mat4): Mat4 {
        this.updateWorldTransform();
        if (!out) { out = new Mat4(); }
        Mat4.copy(out, this._mat);
        out.m12 = 0; out.m13 = 0; out.m14 = 0;
        return out;
    }

    /**
     * @zh
     * 获取只包含旋转和位移的世界变换矩阵
     * @param out 输出到此目标矩阵
     */
    public getWorldRT (out?: Mat4): Mat4 {
        this.updateWorldTransform();
        if (!out) { out = new Mat4(); }
        return Mat4.fromRT(out, this._rot, this._pos);
    }

    /**
     * @zh
     * 一次性设置所有局部变换（平移、旋转、缩放）信息
     */
    public setRTS (rot?: Quat, pos?: Vec3, scale?: Vec3) {
        if (rot) { Quat.copy(this._lrot, rot); }
        if (pos) { Vec3.copy(this._lpos, pos); }
        if (scale) { Vec3.copy(this._lscale, scale); }
        this.invalidateChildren(TransformBit.TRS);
        this._eulerDirty = true;
        if (this._eventMask & TRANSFORM_ON) {
            this.emit(SystemEventType.TRANSFORM_CHANGED, TransformBit.TRS);
        }
    }

    // ===============================
    // for backward-compatibility
    // ===============================

    public getAnchorPoint (out?: Vec2): Vec2 {
        if (!out) {
            out = new Vec2();
        }
        out.set(this._uiProps.uiTransformComp!.anchorPoint);
        return out;
    }

    public setAnchorPoint (point: Vec2 | number, y?: number) {
        this._uiProps.uiTransformComp!.setAnchorPoint(point, y);
    }

    public getContentSize (out?: Size): Size {
        if (!out) {
            out = new Size();
        }

        out.set(this._uiProps.uiTransformComp!.contentSize);
        return out;
    }

    public setContentSize (size: Size | number, height?: number) {
        this._uiProps.uiTransformComp!.setContentSize(size, height);
    }

    public pauseSystemEvents (recursive: boolean): void {
        // @ts-ignore
        eventManager.pauseTarget(this, recursive);
    }

    public resumeSystemEvents (recursive: boolean): void {
        // @ts-ignore
        eventManager.resumeTarget(this, recursive);
    }

    public _onPostActivated (active) {
        if (active) {
            eventManager.resumeTarget(this);
            this.eventProcessor.reattach();
        }
        else {
            // deactivate
            eventManager.pauseTarget(this);
        }
    }

    public _onPreDestroy () {
        this._eventProcessor.destroy();
        super._onPreDestroy();
    }
}

legacyCC.Node = Node;
