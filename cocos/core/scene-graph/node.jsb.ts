/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
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

import { ccclass, editable, serializable, type } from 'cc.decorator';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';

import { legacyCC } from '../global-exports';
import { errorID, getError } from '../platform/debug';
import { Component } from '../components/component';
import { NodeEventType } from './node-event';
import { CCObject } from '../data/object';
import { NodeUIProperties } from './node-ui-properties';
import { NodeSpace, TransformBit } from './node-enum';
import { Mat4, Quat, Vec3 } from '../math';
import { NodeEventProcessor } from './node-event-processor';
import { Layers } from './layers';
import { eventManager } from '../platform/event-manager/event-manager';
import { SerializationContext, SerializationOutput, serializeTag } from "../data";
import { EDITOR } from "../default-constants";
import {
    applyMountedChildren,
    applyMountedComponents, applyPropertyOverrides,
    applyRemovedComponents, applyTargetOverrides,
    createNodeWithPrefab,
    generateTargetMap,
} from '../utils/prefab/utils';
import { getClassByName, isChildClassOf } from '../utils/js-typed';

export const Node = jsb.Node;
export type Node = jsb.Node;
legacyCC.Node = Node;

const clsDecorator = ccclass('cc.Node');

const NodeCls: any = Node;
/**
 * @en Event types emitted by Node
 * @zh 节点可能发出的事件类型
 */
NodeCls.EventType = NodeEventType;

/**
 * @en Coordinates space
 * @zh 空间变换操作的坐标系
 */
NodeCls.NodeSpace = NodeSpace;

/**
 * @en Bit masks for Node transformation parts
 * @zh 节点变换更新的具体部分
 * @deprecated please use [[Node.TransformBit]]
 */
NodeCls.TransformDirtyBit = TransformBit;

/**
 * @en Bit masks for Node transformation parts, can be used to determine which part changed in [[NodeEventType.TRANSFORM_CHANGED]] event
 * @zh 节点变换更新的具体部分，可用于判断 [[NodeEventType.TRANSFORM_CHANGED]] 事件的具体类型
 */
NodeCls.TransformBit = TransformBit;

const nodeProto: any = jsb.Node.prototype;
export const TRANSFORM_ON = 1 << 0;
const Destroying = CCObject.Flags.Destroying;

function getConstructor<T> (typeOrClassName) {
    if (!typeOrClassName) {
        return null;
    }
    if (typeof typeOrClassName === 'string') {
        return getClassByName(typeOrClassName);
    }

    return typeOrClassName;
}

nodeProto.getComponent = function (typeOrClassName) {
    const constructor = getConstructor(typeOrClassName);
    if (constructor) {
        return NodeCls._findComponent(this, constructor);
    }
    return null;
};

nodeProto.getComponents = function (typeOrClassName) {
    const constructor = getConstructor(typeOrClassName);
    const components = [];
    if (constructor) {
        NodeCls._findComponents(this, constructor, components);
    }
    return components;
};

nodeProto.getComponentInChildren = function (typeOrClassName) {
    const constructor = getConstructor(typeOrClassName);
    if (constructor) {
        return NodeCls._findChildComponent(this._children, constructor);
    }
    return null;
};

nodeProto.getComponentsInChildren = function (typeOrClassName) {
    const constructor = getConstructor(typeOrClassName);
    const components = [];
    if (constructor) {
        NodeCls._findComponents(this, constructor, components);
        NodeCls._findChildComponents(this.getChildren(), constructor, components);
    }
    return components;
};

