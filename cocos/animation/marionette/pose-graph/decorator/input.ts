/* eslint-disable @typescript-eslint/ban-types */

import { error, js } from '../../../../core';
import { PropertyStashInternalFlag } from '../../../../core/data/class-stash';
import { getOrCreatePropertyStash } from '../../../../core/data/decorators/property';
import { PoseGraphNodeInputMappingOptions, globalPoseGraphNodeInputManager } from '../foundation/authoring/input-authoring';
import { PoseGraphType } from '../foundation/type-system';
import { PoseNode } from '../pose-node';
import { PureValueNode } from '../pure-value-node';

export type { PoseGraphNodeInputMappingOptions };

/**
 * @zh
 * 生成一个属性装饰器，将要装饰的属性映射为一或多项姿势图结点输入。
 * @en
 * Generates a property decorator, which maps the decorating property
 * as one or more pose graph node inputs.
 *
 * @param options @zh 结点输入映射选项。 @en Node input mapping  options.
 * @returns @zh 装饰器。 @en The decorator.
 *
 * @note
 *
 * @zh 生成的装饰器对要装饰的属性所属的类有要求：
 * - 如果结点输入选项中指定了输入类型为姿势，则所属类必须是 `PoseNode` 的子类。
 * - 否则，所属类必须是 `PoseNode` 或 `PureValueNode` 的子类。
 * 如果所属类不符合要求，此装饰器无效。
 *
 * 如果要装饰的属性 **不是** 数组属性，则该属性将映射为一项输入；
 * 否则，该属性的每个元素都将映射为一项输入。
 *
 * @en The generated has requirements on the class to which the decorating property belongs:
 * - If the node input option specifies that the input type is pose, then the belonging class should be subclass of `PoseNode`.
 * - Otherwise, the belonging class should be subclass of either `PoseNode` or `PureValueNode`.
 * The decorator takes no effect if the belonging class does not fulfill the requirements.
 *
 * If the decorating property is **NOT** an array, the property will be mapped as an input.
 * Otherwise, each element of the property will be mapped as an input.
 */
export function input (options: PoseGraphNodeInputMappingOptions): PropertyDecorator {
    return (target, propertyKey): void => {
        const targetConstructor = target.constructor;
        if (options.type === PoseGraphType.POSE) {
            if (!js.isChildClassOf(targetConstructor, PoseNode)) {
                error(`@input specifying pose input can be only applied to fields of subclasses of PoseNode.`);
                return;
            }
        }
        if (
            !js.isChildClassOf(targetConstructor, PoseNode)
            && !js.isChildClassOf(targetConstructor, PureValueNode)) {
            error(`@input can be only applied to fields of subclasses of PoseNode or PureValueNode.`);
            return;
        }
        inputUnchecked(options)(target, propertyKey);
    };
}

/**
 * Unchecked version of `@input()`.
 * @internal
 */
export function inputUnchecked (options: PoseGraphNodeInputMappingOptions): PropertyDecorator {
    return (target, propertyKey) => {
        if (typeof propertyKey !== 'string') {
            error(`@input can be only applied to string-named fields.`);
            return;
        }

        const targetConstructor = target.constructor;
        globalPoseGraphNodeInputManager.setPropertyNodeInputRecord(targetConstructor, propertyKey, options);

        const propertyStash = getOrCreatePropertyStash(target, propertyKey);
        propertyStash.__internalFlags |= (PropertyStashInternalFlag.STANDALONE | PropertyStashInternalFlag.IMPLICIT_VISIBLE);
    };
}
