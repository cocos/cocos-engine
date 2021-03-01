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

import { ccclass, serializable, editable, type } from 'cc.decorator';
import { EDITOR, SUPPORT_JIT } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { Prefab } from '../assets';
import type { Node } from '../scene-graph/node';
import { errorID, warn } from '../platform/debug';
import { Component } from '../components';
import { CCObject } from '../data';
import type { BaseNode } from '../scene-graph/base-node';

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
@ccclass('cc.TargetOverrideInfo')
export class TargetOverrideInfo {
    @serializable
    @type(CCObject)
    public source: Component|Node|null = null;
    // if owner is in a prefab, use TargetInfo to index it
    @serializable
    @type(TargetInfo)
    public sourceInfo: TargetInfo|null = null;
    @serializable
    public propertyPath: string[] = [];
    @serializable
    @type(legacyCC.Node)
    public target: Node|null = null;
    // if target is in a prefab, use TargetInfo to index it
    @serializable
    @type(TargetInfo)
    public targetInfo: TargetInfo|null = null;
}
@ccclass('cc.PrefabInfo')
export class PrefabInfo {
    // the most top node of this prefab in the scene
    @serializable
    @editable
    public root?: Node;

    // 所属的 prefab 资源对象 (cc.Prefab)
    // In Editor, only asset._uuid is usable because asset will be changed.
    @serializable
    @editable
    public asset?: Prefab;

    // 用来标识别该节点在 prefab 资源中的位置，因此这个 ID 只需要保证在 Assets 里不重复就行
    @serializable
    @editable
    public fileId = '';

    // Instance of a prefabAsset
    @serializable
    public instance?: PrefabInstance;

    @serializable
    @type([TargetOverrideInfo])
    public targetOverrides?: TargetOverrideInfo[];
}

legacyCC._PrefabInfo = PrefabInfo;

@ccclass('cc.CompPrefabInfo')
export class CompPrefabInfo {
    // To identify current component in a prefab asset, so only needs to be unique.
    @serializable
    @editable
    public fileId = '';
}

@ccclass('CCPropertyOverrideInfo')
export class PropertyOverrideInfo {
    @serializable
    @type(TargetInfo)
    public targetInfo: TargetInfo|null = null;
    @serializable
    public propertyPath: string[] = [];
    @serializable
    public value: any;

    // eslint-disable-next-line consistent-return
    public isTarget (localID: string[], propPath: string[]) {
        if (EDITOR) {
            return compareStringArray(this.targetInfo?.localID, localID)
            && compareStringArray(this.propertyPath, propPath);
        }
    }
}

@ccclass('cc.MountedChildrenInfo')
export class MountedChildrenInfo {
    @serializable
    @type(TargetInfo)
    public targetInfo: TargetInfo|null = null;
    @serializable
    @type([legacyCC.Node])
    public nodes: Node[] = [];

