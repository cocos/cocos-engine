<<<<<<< HEAD
/**
 * @hidden
 */

=======
>>>>>>> Daily merge (#4693)
export class BuiltinObject {

    public collisionFilterGroup: number = 1 << 0;

    public collisionFilterMask: number = 1 << 0;

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
