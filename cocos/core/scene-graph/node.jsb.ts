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
import { SerializationContext, SerializationOutput, serializeTag } from '../data';
import { EDITOR } from '../default-constants';
import {
    applyMountedChildren,
    applyMountedComponents, applyPropertyOverrides,
    applyRemovedComponents, applyTargetOverrides,
    createNodeWithPrefab,
    generateTargetMap,
} from '../utils/prefab/utils';
import { getClassByName, isChildClassOf } from '../utils/js-typed';
import { syncNodeValues } from "../utils/jsb-utils";

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

// For optimize getPosition, getRotation, getScale
export const _tempFloatArray = new Float32Array([
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
]);
//

Node._setTempFloatArray(_tempFloatArray.buffer);

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
        NodeCls._findChildComponents(this.children, constructor, components);
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

const REGISTERED_EVENT_MASK_TRANSFORM_CHANGED = (1 << 0);
const REGISTERED_EVENT_MASK_PARENT_CHANGED = (1 << 1);
const REGISTERED_EVENT_MASK_LAYER_CHANGED = (1 << 2);
const REGISTERED_EVENT_MASK_CHILD_REMOVED_CHANGED = (1 << 3);
const REGISTERED_EVENT_MASK_CHILD_ADDED_CHANGED = (1 << 4);
const REGISTERED_EVENT_MASK_SIBLING_ORDER_CHANGED_CHANGED = (1 << 5);

nodeProto.on = function (type, callback, target, useCapture: any = false) {
    switch (type) {
        case NodeEventType.TRANSFORM_CHANGED:

            // this._eventMask |= TRANSFORM_ON;
            this.setEventMask(this.getEventMask() | ~TRANSFORM_ON);
            if (!(this._registeredNodeEventTypeMask & REGISTERED_EVENT_MASK_TRANSFORM_CHANGED)) {
                this._registerOnTransformChanged();
                this._registeredNodeEventTypeMask |= REGISTERED_EVENT_MASK_TRANSFORM_CHANGED;
            }
            break;
        case NodeEventType.PARENT_CHANGED:
            if (!(this._registeredNodeEventTypeMask & REGISTERED_EVENT_MASK_PARENT_CHANGED)) {
                this._registerOnParentChanged();
                this._registeredNodeEventTypeMask |= REGISTERED_EVENT_MASK_PARENT_CHANGED;
            }
            break;
        case NodeEventType.LAYER_CHANGED:
            if (!(this._registeredNodeEventTypeMask & REGISTERED_EVENT_MASK_LAYER_CHANGED)) {
                this._registerOnLayerChanged();
                this._registeredNodeEventTypeMask |= REGISTERED_EVENT_MASK_LAYER_CHANGED;
            }
            break;
        case NodeEventType.CHILD_REMOVED:
            if (!(this._registeredNodeEventTypeMask & REGISTERED_EVENT_MASK_CHILD_REMOVED_CHANGED)) {
                this._registerOnChildRemoved();
                this._registeredNodeEventTypeMask |= REGISTERED_EVENT_MASK_CHILD_REMOVED_CHANGED;
            }
            break;
        case NodeEventType.CHILD_ADDED:
            if (!(this._registeredNodeEventTypeMask & REGISTERED_EVENT_MASK_CHILD_ADDED_CHANGED)) {
                this._registerOnChildAdded();
                this._registeredNodeEventTypeMask |= REGISTERED_EVENT_MASK_CHILD_ADDED_CHANGED;
            }
            break;
        case NodeEventType.SIBLING_ORDER_CHANGED:
            if (!(this._registeredNodeEventTypeMask & REGISTERED_EVENT_MASK_SIBLING_ORDER_CHANGED_CHANGED)) {
                this._registerOnSiblingOrderChanged();
                this._registeredNodeEventTypeMask |= REGISTERED_EVENT_MASK_SIBLING_ORDER_CHANGED_CHANGED;
            }
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
    // Destroy node event processor
    this._eventProcessor.destroy();
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
        this._eventProcessor.setEnabled(true);
        // in case transform updated during deactivated period
        this.invalidateChildren(TransformBit.TRS);
        // ALL Node renderData dirty flag will set on here
        if (this._uiProps && this._uiProps.uiComp) {
            this._uiProps.uiComp.setNodeDirty();
            this._uiProps.uiComp.setTextureDirty(); // for dynamic atlas
            this._uiProps.uiComp.markForUpdateRenderData();
        }
    } else { // deactivated
        this._eventProcessor.setEnabled(false);
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

        const childChildren = node.children;
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

        const childChildren = node.children;
        if (childChildren.length > 0) {
            NodeCls._findChildComponents(childChildren, constructor, components);
        }
    }
};

