/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR } from 'internal:constants';
import { ccclass } from 'cc.decorator';
import { BaseNode } from './base-node';
import { replaceProperty, removeProperty } from '../utils/x-deprecated';
import { Layers } from './layers';
import { Node } from './node';
import { Vec2 } from '../math/vec2';
import { Size } from '../math/size';
import { legacyCC } from '../global-exports';
import { CCObject } from '../data/object';
import { warnID } from '../platform/debug';

replaceProperty(BaseNode.prototype, 'BaseNode', [
    {
        name: 'childrenCount',
        newName: 'children.length',
        customGetter (this: BaseNode) {
            return this.children.length;
        },
    },
]);

replaceProperty(Node.prototype, 'Node', [
    {
        name: 'width',
        targetName: 'node.getComponent(UITransform)',
        customGetter (this: Node) {
            return this._uiProps.uiTransformComp!.width;
        },
        customSetter (this: Node, value: number) {
            this._uiProps.uiTransformComp!.width = value;
        },
    },
    {
        name: 'height',
        targetName: 'node.getComponent(UITransform)',
        customGetter (this: Node) {
            return this._uiProps.uiTransformComp!.height;
        },
        customSetter (this: Node, value: number) {
            this._uiProps.uiTransformComp!.height = value;
        },
    },
    {
        name: 'anchorX',
        targetName: 'node.getComponent(UITransform)',
        customGetter (this: Node) {
            return this._uiProps.uiTransformComp!.anchorX;
        },
        customSetter (this: Node, value: number) {
            this._uiProps.uiTransformComp!.anchorX = value;
        },
    },
    {
        name: 'anchorY',
        targetName: 'node.getComponent(UITransform)',
        customGetter (this: Node) {
            return this._uiProps.uiTransformComp!.anchorY;
        },
        customSetter (this: Node, value: number) {
            this._uiProps.uiTransformComp!.anchorY = value;
        },
    },
    {
        name: 'getAnchorPoint',
        targetName: 'node.getComponent(UITransform)',
        customFunction (this: Node, out?: Vec2) {
            if (!out) {
                out = new Vec2();
            }
            out.set(this._uiProps.uiTransformComp!.anchorPoint);
            return out;
        },
    },
    {
        name: 'setAnchorPoint',
        targetName: 'node.getComponent(UITransform)',
        customFunction (this: Node, point: Vec2 | number, y?: number) {
            this._uiProps.uiTransformComp!.setAnchorPoint(point, y);
        },
    },
    {
        name: 'getContentSize',
        targetName: 'node.getComponent(UITransform)',
        customFunction (this: Node, out?: Size): Size {
            if (!out) {
                out = new Size();
            }

            out.set(this._uiProps.uiTransformComp!.contentSize);
            return out;
        },
    },
    {
        name: 'setContentSize',
        targetName: 'node.getComponent(UITransform)',
        customFunction (this: Node, size: Size | number, height?: number) {
            if (typeof size === 'number') {
                this._uiProps.uiTransformComp!.setContentSize(size, height!);
            } else {
                this._uiProps.uiTransformComp!.setContentSize(size);
            }
        },
    },
]);

removeProperty(Node.prototype, 'Node.prototype', [
    {
        name: 'addLayer',
    },
    {
        name: 'removeLayer',
    },
]);

removeProperty(Layers, 'Layers', [
    {
        name: 'All',
    },
    {
        name: 'RaycastMask',
    },
    {
        name: 'check',
    },
]);

replaceProperty(Layers, 'Layers', [
    {
        name: 'Default',
        newName: 'DEFAULT',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'Always',
        newName: 'ALWAYS',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'IgnoreRaycast',
        newName: 'IGNORE_RAYCAST',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'Gizmos',
        newName: 'GIZMOS',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'Editor',
        newName: 'EDITOR',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'UI',
        newName: 'UI_3D',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'UI2D',
        newName: 'UI_2D',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'SceneGizmo',
        newName: 'SCENE_GIZMO',
        target: Layers.Enum,
        targetName: 'Layers.Enum',
    },
    {
        name: 'makeInclusiveMask',
        newName: 'makeMaskInclude',
        target: Layers,
        targetName: 'Layers',
    },
    {
        name: 'makeExclusiveMask',
        newName: 'makeMaskExclude',
        target: Layers,
        targetName: 'Layers',
    },
]);

removeProperty(Layers.Enum, 'Layers.Enum', [
    {
        name: 'ALWAYS',
    },
]);

removeProperty(Layers.BitMask, 'Layers.BitMask', [
    {
        name: 'ALWAYS',
    },
]);

const HideInHierarchy = CCObject.Flags.HideInHierarchy;
const DontSave = CCObject.Flags.DontSave;

/**
 * @en
 * Class of private entities in Cocos Creator scenes.<br/>
 * The PrivateNode is hidden in editor, and completely transparent to users.<br/>
 * It's normally used as Node's private content created by components in parent node.<br/>
 * So in theory private nodes are not children, they are part of the parent node.<br/>
 * Private node have two important characteristics:<br/>
 * 1. It has the minimum z index and cannot be modified, because they can't be displayed over real children.<br/>
 * 2. The positioning of private nodes is also special, they will consider the left bottom corner of the parent node's bounding box as the origin of local coordinates.<br/>
 *    In this way, they can be easily kept inside the bounding box.<br/>
 * Currently, it's used by RichText component and TileMap component.
 * @zh
 * Cocos Creator 场景中的私有节点类。<br/>
 * 私有节点在编辑器中不可见，对用户透明。<br/>
 * 通常私有节点是被一些特殊的组件创建出来作为父节点的一部分而存在的，理论上来说，它们不是子节点，而是父节点的组成部分。<br/>
 * 私有节点有两个非常重要的特性：<br/>
 * 1. 它有着最小的渲染排序的 Z 轴深度，并且无法被更改，因为它们不能被显示在其他正常子节点之上。<br/>
 * 2. 它的定位也是特殊的，对于私有节点来说，父节点包围盒的左下角是它的局部坐标系原点，这个原点相当于父节点的位置减去它锚点的偏移。这样私有节点可以比较容易被控制在包围盒之中。<br/>
 * 目前在引擎中，RichText 和 TileMap 都有可能生成私有节点。
 */
@ccclass('cc.PrivateNode')
export class PrivateNode extends Node {
    constructor (name?: string) {
        super(name);
        warnID(4500, this.name);

        this.hideFlags |= DontSave | HideInHierarchy;
    }
}

if (EDITOR) {
    // check components to avoid missing node reference serialied in previous version
    PrivateNode.prototype._onBatchCreated = function onBatchCreated (dontSyncChildPrefab: boolean) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        for (const comp of this._components) {
            comp.node = this;
        }

        Node.prototype._onBatchCreated.call(this, dontSyncChildPrefab);
    };
}

legacyCC.PrivateNode = PrivateNode;
