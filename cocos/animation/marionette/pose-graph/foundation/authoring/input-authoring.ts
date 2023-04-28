import { Quat, Vec3, assertIsTrue, js } from '../../../../../core';
import { PoseGraphNode, shellTag } from '../pose-graph-node';
import { PoseGraphType } from '../type-system';
import { NodeInputPath } from '../node-shell';
import { OperationOnFreestandingNodeError } from '../errors';

export type PoseGraphInputKey = NodeInputPath;

export interface PropertyNodeInputMetadata {
    displayName?: string;
}

interface ArrayPropertySyncGroup {
    members: string[];
}

export interface PoseGraphNodeInputMetadata {
    type: PoseGraphType;

    displayName?: string;

    deletable?: boolean;

    insertPoint?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor = Function;

interface PropertyNodeInputRecord {
    type: PoseGraphType;
    displayName?: string;
    getArrayElementDisplayName?(index: number): string;
    arraySyncGroup?: ArrayPropertySyncGroup;
}

export type PoseGraphNodeInputInsertId = string;

/**
 * @zh 描述一个姿势图结点类属性在映射为结点输入时的选项。
 * @en Describes the options used
 * when a pose node class property is going to be mapped as node input(s).
 */
export interface NodeInputMappingOptions {
    /**
     * @zh 此属性或属性的元素映射的输入类型。
     * 输入的类型必须和属性（的元素）的实际值类型匹配。
     *
     * @en Type of the input(s) that the property associates.
     * The input type should be matched with the actual value type of the property.
     */
    type: PoseGraphType;

    /**
     * @zh 此属性关联的输入的显示名称。
     * @en Display of the input(s) that the property associates.
     */
    displayName?: string;

    /**
     * @zh 若有定义，当该属性是数组时，此方法被用来获取数组各个元素所映射的输入的显示名称。
     * @en If specified and if the property is an array,
     * this method will be used to retrieve the display name of input mapped by each element.
     * @param index 数组元素的索引。
     */
    getArrayElementDisplayName?(index: number): string;

    /**
     * @zh 若有定义，当该属性是数组时，声明该数组属性属于指定的同步组。
     * 同步组中的任何成员在进行输入增加、移除或挪动等操作时，其它成员也将进行该操作。
     *
     * @en If specified and if the property is an array,
     * declares that the array property belongs to specified sync group.
     * When any member of the sync group is performing input add/remove/move etc. operation,
     * the other members will also perform that operation.
     *
     * @example
     * @zh
     * 对于如下结点类来说：
     *
     * ```ts
     * class Blending extends PoseNode {
     *     \@input({ type: PoseGraphType.POSE, syncGroup: 'blend-item' })
     *     poses: PoseNode[] = [];
     *
     *     \@input({ type: PoseGraphType.FLOAT, syncGroup: 'blend-item' })
     *     weights: number[] = [];
     * }
     * ```
     *
     * 当 `poses` 插入了一个新的输入后，`weights` 也会被插入一个新输入。
     *
     * @en
     * For the following node class:
     *
     * ```ts
     * class Blending extends PoseNode {
     *     \@input({ type: PoseGraphType.POSE, syncGroup: 'blend-item' })
     *     poses: PoseNode[] = [];
     *
     *     \@input({ type: PoseGraphType.FLOAT, syncGroup: 'blend-item' })
     *     weights: number[] = [];
     * }
     * ```
     *
     * If a new input is inserted into `poses`, there will be also a new input inserted into weights.
     */
    arraySyncGroup?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
class NodeInputManager {
    public setPropertyNodeInputRecord (
        constructor: Constructor,
        propertyKey: string,
        options: NodeInputMappingOptions,
    ) {
        let classInputRecord = this._classInputMap.get(constructor);
        if (!classInputRecord) {
            classInputRecord = {
                properties: {},
            };
            this._classInputMap.set(constructor, classInputRecord);
        }
        const {
            arraySyncGroup,
            ...unchanged
        } = options;

        const record: PropertyNodeInputRecord = unchanged;

        const arraySyncGroupName = options.arraySyncGroup;
        if (arraySyncGroupName) {
            if (!classInputRecord.arraySyncGroups) {
                classInputRecord.arraySyncGroups = {};
            }
            const group = classInputRecord.arraySyncGroups[arraySyncGroupName] ??= { members: [] };
            if (!group.members.includes(propertyKey)) {
                group.members.push(propertyKey);
            }
            record.arraySyncGroup = group;
        }

        classInputRecord.properties[propertyKey] = Object.freeze(record);
    }

