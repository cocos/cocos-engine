import { isLabeledStatement } from "typescript";
import { Label } from "../../cocos/2d/components";
import { Node } from "../../cocos/core/scene-graph/node";

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