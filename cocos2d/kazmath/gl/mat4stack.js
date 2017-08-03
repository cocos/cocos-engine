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

/**
 * The stack of cc.math.Matrix4
 * @param {cc.math.Matrix4} [top]
 * @param {Array} [stack]
 *
 */
cc.math.Matrix4Stack = function(top, stack) {
    this.top = top;
    this.stack = stack || [];
    this.lastUpdated = 0;
    //this._matrixPool = [];            // use pool in next version
};
var proto = cc.math.Matrix4Stack.prototype;

proto.initialize = function() {    //cc.km_mat4_stack_initialize
    this.stack.length = 0;
    this.top = null;
};

proto.push = function(item) {
    item = item || this.top;
    this.stack.push(this.top);
    this.top = new cc.math.Matrix4(item);
    //this.top = this._getFromPool(item);
    this.update();
};

proto.pop = function() {
    //this._putInPool(this.top);
    this.top = this.stack.pop();
    this.update();
};

proto.update = function () {
    this.lastUpdated ++;
};

proto.release = function(){
    this.stack = null;
    this.top = null;
    this._matrixPool = null;
};

proto._getFromPool = function (item) {
    var pool = this._matrixPool;
    if (pool.length === 0)
        return new cc.math.Matrix4(item);
    var ret = pool.pop();
    ret.assignFrom(item);
    return ret;
};

proto._putInPool = function(matrix){
    this._matrixPool.push(matrix);
};
