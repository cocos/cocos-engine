import { frustum, ray } from '../../3d/geom-utils';
import { lerp, mat4, quat, vec3 } from '../../core/vmath';
import Node from '../../scene-graph/node';
import { RenderScene } from './render-scene';

export enum NodeSpace {
    LOCAL,
    PARENT,
    WORLD,
}

export enum CameraProjection {
    PERSPECTIVE,
    ORTHO,
}

const q_a = cc.quat();
const v_a = cc.v3();
const v_b = cc.v3();

export interface INormalizedViewPort {
    x: number;
    y: number;
    w: number;
    h: number;
}

export class Camera {

    private _scene: RenderScene;
    private _name: string;
    private _node: Node;
    private _proj: CameraProjection;
    private _viewport: INormalizedViewPort;
    private _width: number;
    private _height: number;
    private _aspect: number;
    private _fov: number;
    private _nearClip: number;
    private _farClip: number;
    private _matView: mat4 = new mat4();
    private _matProj: mat4 = new mat4();
    private _matViewProj: mat4 = new mat4();
    private _matViewProjInv: mat4 = new mat4();
    private _position: vec3 = new vec3();
    private _rotation: quat = new quat();
    private _direction: vec3 = new vec3();
    private _frustum: frustum = new frustum();

    constructor (scene: RenderScene, name: string) {
        this._scene = scene;
        this._name = name;
        this._node = scene.createNode({ name: name + 'Node', isStatic: false });
        this._proj = CameraProjection.PERSPECTIVE;
        this._viewport = { x: 0, y: 0, w: 1, h: 1 };

        const window = scene.root.mainWindow;
        if (window) {
            this._width = window.width;
            this._height = window.height;
        } else {
            this._width = 1;
            this._height = 1;
        }

        this._aspect = this._width / this._height;
        this._fov = Math.PI / 4;
        this._nearClip = 1.0;
        this._farClip = 10000.0;
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect = this._width / this._height;
    }

    public update () {
        // view matrix
        this._node.getWorldRT(this._matView);
        mat4.invert(this._matView, this._matView);

        // projection matrix
        if (this._proj === CameraProjection.PERSPECTIVE) {
            mat4.perspective(this._matProj, this._fov, this._aspect, this._nearClip, this._farClip);
        } else {
            const x = this._width;
            const y = this._height;
            mat4.ortho(this._matProj, -x, x, -y, y, this._nearClip, this._farClip);
        }

        // view-projection
        mat4.mul(this._matViewProj, this._matProj, this._matView);
        mat4.invert(this._matViewProjInv, this._matViewProj);

        this._frustum.update(this._matViewProj, this._matViewProjInv);
    }

    public set viewport (v: Partial<INormalizedViewPort>) {
        this._viewport.x = v.x || 0;
        this._viewport.y = v.y || 0;
        this._viewport.w = v.w || 1;
        this._viewport.h = v.h || 1;
    }

    public get viewport () {
        return this._viewport;
    }

    public set fov (fov: number) {
        this._fov = fov;
    }

    public get fov (): number {
        return this._fov;
    }

    public set nearClip (nearClip: number) {
        this._nearClip = nearClip;
    }

    public get nearClip (): number {
        return this._nearClip;
    }

    public set farClip (farClip: number) {
        this._farClip = farClip;
    }

    public get farClip (): number {
        return this._farClip;
    }

    public get scene (): RenderScene {
        return this._scene;
    }

    public get name (): string {
        return this._name;
    }

    public get node (): Node {
        return this._node;
    }

    public get width (): number {
        return this._width;
    }

    public get height (): number {
        return this._height;
    }

    public get aspect (): number {
        return this._aspect;
    }

    public get matView (): mat4 {
        return this._matView;
    }

    public get matProj (): mat4 {
        return this._matProj;
    }

    public get matViewProj (): mat4 {
        return this._matViewProj;
    }

    public get matViewProjInv (): mat4 {
        return this._matViewProjInv;
    }

    public get frustum (): frustum {
        return this._frustum;
    }

