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

const js = require('../../../../../platform/js');
const assembler = require('../2d/tiled');
const vec3 = cc.vmath.vec3;

module.exports = js.addon({
    vertexOffset: 6,
    uvOffset: 3,
    colorOffset: 5,

    fillVertices: (function () {
        let vec3_temps = [];
        for (let i = 0; i < 4; i++) {
            vec3_temps.push(vec3.create());
        }
        return function (vbuf, vertexOffset, matrix, row, col, data) {
            let x, x1, y, y1;
            for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
                y = data[yindex].y;
                y1 = data[yindex+1].y;
                for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                    x = data[xindex].x;
                    x1 = data[xindex+1].x;
    
                    vec3.set(vec3_temps[0], x, y, 0);
                    vec3.set(vec3_temps[1], x1, y, 0);
                    vec3.set(vec3_temps[2], x, y1, 0);
                    vec3.set(vec3_temps[3], x1, y1, 0);
    
                    for (let i = 0; i < 4; i ++) {
                        let vec3_temp = vec3_temps[i];
                        vec3.transformMat4(vec3_temp, vec3_temp, matrix);
                        let offset = i * 6;
                        vbuf[vertexOffset + offset] = vec3_temp.x;
                        vbuf[vertexOffset + offset + 1] = vec3_temp.y;
                        vbuf[vertexOffset + offset + 2] = vec3_temp.z;
                    }
    
                    vertexOffset += 24;
                }
            }
        };
    })(),
}, assembler);
