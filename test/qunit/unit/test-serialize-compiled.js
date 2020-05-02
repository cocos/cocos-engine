if (TestEditorExtends) {
    largeModule('Serialize Compiled');

    let {
        TraceableDict,
        Builder,
    } = cc._Test.serialize;

    test('TraceableDict and TraceableItem', function () {
        let sharedObjs = new TraceableDict();
        let tracer1 = [NaN, NaN, NaN];
        let tracer2 = { obj1: NaN, obj2: NaN, number: NaN };
        let obj = {};

        sharedObjs.trace('string', tracer1, 0).result = 'string';
        let item = sharedObjs.trace(obj, tracer1, 1);
        item.result = JSON.stringify(obj);
        // {
        //     ok(!item.isSerialized, 'first time added object should be non-serialized');
        //     item.result = undefined;
        //     ok(item.isSerialized, 'object should be serialized after specifying result even if it is undefined');
        //     item.result = JSON.stringify(obj);
        // }
        sharedObjs.trace(2, tracer1, 2).result = 2;
        sharedObjs.trace(obj, tracer2, 'obj1');
        sharedObjs.trace(obj, tracer2, 'obj2');
        sharedObjs.trace(2, tracer2, 'number');

        let result = sharedObjs.dump();
        deepEqual(result, [JSON.stringify(obj), 2, 'string'], 'dump should get item array');
        deepEqual(tracer1, [2, 0, 1], 'dump sequence should sort by reference count');
        deepEqual(tracer2, { obj1: 0, obj2: 0, number: 1 }, 'should support object');
    });

    // test('RefsBuilder', function () {
    //     let indexObj2 = {};
    //     let array = [indexObj2, null];
    //     let indexObj1 = { ref1: indexObj2, ref2: array, ref3: null };
    //     array[1] = indexObj1;
    //     indexObj1.ref3 = indexObj1;
    //
    //     let ctx = new Builder();
    //     ctx.instances.setRoot(indexObj1);
    //     ctx.instances.get(indexObj1).result = indexObj1;
    //     ctx.refsBuilder.refByIndexed(indexObj1, 'ref1', indexObj2);
    //     ctx.instances.get(indexObj2).result = indexObj2;
    //     let arrayRefIndex0 = ~ctx.refsBuilder.refByInner(0, indexObj2) * 3;
    //     let arrayRefIndex1 = ~ctx.refsBuilder.refByInner(1, indexObj1) * 3;
    //     ctx.refsBuilder.refByIndexed(indexObj1, 'ref3', indexObj1);
    //
    //     let instances = ctx.instances.dump();
    //     let strings = ctx.sharedStrings.dump();
    //
    //     let refs = ctx.refsBuilder.build();
    //     strictEqual(refs[refs.length - 1], 2, 'offset should be 2');
    //     deepEqual(strings, ['ref1', 'ref3'], 'should export property names correctly');
    //
    //     strictEqual(refs[arrayRefIndex0 + 1], ~0, 'for array[0]');
    //     strictEqual(instances[refs[arrayRefIndex0 + 2]], indexObj2, 'array[0] === indexObj2');
    //
    //     strictEqual(refs[arrayRefIndex1 + 1], ~1, 'for array[1]');
    //     strictEqual(instances[refs[arrayRefIndex1 + 2]], indexObj1, 'array[1] === indexObj1');
    //
    //     let dereference = cc._Test.deserialize.dereference;
    //     indexObj1.ref1 = null;
    //     indexObj1.ref3 = null;
    //     array[0] = null;
    //     array[1] = null;
    //     refs[arrayRefIndex0] = array;
    //     refs[arrayRefIndex1] = array;
    //     dereference(refs, instances, strings);
    //     strictEqual(indexObj1.ref1, indexObj2, 'dereferenced property correctly 1');
    //     strictEqual(indexObj1.ref3, indexObj1, 'dereferenced property correctly 2');
    //     strictEqual(array[0], indexObj2, 'dereferenced array correctly 1');
    //     strictEqual(array[1], indexObj1, 'dereferenced array correctly 2');
    // });
}