nodeProto.addComponent = function (typeOrClassName) {
    // if (EDITOR && (this._objFlags & Destroying)) {
    //     throw Error('isDestroying');
    // }

    // get component

    let constructor;
    if (typeof typeOrClassName === 'string') {
        constructor = getClassByName(typeOrClassName);
        if (!constructor) {
            if (legacyCC._RF.peek()) {
                errorID(3808, typeOrClassName);
            }
            throw TypeError(getError(3807, typeOrClassName));
        }
    } else {
        if (!typeOrClassName) {
            throw TypeError(getError(3804));
        }
        constructor = typeOrClassName;
    }

    // check component

    if (typeof constructor !== 'function') {
        throw TypeError(getError(3809));
    }
    if (!isChildClassOf(constructor, Component)) {
        throw TypeError(getError(3810));
    }

    // if (EDITOR && (constructor as typeof constructor & { _disallowMultiple?: unknown })._disallowMultiple) {
    //     this._checkMultipleComp!(constructor);
    // }

    // check requirement

    const ReqComp = (constructor)._requireComponent;
    if (ReqComp && !this.getComponent(ReqComp)) {
        this.addComponent(ReqComp);
    }

    /// / check conflict
    //
    // if (EDITOR && !_Scene.DetectConflict.beforeAddComponent(this, constructor)) {
    //    return null;
    // }

    //

    const component = new constructor();
    component.node = (this as unknown as Node); // TODO: HACK here
    this._components.push(component);
    // if (EDITOR && EditorExtends.Node && EditorExtends.Component) {
    //     const node = EditorExtends.Node.getNode(this._id);
    //     if (node) {
    //         EditorExtends.Component.add(component._id, component);
    //     }
    // }
    if (this._activeInHierarchy) {
        legacyCC.director._nodeActivator.activateComp(component);
    }

    return component;
};

nodeProto.removeComponent = function (component) {
    if (!component) {
        errorID(3813);
        return;
    }
    let componentInstance: any = null;
    if (component instanceof Component) {
        componentInstance = component;
    } else {
        componentInstance = this.getComponent(component);
    }
    if (componentInstance) {
        componentInstance.destroy();
    }
};

nodeProto.on = function (type, callback, target, useCapture) {
    switch (type) {
    case NodeEventType.TRANSFORM_CHANGED:
        // this._eventMask |= TRANSFORM_ON;
        this.setEventMask(this.getEventMask() | ~TRANSFORM_ON);
        break;
    default:
        break;
    }
    this._eventProcessor.on(type, callback, target, useCapture);
};

nodeProto.off = function (type: string, callback?, target?, useCapture = false) {
    this._eventProcessor.off(type, callback, target, useCapture);

    const hasListeners = this._eventProcessor.hasEventListener(type);
    // All listener removed
    if (!hasListeners) {
        switch (type) {
        case NodeEventType.TRANSFORM_CHANGED:
            // this._eventMask &= ~TRANSFORM_ON;
            this.setEventMask(this.getEventMask() & ~TRANSFORM_ON);
            break;
        default:
            break;
        }
    }
};

nodeProto.once = function (type: string, callback, target?: unknown, useCapture?: any) {
    this._eventProcessor.once(type, callback, target, useCapture);
};

nodeProto.emit = function (type: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
    this._eventProcessor.emit(type, arg0, arg1, arg2, arg3, arg4);
};

nodeProto.dispatchEvent = function (event: Event) {
    this._eventProcessor.dispatchEvent(event);
};

nodeProto.hasEventListener = function (type: string, callback?, target?: unknown) {
    return this._eventProcessor.hasEventListener(type, callback, target);
};

nodeProto.targetOff = function (target: string | unknown) {
    // Check for event mask reset
    const eventMask = this.getEventMask();
    if ((eventMask & TRANSFORM_ON) && !this._eventProcessor.hasEventListener(NodeEventType.TRANSFORM_CHANGED)) {
        // this._eventMask &= ~TRANSFORM_ON;
        this.setEventMask(eventMask & ~TRANSFORM_ON);
    }
};

nodeProto._removeComponent = function (component: Component) {
    if (!component) {
        errorID(3814);
        return;
    }

    if (!(this._objFlags & Destroying)) {
        const i = this._components.indexOf(component);
        if (i !== -1) {
            this._components.splice(i, 1);
            // if (EDITOR && EditorExtends.Component) {
            //     EditorExtends.Component.remove(component._id);
            // }
        } else if (component.node !== this) {
            errorID(3815);
        }
    }
};

// These functions are invoked by native Node object.

nodeProto._onTransformChanged = function (transformType) {
    this.emit(NodeEventType.TRANSFORM_CHANGED, transformType);
};

nodeProto._onParentChanged = function (oldParent) {
    this.emit(NodeEventType.PARENT_CHANGED, oldParent);
};

nodeProto._onReAttach = function () {
    this._eventProcessor.reattach();
};

nodeProto._onRemovePersistRootNode = function () {
    legacyCC.game.removePersistRootNode(this);
};

