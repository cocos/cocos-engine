import { Vec3, System, size, Size, approx, color, Color } from "../../cocos/core";
import { tween, Tween, TweenSystem } from "../../cocos/tween";
import { Node, Scene } from "../../cocos/scene-graph";
import { Component } from "../../cocos/scene-graph/component";
import { game, director } from "../../cocos/game";
import { UITransform } from "../../cocos/2d/framework/ui-transform";
import { Canvas } from "../../cocos/2d/framework/canvas";
import { Batcher2D } from "../../cocos/2d/renderer/batcher-2d";
import { UIOpacity } from "../../cocos/2d";
import { Sprite } from "../../cocos/2d";

function isSizeEqualTo(a: Size, b: Size) {
    return approx(a.width, b.width) && approx(a.height, b.height);
}

function runFrames(frames: number) {
    for (let i = 0; i < frames; ++i) {
        game.step();
    }
}

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
    const onDestroy = (comp as any).onDestroy = jest.fn(() => {});
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
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();
    expect(isPositionTweenComplete).toBeTruthy();
    expect(isContentSizeTweenComplete).toBeFalsy();

    // Do content size tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(2.0/3.0*100, 2.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(100, 100))).toBeTruthy();
    
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
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();
    expect(isPositionTweenComplete).toBeTruthy();
    expect(isContentSizeTweenComplete).toBeFalsy();

    // Do content size tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(2.0/3.0*100, 2.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(100, 100))).toBeTruthy();
    
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
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 0))).toBeTruthy();
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();
    expect(isPositionTweenComplete).toBeTruthy();
    expect(isContentSizeTweenComplete1).toBeFalsy();
    expect(isContentSizeTweenComplete2).toBeFalsy();

    // Do content size to tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(2.0/3.0*100, 2.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(100, 100))).toBeTruthy();
    
    game.step();
    expect(isContentSizeTweenComplete1).toBeTruthy();

    // Do content size (0, 0) tween 
    for (let i = 0; i < 19; ++i) { // We do an extra step above, so 19 here.
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(2.0/3.0*100, 2.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    // Float value is 99.99999999999977, it's approximately equal to 100 but doesn't reach,
    // so bellow we need to step once more to make the tween complete.
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();
    
    game.step();
    expect(isContentSizeTweenComplete2).toBeTruthy();

    // test end
    director.unregisterSystem(sys);
});

test('Test different target in clone2', function() {
    // @ts-expect-error
    director.root!._batcher = new Batcher2D(director.root!);

    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node1 = new Node();
    node1.setScale(0, 0, 0);
    const node2 = new Node();
    node2.setScale(0, 0, 0);
    const moveTween = tween(node1)
        .to(1, { position: new Vec3(100, 100, 0) })
        .tag(100)
        .start();

    // test begin
    moveTween
        .clone(node2)
        .to(1, { scale: new Vec3(10, 10, 10) })
        .tag(200)
        .start();

    // 1s
    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node1.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();
    expect(node1.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();
    
    expect(node2.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 0))).toBeTruthy();
    expect(node2.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node1.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(node1.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();
    
    expect(node2.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 0))).toBeTruthy();
    expect(node2.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node1.position.equals(new Vec3(3.0/3.0*100, 3.0/3.0*100, 0))).toBeTruthy();
    expect(node1.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();
    
    expect(node2.position.equals(new Vec3(3.0/3.0*100, 3.0/3.0*100, 0))).toBeTruthy();
    expect(node2.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();

    // 2s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node1.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();
    expect(node2.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();

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
                    tween(spUitrs).to(1, { contentSize: new Size(100, 100) }, {
                        onStart(target) {
                            expect(target === spUitrs).toBeTruthy();
                                                    },
                        onComplete(target) {
                            expect(target === spUitrs).toBeTruthy();
                        },
                    }).call((target?: UITransform)=>{
                        expect(target == spUitrs).toBeTruthy();
                    }), // 3s
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
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(0, 0))).toBeTruthy();

    game.step();
    expect(isScaleTweenComplete).toBeTruthy();
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy(); // 9.999999999999979, need to do a more step to make the action complete
    // 3s
    for (let i = 0; i < 59; ++i) { // We did an extra step above, so only 59 needed.
        game.step();
    }
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(100, 100))).toBeTruthy();
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

