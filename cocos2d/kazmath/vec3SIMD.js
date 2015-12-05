/**
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2008, Luke Benstead.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

 (function(cc) {
    var proto = cc.math.Vec3.prototype;

    proto.transformCoordSIMD = function(mat4){
        var vec = SIMD.float32x4(this.x, this.y, this.z, 0.0);
        var mat0 = SIMD.float32x4.load(mat4.mat, 0);
        var mat1 = SIMD.float32x4.load(mat4.mat, 4);
        var mat2 = SIMD.float32x4.load(mat4.mat, 8);
        var mat3 = SIMD.float32x4.load(mat4.mat, 12);

        //cc.kmVec4Transform(v, inV,pM);
        var out = SIMD.float32x4.add(
            SIMD.float32x4.add(SIMD.float32x4.mul(mat0, SIMD.float32x4.swizzle(vec, 0, 0, 0, 0)),
                               SIMD.float32x4.mul(mat1, SIMD.float32x4.swizzle(vec, 1, 1, 1, 1))),
            SIMD.float32x4.add(SIMD.float32x4.mul(mat2, SIMD.float32x4.swizzle(vec, 2, 2, 2, 2)),
                               mat3));

        out = SIMD.float32x4.div(out, SIMD.float32x4.swizzle(out, 3, 3, 3, 3));
        this.fill(out);

        return this;
    };
})(cc);
