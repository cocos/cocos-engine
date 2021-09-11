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
import { SceneGlobals } from './scene-globals';
import { SystemEventType } from '../../input/types';
import { SystemEvent } from '../../input';

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

removeProperty(SceneGlobals.prototype, 'SceneGlobals.prototype', [
    {
        name: 'aspect',
    },
    {
        name: 'selfShadow',
    },
    {
        name: 'linear',
    },
    {
        name: 'packing',
    },
    {
        name: 'autoAdapt',
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

@ccclass('cc.PrivateNode')
export class PrivateNode extends Node {
    constructor (name?: string) {
        super(name);
        warnID(12003, this.name);

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

replaceProperty(SystemEventType, 'SystemEventType', [
    'MOUSE_ENTER',
    'MOUSE_LEAVE',
    'TRANSFORM_CHANGED',
    'SCENE_CHANGED_FOR_PERSISTS',
    'SIZE_CHANGED',
    'ANCHOR_CHANGED',
    'COLOR_CHANGED',
    'CHILD_ADDED',
    'CHILD_REMOVED',
    'PARENT_CHANGED',
    'NODE_DESTROYED',
    'LAYER_CHANGED',
    'SIBLING_ORDER_CHANGED',
].map((name: string) => ({
    name,
    target: Node.EventType,
    targetName: 'Node.EventType',
})));

replaceProperty(Node.EventType, 'Node.EventType', [
    {
        name: 'DEVICEMOTION',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
    {
        name: 'KEY_DOWN',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
    {
        name: 'KEY_UP',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);

replaceProperty(SceneGlobals, 'SceneGlobals', [
    {
        name: 'autoAdapt',
        targetName: 'fixedArea',
        customGetter (this: SceneGlobals) {
            return !this.shadows.fixedArea;
        },
        customSetter (this: SceneGlobals, value: boolean) {
            this.shadows.fixedArea = !value;
        },
    },
]);
legacyCC.PrivateNode = PrivateNode;
