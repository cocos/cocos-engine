import { UITransform } from "../../cocos/2d";
import { Node } from "../../cocos/scene-graph/node";
import { Rect, Size, Vec2, Vec3 } from "../../exports/base";

test('UI transform properties test', function () {
    const node = new Node();
    node.addComponent(UITransform);
    const uiTrans = node.getComponent(UITransform) as UITransform;
    expect(node._uiProps.uiTransformComp).toBe(uiTrans);
    // Default values
    expect(uiTrans.anchorX).toBe(0.5);
    expect(uiTrans.anchorY).toBe(0.5);
    expect(uiTrans.width).toBe(100);
    expect(uiTrans.height).toBe(100);
    expect(uiTrans.contentSize).toEqual(new Size(100, 100));
    expect(uiTrans.anchorPoint).toEqual(new Vec2(0.5, 0.5));
    // Set values
    uiTrans.width = 300;
    expect(uiTrans.width).toBe(300);
    uiTrans.height = 150;
    expect(uiTrans.height).toBe(150);
    expect(uiTrans.contentSize).toEqual(new Size(300, 150));
    uiTrans.contentSize = new Size(200, 100);
    expect(uiTrans.width).toBe(200);
    expect(uiTrans.height).toBe(100);
    uiTrans.anchorX = 0.1;
    expect(uiTrans.anchorX).toBe(0.1);
    uiTrans.anchorY = 1.5;
    expect(uiTrans.anchorY).toBe(1.5);
    expect(uiTrans.anchorPoint).toEqual(new Vec2(0.1, 1.5));
});

test('setContentSize', function () {
    const node = new Node();
    node.addComponent(UITransform);
    const uiTrans = node.getComponent(UITransform) as UITransform;
    uiTrans.setContentSize(150, 300.5);
    expect(uiTrans.contentSize).toEqual(new Size(150, 300.5));
    expect(uiTrans.width).toBe(150);
    expect(uiTrans.height).toBe(300.5);
});

test('setAnchorPoint', function () {
    const node = new Node();
    node.addComponent(UITransform);
    const uiTrans = node.getComponent(UITransform) as UITransform;
    uiTrans.setAnchorPoint(0.1, 1.5);
    expect(uiTrans.anchorPoint).toEqual(new Vec2(0.1, 1.5));
    expect(uiTrans.anchorX).toBe(0.1);
    expect(uiTrans.anchorY).toBe(1.5);
});

test('convertToNodeSpaceAR', function () {
    const node = new Node();
    node.addComponent(UITransform);
    const uiTrans = node.getComponent(UITransform) as UITransform;
    node.setPosition(50, 50);
    uiTrans.setContentSize(180, 180);
    expect(uiTrans.convertToNodeSpaceAR(new Vec3(0, 0, 0))).toEqual(new Vec3(-50, -50, 0));
    expect(uiTrans.convertToNodeSpaceAR(new Vec3(50, 50, 0))).toEqual(new Vec3(0, 0, 0));
    expect(uiTrans.convertToNodeSpaceAR(new Vec3(100, 100, 0))).toEqual(new Vec3(50, 50, 0));
});

test('getBoundingBox', function () {
    const node = new Node();
    node.addComponent(UITransform);
    const uiTrans = node.getComponent(UITransform) as UITransform;
    uiTrans.setContentSize(180, 180);
    expect(uiTrans.getBoundingBox()).toEqual(new Rect(-90, -90, 180, 180));
    // Change anchor point to 0.1, 0.6 and test bounding box again
    uiTrans.setAnchorPoint(0.1, 0.6);
    expect(uiTrans.getBoundingBox()).toEqual(new Rect(-18, -108, 180, 180));
    // Change position to 100.5, -10.5 and test bounding box again
    node.setPosition(100.5, -10.5);
    expect(uiTrans.getBoundingBox()).toEqual(new Rect(82.5, -118.5, 180, 180));
    // Change rotation to 45 degree and test bounding box again
    node.setRotationFromEuler(0, 0, 45);
    const bb = uiTrans.getBoundingBox();
    expect(bb.x).toBeCloseTo(36.86);
    expect(bb.y).toBeCloseTo(-99.6);
    expect(bb.width).toBeCloseTo(254.56);
    expect(bb.height).toBeCloseTo(254.56);
});