/**
 * @en Determine whether the given object is a normal Node. Will return false if [[Scene]] given.
 * @zh 指定对象是否是普通的节点？如果传入 [[Scene]] 会返回 false。
 */
NodeCls.isNode = function (obj: unknown): obj is jsb.Node {
    return obj instanceof jsb.Node && (obj.constructor === jsb.Node || !(obj instanceof legacyCC.Scene));
};

const oldGetPosition = nodeProto.getPosition;
const oldSetPosition = nodeProto.setPosition;
const oldGetRotation = nodeProto.getRotation;
const oldSetRotation = nodeProto.setRotation;
const oldSetRotationFromEuler = nodeProto.setRotationFromEuler;
const oldGetScale = nodeProto.getScale;
const oldSetScale = nodeProto.setScale;
const oldGetWorldPosition = nodeProto.getWorldPosition;
const oldGetWorldRotation = nodeProto.getWorldRotation;
const oldGetWorldScale = nodeProto.getWorldScale;
const oldEulerAngles = nodeProto.getEulerAngles;
const oldGetWorldMatrix = nodeProto.getWorldMatrix;
const oldGetForward = nodeProto.getForward;
const oldGetUp = nodeProto.getUp;
const oldGetRight = nodeProto.getRight;
const oldSetRTS = nodeProto.setRTS;
let _tempQuat = new Quat();

nodeProto.setRTS = function (rot?: Quat | Vec3, pos?: Vec3, scale?: Vec3) {
    if (rot) {
        let val = _tempQuat;
        if (rot as Quat) {
            val = rot as Quat;
        } else {
            Quat.fromEuler(val, rot.x, rot.y, rot.z);
        }
        _tempFloatArray[0] = 4;
        _tempFloatArray[1] = val.x;
        _tempFloatArray[2] = val.y;
        _tempFloatArray[3] = val.z;
        _tempFloatArray[4] = val.w;
        this._lrot.set(val.x, val.y, val.z, val.w);
    } else {
        _tempFloatArray[0] = 0;
    }

    if (pos) {
        _tempFloatArray[5] = 3;
        _tempFloatArray[6] = pos.x;
        _tempFloatArray[7] = pos.y;
        _tempFloatArray[8] = pos.z;
        this._lpos.set(pos.x, pos.y, pos.z);
    } else {
        _tempFloatArray[5] = 0;
    }
    if (scale) {
        _tempFloatArray[9] = 3;
        _tempFloatArray[10] = scale.x;
        _tempFloatArray[11] = scale.y;
        _tempFloatArray[12] = scale.z;
        this._lscale.set(scale.x, scale.y, scale.z);
    } else {
        _tempFloatArray[9] = 0;
    }
    oldSetRTS.call(this);
};

nodeProto.getPosition = function (out?: Vec3): Vec3 {
    // oldGetPosition.call(this);
    // if (out) {
    //     return Vec3.set(out, _tempFloatArray[0], _tempFloatArray[1], _tempFloatArray[2]);
    // }
    // const pos = this._positionCache;
    // pos.x = _tempFloatArray[0];
    // pos.y = _tempFloatArray[1];
    // pos.z = _tempFloatArray[2];
    // return pos;
    if (out) {
        return Vec3.set(out, this._lpos.x, this._lpos.y, this._lpos.z);
    }
    return Vec3.copy(this._positionCache, this._lpos);
};

