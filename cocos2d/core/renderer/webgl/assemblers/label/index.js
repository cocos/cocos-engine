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

import Assembler from '../../../assembler';
import Label from '../../../../components/CCLabel';

import TTF from './2d/ttf';
import Bmfont from './2d/bmfont';
import Letter from './2d/letter';

import TTF3D from './3d/ttf';
import Bmfont3D from './3d/bmfont';
import Letter3D from './3d/letter';

Label._canvasPool = {
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

Assembler.register(cc.Label, {
    getConstructor(label) {
        let is3DNode = label.node.is3DNode;
        let ctor = is3DNode ? TTF3D : TTF;
        
        if (label.font instanceof cc.BitmapFont) {
            ctor = is3DNode ? Bmfont3D : Bmfont;
        } else if (label.cacheMode === Label.CacheMode.CHAR) {
            if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
                cc.warn('sorry, subdomain does not support CHAR mode currently!');
            } else {
                ctor = is3DNode ? Letter3D : Letter;
            }  
        }

        return ctor;
    },

    TTF,
    Bmfont,
    Letter,

    TTF3D,
    Bmfont3D,
    Letter3D
});
