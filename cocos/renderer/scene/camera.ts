import { frustum } from '../../3d/geom-utils/frustum';
import { mat4, quat, vec3 } from '../../core/vmath';
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

export class Camera {

    private _scene: RenderScene;
    private _name: string;
    private _node: Node;
    private _proj: CameraProjection;
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
            this._node.rotate(rot);
        } else if (space === NodeSpace.WORLD) {
            this._node.rotateWorld(rot);
        }
    }

    public rotateFromAxisAngle (axis: vec3, rad: number, ns?: NodeSpace) {
        quat.fromAxisAngle(this._rotation, axis, rad);
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL || space === NodeSpace.PARENT) {
            this._node.rotate(this._rotation);
        } else if (space === NodeSpace.WORLD) {
            this._node.rotateWorld(this._rotation);
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

}
