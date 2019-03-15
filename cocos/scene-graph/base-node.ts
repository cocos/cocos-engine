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

import { Component } from '../components/component';
import { ccclass, property } from '../core/data/class-decorator';
import { CCObject } from '../core/data/object';
import { EventType } from '../core/platform/event-manager/event-enum';
import IdGenerator from '../core/utils/id-generator';
import * as js from '../core/utils/js';
import { baseNodePolyfill } from './base-node-dev';

type Constructor<T = {}> = new (...args: any[]) => T;

// @ts-ignore
const Destroying = CCObject.Flags.Destroying;
// @ts-ignore
const DontDestroy = CCObject.Flags.DontDestroy;
// @ts-ignore
const Deactivating = CCObject.Flags.Deactivating;

// const CHILD_ADDED = 'child-added';
// const CHILD_REMOVED = 'child-removed';

const idGenerator = new IdGenerator('Node');

function getConstructor (typeOrClassName: string | Function): Function | null {
    if (!typeOrClassName) {
        cc.errorID(3804);
        return null;
    }
    if (typeof typeOrClassName === 'string') {
        return js.getClassByName(typeOrClassName);
    }

    return typeOrClassName;
}

/**
 * A base node for CCNode, it will:
 * - maintain scene hierarchy and active logic
 * - notifications if some properties changed
 * - define some interfaces shares between CCNode
 * - define machanisms for Enity Component Systems
 * - define prefab and serialize functions
 *
 * @class _BaseNode
 * @extends Object
 * @uses EventTarget
 * @method constructor
 * @param {String} [name]
 * @protected
 */
@ccclass('cc._BaseNode')
export class BaseNode extends CCObject {

    /**
     * If true, the node is an persist node which won't be destroyed during scene transition.
     * If false, the node will be destroyed automatically when loading a new scene. Default is false.
     * @property _persistNode
     * @type {Boolean}
     * @default false
     * @protected
     */
    @property
    get _persistNode () {
        return (this._objFlags & DontDestroy) > 0;
    }
    set _persistNode (value) {
        if (value) {
            this._objFlags |= DontDestroy;
        } else {
            this._objFlags &= ~DontDestroy;
        }
    }

    // API

    /**
     * !#en Name of node.
     * !#zh 该节点名称。
     * @property name
     * @type {String}
     * @example
     * node.name = "New Node";
     * cc.log("Node Name: " + node.name);
     */
    @property
    get name () {
        return this._name;
    }
    set name (value) {
        if (CC_DEV && value.indexOf('/') !== -1) {
            cc.errorID(1632);
            return;
        }
        this._name = value;
    }

    /**
     * !#en The uuid for editor, will be stripped before building project.
     * !#zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。
     * @property uuid
     * @type {String}
     * @readOnly
     * @example
     * cc.log("Node Uuid: " + node.uuid);
     */
    @property
    get uuid () {
        return this._id;
    }

    /**
     * !#en All children nodes.
     * !#zh 节点的所有子节点。
     * @property children
     * @type {Node[]}
     * @readOnly
     * @example
     * var children = node.children;
     * for (var i = 0; i < children.length; ++i) {
     *     cc.log("Node: " + children[i]);
     * }
     */
    @property
    get children () {
        return this._children;
    }

    /**
     * !#en All children nodes.
     * !#zh 节点的子节点数量。
     * @property childrenCount
     * @type {Number}
     * @readOnly
     * @example
     * var count = node.childrenCount;
     * cc.log("Node Children Count: " + count);
     */
    @property
    get childrenCount () {
        return this._children.length;
    }

    /**
     * !#en
     * The local active state of this node.<br/>
     * Note that a Node may be inactive because a parent is not active, even if this returns true.<br/>
     * Use {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}
     * if you want to check if the Node is actually treated as active in the scene.
     * !#zh
     * 当前节点的自身激活状态。<br/>
     * 值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。<br/>
     * 如果你想检查节点在场景中实际的激活状态可以使用 {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}。
     * @property active
     * @type {Boolean}
     * @default true
     * @example
     * node.active = false;
     */
    @property
    get active () {
        return this._active;
    }
    set active (isActive: boolean) {
        if (this._active !== isActive) {
            this._active = isActive;
            const parent = this._parent;
            if (parent) {
                const couldActiveInScene = parent._activeInHierarchy;
                if (couldActiveInScene) {
                    cc.director._nodeActivator.activateNode(this, isActive);
                }
            }
        }
    }

