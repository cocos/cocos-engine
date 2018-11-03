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

function getWorldRotation (node) {
    var rot = node.angle;
    var parent = node.parent;
    while(parent.parent){
        rot += parent.angle;
        parent = parent.parent;
    }
    return -rot;
}

function getWorldScale (node) {
    var scaleX = node.scaleX;
    var scaleY = node.scaleY;

    var parent = node.parent;
    while(parent.parent){
        scaleX *= parent.scaleX;
        scaleY *= parent.scaleY;

        parent = parent.parent;
    }

    return cc.v2(scaleX, scaleY);
}

function convertToNodeRotation (node, rotation) {
    rotation -= -node.angle;
    var parent = node.parent;
    while(parent.parent){
        rotation -= -parent.angle;
        parent = parent.parent;
    }
    return rotation;
}

module.exports = {
    getWorldRotation: getWorldRotation,
    getWorldScale: getWorldScale,
    convertToNodeRotation: convertToNodeRotation
};