nodeProto._onDestroyComponents = function () {
    const comps = this._components;
    for (let i = 0; i < comps.length; ++i) {
        // destroy immediate so its _onPreDestroy can be called
        // TO DO
        comps[i]._destroyImmediate();
    }
};

nodeProto._onLayerChanged = function (layer) {
    this.emit(NodeEventType.LAYER_CHANGED, layer);
};

nodeProto._onChildRemoved = function (child) {
    this.emit(NodeEventType.CHILD_REMOVED, child);
};

nodeProto._onChildAdded = function (child) {
    this.emit(NodeEventType.CHILD_ADDED, child);
};

nodeProto._onNodeDestroyed = function () {
    this.emit(NodeEventType.NODE_DESTROYED, this);
};

nodeProto._onSiblingOrderChanged = function () {
    this.emit(NodeEventType.SIBLING_ORDER_CHANGED);
};

nodeProto._onUiTransformDirty = function () {
    this._uiProps.uiTransformDirty = true;
};

nodeProto._onActivateNode = function (shouldActiveNow) {
    legacyCC.director._nodeActivator.activateNode(this, shouldActiveNow);
};

nodeProto._onPostActivated = function (active: boolean) {
    if (active) { // activated
        eventManager.resumeTarget(this);
        // in case transform updated during deactivated period
        this.invalidateChildren(TransformBit.TRS);
    } else { // deactivated
        eventManager.pauseTarget(this);
    }
};

// Static functions.

NodeCls._findComponent = function (node, constructor) {
    const cls = constructor;
    const comps = node._components;
    if (cls._sealed) {
        for (let i = 0; i < comps.length; ++i) {
            const comp: Component = comps[i];
            if (comp.constructor === constructor) {
                return comp;
            }
        }
    } else {
        for (let i = 0; i < comps.length; ++i) {
            const comp: Component = comps[i];
            if (comp instanceof constructor) {
                return comp;
            }
        }
    }
    return null;
};

NodeCls._findComponents = function (node, constructor, components) {
    const cls = constructor;
    const comps = node._components;
    if (cls._sealed) {
        for (let i = 0; i < comps.length; ++i) {
            const comp = comps[i];
            if (comp.constructor === constructor) {
                components.push(comp);
            }
        }
    } else {
        for (let i = 0; i < comps.length; ++i) {
            const comp = comps[i];
            if (comp instanceof constructor) {
                components.push(comp);
            }
        }
    }
};

NodeCls._findChildComponent = function (children, constructor) {
    for (let i = 0; i < children.length; ++i) {
        const node = children[i];
        let comp: Component = NodeCls._findComponent(node, constructor);
        if (comp) {
            return comp;
        }

        const childChildren = node.getChildren();
        if (childChildren.length > 0) {
            comp = NodeCls._findChildComponent(childChildren, constructor);
            if (comp) {
                return comp;
            }
        }
    }
    return null;
};

NodeCls._findChildComponents = function (children, constructor, components) {
    for (let i = 0; i < children.length; ++i) {
        const node = children[i];
        NodeCls._findComponents(node, constructor, components);

        const childChildren = node.getChildren();
        if (childChildren.length > 0) {
            NodeCls._findChildComponents(childChildren, constructor, components);
        }
    }
};

/**
 * @en Determine whether the given object is a normal Node. Will return false if [[Scene]] given.
 * @zh 指定对象是否是普通的节点？如果传入 [[Scene]] 会返回 false。
 */
NodeCls.isNode =  function (obj: unknown): obj is jsb.Node {
    return obj instanceof jsb.Node && (obj.constructor === jsb.Node || !(obj instanceof legacyCC.Scene));
};

const oldGetPosition = nodeProto.getPosition;
const oldGetRotation = nodeProto.getRotation;
const oldGetScale = nodeProto.getScale;
const oldGetWorldPosition = nodeProto.getWorldPosition;
const oldGetWorldRotation = nodeProto.getWorldRotation;
const oldGetWorldScale = nodeProto.getWorldScale;
const oldEulerAngles = nodeProto.getEulerAngles;
const oldGetWorldMatrix = nodeProto.getWorldMatrix;
const oldGetForward = nodeProto.getForward;
const oldGetUp = nodeProto.getUp;
const oldGetRight = nodeProto.getRight;

