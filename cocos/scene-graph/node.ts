import { UITransformComponent } from '../3d/ui/components/ui-transfrom-component';
import { ccclass, property } from '../core/data/class-decorator';
import { Mat4, Quat, Vec3 } from '../core/value-types';
import Size from '../core/value-types/size';
import Vec2 from '../core/value-types/vec2';
import { mat4, quat, vec3 } from '../core/vmath';
import { BaseNode } from './base-node';
import { Layers } from './layers';
import { EventType } from './node-event-enum';

const v3_a = new Vec3();
const q_a = new Quat();
const array_a = new Array(10);

enum NodeSpace {
    LOCAL,
    WORLD,
}

@ccclass('cc.Node')
class Node extends BaseNode {
    public static EventType = EventType;
    public static NodeSpace = NodeSpace;

    // is node but not scene
    public static isNode (obj: object) {
        return obj instanceof Node && (obj.constructor === Node || !(obj instanceof cc.Scene));
    }

    // local transform
    @property
    protected _lpos = new Vec3();
    @property
    protected _lrot = new Quat();
    @property
    protected _lscale = new Vec3(1, 1, 1);
    @property
    protected _layer = Layers.Default; // the layer this node belongs to

    // local rotation in euler angles, maintained here so that rotation angles could be greater than 360 degree.
    @property
    protected _euler = new Vec3();

    // world transform
    protected _pos = new Vec3();
    protected _rot = new Quat();
    protected _scale = new Vec3(1, 1, 1);
    protected _mat = new Mat4();

    protected _dirty = false; // does the world transform need to update?
    protected _hasChanged = false; // has the transform changed in this frame?

    protected _matDirty = false;
    protected _eulerDirty = false;

    protected _eventProcessor;
    private _uiTransfromComp: UITransformComponent | null = null;

    @property({
        type: Vec3,
    })
    set eulerAngles (val) {
        this.setRotationFromEuler(val.x, val.y, val.z);
    }
    get eulerAngles () {
        if (this._eulerDirty) {
            quat.toEuler(this._euler, this._lrot);
            this._eulerDirty = false;
        }
        return this._euler;
    }

    get hasChanged () {
        return this._hasChanged;
    }

    set layer (l) {
        this._layer = l;
    }

    get layer () {
        return this._layer;
    }

    get uiTransfromComp () {
        if (!this._uiTransfromComp){
            this._uiTransfromComp = this.getComponent(UITransformComponent);
        }

        return this._uiTransfromComp;
    }

    // NOTE: don't set it manually
    set uiTransfromComp (value: UITransformComponent | null) {
        this._uiTransfromComp = value;
    }

    get width () {
        return this.uiTransfromComp!.width;
    }

    set width (value: number) {
        this.uiTransfromComp!.width = value;
    }

    get height () {
        return this.uiTransfromComp!.height;
    }

    set height (value: number) {
        this.uiTransfromComp!.height = value;
    }

    get anchorX () {
        return this.uiTransfromComp!.anchorX;
    }

    set anchorX (value) {
        this.uiTransfromComp!.anchorX = value;
    }

    get anchorY () {
        return this.uiTransfromComp!.anchorY;
    }

    set anchorY (value: number) {
        this.uiTransfromComp!.anchorY = value;
    }

    get eventProcessor (){
        return this._eventProcessor;
    }

    constructor (name: string) {
        super(name);
        this._eventProcessor = new cc.NodeEventProcessor(this);
    }

    // ===============================
    // hierarchy
    // ===============================

    /**
     * invalidate all children after relevant events
     */
    public _onSetParent (oldParent: this) {
        super._onSetParent(oldParent);
        this.invalidateChildren();
    }

    public _onBatchCreated () {
        vec3.copy(this._pos, this._lpos);
        quat.copy(this._rot, this._lrot);
        vec3.copy(this._scale, this._lscale);
        this._dirty = this._hasChanged = true;
        for (const child of this._children) {
            child._onBatchCreated();
        }
    }

    // ===============================
    // transform helper, convenient but not the most efficient
    // ===============================

