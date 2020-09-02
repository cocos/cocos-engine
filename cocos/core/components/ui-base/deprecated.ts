/**
 * @hidden
 */

import { removeProperty } from '../../utils';
import { UIComponent } from './ui-component';
import { UITransform } from './ui-transform';
import { UIRenderable } from './ui-renderable';
import { Canvas } from './canvas';
import { ccclass } from '../../data/class-decorator';
import { warnID } from '../../platform/debug';

removeProperty(UIComponent.prototype, 'UIComponent',[
    {
        name: '_visibility',
    },
    {
        name: 'setVisibility',
    },
]);

@ccclass('cc.UITransformComponent')
export class UITransformComponent extends UITransform {
    constructor () {
        warnID(5400, 'UITransformComponent', 'UITransform');
        super();
    }
}

@ccclass('cc.RenderComponent')
export class RenderComponent extends UIRenderable {
    constructor () {
        warnID(5400, 'RenderComponent', 'UIRenderable');
        super();
    }
}

@ccclass('cc.CanvasComponent')
export class CanvasComponent extends Canvas {
    constructor () {
        warnID(5400, 'CanvasComponent', 'Canvas');
        super();
    }
}
