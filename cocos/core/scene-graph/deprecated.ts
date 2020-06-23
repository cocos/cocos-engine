/**
 * @hidden
 */

import { BaseNode } from './base-node';
import { replaceProperty, removeProperty } from '../utils/deprecated';
import { Layers } from './layers';
import { Node } from './node';
import { Vec2 } from '../math/vec2';
import { Size } from '../math/size';
import { Scene } from './scene';

replaceProperty(BaseNode.prototype, 'BaseNode', [
    {
        'name': 'childrenCount',
        'newName': 'children.length',
        'customGetter': function (this: BaseNode) {
            return this.children.length;
        }
    }
]);

replaceProperty(Node.prototype, 'Node', [
    {
        'name': 'width',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customGetter': function (this: Node) {
            return this._uiProps.uiTransformComp!.width;
        },
        'customSetter': function (this: Node, value: number) {
            this._uiProps.uiTransformComp!.width = value;
        }
    },
    {
        'name': 'height',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customGetter': function (this: Node) {
            return this._uiProps.uiTransformComp!.height;
        },
        'customSetter': function (this: Node, value: number) {
            this._uiProps.uiTransformComp!.height = value;
        }
    },
    {
        'name': 'anchorX',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customGetter': function (this: Node) {
            return this._uiProps.uiTransformComp!.anchorX;
        },
        'customSetter': function (this: Node, value: number) {
            this._uiProps.uiTransformComp!.anchorX = value;
        }
    },
    {
        'name': 'anchorY',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customGetter': function (this: Node) {
            return this._uiProps.uiTransformComp!.anchorY;
        },
        'customSetter': function (this: Node, value: number) {
            this._uiProps.uiTransformComp!.anchorY = value;
        }
    },
    {
        'name': 'getAnchorPoint',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customFunction': function (this: Node, out?: Vec2) {
            if (!out) {
                out = new Vec2();
            }
            out.set(this._uiProps.uiTransformComp!.anchorPoint);
            return out;
        }
    },
    {
        'name': 'setAnchorPoint',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customFunction': function (this: Node, point: Vec2 | number, y?: number) {
            this._uiProps.uiTransformComp!.setAnchorPoint(point, y);
        }
    },
    {
        'name': 'getContentSize',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customFunction': function (this: Node, out?: Size): Size {
            if (!out) {
                out = new Size();
            }
    
            out.set(this._uiProps.uiTransformComp!.contentSize);
            return out;
        }
    },
    {
        'name': 'setContentSize',
        'targetName': 'node.getComponent(UITransformComponent)',
        'customFunction': function (this: Node, size: Size | number, height?: number) {
            this._uiProps.uiTransformComp!.setContentSize(size, height);
        }
    },
]);

removeProperty(Node.prototype, 'Node.prototype', [
    {
        'name': 'addLayer',
    },
    {
        'name': 'removeLayer',
    }
]);

removeProperty(Layers, 'Layers', [
    {
        'name': 'All',
    },
    {
        'name': 'RaycastMask',
    },
    {
        'name': 'check',
    }
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

removeProperty(Layers.Enum,'Layers.Enum',[
    {
        'name': 'ALWAYS',
    }
]);

removeProperty(Layers.BitMask,'Layers.BitMask',[
    {
        'name': 'ALWAYS',
    }
]);
