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
import { Mat4, Quat, Size, Vec2, Vec3 } from '../math';
import { Scene } from '../../scene-graph/scene';
import { NodeEventProcessor } from '../../scene-graph/node-event-processor';
import { Component } from '../../components/component';
import { Event } from '../event';

export interface IBaseNode {

    /**
     * @zh
     * 是否为常驻节点，与节点的自动释放有关
     */
    _persistNode: boolean;

    /**
     * @en Name of node.
     * @zh 该节点名称。
     * @property name
     * @type {String}
     * @example
     * ```
     * node.name = "New Node";
     * cc.log("Node Name: " + node.name);
     * ```
     */
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

    /**
     * @zh
     * 父节点
     */
    parent: this | null;

    /**
     * @zh
     * 孩子节点数组
     */
    children: Readonly<this[]>;

    /**
     * @en All children nodes.
     * @zh 节点的子节点数量。
     * @property childrenCount
     * @type {Number}
     * @readOnly
     * @example
     * ```
     * var count = node.childrenCount;
     * cc.log("Node Children Count: " + count);
     * ```
     */
    childrenCount: Readonly<number>;

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

    /**
     * @en which scene this node belongs to.
     * @zh 此节点属于哪个场景。
     * @type {cc.Scene}}
     */
    scene: Readonly<Scene> | null;

    /**
     * @en
     * Gets all components attached to this node.
     * @zh
     * 获取此节点上所有的组件
     */
    components: ReadonlyArray<Component>;

    /**
     * @en Get parent of the node.
     * @zh 获取该节点的父节点。
     * @example
     * ```
     * var parent = this.node.getParent();
     * ```
     */
    getParent (): this | null;

    /**
     * @en Set parent of the node.
     * @zh 设置该节点的父节点。
     * @example
     * ```
     * node.setParent(newNode);
     * ```
     */
    setParent (value: this | null, keepWorldTransform?: boolean): void;

    /**
     * @en Is this node a child of the given node?
     * @zh 是否是指定节点的子节点？
     * @return True if this node is a child, deep child or identical to the given node.
     * @example
     * ```
     * node.isChildOf(newNode);
     * ```
     */
    isChildOf (parent: this): boolean;

    /**
     * @zh 增加一个孩子节点
     * @param child 孩子节点
     */
    addChild (child: this): void;

    /**
     * @zh 移除节点中指定的子节点
     * @param child 孩子节点
     */
    removeChild (child: this, cleanup?: boolean): void;

    /**
    * @zh 插入子节点到指定位置
    * @param siblingIndex 指定位置
    */
    insertChild (child: this, siblingIndex: number): void;

    /**
     * @en Returns a child from the container given its uuid.
     * @zh 通过 uuid 获取节点的子节点。
     * @param uuid - The uuid to find the child node.
     * @return a Node whose uuid equals to the input parameter
     * @example
     * ```
     * var child = node.getChildByUuid(uuid);
     * ```
     */
    getChildByUuid (uuid: string): this | null;

    /**
     * @en Returns a child from the container given its name.
     * @zh 通过名称获取节点的子节点。
     * @param name - A name to find the child node.
     * @return a CCNode object whose name equals to the input parameter
     * @example
     * ```
     * var child = node.getChildByName("Test Node");
     * ```
     */
    getChildByName (name: string): this | null;

    /**
     * @en Returns a child from the container given its path.
     * @zh 通过路径获取节点的子节点。
     * @param path - A path to find the child node.
     * @return a CCNode object whose name equals to the input parameter
     * @example
     * ```
     * var child = node.getChildByPath("Test Node");
     * ```
     */
    getChildByPath (path: string): this | null;

    /**
     * @en
     * Inserts a child to the node at a specified index.
     * @zh
     * 插入子节点到指定位置
     * @param child - the child node to be inserted
     * @param siblingIndex - the sibling index to place the child in
     * @example
     * ```
     * node.insertChild(child, 2);
     * ```
     */
    insertChild (child: this, siblingIndex: number): void;

    /**
     * @en Get the sibling index.
     * @zh 获取同级索引。
     * @example
     * ```
     * var index = node.getSiblingIndex();
     * ```
     */
    getSiblingIndex (): number;

    /**
     * @en Set the sibling index of this node.
     * @zh 设置节点同级索引。
     * @example
     * ```
     * node.setSiblingIndex(1);
     * ```
     */
    setSiblingIndex (index: number): void;

    /**
     * @en
     * Remove itself from its parent node. <br/>
     * If the node orphan, then nothing happens.
     * @zh
     * 从父节点中删除该节点。<br/>
     * 如果这个节点是一个孤节点，那么什么都不会发生。
     * @see cc.Node#removeFromParentAndCleanup
     * @example
     * ```
     * node.removeFromParent();
     * ```
     */
    removeFromParent (): void;

