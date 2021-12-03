/*
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
 * @module ui-assembler
 */

import { addon } from '../../../core/utils/js';
import { IBatcher } from '../../renderer/i-batcher';
import { Label } from '../../components/label';
import { fillMeshVertices3D, updateCachedVertices } from '../utils';
import { bmfont } from './bmfont';
import { letterFont } from './letter-font';
import { Color } from '../../../core/math/color';

const WHITE = new Color(255, 255, 255, 255);

/**
 * letter 组装器
 * 可通过 `UI.letter` 获取该组装器。
 */
export const letter = {
    createData (comp: Label) {
        return comp.requestRenderData();
    },

    fillBuffers (comp: Label, renderer: IBatcher) {
        if (!comp.renderData) {
            return;
        }

        const node = comp.node;
        WHITE.a = node._uiProps.opacity * 255;
        fillMeshVertices3D(node, renderer, comp.renderData, WHITE);
    },

    fillCacheBuffer (comp: Label) {
        if (!comp.renderData) {
            return;
        }

        const node = comp.node;
        WHITE.a = node._uiProps.opacity * 255;
        updateCachedVertices(node, comp.renderData, WHITE);
    },

    appendQuad: bmfont.appendQuad,
};

addon(letter, letterFont);