nodeProto.getPosition = function (out?: Vec3) : Vec3 {
    const r = oldGetPosition.call(this);
    if (out) {
        return Vec3.set(out, r.x, r.y, r.z);
    }
    return Vec3.copy(new Vec3(), r);
};

nodeProto.getRotation = function (out?: Quat): Quat {
    const r = oldGetRotation.call(this);
    if (out) {
        return Quat.set(out, r.x, r.y, r.z, r.w);
    }
    return Quat.copy(new Quat(), r);
};

nodeProto.getScale = function (out?: Vec3) : Vec3 {
    const r = oldGetScale.call(this);
    if (out) {
        return Vec3.set(out, r.x, r.y, r.z);
    }
    return Vec3.copy(new Vec3(), r);
};

nodeProto.getWorldPosition = function (out?: Vec3) : Vec3 {
    const r = oldGetWorldPosition.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(new Vec3(), r);
};

nodeProto.getWorldRotation = function (out?: Quat) : Quat {
    const r = oldGetWorldRotation.call(this);
    if (out) {
        return Quat.copy(out, r);
    }
    return Quat.copy(new Quat(), r);
};

nodeProto.getWorldScale = function (out?: Vec3) : Vec3 {
    const r = oldGetWorldScale.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(new Vec3(), r);
};

nodeProto.getWorldMatrix = function (out?: Mat4) : Mat4 {
    const r = oldGetWorldMatrix.call(this);
    const target = out || new Mat4();
    return Mat4.copy(target, r);
};

nodeProto.getEulerAngles = function (out?: Vec3) : Vec3 {
    const r = oldEulerAngles.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(new Vec3(), r);
};

nodeProto.getForward = function (out?: Vec3) : Vec3 {
    const r = oldGetForward.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(new Vec3(), r);
};

nodeProto.getUp = function (out?: Vec3) : Vec3 {
    const r = oldGetUp.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(new Vec3(), r);
};

nodeProto.getRight = function (out?: Vec3) : Vec3 {
    const r = oldGetRight.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(new Vec3(), r);
};
Object.defineProperty(nodeProto, 'position', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Vec3> {
        return this.getPosition();
    },
    set (v: Readonly<Vec3>) {
        this.setPosition(v as Vec3);
    },
});

Object.defineProperty(nodeProto, 'rotation', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Quat> {
        return this.getRotation();
    },
    set (v: Readonly<Quat>) {
        this.setRotation(v as Quat);
    },
});

Object.defineProperty(nodeProto, 'scale', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Vec3> {
        return this.getScale();
    },
    set (v: Readonly<Vec3>) {
        this.setScale(v as Vec3);
    },
});

Object.defineProperty(nodeProto, 'worldPosition', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Vec3> {
        return this.getWorldPosition();
    },
    set (v: Readonly<Vec3>) {
        this.setWorldPosition(v as Vec3);
    },
});

Object.defineProperty(nodeProto, 'worldRotation', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Quat> {
        return this.getWorldRotation();
    },
    set (v: Readonly<Quat>) {
        this.setWorldRotation(v as Quat);
    },
});

Object.defineProperty(nodeProto, 'worldScale', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Vec3> {
        return this.getWorldScale();
    },
    set (v: Readonly<Vec3>) {
        this.setWorldScale(v as Vec3);
    },
});

Object.defineProperty(nodeProto, 'eulerAngles', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Vec3> {
        return this.getEulerAngles();
    },
    set (v: Readonly<Vec3>) {
        this.setRotationFromEuler(v.x, v.y, v.z);
    },
});

Object.defineProperty(nodeProto, 'worldMatrix', {
    configurable: true,
    enumerable: true,
    get () : Readonly<Vec3> {
        return this.getWorldMatrix();
    },
});

Object.defineProperty(nodeProto, 'forward', {
    configurable: true,
    enumerable: true,
    get () : Vec3 {
        return this.getForward();
    },
    set (dir: Vec3) {
        this.forward = dir;
    },
});

Object.defineProperty(nodeProto, 'up', {
    configurable: true,
    enumerable: true,
    get () : Vec3 {
        return this.getUp();
    },
});

Object.defineProperty(nodeProto, 'right', {
    configurable: true,
    enumerable: true,
    get () : Vec3 {
        return this.getRight();
    },
});