    /**
     * @en
     * Removes a child from the container.
     * @zh
     * 移除节点中指定的子节点。
     * @param child - The child node which will be removed.
     * @example
     * ```
     * node.removeChild(newNode);
     * ```
     */
    removeChild (child: this): void;

    /**
     * @en
     * Removes all children from the container.
     * @zh
     * 移除节点所有的子节点。
     * @example
     * ```
     * node.removeAllChildren();
     * ```
     */
    removeAllChildren (): void;

    /**
     * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * @zh 向节点添加一个指定类型的组件类，传入参数可以是一个组件类型或 ccclass 的注册名称，也可以是已经获得的组件引用。
     * @example
     * ```
     *
     * let sprite = node.addComponent(SpriteComponent);
     *
     * var sprite = node.addComponent(cc.SpriteComponent);
     *
     * var sprite = node.addComponent("cc.SpriteComponent");
     *
     * ```
     */
    addComponent<T extends Component> (classConstructor: Constructor<T>): T | null;
    addComponent (className: string): Component | null;
    addComponent (typeOrClassName: string | Function);

    /**
     * @en
     * Removes a component identified by the given name or removes the component object given.
     * You can also use component.destroy() if you already have the reference.
     * @zh
     * 删除节点上的指定组件，传入参数可以是一个组件类型或 ccclass 的注册名称，也可以是已经获得的组件引用。
     * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
     * @example
     * ```
     *
     * node.removeComponent(SpriteComponent);
     *
     * node.removeComponent(cc.SpriteComponent);
     *
     * node.removeComponent("cc.SpriteComponent");
     *
     * ```
     */
    removeComponent<T extends Component> (classConstructor: Constructor<T>): void;
    removeComponent (classNameOrInstance: string | Component): void;
    removeComponent (component: string | Component | any): void;

    _removeComponent (component: Component): void;

    /**
     * @en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * @zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @example
     * ```
     *
     * let sprite = node.getComponent(SpriteComponent);
     *
     * var sprite = node.getComponent(cc.SpriteComponent);
     *
     * var sprite = node.getComponent("cc.SpriteComponent");
     *
     * ```
     */
    getComponent<T extends Component> (classConstructor: Constructor<T>): T | null;
    getComponent (className: string): Component | null;
    getComponent (typeOrClassName: string | Function);

    getComponents<T extends Component> (classConstructor: Constructor<T>): T[];
    getComponents (className: string): Component[];
    getComponents (typeOrClassName: string | Function);

    /**
     * @en Returns all components of supplied type in the node.
     * @zh 返回节点上指定类型的所有组件。
     * @example
     * ```
     *
     * let sprite = node.getComponentInChildren(SpriteComponent);
     *
     * var sprite = node.getComponentInChildren(cc.SpriteComponent);
     *
     * var sprite = node.getComponentInChildren("cc.SpriteComponent");
     *
     * ```
     */
    getComponentInChildren<T extends Component> (classConstructor: Constructor<T>): T | null;
    getComponentInChildren (className: string): Component | null;
    getComponentInChildren (typeOrClassName: string | Function);

    /**
     * @en Returns all components of supplied type in self or any of its children.
     * @zh 递归查找自身或所有子节点中指定类型的组件
     * @example
     * ```
     *
     * let sprites = node.getComponentsInChildren(SpriteComponent);
     *
     * var sprites = node.getComponentsInChildren(cc.SpriteComponent);
     *
     * var sprites = node.getComponentsInChildren("cc.SpriteComponent");
     *
     *
     * ```
     */
    getComponentsInChildren<T extends Component> (classConstructor: Constructor<T>): T[];
    getComponentsInChildren (className: string): Component[];
    getComponentsInChildren (typeOrClassName: string | Function);

    /**
     * @zh
     * 销毁实例，实际销毁操作会延迟到当前帧渲染前执行。
     * @returns true 代表销毁成功
     */
    destroy (): boolean;

    /**
     * @en
     * Destroy all children from the node, and release all their own references to other objects.<br/>
     * Actual destruct operation will delayed until before rendering.
     * @zh
     * 销毁所有子节点，并释放所有它们对其它对象的引用。<br/>
     * 实际销毁操作会延迟到当前帧渲染前执行。
     * @example
     * ```
     * node.destroyAllChildren();
     * ```
     */
    destroyAllChildren (): void;
}

export interface INode extends IBaseNode {

    /**
     * @zh
     * 节点所属层，主要影响射线检测、物理碰撞等，参考 [[Layers]]
     */
    layer: number;


    /**
     * @zh
     * 这个节点的空间变换信息在当前帧内是否有变过？
     */
    hasChanged: Readonly<boolean>;


    /**
     * @zh
     * 节点事件相关的处理器
     */
    eventProcessor: Readonly<NodeEventProcessor>;

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

    /**
     * @zh
     * 获取本地坐标
     * @param out 输出到此目标 vector
     */
    getPosition (out?: Vec3): Vec3;

