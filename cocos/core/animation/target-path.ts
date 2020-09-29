/**
 * @hidden
 */

import { ccclass, property } from '../data/class-decorator';
import { Node } from '../scene-graph/node';
import { warn } from '../platform/debug';

export type PropertyPath = string | number;

export interface ICustomTargetPath {
    /**
     * If errors are encountered, `null` should be returned.
     * @param target
     */
    get(target: any): any;
}

export type TargetPath = PropertyPath | ICustomTargetPath;

export function isPropertyPath (path: TargetPath): path is PropertyPath {
    return typeof path === 'string' || typeof path === 'number';
}

export function isCustomPath<T extends ICustomTargetPath> (path: TargetPath, constructor: Constructor<T>): path is T {
    return path instanceof constructor;
}

@ccclass('cc.animation.HierarchyPath')
export class HierarchyPath implements ICustomTargetPath {
    @property
    public path: string = '';

    constructor (path?: string) {
        this.path = path || '';
    }

    public get (target: Node) {
        if (!(target instanceof Node)) {
            warn(`Target of hierarchy path should be of type Node.`);
            return null;
        }
        const result = target.getChildByPath(this.path);
        if (!result) {
            warn(`Node "${target.name}" has no path "${this.path}"`);
            return null;
        }
        return result;
    }
}

@ccclass('cc.animation.ComponentPath')
export class ComponentPath implements ICustomTargetPath {
    @property
    public component: string = '';

    constructor (component?: string) {
        this.component = component || '';
    }

    public get (target: Node) {
        if (!(target instanceof Node)) {
            warn(`Target of component path should be of type Node.`);
            return null;
        }
        const result = target.getComponent(this.component);
        if (!result) {
            warn(`Node "${target.name}" has no component "${this.component}"`);
            return null;
        }
        return result;
    }
}

/**
 * Evaluate a sequence of paths, in order, from specified root.
 * @param root The root object.
 * @param path The path sequence.
 */
export function evaluatePath (root: any, ...paths: TargetPath[]) {
    let result = root;
    for (let iPath = 0; iPath < paths.length; ++iPath) {
        const path = paths[iPath];
        if (isPropertyPath(path)) {
            if (!(path in result)) {
                warn(`Target object has no property "${path}"`);
                return null;
            } else {
                result = result[path];
            }
        } else {
            result = path.get(result);
        }
        if (result === null) {
            break;
        }
    }
    return result;
}
