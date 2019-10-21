import { StorageUnit, ElementType, combineStorageUnitElementType, extractStorageUnitElementType } from '../../cocos/core/data/utils/compact-value-type-array';

test('Combine storage unit & element type', () => {
    const storageUnits = Object.values(StorageUnit).filter((e) => typeof e === 'number') as StorageUnit[];
    const elementTypes = Object.values(ElementType).filter((e) => typeof e === 'number') as ElementType[];
    for (const storageUnit of storageUnits) {
        for (const elementType of elementTypes) {
            const combined = combineStorageUnitElementType(storageUnit, elementType);
            const extracted = extractStorageUnitElementType(combined);
            expect(extracted.storageUnit === storageUnit && extracted.elementType === elementType).toBe(true);
        }
    }
}); 