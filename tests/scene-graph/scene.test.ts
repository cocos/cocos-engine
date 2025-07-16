import { deserialize } from "../../cocos/serialization";
import '../utils/matchers/value-type-asymmetric-matchers';
import { v3 } from "../../cocos/core";
import { Scene } from "../../cocos/scene-graph";

test(`Bugfix cocos/cocos-engine#16352: deserialized scene should have node transforms invalidated`, () => {
    const archive = [{
        __type__: 'cc.Scene',
        _children: [{
            __type__: 'cc.Node',
            _name: 'Node',
            _lscale: {
                __type__: 'cc.Vec3',
                x: 2,
                y: 1,
                z: 1,
            },
        }],
    }];

    const scene = deserialize(archive) as Scene;

    const node = scene.getChildByPath('Node')!;
    expect(node).not.toBeNull();
    expect(node.worldScale).toBeCloseToVec3(v3(2, 1, 1));
});