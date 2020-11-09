import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { SimplexCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ISimplexShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoSimplexShape extends AmmoShape implements ISimplexShape {

    setShapeType (v: SimplexCollider.ESimplexType) {
        if (this._isBinding) {
            //TODO: 
        }
    }

    setVertices (v: IVec3Like[]) {
        //TODO: Fix
        const length = this.VERTICES.length;
        for (let i = 0; i < length; i++) {
            cocos2AmmoVec3(this.VERTICES[i], v[i]);
        }
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

    get impl () {
        return this._btShape as Ammo.btBU_Simplex1to4;
    }

    get collider () {
        return this._collider as SimplexCollider;
    }

    readonly VERTICES: Ammo.btVector3[] = [];

    constructor () {
        super(AmmoBroadphaseNativeTypes.TETRAHEDRAL_SHAPE_PROXYTYPE);
    }

    protected onComponentSet () {
        this._btShape = new Ammo.btBU_Simplex1to4();
        const length = this.collider.shapeType;
        const vertices = this.collider.vertices;
        for (let i = 0; i < length; i++) {
            this.VERTICES[i] = new Ammo.btVector3();
            cocos2AmmoVec3(this.VERTICES[i], vertices[i]);
            this.impl.addVertex(this.VERTICES[i]);
        }
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
    }

    onLoad () {
        super.onLoad();
        this.collider.updateVertices();
    }

    onDestroy () {
        const length = this.VERTICES.length;
        for (let i = 0; i < length; i++) {
            Ammo.destroy(this.VERTICES[i]);
        }
        (this.VERTICES as any) = null;
        super.onDestroy();
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

}
