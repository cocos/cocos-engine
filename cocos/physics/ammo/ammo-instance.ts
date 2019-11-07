import { IAmmoBodyStruct, IAmmoGhostStruct } from './ammo-interface';

export class AmmoInstance {
    static readonly bodyAndGhosts: {
        [x: string]: IAmmoBodyStruct | IAmmoGhostStruct
    } = {};

    static get bodyStructs () {
        return this.bodyAndGhosts as { [x: string]: IAmmoBodyStruct };
    }

    static get ghostStructs () {
        return this.bodyAndGhosts as { [x: string]: IAmmoGhostStruct };
    }
}