    /**
     * Translate the node
     * @param trans - translation
     * @param ns - the operating space
     */
    public translate (trans: Vec3, ns?: NodeSpace) {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            vec3.transformQuat(v3_a, trans, this._lrot);
            this.setPosition(vec3.add(v3_a, this._lpos, v3_a));
        } else if (space === NodeSpace.WORLD) {
            this.setPosition(vec3.add(v3_a, this._lpos, trans));
        }

        vec3.copy(this._pos, this._lpos);
        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.POSITION_PART);
    }

    /**
     * Rotate the node
     * @param rot - rotation to apply
     * @param ns - the operating space
     */
    public rotate (rot: Quat, ns?: NodeSpace) {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            this.getRotation(q_a);
            this.setRotation(quat.multiply(q_a, q_a, rot));
        } else if (space === NodeSpace.WORLD) {
            this.getWorldRotation(q_a);
            this.setWorldRotation(quat.multiply(q_a, rot, q_a));
        }
    }

    /**
     * rotate the node around X axis
     * @param rad - rotating angle
     * @param ns - the operating space
     */
    public pitch (rad: number, ns?: NodeSpace) {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            this.getWorldRotation(q_a);
            quat.toAxisX(v3_a, q_a);
            quat.fromAxisAngle(q_a, v3_a, rad);
            this.rotate(q_a, ns);
        } else if (space === NodeSpace.WORLD) {
            quat.fromAxisAngle(q_a, vec3.UNIT_X, rad);
            this.rotate(q_a, ns);
        }
    }

    /**
     * rotate the node around Y axis
     * @param rad - rotating angle
     * @param ns - the operating space
     */
    public yaw (rad: number, ns?: NodeSpace) {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            this.getWorldRotation(q_a);
            quat.toAxisY(v3_a, q_a);
            quat.fromAxisAngle(q_a, v3_a, rad);
            this.rotate(q_a, ns);
        } else if (space === NodeSpace.WORLD) {
            quat.fromAxisAngle(q_a, vec3.UNIT_Y, rad);
            this.rotate(q_a, ns);
        }
    }

    /**
     * rotate the node around Z axis
     * @param rad - rotating angle
     * @param ns - the operating space
     */
    public roll (rad: number, ns?: NodeSpace) {
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL) {
            this.getWorldRotation(q_a);
            quat.toAxisZ(v3_a, q_a);
            quat.fromAxisAngle(q_a, v3_a, rad);
            this.rotate(q_a, ns);
        } else if (space === NodeSpace.WORLD) {
            quat.fromAxisAngle(q_a, vec3.UNIT_Z, rad);
            this.rotate(q_a, ns);
        }
    }

    public get direction (): Vec3 {
        this.getRotation(q_a);
        return vec3.transformQuat(new Vec3(), vec3.UNIT_Z, q_a);
    }

    public set direction (dir: Vec3) {
        quat.rotationTo(q_a, vec3.UNIT_Z, dir);
        this.setRotation(q_a);
    }

    /**
     * Set rotation by lookAt target point
     * @param pos - target position
     * @param up - the up vector, default to (0,1,0)
     */
    public lookAt (pos: Vec3, up: Vec3) {
        this.getWorldPosition(v3_a);
        vec3.sub(v3_a, v3_a, pos); // NOTE: we use -z for view-dir
        vec3.normalize(v3_a, v3_a);
        quat.fromViewUp(q_a, v3_a, up);

        this.setWorldRotation(q_a);
    }

    // ===============================
    // transform maintainer
    // ===============================

    /**
     * Reset the `hasChanged` flag recursively
     */
    public resetHasChanged () {
        this._hasChanged = false;
        const len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this._children[i].resetHasChanged();
        }
    }

    /**
     * invalidate the world transform information
     * for this node and all its children recursively
     */
    public invalidateChildren () {
        if (this._dirty && this._hasChanged) { return; }
        this._dirty = this._hasChanged = true;
        for (const child of this._children) {
            child.invalidateChildren();
        }
    }

    /**
     * update the world transform information if outdated
     * here we assume all nodes are children of a scene node,
     * which is always not dirty, has an identity transform and no parent.
     */
    public updateWorldTransform () {
        if (!this._dirty) { return; }
        let cur: this | null = this;
        let i = 0;
        while (cur._dirty) {
            // top level node
            array_a[i++] = cur;
            cur = cur._parent;
            if (!cur || !cur._parent) {
                cur = null;
                break;
            }
        }
        let child: this;
        while (i) {
            child = array_a[--i];
            if (cur) {
                vec3.mul(child._pos, child._lpos, cur._scale);
                vec3.transformQuat(child._pos, child._pos, cur._rot);
                vec3.add(child._pos, child._pos, cur._pos);
                quat.mul(child._rot, cur._rot, child._lrot);
                vec3.mul(child._scale, cur._scale, child._lscale);
            }
            child._matDirty = true; // further deferred eval
            child._dirty = false;
            cur = child;
        }
    }

    public updateWorldTransformFull () {
        this.updateWorldTransform();
        if (!this._matDirty) { return; }
        mat4.fromRTS(this._mat, this._rot, this._pos, this._scale);
        this._matDirty = false;
    }

    // ===============================
    // transform
    // ===============================

    /**
     * Sets local position.
     * @param position - The new local position.
     */
    public setPosition (position: Vec3): void;

    /**
     * Sets local position.
     * @param x - The x component of the new local position.
     * @param y - The y component of the new local position.
     * @param z - The z component of the new local position.
     * @param w - The w component of the new local position.
     */
    public setPosition (x: number, y: number, z: number): void;

    /**
     * set local position
     * @param val - the new local position, or the x component of it
     * @param y - the y component of the new local position
     * @param z - the z component of the new local position
     */
    public setPosition (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._lpos, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._lpos, val as number, y, z);
        }
        vec3.copy(this._pos, this._lpos);

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.POSITION_PART);
    }

    /**
     * get local position
     * @param out the receiving vector
     * @returns the resulting vector
     */
    public getPosition (out?: Vec3): Vec3 {
        if (out) {
            return vec3.set(out, this._lpos.x, this._lpos.y, this._lpos.z);
        } else {
            return vec3.copy(new Vec3(), this._lpos);
        }
    }

    /**
     * Sets local rotation.
     * @param rotation - The new local rotation.
     */
    public setRotation (rotation: Quat): void;

    /**
     * Sets local rotation.
     * @param x - The x component of the new local rotation.
     * @param y - The y component of the new local rotation.
     * @param z - The z component of the new local rotation.
     * @param w - The w component of the new local rotation.
     */
    public setRotation (x: number, y: number, z: number, w: number): void;

    public setRotation (val: Quat | number, y?: number, z?: number, w?: number) {
        if (y === undefined || z === undefined || w === undefined) {
            quat.copy(this._lrot, val as Quat);
        } else if (arguments.length === 4) {
            quat.set(this._lrot, val as number, y, z, w);
        }
        quat.copy(this._rot, this._lrot);
        this._eulerDirty = true;

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    /**
     * set local rotation from euler angles
     * @param x - Angle to rotate around X axis in degrees.
     * @param y - Angle to rotate around Y axis in degrees.
     * @param z - Angle to rotate around Z axis in degrees.
     */
    public setRotationFromEuler (x: number, y: number, z: number) {
        vec3.set(this._euler, x, y, z);
        this._eulerDirty = false;
        quat.fromEuler(this._lrot, x, y, z);
        quat.copy(this._rot, this._lrot);

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    /**
     * get local rotation
     * @param out - the receiving quaternion
     * @returns the resulting quaternion
     */
    public getRotation (out?: Quat): Quat {
        if (out) {
            return quat.set(out, this._lrot.x, this._lrot.y, this._lrot.z, this._lrot.w);
        } else {
            return quat.copy(new Quat(), this._lrot);
        }
    }

    /**
     * Sets local scale.
     * @param scale - The new local scale.
     */
    public setScale (scale: Vec3): void;

    /**
     * Sets local scale.
     * @param x - The x component of the new local scale.
     * @param y - The y component of the new local scale.
     * @param z - The z component of the new local scale.
     */
    public setScale (x: number, y: number, z: number): void;

    /**
     * set local scale
     * @param val - the new local scale, or the x component of it
     * @param y - the y component of the new local scale
     * @param z - the z component of the new local scale
     */
    public setScale (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._lscale, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._lscale, val as number, y, z);
        }
        vec3.copy(this._scale, this._lscale);

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.SCALE_PART);
    }

    /**
     * get local scale
     * @param out - the receiving vector
     * @returns the resulting vector
     */
    public getScale (out?: Vec3): Vec3 {
        if (out) {
            return vec3.set(out, this._lscale.x, this._lscale.y, this._lscale.z);
        } else {
            return vec3.copy(new Vec3(), this._lscale);
        }
    }

    /**
     * Sets world position.
     * @param position - The new world position.
     */
    public setWorldPosition (position: Vec3): void;

    /**
     * Sets world position.
     * @param x - The x component of the new world position.
     * @param y - The y component of the new world position.
     * @param z - The z component of the new world position.
     */
    public setWorldPosition (x: number, y: number, z: number): void;

    /**
     * set world position
     * @param val - the new world position, or the x component of it
     * @param y - the y component of the new world position
     * @param z - the z component of the new world position
     */
    public setWorldPosition (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._pos, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._pos, val as number, y, z);
        }
        const parent = this._parent;
        const local = this._lpos;
        if (parent) {
            parent.updateWorldTransform();
            vec3.sub(local, this._pos, parent._pos);
            vec3.transformQuat(local, local, quat.conjugate(q_a, parent._rot));
            vec3.div(local, local, parent._scale);
        } else {
            vec3.copy(this._lpos, this._pos);
        }

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.POSITION_PART);
    }

    public getWorldPosition<Out extends vec3 = Vec3> (out: Out): Out;

    public getWorldPosition (): Vec3;

    /**
     * get world position
     * @param out - the receiving vector
     * @returns the resulting vector
     */
    public getWorldPosition<Out extends vec3 = Vec3> (out?: Out) {
        this.updateWorldTransform();
        if (out) {
            return vec3.copy(out, this._pos);
        } else {
            return vec3.copy(new Vec3(), this._pos);
        }
    }

    /**
     * Sets world rotation.
     * @param rotation - The new world rotation.
     */
    public setWorldRotation (rotation: Quat): void;

    /**
     * Sets world rotation.
     * @param x - The x component of the new world rotation.
     * @param y - The y component of the new world rotation.
     * @param z - The z component of the new world rotation.
     * @param w - The w component of the new world rotation.
     */
    public setWorldRotation (x: number, y: number, z: number, w: number): void;

    /**
     * set world rotation
     * @param val - the new world rotation, or the x component of it
     * @param y - the y component of the new world rotation
     * @param z - the z component of the new world rotation
     * @param w - the w component of the new world rotation
     */
    public setWorldRotation (val: Quat | number, y?: number, z?: number, w?: number) {
        if (y === undefined || z === undefined || w === undefined) {
            quat.copy(this._rot, val as Quat);
        } else if (arguments.length === 4) {
            quat.set(this._rot, val as number, y, z, w);
        }
        if (this._parent) {
            this._parent.getWorldRotation(q_a);
            quat.mul(this._lrot, quat.conjugate(q_a, q_a), this._rot);
        } else {
            quat.copy(this._lrot, this._rot);
        }
        this._eulerDirty = true;

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    /**
     * set world rotation from euler angles
     * @param x - Angle to rotate around X axis in degrees.
     * @param y - Angle to rotate around Y axis in degrees.
     * @param z - Angle to rotate around Z axis in degrees.
     */
    public setWorldRotationFromEuler (x: number, y: number, z: number) {
        vec3.set(this._euler, x, y, z);
        this._eulerDirty = false;
        quat.fromEuler(this._rot, x, y, z);
        if (this._parent) {
            this._parent.getWorldRotation(q_a);
            quat.mul(this._lrot, this._rot, quat.conjugate(q_a, q_a));
        } else {
            quat.copy(this._lrot, this._rot);
        }

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    public getWorldRotation<Out extends quat = Quat> (out: Out): Out;

    public getWorldRotation (): Quat;

    /**
     * get world rotation
     * @param out - the receiving quaternion
     * @returns the resulting quaternion
     */
    public getWorldRotation (out?: Quat): Quat {
        this.updateWorldTransform();
        if (out) {
            return quat.copy(out, this._rot);
        } else {
            return quat.copy(new Quat(), this._rot);
        }
    }

    /**
     * Sets world scale.
     * @param scale - The new world scale.
     */
    public setWorldScale (scale: Vec3): void;

    /**
     * Sets world scale.
     * @param x - The x component of the new world scale.
     * @param y - The y component of the new world scale.
     * @param z - The z component of the new world scale.
     */
    public setWorldScale (x: number, y: number, z: number): void;

    /**
     * set world scale
     * @param val - the new world scale, or the x component of it
     * @param y - the y component of the new world scale
     * @param z - the z component of the new world scale
     */
    public setWorldScale (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._scale, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._scale, val as number, y, z);
        }
        if (this._parent) {
            this._parent.getWorldScale(v3_a);
            vec3.div(this._lscale, this._scale, v3_a);
        } else {
            vec3.copy(this._lscale, this._scale);
        }

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.SCALE_PART);
    }

    public getWorldScale<Out extends vec3 = Vec3> (out: Out): Out;

    public getWorldScale (): Vec3;

    /**
     * get world scale
     * @param out - the receiving vector
     * @returns the resulting vector
     */
    public getWorldScale (out?: Vec3): Vec3 {
        this.updateWorldTransform();
        if (out) {
            return vec3.copy(out, this._scale);
        } else {
            return vec3.copy(new Vec3(), this._scale);
        }
    }

    public getWorldMatrix<Out extends mat4> (out?: Out): Out;

    public getWorldMatrix (): Mat4;

    /**
     * get the matrix that transforms a point from local space into world space
     * @param out - the receiving matrix
     * @returns the - resulting matrix
     */
    public getWorldMatrix (out?: Mat4) {
        this.updateWorldTransformFull();
        if (out) {
            return mat4.copy(out, this._mat);
        } else {
            return mat4.copy(new Mat4(), this._mat);
        }
    }

    /**
     * get world transform matrix (with only rotation and scale)
     * @param out - the receiving matrix
     * @returns the - resulting matrix
     */
    public getWorldRS (out?: Mat4): Mat4 {
        this.updateWorldTransformFull();
        if (out === undefined) { out = new Mat4(); }
        mat4.copy(out, this._mat);
        out.m12 = 0; out.m13 = 0; out.m14 = 0;
        return out;
    }

    /**
     * get world transform matrix (with only rotation and translation)
     * @param out - the receiving matrix
     * @returns the - resulting matrix
     */
    public getWorldRT (out?: Mat4): Mat4 {
        this.updateWorldTransform();
        if (!out) {
            out = new Mat4();
        }
        return mat4.fromRT(out, this._rot, this._pos);
    }

    public getAnchorPoint () {
        return this.uiTransfromComp!.anchorPoint;
    }

    public setAnchorPoint (point: Vec2 | number, y?: number) {
        this.uiTransfromComp!.setAnchorPoint(point, y);
    }

    public getContentSize () {
        return this.uiTransfromComp!.contentSize;
    }

    public setContentSize (size: Size | number, height?: number) {
        this.uiTransfromComp!.setContentSize(size, height);
    }

    // Event

    public on (type: string | EventType, callback: Function, target?: Object, useCapture?: any) {
        this._eventProcessor.on(type, callback, target, useCapture);
    }

    public off (type: string, callback: Function, target?: Object, useCapture?: any) {
        this._eventProcessor.off(type, callback, target, useCapture);
    }

    public once (type, callback, target, useCapture) {
        this._eventProcessor.once(type, callback, target, useCapture);
    }

    public emit (type, ...args: any[]) {
        this._eventProcessor.emit(type, ...args);
    }

    public dispatchEvent (event) {
       this._eventProcessor.dispatchEvent(event);
    }
}

if (CC_EDITOR) {
    const repeat = (t: number, l: number) => t - Math.floor(t / l) * l;
    Object.defineProperty(Node.prototype, 'eulerAngles', {
        set (val: Vec3) {
            this.setRotationFromEuler(val.x, val.y, val.z);
        },
        get () {
            if (this._eulerDirty) {
                const eu = this._euler;
                quat.toEuler(v3_a, this._lrot);
                eu.x = repeat(v3_a.x - eu.x + 180, 360) + eu.x - 180;
                eu.y = repeat(v3_a.y - eu.y + 180, 360) + eu.y - 180;
                eu.z = repeat(v3_a.z - eu.z + 180, 360) + eu.z - 180;
                this._eulerDirty = false;
            }
            return this._euler;
        },
    });
}

cc.Node = Node;
export { Node };
