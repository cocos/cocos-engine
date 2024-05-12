import { Vec3, System, color, Color } from "../../cocos/core";
import { tween, Tween, TweenSystem } from "../../cocos/tween";
import { Node, Scene } from "../../cocos/scene-graph";
import { Component } from "../../cocos/scene-graph/component";
import { Sprite } from "../../cocos/2d";
import { game, director } from "../../cocos/game";

test('remove actions by tag', function () {
    const scene = new Scene('test-tags');
    const node = new Node();
    scene.addChild(node);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    director.runSceneImmediate(scene);

    tween(node).tag(1).repeat(10, tween<Node>().by(3, { scale : new Vec3(1, 1, 1) })).start();;
    tween(node).tag(1).repeat(10, tween<Node>().by(3, { position: new Vec3(10,10,0) })).start();

    Tween.stopAllByTag(1);

    expect(TweenSystem.instance.ActionManager.getActionByTag(1, node)).toBeNull();
});

test('destroySelf', function () {
    const scene = new Scene('test-destroy');
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);
    director.runSceneImmediate(scene);

    const node = new Node();
    var comp = node.addComponent(Component);
    const onDestroy = comp.onDestroy = jest.fn(() => {});
    scene.addChild(node);
    tween(node).destroySelf().start();
    game.step();
    expect(onDestroy).toBeCalledTimes(1);
    director.unregisterSystem(sys);
});

test('sequence', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    const target = new Vec3(10, 20, 30);
    const tweenact = tween(node).to(1, {position: target}, { easing: "bounceOut" });
    tween(node).sequence(tweenact).start();

    for (let i = 0; i < 100; ++i) {
        game.step();
    }
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(Vec3.equals(prop.current, target)).toBeTruthy();
    }

    director.unregisterSystem(sys);
});

test('tween color', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    const sprite: Sprite = node.addComponent(Sprite);
    sprite.color.set(255, 255, 255, 255);

    let isComplete = false;
    const t = tween(node.getComponent(Sprite))
        .to(1, { color: color(0, 0, 0, 0) }, {
            onComplete (target?: object) {
                isComplete = true;
            },

        })
        .start();

    // Pass 1/3 time, 255 get 174 remain: 255 * (1 - 1/3 + 1/60) = 174.24 ≈ 174
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(sprite.color.equals(color(174, 174, 174, 174))).toBeTruthy();
    
    // Pass 2/3 time, 255 get 85 remain: 255 * (1 - 2/3 + 1/60) = 89.24 ≈ 89
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(sprite.color.equals(color(89, 89, 89, 89))).toBeTruthy();

    // Pass the whole time, 255 get 85 remain: 255 * (1 - 1 + 1/60) = 4.25 ≈ 4
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(sprite.color.equals(color(4, 4, 4, 4))).toBeTruthy();

    // Do the last step
    game.step();
    expect(sprite.color.equals(color(0, 0, 0, 0))).toBeTruthy();
    expect(isComplete).toBeTruthy();;

    director.unregisterSystem(sys);
});