import { CacheMode, HorizontalTextAlignment, RichText, Sprite } from "../../cocos/2d/components";
import { Node } from "../../cocos/core/scene-graph/node";

test('label.string.setter', () => {
    let node = new Node();
    node.addComponent(RichText);
    let richtext = node.getComponent(RichText) as RichText;
    let childNode = new Node();
    childNode.addComponent(Sprite);
    childNode.parent = node;
    expect(node.children.length).toStrictEqual(1);

    node.active = false;
    node.active = true;
    expect(node.children.length).toStrictEqual(1);

    richtext.string = 'new rich text';
    expect(node.children.length).toStrictEqual(1);

    richtext.horizontalAlign = HorizontalTextAlignment.RIGHT;
    expect(node.children.length).toStrictEqual(1);

    richtext.fontSize = 20;
    expect(node.children.length).toStrictEqual(1);

    richtext.fontFamily = 'Arial';
    expect(node.children.length).toStrictEqual(1);

    richtext.useSystemFont = false;
    expect(node.children.length).toStrictEqual(1);

    richtext.cacheMode = CacheMode.CHAR;
    expect(node.children.length).toStrictEqual(1);

    richtext.maxWidth = 100;
    expect(node.children.length).toStrictEqual(1);

    richtext.lineHeight = 30;
    expect(node.children.length).toStrictEqual(1);
});