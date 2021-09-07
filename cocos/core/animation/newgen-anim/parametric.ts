import { ccclass, serializable } from '../../data/decorators';
import { assertIsTrue } from '../../data/utils/asserts';
import { warn } from '../../platform/debug';

/**
 * Describes a possibly parametric property.
 * @param options
 */
export function parametric<ValueInstance, NotifyArgs extends any[]> (options: {
    notify: ParamNotify<ValueInstance, NotifyArgs>;
}): PropertyDecorator {
    return (target, propertyName) => {
        assertIsTrue(typeof propertyName === 'string');
        createBindingPoint(target, propertyName, options.notify);
    };
}

/**
 * Describes a possibly parametric numeric property.
 * @param options
 */
export function parametricNum<NotifyArgs extends any[]> (options: {
    notify: ParamNotify<number, NotifyArgs>;
    min?: number;
    max?: number;
}): PropertyDecorator {
    return (target, propertyName) => {
        assertIsTrue(typeof propertyName === 'string');
        createBindingPoint(target, propertyName, options.notify);
    };
}

/**
 * Would be called when the parametric property is changed.
 */
export type ParamNotify<T, Args extends any[]> = (value: T, ...args: Args) => unknown;

const propertyBindingPointsSymbol = Symbol('[[PropertyBindingPoints]]');

type BindingPointMap = Record<string, PropertyBindingPoint<unknown, unknown[]>>;

interface BindingPointHost {
    [propertyBindingPointsSymbol]: BindingPointMap;
}

interface PropertyBindingPoint<Value, NotifyArgs extends any[]> {
    /**
     * The notify function.
     */
    notify: ParamNotify<Value, NotifyArgs>;
}

function createBindingPoint<Value, NotifyArgs extends any[]> (object: unknown, bindingPointId: string, notify: ParamNotify<Value, NotifyArgs>) {
    const bindingPointMap = (object as Partial<BindingPointHost>)[propertyBindingPointsSymbol] ??= {};
    bindingPointMap[bindingPointId] = {
        notify: notify as ParamNotify<unknown, unknown[]>,
    };
}

const propertyBindingsSymbol = Symbol('[[PropertyBindings]]');

@ccclass('cc.animation.BindingHost')
export class BindingHost {
    @serializable
    private _bindings: Record<string, string> = {};

    get [propertyBindingsSymbol] () {
        return this._bindings;
    }

    /**
     * Binds variable onto the property binding point of this binding host.
     * @param bindingPointId The property binding point to bind.
     * @param varName The variable name.
     */
    public bindProperty (bindingPointId: string, varName: string) {
        const bindingPoint = this[propertyBindingPointsSymbol]?.[bindingPointId];
        if (!bindingPoint) {
            warn(`${bindingPointId} is not a binding point.`);
            return;
        }
        const bindingMap = this[propertyBindingsSymbol];
        bindingMap[bindingPointId] = varName;
    }

    /**
     * Unbinds property.
     * @param bindingPointId The property binding point to bind.
     */
    public unbindProperty (bindingPointId: string) {
        const bindingPoint = this[propertyBindingPointsSymbol]?.[bindingPointId];
        if (!bindingPoint) {
            return;
        }
        delete this[propertyBindingsSymbol][bindingPointId];
    }

    /**
     * Returns if specified variable has property binding.
     * @param bindingPointId The property binding point to bind.
     * @param bindingPointId
     */
    public hasPropertyBinding (bindingPointId: string) {
        return !!this[propertyBindingsSymbol][bindingPointId];
    }

    /**
     * Gets the property binding on the specified property binding point.
     * @param bindingPointId The property binding point to bind.
     * @returns The name of the bounded variable, if one exists.
     */
    public getPropertyBinding (bindingPointId: string): string {
        return this[propertyBindingsSymbol][bindingPointId];
    }
}

/**
 * Gets all property binding points on the object.
 * @param object The object.
 * @returns All property binding points. Keys are property binding point id and values are bound variable name.
 */
export function getPropertyBindingPoints (object: unknown): Record<string, PropertyBindingPoint<unknown, unknown[]>> | undefined {
    return (object as Partial<BindingPointHost>)[propertyBindingPointsSymbol];
}
