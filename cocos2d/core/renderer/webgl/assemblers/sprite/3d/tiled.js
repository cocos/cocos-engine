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

const Assembler3D = require('../../../../assembler-3d');
const TiledAssembler = require('../2d/tiled');
const vec3 = cc.vmath.vec3;

let vec3_temps = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(vec3.create());
}

export default class TiledAssembler3D extends TiledAssembler {
    
}

cc.js.mixin(TiledAssembler3D.prototype, Assembler3D, {
    updateWorldVerts (sprite) {
        let local = this._local;
        let localX = local.x, localY = local.y;
        let world = this._renderData.vDatas[0];
        let { row, col } = this;
        let matrix = sprite.node._worldMatrix;
        let x, x1, y, y1;
        let vertexOffset = 0;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = localY[yindex];
            y1 = localY[yindex + 1];
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                x = localX[xindex];
                x1 = localX[xindex + 1];

                vec3.set(vec3_temps[0], x, y, 0);
                vec3.set(vec3_temps[1], x1, y, 0);
                vec3.set(vec3_temps[2], x, y1, 0);
                vec3.set(vec3_temps[3], x1, y1, 0);

                for (let i = 0; i < 4; i++) {
                    let vec3_temp = vec3_temps[i];
                    vec3.transformMat4(vec3_temp, vec3_temp, matrix);
                    let offset = i * 6;
                    world[vertexOffset + offset] = vec3_temp.x;
                    world[vertexOffset + offset + 1] = vec3_temp.y;
                    world[vertexOffset + offset + 2] = vec3_temp.z;
                }

                vertexOffset += 24;
            }
        }
    }
});
