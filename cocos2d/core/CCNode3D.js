/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Misc = require('./utils/misc');

var Node = cc.Class({
    name: 'cc.Node3D',
    extends: require('./utils/base-node'),

    properties: {
        _localPosition: new cc.Vec3(0,0,0),
        _localRotation: new cc.Quat(0,0,0,1),
        _localScale: new cc.Vec3(1,1,1),
    },

    ctor: function(name) {
        this._localEulerAngles = new cc.Vec3(0,0,0);

        this._worldPosition = new cc.Vec3(0,0,0);
        this._worldRotation = new cc.Quat(0,0,0,1);
        this._worldScale = new cc.Vec3(1,1,1);
        this._worldEulerAngles = new cc.Vec3(0,0,0);

        this._localTransform = new cc.Mat4();
        this._worldTransform = new cc.Mat4();

        this._dirtyLocal = false;
        this._dirtyWorld = false;

        this._right = new cc.Vec3();
        this._up = new cc.Vec3();
        this._forward = new cc.Vec3();

        this._aabbVer = 0;
    },

    getRight: function() {
        this.getWorldTransform().getX(this._right).normalize();
    },

    getUp: function() {
        return this.getWorldTransform().getY(this._up).normalize();
    },

    getForward: function() {
        return this.getWorldTransform().getZ(this._forward).normalize().scale(-1);
    },

    getLocalEulerAngles: function () {
        this._localRotation.getEulerAngles(this._localEulerAngles);
        return this._localEulerAngles;
    },

    getLocalPosition: function () {
        return this._localPosition;
    },

    getLocalRotation: function () {
        return this._localRotation;
    },

    getLocalScale: function () {
        return this._localScale;
    },

    getLocalTransform: function () {
        if (this._dirtyLocal) {
            this._localTransform.setTRS(this._localPosition, this._localRotation, this._localScale);

            this._dirtyLocal = false;
            this._dirtyWorld = true;
            this._aabbVer++;
        }
        return this._localTransform;
    },

    getWorldPosition: function () {
        this.getWorldTransform().getTranslation(this._worldPosition);
        return this._worldPosition;
    },

    getWorldRotation: function () {
        this._worldRotation.setFromMat4(this.getWorldTransform());
        return this._worldRotation;
    },

    getWorldEulerAngles: function () {
        this.getWorldTransform().getEulerAngles(this._worldEulerAngles);
        return this._worldEulerAngles;
    },

    getWorldTransform: function () {
        var syncList = [];

        return function () {
            var current = this;
            syncList.length = 0;

            while (current !== null) {
                syncList.push(current);
                current = current._parent;
            }

            for (var i = syncList.length - 1; i >= 0; i--) {
                syncList[i].sync();
            }

            return this._worldTransform;
        };
    }(),

    setLocalEulerAngles: function () {
        var ex, ey, ez;
        switch (arguments.length) {
            case 1:
                ex = arguments[0].x;
                ey = arguments[0].y;
                ez = arguments[0].z;
                break;
            case 3:
                ex = arguments[0];
                ey = arguments[1];
                ez = arguments[2];
                break;
        }

        this._localRotation.setFromEulerAngles(ex, ey, ez);
        this._dirtyLocal = true;
    },

    setLocalPosition: function () {
        if (arguments.length === 1) {
            this._localPosition.copy(arguments[0]);
        } else {
            this._localPosition.set(arguments[0], arguments[1], arguments[2]);
        }
        this._dirtyLocal = true;
    },

    setLocalRotation: function (q) {
        if (arguments.length === 1) {
            this._localRotation.copy(arguments[0]);
        } else {
            this._localRotation.set(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
        this._dirtyLocal = true;
    },

    setLocalScale: function () {
        if (arguments.length === 1) {
            this._localScale.copy(arguments[0]);
        } else {
            this._localScale.set(arguments[0], arguments[1], arguments[2]);
        }
        this._dirtyLocal = true;
    },

    setWorldPosition: function () {
        var position = new cc.Vec3();
        var invParentWtm = new cc.Mat4();

        return function () {
            if (arguments.length === 1) {
                position.copy(arguments[0]);
            } else {
                position.set(arguments[0], arguments[1], arguments[2]);
            }

            if (this._parent === null) {
                this._localPosition.copy(position);
            } else {
                invParentWtm.copy(this._parent.getWorldTransform()).invert();
                invParentWtm.transformPoint(position, this._localPosition);
            }
            this._dirtyLocal = true;
        };
    }(),

    setWorldRotation: function () {
        var rotation = new cc.Quat();
        var invParentRot = new cc.Quat();

        return function () {
            if (arguments.length === 1) {
                rotation.copy(arguments[0]);
            } else {
                rotation.set(arguments[0], arguments[1], arguments[2], arguments[3]);
            }

            if (this._parent === null) {
                this._localRotation.copy(rotation);
            } else {
                var parentRot = this._parent.getRotation();
                invParentRot.copy(parentRot).invert();
                this._localRotation.copy(invParentRot).mul(rotation);
            }
            this._dirtyLocal = true;
        };
    }(),

    setWorldEulerAngles: function () {
        var invParentRot = new cc.Quat();

        return function () {
            var ex, ey, ez;
            switch (arguments.length) {
                case 1:
                    ex = arguments[0].x;
                    ey = arguments[0].y;
                    ez = arguments[0].z;
                    break;
                case 3:
                    ex = arguments[0];
                    ey = arguments[1];
                    ez = arguments[2];
                    break;
            }

            this._localRotation.setFromEulerAngles(ex, ey, ez);

            if (this._parent !== null) {
                var parentRot = this._parent.getRotation();
                invParentRot.copy(parentRot).invert();
                this._localRotation.mul2(invParentRot, this._localRotation);
            }
            this._dirtyLocal = true;
        };
    }(),

    sync: function () {
        if (this._dirtyLocal) {
            this._localTransform.setTRS(this._localPosition, this._localRotation, this._localScale);

            this._dirtyLocal = false;
            this._dirtyWorld = true;
            this._aabbVer++;
        }

        if (this._dirtyWorld) {
            if (this._parent === null) {
                this._worldTransform.copy(this._localTransform);
            } else {
                this._worldTransform.mul2(this._parent._worldTransform, this._localTransform);
            }

            this._dirtyWorld = false;
            var child;

            for (var i = 0, len = this._children.length; i < len; i++) {
                child = this._children[i];
                child._dirtyWorld = true;
                child._aabbVer++;

            }
        }
    },

    syncHierarchy: (function () {
        // cache this._children and the syncHierarchy method itself
        // for optimization purposes
        var F = function () {
            if (!this._active) {
                return;
            }

            // sync this object
            this.sync();

            // sync the children
            var c = this._children;
            for(var i = 0, len = c.length;i < len;i++) {
                F.call(c[i]);
            }
        };
        return F;
    })(),

    lookAt: function () {
        var matrix = new cc.Mat4();
        var target = new cc.Vec3();
        var up = new cc.Vec3();
        var rotation = new cc.Quat();

        return function () {
            switch (arguments.length) {
                case 1:
                    target.copy(arguments[0]);
                    up.copy(cc.Vec3.UP);
                    break;
                case 2:
                    target.copy(arguments[0]);
                    up.copy(arguments[1]);
                    break;
                case 3:
                    target.set(arguments[0], arguments[1], arguments[2]);
                    up.copy(cc.Vec3.UP);
                    break;
                case 6:
                    target.set(arguments[0], arguments[1], arguments[2]);
                    up.set(arguments[3], arguments[4], arguments[5]);
                    break;
            }

            matrix.setLookAt(this.getPosition(), target, up);
            rotation.setFromMat4(matrix);
            this.setRotation(rotation);
        };
    }(),

    translateWorld: function () {
        var translation = new cc.Vec3();

        return function () {
            switch (arguments.length) {
                case 1:
                    translation.copy(arguments[0]);
                    break;
                case 3:
                    translation.set(arguments[0], arguments[1], arguments[2]);
                    break;
            }

            translation.add(this.getWorldPosition());
            this.setWorldPosition(translation);
        };
    }(),

    translateLocal: function () {
        var translation = new cc.Vec3();

        return function () {
            switch (arguments.length) {
                case 1:
                    translation.copy(arguments[0]);
                    break;
                case 3:
                    translation.set(arguments[0], arguments[1], arguments[2]);
                    break;
            }

            this._localRotation.transformVector(translation, translation);
            this._localPosition.add(translation);
            this._dirtyLocal = true;
        };
    }(),

    rotateWorld: function () {
        var quaternion = new cc.Quat();
        var invParentRot = new cc.Quat();

        return function () {
            var ex, ey, ez;
            switch (arguments.length) {
                case 1:
                    ex = arguments[0].x;
                    ey = arguments[0].y;
                    ez = arguments[0].z;
                    break;
                case 3:
                    ex = arguments[0];
                    ey = arguments[1];
                    ez = arguments[2];
                    break;
            }

            quaternion.setFromEulerAngles(ex, ey, ez);

            if (this._parent === null) {
                this._localRotation.mul2(quaternion, this._localRotation);
            } else {
                var rot = this.getRotation();
                var parentRot = this._parent.getRotation();

                invParentRot.copy(parentRot).invert();
                quaternion.mul2(invParentRot, quaternion);
                this._localRotation.mul2(quaternion, rot);
            }

            this._dirtyLocal = true;
        };
    }(),

    rotateLocal: function () {
        var quaternion = new cc.Quat();

        return function () {
            var ex, ey, ez;
            switch (arguments.length) {
                case 1:
                    ex = arguments[0].x;
                    ey = arguments[0].y;
                    ez = arguments[0].z;
                    break;
                case 3:
                    ex = arguments[0];
                    ey = arguments[1];
                    ez = arguments[2];
                    break;
            }

            quaternion.setFromEulerAngles(ex, ey, ez);

            this._localRotation.mul(quaternion);
            this._dirtyLocal = true;
        };
    }(),

    _onHierarchyChanged: function (oldParent) {
        this._onHierarchyChangedBase(oldParent);
        this._dirtyWorld = true;
    },
});

var SameNameGetSets = ['parent', 'tag',];

var DiffNameGetSets = {
};

Misc.propertyDefine(Node, SameNameGetSets, DiffNameGetSets);

cc.Node3D = module.exports = Node;