    /**
     * !#en Indicates whether this node is active in the scene.
     * !#zh 表示此节点是否在场景中激活。
     * @property activeInHierarchy
     * @type {Boolean}
     * @example
     * cc.log("activeInHierarchy: " + node.activeInHierarchy);
     */
    @property
    get activeInHierarchy () {
        return this._activeInHierarchy;
    }

    @property
    get parent () {
        return this._parent;
    }
    set parent (value) {
        this.setParent(value);
    }

    public static _setScene (node: BaseNode) {
        if (node instanceof cc.Scene) {
            node._scene = node;
        } else {
            if (node._parent == null) {
                cc.error('Node %s(%s) has not attached to a scene.', node.name, node.uuid);
            } else {
                node._scene = node._parent._scene;
            }
        }
    }

    protected static idGenerator = idGenerator;

    // For walk
    protected static _stacks: Array<Array<(BaseNode | null)>> = [[]];
    protected static _stackId = 0;

    protected static _findComponent (node: BaseNode, constructor: Function) {
        // tslint:disable-next-line
        if (constructor['_sealed']) {
            for (const comp of node._components) {
                if (comp.constructor === constructor) {
                    return comp;
                }
            }
        } else {
            for (const comp of node._components) {
                if (comp instanceof constructor) {
                    return comp;
                }
            }
        }
        return null;
    }

    protected static _findComponents (node: BaseNode, constructor: Function, components: Component[]) {
        // tslint:disable-next-line
        if (constructor['_sealed']) {
            for (const comp of node._components) {
                if (comp.constructor === constructor) {
                    components.push(comp);
                }
            }
        } else {
            for (const comp of node._components) {
                if (comp instanceof constructor) {
                    components.push(comp);
                }
            }
        }
    }

    protected static _findChildComponent (children: BaseNode[], constructor) {
        for (const node of children) {
            let comp = BaseNode._findComponent(node, constructor);
            if (comp) {
                return comp;
            } else if (node._children.length > 0) {
                comp = BaseNode._findChildComponent(node._children, constructor);
                if (comp) {
                    return comp;
                }
            }
        }
        return null;
    }

    protected static _findChildComponents (children: BaseNode[], constructor, components) {
        for (const node of children) {
            BaseNode._findComponents(node, constructor, components);
            if (node._children.length > 0) {
                BaseNode._findChildComponents(node._children, constructor, components);
            }
        }
    }

    @property
    protected _parent: this | null = null;

    @property
    protected _children: this[] = [];

    @property
    protected _active = true;

    /**
     * @default 0
     */
    @property
    protected _level = 0;

    /**
     * @default []
     * @readOnly
     */
    @property
    protected _components: Component[] = [];

    /**
     * The PrefabInfo object
     * @type {PrefabInfo}
     */
    @property
    protected _prefab: any = null;

    /**
     * !#en which scene this node belongs to.
     * !#zh 此节点属于哪个场景。
     * @type {cc.Scene}}
     */
    protected _scene: any = null;

    protected _activeInHierarchy = false;

    // TO DO
    // @ts-ignore
    protected _id: string = CC_EDITOR ? Editor.Utils.UuidUtils.uuid() : idGenerator.getNewId();

    /**
     * Register all related EventTargets,
     * all event callbacks will be removed in _onPreDestroy
     * protected __eventTargets: EventTarget[] = [];
     */
    protected __eventTargets: any[] = [];

    get scene () {
        return this._scene;
    }

    /**
     * @method constructor
     * @param {String} [name]
     */
    constructor (name?: string) {
        super(name);
        this._name = name !== undefined ? name : 'New Node';

        if (cc.director._scheduler) {
            cc.director._scheduler.enableForTarget(this);
        }
    }

    /**
     * !#en Get parent of the node.
     * !#zh 获取该节点的父节点。
     * @example
     * var parent = this.node.getParent();
     */
    public getParent () {
        return this._parent;
    }

