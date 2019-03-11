/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

const Label = require('../../../../components/CCLabel');

const ttfAssembler = require('./2d/ttf');
const bmfontAssembler = require('./2d/bmfont');
const letterAssembler = require('./2d/letter');

const ttfAssembler3D = require('./3d/ttf');
const bmfontAssembler3D = require('./3d/bmfont');
const letterAssembler3D = require('./3d/letter');

let canvasPool = {
    pool: [],
    get () {
        let data = this.pool.pop();

        if (!data) {
            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            data = {
                canvas: canvas,
                context: context
            }
        }

        return data;
    },
    put (canvas) {
        if (this.pool.length >= 32) {
            return;
        }
        this.pool.push(canvas);
    }
};

var labelAssembler = {
    getAssembler (comp) {
        let is3DNode = comp.node.is3DNode;
        let assembler = is3DNode ? ttfAssembler3D : ttfAssembler;
        
        if (comp.font instanceof cc.BitmapFont) {
            assembler = is3DNode ? bmfontAssembler3D : bmfontAssembler;
        } else if (comp.cacheMode === Label.CacheMode.CHAR) {
            if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
                cc.warn('sorry, subdomain does not support CHAR mode currently!');
            } else {
                assembler = is3DNode ? letterAssembler3D : letterAssembler;
            }  
        }

        return assembler;
    },

    // Skip invalid labels (without own _assembler)
    updateRenderData (label) {
        return label.__allocedDatas;
    }
};

Label._assembler = labelAssembler;
Label._canvasPool = canvasPool;
module.exports = labelAssembler;