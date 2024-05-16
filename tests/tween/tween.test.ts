import { Vec3, System, size, Size, approx } from "../../cocos/core";
import { tween, Tween, TweenSystem } from "../../cocos/tween";
import { Node, Scene } from "../../cocos/scene-graph";
import { Component } from "../../cocos/scene-graph/component";
import { game, director } from "../../cocos/game";
import { UITransform } from "../../cocos/2d/framework/ui-transform";
import { Canvas } from "../../cocos/2d/framework/canvas";
import { Batcher2D } from "../../cocos/2d/renderer/batcher-2d";
import { UIOpacity } from "../../cocos/2d";

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

test('different targets in parallel', function () {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const scene = new Scene('test');
    director.runSceneImmediate(scene);

    let canvasNode = new Node("Canvas");
    scene.addChild(canvasNode);
    let canvas = canvasNode.addComponent(Canvas) as Canvas;
    let uitrs = canvasNode.addComponent(UITransform) as UITransform;
    uitrs.contentSize = new Size(100, 100);

    const node = new Node();
    let spUitrs = node.addComponent(UITransform) as UITransform;
    spUitrs.contentSize = new Size(0, 0);
    scene.addChild(node);

    let isPositionTweenComplete = false;
    let isContentSizeTweenComplete = false;

    // test begin
    tween(node)
        .parallel(
            tween(node).to(1, { position: new Vec3(100, 100, 0) }, {
                onComplete: () => {
                    isPositionTweenComplete = true;
                }
            }).call((target) => {
                expect(target === node).toBeTruthy();
            }),
            tween(node.getComponent(UITransform) as UITransform).to(1, { contentSize: size(100, 100) }, {
                onComplete: () => {
                    isContentSizeTweenComplete = true;
                }
            }).call((target) => {
                expect(target === spUitrs).toBeTruthy();
            }),
        )
        .start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();

    // complete
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();

    expect(isPositionTweenComplete).toBeTruthy();;
    expect(isContentSizeTweenComplete).toBeTruthy();;

    // test end
    director.unregisterSystem(sys);
});

test('Test different target in sequence', function() {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const scene = new Scene('test');
    director.runSceneImmediate(scene);

    let canvasNode = new Node("Canvas");
    scene.addChild(canvasNode);
    let canvas = canvasNode.addComponent(Canvas) as Canvas;
    let uitrs = canvasNode.addComponent(UITransform) as UITransform;
    uitrs.contentSize = new Size(100, 100);

    const node = new Node();
    let spUitrs = node.addComponent(UITransform) as UITransform;
    spUitrs.contentSize = new Size(0, 0);
    scene.addChild(node);

    let isPositionTweenComplete = false;
    let isContentSizeTweenComplete = false;

    // test begin
    tween(node)
    .sequence(
        tween(node).to(1, { position: new Vec3(100, 100, 0) }, {
            onComplete: () => {
                isPositionTweenComplete = true;
            }
        }).call((target) => {
            expect(target === node).toBeTruthy();
        }),
        tween(node.getComponent(UITransform) as UITransform).to(1, { contentSize: size(100, 100) }, {
            onComplete: () => {
                isContentSizeTweenComplete = true;
            }
        }).call((target) => {
            expect(target === spUitrs).toBeTruthy();
        }),
    ).call((target) => {
        expect(target).toEqual(node);
    })
    .start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));
    expect(isPositionTweenComplete).toBeTruthy();
    expect(isContentSizeTweenComplete).toBeFalsy();

    // Do content size tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(1.0/3.0*100, 1.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(2.0/3.0*100, 2.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(spUitrs.contentSize.equals(new Size(100, 100)));
    
    game.step();
    expect(isContentSizeTweenComplete).toBeTruthy();

    // test end
    director.unregisterSystem(sys);
});

