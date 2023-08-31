/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Mask, MaskType } from './mask';
import { Label } from './label';
import { LabelOutline } from './label-outline';
import { RichText } from './rich-text';
import { Sprite } from './sprite';
import { UIMeshRenderer } from './ui-mesh-renderer';
import { Graphics } from './graphics';
import { UIOpacity } from './ui-opacity';
import { js, cclegacy, replaceProperty, removeProperty, warn } from '../../core';
import { ccclass } from '../../core/data/class-decorator';

/**
 * @deprecated Since v3.4.1, We have adopted a new rendering batching policy in v3.4.1,
 * which will result in an effective performance improvement for normal dynamic batching components,
 * so manual management with the UIStaticBatch component is no longer recommended and will be removed in the future
 */
@ccclass('cc.UIStaticBatch')
export class UIStaticBatch {
    constructor() {
        warn('UIStaticBatch is deprecated, please use UIRenderer instead.');
    }

    get color (): any {
        return null;
    }
    set color (value) {
    }
    get drawBatchList (): any {
        return null;
    }

    public postUpdateAssembler (render): void {
    }
    public markAsDirty (): void {
    }
    public _requireDrawBatch (): any {
    }
}

/**
 * Alias of [[Mask]]
 * @deprecated Since v1.2
 */
export { Mask as MaskComponent };
cclegacy.MaskComponent = Mask;
js.setClassAlias(Mask, 'cc.MaskComponent');
/**
 * Alias of [[Label]]
 * @deprecated Since v1.2
 */
export { Label as LabelComponent };
cclegacy.LabelComponent = Label;
js.setClassAlias(Label, 'cc.LabelComponent');
/**
 * Alias of [[LabelOutline]]
 * @deprecated Since v1.2
 */
export { LabelOutline as LabelOutlineComponent };
cclegacy.LabelOutlineComponent = LabelOutline;
js.setClassAlias(LabelOutline, 'cc.LabelOutlineComponent');

/**
 * Alias of [[RichText]]
 * @deprecated Since v1.2
 */
export { RichText as RichTextComponent };
cclegacy.RichTextComponent = RichText;
js.setClassAlias(RichText, 'cc.RichTextComponent');
/**
 * Alias of [[Sprite]]
 * @deprecated Since v1.2
 */
export { Sprite as SpriteComponent };
cclegacy.SpriteComponent = Sprite;
js.setClassAlias(Sprite, 'cc.SpriteComponent');
/**
 * Alias of [[UIMeshRenderer]]
 * @deprecated Since v1.2
 */
export { UIMeshRenderer as UIModelComponent };
cclegacy.UIModelComponent = UIMeshRenderer;
js.setClassAlias(UIMeshRenderer, 'cc.UIModelComponent');
/**
 * Alias of [[Graphics]]
 * @deprecated Since v1.2
 */
export { Graphics as GraphicsComponent };
cclegacy.GraphicsComponent = Graphics;
js.setClassAlias(Graphics, 'cc.GraphicsComponent');
/**
 * Alias of [[UIStaticBatch]]
 * @deprecated Since v1.2
 */
export { UIStaticBatch as UIStaticBatchComponent };
js.setClassAlias(UIStaticBatch, 'cc.UIStaticBatchComponent');
/**
 * Alias of [[UIOpacity]]
 * @deprecated Since v1.2
 */
export { UIOpacity as UIOpacityComponent };
js.setClassAlias(UIOpacity, 'cc.UIOpacityComponent');

replaceProperty(Mask.prototype, 'Mask', [
    {
        name: 'graphics',
        newName: 'subComp',
        target: Mask.prototype,
        targetName: 'Mask',
    },
]);

replaceProperty(MaskType, 'MaskType', [
    {
        name: 'RECT',
        newName: 'GRAPHICS_RECT',
        target: MaskType,
        targetName: 'MaskType',
    },
    {
        name: 'ELLIPSE',
        newName: 'GRAPHICS_ELLIPSE',
        target: MaskType,
        targetName: 'MaskType',
    },
    {
        name: 'IMAGE_STENCIL',
        newName: 'SPRITE_STENCIL',
        target: MaskType,
        targetName: 'MaskType',
    },
]);

removeProperty(UIStaticBatch.prototype, 'UIStaticBatch.prototype', [
    {
        name: 'color',
        suggest: 'UIStaticBatch is deprecated, please use UIRenderer instead.',
    },
    {
        name: 'drawBatchList',
        suggest: 'UIStaticBatch is deprecated, please use UIRenderer instead.',
    },
    {
        name: 'postUpdateAssembler',
        suggest: 'UIStaticBatch is deprecated, please use UIRenderer instead.',
    },
    {
        name: 'markAsDirty',
        suggest: 'UIStaticBatch is deprecated, please use UIRenderer instead.',
    },
    {
        name: '_requireDrawBatch',
        suggest: 'UIStaticBatch is deprecated, please use UIRenderer instead.',
    },
]);