nodeProto.setPosition = function setPosition (val: Readonly<Vec3> | number, y?: number, z?: number) {
    if (y === undefined && z === undefined) {
        _tempFloatArray[0] = 3;
        const pos = val as Vec3;
        this._lpos.x = _tempFloatArray[1] = pos.x;
        this._lpos.y = _tempFloatArray[2] = pos.y;
        this._lpos.z = _tempFloatArray[3] = pos.z;
    } else if (z === undefined) {
        _tempFloatArray[0] = 2;
        this._lpos.x = _tempFloatArray[1] = val as number;
        this._lpos.y = _tempFloatArray[2] = y as number;
    } else {
        _tempFloatArray[0] = 3;
        this._lpos.x = _tempFloatArray[1] = val as number;
        this._lpos.y = _tempFloatArray[2] = y as number;
        this._lpos.z = _tempFloatArray[3] = z as number;
    }
    oldSetPosition.call(this);
};

nodeProto.getRotation = function (out?: Quat): Quat {
    // const r = oldGetRotation.call(this);
    // if (out) {
    //     return Quat.set(out, r.x, r.y, r.z, r.w);
    // }
    // return Quat.copy(this._rotationCache || (this._rotationCache = new Quat()), r);

    if (out) {
        return Quat.set(out, this._lrot.x, this._lrot.y, this._lrot.z, this._lrot.w);
    }
    return Quat.copy(this._rotationCache, this._lrot);
};

nodeProto.setRotation = function (val: Readonly<Quat> | number, y?: number, z?: number, w?: number): void {
    if (y === undefined || z === undefined || w === undefined) {
        const rot = val as Readonly<Quat>;
        this._lrot.x = _tempFloatArray[0] = rot.x;
        this._lrot.y = _tempFloatArray[1] = rot.y;
        this._lrot.z = _tempFloatArray[2] = rot.z;
        this._lrot.w = _tempFloatArray[3] = rot.w;
    } else {
        this._lrot.x = _tempFloatArray[0] = val as number;
        this._lrot.y = _tempFloatArray[1] = y;
        this._lrot.z = _tempFloatArray[2] = z;
        this._lrot.w = _tempFloatArray[3] = w;
    }

    oldSetRotation.call(this);
};

nodeProto.setRotationFromEuler = function (val: Vec3 | number, y?: number, zOpt?: number): void {
    const z = zOpt === undefined ? this._euler.z : zOpt;

    if (y === undefined) {
        const euler = (val as Vec3);
        this._euler.x = _tempFloatArray[0] = euler.x;
        this._euler.y = _tempFloatArray[1] = euler.y;
        this._euler.z = _tempFloatArray[2] = euler.z;
    } else {
        this._euler.x = _tempFloatArray[0] = val as number;
        this._euler.y = _tempFloatArray[1] = y;
        this._euler.z = _tempFloatArray[2] = z;
    }

    oldSetRotationFromEuler.call(this);
};

nodeProto.getScale = function (out?: Vec3): Vec3 {
    // const r = oldGetScale.call(this);
    // if (out) {
    //     return Vec3.set(out, r.x, r.y, r.z);
    // }
    // return Vec3.copy(this._scaleCache || (this._scaleCache = new Vec3()), r);

    if (out) {
        return Vec3.set(out, this._lscale.x, this._lscale.y, this._lscale.z);
    }
    return Vec3.copy(this._scaleCache, this._lscale);
};

nodeProto.setScale = function (val: Readonly<Vec3> | number, y?: number, z?: number) {
    if (y === undefined && z === undefined) {
        _tempFloatArray[0] = 3;
        const scale = val as Vec3;
        this._lscale.x = _tempFloatArray[1] = scale.x;
        this._lscale.y = _tempFloatArray[2] = scale.y;
        this._lscale.z = _tempFloatArray[3] = scale.z;
    } else if (z === undefined) {
        _tempFloatArray[0] = 2;
        this._lscale.x = _tempFloatArray[1] = val as number;
        this._lscale.y = _tempFloatArray[2] = y as number;
    } else {
        _tempFloatArray[0] = 3;
        this._lscale.x = _tempFloatArray[1] = val as number;
        this._lscale.y = _tempFloatArray[2] = y as number;
        this._lscale.z = _tempFloatArray[3] = z;
    }
    oldSetScale.call(this);
};

nodeProto.getWorldPosition = function (out?: Vec3): Vec3 {
    const r = oldGetWorldPosition.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(this._worldPositionCache, r);
};

