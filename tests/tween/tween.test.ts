import { Vec3, System } from "../../cocos/core";
import { tween, Tween, TweenSystem } from "../../cocos/tween";
import { Node, Scene } from "../../cocos/scene-graph";
import { Component } from "../../cocos/scene-graph/component";
import { game, director } from "../../cocos/game";

test('Start pause and resume a tween action', function () {
    const scene = new Scene('test-play');
    const node = new Node();
    scene.addChild(node);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);
    director.runSceneImmediate(scene);

    let action = tween(node).to(4, { scale : new Vec3(5, 5, 5) }).start();
    director.tick(0);
    director.tick(1);
    expect(node.scale.equals3f(2, 2, 2)).toBeTruthy();
    
    action.pause();
    director.tick(2);
    expect(node.scale.equals3f(2, 2, 2)).toBeTruthy();
    action.resume();
    director.tick(1);
    expect(node.scale.equals3f(3, 3, 3)).toBeTruthy();

    action.timeScale = 0.5;
    director.tick(1);
    expect(node.scale.equals3f(3.5, 3.5, 3.5)).toBeTruthy();
    action.stop();
    director.tick(2);
    expect(node.scale.equals3f(3.5, 3.5, 3.5)).toBeTruthy();
});

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