    public getInputKeys (object: PoseGraphNode): readonly PoseGraphInputKey[] {
        const result: PoseGraphInputKey[] = [];
        const getInputKeysRecurse = (constructor: null | Constructor) => {
            if (!constructor) {
                return;
            }
            getInputKeysRecurse(js.getSuper(constructor));
            const record = this._classInputMap.get(constructor);
            if (!record) {
                return;
            }
            for (const [propertyKey] of Object.entries(record.properties)) {
                // Subclass's input mapping declaration overrides base's.
                if (result.findIndex(([subClassPropertyKey]) => propertyKey === subClassPropertyKey) >= 0) {
                    continue;
                }
                const field = object[propertyKey];
                if (Array.isArray(field)) {
                    for (let iElement = 0; iElement < field.length; ++iElement) {
                        result.push([propertyKey, iElement]);
                    }
                } else {
                    result.push([propertyKey]);
                }
            }
        };
        getInputKeysRecurse(object.constructor);
        return result;
    }

    public isPoseInput (object: PoseGraphNode, key: PoseGraphInputKey) {
        const [propertyKey] = key;
        const propertyInputRecord = this._getPropertyNodeInputRecord(object.constructor, propertyKey);
        if (!propertyInputRecord) {
            return false;
        }
        return propertyInputRecord.type === PoseGraphType.POSE;
    }

    public getInputMetadata (object: PoseGraphNode, key: PoseGraphInputKey): Readonly<PoseGraphNodeInputMetadata> | undefined {
        const [propertyKey, elementIndex = -1] = key;
        const propertyInputRecord = this._getPropertyNodeInputRecord(object.constructor, propertyKey);
        if (!propertyInputRecord) {
            return undefined;
        }
        const field = object[propertyKey];
        if (Array.isArray(field)) {
            if (elementIndex < 0 || elementIndex >= field.length) {
                return undefined;
            } else {
                const displayName = propertyInputRecord.getArrayElementDisplayName?.call(object, elementIndex)
                    ?? `${propertyInputRecord.displayName ?? propertyKey} ${elementIndex}`;
                return {
                    type: propertyInputRecord.type,
                    displayName,
                    deletable: true,
                    insertPoint: true,
                };
            }
        }
        return {
            type: propertyInputRecord.type,
            displayName: propertyInputRecord.displayName ?? propertyKey,
        };
    }

    public hasInput (object: PoseGraphNode, key: PoseGraphInputKey) {
        const [propertyKey, elementIndex = -1] = key;
        const record = this._getPropertyNodeInputRecord(object.constructor, propertyKey);
        if (!record) {
            return false;
        }
        const field = object[propertyKey];
        if (Array.isArray(field)) {
            if (elementIndex < 0 || elementIndex >= field.length) {
                return false;
            }
        }
        return true;
    }

    public getInputInsertInfos (object: PoseGraphNode): Readonly<Record<PoseGraphNodeInputInsertId, { displayName: string; }>> {
        const result: Record<PoseGraphNodeInputInsertId, { displayName: string; }> = {};
        for (let constructor = object.constructor; constructor; constructor = js.getSuper(constructor)) {
            const classInputRecord = this._classInputMap.get(constructor);
            if (!classInputRecord) {
                continue;
            }
            for (const propertyKey in classInputRecord.properties) {
                const propertyInputRecord = classInputRecord.properties[propertyKey];
                const property = object[propertyKey];
                if (Array.isArray(property)) {
                    result[propertyKey] = { displayName: propertyKey };
                }
            }
        }
        return result;
    }

    public deleteInput (node: PoseGraphNode, key: PoseGraphInputKey) {
        const [
            propertyKey,
            elementIndex = -1,
        ] = key;
        const propertyInputRecord = this._getPropertyNodeInputRecord(node.constructor, propertyKey);
        if (!propertyInputRecord) {
            return;
        }
        const property = node[propertyKey];
        if (!Array.isArray(property)) {
            return;
        }
        if (elementIndex < 0 || elementIndex >= property.length) {
            return;
        }

        // If it's an array record and belongs to a sync group,
        // Perform the deletion on all group members.
        // > Note: currently we can only insert input to array.
        // eslint-disable-next-line no-constant-condition
        if (true) {
            const { arraySyncGroup } = propertyInputRecord;
            if (arraySyncGroup) {
                this._deleteInputInArraySyncGroup(
                    node,
                    arraySyncGroup,
                    property.length,
                    elementIndex,
                );
                return;
            }
        }

        deletePoseGraphNodeArrayElement(node, key);
    }

    public insertInput (node: PoseGraphNode, insertId: PoseGraphNodeInputInsertId) {
        const propertyKey = insertId;
        const propertyInputRecord = this._getPropertyNodeInputRecord(node.constructor, propertyKey);
        if (!propertyInputRecord) {
            return;
        }
        const property = node[propertyKey];
        if (!Array.isArray(property)) {
            return;
        }

        const hint = property.length; // Always insert from back.

        // If it's an array record and belongs to a sync group,
        // Perform the insertion on all group members.
        // > Note: currently we can only insert input to array.
        // eslint-disable-next-line no-constant-condition
        if (true) {
            const { arraySyncGroup } = propertyInputRecord;
            if (arraySyncGroup) {
                this._insertInputInArraySyncGroup(
                    node,
                    arraySyncGroup,
                    property.length,
                    hint,
                );
                return;
            }
        }

        insertPoseGraphNodeArrayElement(
            node,
            [propertyKey, hint],
            createDefaultInputValueByType(propertyInputRecord.type),
        );
    }

