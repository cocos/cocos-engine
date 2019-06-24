/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
let EventTarget = require('../../cocos2d/core/event/event-target');

dragonBones.CCArmatureDisplay = cc.Class({
    name: 'dragonBones.CCArmatureDisplay',

    properties: {
        // adapt old api
        node: {
            get () {
                return this;
            }
        },
    },

    ctor () {
        this._eventTarget = new EventTarget();
    },

    setEventTarget (eventTarget) {
        this._eventTarget = eventTarget;
    },

    getRootDisplay () {
        var parentSlot = this._armature._parent;
        if (!parentSlot) {
            return this;
        }
        
        var slot;
        while (parentSlot)
        {
            slot = parentSlot;
            parentSlot = parentSlot._armature._parent;
        }
        return slot._armature.getDisplay();
    },

    convertToRootSpace (pos) {
        var slot = this._armature._parent;
        if (!slot)
        {
            return pos;
        }
        slot.updateWorldMatrix();

        let worldMatrix = slot._worldMatrix;
        let worldMatrixm = worldMatrix.m;
        let newPos = cc.v2(0,0);
        newPos.x = pos.x * worldMatrixm[0] + pos.y * worldMatrixm[4] + worldMatrixm[12];
        newPos.y = pos.x * worldMatrixm[1] + pos.y * worldMatrixm[5] + worldMatrixm[13];
        return newPos;
    },

    convertToWorldSpace (point) {
        var newPos = this.convertToRootSpace(point);
        var ccNode = this.getRootNode();
        var finalPos = ccNode.convertToWorldSpace(newPos);
        return finalPos;
    },

    getRootNode () {
        var rootDisplay = this.getRootDisplay();
        return rootDisplay && rootDisplay._ccNode;
    },

    ////////////////////////////////////
    // dragonbones api
    dbInit (armature) {
        this._armature = armature;
    },

    dbClear () {
        this._armature = null;
    },

    dbUpdate () {
        
    },

    advanceTimeBySelf  (on) {
        this.shouldAdvanced = !!on;
    },

    hasDBEventListener (type) {
        return this._eventTarget.hasEventListener(type);
    },

    addDBEventListener (type, listener, target) {
        this._eventTarget.on(type, listener, target);
    },

    removeDBEventListener (type, listener, target) {
        this._eventTarget.off(type, listener, target);
    },

    dispatchDBEvent  (type, eventObject) {
        this._eventTarget.emit(type, eventObject);
    }
    ////////////////////////////////////

});
