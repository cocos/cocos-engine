/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';
if (!cc.runtime) {
    var _p = cc.TMXObject.prototype;
    cc.defineGetterSetter(_p, 'type', _p.getType, null);
    cc.defineGetterSetter(_p, 'name', _p.getObjectName, _p.setObjectName);
    cc.defineGetterSetter(_p, 'id', _p.getId, null);
    cc.defineGetterSetter(_p, 'gid', _p.getGid, null);
    cc.defineGetterSetter(_p, 'offset', _p.getOffset, null);
    cc.defineGetterSetter(_p, 'objectSize', _p.getObjectSize, null);
    cc.defineGetterSetter(_p, 'objectVisible', _p.getObjectVisible, null);
    cc.defineGetterSetter(_p, 'objectRotation', _p.getObjectRotation, null);
    cc.defineGetterSetter(_p, 'sgNode', _p.getNode, null);
}
