/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 ****************************************************************************/

const Sprite = require('../../../../components/CCSprite');
const dynamicAtlasManager = require('../../../utils/dynamic-atlas/manager');

const SpriteType = Sprite.Type;
const FillType = Sprite.FillType;

const simpleRenderUtil = require('./simple');
const slicedRenderUtil = require('./sliced');
const tiledRenderUtil = require('./tiled');
const radialFilledRenderUtil = require('./radial-filled');
const barFilledRenderUtil = require('./bar-filled');
const meshRenderUtil = require('./mesh');

// Inline all type switch to avoid jit deoptimization during inlined function change

let spriteAssembler = {
    getAssembler (sprite) {
        let util = simpleRenderUtil;
        
        switch (sprite.type) {
            case SpriteType.SLICED:
                util = slicedRenderUtil;
                break;
            case SpriteType.TILED:
                util = tiledRenderUtil;
                break;
            case SpriteType.FILLED:
                if (sprite._fillType === FillType.RADIAL) {
                    util = radialFilledRenderUtil;
                }
                else {
                    util = barFilledRenderUtil;
                }
                break;
            case SpriteType.MESH:
                util = meshRenderUtil;
                break;
        }

        return util;
    },

    // Skip invalid sprites (without own _assembler)
    updateRenderData (sprite) {
        return sprite.__allocedDatas;
    }
};

Sprite._assembler = spriteAssembler;

module.exports = spriteAssembler;