Object.defineProperty(nodeProto, 'eventProcessor', {
    configurable: true,
    enumerable: true,
    get () : NodeEventProcessor {
        return this._eventProcessor;
    },
});

Object.defineProperty(nodeProto, 'components', {
    configurable: true,
    enumerable: true,
    get () : ReadonlyArray<Component> {
        return this._components;
    },
});

Object.defineProperty(nodeProto, '_parent', {
    configurable: true,
    enumerable: true,
    get () {
        return this._parentInternal;
    },
    set (v) {
        jsb.registerNativeRef(v, this); // Root JSB object to avoid child node being garbage collected
        this._parentInternal = v;
    },
});

Object.defineProperty(nodeProto, 'parent', {
    configurable: true,
    enumerable: true,
    get () {
        return this.getParent();
    },
    set (v) {
        jsb.registerNativeRef(v, this); // Root JSB object to avoid child node being garbage collected
        this.setParent(v);
    },
});

Object.defineProperty(nodeProto, 'children', {
    configurable: true,
    enumerable: true,
    get () {
        return this._children;
    },
    set(v) {
        this._children = v;
    }
});

nodeProto.addChild = function (child: Node): void {
    jsb.registerNativeRef(this, child); // Root JSB object to avoid child node being garbage collected
    child.setParent(this);
};

nodeProto.insertChild = function (child: Node, siblingIndex: number) {
    child.parent = this;
    child.setSiblingIndex(siblingIndex);
};

nodeProto.removeFromParent = function () {
    if (this._parent) {
        this._parent.removeChild(this);
    }
};

const oldRemoveChild = nodeProto.removeChild;
nodeProto.removeChild = function (child: Node) {
    oldRemoveChild.call(this, child);
    jsb.unregisterNativeRef(this, child);
};

const oldRemoveAllChildren = nodeProto.removeAllChildren;
nodeProto.removeAllChildren = function () {
    oldRemoveAllChildren.call(this);
    // cjh TODO: need to improve performance
    const children = this.getChildren();
    for (let i = children.length - 1; i >= 0; i--) {
        const node = children[i];
        if (node) {
            jsb.unregisterNativeRef(this, node);
        }
    }
};

nodeProto[serializeTag] = function (serializationOutput: SerializationOutput, context: SerializationContext) {
    if (!EDITOR) {
        serializationOutput.writeThis();
        return;
    }
};

nodeProto._onActiveNode = function (shouldActiveNow: boolean) {
    legacyCC.director._nodeActivator.activateNode(this, shouldActiveNow);
};

nodeProto._onBatchCreated = function(dontSyncChildPrefab: boolean) {
    const prefabInstance = this._prefab?.instance;
    if (!dontSyncChildPrefab && prefabInstance) {
        createNodeWithPrefab(this);
    }

    this.hasChangedFlags = TransformBit.TRS;
    this._dirtyFlags |= TransformBit.TRS;
    this._uiProps.uiTransformDirty = true;
    const children = this._children;
    const len = children.length;
    for (let i = 0; i < len; ++i) {
        children[i]._siblingIndex = i;
        children[i]._onBatchCreated(dontSyncChildPrefab);
    }

    // apply mounted children and property overrides after all the nodes in prefabAsset are instantiated
    if (!dontSyncChildPrefab && prefabInstance) {
        const targetMap: Record<string, any | Node | Component> = {};
        prefabInstance.targetMap = targetMap;
        generateTargetMap(this, targetMap, true);

        applyMountedChildren(this, prefabInstance.mountedChildren, targetMap);
        applyRemovedComponents(this, prefabInstance.removedComponents, targetMap);
        applyMountedComponents(this, prefabInstance.mountedComponents, targetMap);
        applyPropertyOverrides(this, prefabInstance.propertyOverrides, targetMap);
    }

    applyTargetOverrides(this);
};

