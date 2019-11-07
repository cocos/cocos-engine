import { AmmoShape } from './shapes/ammo-shape';
import { IAmmoBodyStruct, IAmmoGhostStruct } from './ammo-interface';

export class AmmoInstance {
    static readonly shapes: AmmoShape[] = [];
    static readonly bodyAndGhosts: IAmmoBodyStruct[] | IAmmoGhostStruct[] = [];
    static get bodyStructs () {
        return this.bodyAndGhosts as IAmmoBodyStruct[];
    }
    static get ghostStructs () {
        return this.bodyAndGhosts as IAmmoGhostStruct[];
    }
}