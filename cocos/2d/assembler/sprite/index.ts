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

import { UIRenderer } from '../../framework/ui-renderer';
import { IAssemblerManager } from '../../renderer/base';
import { Sprite } from '../../components';
import { barFilled } from './bar-filled';
import { radialFilled } from './radial-filled';
import { simple } from './simple';
import { sliced } from './sliced';
import { tiled } from './tiled';

const SpriteType = Sprite.Type;
const FillType = Sprite.FillType;

// Inline all type switch to avoid jit deoptimization during inlined function change

const spriteAssembler: IAssemblerManager = {
    getAssembler (spriteComp: UIRenderer) {
        let util = simple;

        const comp = spriteComp as Sprite;
        switch (comp.type) {
        case SpriteType.SLICED:
            util = sliced;
            break;
        case SpriteType.TILED:
            util = tiled;
            break;
        case SpriteType.FILLED:
            if (comp.fillType === FillType.RADIAL) {
                util = radialFilled;
            } else {
                util = barFilled;
            }
            break;
            // case SpriteType.MESH:
            //     util = meshRenderUtil;
            //     break;
        default:
            break;
        }

        return util;
    },

    // Skip invalid sprites (without own _assembler)
    // updateRenderData (sprite) {
    //     return sprite.__allocedDatas;
    // },
};

Sprite.Assembler = spriteAssembler;

export {
    spriteAssembler,
    simple,
    sliced,
    barFilled,
    radialFilled,
};
