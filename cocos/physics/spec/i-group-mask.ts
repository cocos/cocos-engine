/**
 * @hidden
 */

export interface IGroupMask {
    setGroup (v: number): void;
    getGroup (): number;
    addGroup (v: number): void;
    removeGroup (v: number): void;
    setMask (v: number): void;
    getMask (): number;
    addMask (v: number): void;
    removeMask (v: number): void;
}