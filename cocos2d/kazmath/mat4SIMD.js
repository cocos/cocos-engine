/**
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2008, Luke Benstead.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
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
    var proto = cc.math.Matrix4.prototype;

    cc.kmMat4InverseSIMD = function (pOut, pM) {
        pOut = pM.inverseSIMD();
        return pOut;
    };

    proto.inverseSIMD = function(){
        var inv = new cc.math.Matrix4();
        var src = this.mat;
        var dest = inv.mat;
        var src0, src1, src2, src3;
        var row0, row1, row2, row3;
        var tmp1;
        var minor0, minor1, minor2, minor3;
        var det;

        // Load the 4 rows
        var src0 = SIMD.float32x4.load(src, 0);
        var src1 = SIMD.float32x4.load(src, 4);
        var src2 = SIMD.float32x4.load(src, 8);
        var src3 = SIMD.float32x4.load(src, 12);

        // Transpose the source matrix.  Sort of.  Not a true transpose operation

        tmp1 = SIMD.float32x4.shuffle(src0, src1, 0, 1, 4, 5);
        row1 = SIMD.float32x4.shuffle(src2, src3, 0, 1, 4, 5);
        row0 = SIMD.float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
        row1 = SIMD.float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);

        tmp1 = SIMD.float32x4.shuffle(src0, src1, 2, 3, 6, 7);
        row3 = SIMD.float32x4.shuffle(src2, src3, 2, 3, 6, 7);
        row2 = SIMD.float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
        row3 = SIMD.float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

        // ----
        tmp1   = SIMD.float32x4.mul(row2, row3);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
        minor0 = SIMD.float32x4.mul(row1, tmp1);
        minor1 = SIMD.float32x4.mul(row0, tmp1);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
        minor0 = SIMD.float32x4.sub(SIMD.float32x4.mul(row1, tmp1), minor0);
        minor1 = SIMD.float32x4.sub(SIMD.float32x4.mul(row0, tmp1), minor1);
        minor1 = SIMD.float32x4.swizzle(minor1, 2, 3, 0, 1); // 0x4E = 01001110

        // ----
        tmp1   = SIMD.float32x4.mul(row1, row2);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
        minor0 = SIMD.float32x4.add(SIMD.float32x4.mul(row3, tmp1), minor0);
        minor3 = SIMD.float32x4.mul(row0, tmp1);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
        minor0 = SIMD.float32x4.sub(minor0, SIMD.float32x4.mul(row3, tmp1));
        minor3 = SIMD.float32x4.sub(SIMD.float32x4.mul(row0, tmp1), minor3);
        minor3 = SIMD.float32x4.swizzle(minor3, 2, 3, 0, 1); // 0x4E = 01001110

        // ----
        tmp1   = SIMD.float32x4.mul(SIMD.float32x4.swizzle(row1, 2, 3, 0, 1), row3); // 0x4E = 01001110
        tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
        row2   = SIMD.float32x4.swizzle(row2, 2, 3, 0, 1);  // 0x4E = 01001110
        minor0 = SIMD.float32x4.add(SIMD.float32x4.mul(row2, tmp1), minor0);
        minor2 = SIMD.float32x4.mul(row0, tmp1);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
        minor0 = SIMD.float32x4.sub(minor0, SIMD.float32x4.mul(row2, tmp1));
        minor2 = SIMD.float32x4.sub(SIMD.float32x4.mul(row0, tmp1), minor2);
        minor2 = SIMD.float32x4.swizzle(minor2, 2, 3, 0, 1); // 0x4E = 01001110

        // ----
        tmp1   = SIMD.float32x4.mul(row0, row1);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
        minor2 = SIMD.float32x4.add(SIMD.float32x4.mul(row3, tmp1), minor2);
        minor3 = SIMD.float32x4.sub(SIMD.float32x4.mul(row2, tmp1), minor3);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
        minor2 = SIMD.float32x4.sub(SIMD.float32x4.mul(row3, tmp1), minor2);
        minor3 = SIMD.float32x4.sub(minor3, SIMD.float32x4.mul(row2, tmp1));

        // ----
        tmp1   = SIMD.float32x4.mul(row0, row3);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
        minor1 = SIMD.float32x4.sub(minor1, SIMD.float32x4.mul(row2, tmp1));
        minor2 = SIMD.float32x4.add(SIMD.float32x4.mul(row1, tmp1), minor2);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
        minor1 = SIMD.float32x4.add(SIMD.float32x4.mul(row2, tmp1), minor1);
        minor2 = SIMD.float32x4.sub(minor2, SIMD.float32x4.mul(row1, tmp1));

        // ----
        tmp1   = SIMD.float32x4.mul(row0, row2);
        tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
        minor1 = SIMD.float32x4.add(SIMD.float32x4.mul(row3, tmp1), minor1);
        minor3 = SIMD.float32x4.sub(minor3, SIMD.float32x4.mul(row1, tmp1));
        tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
        minor1 = SIMD.float32x4.sub(minor1, SIMD.float32x4.mul(row3, tmp1));
        minor3 = SIMD.float32x4.add(SIMD.float32x4.mul(row1, tmp1), minor3);

        // Compute determinant
        det   = SIMD.float32x4.mul(row0, minor0);
        det   = SIMD.float32x4.add(SIMD.float32x4.swizzle(det, 2, 3, 0, 1), det); // 0x4E = 01001110
        det   = SIMD.float32x4.add(SIMD.float32x4.swizzle(det, 1, 0, 3, 2), det); // 0xB1 = 10110001
        tmp1  = SIMD.float32x4.reciprocalApproximation(det);
        det   = SIMD.float32x4.sub(SIMD.float32x4.add(tmp1, tmp1), SIMD.float32x4.mul(det, SIMD.float32x4.mul(tmp1, tmp1)));
        det   = SIMD.float32x4.swizzle(det, 0, 0, 0, 0);

        // Compute final values by multiplying with 1/det
        minor0 = SIMD.float32x4.mul(det, minor0);
        minor1 = SIMD.float32x4.mul(det, minor1);
        minor2 = SIMD.float32x4.mul(det, minor2);
        minor3 = SIMD.float32x4.mul(det, minor3);

        SIMD.float32x4.store(dest, 0, minor0);
        SIMD.float32x4.store(dest, 4, minor1);
        SIMD.float32x4.store(dest, 8, minor2);
        SIMD.float32x4.store(dest, 12, minor3);

        return inv;
    };

    var identityMatrix = new cc.math.Matrix4().identity();
    proto.isIdentitySIMD = function () {
        var inx4 = SIMD.float32x4.load(this.mat, 0);
        var identityx4 = SIMD.float32x4.load(identityMatrix.mat, 0);
        var ret = SIMD.float32x4.equal(inx4, identityx4);
        if(ret.signMask === 0x00)
            return false;

        inx4 = SIMD.float32x4.load(this.mat, 4);
        identityx4 = SIMD.float32x4.load(identityMatrix.mat, 4);
        ret = SIMD.float32x4.equal(inx4, identityx4);
        if(ret.signMask === 0x00)
            return false;

        inx4 = SIMD.float32x4.load(this.mat, 8);
        identityx4 = SIMD.float32x4.load(identityMatrix.mat, 8);
        ret = SIMD.float32x4.equal(inx4, identityx4);
        if(ret.signMask === 0x00)
            return false;

        inx4 = SIMD.float32x4.load(this.mat, 12);
        identityx4 = SIMD.float32x4.load(identityMatrix.mat, 12);
        ret = SIMD.float32x4.equal(inx4, identityx4);
        if(ret.signMask === 0x00)
            return false;
        return true;
    };

    proto.transposeSIMD = function () {
        var outArr = this.mat, inArr = this.mat;
        var src0     = SIMD.float32x4.load(inArr, 0);
        var src1     = SIMD.float32x4.load(inArr, 4);
        var src2     = SIMD.float32x4.load(inArr, 8);
        var src3     = SIMD.float32x4.load(inArr, 12);
        var dst0;
        var dst1;
        var dst2;
        var dst3;
        var tmp01;
        var tmp23;

        tmp01 = SIMD.float32x4.shuffle(src0, src1, 0, 1, 4, 5);
        tmp23 = SIMD.float32x4.shuffle(src2, src3, 0, 1, 4, 5);
        dst0  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
        dst1  = SIMD.float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);

        tmp01 = SIMD.float32x4.shuffle(src0, src1, 2, 3, 6, 7);
        tmp23 = SIMD.float32x4.shuffle(src2, src3, 2, 3, 6, 7);
        dst2  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
        dst3  = SIMD.float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);

        SIMD.float32x4.store(outArr, 0, dst0);
        SIMD.float32x4.store(outArr, 4, dst1);
        SIMD.float32x4.store(outArr, 8, dst2);
        SIMD.float32x4.store(outArr, 12, dst3);
        return this;
    };

    cc.kmMat4MultiplySIMD = function (pOut, pM1, pM2) {
        pOut = new cc.math.Matrix4(pM1);
        return pOut.multiplySIMD(pM2);
    };

    proto.multiplySIMD = function(mat4) {
        var a = this.mat;
        var b = mat4.mat;
        var out = this.mat;

        var a0 = SIMD.float32x4.load(a,0);
        var a1 = SIMD.float32x4.load(a,4);
        var a2 = SIMD.float32x4.load(a,8);
        var a3 = SIMD.float32x4.load(a,12);
        var b0 = SIMD.float32x4.load(b, 0);
        SIMD.float32x4.store(out, 0, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b0, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 1, 1, 1, 1), a1),
                     SIMD.float32x4.add(
                          SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 2, 2, 2, 2), a2),
                          SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 3, 3, 3, 3), a3)))));
        var b1 = SIMD.float32x4.load(b, 4);
        SIMD.float32x4.store(out, 4, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b1, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 1, 1, 1, 1), a1),
                    SIMD.float32x4.add(
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 2, 2, 2, 2), a2),
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 3, 3, 3, 3), a3)))));
        var b2 = SIMD.float32x4.load(b, 8);
        SIMD.float32x4.store(out, 8, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b2, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 1, 1, 1, 1), a1),
                    SIMD.float32x4.add(
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 2, 2, 2, 2), a2),
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 3, 3, 3, 3), a3)))));
        var b3 = SIMD.float32x4.load(b, 12);
        SIMD.float32x4.store(out, 12, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b3, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 1, 1, 1, 1), a1),
                    SIMD.float32x4.add(
                        SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 2, 2, 2, 2), a2),
                        SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 3, 3, 3, 3), a3)))));

        return this;
    };

    cc.getMat4MultiplyValueSIMD = function (pM1, pM2) {
        var mat = new cc.math.Matrix4(pM1);
        return mat.multiplySIMD(pM2);
    };

    cc.kmMat4AssignSIMD = function (pOut, pIn) {
        if(pOut == pIn) {
            cc.log("cc.kmMat4Assign(): pOut equals pIn");//TODO: ADD SIMD?
            return pOut;
        }

        return pOut.assignFromSIMD(pIn);
    };

    proto.assignFromSIMD = function (mat4) {
        if(this == mat4) {
            cc.log("cc.mat.Matrix4.assignFrom(): mat4 equals current matrix");//TODO: ADD SIMD?
            return this;
        }

        var outArr = this.mat;
        var inArr = mat4.mat;

        SIMD.float32x4.store(outArr, 0, SIMD.float32x4.load(inArr, 0));
        SIMD.float32x4.store(outArr, 4, SIMD.float32x4.load(inArr, 4));
        SIMD.float32x4.store(outArr, 8, SIMD.float32x4.load(inArr, 8));
        SIMD.float32x4.store(outArr, 12, SIMD.float32x4.load(inArr, 12));

        return this;
    };

    proto.equalsSIMD = function (mat4) {
        if(this === mat4){
            cc.log("cc.kmMat4AreEqual(): pMat1 and pMat2 are same object.");
            return true;
        }
        var m10 = SIMD.float32x4.load(this.mat, 0);
        var m20 = SIMD.float32x4.load(mat4.mat, 0);

        var epsilon = SIMD.float32x4.splat(cc.math.EPSILON);

        var ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m10, m20)), epsilon);
        if (ret.signMask === 0)
            return false;

        var m11 = SIMD.float32x4.load(this.mat, 4);
        var m21 = SIMD.float32x4.load(mat4.mat, 4);
        ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m11, m21)), epsilon);
        if (ret.signMask === 0)
            return false;

        var m12 = SIMD.float32x4.load(this.mat, 8);
        var m22 = SIMD.float32x4.load(mat4.mat, 8);
        ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m12, m22)), epsilon);
        if (ret.signMask === 0)
            return false;

        var m13 = SIMD.float32x4.load(this.mat, 12);
        var m23 = SIMD.float32x4.load(mat4.mat, 12);
        ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m13, m23)), epsilon);
        if (ret.signMask === 0)
            return false;
        return true;
    };

    cc.kmMat4LookAtSIMD = function (pOut, pEye, pCenter, pUp) {
        return pOut.lookAtSIMD(pEye, pCenter, pUp);
    };

    proto.lookAtSIMD = function(eyeVec, centerVec, upVec) {
        var out = this.mat;

        var center = SIMD.float32x4(centerVec.x, centerVec.y, centerVec.z, 0.0);
        var eye = SIMD.float32x4(eyeVec.x, eyeVec.y, eyeVec.z, 0.0);
        var up = SIMD.float32x4(upVec.x, upVec.y, upVec.z, 0.0);

        // cc.kmVec3Subtract(f, pCenter, pEye);
        var f = SIMD.float32x4.sub(center, eye);
        // cc.kmVec3Normalize(f, f);
        var tmp = SIMD.float32x4.mul(f, f);
        tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
        f = SIMD.float32x4.mul(f, SIMD.float32x4.reciprocalSqrtApproximation(tmp));

        // cc.kmVec3Assign(up, pUp);
        // cc.kmVec3Normalize(up, up);
        tmp = SIMD.float32x4.mul(up, up);
        tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
        up = SIMD.float32x4.mul(up, SIMD.float32x4.reciprocalSqrtApproximation(tmp));

        // cc.kmVec3Cross(s, f, up);
        var s = SIMD.float32x4.sub(SIMD.float32x4.mul(SIMD.float32x4.swizzle(f, 1, 2, 0, 3), SIMD.float32x4.swizzle(up, 2, 0, 1, 3)),
                                   SIMD.float32x4.mul(SIMD.float32x4.swizzle(f, 2, 0, 1, 3), SIMD.float32x4.swizzle(up, 1, 2, 0, 3)));
        // cc.kmVec3Normalize(s, s);
        tmp = SIMD.float32x4.mul(s, s);
        tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
        s = SIMD.float32x4.mul(s, SIMD.float32x4.reciprocalSqrtApproximation(tmp));

        // cc.kmVec3Cross(u, s, f);
        var u = SIMD.float32x4.sub(SIMD.float32x4.mul(SIMD.float32x4.swizzle(s, 1, 2, 0, 3), SIMD.float32x4.swizzle(f, 2, 0, 1, 3)),
                                   SIMD.float32x4.mul(SIMD.float32x4.swizzle(s, 2, 0, 1, 3), SIMD.float32x4.swizzle(f, 1, 2, 0, 3)));
        // cc.kmVec3Normalize(s, s);
        tmp = SIMD.float32x4.mul(s, s);
        tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
        s = SIMD.float32x4.mul(s, SIMD.float32x4.reciprocalSqrtApproximation(tmp));

        //cc.kmMat4Identity(pOut);
        //pOut.mat[0] = s.x;
        //pOut.mat[4] = s.y;
        //pOut.mat[8] = s.z;
        //pOut.mat[1] = u.x;
        //pOut.mat[5] = u.y;
        //pOut.mat[9] = u.z;
        //pOut.mat[2] = -f.x;
        //pOut.mat[6] = -f.y;
        //pOut.mat[10] = -f.z;
        var zero = SIMD.float32x4.splat(0.0);
        f = SIMD.float32x4.neg(f);
        var tmp01 = SIMD.float32x4.shuffle(s, u, 0, 1, 4, 5);
        var tmp23 = SIMD.float32x4.shuffle(f, zero, 0, 1, 4, 5);
        var a0  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
        var a1  = SIMD.float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);

        var tmp01 = SIMD.float32x4.shuffle(s, u, 2, 3, 6, 7);
        var tmp23 = SIMD.float32x4.shuffle(f, zero, 2, 3, 6, 7);
        var a2  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
        var a3  = SIMD.float32x4(0.0, 0.0, 0.0, 1.0);

        // cc.kmMat4Translation(translate, -pEye.x, -pEye.y, -pEye.z);
        var b0 = SIMD.float32x4(1.0, 0.0, 0.0, 0.0);
        var b1 = SIMD.float32x4(0.0, 1.0, 0.0, 0.0);
        var b2 = SIMD.float32x4(0.0, 0.0, 1.0, 0.0);
        var b3 = SIMD.float32x4.neg(eye);
        b3 = SIMD.float32x4.withW(b3, 1.0);

        // cc.kmMat4Multiply(pOut, pOut, translate);
        SIMD.float32x4.store(out, 0, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b0, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 1, 1, 1, 1), a1),
                     SIMD.float32x4.add(
                          SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 2, 2, 2, 2), a2),
                          SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 3, 3, 3, 3), a3)))));
        SIMD.float32x4.store(out, 4, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b1, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 1, 1, 1, 1), a1),
                    SIMD.float32x4.add(
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 2, 2, 2, 2), a2),
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 3, 3, 3, 3), a3)))));
        SIMD.float32x4.store(out, 8, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b2, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 1, 1, 1, 1), a1),
                    SIMD.float32x4.add(
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 2, 2, 2, 2), a2),
                         SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 3, 3, 3, 3), a3)))));
        SIMD.float32x4.store(out, 12, SIMD.float32x4.add(
            SIMD.float32x4.mul(
                SIMD.float32x4.swizzle(b3, 0, 0, 0, 0), a0),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 1, 1, 1, 1), a1),
                    SIMD.float32x4.add(
                        SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 2, 2, 2, 2), a2),
                        SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 3, 3, 3, 3), a3)))));
        return this;
    };


})(cc);
