
const quat = cc.vmath.quat;
let _quat_tmp = cc.quat();
let _vec3_tmp = cc.v3();

/*
 * Rotates a Node object to a certain angle by modifying its quaternion property. <br/>
 * The direction will be decided by the shortest angle.
 * @class Rotate3DTo
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} dstAngleX dstAngleX in degrees.
 * @param {Number} [dstAngleY] dstAngleY in degrees.
 * @param {Number} [dstAngleZ] dstAngleZ in degrees.
 * @example
 * var rotate3DTo = new cc.Rotate3DTo(2, cc.v3(0, 180, 0));
 */
cc.Rotate3DTo = cc.Class({
    name: 'cc.Rotate3DTo',
    extends: cc.ActionInterval,

    ctor:function (duration, dstAngleX, dstAngleY, dstAngleZ) {
        this._startQuat = cc.quat();
        this._dstQuat = cc.quat();

		dstAngleX !== undefined && this.initWithDuration(duration, dstAngleX, dstAngleY, dstAngleZ);
    },

    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Number|Vec3|Quat} dstAngleX
     * @param {Number} dstAngleY
     * @param {Number} dstAngleZ
     * @return {Boolean}
     */
    initWithDuration:function (duration, dstAngleX, dstAngleY, dstAngleZ) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            let dstQuat = this._dstQuat;
            if (dstAngleX instanceof cc.Quat) {
                dstQuat.set(dstAngleX);
            }
            else {
                if (dstAngleX instanceof cc.Vec3) {
                    dstAngleY = dstAngleX.y;
                    dstAngleZ = dstAngleX.z;
                    dstAngleX = dstAngleX.x;
                }
                else {
                    dstAngleY = dstAngleY || 0;
                    dstAngleZ = dstAngleZ || 0;
                }
                cc.vmath.quat.fromEuler(dstQuat, dstAngleX, dstAngleY, dstAngleZ);
            }
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.Rotate3DTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._dstQuat);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._startQuat.set(target.quat);
    },

    reverse:function () {
        cc.logID(1016);
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            quat.slerp(_quat_tmp, this._startQuat, this._dstQuat, dt);
            this.target.setRotation(_quat_tmp);
        }
    }
});

/**
 * !#en
 * Rotates a Node object to a certain angle by modifying its quternion property. <br/>
 * The direction will be decided by the shortest angle.
 * !#zh 旋转到目标角度，通过逐帧修改它的 quternion 属性，旋转方向将由最短的角度决定。
 * @method rotate3DTo
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3|Quat} dstAngleX dstAngleX in degrees.
 * @param {Number} [dstAngleY] dstAngleY in degrees.
 * @param {Number} [dstAngleZ] dstAngleZ in degrees.
 * @return {ActionInterval}
 * @example
 * // example
 * var rotate3DTo = cc.rotate3DTo(2, cc.v3(0, 180, 0));
 */
cc.rotate3DTo = function (duration, dstAngleX, dstAngleY, dstAngleZ) {
    return new cc.Rotate3DTo(duration, dstAngleX, dstAngleY, dstAngleZ);
};


/*
 * Rotates a Node object counter clockwise a number of degrees by modifying its quaternion property.
 * Relative to its properties to modify.
 * @class Rotate3DBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @param {Number} [deltaAngleZ] deltaAngleZ in degrees
 * @example
 * var actionBy = new cc.Rotate3DBy(2, cc.v3(0, 360, 0));
 */
cc.Rotate3DBy = cc.Class({
    name: 'cc.Rotate3DBy',
    extends: cc.ActionInterval,

    ctor: function (duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
        this._angle = cc.v3();
        this._quat = cc.quat();
        this._lastDt = 0;
		deltaAngleX !== undefined && this.initWithDuration(duration, deltaAngleX, deltaAngleY, deltaAngleZ);
    },

    /*
     * Initializes the action.
     * @param {Number} duration duration in seconds
     * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
     * @param {Number} [deltaAngleY=] deltaAngleY in degrees
     * @param {Number} [deltaAngleZ=] deltaAngleZ in degrees
     * @return {Boolean}
     */
    initWithDuration:function (duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            if (deltaAngleX instanceof cc.Vec3) {
                deltaAngleY = deltaAngleX.y;
                deltaAngleZ = deltaAngleX.z;
                deltaAngleX = deltaAngleX.x;
            }
            else {
                deltaAngleY = deltaAngleY || 0;
                deltaAngleZ = deltaAngleZ || 0;
            }
            cc.vmath.vec3.set(this._angle, deltaAngleX, deltaAngleY, deltaAngleZ);
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.Rotate3DBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._angle);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._quat.set(target.quat);
        this._lastDt = 0;
    },

    update: (function(){
        let RAD = Math.PI / 180;
        return function (dt) {
            dt = this._computeEaseTime(dt);
            if (this.target) {
                let angle = this._angle;
                let dstQuat = this._quat;
                let delta = dt - this._lastDt;
                let angleX = angle.x, angleY = angle.y, angleZ = angle.z;
                if (angleX) quat.rotateX(dstQuat, dstQuat, angleX * RAD * delta);
                if (angleY) quat.rotateY(dstQuat, dstQuat, angleY * RAD * delta);
                if (angleZ) quat.rotateZ(dstQuat, dstQuat, angleZ * RAD * delta);
                this.target.setRotation(dstQuat);
                
                this._lastDt = dt;
            }
        }
    })(),

    reverse:function () {
        let angle = this._angle;
        _vec3_tmp.x = -angle.x;
        _vec3_tmp.y = -angle.y;
        _vec3_tmp.z = -angle.z;
        var action = new cc.Rotate3DBy(this._duration, _vec3_tmp);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

/**
 * !#en
 * Rotates a Node object counter clockwise a number of degrees by modifying its quaternion property.
 * Relative to its properties to modify.
 * !#zh 旋转指定的 3D 角度。
 * @method rotate3DBy
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @param {Number} [deltaAngleZ] deltaAngleZ in degrees
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.rotate3DBy(2, cc.v3(0, 360, 0));
 */
cc.rotate3DBy = function (duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
    return new cc.Rotate3DBy(duration, deltaAngleX, deltaAngleY, deltaAngleZ);
};

