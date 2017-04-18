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

var math = cc.math;

math.KM_GL_MODELVIEW = 0x1700;
math.KM_GL_PROJECTION = 0x1701;
math.KM_GL_TEXTURE = 0x1702;

math.modelview_matrix_stack = new math.Matrix4Stack();
math.projection_matrix_stack = new math.Matrix4Stack();
math.texture_matrix_stack = new math.Matrix4Stack();

cc.current_stack = null;
var initialized = false;

var lazyInitialize = function () {
    if (!initialized) {
        var identity = new math.Matrix4(); //Temporary identity matrix

        //Initialize all 3 stacks
        math.modelview_matrix_stack.initialize();
        math.projection_matrix_stack.initialize();
        math.texture_matrix_stack.initialize();

        cc.current_stack = math.modelview_matrix_stack;
        initialized = true;
        identity.identity();

        //Make sure that each stack has the identity matrix
        math.modelview_matrix_stack.push(identity);
        math.projection_matrix_stack.push(identity);
        math.texture_matrix_stack.push(identity);
    }
};

lazyInitialize();

math.glFreeAll = function () {
    //Clear the matrix stacks
    math.modelview_matrix_stack.release();
    math.modelview_matrix_stack = null;
    math.projection_matrix_stack.release();
    math.projection_matrix_stack = null;
    math.texture_matrix_stack.release();
    math.texture_matrix_stack = null;

    //Delete the matrices
    initialized = false; //Set to uninitialized
    cc.current_stack = null; //Set the current stack to point nowhere
};

math.glPushMatrix = function () {
    cc.current_stack.push(cc.current_stack.top);
};

math.glPushMatrixWitMat4 = function (saveMat) {
    cc.current_stack.stack.push(cc.current_stack.top);
    saveMat.assignFrom(cc.current_stack.top);
    cc.current_stack.top = saveMat;
};

math.glPopMatrix = function () {
    //No need to lazy initialize, you shouldnt be popping first anyway!
    cc.current_stack.top = cc.current_stack.stack.pop();
};

math.glMatrixMode = function (mode) {
    //lazyInitialize();
    switch (mode) {
        case math.KM_GL_MODELVIEW:
            cc.current_stack = math.modelview_matrix_stack;
            break;
        case math.KM_GL_PROJECTION:
            cc.current_stack = math.projection_matrix_stack;
            break;
        case math.KM_GL_TEXTURE:
            cc.current_stack = math.texture_matrix_stack;
            break;
        default:
            throw new Error("Invalid matrix mode specified");   //TODO: Proper error handling
            break;
    }
};

math.glLoadIdentity = function () {
    //lazyInitialize();
    cc.current_stack.top.identity(); //Replace the top matrix with the identity matrix
    cc.current_stack.update();
};

math.glLoadMatrix = function (pIn) {
    //lazyInitialize();
    cc.current_stack.top.assignFrom(pIn);
    cc.current_stack.update();
};

math.glMultMatrix = function (pIn) {
    //lazyInitialize();
    cc.current_stack.top.multiply(pIn);
    cc.current_stack.update();
};

var tempMatrix = new math.Matrix4();    //an internal matrix
math.glTranslatef = function (x, y, z) {
    //Create a rotation matrix using translation
    var translation = math.Matrix4.createByTranslation(x, y, z, tempMatrix);

    //Multiply the rotation matrix by the current matrix
    cc.current_stack.top.multiply(translation);
    cc.current_stack.update();
};

var tempVector3 = new math.Vec3();
math.glRotatef = function (angle, x, y, z) {
    tempVector3.fill(x, y, z);
    //Create a rotation matrix using the axis and the angle
    var rotation = math.Matrix4.createByAxisAndAngle(tempVector3, cc.degreesToRadians(angle), tempMatrix);

    //Multiply the rotation matrix by the current matrix
    cc.current_stack.top.multiply(rotation);
    cc.current_stack.update();
};

math.glScalef = function (x, y, z) {
    var scaling = math.Matrix4.createByScale(x, y, z, tempMatrix);
    cc.current_stack.top.multiply(scaling);
    cc.current_stack.update();
};

math.glGetMatrix = function (mode, pOut) {
    //lazyInitialize();
    switch (mode) {
        case math.KM_GL_MODELVIEW:
            pOut.assignFrom(math.modelview_matrix_stack.top);
            break;
        case math.KM_GL_PROJECTION:
            pOut.assignFrom(math.projection_matrix_stack.top);
            break;
        case math.KM_GL_TEXTURE:
            pOut.assignFrom(math.texture_matrix_stack.top);
            break;
        default:
            throw new Error("Invalid matrix mode specified"); //TODO: Proper error handling
            break;
    }
};
