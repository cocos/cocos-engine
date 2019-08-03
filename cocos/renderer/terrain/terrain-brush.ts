import { Material } from '../../3d/assets/material';
import { Vec3, Vec4 } from '../../core/math';
import { IDefineMap } from '../core/pass';

// TerrainBrush Interface
//
export class TerrainBrush {
    public material: Material|null = null;
    public position: Vec3 = new Vec3(0, 0, 0);
    public radius: number = 5;
    public strength: number = 1;

    public getDelta (x: number, z: number) {
        return 0;
    }

    public update (pos: Vec3) {
        this.position = pos;
    }
}

// TerrainBrushData Interface
//
export class TerrainBrushData{
    public bmin: number[] = [0, 0];
    public bmax: number[] = [0, 0];

    public width () {
        return this.bmax[0] - this.bmax[0] + 1;
    }

    public height () {
        return this.bmax[1] - this.bmax[1] + 1;
    }
}

//
export enum eTerrainCircleBrushType {
    Linear,
    Smooth,
    Spherical,
    Tip,
}

export class TerrainCircleBrush extends TerrainBrush{
    protected type: eTerrainCircleBrushType = eTerrainCircleBrushType.Linear;
    protected falloff: number = 0.5;

    constructor () {
        super();

        this._updateMaterial();
    }

    public setType (type: eTerrainCircleBrushType) {
        if (this.type !== type) {
            this.type = type;

            this._updateMaterial();
        }
    }

    public getType () {
        return this.type;
    }

    public _updateMaterial () {
        const effect = cc.EffectAsset.get('editor/terrain-circle-brush');
        if (effect != null) {
            this.material = new Material();
            this.material.initialize({
                effectAsset: effect,
                defines: this._getTypeDefine(),
            });
        }
    }

    public _getTypeDefine (): IDefineMap {
        switch (this.type) {
            case eTerrainCircleBrushType.Linear:
                return { LINEAR: 1 };
            case eTerrainCircleBrushType.Smooth:
                return { SMOOTH: 1 };
            case eTerrainCircleBrushType.Spherical:
                return { SPHERICAL: 1 };
            case eTerrainCircleBrushType.Tip:
                return { TIP: 1 };
        }

        return { LINEAR: 1 };
    }

    public _calculateFalloff_Linear (Distance: number, Radius: number, Falloff: number) {
        if (Distance <= Radius) {
            return 1.0;
        }
        if (Distance > Radius + Falloff) {
            return 0.0;
        }

        return Math.max(0.0, 1.0 - (Distance - Radius) / Falloff);
    }

    public _calculateFalloff_Spherical (Distance: number, Radius: number, Falloff: number) {
        const y = this._calculateFalloff_Linear(Distance, Radius, Falloff);

        return y * y * (3 - 2 * y);
    }

    public _calculateFalloff_Smooth (Distance: number, Radius: number, Falloff: number) {
        if (Distance <= Radius) {
            return 1.0;
        }
        if (Distance > Radius + Falloff) {
            return 0.0;
        }

        const y = (Distance - Radius) / Falloff;

        return Math.sqrt(1.0 - y * y);
    }

    public _calculateFalloff_Tip (Distance: number, Radius: number, Falloff: number) {
        if (Distance <= Radius) {
            return 1.0;
        }
        if (Distance > Radius + Falloff) {
            return 0.0;
        }

        const y = (Falloff + Radius - Distance) / Falloff;

        return 1.0 - Math.sqrt(1.0 - y * y);
    }

    public getDelta (x: number, z: number) {
        const DetlaX = x - this.position.x;
        const DeltaZ = z -  this.position.z;
        const Distance = Math.sqrt(DetlaX * DetlaX + DeltaZ * DeltaZ);
        const Radius = (1.0 - this.falloff) * this.radius;
        const Falloff =  this.falloff *  this.radius;

        let k = 0;
        switch (this.type) {
            case eTerrainCircleBrushType.Linear:
                k = this._calculateFalloff_Linear(Distance, Radius, Falloff);
                break;
            case eTerrainCircleBrushType.Smooth:
                k = this._calculateFalloff_Smooth(Distance, Radius, Falloff);
                break;
            case eTerrainCircleBrushType.Spherical:
                k = this._calculateFalloff_Spherical(Distance, Radius, Falloff);
                break;
            case eTerrainCircleBrushType.Tip:
                k = this._calculateFalloff_Tip(Distance, Radius, Falloff);
                break;
        }

        return k * this.strength;
    }

    public update (pos: Vec3) {
        super.update(pos);

        if (this.material != null) {
            const Radius = (1.0 - this.falloff) * this.radius;
            const Falloff =  this.falloff *  this.radius;

            const BrushPos = pos;
            const BrushParams = new Vec4();

            BrushParams.x = Radius;
            BrushParams.y = Falloff;

            this.material.setProperty('BrushPos', BrushPos);
            this.material.setProperty('BrushParams', BrushParams);
        }
    }
}