nodeProto._instantiate = function (cloned: Node, isSyncedNode: boolean) {
    if (!cloned) {
        cloned = legacyCC.instantiate._clone(this, this);
    }

    const newPrefabInfo = cloned._prefab;
    if (EDITOR && newPrefabInfo) {
        if (cloned === newPrefabInfo.root) {
            // newPrefabInfo.fileId = '';
        } else {
            // var PrefabUtils = Editor.require('scene://utils/prefab');
            // PrefabUtils.unlinkPrefab(cloned);
        }
    }
    if (EDITOR && legacyCC.GAME_VIEW) {
        const syncing = newPrefabInfo && cloned === newPrefabInfo.root && newPrefabInfo.sync;
        if (!syncing) {
            cloned._name += ' (Clone)';
        }
    }

    // reset and init
    cloned._parent = null;
    cloned._onBatchCreated(isSyncedNode);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cloned;
};

// Deserialization
const _class2$u = Node;

// cjh FIXME: replace object.ts with object.jsb.ts
_applyDecoratedDescriptor(_class2$u.prototype, '_name', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return '';
    },
});

_applyDecoratedDescriptor(_class2$u.prototype, '_objFlags', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0;
    },
});
//

const _descriptor$o = _applyDecoratedDescriptor(_class2$u.prototype, '_parent', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return null;
    },
});

const _descriptor2$h = _applyDecoratedDescriptor(_class2$u.prototype, '_children', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

const _descriptor3$b = _applyDecoratedDescriptor(_class2$u.prototype, '_active', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return true;
    },
});

const _descriptor4$9 = _applyDecoratedDescriptor(_class2$u.prototype, '_components', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

const _descriptor5$6 = _applyDecoratedDescriptor(_class2$u.prototype, '_prefab', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return null;
    },
});

// Node
const _class2$v = Node;
const _descriptor$p = _applyDecoratedDescriptor(_class2$v.prototype, '_lpos', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Vec3();
    },
});

const _descriptor2$i = _applyDecoratedDescriptor(_class2$v.prototype, '_lrot', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Quat();
    },
});

const _descriptor3$c = _applyDecoratedDescriptor(_class2$v.prototype, '_lscale', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Vec3(1, 1, 1);
    },
});

const _descriptor4$a = _applyDecoratedDescriptor(_class2$v.prototype, '_layer', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return Layers.Enum.DEFAULT;
    },
});

const _descriptor5$7 = _applyDecoratedDescriptor(_class2$v.prototype, '_euler', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Vec3();
    },
});

const _dec2$i = type(Vec3);
_applyDecoratedDescriptor(_class2$v.prototype, 'eulerAngles', [_dec2$i], Object.getOwnPropertyDescriptor(_class2$v.prototype, 'eulerAngles'), _class2$v.prototype);
_applyDecoratedDescriptor(_class2$v.prototype, 'angle', [editable], Object.getOwnPropertyDescriptor(_class2$v.prototype, 'angle'), _class2$v.prototype);
_applyDecoratedDescriptor(_class2$v.prototype, 'layer', [editable], Object.getOwnPropertyDescriptor(_class2$v.prototype, 'layer'), _class2$v.prototype);

//
nodeProto._ctor = function (name?: string) {
    this._components = [];
    this._eventProcessor = new legacyCC.NodeEventProcessor(this);
    this._uiProps = new NodeUIProperties(this);
    this._prefab = null;

    this._registerListeners();
    // // for deserialization
    // // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const _this = this;
    // // baseNode properties
    // _initializerDefineProperty(_this, "_parent", _descriptor$o, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_children", _descriptor2$h, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_active", _descriptor3$b, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_components", _descriptor4$9, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_prefab", _descriptor5$6, _assertThisInitialized(_this));
    // // Node properties
    // _initializerDefineProperty(_this, "_lpos", _descriptor$p, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_lrot", _descriptor2$i, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_lscale", _descriptor3$c, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_layer", _descriptor4$a, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_euler", _descriptor5$7, _assertThisInitialized(_this));
    // //
    // defineArrayProxy({
    //     owner: this,
    //     arrElementType: "object",
    //     arrPropertyName: "_children",
    //     getArrayElementCB(index: number) {
    //         return this._getChild(index);
    //     },
    //     getArraySizeCB(): number {
    //         return this._getChildrenSize();
    //     },
    //     setArrayElementCB(index: number, val: any): void {
    //         this._setChild(index, val);
    //     },
    //     setArraySizeCB(size: number): void {
    //         this._setChildrenSize(size);
    //     },
    // });

    this._children = [];
};
//
clsDecorator(Node);