    // eslint-disable-next-line consistent-return
    public isTarget (localID: string[]) {
        if (EDITOR) {
            return compareStringArray(this.targetInfo?.localID, localID);
        }
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
    @type(legacyCC.Node)
    public prefabRootNode?: Node;

    // 实例化的Prefab中额外增加的子节点数据
    @serializable
    @type([MountedChildrenInfo])
    public mountedChildren: MountedChildrenInfo[] = [];

    // 属性的覆盖数据
    @serializable
    @type([PropertyOverrideInfo])
    public propertyOverrides: PropertyOverrideInfo[] = [];

    @serializable
    @type([TargetInfo])
    public removedComponents: TargetInfo[] = [];

    public targetMap: Record<string, any | Node | Component> = {};

    // eslint-disable-next-line consistent-return
    public findPropertyOverride (localID: string[], propPath: string[]) {
        if (EDITOR) {
            for (let i = 0; i < this.propertyOverrides.length; i++) {
                const propertyOverride = this.propertyOverrides[i];
                if (propertyOverride.isTarget(localID, propPath)) {
                    return propertyOverride;
                }
            }
            return null;
        }
    }

    public removePropertyOverride (localID: string[], propPath: string[]) {
        if (EDITOR) {
            for (let i = 0; i < this.propertyOverrides.length; i++) {
                const propertyOverride = this.propertyOverrides[i];
                if (propertyOverride.isTarget(localID, propPath)) {
                    this.propertyOverrides.splice(i, 1);
                    break;
                }
            }
        }
    }
}

export function createNodeWithPrefab (node: Node) {
    // @ts-expect-error: private member access
    const prefabInfo = node._prefab;
    if (!prefabInfo) {
        return;
    }

    const prefabInstance = prefabInfo.instance;

    if (!prefabInstance) {
        return;
    }

    if (!prefabInfo.asset) {
        if (EDITOR) {
            // TODO show message in editor
        } else {
            errorID(3701, node.name);
        }

        // @ts-expect-error: private member access
        prefabInfo.instance = null;
        return;
    }

    // save root's preserved props to avoid overwritten by prefab
    const _objFlags =  node._objFlags;
    // @ts-expect-error: private member access
    const _parent = node._parent;
    // @ts-expect-error: private member access
    const _id = node._id;
    // @ts-expect-error: private member access
    const _prefab = node._prefab;

    // instantiate prefab
    legacyCC.game._isCloning = true;
    if (SUPPORT_JIT) {
        // @ts-expect-error: private member access
        prefabInfo.asset._doInstantiate(node);
    } else {
        // root in prefab asset is always synced
        const prefabRoot = prefabInfo.asset.data;

        // use node as the instantiated prefabRoot to make references to prefabRoot in prefab redirect to node
        prefabRoot._iN$t = node;

        // instantiate prefab and apply to node
        legacyCC.instantiate._clone(prefabRoot, prefabRoot);
    }
    legacyCC.game._isCloning = false;

    // restore preserved props
    node._objFlags = _objFlags;
    // @ts-expect-error: private member access
    node._parent = _parent;
    // @ts-expect-error: private member access
    node._id = _id;

    // @ts-expect-error: private member access
    if (node._prefab) {
        // just keep the instance
        // @ts-expect-error: private member access
        node._prefab.instance = _prefab?.instance;
    }
}

// TODO: more efficient id->Node/Component map
export function generateTargetMap (node: Node, targetMap: any, isRoot: boolean) {
    let curTargetMap = targetMap;

    // @ts-expect-error: private member access
    const prefabInstance = node._prefab?.instance;
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

export function getTarget (localID: string[], targetMap: any) {
    if (!localID) {
        return null;
    }

    let target: Component|Node|null = null;
    let targetIter: any = targetMap;
    for (let i = 0; i < localID.length; i++) {
        if (!targetIter) {
            return null;
        }
        targetIter = targetIter[localID[i]];
    }

    target = targetIter;

    return target;
}

export function applyMountedChildren (node: Node, mountedChildren: MountedChildrenInfo[], targetMap: Record<string, any | Node | Component>) {
    if (!mountedChildren) {
        return;
    }

    for (let i = 0; i < mountedChildren.length; i++) {
        const childInfo = mountedChildren[i];
        if (childInfo && childInfo.targetInfo) {
            const target = getTarget(childInfo.targetInfo.localID, targetMap) as Node;
            if (!target) {
                continue;
            }

            if (childInfo.nodes) {
                for (let i = 0; i < childInfo.nodes.length; i++) {
                    const childNode = childInfo.nodes[i];
                    // @ts-expect-error private member access
                    target._children.push(childNode);
                    // @ts-expect-error private member access
                    childNode._parent = target;
                    // siblingIndex update is in _onBatchCreated function, and it needs a parent.
                    childNode._onBatchCreated(false);
                }
            }
        }
    }
}

export function applyPropertyOverrides (node: Node, propertyOverrides: PropertyOverrideInfo[], targetMap: Record<string, any | Node | Component>) {
    if (propertyOverrides.length <= 0) {
        return;
    }

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
            const propertyPath = propOverride.propertyPath.slice();
            if (propertyPath.length > 0) {
                const targetPropName = propertyPath.pop();
                if (!targetPropName) {
                    continue;
                }

                for (let i = 0; i < propertyPath.length; i++) {
                    const propName = propertyPath[i];
                    targetPropOwner = targetPropOwner[propName];
                    if (!targetPropOwner) {
                        break;
                    }
                }

                if (!targetPropOwner) {
                    continue;
                }

                if (Array.isArray(targetPropOwner)) {
                    // if set element of a array, the length of a array must has been defined.
                    if (targetPropName === 'length') {
                        targetPropOwner[targetPropName] = propOverride.value;
                    } else {
                        const index = Number.parseInt(targetPropName);
                        if (Number.isInteger(index) && index < targetPropOwner.length) {
                            targetPropOwner[targetPropName] = propOverride.value;
                        }
                    }
                } else {
                    targetPropOwner[targetPropName] = propOverride.value;
                }
            } else if (EDITOR) {
                warn('property path is empty');
            }
        }
    }
}

export function applyTargetOverrides (node: BaseNode) {
    // @ts-expect-error private member access
    const targetOverrides = node._prefab?.targetOverrides;
    if (targetOverrides) {
        for (let i = 0;  i < targetOverrides.length; i++) {
            const targetOverride = targetOverrides[i];

            let source: Node|Component|null = targetOverride.source;
            const sourceInfo = targetOverride.sourceInfo;
            if (sourceInfo) {
                // @ts-expect-error private member access
                const sourceInstance = targetOverride.source?._prefab?.instance;
                if (sourceInstance && sourceInstance.targetMap) {
                    source = getTarget(sourceInfo.localID, sourceInstance.targetMap);
                }

                if (!source) {
                    // Can't find source
                    continue;
                }
            }

            let target: Node|Component|null = null;
            const targetInfo = targetOverride.targetInfo;
            if (!targetInfo) {
                continue;
            }

            // @ts-expect-error private member access
            const targetInstance = targetOverride.target?._prefab?.instance;
            if (!targetInstance || !targetInstance.targetMap) {
                continue;
            }
            target = getTarget(targetInfo.localID, targetInstance.targetMap);
            if (!target) {
                // Can't find target
                continue;
            }

            const propertyPath = targetOverride.propertyPath.slice();
            let targetPropOwner: any = source;
            if (propertyPath.length > 0) {
                const targetPropName = propertyPath.pop();
                if (!targetPropName) {
                    return;
                }

                for (let i = 0; i < propertyPath.length; i++) {
                    const propName = propertyPath[i];
                    targetPropOwner = targetPropOwner[propName];
                }

                targetPropOwner[targetPropName] = target;
            }
        }
    }
}
