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
 * @module model
 */

import {
    ccclass, serializable,
} from 'cc.decorator';
import { Material } from '../assets/material';
import { scene } from '../renderer';
import { Layers } from '../scene-graph/layers';
import { legacyCC } from '../global-exports';
import { BaseRenderer } from './base-renderer';

@ccclass('cc.Renderer')
export class Renderer extends BaseRenderer {
    @serializable
    protected _visFlags = Layers.Enum.NONE;

    get visibility () {
        return this._visFlags;
    }

    set visibility (val) {
        this._visFlags = val;
        this._onVisibilityChange(val);
    }

    protected _models: scene.Model[] = [];

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _collectModels (): scene.Model[] {
        return this._models;
    }

    protected _attachToScene () {
    }

    protected _detachFromScene () {
    }

    protected _onVisibilityChange (val) {
    }
}

legacyCC.Renderer = Renderer;
