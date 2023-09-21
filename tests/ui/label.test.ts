import { Label, LabelOutline, LabelShadow } from "../../cocos/2d/components";
import { Node } from "../../cocos/scene-graph/node";
import { Color, Vec2 } from "../../exports/base";

test('label.string.setter', () => {
    let node = new Node();
    node.addComponent(Label);
    let label = node.getComponent(Label) as Label;

    label.string = 'abc';
    expect(label.string).toStrictEqual('abc');
    label.string = '1';
    expect(label.string).toStrictEqual('1');
    label.string = '0';
    expect(label.string).toStrictEqual('0');
    
    label.string = null;
    expect(label.string).toStrictEqual('');
    label.string = undefined;
    expect(label.string).toStrictEqual('');
    label.string = true;
    expect(label.string).toStrictEqual('true');
    label.string = false;
    expect(label.string).toStrictEqual('false');
    label.string = 1;
    expect(label.string).toStrictEqual('1');
    label.string = 0;
    expect(label.string).toStrictEqual('0');
});

test('labelOutline.setter', () => {
    let node = new Node();
    node.addComponent(Label);
    let label = node.getComponent(Label) as Label;

    node.addComponent(LabelOutline);
    let labelOutline = node.getComponent(LabelOutline) as LabelOutline;
    node._setActiveInHierarchy(true);
    labelOutline.onEnable();
    expect(label.enableOutline).toStrictEqual(true);
    labelOutline.color = new Color(255, 0, 0, 255);
    expect(label.outlineColor).toStrictEqual(new Color(255, 0, 0, 255));
    labelOutline.width = 2;
    expect(label.outlineWidth).toStrictEqual(2);
    labelOutline.enabled = false;
    labelOutline.onDisable();
    expect(label.enableOutline).toStrictEqual(false);
    labelOutline.enabled = true;
    labelOutline.onEnable();
    expect(label.enableOutline).toStrictEqual(true);
});

test('labelShadow.setter', () => {
    let node = new Node();
    node.addComponent(Label);
    let label = node.getComponent(Label) as Label;

    node.addComponent(LabelShadow);
    let labelShadow = node.getComponent(LabelShadow) as LabelShadow;
    node._setActiveInHierarchy(true);
    labelShadow.onEnable();
    expect(label.enableShadow).toStrictEqual(true);
    labelShadow.color = new Color(255, 0, 0, 255);
    expect(label.shadowColor).toStrictEqual(new Color(255, 0, 0, 255));
    labelShadow.offset = new Vec2(2, 2);
    expect(label.shadowOffset).toStrictEqual(new Vec2(2, 2));
    labelShadow.blur = 2;
    expect(label.shadowBlur).toStrictEqual(2);
    labelShadow.enabled = false;
    labelShadow.onDisable();
    expect(label.enableShadow).toStrictEqual(false);
    labelShadow.enabled = true;
    labelShadow.onEnable();
    expect(label.enableShadow).toStrictEqual(true);
});