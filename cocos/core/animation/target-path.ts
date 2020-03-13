/**
 * @hidden
 */

import { ccclass, property } from '../data/class-decorator';
import { Node } from '../scene-graph/node';
import { error } from '../platform/debug';

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
            error(`Target of hierarchy path shall be Node.`);
            return null;
        }
        const result = target.getChildByPath(this.path);
        if (!result) {
            error(`Node "${target.name}" has no path "${this.path}"`);
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
            error(`Target of component path shall be Node.`);
            return null;
        }
        const result = target.getComponent(this.component);
        if (!result) {
            error(`Node "${target.name}" has no component "${this.component}"`);
            return null;
        }
        return result;
    }
}

/**
 * Evaluate a path from specified root.
 * @param root The root object.
 * @param path The path.
 */
export function evaluatePath(root: any, ...path: TargetPath[]) {
    let result = root;
    for (const segment of path) {
        if (isPropertyPath(segment)) {
            if (!(segment in result)) {
                error(`Target object has no property "${segment}"`);
                return null;
            } else {
                result = result[segment];
            }
        } else {
            result = segment.get(result);
        }
        if (result === null) {
            break;
        }
    }
    return result;
}