    /**
     * !#en Set parent of the node.
     * !#zh 设置该节点的父节点。
     * @example
     * node.setParent(newNode);
     */
    public setParent (value: this | null) {
        if (this._parent === value) {
            return;
        }
        const oldParent = this._parent;
        if (CC_DEBUG && oldParent && (oldParent._objFlags & Deactivating)) {
            cc.errorID(3821);
        }

        this._parent = value;

        this._onSetParent(oldParent);

        if (value) {
            if (CC_DEBUG && (value._objFlags & Deactivating)) {
                cc.errorID(3821);
            }
            this._level = value._level + 1;
            value._children.push(this);
            if (value.emit) {
                value.emit(EventType.CHILD_ADDED, this);
            }
        }
        if (oldParent) {
            if (!(oldParent._objFlags & Destroying)) {
                const removeAt = oldParent._children.indexOf(this);
                if (CC_DEV && removeAt < 0) {
                    return cc.errorID(1633);
                }
                oldParent._children.splice(removeAt, 1);
                if (oldParent.emit) {
                    oldParent.emit(EventType.CHILD_REMOVED, this);
                }
            }
        }
        this._onHierarchyChanged(oldParent);
    }

    // ABSTRACT INTERFACES

    /**
     * !#en
     * Properties configuration function <br/>
     * All properties in attrs will be set to the node, <br/>
     * when the setter of the node is available, <br/>
     * the property will be set via setter function.<br/>
     * !#zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
     * @param attrs - Properties to be set to node
     * @example
     * var attrs = { key: 0, num: 100 };
     * node.attr(attrs);
     */
    public attr (attrs: Object) {
        js.mixin(this, attrs);
    }

    // composition: GET

    /**
     * !#en Returns a child from the container given its uuid.
     * !#zh 通过 uuid 获取节点的子节点。
     * @param uuid - The uuid to find the child node.
     * @return a Node whose uuid equals to the input parameter
     * @example
     * var child = node.getChildByUuid(uuid);
     */
    public getChildByUuid (uuid: string) {
        if (!uuid) {
            cc.log('Invalid uuid');
            return null;
        }

        const locChildren = this._children;
        for (let i = 0, len = locChildren.length; i < len; i++) {
            if (locChildren[i]._id === uuid) {
                return locChildren[i];
            }
        }
        return null;
    }

    /**
     * !#en Returns a child from the container given its name.
     * !#zh 通过名称获取节点的子节点。
     * @param name - A name to find the child node.
     * @return a CCNode object whose name equals to the input parameter
     * @example
     * var child = node.getChildByName("Test Node");
     */
    public getChildByName (name: string) {
        if (!name) {
            cc.log('Invalid name');
            return null;
        }

        const locChildren = this._children;
        for (let i = 0, len = locChildren.length; i < len; i++) {
            if (locChildren[i]._name === name) {
                return locChildren[i];
            }
        }
        return null;
    }

    /**
     * !#en Returns a child from the container given its path.
     * !#zh 通过路径获取节点的子节点。
     * @param path - A path to find the child node.
     * @return a CCNode object whose name equals to the input parameter
     * @example
     * var child = node.getChildByPath("Test Node");
     */
    public getChildByPath (path: string) {
        const segments = path.split('/');
        let lastNode: this = this;
        for (const segment of segments) {
            const next = lastNode.children.find((childNode) => childNode.name === segment);
            if (!next) {
                return null;
            }
            lastNode = next;
        }
        return lastNode;
    }

    // composition: ADD

    public addChild (child: this): void {

        if (CC_DEV && !(child instanceof cc._BaseNode)) {
            return cc.errorID(1634, cc.js.getClassName(child));
        }
        cc.assertID(child, 1606);
        cc.assertID(child._parent === null, 1605);

        // invokes the parent setter
        child.setParent(this);

    }

    /**
     * !#en
     * Inserts a child to the node at a specified index.
     * !#zh
     * 插入子节点到指定位置
     * @param child - the child node to be inserted
     * @param siblingIndex - the sibling index to place the child in
     * @example
     * node.insertChild(child, 2);
     */
    public insertChild (child: this, siblingIndex: number) {
        child.parent = this;
        child.setSiblingIndex(siblingIndex);
    }

