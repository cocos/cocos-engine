/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
import Impl from './impl';
import Graphics from '../../../../graphics/graphics';

export default class CanvasGraphicsAssembler {
    init () {}

    draw (ctx, comp) {
        let node = comp.node;
        // Transform
        let matrix = node._worldMatrix;
        let matrixm = matrix.m;
        let a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];
        ctx.transform(a, b, c, d, tx, ty);
        ctx.save();

        // TODO: handle blend function

        // opacity
        ctx.globalAlpha = node.opacity / 255;

        let style = comp._impl.style;
        ctx.strokeStyle = style.strokeStyle;
        ctx.fillStyle = style.fillStyle;
        ctx.lineWidth = style.lineWidth;
        ctx.lineJoin = style.lineJoin;
        ctx.miterLimit = style.miterLimit;

        let endPath = true;
        let cmds = comp._impl.cmds;
        for (let i = 0, l = cmds.length; i < l; i++) {
            let cmd = cmds[i];
            let ctxCmd = cmd[0], args = cmd[1];

            if (ctxCmd === 'moveTo' && endPath) {
                ctx.beginPath();
                endPath = false;
            }
            else if (ctxCmd === 'fill' || ctxCmd === 'stroke' || ctxCmd === 'fillRect') {
                endPath = true;
            }

            if (typeof ctx[ctxCmd] === 'function') {
                ctx[ctxCmd].apply(ctx, args);
            }
            else {
                ctx[ctxCmd] = args;
            }
        }

        ctx.restore();

        return 1;
    }

    stroke (comp) {
        comp._impl.stroke();
    }

    fill (comp) {
        comp._impl.fill();
    }

    clear () {}
}

Assembler.register(Graphics, CanvasGraphicsAssembler);