nodeProto.getWorldRotation = function (out?: Quat): Quat {
    const r = oldGetWorldRotation.call(this);
    if (out) {
        return Quat.copy(out, r);
    }
    return Quat.copy(this._worldRotationCache, r);
};

nodeProto.getWorldScale = function (out?: Vec3): Vec3 {
    const r = oldGetWorldScale.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(this._worldScaleCache, r);
};

nodeProto.getWorldMatrix = function getWorldMatrix(out?: Mat4): Mat4 {
    oldGetWorldMatrix.call(this);
    const target = out || this._worldMatrixCache;
    target.set(
        _tempFloatArray[0], _tempFloatArray[1], _tempFloatArray[2], _tempFloatArray[3],
        _tempFloatArray[4], _tempFloatArray[5], _tempFloatArray[6], _tempFloatArray[7],
        _tempFloatArray[8], _tempFloatArray[9], _tempFloatArray[10], _tempFloatArray[11],
        _tempFloatArray[12], _tempFloatArray[13], _tempFloatArray[14], _tempFloatArray[15],
    );
    return target;
};

nodeProto.getEulerAngles = function (out?: Vec3): Vec3 {
    const r = oldEulerAngles.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(this._eulerAnglesCache, r);
};

nodeProto.getForward = function (out?: Vec3): Vec3 {
    const r = oldGetForward.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(this._forwardCache, r);
};

nodeProto.getUp = function (out?: Vec3): Vec3 {
    const r = oldGetUp.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(this._upCache, r);
};

nodeProto.getRight = function (out?: Vec3): Vec3 {
    const r = oldGetRight.call(this);
    if (out) {
        return Vec3.copy(out, r);
    }
    return Vec3.copy(this._rightCache, r);
};

Object.defineProperty(nodeProto, 'position', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Vec3> {
        return this._lpos;
    },
    set (v: Readonly<Vec3>) {
        this.setPosition(v as Vec3);
    },
});

Object.defineProperty(nodeProto, 'rotation', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Quat> {
        return this._lrot;
    },
    set (v: Readonly<Quat>) {
        this.setRotation(v as Quat);
    },
});

Object.defineProperty(nodeProto, 'scale', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Vec3> {
        return this._lscale;
    },
    set (v: Readonly<Vec3>) {
        this.setScale(v as Vec3);
    },
});

Object.defineProperty(nodeProto, 'worldPosition', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Vec3> {
        return this.getWorldPosition();
    },
    set (v: Readonly<Vec3>) {
        this.setWorldPosition(v as Vec3);
    },
});

Object.defineProperty(nodeProto, 'worldRotation', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Quat> {
        return this.getWorldRotation();
    },
    set (v: Readonly<Quat>) {
        this.setWorldRotation(v as Quat);
    },
});

Object.defineProperty(nodeProto, 'worldScale', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Vec3> {
        return this.getWorldScale();
    },
    set (v: Readonly<Vec3>) {
        this.setWorldScale(v as Vec3);
    },
});

Object.defineProperty(nodeProto, '_pos', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Vec3> {
        return this.getWorldPosition();
    }
});

Object.defineProperty(nodeProto, '_rot', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Quat> {
        return this.getWorldRotation();
    }
});

Object.defineProperty(nodeProto, '_scale', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Vec3> {
        return this.getWorldScale();
    }
});

Object.defineProperty(nodeProto, 'eulerAngles', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Vec3> {
        return this.getEulerAngles();
    },
    set (v: Readonly<Vec3>) {
        this.setRotationFromEuler(v.x, v.y, v.z);
    },
});

Object.defineProperty(nodeProto, 'worldMatrix', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Mat4> {
        return this.getWorldMatrix();
    },
});

Object.defineProperty(nodeProto, '_mat', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Mat4> {
        return this.getWorldMatrix();
    },
});

Object.defineProperty(nodeProto, 'activeInHierarchy', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Boolean> {
        return this._activeInHierarchyArr[0] != 0;
    },
    set (v) {
        this._activeInHierarchyArr[0] = (v ? 1 : 0);
    },
});

