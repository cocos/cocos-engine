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
const WebglBmfontAssembler = require('../2d/bmfont');

const vec3 = cc.vmath.vec3;

const vec3_temp_local = vec3.create();
const vec3_temp_world = vec3.create();

export default class WebglBmfontAssembler3D extends WebglBmfontAssembler {

}

cc.js.mixin(WebglBmfontAssembler3D.prototype, Assembler3D, {
    updateWorldVerts (comp) {
        let matrix = comp.node._worldMatrix;
        let local = this._local;
        let world = this._renderData.vDatas[0];

        let floatsPerVert = this.floatsPerVert;
        for (let offset = 0; offset < world.length; offset += floatsPerVert) {
            vec3.set(vec3_temp_local, local[offset], local[offset+1], 0);
            vec3.transformMat4(vec3_temp_world, vec3_temp_local, matrix);

            world[offset] = vec3_temp_world.x;
            world[offset+1] = vec3_temp_world.y;
            world[offset+2] = vec3_temp_world.z;
        }
    }
});