    // HIERARCHY METHODS

    /**
     * !#en Get the sibling index.
     * !#zh 获取同级索引。
     * @example
     * var index = node.getSiblingIndex();
     */
    public getSiblingIndex () {
        if (this._parent) {
            return this._parent._children.indexOf(this);
        } else {
            return 0;
        }
    }

    /**
     * !#en Set the sibling index of this node.
     * !#zh 设置节点同级索引。
     * @example
     * node.setSiblingIndex(1);
     */
    public setSiblingIndex (index: number) {
        if (!this._parent) {
            return;
        }
        if (this._parent._objFlags & Deactivating) {
            cc.errorID(3821);
            return;
        }
        const siblings = this._parent._children;
        index = index !== -1 ? index : siblings.length - 1;
        const oldIndex = siblings.indexOf(this);
        if (index !== oldIndex) {
            siblings.splice(oldIndex, 1);
            if (index < siblings.length) {
                siblings.splice(index, 0, this);
            } else {
                siblings.push(this);
            }
            if (this._onSiblingIndexChanged) {
                this._onSiblingIndexChanged(index);
            }
        }
    }

    /**
     * !#en Walk though the sub children tree of the current node.
     * Each node, including the current node, in the sub tree will be visited two times,
     * before all children and after all children.
     * This function call is not recursive, it's based on stack.
     * Please don't walk any other node inside the walk process.
     * !#zh 遍历该节点的子树里的所有节点并按规则执行回调函数。
     * 对子树中的所有节点，包含当前节点，会执行两次回调，prefunc 会在访问它的子节点之前调用，postfunc 会在访问所有子节点之后调用。
     * 这个函数的实现不是基于递归的，而是基于栈展开递归的方式。
     * 请不要在 walk 过程中对任何其他的节点嵌套执行 walk。
     * @param prefunc The callback to process node when reach the node for the first time
     * @param postfunc The callback to process node when re-visit the node after walked all children in its sub tree
     * @example
     * node.walk(function (target) {
     *     console.log('Walked through node ' + target.name + ' for the first time');
     * }, function (target) {
     *     console.log('Walked through node ' + target.name + ' after walked all children in its sub tree');
     * });
     */
    public walk (prefunc: (target: this) => void, postfunc?: (target: this) => void) {
        // const BaseNode = cc._BaseNode;
        let index = 1;
        let children: this[] | null = null;
        let curr: this | null = null;
        let i = 0;
        let stack = BaseNode._stacks[BaseNode._stackId];
        if (!stack) {
            stack = [];
            BaseNode._stacks.push(stack);
        }
        BaseNode._stackId++;

        stack.length = 0;
        stack[0] = this;
        let parent: this | null = null;
        let afterChildren = false;
        while (index) {
            index--;
            curr = stack[index] as (this | null);
            if (!curr) {
                continue;
            }
            if (!afterChildren && prefunc) {
                // pre call
                prefunc(curr);
            } else if (afterChildren && postfunc) {
                // post call
                postfunc(curr);
            }

            // Avoid memory leak
            stack[index] = null;
            // Do not repeatly visit child tree, just do post call and continue walk
            if (afterChildren) {
                afterChildren = false;
            } else {
                // Children not proceeded and has children, proceed to child tree
                if (curr._children.length > 0) {
                    parent = curr;
                    children = curr._children;
                    i = 0;
                    stack[index] = children[i];
                    index++;
                } else {
                    stack[index] = curr;
                    index++;
                    afterChildren = true;
                }
                continue;
            }
            // curr has no sub tree, so look into the siblings in parent children
            if (children) {
                i++;
                // Proceed to next sibling in parent children
                if (children[i]) {
                    stack[index] = children[i];
                    index++;
                } else if (parent) {
                    stack[index] = parent;
                    index++;
                    // Setup parent walk env
                    afterChildren = true;
                    if (parent._parent) {
                        children = parent._parent._children;
                        i = children.indexOf(parent);
                        parent = parent._parent;
                    } else {
                        // At root
                        parent = null;
                        children = null;
                    }

                    // ERROR
                    if (i < 0) {
                        break;
                    }
                }
            }
        }
        stack.length = 0;
        BaseNode._stackId--;
    }