test('Test different target and union', function() {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    // test begin
    const rootTarget = { position: new Vec3() };
    const uiTransformTarget = { contentSize: new Size() };

    tween(rootTarget)
        .parallel(
            tween(rootTarget).by(1, { position: new Vec3(100, 100, 100) }, {
                onStart(target) {
                    expect(target === rootTarget).toBeTruthy();
                },
            }),
            tween(uiTransformTarget).by(1, { contentSize: new Size(100, 100) }, {
                onStart(target) {
                    expect(target === uiTransformTarget).toBeTruthy();
                },
            }),
        )
        .union()
        .start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(new Vec3(1.0/3.0*100, 1.0/3.0*100, 1.0/3.0*100).equals(rootTarget.position)).toBeTruthy();
    expect(isSizeEqualTo(uiTransformTarget.contentSize, new Size(1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }

    expect(new Vec3(2.0/3.0*100, 2.0/3.0*100, 2.0/3.0*100).equals(rootTarget.position)).toBeTruthy();
    expect(isSizeEqualTo(uiTransformTarget.contentSize, new Size(2.0/3.0*100, 2.0/3.0*100))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }

    expect(new Vec3(100, 100, 100).equals(rootTarget.position)).toBeTruthy();
    expect(isSizeEqualTo(uiTransformTarget.contentSize, new Size(100, 100))).toBeTruthy();
    
    // test end
    director.unregisterSystem(sys);
});

test('Test different target, union, repeat with embed tween', function() {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    // test begin
    const rootTarget = { position: new Vec3() };
    const uiTransformTarget = { contentSize: new Size() };

    const t = tween(rootTarget).parallel(
        tween(rootTarget).by(1, { position: new Vec3(100, 100, 100) }, {
            onStart(target) {
                expect(target === rootTarget).toBeTruthy();
            },
        }),
        tween(uiTransformTarget).by(1, { contentSize: new Size(100, 100) }, {
            onStart(target) {
                expect(target === uiTransformTarget).toBeTruthy();
            },
        }),
    ).union();

    tween(rootTarget).repeat(2, t).start();

    // The first step is from 0, so we need to add one more frame to make the action run to 1/3 time.
    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(new Vec3(1.0/3.0*100, 1.0/3.0*100, 1.0/3.0*100).equals(rootTarget.position)).toBeTruthy();
    expect(isSizeEqualTo(uiTransformTarget.contentSize, new Size(1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

    // 2/3 time
    for (let i = 0; i < 20; ++i) {
        game.step();
    }

    expect(new Vec3(2.0/3.0*100, 2.0/3.0*100, 2.0/3.0*100).equals(rootTarget.position)).toBeTruthy();
    expect(isSizeEqualTo(uiTransformTarget.contentSize, new Size(2.0/3.0*100, 2.0/3.0*100))).toBeTruthy();

    // complete position tween
    for (let i = 0; i < 20; ++i) {
        game.step();
    }

    expect(new Vec3(100, 100, 100).equals(rootTarget.position)).toBeTruthy();
    expect(isSizeEqualTo(uiTransformTarget.contentSize, new Size(100, 100))).toBeTruthy();

    // 2s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(new Vec3(200, 200, 200).equals(rootTarget.position)).toBeTruthy();
    expect(isSizeEqualTo(uiTransformTarget.contentSize, new Size(200, 200))).toBeTruthy();
    
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
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

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
    expect(isSizeEqualTo(spUitrs.contentSize, new Size(100, 100))).toBeTruthy();

    expect(isPositionTweenComplete).toBeTruthy();;
    expect(isContentSizeTweenComplete).toBeTruthy();;

    // test end
    director.unregisterSystem(sys);
});

test('Test one action in sequence and parallel', function() {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    let completed = false;
    const target = { color: [255, 255, 255, 255] };

    const subTween1 = tween(target).to(1, { color: [0, 0, 0, 0] }, {
        onStart(t?: typeof target) {
            expect(t === target).toBeTruthy();
        },
        onComplete(t?: typeof target): void {
            if (!t) return;
            expect(t.color[0]).toBe(0);
            expect(t.color[1]).toBe(0);
            expect(t.color[2]).toBe(0);
            expect(t.color[3]).toBe(0);
            completed = true;
        },
    });
    const subTweenArray1 = [subTween1];

    tween({})
        .sequence(...subTweenArray1)
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }
    expect(completed).toBeTruthy();
    expect(subTweenArray1.length === 1);

    const subTween2 = tween(target).to(1, { color: [255, 255, 255, 255] }, {
        onStart(t?: typeof target) {
            expect(t === target).toBeTruthy();
        },
        onComplete(t?: typeof target): void {
            if (!t) return;
            expect(t.color[0]).toBe(255);
            expect(t.color[1]).toBe(255);
            expect(t.color[2]).toBe(255);
            expect(t.color[3]).toBe(255);
            completed = true;
        },
    });
    const subTweenArray2 = [subTween2];

    completed = false;
    tween({})
        .parallel(...subTweenArray2)
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }
    expect(completed).toBeTruthy();

    director.unregisterSystem(sys);
});

test('Test empty action in sequence and parallel', function() {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    tween({})
        .sequence()
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }
    tween({})
        .parallel()
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }

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
    const props = action._props;
    for (const property in props) {
        const prop = props[property];
        expect(Vec3.equals(prop.current, target)).toBeTruthy();
    }

    director.unregisterSystem(sys);
});

test('reverseTime', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    let completed = false;
    const node = new Node();
    tween(node)
        .to(1, { position: new Vec3(100, 100, 100) }, {
            onStart(target?: Node) {
                if (!target) return;
                expect(target.position.equals(new Vec3(100, 100, 100)));
            },
            onComplete() {
                completed = true;    
            },
        })
        .reverseTime()
        .start()

    for (let i = 0; i < 21; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(2.0/3.0*100, 2.0/3.0*100, 2.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(1.0/3.0*100, 1.0/3.0*100, 1.0/3.0*100))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();
    expect(completed).toBeTruthy();

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
    const t = tween(node.getComponent(Sprite) as Sprite)
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

    // Pass 2/3 time, 255 get 89 remain: 255 * (1 - 2/3 + 1/60) = 89.24 ≈ 89
    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(sprite.color.equals(color(89, 89, 89, 89))).toBeTruthy();

    // Pass the whole time, 255 get 4 remain: 255 * (1 - 1 + 1/60) = 4.25 ≈ 4
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

test('reverse()', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node).by(1, { position: new Vec3(100, 0, 0) }).reverse();

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .then(t)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(150, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse(t) 1', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node).by(1, { position: new Vec3(100, 0, 0) });

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .reverse(t)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(150, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse(t) 2', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node)
        .by(0.5, { position: new Vec3(50, 0, 0) })
        .by(0.5, { position: new Vec3(50, 0, 0) });

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .reverse(t)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(150, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse(t, -1) not found id', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node).by(1, { position: new Vec3(100, 0, 0) });

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .reverse(t, -1)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    // reverse(t, -1) failed, so the position will not be changed.
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse(t, -1) found id -1', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node).by(1, { position: new Vec3(100, 0, 0) }).id(-1);

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .reverse(t, -1)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(150, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});


test('reverse action in tween with id 1', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node)
        .by(1, { position: new Vec3(100, 0, 0) }).id(123)
        .to(1, { position: new Vec3(1000, 0, 0) });

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .reverse(t, 123)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(150, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse action in tween with id 2', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node)
        .parallel(
            tween(node).sequence(
                tween(node).by(1, { position: new Vec3(100, 0, 0) }).id(123),
                tween(node).to(1, { position: new Vec3(1000, 0, 0) }),
            ),
            tween(node).delay(1),
        )
        

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .reverse(t, 123)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(150, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse cloned action in tween with id', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node)
        .by(1, { position: new Vec3(100, 0, 0) }).id(123)
        .to(1, { position: new Vec3(1000, 0, 0) })
        .clone();

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) })
        .reverse(t, 123)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(150, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse action in current tween with id', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    tween(node)
        .to(1, { scale: new Vec3(10, 10, 10) })
        .by(1, { position: new Vec3(200, 0, 0) }).id(123)
        .delay(1)
        .reverse(123)
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();
    
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    // delay 1s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }

    //
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('reverse unsupported action', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    const t = tween(node).to(1, { position: new Vec3(100, 0, 0) }).reverse();
    const t2 = tween(node)
        .to(1, { position: new Vec3(100, 0, 0) }).id(456)
        .by(1, { position: new Vec3(100, 0, 0) });

    tween(node)
        .to(1, { position: new Vec3(200, 0, 0) }).id(123)
        .then(t)
        .reverse(123)
        .reverse(t2, 456)
        .start();
    
    for (let i = 0; i < 31; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    for (let j = 0; j < 2; ++j) {
        for (let i = 0; i < 30; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

        for (let i = 0; i < 30; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();
    }

    director.unregisterSystem(sys);
});

test('reverse sequence with call', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    const result = [0, 0, 0, 0];
    let index = 0;

    const t = tween(node)
        .call((target?: Node, data?: number)=>{
            if (target === undefined || data === undefined) 
                return;

            expect(node === target).toBeTruthy();
            expect(data === 300).toBeTruthy();
            result[index] = 300;
            ++index;
        }, null, 300)
        .by(1, { position: new Vec3(100, 0, 0) })
        .call((target?: Node, data?: number)=>{
            if (target === undefined || data === undefined) 
                return;

            expect(node === target).toBeTruthy();
            expect(data === 400).toBeTruthy();
            result[index] = 400;
            ++index;
        }, null, 400)
        .delay(1)
    ;

    tween(node)
        .then(t)
        .then(t.reverse())
        .start();
    

    game.step();
    expect(result[0]).toStrictEqual(300);
    expect(result[1]).toStrictEqual(0);
    expect(result[2]).toStrictEqual(0);
    expect(result[3]).toStrictEqual(0);


    // --->
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(50, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    expect(result[0]).toStrictEqual(300);
    expect(result[1]).toStrictEqual(400);
    expect(result[2]).toStrictEqual(0);
    expect(result[3]).toStrictEqual(0);

    // delay 2s
    for (let i = 0; i < 120; ++i) {
        game.step();
    }

    expect(result[0]).toStrictEqual(300);
    expect(result[1]).toStrictEqual(400);
    expect(result[2]).toStrictEqual(0);
    expect(result[3]).toStrictEqual(0);

    // <---
    for (let i = 0; i < 30; ++i) {
        game.step();
        if (index === 0) {
            expect(result[0]).toStrictEqual(300);
            expect(result[1]).toStrictEqual(400);
            expect(result[2]).toStrictEqual(400);
            expect(result[3]).toStrictEqual(0);
        }
    }
    expect(node.position.equals(new Vec3(50, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();

    // Make one more step to make the call invoked.
    game.step();
    
    expect(result[0]).toStrictEqual(300);
    expect(result[1]).toStrictEqual(400);
    expect(result[2]).toStrictEqual(400);
    expect(result[3]).toStrictEqual(300);

    expect(result.length === 4).toBeTruthy();

    director.unregisterSystem(sys);
});

test('union from id', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    tween(node)
        .to(1, { scale: new Vec3(10, 10, 10) })
        .by(1, { position: new Vec3(200, 0, 0) }).id(123)
        .delay(1)
        .reverse(123)
        .union(123)
        .repeat(3)
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();
    
    for (let j = 0; j < 3; ++j) {
        for (let i = 0; i < 30; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

        for (let i = 0; i < 30; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

        // delay 1s
        for (let i = 0; i < 60; ++i) {
            game.step();
        }

        //
        for (let i = 0; i < 30; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

        for (let i = 0; i < 30; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();
    }

    director.unregisterSystem(sys);
});

test('union from id (-1) not found', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    tween(node)
        .to(1, { scale: new Vec3(10, 10, 10) })
        .by(1, { position: new Vec3(200, 0, 0) }).id(123)
        .delay(1)
        .reverse(123)
        .union(-1)
        .repeat(2)
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();
    
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    // delay 1s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }

    //
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();

    // reverse(123) again since union failed!
    //
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(-100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(-200, 0, 0))).toBeTruthy();


    director.unregisterSystem(sys);
});

test('union from id (-1) found', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    tween(node)
        .to(1, { scale: new Vec3(10, 10, 10) })
        .call(()=>{}).id(-1)
        .by(1, { position: new Vec3(200, 0, 0) }).id(123)
        .delay(1)
        .reverse(123)
        .union(-1)
        .repeat(2)
        .start();

    for (let i = 0; i < 61; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();
    
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    // delay 1s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }

    //
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();

    // time 2
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(200, 0, 0))).toBeTruthy();

    // delay 1s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 0, 0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();


    director.unregisterSystem(sys);
});


test('timeScale test 1', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();

    tween(node)
        .to(1, { position: new Vec3(100, 100, 100) })
        .timeScale(0.5)
        .start();

    // Start
    game.step();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(25, 25, 25))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(50, 50, 50))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(75, 75, 75))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 100))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('timeScale test 2', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    node.setScale(0, 0, 0);

    const tPosition = tween(node).by(1, { position: new Vec3(100, 100, 100) });
    const tScale = tween(node).by(1, { scale: new Vec3(10, 10, 10) });

    tween(node)
        .then(tPosition)
        .then(tScale)
        .timeScale(0.5)
        .parallel(
            tPosition.reverse(),
            tScale.reverse(),
        )
        .sequence(
            tPosition.clone(),
            tScale.clone(),
        )
        .start();

    // Start
    game.step();

    // position
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(25, 25, 25))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(50, 50, 50))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(75, 75, 75))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 100))).toBeTruthy();

    // scale
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(2.5, 2.5, 2.5))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(5.0, 5.0, 5.0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(7.5, 7.5, 7.5))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();

    // parallel
    for (let i = 0; i < 120; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();
    expect(node.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();

    // .sequence
    // position
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(25, 25, 25))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(50, 50, 50))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(75, 75, 75))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 100))).toBeTruthy();

    // scale
    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(2.5, 2.5, 2.5))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(5.0, 5.0, 5.0))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(7.5, 7.5, 7.5))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.scale.equals(new Vec3(10, 10, 10))).toBeTruthy();

    director.unregisterSystem(sys);
});