Object.defineProperty(nodeProto, '_activeInHierarchy', {
    configurable: true,
    enumerable: true,
    get (): Readonly<Boolean> {
        return this._activeInHierarchyArr[0] != 0;
    },
    set (v) {
        this._activeInHierarchyArr[0] = (v ? 1 : 0);
    },
});

Object.defineProperty(nodeProto, 'layer', {
    configurable: true,
    enumerable: true,
    get () {
        return this._layerArr[0];
    },
    set (v) {
        this._layerArr[0] = v;
        if (this._uiProps && this._uiProps.uiComp) {
            this._uiProps.uiComp.setNodeDirty();
            this._uiProps.uiComp.markForUpdateRenderData();
        }
        this.emit(NodeEventType.LAYER_CHANGED, v);
    },
});

Object.defineProperty(nodeProto, '_layer', {
    configurable: true,
    enumerable: true,
    get () {
        return this._layerArr[0];
    },
    set (v) {
        this._layerArr[0] = v;
    },
});

Object.defineProperty(nodeProto, 'forward', {
    configurable: true,
    enumerable: true,
    get (): Vec3 {
        return this.getForward();
    },
    set (dir: Vec3) {
        this.setForward(dir);
    },
});

Object.defineProperty(nodeProto, 'up', {
    configurable: true,
    enumerable: true,
    get (): Vec3 {
        return this.getUp();
    },
});

Object.defineProperty(nodeProto, 'right', {
    configurable: true,
    enumerable: true,
    get (): Vec3 {
        return this.getRight();
    },
});

Object.defineProperty(nodeProto, 'eventProcessor', {
    configurable: true,
    enumerable: true,
    get (): NodeEventProcessor {
        return this._eventProcessor;
    },
});

Object.defineProperty(nodeProto, 'components', {
    configurable: true,
    enumerable: true,
    get (): ReadonlyArray<Component> {
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
        // jsb.registerNativeRef(v, this); // Root JSB object to avoid child node being garbage collected
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
        // jsb.registerNativeRef(v, this); // Root JSB object to avoid child node being garbage collected
        this.setParent(v);
    },
});

Object.defineProperty(nodeProto, 'children', {
    configurable: true,
    enumerable: true,
    get () {
        return this._children;
    },
    set (v) {
        this._children = v;
    },
});

Object.defineProperty(nodeProto, 'scene', {
    configurable: true,
    enumerable: true,
    get () {
        return this._scene;
    }
});

nodeProto.rotate = function (rot: Quat, ns?: NodeSpace): void {
    _tempFloatArray[1] = rot.x;
    _tempFloatArray[2] = rot.y;
    _tempFloatArray[3] = rot.z;
    _tempFloatArray[4] = rot.w;
    if (ns) {
        _tempFloatArray[5] = ns;
        _tempFloatArray[0] = 5;
    } else {
        _tempFloatArray[0] = 4;
    }
    this.rotateForJS();
};

nodeProto.addChild = function (child: Node): void {
    child.setParent(this);
};

nodeProto.insertChild = function (child: Node, siblingIndex: number) {
    child.parent = this;
    child.setSiblingIndex(siblingIndex);
};

// nodeProto.removeFromParent = function () {
//     if (this._parent) {
//         this._parent.removeChild(this);
//     }
// };
//
// const oldRemoveChild = nodeProto.removeChild;
// nodeProto.removeChild = function (child: Node) {
//     oldRemoveChild.call(this, child);
//     jsb.unregisterNativeRef(this, child);
// };
//
// const oldRemoveAllChildren = nodeProto.removeAllChildren;
// nodeProto.removeAllChildren = function () {
//     oldRemoveAllChildren.call(this);
//     // cjh TODO: need to improve performance
//     const children = this.children;
//     for (let i = children.length - 1; i >= 0; i--) {
//         const node = children[i];
//         if (node) {
//             jsb.unregisterNativeRef(this, node);
//         }
//     }
// };

nodeProto[serializeTag] = function (serializationOutput: SerializationOutput, context: SerializationContext) {
    if (!EDITOR) {
        serializationOutput.writeThis();
    }
};

nodeProto._onActiveNode = function (shouldActiveNow: boolean) {
    legacyCC.director._nodeActivator.activateNode(this, shouldActiveNow);
};