    /**
     * !#en
     * Remove itself from its parent node. If cleanup is `true`, then also remove all events and actions. <br/>
     * If the cleanup parameter is not passed, it will force a cleanup,
     * so it is recommended that you always pass in the `false` parameter when calling this API.<br/>
     * If the node orphan, then nothing happens.
     * !#zh
     * 从父节点中删除该节点。如果不传入 cleanup 参数或者传入 `true`，那么这个节点上所有绑定的事件、action 都会被删除。<br/>
     * 因此建议调用这个 API 时总是传入 `false` 参数。<br/>
     * 如果这个节点是一个孤节点，那么什么都不会发生。
     * @param [cleanup=true] - true if all actions and callbacks on this node should be removed, false otherwise.
     * @see cc.Node#removeFromParentAndCleanup
     * @example
     * node.removeFromParent();
     * node.removeFromParent(false);
     */
    public removeFromParent (cleanup?: boolean) {
        if (this._parent) {
            if (cleanup === undefined) {
                cleanup = true;
            }
            this._parent.removeChild(this, cleanup);
        }
    }

    /**
     * !#en
     * Removes a child from the container.
     * It will also cleanup all running actions depending on the cleanup parameter. </p>
     * If the cleanup parameter is not passed, it will force a cleanup. <br/>
     * "remove" logic MUST only be on this method  <br/>
     * If a class wants to extend the 'removeChild' behavior it only needs <br/>
     * to override this method.
     * !#zh
     * 移除节点中指定的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
     * 如果 cleanup 参数不传入，默认为 true 表示清理。<br/>
     * @param child - The child node which will be removed.
     * @param [cleanup=true] - true if all running actions and callbacks on the child node
     * will be cleanup, false otherwise.
     * @example
     * node.removeChild(newNode);
     * node.removeChild(newNode, false);
     */
    public removeChild (child: this, cleanup?: boolean) {
        if (this._children.indexOf(child) > -1) {
            // If you don't do cleanup, the child's actions will not get removed and the
            if (cleanup || cleanup === undefined) {
                child.cleanup();
            }
            // invoke the parent setter
            child.parent = null;
        }
    }

    /**
     * !#en
     * Removes all children from the container and
     * do a cleanup all running actions depending on the cleanup parameter. <br/>
     * If the cleanup parameter is not passed, it will force a cleanup.
     * !#zh
     * 移除节点所有的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
     * 如果 cleanup 参数不传入，默认为 true 表示清理。
     * @param [cleanup=true] - true if all running actions on all children nodes
     * should be cleanup, false otherwise.
     * @example
     * node.removeAllChildren();
     * node.removeAllChildren(false);
     */
    public removeAllChildren (cleanup?: boolean) {
        // not using detachChild improves speed here
        const children = this._children;
        if (cleanup === undefined) {
            cleanup = true;
        }
        for (let i = children.length - 1; i >= 0; i--) {
            const node = children[i];
            if (node) {
                // If you don't do cleanup, the node's actions will not get removed and the
                if (cleanup) {
                    node.cleanup();
                }

                node.parent = null;
            }
        }
        this._children.length = 0;
    }

    /**
     * !#en Is this node a child of the given node?
     * !#zh 是否是指定节点的子节点？
     * @return True if this node is a child, deep child or identical to the given node.
     * @example
     * node.isChildOf(newNode);
     */
    public isChildOf (parent: this) {
        let child: this | null = this;
        do {
            if (child === parent) {
                return true;
            }
            child = child._parent;
        }
        while (child);
        return false;
    }

    // COMPONENT

    /**
     * !#en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * !#zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @example
     * // get sprite component.
     * var sprite = node.getComponent(cc.Sprite);
     */
    public getComponent<T extends Component> (classConstructor: Constructor<T>): T | null;

    /**
     * !#en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * !#zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @example
     * // get custom test calss.
     * var test = node.getComponent("Test");
     */
    public getComponent (className: string): Component | null;

    public getComponent (typeOrClassName: string | Function) {
        const constructor = getConstructor(typeOrClassName);
        if (constructor) {
            return BaseNode._findComponent(this, constructor);
        }
        return null;
    }

