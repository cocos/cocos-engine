import { vec3, mat4, quat } from '../core/vmath';
import BaseNode from './base-node';
import Layers from './layers';
import { EventTarget } from "../core/event";
import { ccclass, property, mixins } from '../core/data/class-decorator';

let v3_a = cc.v3();
let q_a = cc.quat();
let array_a = new Array(10);

let EventType = cc.Enum({
    TRANSFORM_CHANGED: 'transform-changed',
    POSITION_PART: 1,
    ROTATION_PART: 2,
    SCALE_PART: 4
});

@ccclass('cc.Node')
@mixins(EventTarget)
class Node extends BaseNode {
    // local transform
    @property
    _lpos = cc.v3();
    @property
    _lrot = cc.quat();
    @property
    _lscale = cc.v3(1, 1, 1);
    @property
    _layer = Layers.Default; // the layer this node belongs to

    @property
    _euler = cc.v3(); // local rotation in euler angles, maintained here so that rotation angles could be greater than 360 degree.

    // world transform
    _pos = cc.v3();
    _rot = cc.quat();
    _scale = cc.v3(1, 1, 1);
    _mat = cc.mat4();

    _dirty = false; // does the world transform need to update?
    _hasChanged = false; // has the transform changed in this frame?

    // is node but not scene
    static isNode (obj) {
        return obj instanceof Node && (obj.constructor === Node || !(obj instanceof cc.Scene));
    }

    static EventType = EventType;

    constructor (name) {
        super(name);
        EventTarget.call(this);
    }


    // ===============================
    // hierarchy
    // ===============================

    /**
     * invalidate all children after relevant events
     */
    onRestore() {
        super.onRestore();
        this.invalidateChildren();
    }

    _onSetParent(/*oldParent*/) {
        this.invalidateChildren();
    }

    _onPostActivated() {
        this.invalidateChildren();
    }

    // ===============================
    // transform helper
    // ===============================

    /**
     * Set rotation by lookAt target point
     * @param {vec3} pos target position
     * @param {vec3} up the up vector, default to (0,1,0)
     */
    lookAt(pos, up) {
        this.getWorldPosition(v3_a);
        vec3.sub(v3_a, v3_a, pos); // NOTE: we use -z for view-dir
        vec3.normalize(v3_a, v3_a);
        quat.fromViewUp(q_a, v3_a, up);

        this.setWorldRotation(q_a);
    }

