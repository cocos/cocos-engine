import { Component } from "../../cocos/scene-graph/component";
import { game, director } from "../../cocos/game";
import { Scene } from "../../cocos/scene-graph/scene";
import { Node } from "../../cocos/scene-graph/node";

test('persist node with dynamic scene', function () {
    var oldScene = new Scene('');
    director.runSceneImmediate(oldScene);

    var globalNode = new Node();
    globalNode.setParent(oldScene);
    var childNode = new Node();
    childNode.parent = globalNode;

    director.addPersistRootNode(globalNode);

    var newScene = new Scene('');
    director.runSceneImmediate(newScene);

    expect(globalNode.parent).toBe(newScene);
});

test('persist node should replace existing node in scene', function () {
    var oldNode = new Node();
    oldNode.parent = director.getScene();
    director.addPersistRootNode(oldNode);
    oldNode.setSiblingIndex(0);

    var newScene = new Scene('');
    newScene._id = oldNode.parent.uuid;
    newScene.addChild(new Node());
    newScene.addChild(new Node());
    var newNode = new Node();
    newNode._id = oldNode.uuid;
    newScene.insertChild(newNode, 1);

    director.runSceneImmediate(newScene);

    expect(oldNode.parent).toBe(newScene);
    expect(oldNode.getSiblingIndex()).toBe(1);
    expect(newNode.parent).toBe(null);

    game.step(); // ensure sgNode sorted
});

test('lifecycle methods of persist node and replaced node', function () {
    var oldNode = new Node();
    var oldComp = oldNode.addComponent(Component);
    oldComp.onLoad = jest.fn(() => {});
    oldComp.start = jest.fn(() => {});
    oldComp.onDestroy = jest.fn(() => {});
    oldComp.onDisable = jest.fn(() => {});
    oldComp.onEnable = jest.fn(() => {});

    oldNode.parent = director.getScene();
    director.addPersistRootNode(oldNode);
    game.step();
    expect(oldComp.onLoad).toBeCalledTimes(1);
    expect(oldComp.start).toBeCalledTimes(1);
    expect(oldComp.onDestroy).toBeCalledTimes(0);
    expect(oldComp.onEnable).toBeCalledTimes(1);

    var newScene = new Scene('');
    var newNode = new Node();
    newNode._id = oldNode.uuid;
    newNode.parent = newScene;
    newScene._id = director.getScene().uuid;
    var newComp = newNode.addComponent(Component);
    const onLoad = newComp.onLoad = jest.fn(() => {});
    const start = newComp.start = jest.fn(() => {});
    const onEnable = newComp.onEnable = jest.fn(() => {});
    const onDisable = newComp.onDisable = jest.fn(() => {});
    const onDestroy = newComp.onDestroy = jest.fn(() => {});
    const update = newComp.update = jest.fn(() => {});

    director.runSceneImmediate(newScene);
    game.step();
    game.step();
    expect(onLoad).toBeCalledTimes(0);
    expect(start).toBeCalledTimes(0);
    expect(onEnable).toBeCalledTimes(0);
    expect(onDisable).toBeCalledTimes(0);
    expect(onEnable).toBeCalledTimes(0);
    expect(onDestroy).toBeCalledTimes(0);
    expect(update).toBeCalledTimes(0);
    expect(oldComp.onLoad).toBeCalledTimes(1);
    expect(oldComp.start).toBeCalledTimes(1);
    expect(oldComp.onEnable).toBeCalledTimes(2);
    expect(oldComp.onDisable).toBeCalledTimes(1);
});
