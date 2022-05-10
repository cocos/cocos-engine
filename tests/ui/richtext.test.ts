import { HtmlTextParser } from "../../cocos/2d";
import { CacheMode, HorizontalTextAlignment, RichText, Sprite } from "../../cocos/2d/components";
import { Node } from "../../cocos/core/scene-graph/node";

test('get-right-quotation-index', () => {
    const htmlTextParser = new HtmlTextParser();
    let node =new Node();
    node.addComponent(RichText);
    let richtext = node.getComponent(RichText) as RichText;

    richtext.string = "<img src='123' width=80 height=89 align=top offset=30,5 />";
    let rightQuot = htmlTextParser.getRightQuotationIndex(richtext.string);
    expect(rightQuot).toStrictEqual(13);
    
    richtext.string = "<img src=\"1 23\" width=80 height=89 align=top offset=30,5 />";
    rightQuot = htmlTextParser.getRightQuotationIndex(richtext.string);
    expect(rightQuot).toStrictEqual(14);
});

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