test('timeScale * timeScale', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    node.setScale(0, 0, 0);

    let done = false;

    const t1 = tween(node)
        .parallel(
            tween(node)
                .by(1, { position: new Vec3(100, 100, 100) })
                .by(1, { position: new Vec3(100, 100, 100) }),
            tween(node)
                .by(1, { scale: new Vec3(2, 2, 2) })
                .delay(1)
        )
        .timeScale(0.5)
        .reverse();

    tween(node)
        .to(1, { position: new Vec3(100, 100, 100) })
        .then(t1)
        .timeScale(0.5)
        .call(()=>{
            done = true;
        })
        .start();

    // Start
    game.step();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(25, 25, 25))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(50, 50, 50))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(75, 75, 75))).toBeTruthy();

    for (let i = 0; i < 30; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(100, 100, 100))).toBeTruthy();

    // 4s = 1s / (0.5 * 0.5), scale action will run after 4s
    expect(node.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();
    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(75, 75, 75))).toBeTruthy();

    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(50, 50, 50))).toBeTruthy();

    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(25, 25, 25))).toBeTruthy();

    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();
    expect(node.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();

    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(-25, -25, -25))).toBeTruthy();
    expect(node.scale.equals(new Vec3(-0.5, -0.5, -0.5))).toBeTruthy();

    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(-50, -50, -50))).toBeTruthy();
    expect(node.scale.equals(new Vec3(-1.0, -1.0, -1.0))).toBeTruthy();

    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(-75, -75, -75))).toBeTruthy();
    expect(node.scale.equals(new Vec3(-1.5, -1.5, -1.5))).toBeTruthy();

    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(-100, -100, -100))).toBeTruthy();
    expect(node.scale.equals(new Vec3(-2, -2, -2))).toBeTruthy();
    
    game.step(); // once more
    expect(done).toBeTruthy();

    director.unregisterSystem(sys);
});

