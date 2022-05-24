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

import { Mask } from './mask';
import { Label } from './label';
import { LabelOutline } from './label-outline';
import { RichText } from './rich-text';
import { Sprite } from './sprite';
import { UIMeshRenderer } from './ui-mesh-renderer';
import { Graphics } from './graphics';
import { UIStaticBatch } from './ui-static-batch';
import { UIOpacity } from './ui-opacity';
import { js } from '../../core/utils/js';
import { legacyCC } from '../../core/global-exports';

/**
 * Alias of [[Mask]]
 * @deprecated Since v1.2
 */
export { Mask as MaskComponent };
legacyCC.MaskComponent = Mask;
js.setClassAlias(Mask, 'cc.MaskComponent');
/**
 * Alias of [[Label]]
 * @deprecated Since v1.2
 */
export { Label as LabelComponent };
legacyCC.LabelComponent = Label;
js.setClassAlias(Label, 'cc.LabelComponent');
/**
 * Alias of [[LabelOutline]]
 * @deprecated Since v1.2
 */
export { LabelOutline as LabelOutlineComponent };
legacyCC.LabelOutlineComponent = LabelOutline;
js.setClassAlias(LabelOutline, 'cc.LabelOutlineComponent');

/**
 * Alias of [[RichText]]
 * @deprecated Since v1.2
 */
export { RichText as RichTextComponent };
legacyCC.RichTextComponent = RichText;
js.setClassAlias(RichText, 'cc.RichTextComponent');
/**
 * Alias of [[Sprite]]
 * @deprecated Since v1.2
 */
export { Sprite as SpriteComponent };
legacyCC.SpriteComponent = Sprite;
js.setClassAlias(Sprite, 'cc.SpriteComponent');
/**
 * Alias of [[UIMeshRenderer]]
 * @deprecated Since v1.2
 */
export { UIMeshRenderer as UIModelComponent };
legacyCC.UIModelComponent = UIMeshRenderer;
js.setClassAlias(UIMeshRenderer, 'cc.UIModelComponent');
/**
 * Alias of [[Graphics]]
 * @deprecated Since v1.2
 */
export { Graphics as GraphicsComponent };
legacyCC.GraphicsComponent = Graphics;
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