    /**
     * !#en Returns all components of supplied type in the node.
     * !#zh 返回节点上指定类型的所有组件。
     * @example
     * var sprites = node.getComponents(cc.Sprite);
     */
    public getComponents<T extends Component> (classConstructor: Constructor<T>): T[];

    /**
     * !#en Returns all components of supplied type in the node.
     * !#zh 返回节点上指定类型的所有组件。
     * @example
     * var tests = node.getComponents("Test");
     */
    public getComponents (className: string): Component[];

    public getComponents (typeOrClassName: string | Function) {
        const constructor = getConstructor(typeOrClassName);
        const components: Component[] = [];
        if (constructor) {
            BaseNode._findComponents(this, constructor, components);
        }
        return components;
    }

    /**
     * !#en Returns the component of supplied type in any of its children using depth first search.
     * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @example
     * var sprite = node.getComponentInChildren(cc.Sprite);
     */
    public getComponentInChildren<T extends Component> (classConstructor: Constructor<T>): T | null;

    /**
     * !#en Returns the component of supplied type in any of its children using depth first search.
     * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @example
     * var Test = node.getComponentInChildren("Test");
     */
    public getComponentInChildren (className: string): Component | null;

    public getComponentInChildren (typeOrClassName: string | Function) {
        const constructor = getConstructor(typeOrClassName);
        if (constructor) {
            return BaseNode._findChildComponent(this._children, constructor);
        }
        return null;
    }

    /**
     * !#en Returns all components of supplied type in self or any of its children.
     * !#zh 递归查找自身或所有子节点中指定类型的组件
     * @example
     * var sprites = node.getComponentsInChildren(cc.Sprite);
     */
    public getComponentsInChildren<T extends Component> (classConstructor: Constructor<T>): T[];

    /**
     * !#en Returns all components of supplied type in self or any of its children.
     * !#zh 递归查找自身或所有子节点中指定类型的组件
     * @example
     * var tests = node.getComponentsInChildren("Test");
     */
    public getComponentsInChildren (className: string): Component[];

    public getComponentsInChildren (typeOrClassName: string | Function) {
        const constructor = getConstructor(typeOrClassName);
        const components: Component[] = [];
        if (constructor) {
            BaseNode._findComponents(this, constructor, components);
            BaseNode._findChildComponents(this._children, constructor, components);
        }
        return components;
    }

    /**
     * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * !#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @example
     * var sprite = node.addComponent(cc.Sprite);
     */
    public addComponent<T extends Component> (classConstructor: Constructor<T>): T | null;

    /**
     * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * !#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @example
     * var test = node.addComponent("Test");
     */
    public addComponent (className: string): Component | null;

    public addComponent (typeOrClassName: string | Function) {
        if (CC_EDITOR && (this._objFlags & Destroying)) {
            cc.error('isDestroying');
            return null;
        }

        // get component

        let constructor;
        if (typeof typeOrClassName === 'string') {
            constructor = js.getClassByName(typeOrClassName);
            if (!constructor) {
                cc.errorID(3807, typeOrClassName);
                if (cc._RFpeek()) {
                    cc.errorID(3808, typeOrClassName);
                }
                return null;
            }
        } else {
            if (!typeOrClassName) {
                cc.errorID(3804);
                return null;
            }
            constructor = typeOrClassName;
        }

        // check component

        if (typeof constructor !== 'function') {
            cc.errorID(3809);
            return null;
        }
        if (!js.isChildClassOf(constructor, cc.Component)) {
            cc.errorID(3810);
            return null;
        }

        if (CC_EDITOR && constructor._disallowMultiple) {
            if (!this._checkMultipleComp!(constructor)) {
                return null;
            }
        }

        // check requirement

        const ReqComp = constructor._requireComponent;
        if (ReqComp && !this.getComponent(ReqComp)) {
            const depended = this.addComponent(ReqComp);
            if (!depended) {
                // depend conflicts
                return null;
            }
        }

        //// check conflict
        //
        // if (CC_EDITOR && !_Scene.DetectConflict.beforeAddComponent(this, constructor)) {
        //    return null;
        // }

        //

        const component = new constructor();
        component.node = this;
        this._components.push(component);
        if ((CC_EDITOR || CC_TEST) && cc.engine && (this._id in cc.engine.attachedObjsForEditor)) {
            cc.engine.attachedObjsForEditor[component._id] = component;
        }
        if (this._activeInHierarchy) {
            cc.director._nodeActivator.activateComp(component);
        }

        return component;
    }