test('Test different target in then', function() {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const scene = new Scene('test');
    director.runSceneImmediate(scene);

    let canvasNode = new Node("Canvas");
    scene.addChild(canvasNode);
    let canvas = canvasNode.addComponent(Canvas) as Canvas;
    let uitrs = canvasNode.addComponent(UITransform) as UITransform;
    uitrs.contentSize = new Size(100, 100);

    const node = new Node();
    let spUitrs = node.addComponent(UITransform) as UITransform;
    spUitrs.contentSize = new Size(0, 0);
    scene.addChild(node);

    let isPositionTweenComplete = false;
    let isContentSizeTweenComplete = false;

    // test begin
    tween(node).to(1, { position: new Vec3(100, 100, 0) }, {
        onComplete: () => {
            isPositionTweenComplete = true;
        }
    }).call((target) => {
        expect(target === node).toBeTruthy();
    }).then(
        tween(node.getComponent(UITransform) as UITransform).to(1, { contentSize: size(100, 100) }, {
            onComplete: () => {
                isContentSizeTweenComplete = true;
            }
        }).call((target) => {
            expect(target === spUitrs).toBeTruthy();
        })
    ).start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));
    expect(isPositionTweenComplete).toBeTruthy();
    expect(isContentSizeTweenComplete).toBeFalsy();

    // Do content size tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(1.0/3.0*100, 1.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(2.0/3.0*100, 2.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(spUitrs.contentSize.equals(new Size(100, 100)));
    
    game.step();
    expect(isContentSizeTweenComplete).toBeTruthy();

    // test end
    director.unregisterSystem(sys);
});

test('Test different target in clone/then', function() {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const scene = new Scene('test');
    director.runSceneImmediate(scene);

    let canvasNode = new Node("Canvas");
    scene.addChild(canvasNode);
    let canvas = canvasNode.addComponent(Canvas) as Canvas;
    let uitrs = canvasNode.addComponent(UITransform) as UITransform;
    uitrs.contentSize = new Size(100, 100);

    const node = new Node();
    let spUitrs = node.addComponent(UITransform) as UITransform;
    spUitrs.contentSize = new Size(0, 0);
    scene.addChild(node);

    let isPositionTweenComplete = false;
    let isContentSizeTweenComplete1 = false;
    let isContentSizeTweenComplete2 = false;

    const uiTransformTween1 = tween().to(1, { contentSize: size(100, 100) }, {
        onComplete: () => {
            isContentSizeTweenComplete1 = true;
        }
    }).call((target) => {
        expect(target === spUitrs).toBeTruthy();
    })

    const uiTransformTween2 = tween().to(1, { contentSize: size(0, 0) }, {
        onComplete: () => {
            isContentSizeTweenComplete2 = true;
        }
    }).call((target) => {
        expect(target === spUitrs).toBeTruthy();
    })

    // test begin
    tween(node)
        .to(1, { position: new Vec3(100, 100, 0) }, {
            onComplete: () => {
                isPositionTweenComplete = true;
            }
        })
        .call((target) => {
            expect(target === node).toBeTruthy();
        })
        .then(uiTransformTween1.clone(spUitrs))
        .then(uiTransformTween2.clone(spUitrs))
        .start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(spUitrs.contentSize.equals(new Size(0, 0)));
    expect(isPositionTweenComplete).toBeTruthy();
    expect(isContentSizeTweenComplete1).toBeFalsy();
    expect(isContentSizeTweenComplete2).toBeFalsy();

    // Do content size to tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(1.0/3.0*100, 1.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(2.0/3.0*100, 2.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(spUitrs.contentSize.equals(new Size(100, 100)));
    
    game.step();
    expect(isContentSizeTweenComplete1).toBeTruthy();

    // Do content size (0, 0) tween 
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(2.0/3.0*100, 2.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(1.0/3.0*100, 1.0/3.0*100)));

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(spUitrs.contentSize.equals(new Size(0, 0)));
    
    game.step();
    expect(isContentSizeTweenComplete2).toBeTruthy();

    // test end
    director.unregisterSystem(sys);
});

test('Test different target in re-target', function() {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const scene = new Scene('test');
    director.runSceneImmediate(scene);

    let canvasNode = new Node("Canvas");
    scene.addChild(canvasNode);
    let canvas = canvasNode.addComponent(Canvas) as Canvas;
    let uitrs = canvasNode.addComponent(UITransform) as UITransform;
    uitrs.contentSize = new Size(100, 100);

    const node = new Node();
    let spUitrs = node.addComponent(UITransform) as UITransform;
    spUitrs.contentSize = new Size(0, 0);
    scene.addChild(node);

    let isPositionTweenComplete = false;

    // test begin
    tween()
        .to(1, { position: new Vec3(100, 100, 0) }, {
            onComplete: () => {
                isPositionTweenComplete = true;
            }
        })
        .call((target) => {
            expect(target === node).toBeTruthy();
        })
        .target(node)
        .start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(isPositionTweenComplete).toBeTruthy();

    // test end
    director.unregisterSystem(sys);
});

