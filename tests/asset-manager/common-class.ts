import { Asset } from "../../cocos/core/assets/asset"
import { Component } from "../../cocos/core/components";
import { serializable, type } from "../../cocos/core/data/decorators";
import { ccclass } from "../../cocos/core/data/decorators/ccclass";
import { Vec2 } from "../../cocos/core/math";


@ccclass('TestTexture')
class TestTexture extends Asset{
    @serializable
    public width = 0;
    @serializable
    public height = 0;
}
@ccclass('TestSprite')
export class TestSprite extends Asset {
    @serializable
    public pivot = new Vec2(0.5, 0.5);
    @serializable
    public x = 0;
    @serializable
    public y = 0;
    @serializable
    public width = 0;
    @serializable
    public height = 0;
    @type(TestTexture)
    public texture = null;
    @serializable
    public rotated = false;
    @serializable
    public trimLeft = 0;
    @serializable
    public trimTop = 0;
    @serializable
    public rawWidth = 0;
    @serializable
    public rawHeight = 0;
    //pixelLevelHitTest: false,
    //alphaThreshold: 25,
    @serializable
    public insetTop = 0;
    @serializable
    public insetBottom = 0;
    @serializable
    public insetLeft = 0;
    @serializable
    public insetRight = 0;
    get rotatedWidth () {
        return this.rotated ? this.height : this.width;
    }
    get rotatedHeight () {
        return this.rotated ? this.width : this.height;
    }
}

@ccclass('TestScript')
class TestScript extends Component {
    @type(Node)
    target = null;
    @type(Node)
    target2 = null;
}

@ccclass('TestDependency')
class TestDependency extends Asset {
    @serializable
    dependency = null;
}