    /**
     * !#en
     * Removes a component identified by the given name or removes the component object given.
     * You can also use component.destroy() if you already have the reference.
     * !#zh
     * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
     * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
     * @deprecated please destroy the component to remove it.
     * @example
     * node.removeComponent(cc.Sprite);
     */
    public removeComponent<T extends Component> (classConstructor: Constructor<T>): void;

    /**
     * !#en
     * Removes a component identified by the given name or removes the component object given.
     * You can also use component.destroy() if you already have the reference.
     * !#zh
     * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
     * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
     * @deprecated please destroy the component to remove it.
     * @example
     * const sprite = node.getComponent(CC.Sprite);
     * if (sprite) {
     *     node.removeComponent(sprite);
     * }
     * node.removeComponent('cc.Sprite');
     */
    public removeComponent (classNameOrInstance: string | Component): void;

    public removeComponent (component: any) {
        if (!component) {
            cc.errorID(3813);
            return;
        }
        let componentInstance: Component | null = null;
        if (component instanceof Component) {
            componentInstance = component;
        } else {
            componentInstance = this.getComponent(component);
        }
        if (componentInstance) {
            componentInstance.destroy();
        }
    }

    public destroy () {
        if (super.destroy()) {
            // disable hierarchy
            if (this._activeInHierarchy) {
                this._disableChildComps();
            }
        }
    }

    /**
     * !#en
     * Destroy all children from the node, and release all their own references to other objects.<br/>
     * Actual destruct operation will delayed until before rendering.
     * !#zh
     * 销毁所有子节点，并释放所有它们对其它对象的引用。<br/>
     * 实际销毁操作会延迟到当前帧渲染前执行。
     * @example
     * node.destroyAllChildren();
     */
    public destroyAllChildren () {
        for (const child of this._children) {
            child.destroy();
        }
    }

    public cleanup () {
        return;
    }

    public emit? (type: string, ...args: any[]): void;

    protected _onSetParent (oldParent: this | null) {
        if (this._parent) {
            if ((oldParent == null || oldParent._scene !== this._parent._scene) && this._parent._scene != null) {
                this.walk((node) => {
                    BaseNode._setScene(node);
                });
            }
        }
    }

    protected _onPostActivated () {
        return;
    }

    protected _onBatchRestored () {
        return;
    }

    protected _onBatchCreated () {
        return;
    }

    protected _onPreDestroy () {
        this._onPreDestroyBase();
    }

    protected _onHierarchyChanged (oldParent: this | null) {
        return this._onHierarchyChangedBase(oldParent);
    }

    protected _instantiate (cloned) {
        if (!cloned) {
            cloned = cc.instantiate._clone(this, this);
        }

        const thisPrefabInfo = this._prefab;
        if (CC_EDITOR && thisPrefabInfo) {
            if (this !== thisPrefabInfo.root) {
                // var PrefabUtils = Editor.require('scene://utils/prefab');
                // PrefabUtils.initClonedChildOfPrefab(cloned);
            }
        }
        const syncing = thisPrefabInfo && this === thisPrefabInfo.root && thisPrefabInfo.sync;
        if (syncing) {
            // if (thisPrefabInfo._synced) {
            //    return clone;
            // }
        } else if (CC_EDITOR && cc.engine._isPlaying) {
            cloned._name += ' (Clone)';
        }

        // reset and init
        cloned._parent = null;
        cloned._onBatchRestored();

        return cloned;
    }