    private _classInputMap = new WeakMap<Constructor, {
        properties: Record<PropertyKey, PropertyNodeInputRecord>;
        arraySyncGroups?: Record<string, ArrayPropertySyncGroup>;
    }>();

    private _getPropertyNodeInputRecord (constructor: null | Constructor, propertyKey: string): PropertyNodeInputRecord | undefined {
        if (!constructor) {
            return undefined;
        }
        const classInputRecord = this._classInputMap.get(constructor);
        if (classInputRecord) {
            const record = classInputRecord.properties[propertyKey];
            if (record) {
                return record;
            }
        }
        return this._getPropertyNodeInputRecord(js.getSuper(constructor), propertyKey);
    }

    private _insertInputInArraySyncGroup (
        node: PoseGraphNode,
        syncGroup: ArrayPropertySyncGroup,
        expectedOriginalSyncLength: number,
        insertHint: number,
    ) {
        for (let iGroupMember = 0; iGroupMember < syncGroup.members.length; ++iGroupMember) {
            const syncedPropertyKey = syncGroup.members[iGroupMember];
            const syncedPropertyInputRecord = this._getPropertyNodeInputRecord(node.constructor, syncedPropertyKey);
            assertIsTrue(syncedPropertyInputRecord);
            const syncedProperty = node[syncedPropertyKey];
            if (!Array.isArray(syncedProperty) || syncedProperty.length !== expectedOriginalSyncLength) {
                // The property is declared with a "syncWith",
                // but the sync target property is not an array or does not have a matched length.
                // To avoid un-expectations, interrupt.
                continue;
            }
            insertPoseGraphNodeArrayElement(
                node,
                [syncedPropertyKey, insertHint],
                createDefaultInputValueByType(syncedPropertyInputRecord.type),
            );
        }
    }

    private _deleteInputInArraySyncGroup (
        node: PoseGraphNode,
        syncGroup: ArrayPropertySyncGroup,
        expectedOriginalSyncLength: number,
        index: number,
    ) {
        for (let iGroupMember = 0; iGroupMember < syncGroup.members.length; ++iGroupMember) {
            const syncedPropertyKey = syncGroup.members[iGroupMember];
            const syncedPropertyInputRecord = this._getPropertyNodeInputRecord(node.constructor, syncedPropertyKey);
            assertIsTrue(syncedPropertyInputRecord);
            const syncedProperty = node[syncedPropertyKey];
            if (!Array.isArray(syncedProperty) || syncedProperty.length !== expectedOriginalSyncLength) {
                // The property is declared with a "syncWith",
                // but the sync target property is not an array or does not have a matched length.
                // To avoid un-expectations, interrupt.
                continue;
            }
            deletePoseGraphNodeArrayElement(node, [syncedPropertyKey, index]);
        }
    }
}

function insertPoseGraphNodeArrayElement (node: PoseGraphNode, inputKey: PoseGraphInputKey, value: unknown) {
    const shell = node[shellTag];
    if (!shell) {
        throw new OperationOnFreestandingNodeError(node);
    }

    const [
        propertyKey,
        elementIndex = -1,
    ] = inputKey;
    const property = node[propertyKey];
    if (!Array.isArray(property)) {
        return;
    }

    // Insert the element itself.
    property.splice(elementIndex, 0, value);

    // Update bindings for following elements.
    shell.moveArrayElementBindingForward(propertyKey, elementIndex + 1, false);
}

function deletePoseGraphNodeArrayElement (node: PoseGraphNode, inputKey: PoseGraphInputKey) {
    const shell = node[shellTag];
    if (!shell) {
        throw new OperationOnFreestandingNodeError(node);
    }

    const [
        propertyKey,
        elementIndex = -1,
    ] = inputKey;
    const property = node[propertyKey];
    if (!Array.isArray(property)) {
        return;
    }
    if (elementIndex < 0 || elementIndex >= property.length) {
        return;
    }

    // Delete the binding.
    shell.deleteBinding(inputKey);

    // Delete the element itself.
    property.splice(elementIndex, 1);

    // Update bindings for following elements.
    shell.moveArrayElementBindingForward(propertyKey, elementIndex + 1, true);
}

function createDefaultInputValueByType (type: PoseGraphType) {
    switch (type) {
    default:
        assertIsTrue(false);
        // fallthrough
    case PoseGraphType.FLOAT:
    case PoseGraphType.INTEGER:
        return 0;
    case PoseGraphType.POSE:
        return null;
    case PoseGraphType.VEC3:
        return new Vec3();
    case PoseGraphType.QUAT:
        return new Quat();
    }
}

export const globalNodeInputManager = new NodeInputManager();