test('timeScale * timeScale * timeScale', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    node.setScale(0, 0, 0);

    const t1 = tween(node).by(0.0166666666666666 * 80, { position: new Vec3(800, 0, 0) }).timeScale(2)
    const t2 = tween(node).then(t1).timeScale(2);

    let done = false;
    tween(node).then(t2).timeScale(2).call(()=> { done = true } ).start();
    
    game.step();

    for (let i = 0; i < 5; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(400, 0, 0))).toBeTruthy();

    for (let i = 0; i < 5; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(800, 0, 0))).toBeTruthy();
    expect(done).toBeTruthy();

    director.unregisterSystem(sys);
});

test('timeScale negative value', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    node.setScale(0, 0, 0);

    let done = false;
    const t = tween(node).by(1, { position: new Vec3(90, 0, 0) }).call(()=>done = true);

    t.start();
    
    game.step();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(30, 0, 0))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(60, 0, 0))).toBeTruthy();

    t.timeScale(-1);

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(30, 0, 0))).toBeTruthy();

    t.timeScale(0.5);

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(45, 0, 0))).toBeTruthy();

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(60, 0, 0))).toBeTruthy();

    t.timeScale(1);

    for (let i = 0; i < 20; ++i) {
        game.step();
    }
    expect(node.position.equals(new Vec3(90, 0, 0))).toBeTruthy();

    expect(done).toBeTruthy();

    director.unregisterSystem(sys);
});

