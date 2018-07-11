// JavaScript:

var WrapMode = cc.Enum({
    Repeat: -1,
    Clamp: -1
});

// Texture.WrapMode.Repeat == 0
// Texture.WrapMode.Clamp == 1
// Texture.WrapMode[0] == "Repeat"
// Texture.WrapMode[1] == "Clamp"

var FlagType = cc.Enum({
    Flag1: 1,
    Flag2: 2,
    Flag3: 4,
    Flag4: 8,
});

var AtlasSizeList = cc.Enum({
    128: 128,
    256: 256,
    512: 512,
    1024: 1024,
});

// TypeScript:

// If used in TypeScript, just define a TypeScript enum:
enum Direction {
    Up,
    Down,
    Left,
    Right
}

// If you need to inspect the enum in Properties panel, you can call cc.Enum:
const {ccclass, property} = cc._decorator;

@ccclass
class NewScript extends cc.Component {
    @property({
        type: cc.Enum(Direction)    // call cc.Enum
    })
    direction: Direction = Direction.Up;
}