test('getBoundingBoxToWorld', function () {
    const node = new Node();
    node.addComponent(UITransform);
    const uiTrans = node.getComponent(UITransform) as UITransform;
    uiTrans.setContentSize(180, 180);
    expect(uiTrans.getBoundingBoxToWorld()).toEqual(new Rect(-90, -90, 180, 180));
    // Change anchor point to 0.1, 0.6 and test bounding box again
    uiTrans.setAnchorPoint(0.1, 0.6);
    expect(uiTrans.getBoundingBoxToWorld()).toEqual(new Rect(-18, -108, 180, 180));
    // Add parent node at 50, 50 and calculate bounding box again
    const parent = new Node();
    parent.setPosition(50, 50);
    parent.addChild(node);
    expect(uiTrans.getBoundingBoxToWorld()).toEqual(new Rect(32, -58, 180, 180));
    // Add a child node and calculate bounding box again
    const child = new Node();
    child.addComponent(UITransform);
    const childUITrans = child.getComponent(UITransform) as UITransform;
    childUITrans.setContentSize(300, 150);
    child.setPosition(50, 58);
    node.addChild(child);
    expect(uiTrans.getBoundingBoxToWorld()).toEqual(new Rect(-50, -58, 300, 241));
    // Add a child node at 1000, 1000 with zero sized UI transform should not affect bounding box
    const child2 = new Node();
    child2.addComponent(UITransform);
    child2.setPosition(1000, 1000);
    const child2UITrans = child2.getComponent(UITransform) as UITransform;
    child2UITrans.setContentSize(0, 0);
    node.addChild(child2);
    expect(uiTrans.getBoundingBoxToWorld()).toEqual(new Rect(-50, -58, 300, 241));
    // Rotate the Parent node by 45 degree and calculate bounding box again
    parent.setRotationFromEuler(0, 0, 45);
    const bb = uiTrans.getBoundingBoxToWorld();
    expect(bb.x).toBeCloseTo(-114.76);
    expect(bb.y).toBeCloseTo(-39.1);
    expect(bb.width).toBeCloseTo(355.67);
    expect(bb.height).toBeCloseTo(324.56);
});

// test getBoundingBoxTo with a target node's matrix as parameter
test('getBoundingBoxTo', function () {
    const node = new Node();
    node.addComponent(UITransform);
    const uiTrans = node.getComponent(UITransform) as UITransform;
    expect(uiTrans.getBoundingBoxToWorld()).toEqual(new Rect(-50, -50, 100, 100));

    // Create a target node at 50, 50
    const target = new Node();
    target.addComponent(UITransform);
    const targetUITrans = target.getComponent(UITransform) as UITransform;
    // Test getBoundingBoxTo with target node's matrix as parameter, the result should equal to the world bounding box
    expect(uiTrans.getBoundingBoxTo(target.worldMatrix)).toEqual(uiTrans.getBoundingBoxToWorld());

    target.setPosition(50, 50);
    expect(uiTrans.getBoundingBoxTo(target.worldMatrix)).toEqual(new Rect(-100, -100, 100, 100));
    // Change target node's anchor point to 0.1, 0.6 and test bounding box again
    targetUITrans.setAnchorPoint(0.1, 0.6);
    expect(uiTrans.getBoundingBoxTo(target.worldMatrix)).toEqual(new Rect(-100, -100, 100, 100));
    // Change target node's position to 100.5, -10.5 and test bounding box again
    target.setPosition(100.5, -10.5);
    expect(uiTrans.getBoundingBoxTo(target.worldMatrix)).toEqual(new Rect(-150.5, -39.5, 100, 100));
    // Add a child node at 1000, 1000 with zero sized UI transform should not affect bounding box
    const child = new Node();
    child.addComponent(UITransform);
    child.setPosition(1000, 1000);
    const childUITrans = child.getComponent(UITransform) as UITransform;
    childUITrans.setContentSize(0, 0);
    node.addChild(child);
    expect(uiTrans.getBoundingBoxTo(target.worldMatrix)).toEqual(new Rect(-150.5, -39.5, 100, 100));
    // Change target node's rotation to 60 degree and test bounding box again
    target.setRotationFromEuler(0, 0, 60);
    const bb = uiTrans.getBoundingBoxTo(target.worldMatrix);
    expect(bb.x).toBeCloseTo(-109.46);
    expect(bb.y).toBeCloseTo(23.98);
    expect(bb.width).toBeCloseTo(136.6);
    expect(bb.height).toBeCloseTo(136.6);
});