    protected _onHierarchyChangedBase (oldParent: this | null) {
        const newParent = this._parent;
        if (this._persistNode && !(newParent instanceof cc.Scene)) {
            cc.game.removePersistRootNode(this);
            if (CC_EDITOR) {
                cc.warnID(1623);
            }
        }

        if (CC_EDITOR || CC_TEST) {
            const scene = cc.director.getScene();
            const inCurrentSceneBefore = oldParent && oldParent.isChildOf(scene);
            const inCurrentSceneNow = newParent && newParent.isChildOf(scene);
            if (!inCurrentSceneBefore && inCurrentSceneNow) {
                // attached
                this._registerIfAttached!(true);
            } else if (inCurrentSceneBefore && !inCurrentSceneNow) {
                // detached
                this._registerIfAttached!(false);
            }

            // update prefab
            const newPrefabRoot = newParent && newParent._prefab && newParent._prefab.root;
            const myPrefabInfo = this._prefab;
            // var PrefabUtils = Editor.require('scene://utils/prefab');
            // if (myPrefabInfo) {
            //     if (newPrefabRoot) {
            //         if (myPrefabInfo.root !== newPrefabRoot) {
            //             // change prefab
            //             PrefabUtils.unlinkPrefab(this);
            //             PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
            //         }
            //     }
            //     else if (myPrefabInfo.root !== this) {
            //         // detach from prefab
            //         PrefabUtils.unlinkPrefab(this);
            //     }
            // }
            // else if (newPrefabRoot) {
            //     // attach to prefab
            //     PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
            // }

            // conflict detection
            // _Scene.DetectConflict.afterAddChild(this);
        }

        const shouldActiveNow = this._active && !!(newParent && newParent._activeInHierarchy);
        if (this._activeInHierarchy !== shouldActiveNow) {
            cc.director._nodeActivator.activateNode(this, shouldActiveNow);
        }
    }

    protected _onPreDestroyBase () {
        // marked as destroying
        this._objFlags |= Destroying;

        // detach self and children from editor
        const parent = this._parent;
        const destroyByParent: boolean = (parent !== null) && ((parent._objFlags & Destroying) !== 0);
        if (!destroyByParent && (CC_EDITOR || CC_TEST)) {
            this._registerIfAttached!(false);
        }

        // destroy children
        // destroy children
        for (const child of this._children) {
            // destroy immediate so its _onPreDestroy can be called
            child._destroyImmediate();
        }

        // destroy self components
        for (const component of this._components) {
            // destroy immediate so its _onPreDestroy can be called
            // TO DO
            // @ts-ignore
            component._destroyImmediate();
        }

        for (const eventTarget of this.__eventTargets) {
            if (eventTarget) {
                eventTarget.targetOff(this);
            }
        }
        this.__eventTargets.length = 0;

        // remove from persist
        if (this._persistNode) {
            cc.game.removePersistRootNode(this);
        }

        if (!destroyByParent) {
            // remove from parent
            if (parent) {
                const childIndex = parent._children.indexOf(this);
                parent._children.splice(childIndex, 1);
                if (parent.emit) {
                    parent.emit('child-removed', this);
                }
            }
        }

        return destroyByParent;
    }

    // do remove component, only used internally
    protected _removeComponent (component: Component) {
        if (!component) {
            cc.errorID(3814);
            return;
        }

        if (!(this._objFlags & Destroying)) {
            const i = this._components.indexOf(component);
            if (i !== -1) {
                this._components.splice(i, 1);
                if ((CC_EDITOR || CC_TEST) && cc.engine) {
                    delete cc.engine.attachedObjsForEditor[component._id];
                }
            } else if ((component.node as BaseNode) !== this) {
                cc.errorID(3815);
            }
        }
    }

    protected _disableChildComps () {
        // leave this._activeInHierarchy unmodified
        for (const component of this._components) {
            if (component._enabled) {
                cc.director._compScheduler.disableComp(component);
            }
        }
        // deactivate recursively
        for (const node of this._children) {
            if (node._active) {
                node._disableChildComps();
            }
        }
    }

    protected _onSiblingIndexChanged? (siblingIndex: number): void;

    protected _registerIfAttached? (attached: boolean): void;

    protected _checkMultipleComp? (constructor: Function): boolean;
}

baseNodePolyfill(BaseNode);

/**
 * !#en
 * Note: This event is only emitted from the top most node whose active value did changed,
 * not including its child nodes.
 * !#zh
 * 注意：此节点激活时，此事件仅从最顶部的节点发出。
 * @event active-in-hierarchy-changed
 * @param {Event.EventCustom} event
 */

cc._BaseNode = BaseNode;
