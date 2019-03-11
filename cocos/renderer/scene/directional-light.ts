import { Quat, Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { Node } from '../../scene-graph';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();

export class DirectionalLight extends Light {

    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);
    protected _illum: number = 65000.0;

    set direction (dir: Vec3) {
        this._dir = dir;
        vec3.normalize(this._dir, this._dir);
    }

    get direction (): Vec3 {
        return this._dir;
    }

    set illuminance (illum: number) {
        this._illum = illum;
    }

    get illuminance (): number {
        return this._illum;
    }

    constructor (scene: RenderScene, name: string, node: Node) {
        super(scene, name, node);
        this._type = LightType.DIRECTIONAL;
    }

    public update () {
        if (this._node) {
            this._dir = vec3.transformQuat(_v3, _forward, this._node.getWorldRotation(_qt));
            vec3.normalize(this._dir, this._dir);
        }
    }
}
