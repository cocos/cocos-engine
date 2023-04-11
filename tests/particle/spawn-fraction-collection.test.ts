import { SpawnFractionCollection } from '../../cocos/particle/spawn-fraction-collection';

test('Base', () => {
    const collection = new SpawnFractionCollection();
    expect(collection.capacity).toBe(16);
    expect(collection.count).toBe(0);
    expect(collection.fraction.length).toBe(collection.capacity);
    expect(collection.id.length).toBe(collection.capacity);
    collection.reserve(5);
    expect(collection.capacity).toBe(16);
    expect(collection.count).toBe(0);
    expect(collection.fraction.length).toBe(collection.capacity);
    expect(collection.id.length).toBe(collection.capacity);
    
    collection.reserve(32);
    expect(collection.capacity).toBe(32);
    expect(collection.count).toBe(0);
    expect(collection.fraction.length).toBe(collection.capacity);
    expect(collection.id.length).toBe(collection.capacity);
})

test('Sync', () => {
    const collection = new SpawnFractionCollection();
    const id = new Uint32Array(200);
    const fraction = new Uint32Array(200);
    for (let i = 0; i < 200;  i++) {
        id[i] = 200 - i;
        fraction[i] = 200 - i;
    }
    collection.reserve(200);
    collection.sync(id, 100);
    expect(collection.count).toBe(100);
    for (let i = 0; i < 100; i++) {
        expect(collection.id[i]).toBe(200 - i);
        expect(collection.fraction[i]).toBe(0);
        collection.fraction[i] = fraction[i];
    }
    
    id[0] = id[157];
    fraction[0] = 0;
    id[7] = id[25];
    fraction[7] = fraction[25];
    id[25] = id[111];
    fraction[25] = 0;
    id[33] = id[89];
    fraction[33] = fraction[89];
    id[89] = id[138];
    fraction[89] = 0;
    id[77] = id[91];
    fraction[77] = fraction[91];
    id[91] = id[154];
    fraction[91] = 0;
    id[41] = id[81];
    fraction[41] = fraction[81];
    id[81] = id[120];
    fraction[81] = 0;
    id[95] = id[192];
    fraction[95] = 0;
    collection.reserve(200);
    collection.sync(id, 96);
    expect(collection.count).toBe(96);
    for (let i = 0; i < 96; i++) {
        expect(collection.id[i]).toBe(id[i]);
        expect(collection.fraction[i]).toBe(fraction[i]);
    }

    id[3] = id[9];
    fraction[3] = fraction[9];
    id[9] = id[21];
    fraction[9] = fraction[21];
    id[21] = id[77];
    fraction[21] = fraction[77];
    id[77] = id[91];
    fraction[77] = fraction[91];
    id[91] = id[128];
    fraction[91] = 0;
    id[65] = id[67];
    fraction[65] = fraction[67];
    id[67] = id[98];
    fraction[67] = 0;
    id[45] = id[88];
    fraction[45] = fraction[88];
    id[88] = id[145];
    fraction[88] = 0;
    for (let i = 96; i < 200; i++) {
        id[i] = 200 + i;
        fraction[i] = 0;
    }
    collection.sync(id, 200);
    expect(collection.count).toBe(200);
    for (let i = 0; i < 200; i++) {
        expect(collection.id[i]).toBe(id[i]);
        expect(collection.fraction[i]).toBe(fraction[i]);
    }
});