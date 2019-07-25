/*
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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

import { SystemEventType } from '../platform/event-manager/event-enum';
import { Mat4, Quat, Size, Vec2, Vec3 } from '../value-types';

export interface INode {
    _persistNode: boolean;

    name: string;
    /**
     * @en The uuid for editor, will be stripped before building project.
     * @zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。
     * @property uuid
     * @type {String}
     * @readOnly
     * @example
     * ```
     * cc.log("Node Uuid: " + node.uuid);
     * ```
     */
    uuid: Readonly<string>;
    scene;

    /**
     * @zh
     * 节点所属层，主要影响射线检测、物理碰撞等，参考 [[Layers]]
     */
    layer: number;

    /**
     * @zh
     * 父节点
     */
    parent: this | null;

    /**
     * @zh
     * 孩子节点数组
     */
    children: Readonly<this[]> | null;
    childrenCount: number;

    /**
     * @zh
     * 这个节点的空间变换信息在当前帧内是否有变过？
     */
    hasChanged: Readonly<boolean>;

    /**
     * @en
     * The local active state of this node.<br/>
     * Note that a Node may be inactive because a parent is not active, even if this returns true.<br/>
     * Use {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}
     * if you want to check if the Node is actually treated as active in the scene.
     * @zh
     * 当前节点的自身激活状态。<br/>
     * 值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。<br/>
     * 如果你想检查节点在场景中实际的激活状态可以使用 {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}。
     * @property active
     * @type {Boolean}
     * @default true
     * @example
     * ```
     * node.active = false;
     * ```
     */
    active: boolean;

    /**
     * @en Indicates whether this node is active in the scene.
     * @zh 表示此节点是否在场景中激活。
     * @property activeInHierarchy
     * @type {Boolean}
     * @example
     * ```
     * cc.log("activeInHierarchy: " + node.activeInHierarchy);
     */
    activeInHierarchy: boolean;
    eventProcessor;

    /**
     * @zh
     * 本地坐标
     */
    position: Readonly<Vec3>;

    /**
     * @zh
     * 世界坐标
     */
    worldPosition: Readonly<Vec3>;

    /**
     * @zh
     * 本地缩放
     */
    scale: Readonly<Vec3>;

    /**
     * @zh
     * 世界旋转
     */
    worldScale: Readonly<Vec3>;

    /**
     * @zh
     * 以欧拉角表示的本地旋转值
     */
    eulerAngles: Readonly<Vec3>;

    /**
     * @zh
     * 本地旋转四元数
     */
    rotation: Readonly<Quat>;

    /**
     * @zh
     * 世界旋转四元数
     */
    worldRotation: Readonly<Quat>;

    /**
     * @zh
     * 世界变换矩阵
     */
    worldMatrix: Readonly<Mat4>;

    width: number;
    height: number;
    anchorX: number;
    anchorY: number;
    _uiComp;
    uiTransfromComp;

    isChildOf (parent: this): boolean;
    addChild (child: this);
    getChildByName (name: string);

    addComponent (typeOrClassName: string | Function);
    _removeComponent (component);
    getComponent (typeOrClassName: string | Function);
    getComponents (typeOrClassName: string | Function);
    getComponentInChildren (typeOrClassName: string | Function);
    getComponentsInChildren (typeOrClassName: string | Function);

    getWorldMatrix (out?: Mat4): Mat4;
    getPosition (out?: Vec3): Vec3;
    setPosition (val: Vec3 | number, y?: number, z?: number);
    getWorldPosition (out?: Vec3): Vec3;
    setWorldPosition (val: Vec3 | number, y?: number, z?: number);
    getRotation (out?: Quat): Quat;
    setWorldRotation (val: Quat | number, y?: number, z?: number, w?: number);
    getWorldRotation (out?: Quat): Quat;
    getWorldRT (out?: Mat4): Mat4;
    getScale (out?: Vec3): Vec3;
    setScale (val: Vec3 | number, y?: number, z?: number);
    updateWorldTransform ();
    updateWorldTransformFull ();
    getContentSize (out?: Size): Size;
    setContentSize (size: Size | number, height?: number);
    getAnchorPoint (out?: Vec2): Vec2;
    setAnchorPoint (point: Vec2 | number, y?: number);

    on (type: string | SystemEventType, callback: Function, target?: Object, useCapture?: any);
    off (type: string, callback?: Function, target?: Object, useCapture?: any);
    emit (type: string, ...args: any[]);
    dispatchEvent (event);
}
