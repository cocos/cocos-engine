import { HtmlTextParser } from "../../cocos/2d";
import { CacheMode, HorizontalTextAlignment, RichText, Sprite } from "../../cocos/2d/components";
import { Node } from "../../cocos/core/scene-graph/node";

test('get-right-quotation-index', () => {
    const imageAttrReg = /(\s)*src(\s)*=|(\s)*height(\s)*=|(\s)*width(\s)*=|(\s)*align(\s)*=|(\s)*offset(\s)*=|(\s)*click(\s)*=|(\s)*param(\s)*=/;
    
    const htmlTextParser = new HtmlTextParser();
    let node =new Node();
    node.addComponent(RichText);
    let richtext = node.getComponent(RichText) as RichText;
    
    let tagName = '';
    let attribute = "img src='1 23' width=80 height=89 align=top /";
    richtext.string = attribute;

    let header = /^(img(\s)*src(\s)*=[^>]+\/)/.exec(attribute);
    let remainingArgument = '';
    let rightQuot = -1;
    let nextSpace = 0;
    if (header && header[0].length > 0) {
        tagName = header[0].trim();
        if (tagName.startsWith('img') && tagName[tagName.length - 1] === '/') {
            header = imageAttrReg.exec(attribute);
            let tagValue;
            let isValidImageTag = false;
            while (header) {
                // skip the invalid tags at first
                attribute = attribute.substring(attribute.indexOf(header[0]));
                tagName = attribute.substr(0, header[0].length);
                // remove space and = character
                remainingArgument = attribute.substring(tagName.length).trim();

                rightQuot = htmlTextParser.getRightQuotationIndex(remainingArgument);

                nextSpace = remainingArgument.indexOf(' ', rightQuot + 1 >= remainingArgument.length ? -1 : rightQuot + 1);

                tagValue = (nextSpace > -1) ? remainingArgument.substr(0, nextSpace) : remainingArgument;
                tagName = tagName.replace(/[^a-zA-Z]/g, '').trim();
                tagName = tagName.toLowerCase();

                attribute = remainingArgument.substring(nextSpace).trim();
                if (tagValue.endsWith('/')) tagValue = tagValue.slice(0, -1);
                if (tagName === 'src') {
                    switch (tagValue.charCodeAt(0)) {
                        case 34: // "
                        case 39: // '
                            isValidImageTag = true;
                            tagValue = tagValue.slice(1, -1);
                            expect(tagValue).toStrictEqual('1 23');
                            break;
                        default:
                            break;
                    }
                } else if (tagName === 'height') {
                    expect(tagValue).toStrictEqual('89');
                } else if (tagName === 'width') {
                    expect(tagValue).toStrictEqual('80');
                } else if (tagName === 'align') {
                    switch (tagValue.charCodeAt(0)) {
                        case 34: // "
                        case 39: // '
                            tagValue = tagValue.slice(1, -1);
                            break;
                        default:
                            break;
      
                }
                const alignStr = tagValue.toLowerCase();
                expect(alignStr).toStrictEqual('top');
                } else if (tagName === 'offset') {
    
                }
                header = imageAttrReg.exec(attribute);
            }
        }
    }
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