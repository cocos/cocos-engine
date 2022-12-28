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
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { markAsWarning, removeProperty, replaceProperty, js, Color, cclegacy } from '../../core';
import { UIComponent } from './ui-component';
import { UITransform } from './ui-transform';
import { UIRenderer } from './ui-renderer';
import { Canvas } from './canvas';

removeProperty(UIComponent.prototype, 'UIComponent', [
    {
        name: '_visibility',
    },
    {
        name: 'setVisibility',
    },
]);

removeProperty(UIRenderer.prototype, 'Renderable2D.prototype', [
    {
        name: 'srcBlendFactor',
    },
    {
        name: 'dstBlendFactor',
    },
]);

replaceProperty(Canvas.prototype, 'Canvas.prototype', [
    {
        name: 'camera',
        newName: 'cameraComponent.camera',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent.camera;
        },
    },
    {
        name: 'clearFlag',
        newName: 'cameraComponent.clearFlags',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.clearFlags : 0;
        },
        customSetter (val) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.clearFlags = val;
        },
    },
    {
        name: 'color',
        newName: 'cameraComponent.clearColor',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.clearColor : Color.BLACK;
        },
        customSetter (val) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.clearColor = val;
        },
    },
    {
        name: 'priority',
        newName: 'cameraComponent.priority',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.priority : 0;
        },
        customSetter (val: number) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.priority = val;
        },
    },
    {
        name: 'targetTexture',
        newName: 'cameraComponent.targetTexture',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.targetTexture : null;
        },
        customSetter (value) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.targetTexture = value;
        },
    },
    {
        name: 'visibility',
        newName: 'cameraComponent.visibility',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.visibility : 0;
        },
    },
]);

markAsWarning(UITransform.prototype, 'UITransform.prototype', [
    {
        name: 'priority',
        suggest: `Please use setSiblingIndex to change index of the current node in its parent's children array.`,
    },
]);

/**
 * Alias of [[UITransform]]
 * @deprecated Since v1.2
 */
export { UITransform as UITransformComponent };
cclegacy.UITransformComponent = UITransform;
js.setClassAlias(UITransform, 'cc.UITransformComponent');

/**
 * Alias of [[Renderable2D]]
 * @deprecated Since v1.2
 */
export { UIRenderer as RenderComponent };
/**
 * Alias of [[Renderable2D]]
 * @deprecated Since v3.0
 */
export { UIRenderer as UIRenderable };
js.setClassAlias(UIRenderer, 'cc.RenderComponent');

/**
 * Alias of [[Canvas]]
 * @deprecated Since v1.2
 */
export { Canvas as CanvasComponent };
cclegacy.CanvasComponent = Canvas;
js.setClassAlias(Canvas, 'cc.CanvasComponent');

/**
 * Alias of [[Renderable2D]]
 * @deprecated Since v3.6
 */
export { UIRenderer as Renderable2D };
cclegacy.internal.Renderable2D = UIRenderer;
js.setClassAlias(UIRenderer, 'cc.Renderable2D');
