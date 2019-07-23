import { Vec3, Vec4 } from "../../core";
import { max } from "../../core/vmath/bits";
import { Material } from '../../3d/assets/material';
import { IDefineMap } from '../core/pass';

// TerrainBrush Interface
//
export class TerrainBrush
{
    material: Material|null = null;
    position: Vec3 = new Vec3(0, 0, 0);
    radius: number = 5;
    strength: number = 1;

    getDelta(x: number, z: number) {
        return 0;
    }

    update(pos: Vec3) {
        this.position = pos;
    }
}

// TerrainBrushData Interface
//
export class TerrainBrushData
{
    bmin: number[] = [0, 0];
    bmax: number[] = [0, 0];

    width() {
        return this.bmax[0] - this.bmax[0] + 1;
    }
	
	height() {
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

export class TerrainCircleBrush extends TerrainBrush
{
    protected type: eTerrainCircleBrushType = eTerrainCircleBrushType.Linear;
    protected falloff: number = 0.5;

    constructor() {
        super();

        this._updateMaterial();
    }

    setType(type: eTerrainCircleBrushType) {
        if (this.type != type) {
            this.type = type;

            this._updateMaterial();
        }
    }

    getType() {
        return this.type;
    }

    _updateMaterial() {
        let effect = cc.EffectAsset.get('editor/terrain-circle-brush');
        if (effect != null) {
            this.material = new Material;
            this.material.initialize({     
                effectAsset: effect,
                defines: this._getTypeDefine()
            });
        }
    }

    _getTypeDefine(): IDefineMap {
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

    _calculateFalloff_Linear(Distance: number, Radius: number, Falloff: number) {
        if (Distance <= Radius) {
            return 1.0;
        }
        if (Distance > Radius + Falloff) {
            return 0.0;
        }

        return max(0.0, 1.0 - (Distance - Radius) / Falloff);
    };

    _calculateFalloff_Spherical(Distance: number, Radius: number, Falloff: number) {
        let y = this._calculateFalloff_Linear(Distance, Radius, Falloff);

        return y*y*(3 - 2 * y);
    };

    _calculateFalloff_Smooth(Distance: number, Radius: number, Falloff: number) {
        if (Distance <= Radius) {
            return 1.0;
        }
        if (Distance > Radius + Falloff) {
            return 0.0;
        }

        let y = (Distance - Radius) / Falloff;
        
        return Math.sqrt(1.0 - y * y);
    }

    _calculateFalloff_Tip(Distance: number, Radius: number, Falloff: number) {
        if (Distance <= Radius) {
            return 1.0;
        }
        if (Distance > Radius + Falloff) {
            return 0.0;
        }

        let y = (Falloff + Radius - Distance) / Falloff;
        
        return 1.0 - Math.sqrt(1.0 - y * y);
    }
    
    getDelta(x: number, z: number) {
        let DetlaX = x - this.position.x, DeltaZ = z -  this.position.z;
        let Distance = Math.sqrt(DetlaX * DetlaX + DeltaZ * DeltaZ);
		let Radius = (1.0 - this.falloff) * this.radius;
        let Falloff =  this.falloff *  this.radius;

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

    update(pos: Vec3) {
        super.update(pos);

        if (this.material != null) {
            let Radius = (1.0 - this.falloff) * this.radius;
            let Falloff =  this.falloff *  this.radius;

            let BrushPos = pos;
            let BrushParams = new Vec4;

            BrushParams.x = Radius;
            BrushParams.y = Falloff;

            this.material.setProperty("BrushPos", BrushPos);
            this.material.setProperty("BrushParams", BrushParams);
        }
    }
}