/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 * @hidden
 */

import { ccclass, serializable, editable } from 'cc.decorator';
import { EDITOR, SUPPORT_JIT } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { Prefab } from '../assets';
import type { Node } from '../scene-graph/node';
import { Component } from '../components';
import { errorID } from '../platform/debug';

function compareStringArray (array1: string[]|undefined, array2: string[]|undefined) {
    if (!array1 || !array2) {
        return false;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    return array1.every((value, index) => value === array2[index]);
}

@ccclass('cc.TargetInfo')
export class TargetInfo {
    // 用于标识目标在prefab 资源中的ID，区别于UUID
    @serializable
    public localID: string[] = [];
}

@ccclass('CCPropertyOverride')
export class PropertyOverride {
    @serializable
    public targetInfo: TargetInfo|null = null;
    @serializable
    public propertyPath: string[] = [];
    @serializable
    public value: any;

    public isEqual (localID: string[], propPath: string[]) {
        return compareStringArray(this.targetInfo?.localID, localID)
        && compareStringArray(this.propertyPath, propPath);
    }
}

/**
 * Prefab实例类
 */
@ccclass('cc.PrefabInstance')
export class PrefabInstance {
    // Identify current prefabInstance;
    @serializable
    public fileId = '';

    // 记录PrefabInstance所属的Prefab的Root节点信息
    @serializable
    public prefabRootNode?: Node;

    // 所属的 prefab 资源对象 (cc.Prefab)
    // In Editor, only asset._uuid is usable because asset will be changed.
    @serializable
    @editable
    public asset: Prefab|null = null;

    // 实例化的Prefab中额外增加的子节点数据
    @serializable
    public addedChildren: Node[] = [];

    // 属性的覆盖数据
    @serializable
    public propertyOverrides: PropertyOverride[] = [];

    @serializable
    public removeComponents: TargetInfo[] = [];

    public findPropertyOverride (localID: string[], propPath: string[]) {
        for (let i = 0; i < this.propertyOverrides.length; i++) {
            const propertyOverride = this.propertyOverrides[i];
            if (propertyOverride.isEqual(localID, propPath)) {
                return propertyOverride;
            }
        }

        return null;
    }

    public removePropertyOverride (localID: string[], propPath: string[]) {
        for (let i = 0; i < this.propertyOverrides.length; i++) {
            const propertyOverride = this.propertyOverrides[i];
            if (propertyOverride.isEqual(localID, propPath)) {
                this.propertyOverrides.splice(i, 1);
                break;
            }
        }
    }
}

interface IPreserveProps {
    _objFlags: number;
    _parent: Node|null;
    _id: string;
    _prefabInstance: PrefabInstance;
}

function getPreservedProps (node: any): IPreserveProps {
    return {
        _objFlags: node._objFlags,
        _parent: node._parent,
        _id: node._id,
        _prefabInstance: node._prefabInstance,
    };
}

function restorePreservedProps (node: any, preservedProps: IPreserveProps) {
    node._objFlags = preservedProps._objFlags;
    node._parent = preservedProps._parent;
    node._id = preservedProps._id;
    node._prefabInstance = preservedProps._prefabInstance;
}

export function createNodeWithPrefab (node: Node) {
    // @ts-expect-error: private member access
    const _prefabInstance = node._prefabInstance;

    if (!_prefabInstance) {
        return;
    }

    if (!_prefabInstance.asset) {
        if (EDITOR) {
            // TODO show message in editor
        } else {
            errorID(3701, node.name);
        }

        // @ts-expect-error: private member access
        node._prefabInstance = null;
        return;
    }

    // save root's preserved props to avoid overwritten by prefab
    const preservedProps = getPreservedProps(node);

    // instantiate prefab
    legacyCC.game._isCloning = true;
    if (SUPPORT_JIT) {
        // @ts-expect-error: private member access
        _prefabInstance.asset._doInstantiate(node);
    } else {
        // root in prefab asset is always synced
        const prefabRoot = _prefabInstance.asset.data;

        // use node as the instantiated prefabRoot to make references to prefabRoot in prefab redirect to node
        prefabRoot._iN$t = node;

        // instantiate prefab and apply to node
        legacyCC.instantiate._clone(prefabRoot, prefabRoot);
    }
    legacyCC.game._isCloning = false;

    // restore preserved props
    restorePreservedProps(node, preservedProps);

    // @ts-expect-error: private member access
    const prefabInfo = node._prefab;
    if (prefabInfo) {
        prefabInfo.sync = true;     // default to sync
    }
}

function walkNode (node: Node, handleFunc: (nodeIter: Node) => void) {
    if (handleFunc) {
        handleFunc(node);
    }

    const children = node.children;
    for (let i = 0; i < children.length; i++) {
        walkNode(children[i], handleFunc);
    }
}

export function generateTargetMap (node: Node, targetMap: any, isRoot: boolean) {
    let curTargetMap = targetMap;

    // @ts-expect-error: private member access
    const prefabInstance = node._prefabInstance;
    if (!isRoot && prefabInstance) {
        targetMap[prefabInstance.fileId] = {};
        curTargetMap = targetMap[prefabInstance.fileId];
    }

    // @ts-expect-error: private member access
    const prefabInfo = node._prefab;
    if (prefabInfo) {
        curTargetMap[prefabInfo.fileId] = node;
    }

    const components = node.components;
    for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        if (comp.__prefab) {
            curTargetMap[comp.__prefab.fileId] = comp;
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        const childNode = node.children[i];
        generateTargetMap(childNode, curTargetMap, false);
    }
}

export function getTarget (localID: string[], targetMap: any): unknown {
    if (!localID) {
        return null;
    }

    let target: any = targetMap;
    for (let i = 0; i < localID.length; i++) {
        if (!target) {
            return null;
        }
        target = target[localID[i]];
    }

    return target;
}

export function applyPropertyOverrides (node: Node, propertyOverrides: PropertyOverride[]) {
    if (propertyOverrides.length <= 0) {
        return;
    }

    // 待优化，需要更省更快速的组建node,component的id映射表
    const targetMap: {[index:string]: any|Node|Component} = {};

    generateTargetMap(node, targetMap, true);

    let target: any = null;
    for (let i = 0; i < propertyOverrides.length; i++) {
        const propOverride = propertyOverrides[i];
        if (propOverride && propOverride.targetInfo) {
            const targetInfo = propOverride.targetInfo;
            target = getTarget(targetInfo.localID, targetMap);
            if (!target) {
                // Can't find target
                continue;
            }

            let targetPropOwner: any = target;
            let targetPropOwnerParent: any = target;    // 用于记录最后数组所在的object
            let targetPropOwnerName = '';
            const propertyPath = propOverride.propertyPath.slice();
            if (propertyPath.length > 0) {
                const targetPropName = propertyPath.pop();

                for (let i = 0; i < propertyPath.length; i++) {
                    const propName = propertyPath[i];
                    targetPropOwnerName = propName;
                    targetPropOwnerParent = targetPropOwner;
                    targetPropOwner = targetPropOwner[propName];
                }

                targetPropOwner[targetPropName!] = propOverride.value;

                // 如果是改数组元素，需要重新赋值一下自己以触发setter
                if (Array.isArray(targetPropOwner) && targetPropOwnerParent && targetPropOwnerName) {
                    targetPropOwnerParent[targetPropOwnerName] = targetPropOwner;
                }
            } else {
                console.warn('property path is empty');
            }
        }
    }
}

/**
 * whether the node is the root of a prefab
 * @param node node
 */
export function isPrefabInstanceRoot (node: Node) {
    // @ts-expect-error: private member access
    return !!node._prefabInstance;
}

/**
 * whether the node is child of a prefab
 * @param node node
 */
export function isChildOfPrefabInstance (node: Node) {
    let parent = node.parent;
    let hasPrefabRootInParent = false;
    while (parent) {
        // @ts-expect-error: private member access
        if (parent._prefabInstance) {
            hasPrefabRootInParent = true;
            break;
        }
        parent = parent.parent;
    }

    return hasPrefabRootInParent;
}

/**
 * whether the node is part of a prefab,
 * root of prefab is also part of prefab
 * @param node node
 */
export function isPartOfPrefabInstance (node: Node) {
    let parent: Node|null = node;
    let hasPrefabRootInParent = false;
    while (parent) {
        // @ts-expect-error: private member access
        if (parent._prefabInstance) {
            hasPrefabRootInParent = true;
            break;
        }
        parent = parent.parent;
    }

    return hasPrefabRootInParent;
}