    public rotate (rot: quat, ns?: NodeSpace) {
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL || space === NodeSpace.PARENT) {
            this._node.getRotation(q_a);
            this._node.setRotation(quat.multiply(q_a, q_a, rot));
        } else if (space === NodeSpace.WORLD) {
            this._node.getWorldRotation(q_a);
            this._node.setWorldRotation(quat.multiply(q_a, rot, q_a));
        }
    }

    public rotateFromAxisAngle (axis: vec3, rad: number, ns?: NodeSpace) {
        quat.fromAxisAngle(this._rotation, axis, rad);
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL || space === NodeSpace.PARENT) {
            this._node.getRotation(q_a);
            this._node.setRotation(quat.multiply(q_a, q_a, this._rotation));
        } else if (space === NodeSpace.WORLD) {
            this._node.getWorldRotation(q_a);
            this._node.setWorldRotation(quat.multiply(q_a, this._rotation, q_a));
        }
    }

    public setRotation (rot: quat, ns?: NodeSpace) {
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL || space === NodeSpace.PARENT) {
            this._node.setRotation(rot);
        } else if (space === NodeSpace.WORLD) {
            this._node.setWorldRotation(rot);
        }
    }

    public pitch (rad: number, ns?: NodeSpace) {
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL || space === NodeSpace.PARENT) {
            this._node.getRotation(this._rotation);
            quat.toAxisX(this._direction, this._rotation);
            this.rotateFromAxisAngle(this._direction, rad, ns);
        } else if (space === NodeSpace.WORLD) {
            this._node.getWorldRotation(this._rotation);
            quat.toAxisX(this._direction, this._rotation);
            this.rotateFromAxisAngle(this._direction, rad, ns);
        }
    }

    public yaw (rad: number, ns?: NodeSpace) {
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL || space === NodeSpace.PARENT) {
            this._node.getRotation(this._rotation);
            quat.toAxisY(this._direction, this._rotation);
            this.rotateFromAxisAngle(this._direction, rad, ns);
        } else if (space === NodeSpace.WORLD) {
            this._node.getWorldRotation(this._rotation);
            quat.toAxisY(this._direction, this._rotation);
            this.rotateFromAxisAngle(this._direction, rad, ns);
        }
    }

    public roll (rad: number, ns?: NodeSpace) {
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL || space === NodeSpace.PARENT) {
            this._node.getRotation(this._rotation);
            quat.toAxisZ(this._direction, this._rotation);
            this.rotateFromAxisAngle(this._direction, rad, ns);
        } else if (space === NodeSpace.WORLD) {
            this._node.getWorldRotation(this._rotation);
            quat.toAxisZ(this._direction, this._rotation);
            this.rotateFromAxisAngle(this._direction, rad, ns);
        }
    }

    public set target (target: vec3) {
        this._node.lookAt(target);
    }

    public get position (): vec3 {
        this._node.getPosition(this._position);
        return this._position;
    }

    public set position (pos: vec3) {
        this._node.setWorldPosition(pos.x, pos.y, pos.z);
    }

    public get direction (): vec3 {
        this._node.getRotation(this._rotation);
        vec3.transformQuat(this._direction, vec3.UNIT_Z, this._rotation);
        return this._direction;
    }

    public set direction (dir: vec3) {
        quat.rotationTo(this._rotation, vec3.UNIT_Z, dir);
        this._node.setRotation(this._rotation);
    }

    /**
     * transform a screen position to a world space ray
     */
    public screenPointToRay (x: number, y: number, out: ray): ray {
        out = out || ray.create();
        this.update();

        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.w * this._width;
        const ch = this._viewport.h * this._height;

        // far plane intersection
        vec3.set(v_a, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);
        vec3.transformMat4(v_a, v_a, this._matViewProjInv);

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // camera origin
            this._node.getWorldPosition(v_b);
        } else {
            // near plane intersection
            vec3.set(v_b, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);
            vec3.transformMat4(v_b, v_b, this._matViewProjInv);
        }

        return ray.fromPoints(out, v_b, v_a);
    }

    /**
     * transform a screen position to world space
     */
    public screenToWorld (out: vec3, screenPos: vec3): vec3 {
        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.w * this._width;
        const ch = this._viewport.h * this._height;

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // calculate screen pos in far clip plane
            vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                1.0,
            );

            // transform to world
            vec3.transformMat4(out, out, this._matViewProjInv);

            // lerp to depth z
            this._node.getWorldPosition(v_a);

            vec3.lerp(out, v_a, out, lerp(this._nearClip / this._farClip, 1, screenPos.z));
        } else {
            vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                screenPos.z * 2 - 1,
            );

            // transform to world
            vec3.transformMat4(out, out, this.matViewProjInv);
        }

        return out;
    }

    /**
     * transform a world space position to screen space
     */
    public worldToScreen (out: vec3, worldPos: vec3): vec3 {
        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.w * this._width;
        const ch = this._viewport.h * this._height;

        vec3.transformMat4(out, worldPos, this.matViewProjInv);
        out.x = cx + (out.x + 1) * 0.5 * cw;
        out.y = cy + (out.y + 1) * 0.5 * ch;
        out.z = out.z * 0.5 + 0.5;

        return out;
    }
}