test('Test different target in nest sequence 1', function() {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const scene = new Scene('test');
    director.runSceneImmediate(scene);

    let canvasNode = new Node("Canvas");
    scene.addChild(canvasNode);
    let canvas = canvasNode.addComponent(Canvas) as Canvas;
    let uitrs = canvasNode.addComponent(UITransform) as UITransform;
    uitrs.contentSize = new Size(100, 100);

    const node = new Node();
    node.setScale(0, 0, 0);
    let spUitrs = node.addComponent(UITransform) as UITransform;
    spUitrs.contentSize = new Size(100, 100);
    scene.addChild(node);

    let isPositionTweenComplete = false;
    let isScaleTweenComplete = false;

    // test begin
    tween(node)
        .to(1, { position: new Vec3(100, 100, 0) }, { // 1s
            onComplete: () => {
                isPositionTweenComplete = true;
            }
        })
        .sequence(
            tween().parallel(
                tween().sequence(
                    tween(node).to(1, { scale: new Vec3(10, 10, 10) }, {
                        onComplete(target) {
                            isScaleTweenComplete = true;
                        },
                    }), // 2s
                    tween(spUitrs).to(1, { contentSize: new Size(100, 100) }), // 3s
                    tween(node).to(1, { scale: new Vec3(0, 0, 0) })  // 4s
                ),
                tween(spUitrs).to(1, { contentSize: new Size(0, 0) }) // 2s
            ),
            tween(node).to(1, { angle: 90 }) // 5s
        )
        .call((target) => {
            expect(target === node).toBeTruthy();
        })
        .start();

    // 1s
    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(isPositionTweenComplete).toBeTruthy();

    // 2s
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(1.0/2.0*10, 1.0/2.0*10, 1.0/2.0*10))).toBeTruthy();
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy(); // 9.999999999999979, need to do a more step to make the action complete
    expect(spUitrs.contentSize.equals(new Size(0, 0)));
    game.step();
    expect(isScaleTweenComplete).toBeTruthy();
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy(); // 9.999999999999979, need to do a more step to make the action complete
    // 3s
    for (let i = 0; i < 59; ++i) { // We did an extra step above, so only 59 needed.
        game.step();
    }
    expect(spUitrs.contentSize.equals(new Size(100, 100)));
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();

    // 4s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();
    expect(node.angle).toBe(0);

    // 5s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(approx(node.angle, 90)).toBeTruthy();

    // test end
    director.unregisterSystem(sys);
});

test('Test different target in nest sequence 2', function() {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const scene = new Scene('test');
    director.runSceneImmediate(scene);

    let canvasNode = new Node("Canvas");
    scene.addChild(canvasNode);
    let canvas = canvasNode.addComponent(Canvas) as Canvas;
    let uitrs = canvasNode.addComponent(UITransform) as UITransform;
    uitrs.contentSize = new Size(100, 100);

    const node = new Node();
    node.setScale(0, 0, 0);
    let spUitrs = node.addComponent(UITransform) as UITransform;
    spUitrs.contentSize = new Size(0, 0);
    let uiOpacity = node.addComponent(UIOpacity) as UIOpacity;
    scene.addChild(node);

    let isPositionTweenComplete = false;
    let isScaleTweenComplete = false;
    let isContentSizeTweenComplete = false;

    // test begin
    tween(node)
        .parallel(
            tween().parallel(
                tween().parallel(
                    tween().parallel(
                        tween().parallel(
                            tween().parallel(
                                tween(node).to(1, { position: new Vec3(100, 100, 0) }, {
                                    onComplete: () => {
                                        isPositionTweenComplete = true;
                                    }
                                }).call((target) => {
                                    expect(target === node).toBeTruthy();
                                }),
                                tween(spUitrs).to(1, { contentSize: size(100, 100) }, {
                                    onComplete: (target?: UITransform): void => {
                                        isContentSizeTweenComplete = true;
                                    }
                                }).call((target) => {
                                    expect(target === spUitrs).toBeTruthy();
                                }),
                            ),
                            tween(uiOpacity).to(1, { opacity: 255 })
                        ),
                        tween(uiOpacity).to(1, { opacity: 0 })
                    ),
                    tween(uiOpacity).to(1, { opacity: 255 })
                ),
                tween(uiOpacity).to(1, { opacity: 0 })
            ),
            tween(uiOpacity).to(1, { opacity: 255 })
        )
        .start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();
    expect(approx(spUitrs.contentSize.width, 1.0/3.0*100)).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(approx(spUitrs.contentSize.width, 2.0/3.0*100)).toBeTruthy();

    // complete
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(approx(spUitrs.contentSize.width, 3.0/3.0*100)).toBeTruthy();

    expect(isPositionTweenComplete).toBeTruthy();;
    expect(isContentSizeTweenComplete).toBeTruthy();;

    // test end
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