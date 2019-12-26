/**
 * @hidden
 */

import { ccclass, property, string } from '../data/class-decorator';
import { Node } from '../scene-graph/node';

export type PropertyPath = string | number;

export interface CustomTargetPath {
    get(target: any): any;
}

export type TargetPath = PropertyPath | CustomTargetPath;

export function isPropertyPath (path: TargetPath): path is PropertyPath {
    return typeof path === 'string' || typeof path === 'number';
}

export function isCustomPath<T extends CustomTargetPath> (path: TargetPath, constructor: Constructor<T>): path is T {
    return path instanceof constructor;
}

@ccclass('cc.animation.HierarchyPath')
export class HierarchyPath implements CustomTargetPath {
    @property
    public path: string = '';

    constructor (path?: string) {
        this.path = path || '';
    }

    public get(target: Node) {
        if (!(target instanceof Node)) {
            /* cspell: disable-next-line */
            throw new Error(`Target of hierachy path shall be Node.`);
        }
        const result = target.getChildByPath(this.path);
        if (!result) {
            throw new Error(`Node "${target.name}" has no path "${this.path}"`);
        }
        return result;
    }
}

@ccclass('cc.animation.ComponentPath')
export class ComponentPath implements CustomTargetPath {
    @property
    public component: string = '';

    constructor (component?: string) {
        this.component = component || '';
    }

    public get (target: Node) {
        if (!(target instanceof Node)) {
            throw new Error(`Target of component path shall be Node.`);
        }
        const result = target.getComponent(this.component);
        if (!result) {
            throw new Error(`Node "${target.name}" has no component "${this.component}"`);
        }
        return result;
    }
}