test('duration', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);

    const node = new Node();
    node.setScale(0, 0, 0);

    const t = tween(node)
        .to(1, { position: new Vec3(100, 0, 0) })
        .parallel(
            tween(node).to(1, { scale: new Vec3(10, 0, 0) }),
            tween(node).to(1, { eulerAngles: new Vec3(0, 0, 10) }),
        )
        .then(tween(node).by(2, { position: new Vec3(-10, 0, 0) })).id(123)
        .reverse(123)
        .start();

    expect(t.duration).toBe(6);

    director.unregisterSystem(sys);
});

test('repeat', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);
    //
    const node = new Node();
    node.setScale(0, 0, 0);
    const zoomIn = tween(node).by(1, { scale: new Vec3(10, 10, 10) });
    const zoomOut = tween(node).by(1, { scale: new Vec3(-10, -10, -10) });
    let complete = false;
    tween(node)
        .delay(1)
        .then(zoomIn).id(123) // 1s
        .then(zoomOut) // 2s
        .call(()=>{
                console.log(`Finish one!`);
        })
        .union(123)
        .repeat(3) // 6s
        .call(()=>{
            complete = true;
        })
        .start();

    // delay 1s
    for (let i = 0; i < 60; ++i) {
        game.step();
    }
    // start
    game.step();

    for (let i = 0; i < 3; ++i) {
        // 1
        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.scale.equals(new Vec3(1.0/3.0*10, 1.0/3.0*10, 1.0/3.0*10))).toBeTruthy();

        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.scale.equals(new Vec3(2.0/3.0*10, 2.0/3.0*10, 2.0/3.0*10))).toBeTruthy();

        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.scale.equals(new Vec3(3.0/3.0*10, 3.0/3.0*10, 3.0/3.0*10))).toBeTruthy();

        // 2
        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.scale.equals(new Vec3(2.0/3.0*10, 2.0/3.0*10, 2.0/3.0*10))).toBeTruthy();

        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.scale.equals(new Vec3(1.0/3.0*10, 1.0/3.0*10, 1.0/3.0*10))).toBeTruthy();

        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.scale.equals(new Vec3(0, 0, 0))).toBeTruthy();

        if (i === 2) {
            game.step();
            expect(complete).toBeTruthy();
        } else {
            expect(complete).toBeFalsy();
        }
    }

    director.unregisterSystem(sys);
});