    /**
     * Reset the `hasChanged` flag recursively
     */
    resetHasChanged() {
        this._hasChanged = false;
        let len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this._children[i].resetHasChanged();
        }
    }

    /**
     * invalidate the world transform information
     * for this node and all its children recursively
     */
    invalidateChildren() {
        if (this._dirty) return;
        this._dirty = true;
        this._hasChanged = true;

        let len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this._children[i].invalidateChildren();
        }
    }

    /**
     * update the world transform information if outdated
     */
    updateWorldTransform() {
        if (!this._dirty) return;
        let cur = this, child, i = 0;
        while (cur._dirty) {
            // top level node
            array_a[i++] = cur;
            cur = cur._parent;
            if (!cur || cur.isLevel) {
                cur = null;
                break;
            }
        }
        while (i) {
            child = array_a[--i];
            if (cur) {
              vec3.mul(child._pos, child._lpos, cur._scale);
              vec3.transformQuat(child._pos, child._pos, cur._rot);
              vec3.add(child._pos, child._pos, cur._pos);
              quat.mul(child._rot, cur._rot, child._lrot);
              vec3.mul(child._scale, cur._scale, child._lscale);
            }
            child._mat._dirty = true; // further deferred eval
            child._dirty = false;
            cur = child;
        }
    }

    updateWorldTransformFull() {
        this.updateWorldTransform();
        if (!this._mat._dirty) return;
        mat4.fromRTS(this._mat, this._rot, this._pos, this._scale);
        this._mat._dirty = false;
    }


    // ===============================
    // transform
    // ===============================

    /**
     * set local position
     * @param {vec3|number} val the new local position, or the x component of it
     * @param {number} [y] the y component of the new local position
     * @param {number} [z] the z component of the new local position
     */
    setPosition(val, y, z) {
        if (arguments.length === 1) {
            vec3.copy(this._lpos, val);
        } else if (arguments.length === 3) {
            vec3.set(this._lpos, val, y, z);
        }
        vec3.copy(this._pos, this._lpos);

        this.emit(EventType.TRANSFORM_CHANGED, EventType.POSITION_PART);
        this.invalidateChildren();
    }

    /**
     * get local position
     * @param {vec3} [out] the receiving vector
     * @return {vec3} the resulting vector
     */
    getPosition(out) {
        if (out) {
            return vec3.set(out, this._lpos.x, this._lpos.y, this._lpos.z);
        } else {
            return vec3.copy(cc.v3(), this._lpos);
        }
    }

    /**
     * set local rotation
     * @param {quat|number} val the new local rotation, or the x component of it
     * @param {number} [y] the y component of the new local rotation
     * @param {number} [z] the z component of the new local rotation
     * @param {number} [w] the w component of the new local rotation
     */
    setRotation(val, y, z, w) {
        if (arguments.length === 1) {
            quat.copy(this._lrot, val);
        } else if (arguments.length === 4) {
            quat.set(this._lrot, val, y, z, w);
        }
        quat.copy(this._rot, this._lrot);
        this.syncEuler();

        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
        this.invalidateChildren();
    }

    /**
     * set local rotation from euler angles
     * @param {number} x - Angle to rotate around X axis in degrees.
     * @param {number} y - Angle to rotate around Y axis in degrees.
     * @param {number} z - Angle to rotate around Z axis in degrees.
     */
    setRotationFromEuler(x, y, z) {
        vec3.set(this._euler, x, y, z);
        quat.fromEuler(this._lrot, x, y, z);
        quat.copy(this._rot, this._lrot);

        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
        this.invalidateChildren();
    }

    /**
     * get local rotation
     * @param {quat} [out] the receiving quaternion
     * @return {quat} the resulting quaternion
     */
    getRotation(out) {
        if (out) {
            return quat.set(out, this._lrot.x, this._lrot.y, this._lrot.z, this._lrot.w);
        } else {
            return quat.copy(cc.quat(), this._lrot);
        }
    }

    set eulerAngles(val) {
        vec3.copy(this._euler, val);
        this.setRotationFromEuler(val.x, val.y, val.z);
    }
    get eulerAngles() {
        return this._euler;
    }

    /**
     * set local scale
     * @param {vec3|number} val the new local scale, or the x component of it
     * @param {number} [y] the y component of the new local scale
     * @param {number} [z] the z component of the new local scale
     */
    setScale(val, y, z) {
        if (arguments.length === 1) {
            vec3.copy(this._lscale, val);
        } else if (arguments.length === 3) {
            vec3.set(this._lscale, val, y, z);
        }
        vec3.copy(this._scale, this._lscale);

        this.emit(EventType.TRANSFORM_CHANGED, EventType.SCALE_PART);
        this.invalidateChildren();
    }

    /**
     * get local scale
     * @param {vec3} [out] the receiving vector
     * @return {vec3} the resulting vector
     */
    getScale(out) {
        if (out) {
            return vec3.set(out, this._lscale.x, this._lscale.y, this._lscale.z);
        } else {
            return vec3.copy(cc.v3(), this._lscale);
        }
    }

    /**
     * set world position
     * @param {vec3|number} val the new world position, or the x component of it
     * @param {number} [y] the y component of the new world position
     * @param {number} [z] the z component of the new world position
     */
    setWorldPosition(val, y, z) {
        if (arguments.length === 1) {
            vec3.copy(this._pos, val);
        } else if (arguments.length === 3) {
            vec3.set(this._pos, val, y, z);
        }
        if (this._parent) {
            this._parent.getWorldPosition(v3_a);
            vec3.sub(this._lpos, this._pos, v3_a);
        } else {
            vec3.copy(this._lpos, this._pos);
        }

        this.emit(EventType.TRANSFORM_CHANGED, EventType.POSITION_PART);
        this.invalidateChildren();
    }

    /**
     * get world position
     * @param {vec3} [out] the receiving vector
     * @return {vec3} the resulting vector
     */
    getWorldPosition(out) {
        this.updateWorldTransform();
        if (out) {
            return vec3.copy(out, this._pos);
        } else {
            return vec3.copy(cc.v3(), this._pos);
        }
    }

    /**
     * set world rotation
     * @param {quat|number} val the new world rotation, or the x component of it
     * @param {number} [y] the y component of the new world rotation
     * @param {number} [z] the z component of the new world rotation
     * @param {number} [w] the w component of the new world rotation
     */
    setWorldRotation(val, y, z, w) {
        if (arguments.length === 1) {
            quat.copy(this._rot, val);
        } else if (arguments.length === 4) {
            quat.set(this._rot, val, y, z, w);
        }
        if (this._parent) {
            this._parent.getWorldRotation(q_a);
            quat.mul(this._lrot, this._rot, quat.conjugate(q_a, q_a));
        } else {
            quat.copy(this._lrot, this._rot);
        }
        this.syncEuler();

        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
        this.invalidateChildren();
    }

    /**
     * set world rotation from euler angles
     * @param {number} x - Angle to rotate around X axis in degrees.
     * @param {number} y - Angle to rotate around Y axis in degrees.
     * @param {number} z - Angle to rotate around Z axis in degrees.
     */
    setWorldRotationFromEuler(x, y, z) {
        vec3.set(this._euler, x, y, z);
        quat.fromEuler(this._rot, x, y, z);
        if (this._parent) {
            this._parent.getWorldRotation(q_a);
            quat.mul(this._lrot, this._rot, quat.conjugate(q_a, q_a));
        } else {
            quat.copy(this._lrot, this._rot);
        }

        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
        this.invalidateChildren();
    }

    /**
     * get world rotation
     * @param {quat} [out] the receiving quaternion
     * @return {quat} the resulting quaternion
     */
    getWorldRotation(out) {
        this.updateWorldTransform();
        if (out) {
            return quat.copy(out, this._rot);
        } else {
            return quat.copy(cc.quat(), this._rot);
        }
    }

    /**
     * set world scale
     * @param {vec3|number} val the new world scale, or the x component of it
     * @param {number} [y] the y component of the new world scale
     * @param {number} [z] the z component of the new world scale
     */
    setWorldScale(val, y, z) {
        if (arguments.length === 1) {
            vec3.copy(this._scale, val);
        } else if (arguments.length === 3) {
            vec3.set(this._scale, val, y, z);
        }
        if (this._parent) {
            this._parent.getWorldScale(v3_a);
            vec3.div(this._lscale, this._scale, v3_a);
        } else {
            vec3.copy(this._lscale, this._scale);
        }

        this.emit(EventType.TRANSFORM_CHANGED, EventType.SCALE_PART);
        this.invalidateChildren();
    }

    /**
     * get world scale
     * @param {vec3} [out] the receiving vector
     * @return {vec3} the resulting vector
     */
    getWorldScale(out) {
        this.updateWorldTransform();
        if (out) {
            return vec3.copy(out, this._scale);
        } else {
            return vec3.copy(cc.v3(), this._scale);
        }
    }

    /**
     * get the matrix that transforms a point from local space into world space
     * @param {mat4} [out] the receiving matrix
     * @return {mat4} the resulting matrix
     */
    getWorldMatrix(out) {
        this.updateWorldTransformFull();
        if (out) {
            return mat4.copy(out, this._mat);
        } else {
            return mat4.copy(cc.mat4(), this._mat);
        }
    }

    /**
     * get world transform matrix (with only rotation and scale)
     * @param {mat4} [out] the receiving matrix
     * @return {mat4} the resulting matrix
     */
    getWorldRS(out) {
        this.updateWorldTransformFull();
        if (out) {
            mat4.copy(out, this._mat);
        } else {
            out = mat4.copy(cc.mat4(), this._mat);
        }
        out.m12 = 0; out.m13 = 0; out.m14 = 0;
        return out;
    }

    /**
     * get world transform matrix (with only rotation and translation)
     * @param {mat4} [out] the receiving matrix
     * @return {mat4} the resulting matrix
     */
    getWorldRT(out) {
        this.updateWorldTransform();
        if (!out) {
            out = cc.mat4();
        }
        return mat4.fromRT(out, this._rot, this._pos);
    }
}

if (CC_EDITOR) {
    let repeat = (t, l) => t - Math.floor(t / l) * l;
    Node.prototype.syncEuler = function() {
        let eu = this._euler;
        quat.toEuler(v3_a, this._lrot);
        eu.x = repeat(v3_a.x - eu.x + 180, 360) + eu.x - 180;
        eu.y = repeat(v3_a.y - eu.y + 180, 360) + eu.y - 180;
        eu.z = repeat(v3_a.z - eu.z + 180, 360) + eu.z - 180;
    };
} else Node.prototype.syncEuler = function() {};

cc.Node = Node;
export default Node;
