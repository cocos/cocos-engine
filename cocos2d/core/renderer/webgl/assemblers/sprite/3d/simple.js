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

const spriteAssembler = require('../sprite');
const js = require('../../../../../platform/js');
const assembler2D = require('../2d/simple');
const base = require('./base');

const vec3 = cc.vmath.vec3;

let vec3_temps = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(vec3.create());
}

module.exports = spriteAssembler.simple3D = js.addon({
    updateWorldVerts (sprite) {
        let matrix = sprite.node._worldMatrix;
        let local = sprite._renderHandle._local;
        
        vec3.set(vec3_temps[0], local[0], local[1], 0);
        vec3.set(vec3_temps[1], local[2], local[1], 0);
        vec3.set(vec3_temps[2], local[0], local[3], 0);
        vec3.set(vec3_temps[3], local[2], local[3], 0);

        let floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < 4; i++) {
            let vertex = vec3_temps[i];
            vec3.transformMat4(vertex, vertex, matrix);

            let dstOffset = floatsPerVert * i + uvOffset;
            verts[dstOffset] = vertex.x;
            verts[dstOffset+1] = vertex.y;
            verts[dstOffset+2] = vertex.z;
        }
    },
}, base, assembler2D);