test('repeatForever with > 1 actions in tween', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);
    //
    
    const node = new Node();
    node.setScale(0, 0, 0);

    tween(node)
        .delay(2)
        .call(()=>{})
        .delay(2)
        .call(()=>{})
        .by(1, { position: new Vec3(100, 0, 0) }).id(123)
        .reverse(123)
        .union(123)
        .repeatForever()
        .start();
    
    for (let i = 0; i < 60 * 4; ++i) {
        game.step();
    }

    // start
    game.step();
    for (let i = 0; i < 10; ++i) {
        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(1.0/3.0*100, 0, 0))).toBeTruthy();

        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(2.0/3.0*100, 0, 0))).toBeTruthy();

        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(3.0/3.0*100, 0, 0))).toBeTruthy();

        //
        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(2.0/3.0*100, 0, 0))).toBeTruthy();

        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(1.0/3.0*100, 0, 0))).toBeTruthy();
        
        for (let i = 0; i < 20; ++i) {
            game.step();
        }
        expect(node.position.equals(new Vec3(0, 0, 0))).toBeTruthy();
    }

    //
    director.unregisterSystem(sys);
});

test('repeatForever', function () {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);
    //
    
    const node = new Node();
    
    tween(node)
        .by(1, { position: new Vec3(90, 0, 0) }).id(123)
        .reverse(123)
        .union()
        .repeatForever()
        .start();

    // start
    runFrames(1);

    runFrames(20);
    expect(node.position.equals(new Vec3(30, 0, 0))).toBeTruthy();

    //
    director.unregisterSystem(sys);
});