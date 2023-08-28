import { Vec3, System, Color, Quat, Rect, Size, Vec2, Vec4 } from "../../cocos/core";
import { tween, Tween, TweenAction, TweenSystem } from "../../cocos/tween";
import { Node, Scene } from "../../cocos/scene-graph";
import { Component } from "../../cocos/scene-graph/component";
import { game, director } from "../../cocos/game";
import { CSMShadowLayer } from "../../cocos/rendering/shadow/csm-layers";
import { Shadows } from "../../cocos/render-scene/scene";
import { CameraComponent } from "../../cocos/misc";

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

test('type color', function () {
    const shadow = new Shadows();
    const tweenact = tween(shadow).to(1, {shadowColor: Color.TRANSPARENT});
    tweenact.start();
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(prop.current instanceof Color).toBeTruthy();
    }
});

test('type quat', function () {
    const node = new Node();
    const tweenact = tween(node).to(1, {rotation: new Quat(1, 1, 1, 1)});
    tweenact.start();
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(prop.current instanceof Quat).toBeTruthy();
    }
});

test('type rect', function () {
    const camera = new CameraComponent();
    const tweenact = tween(camera).to(1, {rect: new Rect(1, 1, 10, 20)});
    tweenact.start();
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(prop.current instanceof Rect).toBeTruthy();
    }   
});

test('type size', function () {
    const rect = new Rect();
    const tweenact = tween(rect).to(1, {size: new Size(800, 600)});
    tweenact.start();
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(prop.current instanceof Size).toBeTruthy();
    }   
});

test('type vec2', function () {
    const rect = new Rect();
    const tweenact = tween(rect).to(1, {origin: new Vec2(20, 10)});
    tweenact.start();
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(prop.current instanceof Vec2).toBeTruthy();
    }   
});

test('type vec3', function () {
    const node = new Node();
    const tweenact = tween(node).to(1, {position: new Vec3(10, 20, 30)});
    tweenact.start();
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(prop.current instanceof Vec3).toBeTruthy();
    }   
});

test('type vec4', function () {
    const shadowLayer = new CSMShadowLayer(4);
    const tweenact = tween(shadowLayer).to(1, {csmAtlas: new Vec4(10, 20, 30, 40)});
    tweenact.start();
    // @ts-expect-error access private property 
    const action = tweenact._actions[0] as TweenAction;
    // @ts-expect-error access private property 
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(prop.current instanceof Vec4).toBeTruthy();
    }   
});