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
	var _useSIMD = false;

	var mat4Proto = cc.math.Matrix4.prototype;
	var mat4Inverse = mat4Proto.inverse;
    var mat4IsIdentity = mat4Proto.isIdentity;
    var mat4Transpose = mat4Proto.transpose;
    var mat4Multiply = mat4Proto.multiply;
    var mat4GetMat4MultiplyValue = mat4Proto.getMat4MultiplyValue;
    var mat4AssignFrom = mat4Proto.assignFrom;
    var mat4Equals = mat4Proto.equals;
    var mat4LookAt = mat4Proto.lookAt;

    var vec3Proto = cc.math.Vec3.prototype;
    var vec3TransformCoord = vec3Proto.transformCoord;

	function _isEnabledSIMD () {
	    return _useSIMD;
	}

	function _enableSIMD (enable) {
		if(typeof(SIMD) === 'undefined')
			return;

		if (enable) {
			mat4Proto.inverse = mat4Proto.inverseSIMD;
			mat4Proto.isIdentity = mat4Proto.isIdentitySIMD;
			mat4Proto.transpose = mat4Proto.transposeSIMD;
			mat4Proto.multiply = mat4Proto.multiplySIMD;
			mat4Proto.getMat4MultiplyValue = mat4Proto.getMat4MultiplyValueSIMD;
			mat4Proto.assignFrom = mat4Proto.assignFromSIMD;
			mat4Proto.equals = mat4Proto.equalsSIMD;
			mat4Proto.lookAt = mat4Proto.lookAtSIMD;
			vec3Proto.transformCoord = vec3Proto.transformCoordSIMD;
		} else {
			mat4Proto.inverse = mat4Inverse;
			mat4Proto.isIdentity = mat4IsIdentity;
			mat4Proto.transpose = mat4Transpose;
			mat4Proto.multiply = mat4Multiply;
			mat4Proto.getMat4MultiplyValue = mat4GetMat4MultiplyValue;
			mat4Proto.assignFrom = mat4AssignFrom;
			mat4Proto.equals = mat4Equals;
			mat4Proto.lookAt = mat4LookAt;
			vec3Proto.transformCoord = vec3TransformCoord;
		}
		_useSIMD = enable;
	}

    cc.defineGetterSetter(cc.sys, "useSIMD", _isEnabledSIMD, _enableSIMD);
})(cc);