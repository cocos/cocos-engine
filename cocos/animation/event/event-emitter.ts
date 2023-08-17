import { Node } from '../../scene-graph';

/**
 * Invokes methods with specified `methodName` on each component of `node`,
 * the methods were registered binding to some animation related events(animation clip frame event or animation graph event).
 *
 * @param node The node to search components with.
 * @param methodName The method name to invoke.
 * @param args The arguments passed to the method.
 */
export function invokeComponentMethodsEngagedInAnimationEvent (node: Node, methodName: string, args: unknown[]): void {
    const components = node.components;
    const nComponents = components.length;
    for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
        const component = components[iComponent];
        const fx = component[methodName];
        if (typeof fx === 'function') {
            fx.apply(component, args);
        }
    }
}