nodeProto._onBatchCreated = function (dontSyncChildPrefab: boolean) {
    this.hasChangedFlags = TransformBit.TRS;
    this._dirtyFlags |= TransformBit.TRS;
    const children = this._children;
    const len = children.length;
    for (let i = 0; i < len; ++i) {
        children[i]._siblingIndex = i;
        children[i]._onBatchCreated(dontSyncChildPrefab);
    }

    // Sync node _lpos, _lrot, _lscale to native
    syncNodeValues(this);
};

nodeProto._onSceneUpdated = function (scene) {
    this._scene = scene;
};

nodeProto._onLocalPositionUpdated = function (x, y, z) {
    const lpos = this._lpos;
    lpos.x = x;
    lpos.y = y;
    lpos.z = z;
};

nodeProto._onLocalRotationUpdated = function (x, y, z, w) {
    const lrot = this._lrot;
    lrot.x = x;
    lrot.y = y;
    lrot.z = z;
    lrot.w = w;
};

nodeProto._onLocalScaleUpdated = function (x, y, z) {
    const lscale = this._lscale;
    lscale.x = x;
    lscale.y = y;
    lscale.z = z;
};

nodeProto._onLocalPositionRotationScaleUpdated = function (px, py, pz, rx, ry, rz, rw, sx, sy, sz) {
    const lpos = this._lpos;
    lpos.x = px;
    lpos.y = py;
    lpos.z = pz;

    const lrot = this._lrot;
    lrot.x = rx;
    lrot.y = ry;
    lrot.z = rz;
    lrot.w = rw;

    const lscale = this._lscale;
    lscale.x = sx;
    lscale.y = sy;
    lscale.z = sz;
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
    this.__nativeRefs = {};
    this.__jsb_ref_id = undefined;
    this._iN$t = null;
    this.__editorExtras__ = { editorOnly: true };

    this._components = [];
    this._eventProcessor = new legacyCC.NodeEventProcessor(this);
    this._uiProps = new NodeUIProperties(this);
    this._activeInHierarchyArr = new Uint8Array([0]);
    this._layerArr = new Uint32Array([Layers.Enum.DEFAULT]);
    this._scene = null;
    this._prefab = null;
    // record scene's id when set this node as persist node
    this._originalSceneId = '';

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
    // this._isChildrenRedefined = false;

    this._lpos = new Vec3();
    this._lrot = new Quat();
    this._lscale = new Vec3(1, 1, 1);
    this._euler = new Vec3();
    const lpos = this._lpos;
    lpos.x = lpos.y = lpos.z = null;
    const lrot = this._lrot;
    lrot.x = lrot.y = lrot.z = lrot.w = null;
    const lscale = this._lscale;
    lscale.x = lscale.y = lscale.z = null;
    const euler = this._euler;
    euler.x = euler.y = euler.z = null;

    //inner use properties
    this._positionCache = new Vec3();
    this._rotationCache = new Quat();
    this._scaleCache = new Vec3();

    this._worldPositionCache = new Vec3();
    this._worldRotationCache = new Quat();
    this._worldScaleCache = new Vec3();
    this._worldMatrixCache = new Mat4();
    this._eulerAnglesCache = new Vec3();
    this._forwardCache = new Vec3();
    this._upCache = new Vec3();
    this._rightCache = new Vec3();
    this._worldRTCache = new Mat4();
    //

    this._registeredNodeEventTypeMask = 0;

    this.on(NodeEventType.CHILD_ADDED, (child)=>{
        this._children.push(child);
    });

    this.on(NodeEventType.CHILD_REMOVED, (child)=>{
        const removeAt = this._children.indexOf(child);
        if (removeAt < 0) {
            errorID(1633);
            return;
        }
        this._children.splice(removeAt, 1);
    });

    this._onSiblingIndexChanged = function (index) {
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
        }
    }
};
//
clsDecorator(Node);

const oldGetWorldRT = nodeProto.getWorldRT;
nodeProto.getWorldRT = function (out?: Mat4) {
    const worldRT = oldGetWorldRT.call(this);
    const target = out || this._worldRTCache;
    Mat4.copy(target, worldRT);
    return target;
};
