module('utils');

test('enum', function () {
    var TestEnum = cc.Enum({
        Width: 1,
        Name: 20,
        UseBest: 0,
        Height: 10,
        Area: 15,
    });

    strictEqual(cc.Enum.isEnum({}), false, '{} is not enum type');
    strictEqual(cc.Enum.isEnum(TestEnum), true, 'TestEnum is enum ');

    deepEqual ( cc.Enum.getList(TestEnum),
               [
                   { name: "UseBest", value: 0 },
                   { name: "Width", value: 1 },
                   { name: "Height", value: 10 },
                   { name: "Area", value: 15 },
                   { name: "Name", value: 20 },
               ],
               "The value must be same" );

    deepEqual ( cc.Enum.getList(cc.Enum({
            '128': 128,
            256: 256,
            512: 512,
            1024: 1024,
            2048: 2048,
            4096: 4096,
        })),
        [
            { name: '128', value: 128 },
            { name: '256', value: 256 },
            { name: '512', value: 512 },
            { name: '1024', value: 1024 },
            { name: '2048', value: 2048 },
            { name: '4096', value: 4096 },
        ],
        "Can define enum name as index value" );
});
