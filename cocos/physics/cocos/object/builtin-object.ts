/**
 * @hidden
 */

import { PhysicsSystem } from "../../framework";

export class BuiltinObject {

    public collisionFilterGroup: number = PhysicsSystem.PhysicsGroup.DEFAULT;

    public collisionFilterMask: number = -1;

    /** group */
    public getGroup (): number {
        return this.collisionFilterGroup;
    }

    public setGroup (v: number): void {
        this.collisionFilterGroup = v;
    }

    public addGroup (v: number): void {
        this.collisionFilterGroup |= v;
    }

    public removeGroup (v: number): void {
        this.collisionFilterGroup &= ~v;
    }

    /** mask */
    public getMask (): number {
        return this.collisionFilterMask;
    }

    public setMask (v: number): void {
        this.collisionFilterMask = v;
    }

    public addMask (v: number): void {
        this.collisionFilterMask |= v;
    }

    public removeMask (v: number): void {
        this.collisionFilterMask &= ~v;
    }
}