    /**
     * @zh
     * 设置本地坐标
     * @param position 目标本地坐标
     * @overload
     * @param x 目标本地坐标的 X 分量
     * @param y 目标本地坐标的 Y 分量
     * @param z 目标本地坐标的 Z 分量
     * @param w 目标本地坐标的 W 分量
     */
    setPosition (position: Vec3): void;
    setPosition (x: number, y: number, z: number): void;
    setPosition (val: Vec3 | number, y?: number, z?: number): void;

    /**
     * @zh
     * 获取世界坐标
     * @param out 输出到此目标 vector
     */
    getWorldPosition (out?: Vec3): Vec3;

    /**
     * @zh
     * 设置世界坐标
     * @param position 目标世界坐标
     * @overload
     * @param x 目标世界坐标的 X 分量
     * @param y 目标世界坐标的 Y 分量
     * @param z 目标世界坐标的 Z 分量
     * @param w 目标世界坐标的 W 分量
     */
    setWorldPosition (position: Vec3): void;
    setWorldPosition (x: number, y: number, z: number): void;
    setWorldPosition (val: Vec3 | number, y?: number, z?: number): void;

    /**
     * @zh
     * 获取本地旋转
     * @param out 输出到此目标 quaternion
     */
    getRotation (out?: Quat): Quat;

    /**
     * @zh
     * 设置本地旋转
     * @param rotation 目标本地旋转
     * @override
     * @param x 目标本地旋转的 X 分量
     * @param y 目标本地旋转的 Y 分量
     * @param z 目标本地旋转的 Z 分量
     * @param w 目标本地旋转的 W 分量
     */
    setRotation (rotation: Quat): void;
    setRotation (x: number, y: number, z: number, w: number): void;
    setRotation (val: Quat | number, y?: number, z?: number, w?: number): void;

    /**
     * @zh
     * 获取世界旋转
     * @param out 输出到此目标 quaternion
     */
    getWorldRotation (out?: Quat): Quat;

    /**
     * @zh
     * 设置世界旋转
     * @param rotation 目标世界旋转
     * @override
     * @param x 目标世界旋转的 X 分量
     * @param y 目标世界旋转的 Y 分量
     * @param z 目标世界旋转的 Z 分量
     * @param w 目标世界旋转的 W 分量
     */
    setWorldRotation (rotation: Quat): void;
    setWorldRotation (x: number, y: number, z: number, w: number): void;
    setWorldRotation (val: Quat | number, y?: number, z?: number, w?: number): void;

    /**
     * @zh
     * 获取本地缩放
     * @param out 输出到此目标 vector
     */
    getScale (out?: Vec3): Vec3;

    setScale (scale: Vec3): void;
    setScale (x: number, y: number, z: number): void;
    setScale (val: Vec3 | number, y?: number, z?: number): void;

    /**
     * @zh
     * 获取世界缩放
     * @param out 输出到此目标 vector
     */
    getWorldScale (out?: Vec3): Vec3;

    /**
     * @zh
     * 设置世界缩放
     * @param scale 目标世界缩放
     * @override
     * @param x 目标世界缩放的 X 分量
     * @param y 目标世界缩放的 Y 分量
     * @param z 目标世界缩放的 Z 分量
     */
    setWorldScale (scale: Vec3): void;
    setWorldScale (x: number, y: number, z: number): void;
    setWorldScale (val: Vec3 | number, y?: number, z?: number): void;

    /**
     * @zh
     * 获取世界变换矩阵
     * @param out 输出到此目标矩阵
     */
    getWorldMatrix (out?: Mat4): Mat4;

    /**
     * @zh
     * 获取只包含坐标和旋转的世界变换矩阵
     * @param out 输出到此目标矩阵
     */
    getWorldRT (out?: Mat4): Mat4;

    /**
     * @en
     * update the world transform information if outdated
     * here we assume all nodes are children of a scene node,
     * which is always not dirty, has an identity transform and no parent.
     * @zh
     * 更新节点的世界变换信息
     */
    updateWorldTransform (): void;

    getContentSize (out?: Size): Size;
    setContentSize (size: Size | number, height?: number): void;
    getAnchorPoint (out?: Vec2): Vec2;
    setAnchorPoint (point: Vec2 | number, y?: number): void;

    /**
     * @zh
     * 节点事件API，注：未来可能会移除
     */
    on (type: string | SystemEventType, callback: Function, target?: Object, useCapture?: boolean): void;
    off (type: string, callback?: Function, target?: Object, useCapture?: boolean): void;
    once (type: string, callback: Function, target?: Object, useCapture?: boolean): void;
    emit (type: string, ...args: any[]): void;
    dispatchEvent (event: Event): void;
    hasEventListener (type: string): void;
    targetOff (target: string | Object): void;
    pauseSystemEvents (recursive: boolean): void;
    resumeSystemEvents (recursive: boolean): void;
}
